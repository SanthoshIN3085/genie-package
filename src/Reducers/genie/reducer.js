import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./initialValue";
import idGenerator from "../../Utils/dynamicIdGenerator";

// Initialize the ID generator with existing messages
idGenerator.initializeFromMessages(initialState.chat.messages);

export const genieReducer = createSlice({
  name: "genie",
  initialState,
  reducers: {
    updateSelectedPrompt: (state, action) => {
      state.selectedPrompt = action?.payload;
    },
    updatePromptGalleryFlag: (state, action) => {
      state.promptGalleryFlag = action?.payload;
    },
    updateUI: (state, { payload }) => {
      state.ui = {
        ...state.ui,
        ...payload,
      };
    },
    updateChat: (state, { payload }) => {
      state.chat = {
        ...state.chat,
        ...payload,
      };
    },
    updateSpeech: (state, { payload }) => {
      state.speech = {
        ...state.speech,
        ...payload,
      };
    },
    updateSearch: (state, { payload }) => {
      state.search = {
        ...state.search,
        ...payload,
      };
    },
    updateSettings: (state, { payload }) => {
      state.settings = {
        ...state.settings,
        ...payload,
      };
    },
    // Reset chat and ID generator
    resetChat: (state) => {
      state.chat.messages = [];
      state.chat.selectedChat = false;
      state.chat.newChat = true;
      state.chat.showFinalContent = false;
      state.chat.selectedMessages = [];
      state.chat.thumbsFeedback = {};
      state.chat.skipTypingEffect = false; // Reset skipTypingEffect flag
      idGenerator.reset();
    },
    // Handle thumbs up/down feedback
    updateThumbsFeedback: (state, { payload }) => {
      const { messageId, itemIndex, feedback } = payload;
      const key = `${messageId}-${itemIndex}`;
      
      if (feedback === 'up') {
        state.chat.thumbsFeedback[key] = 'up';
      } else if (feedback === 'down') {
        state.chat.thumbsFeedback[key] = 'down';
      } else {
        delete state.chat.thumbsFeedback[key];
      }
    },
    // Reset ID generator only
    resetIdGenerator: () => {
      idGenerator.reset();
    },
    resetGenie: () => ({ ...initialState }),
  },
});

export const {
  updateSelectedPrompt,
  updatePromptGalleryFlag,
  updateUI,
  updateChat,
  updateSpeech,
  updateSearch,
  updateSettings,
  resetChat,
  resetIdGenerator,
  resetGenie,
  updateThumbsFeedback,
} = genieReducer.actions;

export default genieReducer.reducer;
