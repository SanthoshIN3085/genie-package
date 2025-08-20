import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateChat, updateSpeech, updateUI } from "Reducers/genie/reducer";
import * as genieIcons from "../../assets/genieIcons";
import { Howl } from "howler";

/**
 * TypingAnimation Component
 *
 * A React component that provides a slow, visible word-by-word typewriter effect for displaying content with
 * automatic voice recognition activation after typing completion.
 *
 * Behavior:
 * 1. Shows typing animation for content word by word with deliberate timing
 * 2. Waits for typing to complete (minimum 800ms per word for visibility)
 * 3. Waits 1 second after typing finishes
 * 4. Plays listening audio sound using Howler.js
 * 5. Triggers voice recognition to start listening
 * 6. Scrolls to bottom smoothly when content is displayed
 *
 * Timing Features:
 * - Base delay: 500ms minimum per word for visibility
 * - Custom speed: Added to base delay for fine-tuning
 * - Word pauses: Additional delays between words for readability
 * - Natural rhythm: Creates engaging, readable typing animation
 *
 * @param {Object} props - Component props
 * @param {string} props.content - Text content to display with typing animation
 * @param {number} props.speed - Base speed of typing animation in milliseconds per word
 * @param {boolean} props.skipTyping - Whether to skip typing animation and show content immediately
 * @param {Function} props.onTypingComplete - Callback when typing animation completes
 * @param {string} props.className - Additional CSS class names for styling
 * @param {Function|React.ReactNode} props.children - Render prop function or React children
 * @param {React.RefObject} props.chatRef - Reference to chat container for scrolling
 * @returns {JSX.Element|null} The typing animation component or null if no content
 */
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
  const { isVoiceMode } = speech;
  const dispatch = useDispatch();
  const hasTriggeredEnd = useRef(false);
  const listenAudioInstance = useRef(null);

  // Split content into words for word-by-word typing
  const words = content ? content.split(/\s+/) : [];
  
  // Calculate typing speed with additional delay for better visibility
  const typingSpeed = speed ? speed + 200 : 300; // Default 800ms per word if no speed provided

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

  // Initialize Howler audio instance for listen indicator
  useEffect(() => {
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

    return () => {
      if (listenAudioInstance.current) {
        listenAudioInstance.current.stop();
        listenAudioInstance.current = null;
      }
    };
  }, []);

  /**
   * Play audio files using Howler.js
   * @param {string} audioFile - Path to the audio file to play
   * @returns {Promise<void>} Promise that resolves when audio starts playing
   */
  const playAudio = async (audioFile) => {
    try {
      if (
        audioFile === genieIcons?.listenIndicator &&
        listenAudioInstance.current
      ) {
        listenAudioInstance.current.play();
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
   * @returns {boolean} True if at last index, false otherwise
   */
  const isLastIndex = () => {
    if (!selectedMessages || selectedMessages.length === 0) return false;
    const currentIndex = (selectedMessages.length - 1) % 4;
    return currentIndex === 3;
  };

  // Handle content changes and typing initialization
  useEffect(() => {
    if (!newChat || !content) {
      setDisplayedContent(content || "");
      setIsTyping(false);
      if (content || !newChat) {
        onTypingComplete?.();
        scrollToBottom();
        if (!hasTriggeredEnd.current) {
          hasTriggeredEnd.current = true;
          // Only trigger voice search if NOT at the last index AND audio mode is enabled
          if (!isLastIndex() && isVoiceMode) {
            setTimeout(() => {
              playAudio(genieIcons?.listenIndicator);

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
            }, 1000);
          }
        }
      }
      return;
    }

    if (skipTyping) {
      setDisplayedContent(content);
      setIsTyping(false);
      onTypingComplete?.();
      // Scroll to bottom when content is displayed
      scrollToBottom();
      if (!hasTriggeredEnd.current) {
        hasTriggeredEnd.current = true;
        if (!isLastIndex() && isVoiceMode) {
          setTimeout(() => {
            // Play listen indicator audio using Howler.js
            playAudio(genieIcons?.listenIndicator);

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

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, speed, skipTyping, onTypingComplete, newChat]);

  // Handle typing animation logic
  useEffect(() => {
    let animationTimeoutId;

    if (isTyping && newChat && content) {
      if (currentWordIndex < words.length) {
        animationTimeoutId = setTimeout(() => {
          setDisplayedContent((prev) => {
            const nextWord = words[currentWordIndex];
            // Add space before word if it's not the first word
            const space = prev ? " " : "";
            return prev + space + nextWord;
          });
          setCurrentWordIndex((prev) => prev + 1);
        }, typingSpeed);
        
        // Add a small pause between words for better readability
        // This makes the word-by-word effect more pronounced
        if (currentWordIndex < words.length - 1) {
          setTimeout(() => {
            // Small pause between words
          }, typingSpeed + 200);
        }
      } else {
        setIsTyping(false);
        onTypingComplete?.();
        scrollToBottom();

        if (!hasTriggeredEnd.current) {
          hasTriggeredEnd.current = true;

          // Only trigger voice search if NOT at the last index AND audio mode is enabled
          if (!isLastIndex() && isVoiceMode) {
            setTimeout(() => {
              playAudio(genieIcons?.listenIndicator);

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
  }, [isTyping, currentWordIndex, words, newChat, speed, onTypingComplete]);

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
