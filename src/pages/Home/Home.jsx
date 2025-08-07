import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SideNav from "../SideNav/SideNav";
import MainLayout from "Components/layout/MainLayout";
import Welcome from "../Welcome/Welcome";
import ChatBox from "../ChatBox/ChatBox";
import { useFormContext } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import GalleryPrompt from "../GalleryPrompt/GalleryPrompt";
import { contentVariants, getContentVariants } from "../../animation/home";
import { GenPrimaryButton, GenSecondaryButton } from "Components/Buttons";
import * as genieIcons from "../../assets/genieIcons";
import {
  updatePromptGalleryFlag,
  updateUI,
  updateChat,
  updateSearch,
  updateSettings,
  resetChat,
} from "Reducers/genie/reducer";
import TermsAndCondition from "Components/common/TermsAndCondition/TermsAndCondition";
import { getUserDateTimeFormat } from "../../Utils";
import * as constant from "../../constant/Sectors/banking";
import { Workings } from "../Workings/Workings";
import { handleFormSubmit as handleFormSubmitUtil } from "../../Utils/formHandlers";

import { lowerCase } from "lodash";
// Constants for navigation items
const NAV_ITEMS = {
  NEW_PROMPT: "newprompt",
  PROMPT_GALLERY: "promptgallery",
  PREVIOUS_PROMPTS: "previousprompts",
  SETTINGS: "settings",
  HELP: "help",
  CHAT_BOX: "chatbox",
};

// Content mapping for different views
const CONTENT_MAP = {
  [NAV_ITEMS.NEW_PROMPT]: Welcome,
  [NAV_ITEMS.PROMPT_GALLERY]: GalleryPrompt,
  [NAV_ITEMS.CHAT_BOX]: ChatBox,
  default: Welcome,
};

function Home({ handleSideNavClick }) {
  const { setValue, setFocus, getValues } = useFormContext();
  const dispatch = useDispatch();
  const { ui, chat, settings, search, speech } = useSelector(
    (state) => state.genie
  );
  const { isTermsAndConditions } = settings;
  const { inputVoiceSearch } = speech;
  const {
    showPreviousPrompts,
    activeItem,
    showAlert,
    home,
    workingsExpanded,
    showWorkings,
  } = ui;
  const { searchInput, showSearch } = search;
  const { selectedMessages, messages, generateCard, newChat } = chat;

  const { aiCommunication, aiAudience, analyticsListCard } = constant;
  const chatRef = useRef(null);

  const handlePromptClick = (inputValue) => {
    // Update form value using setValue
    setValue("searchInput", inputValue);

    // Update search input with the selected prompt
    dispatch(
      updateSearch({
        searchInput: inputValue,
        searchInputLength: inputValue.length,
      })
    );

    // Reset chat state for new conversation
    dispatch(resetChat());
    // Reset skipTypingEffect flag for new conversations
    dispatch(
      updateChat({
        skipTypingEffect: false,
      })
    );

    // Switch to new prompt view
    dispatch(updatePromptGalleryFlag(false));
    dispatch(
      updateUI({
        showWorkings: false,
        activeItem: NAV_ITEMS.NEW_PROMPT,
      })
    );

    // Reset settings
    dispatch(
      updateSettings({
        helpTabs: false,
        settingsTab: false,
      })
    );
  };

  const handleFormSubmit = (inputValue) => {
    handleFormSubmitUtil({
      inputValue,
      dispatch,
      setValue,
      setFocus,
      selectedMessages,
      messages,
      generateCard,
      newChat,
      chatRef,
      analyticsListCard,
      aiAudience,
      aiCommunication,
    });
  };

  React.useEffect(() => {
    if (!searchInput || messages?.length > 0 || selectedMessages?.length > 0)
      return;

    const input = searchInput.toLowerCase();

    if (input.includes("segment of")) {
      dispatch(
        updateChat({
          generateCard: "audience",
        })
      );
    } else if (
      input.includes("provide") ||
      input.includes("summary") ||
      input.includes("report") ||
      input.includes("engagement") ||
      input.includes("summarize") ||
      input.includes("provide reach")
    ) {
      dispatch(
        updateChat({
          generateCard: "analytics",
        })
      );
    } else if (
      input.includes("campaign targeting") ||
      input.includes("communication targeting") ||
      input.includes("communication") ||
      input.includes("campaign")
    ) {
      dispatch(
        updateChat({
          generateCard: "communication",
        })
      );
    } else {
      dispatch(
        updateChat({
          generateCard: "audience",
        })
      );
    }
  }, [searchInput]);

  // Helper function to reset chat state
  const resetChatState = () => {
    dispatch(resetChat());
  };

  // Helper function to update UI state
  const updateUIState = (activeItem, showWorkings = false) => {
    dispatch(
      updateUI({
        showWorkings,
        activeItem,
      })
    );
  };

  // Helper function to reset search and settings
  const resetSearchAndSettings = () => {
    setValue("searchInput", "");
    dispatch(
      updateSearch({
        searchInput: "",
        searchInputLength: 0,
      })
    );
    dispatch(
      updateSettings({
        helpTabs: false,
        settingsTab: false,
      })
    );
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

  // Use the passed-in handler if provided, otherwise use the local one
  const sideNavClickHandler = handleSideNavClick
    ? handleSideNavClick
    : (activePage) => {
        // Special handling for Previous Prompts - don't change activeItem
        if (activePage === NAV_ITEMS.PREVIOUS_PROMPTS) {
          dispatch(
            updateUI({
              showPreviousPrompts: true,
            })
          );
          return;
        }

        const handler =
          navigationHandlers[activePage] ||
          navigationHandlers[NAV_ITEMS.NEW_PROMPT];
        handler();
      };

  const renderContent = () => {
    const ContentComponent = CONTENT_MAP[activeItem] || CONTENT_MAP.default;
    return (
      <ContentComponent
        handlePromptClick={handlePromptClick}
        handleSideNavClick={sideNavClickHandler}
        handleFormSubmit={handleFormSubmit}
        chatRef={activeItem === NAV_ITEMS.CHAT_BOX ? chatRef : null}
      />
    );
  };

  const getCurrentContentKey = () => {
    return activeItem;
  };

  return (
    <>
      <div
        className={`genie ${
          showPreviousPrompts || showWorkings || showSearch ? "genie-fade" : ""
        }`}
      >
        <TermsAndCondition />

        <MainLayout
          sidebar={<SideNav sideNavClick={sideNavClickHandler} />}
          content={
            <div
              className={` ${
                activeItem === "chatbox" ? "chat-container" : "center-container"
              }`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={getCurrentContentKey()}
                  variants={getContentVariants(getCurrentContentKey())}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="content-wrapper"
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
              {showWorkings && (
                <div
                  className={`working-wrapper ${
                    workingsExpanded ? "expanded" : ""
                  }`}
                >
                  <Workings messageId={null} messageIndex={null} />
                </div>
              )}
            </div>
          }
        />
      </div>
    </>
  );
}

export default Home;
