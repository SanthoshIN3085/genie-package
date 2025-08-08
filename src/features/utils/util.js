import { WORD_REPLACEMENTS } from "../command";
//UTILITY FUNCTIONS
/**
 * Transforms words in the given text using the WORD_REPLACEMENTS pattern.
 *
 * @param {string} text - The input text to transform.
 * @returns {string} The transformed text with replacements applied.
 */
export const transformGenieWords = (text) =>
  text.replace(WORD_REPLACEMENTS, "genie");
