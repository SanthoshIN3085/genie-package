import React from "react";
import { Controller } from "react-hook-form";
import get from "lodash/get";
import PropTypes from "prop-types";

import * as regex from "../../constant/GlobalConstant/Regex";
// import * as icons from "Constants/GlobalConstant/Glyphicons";
import RSTooltip from "Components/RSTooltip";
import { useDispatch } from "react-redux";
// import { updateAICommunication, updateAIGenerateType } from 'Reducers/communication/createCommunication/Create/reducer';
const RSInput = ({
  type = "text",
  className = "",
  name,
  isNewTheme = true,
  rules,
  control,
  required,
  defaultValue = "",
  onBlur,
  placeholder,
  viewEye = false,
  onFocus,
  handleOnchange = () => {},
  handleOnBlur = () => {},
  handleOnFocus = () => {},
  meter,
  isError = true,
  isValidIcon = false,
  label = "",
  iconPlaceholder = false,
  imgPlaceholder = false,
  imgSrc = "",
  iconName = "",
  iconSize = "",
  disabled = false,
  isNumber,
  classWrapper,
  isLoading = false,
  formFieldContent = "",
  formFieldIcon = false,
  isGenie = false,
  isCustomIcon = false,
  isCustomDoubleIcon = false,
  isConfirmPassword = false,
  ...rest
}) => {
  const [typevalue, setTypevalue] = React.useState(type);
  const [password, setPassword] = React.useState("");
  const [showElement, setShowElement] = React.useState(true);
  const dispatch = useDispatch();
  const icons = "";
  React.useEffect(() => {
    if (isValidIcon) {
      setShowElement(true);
      setTimeout(function () {
        setShowElement(false);
      }, 5000);
    }
  }, [isValidIcon]);

  const passwordTracker = React.useMemo(
    () => ({
      uppercase: password.match(regex.ATLEAST_ONE_UPPERCASE),
      lowercase: password.match(regex.ATLEAST_OE_LOWERCASE),
      number: password.match(regex.ATLEAST_ONE_NUMBER),
      specialChar: password.match(regex.ATLEAST_ONE_SPECIAL_CHARACTERS),
      CharsOrGreater: password.match(regex.CHARS_OR_MORE),
    }),
    [password]
  );
  const passwordStrength = React.useMemo(
    () => Object.values(passwordTracker).filter((value) => value).length,
    [password]
  );

  React.useEffect(() => {
    setTypevalue(type);
  }, [type]);

  return (
    <Controller
      // rules={rules}
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => {
        const _isEmpty = get(error, "message", "")?.length > 0;
        let errMsg = get(error, "message", "");
        // viewEye && setPassword(field.value);
        return (
          <div
            className={`rs-input-wrapper ${classWrapper ?? ""} ${
              _isEmpty ? "errorContainer" : ""
            } ${required ? "rs-input-wrapper-required" : ""} ${
              isNewTheme ? "rs-input-placeholder-wrapper" : ""
            } 
                        ${isCustomIcon ? "input-custom-icon" : ""}
                        ${isCustomDoubleIcon ? "input-custom-double-icon" : ""}
                        `}
          >
            {/* {_isEmpty && <div className="validation-message">{get(error, 'message', '')}</div>} */}
            <input
              {...rest}
              {...field}
              name={name}
              onBlur={(e) => {
                e.target.value = e.target.value.trim();
                handleOnBlur(e);
                field.onBlur(e);
              }}
              onFocus={(e) => {
                e.target.value = e.target.value.trim();
                handleOnFocus(e);
              }}
              type={typevalue}
              className={`${className}  ${required ? "required" : ""}`}
              placeholder={isNewTheme ? " " : placeholder}
              autoComplete={"off"}
              disabled={disabled}
              onPaste={(e) => {
                if (import.meta.env.MODE !== "dev" && !isGenie) {
                  e.preventDefault();
                }
                if (isConfirmPassword) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                if (viewEye) setPassword(e.target.value);
                handleOnchange(e);
                if (type === "number" && isNumber) {
                  const number = e.target.value;
                  field.onChange(
                    number.indexOf(".") >= 0
                      ? number.slice(0, number.indexOf(".") + 3)
                      : number
                  );
                } else {
                  let trim;
                  if (e.target.value.trim().length === 0) trim = "";
                  else {
                    trim = e.target.value.replace(/ +/g, " ");
                  }
                  field.onChange(trim);
                }
              }}
            />
            {isNewTheme && (
              <>
                <label>
                  {_isEmpty && isError
                    ? errMsg
                    : label !== ""
                    ? label
                    : placeholder}
                  {required && <span className="required"> {" *"}</span>}
                </label>
                {required && <div className="border-bottom-required"></div>}
              </>
            )}
            {isLoading && (
              <div className="rs-inputIcon-wrapper">
                <div className="segment_loader"></div>
              </div>
            )}
            {viewEye && (
              <div className="rs-inputIcon-wrapper">
                <i
                  className={`icon-md cursor-pointer color-primary-grey ${
                    typevalue === "password"
                      ? icons.eye_hide_medium
                      : icons.eye_medium
                  } `}
                  onClick={() => {
                    setTypevalue(typevalue === "text" ? "password" : "text");
                  }}
                ></i>
              </div>
            )}
            {iconPlaceholder && (
              <div className="rs-inputIcon-wrapper">
                <i
                  className={`${iconSize} cursor-pointer color-primary-grey ${iconName} `}
                ></i>
              </div>
            )}
            {imgPlaceholder && (
              <div className="rs-inputIcon-wrapper">
                <RSTooltip text="Generate content">
                  <img
                    src={imgSrc}
                    className="cp"
                    // onClick={() => {
                    //     dispatch(updateAICommunication(true));
                    //     dispatch(updateAIGenerateType('content'));
                    // }}
                  />
                </RSTooltip>
              </div>
            )}

            {meter && (
              <div
                className={`password-strength-meter bg${
                  (passwordStrength / 5) * 100
                }`}
              ></div>
            )}
            {isValidIcon && showElement && (
              <div className="rs-validate-success-icon">
                <i
                  className={`${icons.tick_mini} icon-xs color-primary-green`}
                />
              </div>
            )}

            {formFieldIcon && (
              <RSTooltip text={formFieldContent}>
                <div className="form-field-icon">
                  <i
                    className={`${icons.circle_question_mark_mini} icon-xs`}
                  ></i>
                </div>
              </RSTooltip>
            )}
          </div>
        );
      }}
    />
  );
};



RSInput.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  className: PropTypes.string,
  clearErrors: PropTypes.func,
  type: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  rules: PropTypes.object,
  setError: PropTypes.func,
  setValue: PropTypes.func,
  placeholder: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  isNewTheme: PropTypes.bool,
  viewEye: PropTypes.bool,
  iconSize: PropTypes.string,
  disabled: PropTypes.bool,
  iconPlaceholder: PropTypes.bool,
  imgPlaceholder: PropTypes.bool,
  meter: PropTypes.bool,
  isError: PropTypes.bool,
  isValidIcon: PropTypes.bool,
  label: PropTypes.string,
  iconName: PropTypes.string,
  imgSrc: PropTypes.string,
  formFieldContent: PropTypes.string,
  formFieldIcon: PropTypes.bool,
  isGenie: PropTypes.bool,
  isLoading: PropTypes.bool,
  isCustomIcon: PropTypes.bool,
  isCustomDoubleIcon: PropTypes.bool,
  isConfirmPassword: PropTypes.bool,
};

export default React.memo(RSInput);
