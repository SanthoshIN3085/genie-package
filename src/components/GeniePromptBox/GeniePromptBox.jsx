import React, { useEffect, useRef, useState, useCallback } from "react";
import * as genieIcons from "../../assets/genieIcons";
import RSTooltip from "Components/RSTooltip";
import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import RSTextarea from "Components/RSTextarea";
import RSFileUpload from "Components/RSFileUpload";
import { truncateTitle } from "../../utils/index";
import {
  updateSelectedPrompt,
  updatePromptGalleryFlag,
  updateUI,
  updateChat,
  updateSpeech,
  updateSearch,
  updateSettings,
} from "Reducers/genie/reducer";
import { filterProfanity, containsProfanity } from "../../features/command.js";

// Constants
const FILE_TYPES = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx";
const MAX_FILE_NAME_LENGTH = 20;
const MAX_FILES = 3;

function GeniePromptBox({
  help = false,
  handleSideNavClick = () => {},
  handleFormSubmit = () => {},
}) {
  const methods = useFormContext();
  const {
    control,
    setValue,
    setFocus,
    getValues,
    watch,
    clearErrors,
    setError,
  } = methods;

  const { ui, speech, chat, search } = useSelector((state) => state.genie);
  const { loadingChat, isDarkMode, recommendedPrompts, activeItem } = ui;
  const { isListening, listeningText, inputVoiceSearch } = speech;
  const { generateCard, errorTranscript } = chat;
  const { searchInput } = search;
  const home = activeItem === "newprompt";
  React.useEffect(() => {
    if (isListening) {
      const speakTimeout = setTimeout(() => {
        dispatch(
          updateSpeech({
            listeningText: "Speak now..",
          })
        );
      }, 1000);

      const listeningTimeout = setTimeout(() => {
        dispatch(
          updateSpeech({
            listeningText: "Listening..",
          })
        );
      }, 3000);

      return () => {
        clearTimeout(speakTimeout);
        clearTimeout(listeningTimeout);
      };
    }
  }, [isListening]);

  const searchInputData = watch("searchInput", "");
  const dispatch = useDispatch();
  const rsButtonRef = useRef();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showClose, setShowClose] = useState(false);

  // Only sync from Redux to form when searchInput changes externally (not from form input)
  useEffect(() => {
    if (searchInput && searchInput !== searchInputData) {
      setValue("searchInput", searchInput);
    }
  }, [searchInput]);

  // Helper functions
  const handleSearch = () => {
    const inputText = searchInputData?.trim();
    
    // Filter profanity from input before submitting
    if (inputText && containsProfanity(inputText)) {
      console.log("Profanity detected in manual input, filtering before submission");
      const filteredInput = filterProfanity(inputText);
      handleFormSubmit(filteredInput);
    } else {
      handleFormSubmit(inputText);
    }
    
    // Clear the input after submission
    setValue("searchInput", "");
    
    // The voice recognition will be handled by the parent component
    // after the typing animation completes
  };

  const handleRemoveFile = (idToRemove) => {
    setSelectedFiles((prev) => prev.filter((file) => file.id !== idToRemove));
    setShowClose(false);
  };

  const handleFileSelect = (fileName) => {
    const newFile = {
      id: selectedFiles?.length + 1,
      fileName,
    };
    setSelectedFiles((prev) => [...prev, newFile]);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      dispatch(
        updateSpeech({
          isListening: false,
          inputVoiceSearch: false,
        })
      );
    } else {
      dispatch(
        updateSpeech({
          isListening: true,
          inputVoiceSearch: true,
        })
      );
      dispatch(updateChat({ errorTranscript: "" }));
    }
  };

  const handleInputFocus = () => {
    dispatch(updateChat({ errorTranscript: "" }));
  };
