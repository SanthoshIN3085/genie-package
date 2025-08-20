/// importing react and other libraries
import React, { useState, useEffect, useRef, useCallback } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import * as genieIcons from "../../assets/genieIcons";
import { useDispatch, useSelector } from "react-redux";
import {
  updateChat,
  updateSpeech,
  updateSearch,
  updateUI,
} from "Reducers/genie/reducer";
import {
  systemPhrases,
  filterProfanity,
  containsProfanity,
  containsOpenKeywords,
  containsCloseKeywords,
  containsAnalysisKeywords,
} from "../command.js";
import { Howl, Howler } from "howler";
import { lowerCase } from "lodash";

/**
 * WakeupComponent - Always listening for wakeup commands
 *
 * Behavior:
 * 1. Always starts listening when component mounts
 * 2. Stops listening when VoiceRecognition starts (inputVoiceSearch = true)
 * 3. Resumes listening when VoiceRecognition stops (inputVoiceSearch = false)
 * 4. Handles visibility changes to pause/resume listening
 * 5. Processes wakeup, close, and analysis keywords
 * 6. Manages audio playback using Howler.js
 * 7. Handles speech recognition state management
 *
 * @param {Object} props - Component props
 * @param {Function} props.setShowHome - Function to show home page
 * @param {Function} props.handleGenieClose - Function to close Genie
 * @param {Function} props.handleNewChat - Function to start new chat
 * @param {Function} props.handleVoiceSearch - Function to start voice search
 * @param {boolean} props.showHome - Whether home page is currently shown
 * @returns {JSX.Element} Empty fragment (invisible component)
 */
