import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Home from "../Home/Home";
import FloatingGenie from "../FloatingGenie/FloatingGenie";
import Help from "../Help";
import { FormProvider, useForm } from "react-hook-form";
import TermsAndCondition from "Components/common/TermsAndCondition/TermsAndCondition";
import * as constant from "../../constant/Sectors/banking";


import {
  updatePromptGalleryFlag,
  updateUI,
  updateChat,
  updateSearch,
  updateSettings,
  updateSpeech,
  resetChat,
  resetGenie,
} from "Reducers/genie/reducer";
import Settings from "../Settings";
import VoiceRecognition from "../../features/VoiceRecognition/VoiceRecoginition.jsx";
import Wakeup from "../../features/Wakeup/Wakeup";
import { selectClasses } from "@mui/material";
import { update } from "lodash";
import RSModal from "../../components/RSModal/index";
import RSTooltip from "Components/RSTooltip";
import * as genieIcons from "../../assets/genieIcons";
import { handleFormSubmit as handleFormSubmitUtil } from "../../Utils/formHandlers";

// Navigation item constants for the Genie application
const NAV_ITEMS = {
  NEW_PROMPT: "newprompt",
  PROMPT_GALLERY: "promptgallery",
  PREVIOUS_PROMPTS: "previousprompts",
  SETTINGS: "settings",
  HELP: "help",
  CHAT_BOX: "chatbox",
};

/**
 * Genie Component - Main application container and navigation hub
 * 
 * The component uses Redux for state management and react-hook-form for form handling,
 * providing a seamless user experience across different application modes.
 * 
 * @returns {JSX.Element} The main Genie application interface
 */
