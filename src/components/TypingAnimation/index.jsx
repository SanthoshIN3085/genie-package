import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateChat, updateSpeech, updateUI } from "Reducers/genie/reducer";
import * as genieIcons from "../../assets/genieIcons";
import { Howl } from "howler";

/**
 * TypingAnimation Component
 * 
 * Behavior:
 * 1. Shows typing animation for content
 * 2. Waits for typing to complete
 * 3. Waits 1 second after typing finishes
 * 4. Plays listening audio sound using Howler.js
 * 5. Triggers voice recognition to start listening
 * 6. Scrolls to bottom smoothly when content is displayed
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
  const { chat } = useSelector((state) => state.genie);
  const dispatch = useDispatch();
  const hasTriggeredEnd = useRef(false);
  const listenAudioInstance = useRef(null);

  // Initialize Howler audio instance for listen indicator
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

  // Audio playback function using Howler.js
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
  
  // Function to scroll to bottom smoothly
  const scrollToBottom = () => {
    if (chatRef?.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };
  
  // last index checker
  const isLastIndex = () => {
    if (!selectedMessages || selectedMessages.length === 0) return false;
    const currentIndex = (selectedMessages.length - 1) % 4;
    return currentIndex === 3;
  };

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
          // Only trigger voice search if NOT at the last index
          if (!isLastIndex()) {
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
        // Only trigger voice search if NOT at the last index
        if (!isLastIndex()) {
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
          
          // Only trigger voice search if NOT at the last index
          if (!isLastIndex()) {
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
