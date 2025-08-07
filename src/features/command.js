import { replace, lowerCase } from "lodash";
export const systemPhrases = [
  "what can i do for you today",
  "would you like to proceed",
  "sure",
  "ok",
  "proceeding with your request",
  "i could not assist with you here, please check with genie dashboard",
  "okay, please check with the genie dashboard for assistance",
];

export const openKeywords = new Set(
  [
    "hey jini",
    "hi jini",
    "hey genie",
    "hi genie",
    "hey jenny",
    "hi jenny",
    "hey jeeni",
    "hi jeeni",
    "hey jeani",
    "hi jeani",
    "hi gini",
    "hey gini", 
    "hi ginny",
    "hey ginny",
    "hi jeanie",
    "hey jeanie",
    "hi jeannie",
    "hey jeannie",
    "hi jinni",
    "hey jinni",
    "hi djinni",
    "hey djinni",
    "hygienic",
    "open jini",
    "wake up jini",
    "start jini",
    "ghajini",
    "rajini",
    "hello genie",
    "hello jenny",
    "hey ji",
    "hi ji",
    "hello ji",
    "hello gi",
    "hi gi",
    "hygien",
    "hello gen", 
    "hello jen",
  ]);

export const closeKeywords = new Set(
  [
    "goodbye jini",
    "goodbye genie",
    "by jini",
    "close jini",
    "exit jini",
    "go to sleep jini",
    "stop jini",
    "bye jini",
    "close genie",
    "exit genie",
    "bye genie",
    "close recent",
    "bye recent",
    "by genie",
    "by jini",
    "close jenny",
    "close genie",
  ]);

export const analysisKeywords = new Set(
  ["create", "communication", "segment", "analytics", "campaign"].map(
    (keyword) => lowerCase(keyword)
  )
);
export const proceedingText = [
  "yes",
  "proceed",
  "ok",
  "okay",
  "sure",
  "absolutely",
  "of course",
  "yeah",
  "yep",
  "yup",
  "please",
  "go ahead",
  "affirmative",
  "do it",
  "move on",
  "continue",
  "confirm",
  "i agree",
  "ready",
  "start",
  "next",
  "alright",
  "fine",
  "sounds good",
  "good to go",
  "yessir",
  "yea",
  "roger",
  "correct",
  "make it so",
  "onward",
  "approved",
  "permission granted",
];

export const chatSkipPhrases = new Set(
  [
    "cancel",
    "skip",
    "no",
    "stop",
    "negative",
    "no thanks",
    "no thank you",
    "no need",
    "no need to",
    "don't know",
    "do not know",
    "not sure",
    "not sure about that",
    "not sure about this",
    "confused",
    "i dont know",
    "i dont know about that",
    "i dont know about this",
  ]);

export const darkModeOnPhrases = new Set(
  ["dark mode", "turn on dark mode", "dark mode on"]);

export const lightModeOnPhrases = new Set(
  ["light mode", "turn on light mode", "light mode on"]);
export const darkModeOffPhrases = new Set(
  ["dark mode off", "turn off dark mode", "dark mode off"]);
export const lightModeOffPhrases = new Set(
  ["light mode off", "turn off light mode", "light mode off"]);

// Word replacements for common voice recognition mistakes
export const WORD_REPLACEMENTS = new RegExp(
  "\\b(" +
    [
      "jenny",
      "jini",
      "ginny",
      "jeanie",
      "gini",
      "jinny",
      "genie's",
      "genies",
      "gini's",
      "jeannie",
      "gene",
      "jeannie's",
      "geny",
      "jinni",
      "djinni",
      "djinn",
      "rajini",
      "chinni",
      "jinni",
      "chinie",
      "ghajini",
      "gajini",
      "jani",
      "sani",
      "seni",
    ]
      .map((word) => replace(word, /[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|") +
    ")\\b",
  "gi"
);

// Note: transformGenieWords function is defined in util.js to avoid duplication