// update search value on input change.
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    // If user starts typing while listening, stop listening
    if (isListening && newValue !== searchInput) {
      dispatch(
        updateSpeech({
          isListening: false,
          inputVoiceSearch: false,
        })
      );
    }
    
    // Update the search input in Redux to sync with form
    dispatch(
      updateSearch({
        searchInput: newValue,
      })
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // Computed values
  const isError = errorTranscript?.length > 0;
  const isFileLimitReached = selectedFiles?.length === MAX_FILES;
  const isVoiceDisabled = searchInputData?.length > 0;
  const isSendDisabled = searchInputData?.trim() === "";

  // Get placeholder text
  const getPlaceholderText = () => {
    if (help && !isListening) return "Enter a question or topics..";
    if (isError) return errorTranscript;
    if (isListening) return listeningText;
    if (!home) return "Ask a follow-up..";
    return "Chat with Genie for the AI-based experience";
  };

  // Get send button icon
  const getSendIcon = () => {
    if (help) return genieIcons?.Search;
    return genieIcons?.send;
  };

  return (
    <div
      className={`genie-prompt-wrapper ${home ? "active" : "mt40"} ${
        help ? "p0 position-relative" : ""
      }`}
    >
      {/* File upload section */}
      <div
        className={`d-flex justify-content-between mb10 ${
          help ? "d-none" : ""
        }`}
      >
        <div className="d-flex">
          {selectedFiles.map((file) => (
            <div
              className="file-upload"
              key={file.id}
              onMouseEnter={() => setShowClose(true)}
              onMouseLeave={() => setShowClose(false)}
            >
              <img
                src={
                  isDarkMode ? genieIcons?.AttachDocDark : genieIcons?.AttachDoc
                }
                className="mr10"
                alt="Attached file"
              />
              {file?.fileName?.length < MAX_FILE_NAME_LENGTH ? (
                <p className="mr15">{file?.fileName}</p>
              ) : (
                <RSTooltip text={file?.fileName} position="top">
                  <p className="mr15">
                    {truncateTitle(file?.fileName, MAX_FILE_NAME_LENGTH)}
                  </p>
                </RSTooltip>
              )}
              <img
                src={
                  isDarkMode
                    ? genieIcons?.AttachDocCloseDark
                    : genieIcons?.AttachDocClose
                }
                onClick={() => handleRemoveFile(file.id)}
                className={`position-absolute right-10 top5 cp ${
                  showClose ? "" : "d-none"
                }`}
                alt="Remove file"
              />
            </div>
          ))}
        </div>

        <div className="d-flex">
          {/* File upload button */}
          <div
            className={`cp ${home ? "" : "mr10"} ${
              isFileLimitReached ? "click-off" : ""
            }`}
          >
            <RSFileUpload
              control={control}
              name="file"
              externalTriggerRef={rsButtonRef}
              setError={setError}
              containerClass="d-none"
              accept={FILE_TYPES}
              clearErrors={clearErrors}
              onFileSelect={handleFileSelect}
            />
            <RSTooltip text="Upload a PDF, Word, Excel, or PowerPoint file for smart summaries and answers.">
              <img
                src={genieIcons?.FileAttach}
                onClick={() => rsButtonRef.current?.triggerClick()}
                alt="Upload file"
              />
            </RSTooltip>
          </div>

          {/* New prompt button */}
          <RSTooltip text="New prompt" className={`${home ? "d-none" : ""}`}>
            <img
              src={
                isDarkMode ? genieIcons?.newPromptDark : genieIcons?.newPrompt
              }
              className="cursor-pointer"
              onClick={() => {
                handleSideNavClick("newprompt");
              }}
              alt="New prompt"
            />
          </RSTooltip>
        </div>
      </div>

      {/* Input prompt section */}
      <div
        className={`input-prompt-block position-relative ${
          isListening ? "active" : ""
        } ${loadingChat ? "click-off" : ""} ${
          searchInputData && !recommendedPrompts ? "no-border-bottom" : ""
        } ${help ? "searchBox" : ""}`}
      >
        <div className="d-flex justify-content-between align-items-end">
          {/* Voice button */}
          <div className="cp mt2 mr19">
            {isListening ? (
              <img
                src={isDarkMode ? genieIcons?.SpeechDark : genieIcons?.Speech}
                className="audio-listening"
                onClick={handleVoiceToggle}
                alt="Stop listening"
              />
            ) : (
              <RSTooltip text="Enable voice">
                <img
                  src={isDarkMode ? genieIcons?.genieMicDark : genieIcons?.mic}
                  className={isVoiceDisabled ? "click-off" : ""}
                  onClick={handleVoiceToggle}
                  alt="Enable voice"
                />
              </RSTooltip>
            )}
          </div>

          {/* Text input */}
          <div className="w-100 pr7 lh0">
            <RSTextarea
              name="searchInput"
              control={control}
              rows={1}
              className={`${isError ? "speech-error" : ""} w-100`}
              isAI
              placeholder={getPlaceholderText()}
              onKeyPress={handleKeyPress}
              onFocus={handleInputFocus}
              onChange={handleInputChange}
            />
          </div>

          {/* Send button */}
          <div
            className={`${isSendDisabled ? "click-off" : ""} send cp`}
            onClick={() => {
              handleSearch();
            }}
          >
            <img src={getSendIcon()} alt="Send" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeniePromptBox;
