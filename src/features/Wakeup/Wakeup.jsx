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

// PURE FUNCTIONS (Outside component)

/**
 * Clean up Howler audio instances
 * @param {Object} instances - Audio instances object
 * @returns {Object} Empty instances object
 */
const cleanupHowlerInstances = (instances) => {
  try {
    Howler.stop();
    Object.values(instances).forEach((howl) => {
      if (howl && typeof howl.stop === "function") {
        howl.stop();
      }
      if (howl && typeof howl.unload === "function") {
        howl.unload();
      }
    });
    return {};
  } catch (error) {
    console.error("Error cleaning up audio instances:", error);
    return instances;
  }
};

/**
 * Create Howler audio instance with callbacks
 * @param {string} audioFile - Path to audio file
 * @param {Object} callbacks - Event callbacks object
 * @returns {Howl} Howler instance
 */
const createAudioInstance = (audioFile, callbacks) => {
  try {
    return new Howl({
      src: [audioFile],
      html5: true,
      preload: false,
      onloaderror: (id, error) => {
        console.error(`Audio load error:`, error);
      },
      ...callbacks,
    });
  } catch (error) {
    console.error("Error creating audio instance:", error);
    return null;
  }
};

/**
 * Process transcript and analyze keywords
 * @param {string} transcript - Raw transcript
 * @returns {Object} Analysis results
 */
const analyzeTranscript = (transcript) => {
  if (!transcript) {
    return {
      original: "",
      filtered: "",
      lower: "",
      hasOpen: false,
      hasClose: false,
      hasAnalysis: false,
      hasProfanity: false,
      isSystemPhrase: false,
    };
  }

  const filtered = filterProfanity(transcript);
  const lower = lowerCase(filtered);

  // Check for system phrases
  const systemPhrasesRegex = new RegExp(
    systemPhrases
      .map((p) => `\\b${p.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`)
      .join("|"),
    "i"
  );

  return {
    original: transcript,
    filtered,
    lower,
    hasOpen: containsOpenKeywords(lower),
    hasClose: containsCloseKeywords(lower),
    hasAnalysis: containsAnalysisKeywords(lower),
    hasProfanity: containsProfanity(transcript),
    isSystemPhrase: systemPhrasesRegex.test(filtered),
  };
};

/**
 * Create audio file mapping for initialization
 * @param {Object} genieIcons - Audio file imports
 * @returns {Object} Audio files mapping
 */
const createAudioFilesMapping = (genieIcons) => {
  return {
    whatCanDo: genieIcons?.whatCanDoAudio,
    ok: genieIcons?.okAudio,
    sure: genieIcons?.sureAudio,
    couldNotAssist: genieIcons?.couldNotAssistAudio,
    closingNow: genieIcons?.closingNowAudio,
  };
};

