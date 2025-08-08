import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import * as genieIcons from "../../assets/genieIcons";
import { useDispatch, useSelector } from "react-redux";
import { updateChat, updateSpeech, updateSearch, updateUI } from "Reducers/genie/reducer";
import {
  systemPhrases,
  analysisKeywords,
  openKeywords,
  closeKeywords,
  proceedingText,
  filterProfanity,
  containsProfanity,
  containsOpenKeywords,
  containsCloseKeywords,
  containsAnalysisKeywords,
  containsProceedingText,
} from "../command.js";
import constants from "../constants.json";

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
 */
function WakeupComponent({
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
  const [hasBeenWoken, setHasBeenWoken] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [awaitingNextCommand, setAwaitingNextCommand] = useState(false);
  const [awaitingProceedResponse, setAwaitingProceedResponse] = useState(false);
  const silenceTimeout = useRef(null);
  const accumulatedTranscript = useRef("");
  const isSpeakingRef = useRef(false);
  const audioContext = useRef(null);
  const audioBuffer = useRef(null);
  const isPlayingRef = useRef(false);
  const initAudioContext = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
  };

  const playAudio = async (audioFile) => {
    try {
      initAudioContext();

      if (isPlayingRef.current) {
        // Stop any currently playing audio
        audioContext.current.close();
        audioContext.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }

      const response = await fetch(audioFile);
      const arrayBuffer = await response.arrayBuffer();
      audioBuffer.current = await audioContext.current.decodeAudioData(
        arrayBuffer
      );

      const source = audioContext.current.createBufferSource();
      source.buffer = audioBuffer.current;
      source.connect(audioContext.current.destination);

      isPlayingRef.current = true;

      source.onended = () => {
        isPlayingRef.current = false;
        // Resume speech recognition after audio finishes
        if (document.visibilityState === "visible") {
          startRecognition();
        }
      };
      source.start(0);
    } catch (error) {
      console.error("Error playing audio:", error);
      isPlayingRef.current = false;
      // Resume speech recognition if there's an error
      if (document.visibilityState === "visible") {
        startRecognition();
      }
    }
  };

  const audioToPlay = (audioFile) => {
    playAudio(audioFile);
  };

  const startRecognition = () => {
    if (!browserSupportsSpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    // Don't start if VoiceRecognition is active
    if (inputVoiceSearch) {
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
      }).catch((err) => {
        console.error("Recognition start error:", err);
        setTimeout(startRecognition, 1000);
      });
    }
  };

  const stopRecognition = () => {
    if (!browserSupportsSpeechRecognition) {
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
    }
    SpeechRecognition.abortListening();
  };

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.warn(
        "Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari."
      );
      // Don't show error automatically - only show when user tries to use microphone
      // Just skip the speech recognition setup
    } else {
      // Always start listening when component mounts
      startRecognition();
      
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible" && !isSpeakingRef.current && !inputVoiceSearch) {
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
        if (!isSpeakingRef.current) {
          window.speechSynthesis.cancel();
        }
      };
    }
  }, []);

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
        dispatch(
          updateSpeech({
            wakeup: true,
          })
        );
        setAwaitingNextCommand(true);
        setIsProcessing(false);
        return;
      }
    }

    // Quick check for close keywords using RegExp
    const hasCloseKeyword = containsCloseKeywords(lowerTranscript);
    
    if ((wakeup || showHome) && hasCloseKeyword) {
      audioToPlay(genieIcons?.okAudio);
      dispatch(
        updateSpeech({
          wakeup: false,
        })
      );
      dispatch(
        updateUI({
          showAlert: false,
        })
      );
      dispatch(
        updateChat({
          userCommand: "",
        })
      );
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
          dispatch(
            updateSpeech({
              wakeup: false,
            })
          );
          dispatch(
            updateUI({
              showAlert: false,
            })
          );
          setShowHome(true);
          handleNewChat();
          setHasBeenWoken(false);
          dispatch(
            updateChat({
              userCommand: filteredTranscript,
            })
          );
          // Store the voice prompt in search state for VoiceRecognition to use
          dispatch(
            updateSearch({
              searchInput: filteredTranscript,
            })
          );
        }, 300);

        setTimeout(() => {
          audioToPlay(genieIcons?.wouldYouLikeAudio);
          resetTranscript();
          setAwaitingProceedResponse(true);
        }, 1500);
      } else {
        audioToPlay(genieIcons?.couldNotAssistAudio);
        setTimeout(() => {
          dispatch(
            updateSpeech({
              wakeup: false,
            })
          );
          dispatch(
            updateUI({
              showAlert: false,
            })
          );
          setShowHome(true);
          handleNewChat();
          setHasBeenWoken(false);
          dispatch(
            updateChat({
              userCommand: "",
            })
          );
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
        dispatch(
          updateSearch({
            searchInput: "",
          })
        );
      } else {
        audioToPlay(genieIcons?.checkGenieAudio);
        setTimeout(() => {
          dispatch(
            updateSpeech({
              wakeup: false,
            })
          );
          dispatch(
            updateUI({
              showAlert: false,
            })
          );
          setShowHome(true);
          handleNewChat();
          setHasBeenWoken(false);
          dispatch(
            updateChat({
              userCommand: "",
            })
          );
        }, 1500);
      }
    }

    setIsProcessing(false);
  };

  useEffect(() => {
    if (hasBeenWoken) {
      const timeout = setTimeout(() => {
        setHasBeenWoken(false);
        dispatch(
          updateSpeech({
            wakeup: false,
          })
        );
        dispatch(
          updateUI({
            showAlert: false,
          })
        );
        audioToPlay(genieIcons?.Closingnow);
      }, 15000);

      return () => clearTimeout(timeout);
    }
  }, [hasBeenWoken]);

  // Stop listening when VoiceRecognition starts
  useEffect(() => {
    if (inputVoiceSearch) {
      // VoiceRecognition has started, stop Wakeup listening
      stopRecognition();
    } else if (!inputVoiceSearch && !isSpeakingRef.current) {
      // VoiceRecognition has stopped, resume Wakeup listening if not speaking
      startRecognition();
    }
  }, [inputVoiceSearch]);

  useEffect(() => {
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);
  // useEffect(() => {
  //     if (typingEnd) {
  //         setTimeout(() => {
  //             dispatch(
  //                 updateSpeech({
  //                     inputVoiceSearch: true,
  //                     isListening: true,
  //                     listeningText: 'Listening...',
  //                     transcript: '',
  //                     wakeup: false,
  //                 }),
  //             );
  //         }, 2000);
  //     }
  //     resetTranscript();
  // }, [typingEnd]);

  return <></>;
}

export default WakeupComponent;
