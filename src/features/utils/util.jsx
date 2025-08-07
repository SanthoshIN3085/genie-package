import { updateSpeech, updateChat, updateSearch } from "Reducers/genie/reducer";
import { WORD_REPLACEMENTS } from "../command";
import SpeechRecognition from "react-speech-recognition";
//UTILITY FUNCTIONS
/**
 * Transforms words in the given text using the WORD_REPLACEMENTS pattern.
 *
 * @param {string} text - The input text to transform.
 * @returns {string} The transformed text with replacements applied.
 */
export const transformGenieWords = (text) =>
  text.replace(WORD_REPLACEMENTS, "genie");

/**
 * Handles errors from the SpeechRecognition API and dispatches appropriate actions.
 *
 * @param {SpeechRecognitionErrorEvent} event - The error event from the SpeechRecognition API.
 * @param {Function} dispatch - Redux dispatch function.
 * @param {Function} stopListening - Function to stop listening.
 * @returns {void}
 *
 * Dispatches actions to update speech and chat state based on the error type.
 * Stops listening if an error occurs.
 */
export const handleSpeechRecognitionError = (event, dispatch) => {
  let errorMessage;
  if (event.error === "not-allowed") {
    errorMessage =
      "Microphone access denied. Please enable it for voice interaction.";
  } else if (event.error === "network") {
    errorMessage = "Network error. Please check your connection.";
  } else if (event.error === "Service not allowed") {
    errorMessage = "Enable Microphone access in your browser settings.";
  }

  if (errorMessage && dispatch) {
    dispatch(
      updateChat({
        errorTranscript: errorMessage,
      })
    );
  }
  if (dispatch) {
    dispatch(
      updateSpeech({
        isListening: false,
        inputVoiceSearch: false,
      })
    );
  }
  console.log("error recieved");
  stopListening({ dispatch });
};

/**
 * Starts the speech recognition process, resets the transcript, and updates the state.
 *
 * @param {Function} dispatch - Redux dispatch function.
 * @param {Function} resetTranscript - Function to reset the transcript.
 * @param {Function} clearTimeout - Function to clear a timeout.
 * @param {number} timeoutId - The ID of the timeout to clear.
 * @param {boolean} browserSupportsSpeechRecognition - Whether browser supports speech recognition.
 * @returns {void}
 */

export const startListening = (params) => {
  const {
    dispatch,
    resetTranscript,
    timeoutId = null,
    browserSupportsSpeechRecognition = false,
  } = params;
  if (browserSupportsSpeechRecognition) {
    handleSpeechRecognitionError({ error: "not-allowed" }, dispatch);
    return;
  }

  if (resetTranscript) {
    resetTranscript();
  }

  SpeechRecognition.startListening({
    continuous: true,
    interimResults: true,
    language: "en-IN",
  });
  if (dispatch) {
    dispatch(
      updateSpeech({
        isListening: true,
        inputVoiceSearch: false,
      })
    );
  }

  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  console.log("Listening started");
};

/**
 * Stops the speech recognition process, updates the state, and processes the transcript.
 *
 * @param {Function} dispatch - Redux dispatch function.
 * @param {Function} clearTimeout - Function to clear a timeout.
 * @param {number} timeoutId - The ID of the timeout to clear.
 * @param {string} transcript - Current transcript text.
 * @param {Function} onFormSubmit - Function to handle form submission.
 * @param {boolean} browserSupportsSpeechRecognition - Whether browser supports speech recognition.
 * @returns {void}
 */
export const stopListening = (params) => {
  // Handle case where dispatch is passed directly
  if (typeof params === "function") {
    params = { dispatch: params };
  }

  const {
    dispatch,
    timeoutId = null,
    transcript = "",
    onFormSubmit = () => {},
    browserSupportsSpeechRecognition = false,
  } = params || {};
  if (browserSupportsSpeechRecognition) {
    SpeechRecognition.stopListening();
  }

  if (!dispatch) return;
  dispatch(
    updateSpeech({
      isListening: false,
      inputVoiceSearch: false,
    })
  );

  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  if (transcript && onFormSubmit) {
    const correctedTranscript = transformGenieWords(transcript);
    dispatch(
      updateSearch({
        searchInput: correctedTranscript,
      })
    );
    onFormSubmit(correctedTranscript);
  }
};
