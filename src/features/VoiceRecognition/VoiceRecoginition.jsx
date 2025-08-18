import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useFormContext } from "react-hook-form";
import { updateChat, updateSpeech, updateSearch } from "Reducers/genie/reducer";
import { useDispatch, useSelector } from "react-redux";
import { transformGenieWords } from "../utils/util.js";
import { filterProfanity, containsOpenKeywords } from "../command.js";

/**
 * VoiceRecognition Component - Handles voice input and transcript management
 *
 * This component manages the voice recognition system for user input by:
 * 1. Starting and stopping speech recognition based on component state
 * 2. Processing real-time transcripts and filtering profanity
 * 3. Handling user typing detection to pause voice recognition
 * 4. Managing auto-submission with confidence thresholds
 * 5. Coordinating with form state and Redux store
 * 6. Implementing silence detection and session management
 *
 * @param {Object} props - Component props
 * @param {Function} props.onFormSubmit - Callback function when form should be submitted
 * @param {Function} props.onResumeListening - Callback function to resume listening
 * @param {Function} props.onSyncTranscript - Callback function to sync transcript with form
 * @returns {null} This component doesn't render anything (invisible component)
 */
const VoiceRecognition = ({
  onFormSubmit = () => {},
  onResumeListening = () => {},
  onSyncTranscript = () => {},
}) => {
  const { speech, search } = useSelector((state) => state.genie);
  const { isListening, inputVoiceSearch, isAudioMode } = speech || {};
  const { searchInput } = search || {};
  const dispatch = useDispatch();
  const { control, setValue } = useFormContext();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStartedSpeaking, setHasStartedSpeaking] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [originalTranscript, setOriginalTranscript] = useState("");
  const [isNewSession, setIsNewSession] = useState(true); // Track if this is a new session
  const SILENCE_LIMIT_MS = 5000; // Stop listening after 5s of silence
  const silenceTimerRef = useRef(null);
  const debounceDelay = 2000; // 2 seconds to wait after last speech before auto-submit
  const continuousListeningOptions = useMemo(
    () => ({
      continuous: true,
      interimResults: true,
      language: "en-IN",
      maxAlternatives: 1,
      confidence: 0.7,
    }),
    []
  );

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
   * Clear the silence timer to prevent automatic stopping of listening
   *
   * This function clears the timeout that would automatically stop listening
   * after a period of silence. It's called when new speech is detected
   * or when manually stopping the listening session.
   *
   * Side Effects:
   * - Clears the silenceTimerRef timeout
   * - Sets silenceTimerRef.current to null
   */
  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  /**
   * Reset the silence timer to start counting down from 5 seconds
   *
   * This function starts a new 5-second countdown timer. If no new speech
   * is detected within this time, the listening session will automatically
   * stop. It's called whenever new transcript data is received.
   *
   * Side Effects:
   * - Clears any existing silence timer
   * - Sets a new 5-second timeout
   * - May trigger stopListening() if timeout expires
   */
  const resetSilenceTimer = () => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      // After 5 seconds of no transcript change, stop listening
      if (listening) {
        stopListening();
      }
    }, SILENCE_LIMIT_MS);
  };

  /**
   * Start a new voice recognition listening session
   *
   * This function initializes a fresh listening session by:
   * 1. Aggressively clearing any existing transcript data
   * 2. Resetting all component state variables
   * 3. Starting the browser's speech recognition
   * 4. Setting up silence detection timers
   * 5. Managing initialization delays to prevent auto-submission
   *
   * The function includes multiple safety measures to ensure clean state:
   * - Transcript clearing with browser API calls
   * - Delayed initialization to prevent immediate processing
   * - Redux state synchronization
   * - Error handling for unsupported browsers
   *
   * Side Effects:
   * - Clears transcript and form input
   * - Updates Redux speech state
   * - Starts browser speech recognition
   * - Sets up timers and state flags
   * - May update chat state with error messages
   */
  const startListening = () => {
    // Don't start listening if audio mode is disabled
    if (!isAudioMode) {
      // console.log("Audio mode is disabled, skipping voice recognition");
      return;
    }

    // console.log("Starting new listening session, clearing all transcript state");

    // More aggressive transcript clearing
    try {
      resetTranscript();
      // Force clear any remaining transcript by accessing the recognition object directly
      if (
        browserSupportsSpeechRecognition &&
        typeof SpeechRecognition.getRecognition === "function"
      ) {
        const recognition = SpeechRecognition.getRecognition();
        if (recognition && recognition.abort) {
          recognition.abort();
        }
      }
    } catch (error) {
      // console.log("Error clearing transcript:", error);
    }

    // Wait a bit for transcript to clear before proceeding
    setTimeout(() => {
      // Double-check that transcript is cleared
      if (transcript && transcript.trim()) {
        // console.log("Transcript still exists after clearing, aborting start:", transcript);
        return;
      }

      setHasStartedSpeaking(false);
      setValue("searchInput", "");
      setIsInitialized(false);
      setIsUserTyping(false);
      setOriginalTranscript("");
      setIsNewSession(true); // Mark this as a new session

      // Clear any stored searchInput to prevent repeated submission
      updateSearchState({
        searchInput: ""
      });

      if (!browserSupportsSpeechRecognition) {
        updateChatState({
          errorTranscript:
            "Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.",
        });
        updateSpeechState({
          isListening: false,
          inputVoiceSearch: false,
        });
        return;
      }
      SpeechRecognition.startListening(continuousListeningOptions);
      updateSpeechState({
        isListening: true,
      });
      clearTimeout(debounceTimeout);

      // Set initialized flag after a short delay to prevent immediate auto-submission
      setTimeout(() => {
        setIsInitialized(true);
      }, 1000);

      // Start silence timer even if the user hasn't spoken yet
      resetSilenceTimer();
    }, 100); // Small delay to ensure transcript clearing
  };

  /**
   * Stop the current voice recognition listening session
   *
   * This function handles the end of a listening session by:
   * 1. Stopping the browser's speech recognition
   * 2. Updating Redux state to reflect stopped status
   * 3. Clearing timers and cleanup
   * 4. Processing final transcript for submission (if conditions met)
   * 5. Managing user typing state and session flags
   *
   * Auto-submission Logic:
   * - Only submits if user is not currently typing
   * - Requires transcript with sufficient confidence (≥0.7)
   * - Filters profanity and open keywords before processing
   * - Transforms transcript using Genie-specific word corrections
   * - Prevents duplicate submissions with isSubmitting flag
   *
   * Side Effects:
   * - Stops browser speech recognition
   * - Updates Redux speech state
   * - Clears timers and timeouts
   * - May trigger form submission
   * - Resets session and typing flags
   */
  const stopListening = () => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.stopListening();
    }
    updateSpeechState({
      isListening: false,
      inputVoiceSearch: false,
    });
    clearTimeout(debounceTimeout);
    clearSilenceTimer();

    // Only submit if user is not typing and there's a transcript
    if (transcript && transcript.trim() && !isSubmitting && !isUserTyping) {
      const confidence = transcript.confidence || 1.0;
      if (confidence >= 0.7) {
        setIsSubmitting(true);
        // Filter profanity before processing
        const filteredTranscript = filterProfanity(transcript);

        // Check if the filtered transcript contains any open keywords (should be ignored)
        const hasOpenKeyword = containsOpenKeywords(filteredTranscript);

        // If open keyword is detected, skip submission
        if (hasOpenKeyword) {
          // console.log(
          //   "Open keyword detected in stopListening, skipping submission"
          // );
          setIsSubmitting(false);
          return;
        }

        const correctedTranscript = transformGenieWords(filteredTranscript);
        onFormSubmit(correctedTranscript);
        // Clear the input field after submission

        setValue("searchInput", "");
        resetTranscript();
        // Reset the submitting flag after a short delay
        setTimeout(() => {
          setIsSubmitting(false);
        }, 1000);
      }
    }

    // Reset new session flag when stopping
    setIsNewSession(true);
  };

  /**
   * Handle speech recognition errors from the browser API
   *
   * This function processes different types of speech recognition errors:
   * 1. "not-allowed": Microphone access denied by user
   * 2. "network": Network connectivity issues
   *
   * For each error type, it:
   * - Updates Redux state to reflect the error
   * - Displays appropriate error messages to the user
   * - Stops the listening session
   * - Cleans up timers and state
   *
   * @param {Object} event - Speech recognition error event object
   * @param {string} event.error - Type of error that occurred
   *
   * Side Effects:
   * - Updates Redux speech and chat state
   * - Stops browser speech recognition
   * - Clears timers and timeouts
   * - May display error messages to user
   */
  const handleSpeechRecognitionError = (event) => {
    let errorMessage;
    if (event.error === "not-allowed") {
      errorMessage =
        "Microphone access denied. Please enable it for voice interaction.";
      updateSpeechState({
        isListening: false,
        inputVoiceSearch: false,
      });

      updateChatState({
        errorTranscript: errorMessage,
      });

      // Call the local stopListening function
      if (browserSupportsSpeechRecognition) {
        SpeechRecognition.stopListening();
      }
      clearTimeout(debounceTimeout);
    } else if (event.error === "network") {
      errorMessage = "Network error. Please check your connection.";
      updateSpeechState({
        isListening: false,
        inputVoiceSearch: false,
      });

      updateChatState({
        errorTranscript: errorMessage,
      });
      // Call the local stopListening function
      if (browserSupportsSpeechRecognition) {
        SpeechRecognition.stopListening();
      }
      clearTimeout(debounceTimeout);
    }
  };

  /**
   * Component initialization and setup (componentDidMount equivalent)
   *
   * This useEffect runs once when the component mounts and:
   * 1. Sets up error handling for speech recognition
   * 2. Initializes component state variables
   * 3. Clears any existing form input and Redux state
   * 4. Sets up delayed initialization to prevent auto-submission
   * 5. Prepares the component for voice recognition
   *
   * Dependencies: [updateSearchState] (runs only once on mount)
   *
   * Side Effects:
   * - Sets up speech recognition error handlers
   * - Initializes component state
   * - Clears form input and Redux state
   * - Sets up initialization timers
   */
  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.getRecognition().onerror = handleSpeechRecognitionError;
    }
    resetTranscript();
    setHasStartedSpeaking(false);
    setIsSubmitting(false);
    setIsNewSession(true); // Initialize as new session

    // Don't initialize with stored searchInput to prevent repeated submission
    // Clear any existing input to start fresh
    setValue("searchInput", "");

    // Clear any stored searchInput in Redux state as well
    updateSearchState({ searchInput: "" });

    // Set initialized flag after a short delay to prevent immediate auto-submission
    setTimeout(() => {
      setIsInitialized(true);
    }, 1000);
  }, [updateSearchState]);

  /**
   * Start listening when triggered by external components
   *
   * This useEffect manages the coordination between VoiceRecognition and other components:
   * 1. Responds to inputVoiceSearch changes from TypingAnimation
   * 2. Handles resuming listening after user submits edited transcripts
   * 3. Implements delays to ensure proper timing with typing completion
   * 4. Manages different listening scenarios (new vs. resumed)
   *
   * Dependencies: [inputVoiceSearch, isListening, listening, isUserTyping]
   *
   * Side Effects:
   * - May start new listening sessions
   * - Manages timing delays for proper coordination
   * - Updates listening state based on external triggers
   */
  useEffect(() => {
    // Don't start listening if audio mode is disabled
    if (!isAudioMode) {
      return;
    }

    if (inputVoiceSearch && isListening && !listening) {
      // Add a delay before starting to listen to ensure typing is completely finished
      setTimeout(() => {
        startListening();
      }, 1000); // 1 second delay after typing finishes
    } else if (
      inputVoiceSearch &&
      !isListening &&
      !listening &&
      !isUserTyping
    ) {
      // Resume listening after user submits edited transcript
      setTimeout(() => {
        startListening();
      }, 500);
    }
  }, [inputVoiceSearch, isListening, listening, isUserTyping, isAudioMode]);

  /**
   * Detect when user starts typing to pause voice recognition
   *
   * This useEffect monitors changes in the search input field to:
   * 1. Detect when user manually types in the input field
   * 2. Compare typed input with the original voice transcript
   * 3. Stop voice recognition when user starts typing
   * 4. Set typing state to prevent auto-submission
   *
   * This feature allows users to edit voice transcripts manually while
   * maintaining the ability to resume voice input later.
   *
   * Dependencies: [searchInput, originalTranscript, isListening]
   *
   * Side Effects:
   * - May stop voice recognition
   * - Updates user typing state
   * - Manages transition between voice and manual input
   */
  useEffect(() => {
    if (
      searchInput &&
      originalTranscript &&
      searchInput !== originalTranscript &&
      isListening
    ) {
      // User has started typing, stop listening
      setIsUserTyping(true);
      stopListening();
    }
  }, [searchInput, originalTranscript, isListening]);

  /**
   * Main transcript processing and state management (componentDidUpdate equivalent)
   *
   * This useEffect handles the core logic for processing voice input by:
   * 1. Managing listening state synchronization with browser API
   * 2. Processing real-time transcripts with confidence thresholds
   * 3. Filtering profanity and open keywords
   * 4. Managing session state and transcript accumulation
   * 5. Handling silence detection and timer management
   * 6. Coordinating form input updates with transcript changes
   *
   * Key Features:
   * - Session management to prevent old transcript processing
   * - Confidence-based transcript validation (≥0.7 threshold)
   * - Real-time form input synchronization
   * - Profanity and keyword filtering
   * - Silence detection with 5-second timeout
   *
   * Dependencies: [isListening, listening, transcript, debounceDelay, isSubmitting,
   *               isInitialized, isNewSession, originalTranscript, hasStartedSpeaking]
   *
   * Side Effects:
   * - Updates form input values
   * - Manages session and typing states
   * - Updates Redux state
   * - Manages silence timers
   * - May trigger listening start/stop
   */
  useEffect(() => {
    if (isListening && !listening) {
      setTimeout(() => {
        startListening();
      }, 300);
    } else if (!isListening && listening && !isSubmitting) {
      stopListening();
    }

    // Bind transcript to input field in real-time
    if (transcript && !isNewSession && isInitialized) {
      // Only process transcript if not a new session and initialized
      // console.log("Processing transcript:", transcript, "isNewSession:", isNewSession, "isInitialized:", isInitialized);
      // Filter profanity from transcript before processing
      const filteredTranscript = filterProfanity(transcript);

      // Check if the filtered transcript contains any open keywords (should be ignored)
      const hasOpenKeyword = containsOpenKeywords(filteredTranscript);

      // If open keyword is detected, skip processing this transcript
      if (hasOpenKeyword) {
        // console.log("Open keyword detected in VoiceRecognition, skipping");
        return;
      }

      const correctedTranscript = transformGenieWords(filteredTranscript);

      // Check if the transcript has sufficient confidence (0.7 threshold)
      const confidence = transcript.confidence || 1.0;
      if (confidence >= 0.7) {
        // Store the original transcript for comparison
        if (!originalTranscript) {
          setOriginalTranscript(correctedTranscript);
        }

        // If user starts speaking again, clear the initial voice prompt
        if (!hasStartedSpeaking) {
          setHasStartedSpeaking(true);
          setValue("searchInput", correctedTranscript);
        } else {
          setValue("searchInput", correctedTranscript);
        }
      }
    } else if (transcript && isNewSession) {
      // If we've reached this point, it means the user has started a new session. It prevents old transcripts from being processed.
      // Add a small delay to ensure proper session initialization
      setTimeout(() => {
        setIsNewSession(false);
      }, 100);
    }

    // Reset 5s silence timer on any transcript change while listening
    if (listening) {
      resetSilenceTimer();
    } else {
      clearSilenceTimer();
    }

    // Disable 2s auto-submit while listening to allow mid-sentence pauses (3–4s) without submission.
    // Submission now happens only when the 5s silence timer triggers stopListening().
  }, [
    isListening,
    listening,
    transcript,
    debounceDelay,
    isSubmitting,
    isInitialized,
    isNewSession,
    originalTranscript,
    hasStartedSpeaking,
  ]);

  /**
   * Component cleanup and teardown (componentWillUnmount equivalent)
   *
   * This useEffect handles cleanup when the component unmounts by:
   * 1. Stopping any active speech recognition sessions
   * 2. Clearing all timers and timeouts
   * 3. Resetting transcript state
   * 4. Ensuring clean component state on unmount
   *
   * Dependencies: [] (runs only once on unmount)
   *
   * Side Effects:
   * - Stops browser speech recognition
   * - Clears all timers and timeouts
   * - Resets transcript state
   * - Prevents memory leaks and hanging processes
   */
  useEffect(() => {
    return () => {
      if (browserSupportsSpeechRecognition) {
        SpeechRecognition.stopListening();
      }
      clearTimeout(debounceTimeout);
      resetTranscript();
      clearSilenceTimer();
    };
  }, []);

  return null;
};

export default VoiceRecognition;
