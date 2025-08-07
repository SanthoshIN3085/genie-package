import React, { useEffect } from "react";
import PropTypes from "prop-types";
import _get from "lodash/get";
import { Controller } from "react-hook-form";
// import { RSPrimaryButton } from "Components/Buttons";
import { formatBytes } from "../../Utils/index";
import { Row, Col } from "react-bootstrap";
import { getFileToBase64 } from "../../Utils/base64/index";
import * as errors from "../../constant/GlobalConstant/ValidationMessage";
// import * as icons from 'Constants/GlobalConstant/Glyphicons';
import RSTooltip from "Components/RSTooltip";

const RSFileUpload = ({
  control,
  setError,
  clearErrors,
  name,
  rules,
  defaultValue,
  text,
  label,
  accept = "",
  option2 = "",
  size = null,
  handleChange = () => {},
  placeholder = "",
  isbase64 = false,
  required = "",
  className = "",
  isPrefix = false,
  containerClass,
  fileClass,
  fileCol,
  btnCol,
  customTop,
  children,
  shortUpload,
  customBottomText,
  externalTriggerRef,
  isReset = false,
  onFileSelect = () => {},
  ...rest
}) => {
  const inputRef = React.useRef();
  const [fileName, setFileName] = React.useState("Choose file");
  useEffect(() => {
    if (externalTriggerRef) {
      externalTriggerRef.current = {
        triggerClick: () => {
          inputRef.current.value = "";
          setFileName(
            placeholder.length > 0 && placeholder.includes(".")
              ? placeholder
              : "Choose file"
          );
          inputRef.current.click();
        },
      };
    }
  }, [externalTriggerRef]);

  const handleReset = () => {
    inputRef.current.value = "";
    setFileName("Choose file");
    clearErrors(name);
    onFileSelect(null);
  };
  return (
    <Controller
      control={control}
      name={name}
      // rules={rules}
      defaultValue={defaultValue}
      render={({
        field: { onChange, ref, value, ...restField },
        fieldState: { error },
      }) => {
        let errMsg = _get(error, `message`, "");

        React.useEffect(() => {
          if (!value) {
            setFileName("Choose file");
          }
        }, [value]);

        return (
          <div
            className={`rs-file-upload-wrapper position-relative ${containerClass}`}
          >
            <Row>
              <Col
                //sm={fileCol ?? 9}
                className={`${fileClass}`}
              >
                <div className={`rsfuw-input-wrapper`}>
                  <span className="rsfuw-message">{errMsg} </span>
                  <label className="rsfuw-label">{fileName}</label>
                  <input
                    type="file"
                    accept={accept}
                    className={`rsfuw-input ${className} ${
                      required ? "required" : ""
                    }`}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (accept.length) {
                        const formats = accept.split(",");
                        if (
                          !formats.some((format) =>
                            file?.name.endsWith(format.toLowerCase())
                          )
                        ) {
                          setError(name, {
                            type: "custom",
                            message: errors.INVALID_FORMAT,
                          });
                          return;
                        }
                      }
                      if (size !== null && file.size >= size) {
                        setError(name, {
                          type: "custom",
                          message: errors.SELECT_LESS_THAN + formatBytes(size),
                        });
                        return;
                      }
                      clearErrors(name);
                      handleChange(e);
                      if (isbase64) {
                        const prefix = isPrefix ? "data:image/jpg;base64," : "";
                        getFileToBase64(
                          file,
                          (base64) => {
                            setFileName(file.name);
                            onChange(`${prefix}${base64}`);
                          },
                          (err) => console.log(err)
                        );
                      } else {
                        setFileName(file.name);
                        onChange(e.target.files);
                      }
                      if (onFileSelect) {
                        onFileSelect(file?.name);
                      }
                    }}
                    ref={(e) => {
                      inputRef.current = e;
                      ref(e);
                    }}
                    {...restField}
                    {...rest}
                  />
                </div>
                {customBottomText && (
                  <small className="small-text-space-top">
                    {placeholder.ALLOWED_FORMATS}{" "}
                    {placeholder.FILE_NAME_EXTENSIONS_JPG_PNG}
                  </small>
                )}
              </Col>
              {/* <Col sm={btnCol ?? 3} className="pl0">
                <div className="rsfuw-button-wrapper position-absolute top-12">
                  <RSPrimaryButton
                    onClick={() => {
                      inputRef.current.value = "";
                      setFileName("Choose file");
                      inputRef.current.click();
                    }}
                  >
                    {text ? text : "Upload"}
                  </RSPrimaryButton>
                  {children}
                </div>
              </Col> */}
              {/* {isReset && (
                            <Col sm={1}>
                                <RSTooltip text ='Reset' position = 'top'>
                                <i className= {`${icons.refresh_medium} icon-md color-primary-blue`} onClick={handleReset}/>
                                </RSTooltip>
                            </Col>
                           )}  */}
            </Row>
          </div>
        );
      }}
    />
  );
};



RSFileUpload.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  setError: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  rules: PropTypes.object,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  handleChange: PropTypes.func,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  option2: PropTypes.string,
  className: PropTypes.string,
  containerClass: PropTypes.string,
  required: PropTypes.string,
  isPrefix: PropTypes.bool,
  isbase64: PropTypes.bool,
  externalTriggerRef: PropTypes.object,
  onFileSelect: PropTypes.func,
  isReset: PropTypes.bool,
};

export default React.memo(RSFileUpload);
