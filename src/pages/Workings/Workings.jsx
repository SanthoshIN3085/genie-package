import React, { useState, useEffect, useRef } from "react";
import * as genieIcons from "../../assets/genieIcons";
import RSModal from "Components/RSModal";
import RSTooltip from "Components/RSTooltip";
import { Col, Row } from "react-bootstrap";
import jsPDF from "jspdf";
import { getPositions } from "../../constant/constant";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSelectedPrompt,
  updatePromptGalleryFlag,
  updateUI,
  updateChat,
  updateSpeech,
  updateSearch,
  updateSettings,
  resetGenie,
} from "Reducers/genie/reducer";
import { WORKINGS } from "../../constant/textConstants";

export const Workings = ({ messageId, messageIndex }) => {
  const { chat, ui } = useSelector((state) => state.genie);
  const { newChat, showFinalContent } = chat;
  const { workingsExpanded, showWorkings, currentWorkingsMessageId, currentWorkingsMessageIndex } = ui;
  const dispatch = useDispatch();

  // Format message ID function (same as in Message component)
  const formatMessageId = (id) => {
    if (currentWorkingsMessageIndex === null) return "hUeF109691"; // fallback
    const sequentialId = currentWorkingsMessageIndex * 2 + 2; // Assuming this is for genie messages (odd numbers)
    return `hUeF1096${sequentialId}`;
  };

  const workingsContent = WORKINGS.WORKINGS_CONTENT;

  const headings = WORKINGS.SECTION_HEADINGS;

  const [typedSections, setTypedSections] = useState([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerDisplay, setTimerDisplay] = useState("00:00");
  const [isContentDone, setIsContentDone] = useState(false);
  const [isGifStopped, setIsGifStopped] = useState(false);
  const [thinkingText, setThinkingText] = useState(WORKINGS.THINKING_STATES[0]);
  const thinkingWords = WORKINGS.THINKING_STATES;
  const timerRef = useRef();
  const thinkingRef = useRef();
  const workingsLog = useRef();

  // Group workingsContent into sections based on headings
  const groupedContent = [];
  let currentSection = { title: "", content: [] };
  workingsContent.forEach((item) => {
    if (headings.includes(item)) {
      if (currentSection.content.length > 0 || currentSection.title) {
        groupedContent.push(currentSection);
      }
      currentSection = { title: item, content: [] };
    } else {
      currentSection.content.push(item);
    }
  });
  if (currentSection.content.length > 0 || currentSection.title) {
    groupedContent.push(currentSection);
  }

  useEffect(() => {
    if (!showWorkings) {
      clearInterval(timerRef.current);
      return;
    }

    setTimer(0);
    let sec = 0;
    clearInterval(timerRef.current);

    if (!showFinalContent) {
      timerRef.current = setInterval(() => {
        sec += 1;
        setTimer(sec);
        const minutes = Math.floor(sec / 60);
        const seconds = sec % 60;
        setTimerDisplay(
          `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
            2,
            "0"
          )}`
        );
      }, 1000);
    } else {
      setTimerDisplay("00:14");
      clearInterval(timerRef.current);
    }

    return () => {
      clearInterval(timerRef.current);
      setTimer(0);
      setTimerDisplay("00:00");
    };
  }, [currentSectionIndex, showWorkings, showFinalContent]);

  useEffect(() => {
    if (isContentDone) {
      clearInterval(timerRef.current);
      const totalTime = groupedContent.length * 0.5; // Assuming 0.5 seconds per section
      const minutes = Math.floor(totalTime / 60);
      const seconds = Math.floor(totalTime % 60);
      setTimerDisplay(
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
          2,
          "0"
        )}`
      );
    }
  }, [isContentDone]);

  useEffect(() => {
    let idx = 0;
    clearInterval(thinkingRef.current);

    if (!showFinalContent && !isContentDone) {
      thinkingRef.current = setInterval(() => {
        setThinkingText(thinkingWords[idx % thinkingWords.length]);
        idx++;
      }, 2000);
    } else {
      setThinkingText(WORKINGS.WORKED_STATE);
    }
    return () => clearInterval(thinkingRef.current);
  }, [currentSectionIndex, showWorkings, isContentDone, showFinalContent]);

  useEffect(() => {
    if (!showWorkings) return;

    clearInterval(timerRef.current);
    clearInterval(thinkingRef.current);

    if (showFinalContent || !newChat) {
      const allContent = groupedContent.map((section) => ({
        title: section.title,
        content: section.content.join("\n"),
        isDone: true,
      }));
      setTypedSections(allContent);
      setIsContentDone(true);
      setIsGifStopped(true);
      setCurrentSectionIndex(groupedContent.length - 1);
      const totalTime = groupedContent.length * 0.5;
      const minutes = Math.floor(totalTime / 60);
      const seconds = Math.floor(totalTime % 60);
      setTimerDisplay(
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
          2,
          "0"
        )}`
      );
      setThinkingText("Worked");
      return;
    }

    setTypedSections([]);
    setCurrentSectionIndex(0);
    setIsContentDone(false);
    setIsGifStopped(false);
    setTimer(0);
    setTimerDisplay("00:00");

    let sec = 0;
    timerRef.current = setInterval(() => {
      sec += 1;
      setTimer(sec);
      const minutes = Math.floor(sec / 60);
      const seconds = sec % 60;
      setTimerDisplay(
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
          2,
          "0"
        )}`
      );
    }, 1000);

    let idx = 0;
    thinkingRef.current = setInterval(() => {
      setThinkingText(thinkingWords[idx % thinkingWords.length]);
      idx++;
    }, 2000);

    let typingTimeoutRef = null;

    const typeSection = (index) => {
      const section = groupedContent[index];
      let titleIndex = 0;
      let contentIndex = 0;
      let typedTitle = "";
      let typedContent = "";
      const fullContent = section.content.join("\n");

      const typeTitle = () => {
        if (showFinalContent || !newChat) {
          const remainingContent = groupedContent
            .slice(index)
            .map((section) => ({
              title: section.title,
              content: section.content.join("\n"),
              isDone: true,
            }));
          setTypedSections((prev) => [...prev, ...remainingContent]);
          setIsContentDone(true);
          setIsGifStopped(true);
          setCurrentSectionIndex(groupedContent.length - 1);
          const totalTime = groupedContent.length * 0.5;
          const minutes = Math.floor(totalTime / 60);
          const seconds = Math.floor(totalTime % 60);
          setTimerDisplay(
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
              2,
              "0"
            )}`
          );
          setThinkingText(WORKINGS.WORKED_STATE);
          return;
        }

        if (titleIndex < section.title.length) {
          typedTitle += section.title[titleIndex++];
          updateTypedSection(index, typedTitle, typedContent, false);
          typingTimeoutRef = setTimeout(typeTitle, 25);
        } else {
          typingTimeoutRef = setTimeout(typeContent, 300);
        }
      };

      const typeContent = () => {
        if (showFinalContent || !newChat) {
          const remainingContent = groupedContent
            .slice(index)
            .map((section) => ({
              title: section.title,
              content: section.content.join("\n"),
              isDone: true,
            }));
          setTypedSections((prev) => [...prev, ...remainingContent]);
          setIsContentDone(true);
          setIsGifStopped(true);
          setCurrentSectionIndex(groupedContent.length - 1);
          const totalTime = groupedContent.length * 0.5;
          const minutes = Math.floor(totalTime / 60);
          const seconds = Math.floor(totalTime % 60);
          setTimerDisplay(
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
              2,
              "0"
            )}`
          );
          setThinkingText(WORKINGS.WORKED_STATE);
          return;
        }

        if (contentIndex < fullContent.length) {
          typedContent += fullContent[contentIndex++];
          updateTypedSection(index, typedTitle, typedContent, false);
          typingTimeoutRef = setTimeout(typeContent, 8);
        } else {
          updateTypedSection(index, typedTitle, typedContent, true);
          if (index + 1 < groupedContent.length) {
            typingTimeoutRef = setTimeout(() => {
              typeSection(index + 1);
              setCurrentSectionIndex(index + 1);
            }, 300);
          } else {
            setIsContentDone(true);
            setIsGifStopped(true);
            clearInterval(timerRef.current);
            const totalTime = groupedContent.length * 0.5;
            const minutes = Math.floor(totalTime / 60);
            const seconds = Math.floor(totalTime % 60);
            setTimerDisplay(
              `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
                2,
                "0"
              )}`
            );
          }
        }
      };

      typeTitle();
    };

    const updateTypedSection = (index, title, content, isDone) => {
      setTypedSections((prev) => {
        const updated = [...prev];
        updated[index] = {
          title,
          content,
          isDone,
        };
        return updated;
      });
    };

    typeSection(0);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(thinkingRef.current);
      if (typingTimeoutRef) {
        clearTimeout(typingTimeoutRef);
      }
    };
  }, [showWorkings, showFinalContent, newChat]);

  const handleDownload = () => {
    const doc = new jsPDF();
    let yOffset = 20;
    const lineHeight = 7;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;

    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text(WORKINGS.WORKINGS_LOG_TITLE, margin, yOffset);
    yOffset += lineHeight * 2;

    groupedContent.forEach((section) => {
      if (section.title) {
        doc.setFontSize(14);
        doc.setFont(undefined, "bold");
        doc.text(section.title, margin, yOffset);
        yOffset += lineHeight;
      }

      section.content.forEach((content) => {
        doc.setFontSize(12);
        doc.setFont(undefined, "normal");
        const splitContent = doc.splitTextToSize(
          content,
          pageWidth - margin * 2
        );
        doc.text(splitContent, margin, yOffset);
        yOffset += splitContent.length * lineHeight + lineHeight;

        if (yOffset > doc.internal.pageSize.height - margin) {
          doc.addPage();
          yOffset = margin;
        }
      });
    });

    doc.save("workings-log.pdf");
  };
  useEffect(() => {
    if (workingsExpanded) {
      setTimeout(() => {
        const workingExpand = document.querySelector(
          ".working-wrapper.expanded"
        );
        workingExpand.style.right = 0;
      }, 100);
    }
  }, [workingsExpanded]);
  const handleExpand = () => {
    const working = document.querySelector(".working-wrapper");
    working.style.right = 0;
    setTimeout(() => {
      dispatch(
        updateUI({
          workingsExpanded: !workingsExpanded,
        })
      );
    }, 90);
    if (workingsExpanded) {
      setTimeout(getPositions, 0);
    }
  };

  return (
    <div className="workings position-relative">
      <div className="d-flex justify-content-end mt5 position-absolute right10 top5">
        {isContentDone && (
          <RSTooltip text={WORKINGS.DOWNLOAD_TOOLTIP} className="lh0 mr15">
            <img
              src={genieIcons?.download}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              alt={WORKINGS.DOWNLOAD_TOOLTIP}
            />
          </RSTooltip>
        )}
        <RSTooltip
          text={workingsExpanded ? WORKINGS.COLLAPSE_TOOLTIP : WORKINGS.EXPAND_TOOLTIP}
          className="lh0 mr15"
        >
          <img
            src={
              workingsExpanded
                ? genieIcons?.collapseWorking
                : genieIcons?.expandWorking
            }
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleExpand();
            }}
            alt={workingsExpanded ? WORKINGS.COLLAPSE_TOOLTIP : WORKINGS.EXPAND_TOOLTIP}
          />
        </RSTooltip>
        <RSTooltip text={WORKINGS.CLOSE_TOOLTIP} className="lh0">
          <img
            src={genieIcons?.closeSmall}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(
                updateUI({
                  workingsExpanded: false,
                  showWorkings: false,
                })
              );
            }}
            alt={WORKINGS.CLOSE_TOOLTIP}
          />
        </RSTooltip>
      </div>
      <div className="mt5 mb20">
        <h2>Workings</h2>
      </div>

      <div className="workings-chat-id">{formatMessageId(currentWorkingsMessageId)}</div>
      <div className="workings-content css-scrollbar" ref={workingsLog}>
        {typedSections.map((section, index) => (
          <div key={index} className="workings-section mb10 mr10">
            <div className="section-header">
              <h6>{section.title || ""}</h6>
            </div>
            <div className="section-content">
              {section.content.split("\n").map((line, lineIndex) => (
                <div key={lineIndex}>{line}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {showWorkings && !workingsExpanded && (
        <div className="genie-working-bar-card">
          <div className="genie-working-bar-card-loader mr10">
            <img
              src={
                isContentDone
                  ? genieIcons?.GenieLoadingStopped
                  : genieIcons?.GenieLoading
              }
              alt={WORKINGS.LOADING_ALT}
            />
          </div>
          <div className="genie-working-bar-card-content mr15 w-75">
            <div className="d-flex align-items-center">
              <span className="font-xxs mr5">
                Genie {isContentDone ? WORKINGS.GENIE_STATUS.COMPLETED : WORKINGS.GENIE_STATUS.IS_WORKING}:{" "}
              </span>
              <span className="font-xxs">{thinkingText}</span>
            </div>
            <div className="d-flex">
              <span className="font-xxs mr10">{timerDisplay}s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
