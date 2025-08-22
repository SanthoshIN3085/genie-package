import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateChat, updateSpeech, updateUI } from "Reducers/genie/reducer";
import * as genieIcons from "../../assets/genieIcons";
import { Howl } from "howler";

const TypingAnimation = ({
  content,
  speed,
  skipTyping = false,
  onTypingComplete,
  className = "",
  children,
  chatRef,
}) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const timeoutRef = useRef(null);
  const { chat, speech } = useSelector((state) => state.genie);
  const { isVoiceMode, isAudioMode } = speech;
  const dispatch = useDispatch();
  const hasTriggeredEnd = useRef(false);
  const listenAudioInstance = useRef(null);
  const shouldIAudioInstance = useRef(null);
  const gotItAudioInstance = useRef(null);
  const doneAudioInstance = useRef(null);
  const hereResultsAudioInstance = useRef(null);

  // Check if this is the first AI response and audio hasn't been played yet
  const shouldPlayFirstAudio = !chat.hasPlayedFirstAudio;

  // Split content into words for word-by-word typing
  const words = useMemo(() => (content ? content.split(/\s+/) : []), [content]);

  // Calculate typing speed with additional delay for better visibility
  const baseTypingSpeed = speed ? speed + 300 : 500;
  const [typingSpeed, setTypingSpeed] = useState(baseTypingSpeed);

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

  // Initialize Howler audio instances
  useEffect(() => {
    // Listen indicator audio
    if (genieIcons?.listenIndicator) {
      listenAudioInstance.current = new Howl({
        src: [genieIcons.listenIndicator],
        html5: true,
        preload: true,
        onloaderror: (id, error) => {
          console.error("Listen indicator audio load error:", error);
        },
        onerror: (id, error) => {
          console.error("Listen indicator audio error:", error);
        },
      });
    }

    // Should I audio for first typing
    if (genieIcons?.shouldIAudio) {
      shouldIAudioInstance.current = new Howl({
        src: [genieIcons.shouldIAudio],
        html5: true,
        preload: true,
        onloaderror: (id, error) => {
          console.error("Should I audio load error:", error);
        },
        onerror: (id, error) => {
          console.error("Should I audio error:", error);
        },
      });
    }

    // Got it audio for second typing
    if (genieIcons?.gotItAudio) {
      gotItAudioInstance.current = new Howl({
        src: [genieIcons.gotItAudio],
        html5: true,
        preload: true,
        onloaderror: (id, error) => {
          console.error("Got it audio load error:", error);
        },
        onerror: (id, error) => {
          console.error("Got it audio error:", error);
        },
      });
    }

    // Done audio for third typing
    if (genieIcons?.doneAudio) {
      doneAudioInstance.current = new Howl({
        src: [genieIcons.doneAudio],
        html5: true,
        preload: true,
        onloaderror: (id, error) => {
          console.error("Done audio load error:", error);
        },
        onerror: (id, error) => {
          console.error("Done audio error:", error);
        },
      });
    }

    if (genieIcons?.hereResultsAudio) {
      hereResultsAudioInstance.current = new Howl({
        src: [genieIcons?.hereResultsAudio],
        html5: true,
        preload: true,
        onloaderror: (id, error) => {
          console.error("Here are the audio error: ", error);
        },
        onerror: (id, error) => {
          console.error("Here are the audio error: ", error);
        },
      });
    }
    return () => {
      if (listenAudioInstance.current) {
        listenAudioInstance.current.stop();
        listenAudioInstance.current = null;
      }
      if (shouldIAudioInstance.current) {
        shouldIAudioInstance.current.stop();
        shouldIAudioInstance.current = null;
      }
      if (gotItAudioInstance.current) {
        gotItAudioInstance.current.stop();
        gotItAudioInstance.current = null;
      }
      if (doneAudioInstance.current) {
        doneAudioInstance.current.stop();
        doneAudioInstance.current = null;
      }
      if (hereResultsAudioInstance.current) {
        hereResultsAudioInstance.current.stop();
        hereResultsAudioInstance.current = null;
      }
    };
  }, []);

  /**
   * Play audio files using Howler.js
   */
  const playAudio = async (audioFile) => {
    try {
      if (
        audioFile === genieIcons?.listenIndicator &&
        listenAudioInstance.current
      ) {
        listenAudioInstance.current.play();
      } else if (
        audioFile === genieIcons?.shouldIAudio &&
        shouldIAudioInstance.current
      ) {
        shouldIAudioInstance.current.play();
      } else if (
        audioFile === genieIcons?.gotItAudio &&
        gotItAudioInstance.current
      ) {
        gotItAudioInstance.current.play();
      } else if (
        audioFile === genieIcons?.doneAudio &&
        doneAudioInstance.current
      ) {
        doneAudioInstance.current.play();
      } else if (
        audioFile === genieIcons?.hereResultsAudio &&
        hereResultsAudioInstance.current
      ) {
        hereResultsAudioInstance.current.play();
      } else {
        const howlInstance = new Howl({
          src: [audioFile],
          html5: true,
          preload: false,
        });
        howlInstance.play();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const { newChat, message, selectedMessages } = chat;

  /**
   * Smoothly scroll chat container to bottom
   */
  const scrollToBottom = () => {
    if (chatRef?.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  /**
   * Check if current message is at the last index
   */
  const isLastIndex = () => {
    if (!selectedMessages || selectedMessages.length === 0) return false;
    const currentIndex = (selectedMessages.length - 1) % 4;
    return currentIndex === 3;
  };

  // Handle content changes and typing initialization
  useEffect(() => {
    if (!content) {
      setDisplayedContent("");
      setIsTyping(false);
      setTypingSpeed(baseTypingSpeed);
      return;
    }

    if (skipTyping) {
      setDisplayedContent(content);
      setIsTyping(false);
      setTypingSpeed(baseTypingSpeed);
      onTypingComplete?.();
      scrollToBottom();
      if (!hasTriggeredEnd.current) {
        hasTriggeredEnd.current = true;
        if (!isLastIndex() && isVoiceMode) {
          debugger;
          setTimeout(() => {
            // Play listen indicator only if audio mode is enabled
            if (isAudioMode) {
              playAudio(genieIcons?.listenIndicator);
            }
            updateUIState({
              typingEnd: true,
            });
            updateSpeechState({
              inputVoiceSearch: true,
              isListening: true,
              listeningText: "Listening...",
              wakeup: false,
              transcript: "",
            });
          }, 500);
        }
      }
      return;
    }

    // Reset for new typing animation
    setDisplayedContent("");
    setIsTyping(true);
    setCurrentWordIndex(0);
    hasTriggeredEnd.current = false;
    setTypingSpeed(baseTypingSpeed);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, speed, skipTyping, onTypingComplete, baseTypingSpeed]);

  // Adjust typing speed for last index
  useEffect(() => {
    if (isLastIndex()) {
      setTypingSpeed(baseTypingSpeed + 150);
    } else {
      setTypingSpeed(baseTypingSpeed);
    }
  }, [isLastIndex, baseTypingSpeed]);

  // Handle typing animation logic
  useEffect(() => {
    let animationTimeoutId;

    if (isTyping && content) {
      if (currentWordIndex < words.length) {
        // Play audio based on AI response count (only if audio mode is enabled)
        if (currentWordIndex === 0) {
          if (shouldPlayFirstAudio) {
            // First AI response - play shouldI audio if audio mode is enabled
            if (isAudioMode) {
              playAudio(genieIcons?.shouldIAudio);
            }
            updateChatState({
              hasPlayedFirstAudio: true,
              aiResponseCount: chat.aiResponseCount + 1,
            });
          } else if (chat.aiResponseCount === 1) {
            // Second AI response - play gotIt audio if audio mode is enabled
            if (isAudioMode) {
              playAudio(genieIcons?.gotItAudio);
            }
            updateChatState({ aiResponseCount: chat.aiResponseCount + 1 });
          } else if (chat.aiResponseCount === 2) {
            // Third AI response - play done audio if audio mode is enabled
            if (isAudioMode) {
              playAudio(genieIcons?.doneAudio);
            }
            updateChatState({ aiResponseCount: chat.aiResponseCount + 1 });
          } else if (chat.aiResponseCount < 10) {
            // For subsequent responses, just increment the counter
            updateChatState({ aiResponseCount: chat.aiResponseCount + 1 });
          }
        }

        animationTimeoutId = setTimeout(() => {
          setDisplayedContent((prev) => {
            const nextWord = words[currentWordIndex];
            const space = prev ? " " : "";
            return prev + space + nextWord;
          });
          setCurrentWordIndex((prev) => prev + 1);
        }, typingSpeed);

        // Add a small pause between words for better readability
        if (currentWordIndex < words.length - 1) {
          setTimeout(() => {
            // Small pause between words
          }, typingSpeed + 200);
        }
      } else {
        setIsTyping(false);
        onTypingComplete?.();
        scrollToBottom();

        // Reset typing speed after animation completes
        setTypingSpeed(baseTypingSpeed);

        if (!hasTriggeredEnd.current) {
          hasTriggeredEnd.current = true;

          // Only trigger voice search if NOT at the last index AND voice mode is enabled
          if (!isLastIndex() && isVoiceMode) {
            setTimeout(() => {
              // Play listen indicator only if audio mode is enabled
              if (isAudioMode) {
                playAudio(genieIcons?.listenIndicator);
              }

              updateUIState({
                typingEnd: true,
              });
              updateSpeechState({
                inputVoiceSearch: true,
                isListening: true,
                listeningText: "Listening...",
                transcript: "",
              });
            }, 500);
          }
        }
      }
    }

    return () => {
      clearTimeout(animationTimeoutId);
    };
  }, [isTyping, currentWordIndex, words, speed, onTypingComplete]);

  // Cleanup timeout references on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Guard against undefined content in render
  if (!content && !displayedContent) {
    return null;
  }

  return (
    <div className={`typing-animation ${className}`}>
      {children ? (
        children(displayedContent, isTyping)
      ) : (
        <span className="typing-content">{displayedContent}</span>
      )}
    </div>
  );
};

export default TypingAnimation;
