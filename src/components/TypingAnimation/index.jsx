import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateChat, updateSpeech, updateUI } from "Reducers/genie/reducer";
import * as genieIcons from "../../assets/genieIcons";
import { Howl } from "howler";

/**
 * TypingAnimation Component
 * 
 * A React component that provides a typewriter effect for displaying content with
 * automatic voice recognition activation after typing completion.ṇ
 * 
 * Behavior:
 * 1. Shows typing animation for content
 * 2. Waits for typing to complete
 * 3. Waits 1 second after typing finishes
 * 4. Plays listening audio sound using Howler.js
 * 5. Triggers voice recognition to start listening
 * 6. Scrolls to bottom smoothly when content is displayed
 * 
 * @param {Object} props - Component props
 * @param {string} props.content - The text content to be displayed with typing animation
 * @param {number} props.speed - The speed of typing animation in milliseconds
 * @param {boolean} props.skipTyping - Whether to skip typing animation and show content immediately
 * @param {Function} props.onTypingComplete - Callback function called when typing animation completes
 * @param {string} props.className - Additional CSS class names for styling
 * @param {Function|React.ReactNode} props.children - Render prop function or React children
 * @param {React.RefObject} props.chatRef - Reference to the chat container for scrolling
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);
  const { chat, speech } = useSelector((state) => state.genie);
  const { isAudioMode } = speech;
  const dispatch = useDispatch();
  const hasTriggeredEnd = useRef(false);
  const listenAudioInstance = useRef(null);

  /**
   * useEffect: Initialize Howler audio instance for listen indicator
   * 
   * Creates and preloads the listen indicator audio using Howler.js.
   * Sets up event handlers for audio loading, playing, and error handling.
   * Provides cleanup function to stop and nullify audio instance on unmount.
   * 
   * Dependencies: None (runs only once on mount)
   */
  useEffect(() => {
    if (genieIcons?.listenIndicator) {
      listenAudioInstance.current = new Howl({
        src: [genieIcons.listenIndicator],
        html5: true,
        preload: true,
        onload: () => {
          console.log("Listen indicator audio loaded");
        },
        onloaderror: (id, error) => {
          console.error("Listen indicator audio load error:", error);
        },
        onplay: () => {
          // console.log("Listen indicator audio playing");
        },
        onend: () => {
          // console.log("Listen indicator audio ended");
        },
        onerror: (id, error) => {
          console.error("Listen indicator audio error:", error);
        }
      });
    }

    // Cleanup function
    return () => {
      if (listenAudioInstance.current) {
        listenAudioInstance.current.stop();
        listenAudioInstance.current = null;
      }
    };
  }, []);

  /**
   * playAudio: Play audio files using Howler.js
   * 
   * Handles audio playback for different audio files. Uses preloaded Howler instance
   * for listen indicator audio and creates new instances for other audio files.
   * Includes error handling for audio playback failures.
   * 
   * @param {string} audioFile - Path to the audio file to play
   * @returns {Promise<void>} Promise that resolves when audio starts playing
   */
  const playAudio = async (audioFile) => {
    try {
      if (audioFile === genieIcons?.listenIndicator && listenAudioInstance.current) {
        // Use the preloaded Howler instance for listen indicator
        listenAudioInstance.current.play();
      } else {
        // Fallback to creating a new Howl instance for other audio files
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
   * scrollToBottom: Smoothly scroll chat container to bottom
   * 
   * Uses smooth scrolling behavior to scroll the chat container to its bottom.
   * Only executes if chatRef is provided and valid.
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
   * isLastIndex: Check if current message is at the last index
   * 
   * Determines if the current message is at the last position in the selected messages array.
   * Uses modulo operation to handle circular indexing with 4 positions.
   * 
   * @returns {boolean} True if at last index, false otherwise
   */
  const isLastIndex = () => {
    if (!selectedMessages || selectedMessages.length === 0) return false;
    const currentIndex = (selectedMessages.length - 1) % 4;
    return currentIndex === 3;
  };

  /**
   * useEffect: Handle content changes and typing initialization
   * 
   * Manages the initial state when content changes. Handles cases for:
   * - No new chat or content (immediate display)
   * - Skip typing mode (immediate display with voice activation)
   * - New typing animation (reset state and start animation)
   * 
   * Triggers voice recognition activation after content display (unless at last index).
   * 
   * Dependencies: content, speed, skipTyping, onTypingComplete, newChat
   */
  useEffect(() => {
    if (!newChat || !content) {
      setDisplayedContent(content || "");
      setIsTyping(false);
      if (content || !newChat) {
        onTypingComplete?.();
        // Scroll to bottom when content is displayed
        scrollToBottom();
        if (!hasTriggeredEnd.current) {
          hasTriggeredEnd.current = true;
          // Only trigger voice search if NOT at the last index AND audio mode is enabled
          if (!isLastIndex() && isAudioMode) {
            setTimeout(() => {
              // Play listen indicator audio using Howler.js
              playAudio(genieIcons?.listenIndicator);
              
              dispatch(
                updateUI({
                  typingEnd: true,
                })
              );
              dispatch(
                updateSpeech({
                  inputVoiceSearch: true,
                  isListening: true,
                  listeningText: "Listening...",
                  wakeup: false,
                  transcript: "",
                })
              );
            }, 1000); // Increased delay to 1 second
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
        // Only trigger voice search if NOT at the last index AND audio mode is enabled
        if (!isLastIndex() && isAudioMode) {
          setTimeout(() => {
            // Play listen indicator audio using Howler.js
            playAudio(genieIcons?.listenIndicator);
            
            dispatch(
              updateUI({
                typingEnd: true,
              })
            );
            dispatch(
              updateSpeech({
                inputVoiceSearch: true,
                isListening: true,
                listeningText: "Listening...",
                wakeup: false,
                transcript: "",
              })
            );
          }, 500); // Increased delay to 1 second
        }
      }
      return;
    }

    // Reset for new typing animation
    setDisplayedContent("");
    setIsTyping(true);
    setCurrentIndex(0);
    hasTriggeredEnd.current = false;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, speed, skipTyping, onTypingComplete, newChat]);

  /**
   * useEffect: Handle typing animation logic
   * 
   * Manages the core typing animation by incrementally displaying content characters.
   * Controls the timing of character display based on the speed prop.
   * Triggers completion callbacks and voice recognition activation when typing finishes.
   * 
   * Dependencies: isTyping, displayedContent, content, newChat, speed, onTypingComplete
   */
  useEffect(() => {
    let animationTimeoutId;

    if (isTyping && newChat && content) {
      if (displayedContent.length < content.length) {
        animationTimeoutId = setTimeout(() => {
          setDisplayedContent((prev) => content.substring(0, prev.length + 1));
        }, speed);
      } else {
        setIsTyping(false);
        onTypingComplete?.();
        // Scroll to bottom when typing animation completes
        scrollToBottom();
        
        if (!hasTriggeredEnd.current) {
          hasTriggeredEnd.current = true;
          
          // Only trigger voice search if NOT at the last index AND audio mode is enabled
          if (!isLastIndex() && isAudioMode) {
            setTimeout(() => {
              // Play listen indicator audio using Howler.js
              playAudio(genieIcons?.listenIndicator);
              
              dispatch(
                updateUI({
                  typingEnd: true,
                })
              );
              dispatch(
                updateSpeech({
                  inputVoiceSearch: true,
                  isListening: true,
                  listeningText: "Listening...",
                  wakeup: false,
                  transcript: "",
                })
              );
            }, 500); // Increased delay to 1 second
          }
        }
      }
    }

    return () => {
      clearTimeout(animationTimeoutId);
    };
  }, [isTyping, displayedContent, content, newChat, speed, onTypingComplete]);

  /**
   * useEffect: Cleanup timeout references on unmount
   * 
   * Ensures that any pending timeout references are cleared when the component unmounts
   * to prevent memory leaks and potential errors.
   * 
   * Dependencies: None (runs only once on unmount)
   */
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
