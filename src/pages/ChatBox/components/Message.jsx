import React, { useState, useEffect, useRef } from "react";
import ResponseData from "./ResponseData";
import AnalyticsResponseData from "./AnalyticsResponseData";
import * as genieIcons from "../../../assets/genieIcons";
import RSTooltip from "Components/RSTooltip";
import TypingAnimation from "Components/TypingAnimation";
import { useSelector } from "react-redux";
import {
  isAudience,
  isCommunication,
  isAnalytics,
} from "../../../constant/Sectors/banking";
import { MESSAGE } from "../../../constant/textConstants";

const Message = ({
  type,
  content,
  timestamp,
  messageId,
  responseData,
  index,
  messages,
  skipTyping = false,
  typingSpeed = 10,
  onTypingComplete,
  chatRef,
}) => {
  const [isCopyClick, setIsCopyClick] = useState(false);
  const [isIdCopyClick, setIsIdCopyClick] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isIdHovered, setIsIdHovered] = useState(false);
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0);
  const [currentTypingContent, setCurrentTypingContent] = useState("");
  const [isSequentialTyping, setIsSequentialTyping] = useState(false);
  const [typingArray, setTypingArray] = useState([]);

  // Separate state for analytics sequential typing
  const [analyticsTypingIndex, setAnalyticsTypingIndex] = useState(0);
  const [analyticsTypingContent, setAnalyticsTypingContent] = useState("");
  const [isAnalyticsSequentialTyping, setIsAnalyticsSequentialTyping] =
    useState(false);
  const [analyticsTypingArray, setAnalyticsTypingArray] = useState([]);
  const [completedTypingSteps, setCompletedTypingSteps] = useState([]);
  const { ui, chat } = useSelector((state) => state.genie);
  const { isDarkMode, genieLoading } = ui;
  const { generateCard, skipTypingEffect } = chat;

  const isLastIndex = index === messages?.length - 1;

  const isUser = type === MESSAGE.MESSAGE_TYPES.USER;

  // Check if this message should use sequential typing
  const shouldUseSequentialTyping =
    !isUser && responseData?.dataRepresentation === 1;

  // Check if this message should use analytics sequential typing (different behavior)
  const shouldUseAnalyticsSequentialTyping =
    !isUser && responseData?.dataRepresentation === 2;

  // Get typing array based on generateCard value
  const getTypingArray = () => {
    if (!shouldUseSequentialTyping) return null;

    if (generateCard === MESSAGE.GENERATE_CARDS.AUDIENCE) return isAudience;
    if (generateCard === MESSAGE.GENERATE_CARDS.COMMUNICATION) return isCommunication;

    return null;
  };

  // Get analytics typing array
  const getAnalyticsTypingArray = () => {
    if (!shouldUseAnalyticsSequentialTyping) return null;
    return isAnalytics;
  };

  // Handle sequential typing animation
  useEffect(() => {
    if (!shouldUseSequentialTyping) return;

    const array = getTypingArray();
    if (!array) return;

    setTypingArray(array);
    setIsSequentialTyping(true);
    setCurrentTypingIndex(0);
    setCurrentTypingContent(array[0]);
    setCompletedTypingSteps([]);
  }, [responseData, shouldUseSequentialTyping]);

  // Handle analytics sequential typing animation
  useEffect(() => {
    if (!shouldUseAnalyticsSequentialTyping) return;

    const array = getAnalyticsTypingArray();
    if (!array) return;

    setAnalyticsTypingArray(array);
    setIsAnalyticsSequentialTyping(true);
    setAnalyticsTypingIndex(0);
    setAnalyticsTypingContent(array[0]);
    setCompletedTypingSteps([]);
  }, [responseData, shouldUseAnalyticsSequentialTyping]);

  // Handle typing completion and move to next item
  const handleTypingComplete = () => {
    if (!isSequentialTyping || !typingArray.length) return;

    const nextIndex = currentTypingIndex + 1;

    if (nextIndex < typingArray.length) {
      // Move to next typing item
      setCurrentTypingIndex(nextIndex);
      setCurrentTypingContent(typingArray[nextIndex]);

      // Scroll to bottom
      if (chatRef?.current) {
        chatRef.current.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    } else {
      // Finished sequential typing, show the final content and ResponseData
      setIsSequentialTyping(false);
      setCurrentTypingContent(content);

      // Scroll to bottom after showing ResponseData
      setTimeout(() => {
        if (chatRef?.current) {
          chatRef.current.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  };

  // Handle analytics typing completion and move to next item
  const handleAnalyticsTypingComplete = () => {
    if (!isAnalyticsSequentialTyping || !analyticsTypingArray.length) return;

    // Add current step to completed steps
    setCompletedTypingSteps((prev) => [
      ...prev,
      analyticsTypingArray[analyticsTypingIndex],
    ]);

    const nextIndex = analyticsTypingIndex + 1;

    if (nextIndex < analyticsTypingArray.length) {
      // Move to next typing item
      setAnalyticsTypingIndex(nextIndex);
      setAnalyticsTypingContent(analyticsTypingArray[nextIndex]);

      // Scroll to bottom
      if (chatRef?.current) {
        chatRef.current.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    } else {
      // Finished sequential typing, show the final content and ResponseData
      setIsAnalyticsSequentialTyping(false);
      setAnalyticsTypingContent(content);

      // Scroll to bottom after showing ResponseData
      setTimeout(() => {
        if (chatRef?.current) {
          chatRef.current.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  };
  const avatarIcon = isUser
    ? genieIcons?.genieUserIcon
    : genieIcons?.genieLogoChart;
  const messageClass = `chatbox__message chatbox__message--${
    isUser ? MESSAGE.MESSAGE_TYPES.USER : MESSAGE.MESSAGE_TYPES.GENIE
  }`;
  const avatarClass = `chatbox__avatar-icon ${
    isUser ? "chatbox__avatar-icon--user" : "chatbox__avatar-icon--genie"
  }`;

  const formatMessageId = (id) => {
    const sequentialId = index * 2 + (isUser ? 1 : 2);
    return `hUeF1096${sequentialId}`;
  };

  // Handle copy functionality for message content
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopyClick(true);

      // Reset after 3 seconds
      setTimeout(() => {
        setIsCopyClick(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Handle copy functionality for message ID
  const handleIdCopy = async (id) => {
    try {
      const formattedId = formatMessageId(id);
      await navigator.clipboard.writeText(formattedId);
      setIsIdCopyClick(true);

      // Reset after 3 seconds
      setTimeout(() => {
        setIsIdCopyClick(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to copy ID: ", err);
    }
  };

  return (
    <div className={messageClass}>
      <div className="chatbox__content">
        <div className="chatbox__avatar">
          <img className={avatarClass} src={avatarIcon} />
        </div>
        <div className="chatbox__message-holder">
          {genieLoading && !isUser && isLastIndex ? (
            <>
              <img
                src={
                  isDarkMode
                    ? genieIcons?.TypingIconDark
                    : genieIcons?.typingIcon
                }
                className="typing-loading"
              />
            </>
          ) : (
            <div>
              <div
                className="chatbox__meta-id"
                onMouseEnter={() => setIsIdHovered(true)}
                onMouseLeave={() => {
                  if (isIdCopyClick) {
                    setTimeout(() => {
                      setIsIdHovered(false);
                    }, 3000);
                  } else setIsIdHovered(false);
                }}
              >
                <RSTooltip text={MESSAGE.TOOLTIPS.CHAT_ID}>
                  <span className="chatbox__id">
                    #{formatMessageId(messageId)}
                  </span>
                </RSTooltip>
                <RSTooltip text={isIdCopyClick ? MESSAGE.TOOLTIPS.COPIED_ID : MESSAGE.TOOLTIPS.COPY_ID}>
                  <img
                    src={
                      isIdCopyClick
                        ? genieIcons?.IconCopied
                        : genieIcons?.IconCopy
                    }
                    alt="copy-id"
                    className={`copy copy--id ${
                      isIdHovered ? "copy--id--visible" : ""
                    }`}
                    onClick={() => {
                      handleIdCopy(messageId);
                    }}
                  />
                </RSTooltip>
              </div>
              <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                  if (isCopyClick) {
                    setTimeout(() => {
                      setIsHovered(false);
                    }, 3000);
                  } else setIsHovered(false);
                }}
              >
                <div className="chatbox__bubble-group">
                  <div className="chatbox__bubble">
                    {isUser ? (
                      content
                    ) : (
                      <>
                        {/* Analytics sequential typing - append content */}
                        {shouldUseAnalyticsSequentialTyping && (
                          <>
                            {/* Show all completed typing steps */}
                            {completedTypingSteps.map((step, index) => (
                              <div
                                key={`completed-${index}`}
                                className="chatbox__typing-step"
                              >
                                {step}
                              </div>
                            ))}

                            {/* Show current typing step */}
                            {isAnalyticsSequentialTyping &&
                              analyticsTypingContent && (
                                <div className="chatbox__typing-step">
                                  <TypingAnimation
                                    key={`analytics-${analyticsTypingIndex}-${analyticsTypingContent}`}
                                    content={analyticsTypingContent}
                                    speed={10}
                                    skipTyping={skipTyping || skipTypingEffect}
                                    onTypingComplete={
                                      handleAnalyticsTypingComplete
                                    }
                                    chatRef={chatRef}
                                  />
                                </div>
                              )}
                          </>
                        )}

                        {/* Regular sequential typing - replace content */}
                        {shouldUseSequentialTyping &&
                          isSequentialTyping &&
                          currentTypingContent && (
                            <TypingAnimation
                              key={`sequential-${currentTypingIndex}-${currentTypingContent}`}
                              content={currentTypingContent}
                              speed={30}
                              skipTyping={skipTyping || skipTypingEffect}
                              onTypingComplete={handleTypingComplete}
                              chatRef={chatRef}
                            />
                          )}

                        {/* Show final content when not in sequential typing */}
                        {!isSequentialTyping &&
                          !isAnalyticsSequentialTyping &&
                          content && (
                            <div className="chatbox__typing-step">
                              <TypingAnimation
                                key={`final-${messageId}-${content}`}
                                content={content}
                                speed={15}
                                skipTyping={skipTyping || skipTypingEffect}
                                // onTypingComplete={handleTypingComplete}
                                chatRef={chatRef}
                              />
                            </div>
                          )}
                      </>
                    )}
                  </div>
                  {/* Only show ResponseData when sequential typing is complete */}
                  {responseData &&
                    !isSequentialTyping &&
                    !isAnalyticsSequentialTyping && (
                      <>
                        {responseData.dataRepresentation === 2 ? (
                          <AnalyticsResponseData
                            data={responseData}
                            messageId={messageId}
                            messageIndex={index}
                          />
                        ) : (
                          <ResponseData
                            data={responseData}
                            messageId={messageId}
                            messageIndex={index}
                          />
                        )}
                      </>
                    )}
                </div>
                <div className="chatbox__meta">
                  {isUser ? (
                    <RSTooltip text={isCopyClick ? MESSAGE.TOOLTIPS.COPIED : MESSAGE.TOOLTIPS.COPY}>
                      <img
                        src={
                          isCopyClick
                            ? genieIcons?.IconCopied
                            : genieIcons?.IconCopy
                        }
                        alt={MESSAGE.ALT_TEXTS.COPY}
                        className={`copy ${isHovered ? "copy--visible" : ""}`}
                        onClick={() => {
                          handleCopy(content);
                        }}
                      />
                    </RSTooltip>
                  ) : null}
                  <span className="chatbox__timestamp">{timestamp}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
