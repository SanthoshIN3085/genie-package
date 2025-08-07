import React from "react";
import { GenPrimaryButton, GenSecondaryButton } from "Components/Buttons";
import PropTypes from "prop-types";
import * as constant from "./constant";
import { Container } from "react-bootstrap";

const RSAlert = ({
  show,
  header,
  body,
  footer,
  primaryButtonText = "OK",
  secondaryButtonText,
  handleClose = () => {},
  handleConfirm,
  containerClass = "py30",
  contentClass = "",
}) => {
  const [showModal, setShowModal] = React.useState(false);
  const getRandomColor =
    constant.bgColors[Math.floor(Math.random() * constant.bgColors?.length)];

  React.useEffect(() => {
    setShowModal(show);
  }, [show]);

  return (
    <React.Fragment>
      {showModal && (
        <div className="rs-overlay-modal">
          <div className="rs-overlay-bg"></div>
          <div className={`rs-overlay-content ${contentClass}`}>
            <Container className={`${containerClass}`}>
              {header && <h2>{header}</h2>}
              {body && body}
              {footer && (
                <div className="buttons-holder">
                  {secondaryButtonText && (
                    <GenSecondaryButton
                      onClick={() => handleClose()}
                      className="white"
                    >
                      {secondaryButtonText}
                    </GenSecondaryButton>
                  )}
                  {primaryButtonText && (
                    <GenPrimaryButton onClick={() => handleConfirm()}>
                      {primaryButtonText}
                    </GenPrimaryButton>
                  )}
                </div>
              )}
            </Container>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};



RSAlert.propTypes = {
  handleClose: PropTypes.func,
  handleConfirm: PropTypes.func,
  secondaryButtonText: PropTypes.string,
  primaryButtonText: PropTypes.string,
};

export default RSAlert;
