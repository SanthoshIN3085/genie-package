import { lowerCase } from "lodash";
import {
  updateUI,
  updateChat,
  updateSearch,
  resetChat,
} from "Reducers/genie/reducer";
import { getUserDateTimeFormat } from "./index";

// Constants for navigation items
const NAV_ITEMS = {
  NEW_PROMPT: "newprompt",
  PROMPT_GALLERY: "promptgallery",
  PREVIOUS_PROMPTS: "previousprompts",
  SETTINGS: "settings",
  HELP: "help",
  CHAT_BOX: "chatbox",
};

export const handleFormSubmit = ({
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
}) => {
  if (!inputValue) return;

  // Clear both form field and Redux state
  setValue("searchInput", "");
  dispatch(
    updateSearch({
      searchInput: "",
      searchInputLength: 0,
    })
  );

  dispatch(
    updateUI({
      activeItem: NAV_ITEMS.CHAT_BOX,
      genieLoading: true,
      showWorkings: false,
    })
  );
  
  setTimeout(() => {
    dispatch(
      updateUI({
        genieLoading: false,
      })
    );
  }, 1000);
  
  const date = new Date();
  const timeData = getUserDateTimeFormat(date, "chatDateTime");

  // Check if the input contains analytics-related keywords
  const isAnalyticsRequest =
    lowerCase(inputValue).includes("analytics") ||
    lowerCase(inputValue).includes("report") ||
    lowerCase(inputValue).includes("performance") ||
    lowerCase(inputValue).includes("metrics") ||
    lowerCase(inputValue).includes("data");

  if (isAnalyticsRequest) {
    // Handle analytics request
    const analyticsResponse = {
      message: "",
      time: timeData,
      responseData: {
        dataRepresentation: 2, // New type for analytics
        responseData: analyticsListCard,
      },
    };

    const updatedSelectedMessages = [
      ...selectedMessages,
      {
        id: selectedMessages.length + 1,
        user: [{ text: inputValue, time: timeData }],
        genieAI: [analyticsResponse],
      },
    ];

    dispatch(
      updateChat({
        selectedChat: true,
        selectedMessages: updatedSelectedMessages,
        newChat: true,
        generateCard: "analytics",
        skipTypingEffect: false, // Reset skipTypingEffect for new chats
      })
    );
  } else if (
    generateCard !== "audience" &&
    generateCard !== "communication"
  ) {
    const updatedMessages = [
      ...messages,
      {
        text: inputValue,
        time: timeData,
      },
    ];
    dispatch(
      updateChat({
        selectedChat: false,
        messages: updatedMessages,
      })
    );
  } else {
    const aiResponses =
      generateCard === "audience" ? aiAudience : aiCommunication;
    const newId = selectedMessages.length + 1;
    const aiResponseIndex = (newId - 1) % aiResponses.length;

    // Create a copy of the AI response and add the time
    const aiResponseWithTime = {
      ...aiResponses[aiResponseIndex],
      time: timeData,
    };

    const updatedSelectedMessages = [
      ...selectedMessages,
      {
        id: newId,
        user: [{ text: inputValue, time: timeData }],
        genieAI: [aiResponseWithTime],
      },
    ];

    dispatch(
      updateChat({
        selectedChat: true,
        selectedMessages: updatedSelectedMessages,
        newChat: true,
        skipTypingEffect: false, // Reset skipTypingEffect for new chats
      })
    );
  }
  
  setTimeout(() => {
    if (chatRef?.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, 100);
  
  setTimeout(() => {
    setFocus("searchInput");
  }, 1500);
}; 