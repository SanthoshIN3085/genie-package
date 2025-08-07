import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { get } from "lodash";
import { updateUI } from "../../Reducers/genie/reducer";
import { useDispatch, useSelector } from "react-redux";
const RSTextarea = ({
  name,
  value = "",
  className = "",
  rules,
  control,
  onBlur,
  rows = 3,
  placeholder,
  required,
  isNewTheme,
  defaultValue,
  isGenie,
  isAI = false,
  ...rest
}) => {
  const dispatch = useDispatch();
  const textareaRef = useRef(null);
  const textareaWrapper = useRef(null);
  const [extractedTag, setExtractedTag] = useState("");
  const [showChatID, setShowChatID] = useState(false);

  // Regex pattern to match #hUeF followed by numbers
  const idPattern = /#hUeF\d+/;

  const heightCheck = textareaRef?.current?.scrollHeight;
  const { chat } = useSelector((state) => state.genie);
  const { searchInputValue } = chat;
  useEffect(() => {
    if (textareaRef?.current) {
      if (heightCheck) {
        dispatch(updateUI({ promptBoxHeight: heightCheck }));
      }
    }
  }, [textareaRef?.current?.scrollHeight]);
  useEffect(() => {
    if (textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;

      if (heightCheck > 124) {
        textareaWrapper?.current?.classList.add("no-before");
      } else {
        textareaWrapper?.current?.classList.remove("no-before");
      }
    }
  }, [value, heightCheck, searchInputValue]);
  const handleInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handlePaste = (e, field) => {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData).getData(
      "text"
    );
    const match = pastedText.match(idPattern);

    if (match) {
      // Extract the tag
      const detectedTag = match[0];
      setExtractedTag(detectedTag);
      setShowChatID(true);

      // Remove the tag from the pasted text and add remaining text to textarea
      const restText = pastedText.replace(detectedTag, "").trim();
      const currentValue = field.value || "";
      const newValue = currentValue + restText;

      field.onChange(newValue);

      // Focus textarea after paste
      setTimeout(() => {
        textareaRef.current?.focus();
        const newCursorPos = newValue.length;
        textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    } else {
      // No ID pattern found, paste normally
      const currentValue = field.value || "";
      const newValue = currentValue + pastedText;
      field.onChange(newValue);
    }
  };

  const handleKeyDown = (e, field) => {
    if (e.key === "Backspace") {
      const textarea = textareaRef.current;
      const cursorPos = textarea.selectionStart;

      // If cursor is at the beginning (position 0) and we have an extracted tag
      if (cursorPos === 0 && extractedTag) {
        e.preventDefault();
        // Clear the extracted tag
        setExtractedTag("");
        setShowChatID(false);
      }
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => {
        const _isEmpty = get(error, "message", "")?.length > 0;

        return (
          <div
            className={`rs-textarea-wrapper form-floating ${
              isAI ? "pr5 mr5" : ""
            }`}
            ref={textareaWrapper}
          >
            {_isEmpty && (
              <div className="validation-message top-5">
                {get(error, "message", "")}
              </div>
            )}

            {/* Input wrapper with tag and textarea */}
            <div className="input-wrapper d-flex align-items-center flex-wrap">
              {/* Extracted ID Tag */}
              {extractedTag && isAI && (
                <span className="genie-chat-id">{extractedTag}</span>
              )}

              {/* Textarea */}
              <textarea
                {...rest}
                {...field}
                name={name}
                className={`${className} ${
                  isAI ? "css-scrollbar" : "form-control"
                } flex-grow-1 ${extractedTag ? "extractedTag" : ""}`}
                autoComplete={"off"}
                id={name}
                rows={rows}
                ref={textareaRef}
                placeholder={isAI ? placeholder : ""}
                onInput={handleInput}
                onKeyDown={(e) => handleKeyDown(e, field)}
                onKeyPress={rest.onKeyPress}
                onPaste={(e) => handlePaste(e, field)}
              />
            </div>

            {!isAI && (
              <label htmlFor={name}>
                {placeholder} {required && <span className="required">*</span>}
              </label>
            )}
          </div>
        );
      }}
    />
  );
};



RSTextarea.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  className: PropTypes.string,
  clearErrors: PropTypes.func,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  rules: PropTypes.object,
  setError: PropTypes.func,
  setValue: PropTypes.func,
  required: PropTypes.bool,
  type: PropTypes.string,
  labelName: PropTypes.string,
  handleChange: PropTypes.func,
  isName: PropTypes.bool,
  rows: PropTypes.number,
};

export default React.memo(RSTextarea);
