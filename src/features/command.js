import { replace, lowerCase } from "lodash";
import constants from "./constants.json";

// Import constants from JSON
export const systemPhrases = constants.systemPhrases;
export const openKeywords = constants.openKeywords;
export const closeKeywords = constants.closeKeywords;
export const analysisKeywords = constants.analysisKeywords;
export const proceedingText = constants.proceedingText;
export const chatSkipPhrases = constants.chatSkipPhrases;
export const darkModeOnPhrases = constants.darkModeOnPhrases;
export const lightModeOnPhrases = constants.lightModeOnPhrases;
export const darkModeOffPhrases = constants.darkModeOffPhrases;
export const lightModeOffPhrases = constants.lightModeOffPhrases;

// Profanity filter - Common profanity words to filter out
export const profanityWords = constants.profanityWords;

// Create RegExp patterns for better performance
export const openKeywordsRegex = new RegExp(
  constants.openKeywords
    .map((keyword) => `\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`)
    .join("|"),
  "i"
);

export const closeKeywordsRegex = new RegExp(
  constants.closeKeywords
    .map((keyword) => `\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`)
    .join("|"),
  "i"
);

export const analysisKeywordsRegex = new RegExp(
  constants.analysisKeywords
    .map((keyword) => `\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`)
    .join("|"),
  "i"
);

export const proceedingTextRegex = new RegExp(
  constants.proceedingText
    .map((text) => `\\b${text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`)
    .join("|"),
  "i"
);

export const profanityWordsRegex = new RegExp(
  constants.profanityWords
    .map((word) => `\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`)
    .join("|"),
  "i"
);

// Profanity filter function
export const filterProfanity = (text) => {
  if (!text || typeof text !== "string") {
    return text;
  }

  // Use regex to replace profanity words with empty string
  return text.replace(profanityWordsRegex, "").replace(/\s+/g, " ").trim();
};

// Check if text contains profanity
export const containsProfanity = (text) => {
  if (!text || typeof text !== "string") {
    return false;
  }

  return profanityWordsRegex.test(text);
};

// Check if text contains open keywords
export const containsOpenKeywords = (text) => {
  if (!text || typeof text !== "string") {
    return false;
  }

  return openKeywordsRegex.test(text);
};

// Check if text contains close keywords
export const containsCloseKeywords = (text) => {
  if (!text || typeof text !== "string") {
    return false;
  }

  return closeKeywordsRegex.test(text);
};

// Check if text contains analysis keywords
export const containsAnalysisKeywords = (text) => {
  if (!text || typeof text !== "string") {
    return false;
  }

  return analysisKeywordsRegex.test(text);
};

// Check if text contains proceeding text
export const containsProceedingText = (text) => {
  if (!text || typeof text !== "string") {
    return false;
  }

  return proceedingTextRegex.test(text);
};

// Word replacements for common voice recognition mistakes
export const WORD_REPLACEMENTS = new RegExp(
  "\\b(" +
    constants.wordReplacements
      .map((word) => replace(word, /[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|") +
    ")\\b",
  "gi"
);
