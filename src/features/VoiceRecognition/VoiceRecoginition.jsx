import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useFormContext } from 'react-hook-form';
import {
    updateSelectedPrompt,
    updatePromptGalleryFlag,
    updateUI,
    updateChat,
    updateSpeech,
    updateSearch,
    updateSettings,
    resetGenie,
} from 'Reducers/genie/reducer';
import { useDispatch, useSelector } from 'react-redux';
import { transformGenieWords } from '../utils/util';

const VoiceRecognition = ({ onFormSubmit = () => {} }) => {
    const { speech, search } = useSelector((state) => state.genie);
    const { isListening, inputVoiceSearch } = speech || {};
    const { searchInput } = search || {};
    const dispatch = useDispatch();
    const { control, setValue, setFocus, getValues, watch, clearErrors, setError } = useFormContext();

    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasStartedSpeaking, setHasStartedSpeaking] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const debounceDelay = 2000; // 2 seconds to wait after last speech before auto-submit
    const continuousListeningOptions = useMemo(
        () => ({
            continuous: true,
            interimResults: true,
            language: 'en-IN',
            maxAlternatives: 1,
            confidence: 0.7,
        }),
        [],
    );

    const updateSpeechState = useCallback((data) => dispatch(updateSpeech(data)), [dispatch]);
    const updateChatState = useCallback((data) => dispatch(updateChat(data)), [dispatch]);

    const startListening = () => {
        resetTranscript();
        setHasStartedSpeaking(false);
        setValue('searchInput', '');
        setIsInitialized(false);
        
        // Clear any stored searchInput to prevent repeated submission
        dispatch(updateSearch({ searchInput: "" }));
        
        if (!browserSupportsSpeechRecognition) {
            updateChatState({
                errorTranscript:
                    'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.',
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
    };

    const stopListening = () => {
        if (browserSupportsSpeechRecognition) {
            SpeechRecognition.stopListening();
        }
        updateSpeechState({
            isListening: false,
            inputVoiceSearch: false,
        });
        clearTimeout(debounceTimeout);
        
        // Manual submission if user stops listening and there's a transcript
        if (transcript && transcript.trim() && !isSubmitting) {
            const confidence = transcript.confidence || 1.0;
            if (confidence >= 0.7) {
                setIsSubmitting(true);
                const correctedTranscript = transformGenieWords(transcript);
                onFormSubmit(correctedTranscript);
                // Clear the input field after submission
                
                setValue('searchInput', '');
                resetTranscript();
                // Reset the submitting flag after a short delay
                setTimeout(() => {
                    setIsSubmitting(false);
                }, 1000);
            }
        }
    };

    const handleSpeechRecognitionError = (event) => {
        let errorMessage;
        if (event.error === 'not-allowed') {
            errorMessage = 'Microphone access denied. Please enable it for voice interaction.';
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
            updateSpeechState({
                isListening: false,
                inputVoiceSearch: false,
            });
            clearTimeout(debounceTimeout);
        } else if (event.error === 'network') {
            errorMessage = 'Network error. Please check your connection.';
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
            updateSpeechState({
                isListening: false,
                inputVoiceSearch: false,
            });
            clearTimeout(debounceTimeout);
        }
    };

    //componentDidMount Phase
    useEffect(() => {
        if (browserSupportsSpeechRecognition) {
            SpeechRecognition.getRecognition().onerror = handleSpeechRecognitionError;
        }
        resetTranscript();
        setHasStartedSpeaking(false);
        setIsSubmitting(false);
        
        // Don't initialize with stored searchInput to prevent repeated submission
        // Clear any existing input to start fresh
        setValue('searchInput', '');
        
        // Clear any stored searchInput in Redux state as well
        dispatch(updateSearch({ searchInput: "" }));
        
        // Set initialized flag after a short delay to prevent immediate auto-submission
        setTimeout(() => {
            setIsInitialized(true);
        }, 1000);
    }, [dispatch]);

    // Start listening when inputVoiceSearch becomes true (triggered by TypingAnimation)
    useEffect(() => {
        if (inputVoiceSearch && isListening && !listening) {
            // Add a delay before starting to listen to ensure typing is completely finished
            setTimeout(() => {
                startListening();
            }, 1000); // 1 second delay after typing finishes
        }
    }, [inputVoiceSearch, isListening, listening]);

    //componentDidUpdate Phase
    useEffect(() => {
        if (isListening && !listening) {
            setTimeout(() => {
                startListening();
            }, 300);
        } else if (!isListening && listening && !isSubmitting) {
            stopListening();
        }

        // Bind transcript to input field in real-time
        if (transcript) {
            const correctedTranscript = transformGenieWords(transcript);
            // Check if the transcript has sufficient confidence (0.7 threshold)
            const confidence = transcript.confidence || 1.0;
            if (confidence >= 0.7) {
                // If user starts speaking again, clear the initial voice prompt
                if (!hasStartedSpeaking) {
                    setHasStartedSpeaking(true);
                    setValue('searchInput', correctedTranscript);
                } else {
                    setValue('searchInput', correctedTranscript);
                }
            }
        }

        // Auto-submit: submit after user stops speaking for debounceDelay (2 seconds)
        if (listening && transcript && !isSubmitting && isInitialized) {
            clearTimeout(debounceTimeout);
            const id = setTimeout(() => {
                // Only submit if still not speaking after debounceDelay and not already submitting
                if (transcript && transcript.trim() && !isSubmitting) {
                    setIsSubmitting(true);
                    const correctedTranscript = transformGenieWords(transcript);
                    
                    onFormSubmit(correctedTranscript);
                    resetTranscript();
                    // Clear the input field after submission
                    setValue('searchInput', '');
                    // Reset the submitting flag after a short delay
                    setTimeout(() => {
                        setIsSubmitting(false);
                    }, 1000);
                }
            }, debounceDelay);
            setDebounceTimeout(id);
        }
        // If listening but transcript is empty, clear any pending submit
        if (listening && !transcript) {
            clearTimeout(debounceTimeout);
        }
    }, [isListening, listening, transcript, debounceDelay, isSubmitting]);

    //componentWillUnmount Phase
    useEffect(() => {
        return () => {
            if (browserSupportsSpeechRecognition) {
                SpeechRecognition.stopListening();
            }
            clearTimeout(debounceTimeout);
            resetTranscript();
        };
    }, []);

    return null;
};

export default VoiceRecognition;
