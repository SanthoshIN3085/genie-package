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
 * Manages voice recognition, transcript processing, and form coordination
 *
 * @param {Object} props - Component props
 * @param {Function} props.onFormSubmit - Callback when form should be submitted
 * @param {Function} props.onResumeListening - Callback to resume listening
 * @param {Function} props.onSyncTranscript - Callback to sync transcript with form
 * @returns {null} This component doesn't render anything (invisible component)
 */
const VoiceRecognition = ({
  onFormSubmit = () => {},
  onResumeListening = () => {},
  onSyncTranscript = () => {},
}) => {
  const { speech, search } = useSelector((state) => state.genie);
  const { isListening, inputVoiceSearch, isVoiceMode } = speech || {};
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
  const [isNewSession, setIsNewSession] = useState(true);
  const SILENCE_LIMIT_MS = 5000;
  const silenceTimerRef = useRef(null);
  const debounceDelay = 2000;
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
   * @param {Object} data - Speech state data to update
   */
  const updateSpeechState = useCallback(
    (data) => dispatch(updateSpeech(data)),
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

  /**
   * Clear the silence timer to prevent automatic stopping of listening
   */
  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  /**
   * Reset the silence timer to start counting down from 5 seconds
   */
  const resetSilenceTimer = () => {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      if (listening) {
        stopListening();
      }
    }, SILENCE_LIMIT_MS);
  };

  /**
   * Start a new voice recognition listening session
   */
  const startListening = () => {
    if (!isVoiceMode) {
      return;
    }

    try {
      resetTranscript();
      if (
        browserSupportsSpeechRecognition &&
        typeof SpeechRecognition.getRecognition === "function"
      ) {
        const recognition = SpeechRecognition.getRecognition();
        if (recognition && recognition.abort) {
          recognition.abort();
        }
      }
    } catch (error) {}

    setTimeout(() => {
      if (transcript && transcript.trim()) {
        return;
      }

      setHasStartedSpeaking(false);
      setValue("searchInput", "");
      setIsInitialized(false);
      setIsUserTyping(false);
      setOriginalTranscript("");
      setIsNewSession(true);

      updateSearchState({
        searchInput: "",
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

      setTimeout(() => {
        setIsInitialized(true);
      }, 1000);

      resetSilenceTimer();
    }, 100);
  };

  /**
   * Stop the current voice recognition listening session
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

    if (transcript && transcript.trim() && !isSubmitting && !isUserTyping) {
      const confidence = transcript.confidence || 1.0;
      if (confidence >= 0.7) {
        setIsSubmitting(true);
        const filteredTranscript = filterProfanity(transcript);

        const hasOpenKeyword = containsOpenKeywords(filteredTranscript);

        if (hasOpenKeyword) {
          setIsSubmitting(false);
          return;
        }

        const correctedTranscript = transformGenieWords(filteredTranscript);
        onFormSubmit(correctedTranscript);

        setValue("searchInput", "");
        resetTranscript();
        setTimeout(() => {
          setIsSubmitting(false);
        }, 1000);
      }
    }

    setIsNewSession(true);
  };

  /**
   * Handle speech recognition errors from the browser API
   * @param {Object} event - Speech recognition error event object
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
      if (browserSupportsSpeechRecognition) {
        SpeechRecognition.stopListening();
      }
      clearTimeout(debounceTimeout);
    }
  };

  // Component initialization and setup
  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.getRecognition().onerror = handleSpeechRecognitionError;
    }
    resetTranscript();
    setHasStartedSpeaking(false);
    setIsSubmitting(false);
    setIsNewSession(true);

    setValue("searchInput", "");
    updateSearchState({ searchInput: "" });

    setTimeout(() => {
      setIsInitialized(true);
    }, 1000);
  }, [updateSearchState]);

  // Start listening when triggered by external components
  useEffect(() => {
    if (!isVoiceMode) {
      return;
    }

    if (inputVoiceSearch && isListening && !listening) {
      setTimeout(() => {
        startListening();
      }, 1000);
    } else if (
      inputVoiceSearch &&
      !isListening &&
      !listening &&
      !isUserTyping
    ) {
      setTimeout(() => {
        startListening();
      }, 500);
    }
  }, [inputVoiceSearch, isListening, listening, isUserTyping, isVoiceMode]);

  // Stop listening when voice mode is disabled
  useEffect(() => {
    if (!isVoiceMode && listening) {
      stopListening();
    }
  }, [isVoiceMode, listening]);

  // Detect when user starts typing to pause voice recognition
  useEffect(() => {
    if (
      searchInput &&
      originalTranscript &&
      searchInput !== originalTranscript &&
      isListening
    ) {
      setIsUserTyping(true);
      stopListening();
    }
  }, [searchInput, originalTranscript, isListening]);

  // Main transcript processing and state management
  useEffect(() => {
    if (isListening && !listening) {
      setTimeout(() => {
        startListening();
      }, 300);
    } else if (!isListening && listening && !isSubmitting) {
      stopListening();
    }

    if (transcript && !isNewSession && isInitialized) {
      const filteredTranscript = filterProfanity(transcript);

      const hasOpenKeyword = containsOpenKeywords(filteredTranscript);

      if (hasOpenKeyword) {
        return;
      }

      const correctedTranscript = transformGenieWords(filteredTranscript);

      const confidence = transcript.confidence || 1.0;
      if (confidence >= 0.7) {
        if (!originalTranscript) {
          setOriginalTranscript(correctedTranscript);
        }

        if (!hasStartedSpeaking) {
          setHasStartedSpeaking(true);
          setValue("searchInput", correctedTranscript);
        } else {
          setValue("searchInput", correctedTranscript);
        }
      }
    } else if (transcript && isNewSession) {
      setTimeout(() => {
        setIsNewSession(false);
      }, 100);
    }

    if (listening) {
      resetSilenceTimer();
    } else {
      clearSilenceTimer();
    }
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

  // Component cleanup and teardown
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
