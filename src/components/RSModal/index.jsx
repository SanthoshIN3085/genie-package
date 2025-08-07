import React from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import * as genieIcons from "../../assets/genieIcons";

const RSModal = ({
  settings = {},
  isCloseButton = true,
  header = true,
  body = <></>,
  footer = false,
  handleClose = () => {},
  show,
  size = "lg",
  isBorder = true,
  className = "",
  headerRightContent = false,
  modalTitleClass,
  closeTooltipPosition = "top",
  isCustomScroll = true,
  bodyClass = "",
}) => {
  const [isShow, setShow] = React.useState(false);
  const [isCloseicon, setIsCloseicon] = React.useState(false);

  React.useEffect(() => {
    setShow(show);
  }, [show]);

  return (
    <Modal
      show={isShow}
      centered
      backdrop="static"
      size={size}
      onHide={() => handleClose(false)}
      className={`rs-modal ${className}`}
      dialogClassName="rsm-dialog"
      contentClassName="rsmd-content"
      {...settings}
    >
      {header && (
        <Modal.Header
          style={{
            borderBottom: isBorder ? "#0000ff 1px solid" : "none",
          }}
          className={`rsmdc-header ${headerRightContent ? "" : ""}`}
        >
          <h2 className={`modal-title ${modalTitleClass}`}>{header}</h2>
          {headerRightContent && (
            <div className="modal-header-right-content">
              {headerRightContent}
            </div>
          )}
          {isCloseButton && (
            <div
              onClick={() => handleClose(false)}
              className="close"
              onMouseEnter={() => setIsCloseicon(true)}
              onMouseLeave={() => setIsCloseicon(false)}
            >
              <img
                src={
                  isCloseicon
                    ? genieIcons?.genieCloseWhite
                    : genieIcons?.genieClose
                }
              />
            </div>
          )}
        </Modal.Header>
      )}
      {/* {body && <Modal.Body className="rsmdc-body">{body}</Modal.Body>} */}
      {body && (
        <Modal.Body
          className={`rsmdc-body ${isCustomScroll ? "Xcss-scrollbar" : ""} ${
            bodyClass ? bodyClass : ""
          }`}
        >
          {body}
        </Modal.Body>
      )}
      {footer && <Modal.Footer className="rsmdc-footer">{footer}</Modal.Footer>}
    </Modal>
  );
};



RSModal.propTypes = {
  settings: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  header: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.string,
  ]),
  headerRightContent: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.string,
  ]),
  body: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.string,
    PropTypes.array,
  ]),
  footer: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  size: PropTypes.string,
  isBorder: PropTypes.bool,
  isCloseButton: PropTypes.bool,
  className: PropTypes.string,
  isCustomScroll: PropTypes.bool,
  closeTooltipPosition: PropTypes.bool,
};

export default React.memo(RSModal);