const WakeupComponent = ({
  setShowHome = () => {},
  handleGenieClose = () => {},
  handleNewChat = () => {},
  handleVoiceSearch = () => {},
  onFormSubmit = () => {},
  handleManualSubmission = () => {},
  showHome = false,
}) => {
  const dispatch = useDispatch();
  const { speech, ui, search } = useSelector((state) => state.genie);
  const { wakeup, inputVoiceSearch, isVoiceMode } = speech || {};
  const { searchInput } = search || {};
  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [hasBeenWoken, setHasBeenWoken] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [awaitingNextCommand, setAwaitingNextCommand] = useState(false);
  const [awaitingProceedResponse, setAwaitingProceedResponse] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [analysisAutoSubmitTimer, setAnalysisAutoSubmitTimer] = useState(null);
  const [originalAnalysisTranscript, setOriginalAnalysisTranscript] =
    useState("");
  const silenceTimeout = useRef(null);
  const accumulatedTranscript = useRef("");
  const isSpeakingRef = useRef(false);
  const audioInstances = useRef({});
  const isPlayingRef = useRef(false);
  const isStartingRecognition = useRef(false);

  /**
   * Memoized function to update speech state in Redux
   * @param {Object} data - Speech state data to update
   */
  const updateSpeechState = useCallback(
    (data) => dispatch(updateSpeech(data)),
    [dispatch]
  );

  /**
   * Memoized function to update UI state in Redux
   * @param {Object} data - UI state data to update
   */
  const updateUIState = useCallback(
    (data) => dispatch(updateUI(data)),
    [dispatch]
  );

  /**
   * Memoized function to update chat state in Redux
   * @param {Object} data - Chat state data to update
   */
  const updateChatState = useCallback(
    (data) => dispatch(updateChat(data)),
    [dispatch]
  );

  /**
   * Memoized function to update search state in Redux
   * @param {Object} data - Search state data to update
   */
  const updateSearchState = useCallback(
    (data) => dispatch(updateSearch(data)),
    [dispatch]
  );

  // Initialize Howler audio instances for all audio files
  useEffect(() => {
    const initAudio = () => {
      try {
        if (audioInitialized) {
          return;
        }

        // Check if we're already at the audio pool limit
        if (Object.keys(audioInstances.current).length >= 8) {
          console.warn(
            "Audio pool limit reached, cleaning up before reinitializing"
          );
          cleanupAudioInstances();
        }

        // Clear any existing instances first
        if (Object.keys(audioInstances.current).length > 0) {
          Object.values(audioInstances.current).forEach((howl) => {
            if (howl && typeof howl.stop === "function") {
              howl.stop();
            }
          });
          audioInstances.current = {};
        }

        // Initialize all audio files
        const audioFiles = {
          whatCanDo: genieIcons?.whatCanDoAudio,
          ok: genieIcons?.okAudio,
          sure: genieIcons?.sureAudio,
          couldNotAssist: genieIcons?.couldNotAssistAudio,
          closingNow: genieIcons?.closingNowAudio,
        };

        // Create Howl instances for each audio file with better error handling
        Object.entries(audioFiles).forEach(([key, audioFile]) => {
          if (audioFile) {
            try {
              audioInstances.current[key] = new Howl({
                src: [audioFile],
                html5: true,
                preload: false,
                onloaderror: (id, error) => {
                  console.error(`Audio load error for ${key}:`, error);
                },
                onplay: () => {
                  isPlayingRef.current = true;
                  isSpeakingRef.current = true;
                },
                onend: () => {
                  isPlayingRef.current = false;
                  isSpeakingRef.current = false;
                  // Resume speech recognition after audio finishes
                  if (
                    document.visibilityState === "visible" &&
                    !inputVoiceSearch
                  ) {
                    startRecognition();
                  }
                },
                onstop: () => {
                  isPlayingRef.current = false;
                  isSpeakingRef.current = false;
                  // Resume speech recognition after audio stops
                  if (
                    document.visibilityState === "visible" &&
                    !inputVoiceSearch
                  ) {
                    startRecognition();
                  }
                },
                onerror: (id, error) => {
                  console.error(`Audio error for ${key}:`, error);
                  isPlayingRef.current = false;
                  isSpeakingRef.current = false;
                  // Resume speech recognition on error
                  if (
                    document.visibilityState === "visible" &&
                    !inputVoiceSearch
                  ) {
                    startRecognition();
                  }
                },
              });
            } catch (audioError) {
              console.error(
                `Error creating audio instance for ${key}:`,
                audioError
              );
            }
          }
        });

        setAudioInitialized(true);
      } catch (error) {
        console.error("Error initializing audio:", error);
        setAudioInitialized(false);
      }
    };

    initAudio();

    // Cleanup function
    return () => {
      cleanupAudioInstances();
    };
  }, []);

  /**
   * Play audio file using Howler.js
   * @param {string} audioFile - Path to the audio file to play
   */
  const playAudio = async (audioFile) => {
    try {
      if (!audioInitialized) {
        return;
      }

      // Find the audio instance by file path
      const audioKey = Object.keys(audioInstances.current).find((key) => {
        const instance = audioInstances.current[key];
        return instance && instance._src && instance._src.includes(audioFile);
      });

      if (!audioKey || !audioInstances.current[audioKey]) {
        console.error("Audio instance not found for:", audioFile);
        return;
      }

      const howlInstance = audioInstances.current[audioKey];

      Howler.stop();
      stopRecognition();

      if (howlInstance.state() === "loaded") {
        howlInstance.play();
      } else {
        // If not loaded, try to load it first
        howlInstance.load();
        howlInstance.once("load", () => {
          howlInstance.play();
        });
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      isPlayingRef.current = false;
      isSpeakingRef.current = false;
      if (document.visibilityState === "visible" && !inputVoiceSearch) {
        startRecognition();
      }
    }
  };

  /**
   * Wrapper function to play audio (maintains backward compatibility)
   * @param {string} audioFile - Path to the audio file to play
   */
  const audioToPlay = (audioFile) => {
    playAudio(audioFile);
  };

  /**
   * Clean up audio instances to prevent pool exhaustion
   */
  const cleanupAudioInstances = () => {
    try {
      Howler.stop();

      Object.values(audioInstances.current).forEach((howl) => {
        if (howl && typeof howl.stop === "function") {
          howl.stop();
        }
        if (howl && typeof howl.unload === "function") {
          howl.unload();
        }
      });

      // Clear the references
      audioInstances.current = {};
      setAudioInitialized(false);

      if (window.gc) {
        window.gc();
      }
    } catch (error) {
      console.error("Error cleaning up audio instances:", error);
    }
  };

  /**
   * Start speech recognition for wakeup commands
   */
  const startRecognition = () => {
    if (!browserSupportsSpeechRecognition) {
      return;
    }

    if (inputVoiceSearch) {
      return;
    }

    if (listening) {
      return;
    }

    if (document.visibilityState !== "visible") {
      return;
    }

    // Don't start if currently speaking (audio is playing)
    if (isSpeakingRef.current) {
      return;
    }

    // Add a flag to prevent multiple simultaneous start attempts
    if (isStartingRecognition.current) {
      return;
    }

    isStartingRecognition.current = true;

    SpeechRecognition.startListening({
      continuous: true,
      language: "en-IN",
      interimResults: true,
      maxAlternatives: 1,
      confidence: 0.7,
    })
      .then(() => {
        isStartingRecognition.current = false;
      })
      .catch((err) => {
        console.error("Recognition start error:", err);
        isStartingRecognition.current = false;
        // Only retry if we're still supposed to be listening
        if (
          !inputVoiceSearch &&
          !isSpeakingRef.current &&
          document.visibilityState === "visible"
        ) {
          setTimeout(startRecognition, 1000);
        }
      });
  };

  /**
   * Stop speech recognition
   */
  const stopRecognition = () => {
    if (!browserSupportsSpeechRecognition) {
      return;
    }

    isStartingRecognition.current = false;

    if (listening) {
      SpeechRecognition.stopListening();
    }
    SpeechRecognition.abortListening();
  };

  // Initialize speech recognition and visibility change handling
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
    } else {
      startRecognition();

      const handleVisibilityChange = () => {
        if (
          document.visibilityState === "visible" &&
          !isSpeakingRef.current &&
          !inputVoiceSearch
        ) {
          startRecognition();
        } else {
          stopRecognition();
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
        stopRecognition();
        if (silenceTimeout.current) {
          clearTimeout(silenceTimeout.current);
        }
        if (analysisAutoSubmitTimer) {
          clearTimeout(analysisAutoSubmitTimer);
        }
        isStartingRecognition.current = false;
        cleanupAudioInstances();
      };
    }
  }, []);

  // Process speech transcript for wakeup commands
  useEffect(() => {
    if (!listening || isProcessing || isSpeakingRef.current) return;

    const detectedSpeech = lowerCase(transcript).trim();
    if (!detectedSpeech) return;

    // Filter profanity from detected speech before processing
    const filteredSpeech = filterProfanity(detectedSpeech);

    if (containsProfanity(detectedSpeech)) {
      resetTranscript();
      return;
    }

    const hasOpenKeyword = containsOpenKeywords(detectedSpeech);

    if (hasOpenKeyword) {
      processSpeech(filteredSpeech);
      return;
    }

    // Ignore system phrases
    const systemPhrasesRegex = new RegExp(
      systemPhrases
        .map((p) => `\\b${p.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`)
        .join("|"),
      "i"
    );

    if (systemPhrasesRegex.test(filteredSpeech)) {
      resetTranscript();
      return;
    }

    accumulatedTranscript.current = filteredSpeech;

    if (silenceTimeout.current) {
      clearTimeout(silenceTimeout.current);
    }

    silenceTimeout.current = setTimeout(() => {
      if (accumulatedTranscript.current) {
        processSpeech(accumulatedTranscript.current);
        accumulatedTranscript.current = "";
      }
    }, 500);

    return () => {
      if (silenceTimeout.current) {
        clearTimeout(silenceTimeout.current);
      }
    };
  }, [transcript, listening, isProcessing]);

  /**
   * Process accumulated speech and execute appropriate actions
   * @param {string} fullTranscript - The complete transcript to process
   */
  const processSpeech = (fullTranscript) => {
    setIsProcessing(true);
    resetTranscript();

    // Filter profanity from the full transcript
    const filteredTranscript = filterProfanity(fullTranscript);

    if (containsProfanity(fullTranscript)) {
      setIsProcessing(false);
      return;
    }

    const lowerTranscript = lowerCase(filteredTranscript);
    const hasOpenKeyword = containsOpenKeywords(lowerTranscript);

    if (hasOpenKeyword) {
      if (!hasBeenWoken && !showHome) {
        audioToPlay(genieIcons?.whatCanDoAudio);
        setHasBeenWoken(true);
        updateSpeechState({
          wakeup: true,
        });
        setAwaitingNextCommand(true);
        setIsProcessing(false);
        return;
      }
    }

    const hasCloseKeyword = containsCloseKeywords(lowerTranscript);

    if ((wakeup || showHome) && hasCloseKeyword) {
      audioToPlay(genieIcons?.okAudio);
      updateSpeechState({
        wakeup: false,
        isVoiceMode: false,
      });
      updateUIState({
        showAlert: false,
      });
      updateChatState({
        userCommand: "",
      });
      handleGenieClose();
      setHasBeenWoken(false);
      setAwaitingNextCommand(false);
      setIsProcessing(false);
      return;
    }

    if (wakeup && fullTranscript && awaitingNextCommand) {
      setAwaitingNextCommand(false);
      const hasAnalysisKeyword = containsAnalysisKeywords(lowerTranscript);

      if (hasAnalysisKeyword) {
        audioToPlay(genieIcons?.sureAudio);

        setOriginalAnalysisTranscript(filteredTranscript);
        setIsUserTyping(false);

        // Clear any existing timer
        if (analysisAutoSubmitTimer) {
          clearTimeout(analysisAutoSubmitTimer);
        }

        setTimeout(() => {
          updateSpeechState({
            wakeup: false,
            isVoiceMode: !isVoiceMode,
          });
          updateUIState({
            showAlert: false,
          });
          setShowHome(true);
          handleNewChat();
          setHasBeenWoken(false);
          updateChatState({
            userCommand: filteredTranscript,
          });
          updateSearchState({
            searchInput: filteredTranscript,
          });

          const timer = setTimeout(() => {
            if (!isUserTyping) {
              console.log("Auto-submitting analysis prompt after 5 seconds");
              onFormSubmit(filteredTranscript);
              handleVoiceSearch();
            }
          }, 5000);

          setAnalysisAutoSubmitTimer(timer);
          console.log(
            "Analysis prompt detected. Auto-submission scheduled in 5 seconds. User can edit or press Enter to submit manually."
          );
        }, 300);

        setTimeout(() => {
          resetTranscript();
        }, 1500);
      } else {
        audioToPlay(genieIcons?.couldNotAssistAudio);
        setTimeout(() => {
          updateSpeechState({
            wakeup: false,
          });
          updateUIState({
            showAlert: false,
          });
          setShowHome(true);
          handleNewChat();
          setHasBeenWoken(false);
          updateChatState({
            userCommand: "",
          });
        }, 1000);
      }
    }

    setIsProcessing(false);
  };

  // Auto-deactivate wakeup after 15 seconds of inactivity
  useEffect(() => {
    if (hasBeenWoken) {
      const timeout = setTimeout(() => {
        setHasBeenWoken(false);
        updateSpeechState({
          wakeup: false,
        });
        updateUIState({
          showAlert: false,
        });
        audioToPlay(genieIcons?.Closingnow);
      }, 15000);

      return () => clearTimeout(timeout);
    }
  }, [hasBeenWoken]);

  // Synchronize speech recognition with VoiceRecognition component
  useEffect(() => {
    if (inputVoiceSearch) {
      stopRecognition();
    } else {
      const resumeTimeout = setTimeout(() => {
        // Double-check conditions before starting
        if (
          !inputVoiceSearch &&
          !isSpeakingRef.current &&
          document.visibilityState === "visible" &&
          !listening
        ) {
          startRecognition();
        }
      }, 300);

      return () => clearTimeout(resumeTimeout);
    }
  }, [inputVoiceSearch, listening]);

  // Ensure Wakeup is always listening when it should be
  useEffect(() => {
    const ensureListeningInterval = setInterval(() => {
      if (
        !inputVoiceSearch &&
        !isSpeakingRef.current &&
        document.visibilityState === "visible" &&
        !listening &&
        !isStartingRecognition.current
      ) {
        console.log("Wakeup: Ensuring listening is active");
        startRecognition();
      }
    }, 2000);

    return () => clearInterval(ensureListeningInterval);
  }, [inputVoiceSearch, listening, isSpeakingRef.current]);

  // Clean up analysis auto-submission timer when component unmounts or wakeup state changes
  useEffect(() => {
    return () => {
      if (analysisAutoSubmitTimer) {
        clearTimeout(analysisAutoSubmitTimer);
      }
    };
  }, [analysisAutoSubmitTimer]);

  /**
   * Handle manual submission when user is typing
   */
  const submitManualTranscript = useCallback(() => {
    if (isUserTyping && searchInput) {
      setIsUserTyping(false);
      setOriginalAnalysisTranscript("");

      updateSpeechState({
        isVoiceMode: true,
      });

      handleManualSubmission(searchInput);
      console.log(
        "Manual submission triggered. Submitting edited transcript:",
        searchInput
      );
    }
  }, [isUserTyping, searchInput, handleManualSubmission, updateSpeechState]);

  // Handle keyboard events for manual submission
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter" && isUserTyping && searchInput) {
        event.preventDefault();
        submitManualTranscript();
      }
    };

    if (isUserTyping) {
      document.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [isUserTyping, searchInput, submitManualTranscript]);

  // Detect when user starts typing to prevent auto-submission
  useEffect(() => {
    if (
      searchInput &&
      originalAnalysisTranscript &&
      searchInput !== originalAnalysisTranscript &&
      analysisAutoSubmitTimer
    ) {
      setIsUserTyping(true);

      if (analysisAutoSubmitTimer) {
        clearTimeout(analysisAutoSubmitTimer);
        setAnalysisAutoSubmitTimer(null);
      }

      stopRecognition();
      updateSpeechState({
        isVoiceMode: false,
      });

      console.log(
        "User started typing. Auto-submission cancelled. Press Enter to submit manually or edit as needed."
      );
    }
  }, [searchInput, originalAnalysisTranscript, analysisAutoSubmitTimer]);

  return <></>;
};

export default WakeupComponent;
