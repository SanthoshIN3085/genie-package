import React, { useState } from "react";
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
const NAV_ITEMS = {
  NEW_PROMPT: "newprompt",
  PROMPT_GALLERY: "promptgallery",
  PREVIOUS_PROMPTS: "previousprompts",
  SETTINGS: "settings",
  HELP: "help",
  CHAT_BOX: "chatbox",
};

function Genie() {
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

  // Helper functions
  const resetChatState = () => {
    dispatch(resetChat());
  };
  const updateUIState = (activeItem, showWorkings = false) => {
    dispatch(
      updateUI({
        showWorkings,
        activeItem,
      })
    );
  };
  const resetSearchAndSettings = () => {
    dispatch(updateSearch({ searchInput: "" }));
    dispatch(
      updateSettings({
        helpTabs: false,
        settingsTab: false,
      })
    );
    methods.setValue("searchInput", "");
  };

  // Navigation handlers
  const navigationHandlers = {
    [NAV_ITEMS.NEW_PROMPT]: () => {
      dispatch(updatePromptGalleryFlag(false));
      resetChatState();
      updateUIState(NAV_ITEMS.NEW_PROMPT);
      resetSearchAndSettings();
    },
    [NAV_ITEMS.PROMPT_GALLERY]: () => {
      resetChatState();
      updateUIState(NAV_ITEMS.PROMPT_GALLERY);
      dispatch(updatePromptGalleryFlag(true));
    },
    [NAV_ITEMS.PREVIOUS_PROMPTS]: () => {
      dispatch(
        updateUI({
          showPreviousPrompts: true,
        })
      );
    },
    [NAV_ITEMS.SETTINGS]: () => {
      dispatch(
        updateSettings({
          settingsTab: true,
          activeSectionSettings: "dashboard",
        })
      );
    },
    [NAV_ITEMS.HELP]: () => {
      dispatch(
        updateSettings({
          helpTabs: true,
          activeSectionSettings: "faq",
        })
      );
    },
  };

  const handleSideNavClick = (activePage) => {
    const handler = navigationHandlers[activePage];
    if (typeof handler === "function") {
      handler();
      return;
    }
    // Gracefully handle unknown nav ids (e.g., 'token-usage')
    if (activePage === "token-usage") {
      // Route to settings dashboard as a sensible default action
      dispatch(
        updateSettings({
          settingsTab: true,
          activeSectionSettings: "dashboard",
        })
      );
      return;
    }
    // Fallback to New Prompt
    const fallback = navigationHandlers[NAV_ITEMS.NEW_PROMPT];
    if (typeof fallback === "function") fallback();
  };

  const handleNewChat = () => {
    dispatch(
      updateSearch({
        searchInput: "",
      })
    );
    dispatch(
      updateChat({
        selectedMessages: [],
        newChat: true,
        showFinalContent: false,
      })
    );
    dispatch(
      updateUI({
        activeItem: NAV_ITEMS.NEW_PROMPT,
      })
    );
    dispatch(
      updateSettings({
        helpTabs: false,
        settingsTab: false,
      })
    );
  };


  const onFormSubmit = (finalText) => {
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
      dispatch(
        updateSpeech({
          inputVoiceSearch: false,
          isListening: false,
        })
      );
      
      // Clear the search input to prevent repeated submission
      dispatch(
        updateSearch({
          searchInput: "",
        })
      );
    }
  };

  const handleVoiceSearch = () => {
    
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
    dispatch(
      updateSearch({
        searchInput: "",
      })
    );
  };

  const handleResumeListening = () => {
    // Resume listening after user submits edited transcript
    // Clear any existing search input to prevent old transcripts from appearing
    dispatch(
      updateSearch({
        searchInput: "",
      })
    );
    
    // Also clear the form value to ensure complete clearing
    setValue("searchInput", "");
    
    dispatch(
      updateSpeech({
        inputVoiceSearch: true,
        isListening: true,
      })
    );
  };

  const handleSyncTranscript = (editedTranscript) => {
    // Update the search input with the edited transcript
    dispatch(
      updateSearch({
        searchInput: editedTranscript,
      })
    );
  };

  const handleClose = () => {
    setShowModal(true);
    dispatch(
      updateSearch({
        searchInput: "",
      })
    );
    dispatch(
      updateUI({
        isDarkMode: false,
        showWorkings: false,
        howerStarIcon: false,
      })
    );
    dispatch(
      updateChat({
        selectedMessages: [],
        showFinalContent: false,
      })
    );
  };

  const handleGenieClose = () => {
    setShowModal(false);
    dispatch(resetGenie());
  };

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
          setShowHome={(show) => dispatch(updateUI({ showHome: show }))}
          handleGenieClose={handleGenieClose}
          handleNewChat={handleNewChat}
          handleVoiceSearch={handleVoiceSearch}
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
            dispatch(
              updateSpeech({
                wakeup: false,
              })
            );
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
                      dispatch(
                        updateChat({
                          messages: [],
                          selectedChat: false,
                        })
                      );
                      dispatch(
                        updateUI({
                          collapsed: true,
                          showAlert: true,
                        })
                      );
                      dispatch(
                        updateSpeech({
                          wakeup: false,
                        })
                      );
                      // dispatch(updateAICommunication(false));
                      dispatch(
                        updateUI({
                          showHome: true,
                        })
                      );
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
