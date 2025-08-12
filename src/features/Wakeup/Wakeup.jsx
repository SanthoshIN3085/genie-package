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
  containsProceedingText,
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
export default function WakeupComponent({
  setShowHome = () => {},
  handleGenieClose = () => {},
  handleNewChat = () => {},
  handleVoiceSearch = () => {},
  showHome = false,
}) {
  const dispatch = useDispatch();
  const { speech, ui } = useSelector((state) => state.genie);
  const { wakeup, inputVoiceSearch } = speech || {};
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
  const silenceTimeout = useRef(null);
  const accumulatedTranscript = useRef("");
  const isSpeakingRef = useRef(false);
  const audioInstances = useRef({});
  const isPlayingRef = useRef(false);

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
        // Initialize all audio files
        const audioFiles = {
          whatCanDo: genieIcons?.whatCanDoAudio,
          ok: genieIcons?.okAudio,
          sure: genieIcons?.sureAudio,
          couldNotAssist: genieIcons?.couldNotAssistAudio,
          wouldYouLike: genieIcons?.wouldYouLikeAudio,
          proceeding: genieIcons?.proceedingAudio,
          checkGenie: genieIcons?.checkGenieAudio,
          closingNow: genieIcons?.Closingnow,
        };

        // Create Howl instances for each audio file
        Object.entries(audioFiles).forEach(([key, audioFile]) => {
          if (audioFile) {
            audioInstances.current[key] = new Howl({
              src: [audioFile],
              html5: true,
              preload: true,
              onload: () => {
                console.log(`Audio loaded: ${key}`);
              },
              onloaderror: (id, error) => {
                console.error(`Audio load error for ${key}:`, error);
              },
              onplay: () => {
                // console.log(`Audio playing: ${key}`);
                isPlayingRef.current = true;
                isSpeakingRef.current = true;
              },
              onend: () => {
                // console.log(`Audio ended: ${key}`);
                isPlayingRef.current = false;
                isSpeakingRef.current = false;
                // Resume speech recognition after audio finishes
                if (document.visibilityState === "visible" && !inputVoiceSearch) {
                  startRecognition();
                }
              },
              onstop: () => {
                // console.log(`Audio stopped: ${key}`);
                isPlayingRef.current = false;
                isSpeakingRef.current = false;
                // Resume speech recognition after audio stops
                if (document.visibilityState === "visible" && !inputVoiceSearch) {
                  startRecognition();
                }
              },
              onerror: (id, error) => {
                console.error(`Audio error for ${key}:`, error);
                isPlayingRef.current = false;
                isSpeakingRef.current = false;
                // Resume speech recognition on error
                if (document.visibilityState === "visible" && !inputVoiceSearch) {
                  startRecognition();
                }
              }
            });
          }
        });

        setAudioInitialized(true);
        console.log("Audio instances initialized successfully");
      } catch (error) {
        console.error("Error initializing audio:", error);
        setAudioInitialized(false);
      }
    };

    initAudio();

    // Cleanup function
    return () => {
      // Stop all audio instances
      Object.values(audioInstances.current).forEach(howl => {
        if (howl && typeof howl.stop === 'function') {
          howl.stop();
        }
      });
      // Clear the audio instances
      audioInstances.current = {};
      setAudioInitialized(false);
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
        console.warn("Audio not initialized");
        return;
      }

      // Find the audio instance by file path
      const audioKey = Object.keys(audioInstances.current).find(key => {
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
      
      // Play the audio
      howlInstance.play();
      
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
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    // Don't start if VoiceRecognition is active or if speaking
    if (inputVoiceSearch || isSpeakingRef.current) {
      return;
    }

    if (
      !listening &&
      !isSpeakingRef.current &&
      document.visibilityState === "visible"
    ) {
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-IN",
        interimResults: true,
        maxAlternatives: 1,
        confidence: 0.7,
      })
        .then(() => {
          console.log("Speech Recognition Started");
        })
        .catch((err) => {
          console.error("Recognition start error:", err);
          setTimeout(startRecognition, 1000);
        });
    }
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
      console.warn(
        "Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari."
      );
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
        // Stop all audio when component unmounts
        Howler.stop();
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
      console.log("Profanity detected and filtered from transcript");
      resetTranscript();
      return;
    }

    // Check for open keywords using RegExp
    const hasOpenKeyword = containsOpenKeywords(detectedSpeech);

    // If open keyword is detected, process it immediately
    if (hasOpenKeyword) {
      console.log("Open keyword detected:", detectedSpeech);
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
        console.log("Processing transcript:", accumulatedTranscript.current);
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
    console.log("processSpeech called with:", fullTranscript);
    setIsProcessing(true);
    resetTranscript();

    // Filter profanity from the full transcript
    const filteredTranscript = filterProfanity(fullTranscript);

    // If profanity was detected, skip processing
    if (containsProfanity(fullTranscript)) {
      console.log("Profanity detected in full transcript, skipping processing");
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
            userCommand: filteredTranscript,
          });
          // Store the voice prompt in search state for VoiceRecognition to use
          updateSearchState({
            searchInput: filteredTranscript,
          });
        }, 300);

        setTimeout(() => {
          audioToPlay(genieIcons?.wouldYouLikeAudio);
          resetTranscript();
          setAwaitingProceedResponse(true);
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

    if (awaitingProceedResponse && fullTranscript) {
      setAwaitingProceedResponse(false);
      const isProceeding = containsProceedingText(lowerTranscript);

      if (isProceeding) {
        resetTranscript();
        audioToPlay(genieIcons?.proceedingAudio);
        //after 1500ms, start listening again triggering voice recognition's startlistening so that it displays speak now and bind user input transcript

        // setReachedTriggerPoint(true);

        handleVoiceSearch();

        // Don't immediately enable VoiceRecognition mode - let TypingAnimation handle it
        // The TypingAnimation will trigger voice recognition after typing completes

        // Clear the searchInput after calling handleVoiceSearch to prevent repeated submission
        updateSearchState({
          searchInput: "",
        });
      } else {
        audioToPlay(genieIcons?.checkGenieAudio);
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
        }, 1500);
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
   * 2. Resuming Wakeup listening when VoiceRecognition stops
   * 3. Ensuring only one component is listening at a time
   * 4. Preventing conflicts between the two listening systems
   * 
   * Dependencies: [inputVoiceSearch]
   * 
   * Side Effects:
   * - Starts or stops speech recognition
   * - Manages listening state transitions
   */
  useEffect(() => {
    if (inputVoiceSearch) {
      // VoiceRecognition has started, stop Wakeup listening
      stopRecognition();
    } else if (!inputVoiceSearch && !isSpeakingRef.current) {
      // VoiceRecognition has stopped, resume Wakeup listening if not speaking
      startRecognition();
    }
  }, [inputVoiceSearch]);

  return <></>;
}