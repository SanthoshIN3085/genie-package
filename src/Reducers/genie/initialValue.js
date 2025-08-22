export const initialState = {
  chat: {
    messages: [],
    selectedChat: false,
    selectedMessages: [],
    newChat: true,
    editIndex: null,
    generateCard: "audience",
    transcript: "",
    errorTranscript: "",
    userCommand: "",
    showFinalContent: false,
    searchInputValue: "",
    thumbsFeedback: {}, // Store thumbs up/down state by messageId and itemIndex
    skipTypingEffect: false, // Add skipTypingEffect flag
    hasPlayedFirstAudio: false, // Track if the first AI response audio has been played
    aiResponseCount: 0, // Track the number of AI responses in the conversation
  },
  speech: {
    listeningText: "Listening...",
    isListening: false,
    isSpeaking: false,
    isVoiceMode: false,
    isAudioMode: false,
    wakeup: false,
    inputVoiceSearch: false,
    transcript: "",
  },
  search: {
    searchInput: "",
    searchInputLength: 0,
    showSearch: false,
  },
  ui: {
    collapsed: true,
    isDarkMode: false,
    genieLoading: false,
    showAlert: true,
    recommendedPrompts: false,
    showPreviousPrompts: false,
    showVideoModal: false,
    spanText: false,
    howerStarIcon: false,
    workingsExpanded: false,
    showWorkings: false,
    currentWorkingsMessageId: null, // Track which message triggered workings
    currentWorkingsMessageIndex: null, // Track the message index
    activeItem: "newprompt",
    promptBoxHeight: 0,
    loadingChat: false,
    label: "",
    home: true,
    showHome: false,
    typingEnd: false,
  },
  settings: {
    isTermsAndConditions: false,
    helpTabs: false,
    settingsTab: false,
    activeSection: "faq",
    activeSectionSettings: "dashboard",
  },
  promptGalleryFlag: false,
  selectedPrompt: "",
};
