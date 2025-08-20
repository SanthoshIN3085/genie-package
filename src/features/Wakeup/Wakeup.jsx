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
}) =>{
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
   *
   * @param {Object} data - Speech state data to update
   */
  const updateSpeechState = useCallback(
    (data) => dispatch(updateSpeech(data)),
    [dispatch]
  );

  /**
   * Memoized function to update UI state in Redux
   *
   * @param {Object} data - UI state data to update
   */
  const updateUIState = useCallback(
    (data) => dispatch(updateUI(data)),
    [dispatch]
  );

  /**
   * Memoized function to update chat state in Redux
   *
   * @param {Object} data - Chat state data to update
   */
  const updateChatState = useCallback(
    (data) => dispatch(updateChat(data)),
    [dispatch]
  );

  /**
   * Memoized function to update search state in Redux
   *
   * @param {Object} data - Search state data to update
   */
  const updateSearchState = useCallback(
    (data) => dispatch(updateSearch(data)),
    [dispatch]
  );

  /**
   * Initialize Howler audio instances for all audio files
   *
   * This useEffect runs once when the component mounts and:
   * 1. Creates Howl instances for all audio files (whatCanDo, ok, sure, etc.)
   * 2. Sets up event handlers for audio lifecycle (load, play, end, error)
   * 3. Preloads audio files for instant playback
   * 4. Manages audio state synchronization with speech recognition
   * 5. Provides cleanup function to stop and clear audio instances
   *
   * Dependencies: [] (runs only once on mount)
   *
   * Side Effects:
   * - Creates multiple Howl audio instances
   * - Sets up audio event listeners
   * - Updates audioInitialized state
   * - Manages audio instance cleanup on unmount
   */
  useEffect(() => {
    const initAudio = () => {
      try {
        // Don't reinitialize if already initialized
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
          // wouldYouLike: genieIcons?.wouldYouLikeAudio,
          // proceeding: genieIcons?.proceedingAudio,
          // checkGenie: genieIcons?.checkGenieAudio,
          closingNow: genieIcons?.closingNowAudio,
        };

        // Create Howl instances for each audio file with better error handling
        Object.entries(audioFiles).forEach(([key, audioFile]) => {
          if (audioFile) {
            try {
              audioInstances.current[key] = new Howl({
                src: [audioFile],
                html5: true,
                preload: false, // Changed to false to prevent pool exhaustion
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
   *
   * This function handles audio playback by:
   * 1. Finding the correct audio instance by matching the audio file path
   * 2. Stopping any currently playing audio to prevent overlap
   * 3. Stopping current speech recognition during playback
   * 4. Playing the selected audio file
   * 5. Handling errors and resuming speech recognition if needed
   *
   * @param {string} audioFile - Path to the audio file to play
   * @returns {Promise<void>} Promise that resolves when audio starts playing
   *
   * Side Effects:
   * - Stops all currently playing audio
   * - Stops speech recognition
   * - Updates isPlayingRef and isSpeakingRef states
   * - May resume speech recognition on error
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

      // Stop any currently playing audio
      Howler.stop();

      // Stop current recognition
      stopRecognition();

      // Check if the audio instance is ready to play
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
      // Resume speech recognition on error
      if (document.visibilityState === "visible" && !inputVoiceSearch) {
        startRecognition();
      }
    }
  };

  /**
   * Wrapper function to play audio (maintains backward compatibility)
   *
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
      // Stop all currently playing audio
      Howler.stop();

      // Stop and unload all audio instances
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

      // Force garbage collection hint (optional)
      if (window.gc) {
        window.gc();
      }
    } catch (error) {
      console.error("Error cleaning up audio instances:", error);
    }
  };

  /**
   * Start speech recognition for wakeup commands
   *
   * This function initializes speech recognition by:
   * 1. Checking browser support for speech recognition
   * 2. Verifying that VoiceRecognition is not currently active
   * 3. Ensuring the component is visible and not currently speaking
   * 4. Starting continuous listening with specific configuration
   * 5. Handling errors and retrying if needed
   *
   * Speech Recognition Configuration:
   * - continuous: true (keeps listening)
   * - language: "en-IN" (Indian English)
   * - interimResults: true (provides real-time results)
   * - maxAlternatives: 1 (single best result)
   * - confidence: 0.7 (70% confidence threshold)
   *
   * Side Effects:
   * - Starts browser speech recognition
   * - Updates listening state
   * - May retry on error after 1 second delay
   */
  const startRecognition = () => {
    if (!browserSupportsSpeechRecognition) {
      // console.warn("Speech recognition not supported in this browser.");
      return;
    }

    // Don't start if VoiceRecognition is actively listening
    if (inputVoiceSearch) {
      return;
    }

    // Don't start if already listening
    if (listening) {
      return;
    }

    // Don't start if not visible
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
   *
   * This function stops all speech recognition activities by:
   * 1. Checking browser support
   * 2. Stopping the listening process
   * 3. Aborting any pending recognition
   *
   * Side Effects:
   * - Stops browser speech recognition
   * - Updates listening state
   */
  const stopRecognition = () => {
    if (!browserSupportsSpeechRecognition) {
      return;
    }

    // Reset the starting flag
    isStartingRecognition.current = false;

    if (listening) {
      SpeechRecognition.stopListening();
    }
    SpeechRecognition.abortListening();
  };

  /**
   * Initialize speech recognition and visibility change handling
   *
   * This useEffect runs once when the component mounts and:
   * 1. Checks browser support for speech recognition
   * 2. Starts listening for wakeup commands immediately
   * 3. Sets up visibility change listener to pause/resume listening
   * 4. Provides cleanup function for event listeners and recognition
   *
   * Dependencies: [] (runs only once on mount)
   *
   * Side Effects:
   * - Starts speech recognition
   * - Adds document visibility change listener
   * - Manages cleanup on component unmount
   * - Stops all audio playback on unmount
   */
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      // console.warn(
      //   "Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari."
      // );
    } else {
      // Always start listening when component mounts
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
        // Clear analysis auto-submission timer
        if (analysisAutoSubmitTimer) {
          clearTimeout(analysisAutoSubmitTimer);
        }
        // Reset recognition state
        isStartingRecognition.current = false;
        // Clean up audio instances properly
        cleanupAudioInstances();
      };
    }
  }, []);

  /**
   * Process speech transcript for wakeup commands
   * 
   * This useEffect monitors the transcript and processes speech by:
   * 1. Filtering out profanity and system phrases
   * 2. Accumulating speech over time with silence detection
   * 3. Processing accumulated speech after 500ms of silence
   * 4. Handling different types of commands (open, close, analysis)
   * 5. Managing state transitions and audio responses
   * 
   * Dependencies: [transcript, listening, isProcessing]
   * 
   * Side Effects:
   * - Updates accumulated transcript
   - Sets up silence timeout
   * - Calls processSpeech function
   * - Manages timeout cleanup
   */
  useEffect(() => {
    if (!listening || isProcessing || isSpeakingRef.current) return;

    const detectedSpeech = lowerCase(transcript).trim();
    if (!detectedSpeech) return;

    // Filter profanity from detected speech before processing
    const filteredSpeech = filterProfanity(detectedSpeech);

    // If profanity was detected and filtered, skip processing this transcript
    if (containsProfanity(detectedSpeech)) {
      resetTranscript();
      return;
    }

    // Check for open keywords using RegExp
    const hasOpenKeyword = containsOpenKeywords(detectedSpeech);

    // If open keyword is detected, process it immediately
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

    // Reduce timeout to 1 second for faster response
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
   *
   * This function handles the main logic for processing user speech by:
   * 1. Filtering profanity from the full transcript
   * 2. Detecting and responding to open keywords (wakeup commands)
   * 3. Handling close keywords to deactivate Genie
   * 4. Processing analysis keywords for user commands
   * 5. Managing proceeding responses and state transitions
   * 6. Playing appropriate audio feedback for each action
   *
   * @param {string} fullTranscript - The complete transcript to process
   *
   * Side Effects:
   * - Updates Redux state (speech, chat, search, UI)
   * - Plays audio responses
   * - Triggers component state changes
   * - Calls external handler functions
   * - Manages wakeup and command states
   */
  const processSpeech = (fullTranscript) => {
    // consoe.log("processSpeech called with:", fullTranscript);
    setIsProcessing(true);
    resetTranscript();

    // Filter profanity from the full transcript
    const filteredTranscript = filterProfanity(fullTranscript);

    // If profanity was detected, skip processing
    if (containsProfanity(fullTranscript)) {
      setIsProcessing(false);
      return;
    }

    // Immediate keyword matching without complex operations
    const lowerTranscript = lowerCase(filteredTranscript);

    // Quick check for open keywords using RegExp
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

    // Quick check for close keywords using RegExp
    const hasCloseKeyword = containsCloseKeywords(lowerTranscript);

    if ((wakeup || showHome) && hasCloseKeyword) {
      audioToPlay(genieIcons?.okAudio);
      updateSpeechState({
        wakeup: false,
        isVoiceMode: false, // Reset audio mode
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

    // Quick check for analysis keywords using RegExp
    if (wakeup && fullTranscript && awaitingNextCommand) {
      setAwaitingNextCommand(false);
      const hasAnalysisKeyword = containsAnalysisKeywords(lowerTranscript);

      if (hasAnalysisKeyword) {
        audioToPlay(genieIcons?.sureAudio);

        // Store the original transcript for typing detection
        setOriginalAnalysisTranscript(filteredTranscript);
        setIsUserTyping(false);

        // Clear any existing timer
        if (analysisAutoSubmitTimer) {
          clearTimeout(analysisAutoSubmitTimer);
        }

        setTimeout(() => {
          updateSpeechState({
            wakeup: false,
            isVoiceMode: !isVoiceMode, //Toggle Audio Mode
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
          // Store the voice prompt in search state for VoiceRecognition to use
          updateSearchState({
            searchInput: filteredTranscript,
          });

          // Start 5-second auto-submission timer
          const timer = setTimeout(() => {
            if (!isUserTyping) {
              // Auto-submit if user hasn't started typing
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
          // audioToPlay(genieIcons?.wouldYouLikeAudio);
          resetTranscript();
          // setAwaitingProceedResponse(true);
          // debugger;

          // Don't auto-submit here, let the timer handle it
          // onFormSubmit(filteredTranscript);
          // handleVoiceSearch();
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

  /**
   * Auto-deactivate wakeup after 15 seconds of inactivity
   *
   * This useEffect manages the wakeup timeout by:
   * 1. Setting a 15-second timer when hasBeenWoken becomes true
   * 2. Automatically deactivating Genie if no further interaction occurs
   * 3. Playing closing audio and resetting all states
   * 4. Cleaning up the timeout if component unmounts or state changes
   *
   * Dependencies: [hasBeenWoken]
   *
   * Side Effects:
   * - Sets timeout for auto-deactivation
   * - Updates Redux state (speech, UI)
   * - Plays closing audio
   * - Resets wakeup states
   * - Manages timeout cleanup
   */
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

  /**
   * Synchronize speech recognition with VoiceRecognition component
   *
   * This useEffect manages the coordination between Wakeup and VoiceRecognition by:
   * 1. Stopping Wakeup listening when VoiceRecognition starts
   * 2. Resuming Wakeup listening when VoiceRecognition stops (with delay)
   * 3. Ensuring only one component is listening at a time
   * 4. Preventing conflicts between the two listening systems
   *
   * Dependencies: [inputVoiceSearch]
   *
   * Side Effects:
   * - Starts or stops speech recognition
   * - Manages listening state transitions
   * - Adds delay to prevent restart loops
   */
  useEffect(() => {
    if (inputVoiceSearch) {
      // VoiceRecognition has started, stop Wakeup listening
      stopRecognition();
    } else {
      // VoiceRecognition has stopped or is not active, ensure Wakeup is listening
      // Add a delay to prevent immediate restart conflicts
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
      }, 300); // Reduced delay for faster response

      return () => clearTimeout(resumeTimeout);
    }
  }, [inputVoiceSearch, listening]);

  /**
   * Ensure Wakeup is always listening when it should be
   * This periodic check prevents Wakeup from getting stuck in a stopped state
   */
  useEffect(() => {
    const ensureListeningInterval = setInterval(() => {
      // Only check if we're not supposed to be stopped
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
    }, 2000); // Check every 2 seconds

    return () => clearInterval(ensureListeningInterval);
  }, [inputVoiceSearch, listening, isSpeakingRef.current]);

  /**
   * Clean up analysis auto-submission timer when component unmounts or wakeup state changes
   */
  useEffect(() => {
    return () => {
      if (analysisAutoSubmitTimer) {
        clearTimeout(analysisAutoSubmitTimer);
      }
    };
  }, [analysisAutoSubmitTimer]);

  /**
   * Handle manual submission when user is typing
   * This allows users to submit their edited transcript manually
   */
  const submitManualTranscript = useCallback(() => {
    if (isUserTyping && searchInput) {
      // Clear typing state and re-enable audio mode
      setIsUserTyping(false);
      setOriginalAnalysisTranscript("");

      // Re-enable audio mode for future voice interactions
      updateSpeechState({
        isVoiceMode: true,
      });

      // Submit the edited transcript using the prop function
      handleManualSubmission(searchInput);
      console.log(
        "Manual submission triggered. Submitting edited transcript:",
        searchInput
      );
    }
  }, [isUserTyping, searchInput, handleManualSubmission, updateSpeechState]);

  /**
   * Handle keyboard events for manual submission
   * This allows users to press Enter to submit their edited transcript
   */
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

  /**
   * Detect when user starts typing to prevent auto-submission
   *
   * This useEffect monitors changes in the search input field to:
   * 1. Detect when user manually types in the input field
   * 2. Compare typed input with the original analysis transcript
   * 3. Stop auto-submission timer when user starts typing
   * 4. Set typing state to prevent auto-submission
   * 5. Stop listening and disable audio mode when typing starts
   *
   * This feature allows users to edit analysis transcripts manually while
   * maintaining the ability to submit when they're ready.
   *
   * Dependencies: [searchInput, originalAnalysisTranscript, analysisAutoSubmitTimer]
   *
   * Side Effects:
   * - May clear auto-submission timer
   * - Updates user typing state
   * - May stop speech recognition
   * - May disable audio mode
   */
  useEffect(() => {
    if (
      searchInput &&
      originalAnalysisTranscript &&
      searchInput !== originalAnalysisTranscript &&
      analysisAutoSubmitTimer
    ) {
      // User has started typing, stop auto-submission timer
      setIsUserTyping(true);

      // Clear the auto-submission timer
      if (analysisAutoSubmitTimer) {
        clearTimeout(analysisAutoSubmitTimer);
        setAnalysisAutoSubmitTimer(null);
      }

      // Stop listening and disable audio mode to let user type freely
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
}

export default WakeupComponent;