// COMPONENT DEFINITION

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
 * @param {Function} props.onFormSubmit - Function to submit form
 * @param {Function} props.handleManualSubmission - Function for manual submission
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
  // 1. STATE MANAGEMENT (useState, useReducer)
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [hasBeenWoken, setHasBeenWoken] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [awaitingNextCommand, setAwaitingNextCommand] = useState(false);
  const [awaitingProceedResponse, setAwaitingProceedResponse] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [analysisAutoSubmitTimer, setAnalysisAutoSubmitTimer] = useState(null);
  const [originalAnalysisTranscript, setOriginalAnalysisTranscript] =
    useState("");

  // 2. CONTEXT (useContext) - Redux hooks
  const dispatch = useDispatch();
  const { speech, ui, search } = useSelector((state) => state.genie);
  const { wakeup, inputVoiceSearch, isVoiceMode } = speech || {};
  const { searchInput } = search || {};

  // 3. REFS (useRef, useImperativeHandle)
  const silenceTimeout = useRef(null);
  const accumulatedTranscript = useRef("");
  const isSpeakingRef = useRef(false);
  const audioInstances = useRef({});
  const isPlayingRef = useRef(false);
  const isStartingRecognition = useRef(false);

  // 4. PERFORMANCE (useMemo, useCallback)

  /**
   * Memoized function to update speech state in Redux
   */
  const updateSpeechState = useCallback(
    (data) => dispatch(updateSpeech(data)),
    [dispatch]
  );

  /**
   * Memoized function to update UI state in Redux
   */
  const updateUIState = useCallback(
    (data) => dispatch(updateUI(data)),
    [dispatch]
  );

  /**
   * Memoized function to update chat state in Redux
   */
  const updateChatState = useCallback(
    (data) => dispatch(updateChat(data)),
    [dispatch]
  );

  /**
   * Memoized function to update search state in Redux
   */
  const updateSearchState = useCallback(
    (data) => dispatch(updateSearch(data)),
    [dispatch]
  );

  // 5. CUSTOM HOOKS
  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // 6. SIDE EFFECTS (useEffect, useLayoutEffect)

  // Initialize Howler audio instances for all audio files
  useEffect(() => {
    const initAudio = () => {
      try {
        if (
          audioInitialized ||
          Object.keys(audioInstances.current).length >= 8
        ) {
          return;
        }

        // Clear any existing instances first
        if (Object.keys(audioInstances.current).length > 0) {
          audioInstances.current = cleanupHowlerInstances(
            audioInstances.current
          );
        }

        const audioFiles = createAudioFilesMapping(genieIcons);

        // Create Howl instances for each audio file
        Object.entries(audioFiles).forEach(([key, audioFile]) => {
          if (audioFile) {
            const callbacks = {
              onplay: () => {
                isPlayingRef.current = true;
                isSpeakingRef.current = true;
              },
              onend: () => {
                isPlayingRef.current = false;
                isSpeakingRef.current = false;
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
                if (
                  document.visibilityState === "visible" &&
                  !inputVoiceSearch
                ) {
                  startRecognition();
                }
              },
            };

            audioInstances.current[key] = createAudioInstance(
              audioFile,
              callbacks
            );
          }
        });

        setAudioInitialized(true);
      } catch (error) {
        console.error("Error initializing audio:", error);
        setAudioInitialized(false);
      }
    };

    initAudio();

    return () => {
      cleanupAudioInstances();
    };
  }, []);

  // Initialize speech recognition and visibility change handling
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      return;
    }

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
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
  }, []);

  // Process speech transcript for wakeup commands
  useEffect(() => {
    if (!listening || isProcessing || isSpeakingRef.current) return;

    const detectedSpeech = lowerCase(transcript).trim();
    if (!detectedSpeech) return;

    const analysis = analyzeTranscript(detectedSpeech);

    if (analysis.hasProfanity) {
      resetTranscript();
      return;
    }

    if (analysis.hasOpen) {
      processSpeech(analysis.filtered);
      return;
    }

    if (analysis.isSystemPhrase) {
      resetTranscript();
      return;
    }

    accumulatedTranscript.current = analysis.filtered;

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

  // Auto-deactivate wakeup after 15 seconds of inactivity
  useEffect(() => {
    if (!hasBeenWoken) return;

    const timeout = setTimeout(() => {
      setHasBeenWoken(false);
      updateSpeechState({ wakeup: false });
      updateUIState({ showAlert: false });
      audioToPlay(genieIcons?.Closingnow);
    }, 15000);

    return () => clearTimeout(timeout);
  }, [hasBeenWoken, updateSpeechState, updateUIState]);

  // Synchronize speech recognition with VoiceRecognition component
  useEffect(() => {
    if (inputVoiceSearch) {
      stopRecognition();
    } else {
      const resumeTimeout = setTimeout(() => {
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
        // console.log("Wakeup: Ensuring listening is active");
        startRecognition();
      }
    }, 2000);

    return () => clearInterval(ensureListeningInterval);
  }, [inputVoiceSearch, listening]);

  // Clean up analysis auto-submission timer
  useEffect(() => {
    return () => {
      if (analysisAutoSubmitTimer) {
        clearTimeout(analysisAutoSubmitTimer);
      }
    };
  }, [analysisAutoSubmitTimer]);

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
  }, [isUserTyping, searchInput]);

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
      updateSpeechState({ isVoiceMode: false });

      // console.log(
      //   "User started typing. Auto-submission cancelled. Press Enter to submit manually or edit as needed."
      // );
    }
  }, [
    searchInput,
    originalAnalysisTranscript,
    analysisAutoSubmitTimer,
    updateSpeechState,
  ]);

  // 7. COMPONENT-SPECIFIC FUNCTIONS (using state/props/hooks)

  /**
   * Clean up audio instances using pure function
   */
  const cleanupAudioInstances = () => {
    try {
      audioInstances.current = cleanupHowlerInstances(audioInstances.current);
      setAudioInitialized(false);

      if (window.gc) {
        window.gc();
      }
    } catch (error) {
      console.error("Error cleaning up audio instances:", error);
    }
  };

  /**
   * Play audio file using Howler.js
   * @param {string} audioFile - Path to the audio file to play
   */
  const playAudio = async (audioFile) => {
    try {
      if (!audioInitialized) return;

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
   * Start speech recognition for wakeup commands
   */
  const startRecognition = () => {
    if (
      !browserSupportsSpeechRecognition ||
      inputVoiceSearch ||
      listening ||
      document.visibilityState !== "visible" ||
      isSpeakingRef.current ||
      isStartingRecognition.current
    ) {
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
    if (!browserSupportsSpeechRecognition) return;

    isStartingRecognition.current = false;

    if (listening) {
      SpeechRecognition.stopListening();
    }
    SpeechRecognition.abortListening();
  };

 /**
   * Handle manual submission when user is typing
   */
  const submitManualTranscript = () => {
    if (isUserTyping && searchInput) {
      setIsUserTyping(false);
      setOriginalAnalysisTranscript("");
      updateSpeechState({ isVoiceMode: true });
      handleManualSubmission(searchInput);
      // console.log(
      //   "Manual submission triggered. Submitting edited transcript:",
      //   searchInput
      // );
    }
  };

  /**
   * Process accumulated speech and execute appropriate actions
   * @param {string} fullTranscript - The complete transcript to process
   */
  const processSpeech = (fullTranscript) => {
    setIsProcessing(true);
    resetTranscript();

    const analysis = analyzeTranscript(fullTranscript);

    if (analysis.hasProfanity) {

      setIsProcessing(false);
      return;
    }

    if (analysis.hasOpen) {

      if (!hasBeenWoken && !showHome) {
        audioToPlay(genieIcons?.whatCanDoAudio);
        setHasBeenWoken(true);
        updateSpeechState({ wakeup: true });
        setAwaitingNextCommand(true);
        setIsProcessing(false);
        return;
      }
    }

    if ((wakeup || showHome) && analysis.hasClose) {
      audioToPlay(genieIcons?.okAudio);
      updateSpeechState({ wakeup: false, isVoiceMode: false });
      updateUIState({ showAlert: false });
      updateChatState({ userCommand: "" });
      handleGenieClose();
      setHasBeenWoken(false);
      setAwaitingNextCommand(false);
      setIsProcessing(false);
      return;
    }

    if (wakeup && fullTranscript && awaitingNextCommand) {
      setAwaitingNextCommand(false);

      if (analysis.hasAnalysis) {
        audioToPlay(genieIcons?.sureAudio);

        setOriginalAnalysisTranscript(analysis.filtered);
        setIsUserTyping(false);

        if (analysisAutoSubmitTimer) {
          clearTimeout(analysisAutoSubmitTimer);
        }

        setTimeout(() => {
          updateSpeechState({ wakeup: false, isVoiceMode: !isVoiceMode });
          updateUIState({ showAlert: false });
          setShowHome(true);
          handleNewChat();
          setHasBeenWoken(false);
          updateChatState({ userCommand: analysis.filtered });
          updateSearchState({ searchInput: analysis.filtered });

          const timer = setTimeout(() => {
            if (!isUserTyping) {
              // console.log("Auto-submitting analysis prompt after 5 seconds");
              onFormSubmit(analysis.filtered);
              handleVoiceSearch();
            }
          }, 5000);

          setAnalysisAutoSubmitTimer(timer);
          // console.log(
          //   "Analysis prompt detected. Auto-submission scheduled in 5 seconds. User can edit or press Enter to submit manually."
          // );
        }, 300);

        setTimeout(() => {
          resetTranscript();
        }, 1500);
      } else {
        audioToPlay(genieIcons?.couldNotAssistAudio);
        setTimeout(() => {
          updateSpeechState({ wakeup: false });
          updateUIState({ showAlert: false });
          setShowHome(true);
          handleNewChat();
          setHasBeenWoken(false);
          updateChatState({ userCommand: "" });
        }, 1000);
      }
    }

    setIsProcessing(false);
  };

  // 8. COMPUTED VALUES
  const canStartRecognition =
    !inputVoiceSearch &&
    !isSpeakingRef.current &&
    document.visibilityState === "visible";
  // 10. RETURN UI
  return <></>;
};

export default WakeupComponent;