const Genie = () => {
  const { ui, settings, search, speech, chat } = useSelector((state) => state.genie);
  const { showHome } = ui;
  const { helpTabs, settingsTab } = settings;
  const { searchInput } = search;
  const { inputVoiceSearch, wakeup } = speech;
  const { aiCommunication, aiAudience, analyticsListCard } = constant;
  const { selectedMessages, messages, generateCard, newChat } = chat;


  const methods = useForm();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const { setValue, setFocus, getValues } = methods;

  /**
   * Memoized function to update UI state in Redux
   * @param {Object} data - UI state data to update
   */
  const updateUIState = useCallback(
    (data) => dispatch(updateUI(data)),
    [dispatch]
  );

  /**
   * Memoized function to update chat state in Redux
   * @param {Object} data - Chat state data to update
   */
  const updateChatState = useCallback(
    (data) => dispatch(updateChat(data)),
    [dispatch]
  );

  /**
   * Memoized function to update search state in Redux
   * @param {Object} data - Search state data to update
   */
  const updateSearchState = useCallback(
    (data) => dispatch(updateSearch(data)),
    [dispatch]
  );

  /**
   * Memoized function to update settings state in Redux
   * @param {Object} data - Settings state data to update
   */
  const updateSettingsState = useCallback(
    (data) => dispatch(updateSettings(data)),
    [dispatch]
  );

  /**
   * Memoized function to update speech state in Redux
   * @param {Object} data - Speech state data to update
   */
  const updateSpeechState = useCallback(
    (data) => dispatch(updateSpeech(data)),
    [dispatch]
  );

  /**
   * Memoized function to update prompt gallery flag in Redux
   * @param {boolean} flag - Prompt gallery flag value
   */
  const updatePromptGalleryFlagState = useCallback(
    (flag) => dispatch(updatePromptGalleryFlag(flag)),
    [dispatch]
  );

  /**
   * Reset the chat state to initial values
   */
  const resetChatState = useCallback(() => {
    dispatch(resetChat());
  }, [dispatch]);

  /**
   * Update UI state with navigation item and optional workings display
   * @param {string} activeItem - The navigation item to activate
   * @param {boolean} showWorkings - Whether to show the workings section
   */
  const updateUIStateWithNav = useCallback((activeItem, showWorkings = false) => {
    updateUIState({
      showWorkings,
      activeItem,
    });
  }, [updateUIState]);

  /**
   * Reset search input and settings to default state
   */
  const resetSearchAndSettings = useCallback(() => {
    updateSearchState({ searchInput: "" });
    updateSettingsState({
      helpTabs: false,
      settingsTab: false,
    });
    methods.setValue("searchInput", "");
  }, [updateSearchState, updateSettingsState, methods]);

  /**
   * Navigation handlers for different application sections
   */
  const navigationHandlers = useCallback({
    [NAV_ITEMS.NEW_PROMPT]: () => {
      updatePromptGalleryFlagState(false);
      resetChatState();
      updateUIStateWithNav(NAV_ITEMS.NEW_PROMPT);
      resetSearchAndSettings();
    },
    [NAV_ITEMS.PROMPT_GALLERY]: () => {
      resetChatState();
      updateUIStateWithNav(NAV_ITEMS.PROMPT_GALLERY);
      updatePromptGalleryFlagState(true);
    },
    [NAV_ITEMS.PREVIOUS_PROMPTS]: () => {
      updateUIState({
        showPreviousPrompts: true,
      });
    },
    [NAV_ITEMS.SETTINGS]: () => {
      updateSettingsState({
        settingsTab: true,
        activeSectionSettings: "dashboard",
      });
    },
    [NAV_ITEMS.HELP]: () => {
      updateSettingsState({
        helpTabs: true,
        activeSectionSettings: "faq",
      });
    },
  }, [updatePromptGalleryFlagState, resetChatState, updateUIStateWithNav, updateUIState, updateSettingsState, resetSearchAndSettings]);

  /**
   * Handle side navigation clicks and route to appropriate handlers
   * @param {string} activePage - The navigation page identifier
   */
  const handleSideNavClick = useCallback((activePage) => {
    const handler = navigationHandlers[activePage];
    if (typeof handler === "function") {
      handler();
      return;
    }
    // Gracefully handle unknown nav ids (e.g., 'token-usage')
    if (activePage === "token-usage") {
      updateSettingsState({
        settingsTab: true,
        activeSectionSettings: "dashboard",
      });
      return;
    }
    // Fallback to New Prompt
    const fallback = navigationHandlers[NAV_ITEMS.NEW_PROMPT];
    if (typeof fallback === "function") fallback();
  }, [navigationHandlers, updateSettingsState]);

  /**
   * Start a new chat session and reset application state
   */
  const handleNewChat = useCallback(() => {
    updateSearchState({
      searchInput: "",
    });
    updateChatState({
      selectedMessages: [],
      newChat: true,
      showFinalContent: false,
    });
    updateUIState({
      activeItem: NAV_ITEMS.NEW_PROMPT,
    });
    updateSettingsState({
      helpTabs: false,
      settingsTab: false,
    });
  }, [updateSearchState, updateChatState, updateUIState, updateSettingsState]);

  /**
   * Handle form submission from voice recognition or manual input
   * @param {string} finalText - The final text to submit (from voice or manual input)
   */
  const onFormSubmit = useCallback((finalText) => {
    if (finalText) {
  
      handleFormSubmitUtil({
        inputValue: finalText,
        dispatch,
        setValue,
        setFocus,
        selectedMessages,
        messages,
        generateCard,
        newChat,
        chatRef: null, // No chatRef in this context
        analyticsListCard,
        aiAudience,
        aiCommunication,
      });

      // Close voice search mode after processing
      updateSpeechState({
        inputVoiceSearch: false,
        isListening: false,
      });
      
      // Clear the search input to prevent repeated submission
      updateSearchState({
        searchInput: "",
      });
    }
  }, [handleFormSubmitUtil, dispatch, setValue, setFocus, selectedMessages, messages, generateCard, newChat, analyticsListCard, aiAudience, aiCommunication, updateSpeechState, updateSearchState]);

  /**
   * Handle voice search form submission
   * 
   * This function processes voice search submissions by calling the form
   * submission utility and clearing the search input to prevent repeated
   * submissions. It's specifically designed for voice input scenarios.
   * 
   * Side Effects:
   * - May trigger form submission processing
   * - Updates Redux search state
   * - May update chat and other application states
   */
  const handleVoiceSearch = useCallback(() => {
    
    handleFormSubmitUtil({
      inputValue: searchInput,
      dispatch,
      setValue,
      setFocus,
      selectedMessages,
      messages,
      generateCard,
      newChat,
      chatRef: null, // No chatRef in this context
      analyticsListCard,
      aiAudience,
      aiCommunication,
    });
    
    // Clear the search input after processing to prevent repeated submission
    updateSearchState({
      searchInput: "",
    });
  }, [searchInput, handleFormSubmitUtil, dispatch, setValue, setFocus, selectedMessages, messages, generateCard, newChat, analyticsListCard, aiAudience, aiCommunication, updateSearchState]);

  /**
   * Handle manual submission from Wakeup component
   * @param {string} finalText - The manually edited text to submit
   */
  const handleManualSubmission = useCallback((finalText) => {
    if (finalText) {
      handleFormSubmitUtil({
        inputValue: finalText,
        dispatch,
        setValue,
        setFocus,
        selectedMessages,
        messages,
        generateCard,
        newChat,
        chatRef: null, // No chatRef in this context
        analyticsListCard,
        aiAudience,
        aiCommunication,
      });
      
      // Clear the search input after processing to prevent repeated submission
      updateSearchState({
        searchInput: "",
      });
    }
  }, [handleFormSubmitUtil, dispatch, setValue, setFocus, selectedMessages, messages, generateCard, newChat, analyticsListCard, aiAudience, aiCommunication, updateSearchState]);

  /**
   * Resume voice listening after user submits edited transcript
   * 
   * This function manages the transition from manual editing back to
   * voice recognition by:
   * 1. Clearing any existing search input
   * 2. Resetting form values
   * 3. Enabling voice search mode
   * 4. Setting listening state to active
   * 
   * It's used when users want to continue with voice input after
   * manually editing a transcript.
   * 
   * Side Effects:
   * - Updates Redux search state
   * - Updates Redux speech state
   * - Clears form input values
   */
  const handleResumeListening = useCallback(() => {
    // Resume listening after user submits edited transcript
    // Clear any existing search input to prevent old transcripts from appearing
    updateSearchState({
      searchInput: "",
    });
    
    // Also clear the form value to ensure complete clearing
    setValue("searchInput", "");
    
    updateSpeechState({
      inputVoiceSearch: true,
      isListening: true,
    });
  }, [updateSearchState, setValue, updateSpeechState]);

  /**
   * Synchronize edited transcript with search state
   * 
   * This function updates the search input with manually edited
   * transcript text, allowing the application to process the
   * corrected version instead of the original voice input.
   * 
   * @param {string} editedTranscript - The manually edited transcript text
   */
  const handleSyncTranscript = useCallback((editedTranscript) => {
    // Update the search input with the edited transcript
    updateSearchState({
      searchInput: editedTranscript,
    });
  }, [updateSearchState]);

  /**
   * Handle application close and show confirmation modal
   * 
   * This function initiates the application close process by:
   * 1. Showing the confirmation modal
   * 2. Clearing search input
   * 3. Resetting UI state (dark mode, workings, icons)
   * 4. Clearing chat selections
   * 
   * It's used when users want to exit the application or
   * when the system needs to reset to a clean state.
   * 
   * Side Effects:
   * - Shows confirmation modal
   * - Updates Redux search state
   * - Updates Redux UI state
   * - Updates Redux chat state
   */
  const handleClose = useCallback(() => {
    setShowModal(true);
    updateSearchState({
      searchInput: "",
    });
    updateUIState({
      isDarkMode: false,
      showWorkings: false,
      howerStarIcon: false,
    });
    updateChatState({
      selectedMessages: [],
      showFinalContent: false,
    });
  }, [setShowModal, updateSearchState, updateUIState, updateChatState]);

  /**
   * Confirm application close and reset all state
   */
  const handleGenieClose = useCallback(() => {
    setShowModal(false);
    dispatch(resetGenie());
  }, [setShowModal, dispatch]);

  return (
    <FormProvider {...methods}>
      <FloatingGenie />
      {inputVoiceSearch ? (
        <VoiceRecognition
          onFormSubmit={(finalText) => {
            onFormSubmit(finalText);
            // Always clear the input field after submission
          }}
          onResumeListening={handleResumeListening}
          onSyncTranscript={handleSyncTranscript}
        />
      ) : (
        <Wakeup
          setShowHome={(show) => updateUIState({ showHome: show })}
          handleGenieClose={handleGenieClose}
          handleNewChat={handleNewChat}
          handleVoiceSearch={handleVoiceSearch}
          onFormSubmit={(finalText) => {
            onFormSubmit(finalText);
            // Always clear the input field after submission
          }}
          handleManualSubmission={handleManualSubmission}
          showHome={showHome}
        />
      )}
      {showHome && !helpTabs && !settingsTab && (
        <Home handleSideNavClick={handleSideNavClick} />
      )}
      {wakeup && !showHome && (
        <RSModal
          size={"xxlg"}
          show={wakeup}
          isBorder={false}
          isCloseButton={false}
          header={false}
          handleClose={() => {
            updateSpeechState({
              wakeup: false,
            });
          }}
          className={`genie-wakeup genie_wrapper genie_backfade p0 `}
          body={
            <>
              <div className="position-absolute right10 top3">
                <RSTooltip text={"Close"}>
                  <img
                    src={genieIcons?.genieClose}
                    className="cursor-pointer"
                    onClick={() => {
                      setShowModal(false);
                      updateChatState({
                        messages: [],
                        selectedChat: false,
                      });
                      updateUIState({
                        collapsed: true,
                        showAlert: true,
                      });
                      updateSpeechState({
                        wakeup: false,
                      });
                      // dispatch(updateAICommunication(false));
                      updateUIState({
                        showHome: true,
                      });
                    }}
                  />
                </RSTooltip>
              </div>
              <div className="d-flex justify-content-center align-items-center h-100">
                <div>
                  <div className="genie_text text-center">
                    <h1 className="mb15">Hello Sophia,</h1>
                    <span className={`white animate-text`}>
                      What can I do for you today?
                    </span>
                  </div>
                  <video
                    src={genieIcons?.wakeup}
                    autoPlay
                    muted
                    loop
                    className="video"
                  ></video>
                </div>
              </div>
            </>
          }
        />
      )}
      {helpTabs && (
        <>
          <TermsAndCondition />
          <Help handleSideNavClick={handleSideNavClick} />
        </>
      )}
      {settingsTab && (
        <>
          <TermsAndCondition />
          <Settings handleSideNavClick={handleSideNavClick} />
        </>
      )}
    </FormProvider>
  );
}

export default Genie;
