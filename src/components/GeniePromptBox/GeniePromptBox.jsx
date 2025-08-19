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
/**
 * File upload configuration constants
 * 
 * These constants define the file upload behavior and limits for the
 * GeniePromptBox component, ensuring consistent file handling across
 * the application.
 * 
 * FILE_TYPES: Supported file extensions for upload
 * MAX_FILE_NAME_LENGTH: Maximum characters to display in file name
 * MAX_FILES: Maximum number of files that can be selected
 */
const FILE_TYPES = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx";
const MAX_FILE_NAME_LENGTH = 20;
const MAX_FILES = 3;

/**
 * GeniePromptBox Component - Main input interface for Genie AI chat
 *
 * This component provides a comprehensive input interface that includes:
 * 1. Text input field for manual queries
 * 2. Voice input toggle with microphone button
 * 3. File upload functionality for document processing
 * 4. New prompt button for starting fresh conversations
 * 5. Real-time voice listening state management
 * 6. Profanity filtering for all input types
 * 7. Coordination with voice recognition and wakeup systems
 *
 * The component manages the coordination between manual input, voice input,
 * and file uploads while maintaining proper state synchronization with Redux.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.help - Whether the component is in help mode (affects styling and behavior)
 * @param {Function} props.handleSideNavClick - Function to handle navigation to different sections
 * @param {Function} props.handleFormSubmit - Function to handle form submission with input text
 * @returns {JSX.Element} The GeniePromptBox interface
 */
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
  
  /**
   * Manage listening text states for voice input feedback
   * 
   * This useEffect provides real-time feedback to users during voice input by:
   * 1. Setting "Speak now.." message after 1 second of listening
   * 2. Changing to "Listening.." message after 3 seconds of listening
   * 3. Properly cleaning up timeouts to prevent memory leaks
   * 
   * The timing sequence helps users understand the voice input state:
   * - Initial: User sees default listening state
   * - 1s: "Speak now.." prompts user to start speaking
   * - 3s: "Listening.." confirms the system is actively listening
   * 
   * Dependencies: [isListening] - Runs whenever listening state changes
   * 
   * Side Effects:
   * - Updates Redux speech state with listening text
   * - Sets up timeout-based text changes
   * - Cleans up timeouts on unmount or state change
   */
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
  /**
   * Synchronize Redux searchInput state with form input field
   * 
   * This useEffect ensures the form input field stays in sync with external Redux state
   * changes (e.g., from voice recognition or other components) while preventing
   * infinite loops from form input changes.
   * 
   * Key Features:
   * - Only updates form when Redux state differs from form state
   * - Prevents circular updates between form and Redux
   * - Maintains user input when typing manually
   * - Syncs external changes (voice transcripts, programmatic updates)
   * 
   * Use Cases:
   * - Voice recognition results appearing in input field
   * - External component updates to search input
   * - Programmatic input field population
   * 
   * Dependencies: [searchInput, searchInputData, setValue]
   * 
   * Side Effects:
   * - Updates form input value via setValue
   * - May trigger form re-render
   */
  useEffect(() => {
    if (searchInput && searchInput !== searchInputData) {
      setValue("searchInput", searchInput);
    }
  }, [searchInput]);

  // Helper functions
  /**
   * Handle form submission with input validation and profanity filtering
   * 
   * This function processes the user's input text before submission by:
   * 1. Trimming whitespace from the input
   * 2. Checking for profanity and filtering if detected
   * 3. Submitting the filtered text to the parent component
   * 4. Clearing the input field after submission
   * 5. Preparing for voice recognition coordination
   * 
   * Profanity Filtering:
   * - Detects profanity using containsProfanity utility
   * - Applies filterProfanity to clean the input
   * - Ensures clean content is submitted to AI
   * 
   * Input Processing:
   * - Handles both manual typing and voice input
   * - Maintains input quality standards
   * - Provides consistent submission behavior
   * 
   * State Management:
   * - Clears form input after submission
   * - Coordinates with voice recognition system
   * - Maintains clean component state
   * 
   * @returns {void} No return value
   * 
   * Side Effects:
   * - Calls handleFormSubmit with processed input
   * - Clears form input field
   * - May trigger voice recognition coordination
   */
  const handleSearch = () => {
    const inputText = searchInputData?.trim();
    
    // Filter profanity from input before submitting
    if (inputText && containsProfanity(inputText)) {
      // console.log("Profanity detected in manual input, filtering before submission");
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

  /**
   * Remove a file from the selected files list
   * 
   * This function removes a specific file from the selectedFiles state array
   * and hides the close button overlay to maintain clean UI state.
   * 
   * File Management:
   * - Filters out the file with the specified ID
   * - Updates the selectedFiles state array
   * - Maintains file count for upload limits
   * 
   * UI State Management:
   * - Hides the close button overlay
   * - Prevents orphaned close buttons
   * - Maintains consistent visual state
   * 
   * @param {number} idToRemove - The unique ID of the file to remove
   * @returns {void} No return value
   * 
   * Side Effects:
   * - Updates selectedFiles state array
   * - Sets showClose to false
   * - May trigger component re-render
   */
  const handleRemoveFile = (idToRemove) => {
    setSelectedFiles((prev) => prev.filter((file) => file.id !== idToRemove));
    setShowClose(false);
  };

  /**
   * Add a new file to the selected files list
   * 
   * This function adds a newly selected file to the selectedFiles state array
   * with a unique ID for proper file management and UI rendering.
   * 
   * File Addition:
   * - Generates unique ID based on current file count
   * - Adds file to selectedFiles array
   * - Maintains file order and count
   * 
   * ID Generation:
   * - Uses array length + 1 for unique identification
   * - Ensures no duplicate IDs
   * - Provides stable file references
   * 
   * State Management:
   * - Updates selectedFiles state immutably
   * - Preserves existing files
   * - Triggers component re-render
   * 
   * @param {string} fileName - The name of the file to add
   * @returns {void} No return value
   * 
   * Side Effects:
   * - Updates selectedFiles state array
   * - May trigger component re-render
   * - May affect file upload limit checks
   */
  const handleFileSelect = (fileName) => {
    const newFile = {
      id: selectedFiles?.length + 1,
      fileName,
    };
    setSelectedFiles((prev) => [...prev, newFile]);
  };

  /**
   * Toggle voice input mode on/off with proper state coordination
   * 
   * This function manages the voice input state and coordinates between
   * VoiceRecognition and Wakeup components to ensure only one is listening
   * at a time.
   * 
   * Voice Mode ON:
   * - Sets isListening to true for UI feedback
   * - Sets inputVoiceSearch to true to trigger VoiceRecognition
   * - Sets isVoiceMode to true to enable voice functionality
   * - Clears any previous error messages
   * 
   * Voice Mode OFF:
   * - Sets isListening to false to stop UI feedback
   * - Sets inputVoiceSearch to false to stop VoiceRecognition
   * - Sets isVoiceMode to false to disable voice functionality
   * - Allows Wakeup component to resume listening
   * 
   * State Coordination:
   * - Manages Redux speech state updates
   * - Coordinates with VoiceRecognition component
   * - Coordinates with Wakeup component
   * - Maintains consistent listening states
   * 
   * @returns {void} No return value
   * 
   * Side Effects:
   * - Updates Redux speech state (isListening, inputVoiceSearch, isVoiceMode)
   * - May clear chat error messages
   * - Triggers VoiceRecognition start/stop
   * - Triggers Wakeup start/stop
   */
  const handleVoiceToggle = () => {
    if (isListening) {
      // Turn off mic - stop listening and resume Wakeup
      dispatch(
        updateSpeech({
          isListening: false,
          inputVoiceSearch: false,
          isVoiceMode: false, // Disable voice mode to stop VoiceRecognition
        })
      );
    } else {
      // Turn on mic - start listening and stop Wakeup
      dispatch(
        updateSpeech({
          isListening: true,
          inputVoiceSearch: true,
          isVoiceMode: true, // Enable voice mode to start VoiceRecognition
        })
      );
      dispatch(updateChat({ errorTranscript: "" }));
    }
  };

  /**
   * Clear error messages when input field receives focus
   * 
   * This function provides immediate user feedback by clearing any
   * displayed error messages when the user starts interacting with
   * the input field.
   * 
   * User Experience:
   * - Removes error messages on focus
   * - Provides clean input experience
   * - Indicates user intent to input
   * 
   * Error Management:
   * - Clears errorTranscript from chat state
   * - Resets error display state
   * - Prepares for new input
   * 
   * @returns {void} No return value
   * 
   * Side Effects:
   * - Updates Redux chat state (errorTranscript: "")
   * - May trigger component re-render
   * - Clears error message display
   */
  const handleInputFocus = () => {
    dispatch(updateChat({ errorTranscript: "" }));
  };
  /**
   * Handle input field value changes with voice recognition coordination
   * 
   * This function manages real-time input changes and coordinates with
   * the voice recognition system to provide seamless switching between
   * voice and manual input modes.
   * 
   * Input Change Management:
   * - Updates Redux search state with new input value
   * - Maintains form input synchronization
   * - Handles real-time typing updates
   * 
   * Voice Recognition Coordination:
   * - Detects when user starts typing while listening
   * - Stops voice recognition when manual input begins
   * - Resumes Wakeup component for wakeup commands
   * - Sets isVoiceMode to false to disable voice functionality
   * 
   * State Synchronization:
   * - Updates Redux search state
   * - Coordinates with form state
   * - Manages voice recognition states
   * - Ensures consistent component behavior
   * 
   * @param {Event} e - The input change event object
   * @returns {void} No return value
   * 
   * Side Effects:
   * - Updates Redux search state (searchInput)
   * - May update Redux speech state (isListening, inputVoiceSearch, isVoiceMode)
   * - May trigger VoiceRecognition stop
   * - May trigger Wakeup resume
   */
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    // If user starts typing while listening, stop listening and resume Wakeup
    if (isListening && newValue !== searchInput) {
      dispatch(
        updateSpeech({
          isListening: false,
          inputVoiceSearch: false,
          isVoiceMode: false, // Disable voice mode to stop VoiceRecognition and resume Wakeup
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

  /**
   * Handle keyboard events for form submission
   * 
   * This function provides keyboard shortcut support by allowing users
   * to submit the form by pressing the Enter key, providing an alternative
   * to clicking the send button.
   * 
   * Keyboard Support:
   * - Listens for Enter key press events
   * - Prevents default form submission behavior
   * - Triggers manual form submission
   * 
   * User Experience:
   * - Provides familiar keyboard shortcuts
   * - Maintains accessibility standards
   * - Offers multiple input methods
   * 
   * @param {KeyboardEvent} e - The keyboard event object
   * @returns {void} No return value
   * 
   * Side Effects:
   * - Prevents default form submission
   * - Calls handleSearch function
   * - May trigger form processing
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // Computed values
  /**
   * Computed values derived from component state and props
   * 
   * These computed values provide reactive UI state management and
   * determine component behavior based on current state conditions.
   * 
   * Error State:
   * - isError: Whether there's an error transcript to display
   * 
   * File Management:
   * - isFileLimitReached: Whether maximum file limit has been reached
   * 
   * Voice Input State:
   * - isVoiceDisabled: Whether voice input should be disabled
   * 
   * Form Submission:
   * - isSendDisabled: Whether the send button should be disabled
   */
  const isError = errorTranscript?.length > 0;
  const isFileLimitReached = selectedFiles?.length === MAX_FILES;
  const isVoiceDisabled = searchInputData?.length > 0;
  const isSendDisabled = searchInputData?.trim() === "";

  // Get placeholder text
  /**
   * Get dynamic placeholder text based on component state
   * 
   * This function provides contextual placeholder text that changes based on
   * the current component state, helping users understand what they can do
   * in different situations.
   * 
   * Placeholder Logic:
   * - Help mode: Shows help-specific placeholder
   * - Error state: Displays error message as placeholder
   * - Listening state: Shows current listening status
   * - Non-home mode: Shows follow-up prompt placeholder
   * - Default: Shows general chat instruction
   * 
   * State Priority:
   * 1. Help mode (highest priority)
   * 2. Error state
   * 3. Listening state
   * 4. Navigation mode
   * 5. Default state (lowest priority)
   * 
   * @returns {string} The appropriate placeholder text for current state
   * 
   * Side Effects:
   * - No side effects, pure function
   */
  const getPlaceholderText = () => {
    if (help && !isListening) return "Enter a question or topics..";
    if (isError) return errorTranscript;
    if (isListening) return listeningText;
    if (!home) return "Ask a follow-up..";
    return "Chat with Genie for the AI-based experience";
  };

  // Get send button icon
  /**
   * Get appropriate send button icon based on component mode
   * 
   * This function returns the correct icon for the send button based on
   * whether the component is in help mode or regular chat mode.
   * 
   * Icon Selection:
   * - Help mode: Returns search icon (magnifying glass)
   * - Regular mode: Returns send icon (paper plane)
   * 
   * Visual Consistency:
   * - Maintains appropriate icon semantics
   * - Provides clear visual feedback
   * - Distinguishes between different modes
   * 
   * @returns {string} The path to the appropriate icon asset
   * 
   * Side Effects:
   * - No side effects, pure function
   */
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
