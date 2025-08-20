import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUI } from "Reducers/genie/reducer";
import * as genieIcons from "../../assets/genieIcons";

const FloatingGenie = () => {
  const dispatch = useDispatch();
  const { ui } = useSelector((state) => state.genie);
  const { showHome, howerStarIcon } = ui;

  const handleFloatingGenieClick = () => {
    dispatch(
      updateUI({
        showHome: true,
        showAlert: true,
      })
    );
  };

  const handleMouseEnter = () => {
    dispatch(
      updateUI({
        howerStarIcon: true,
      })
    );
  };

  const handleMouseLeave = () => {
    dispatch(
      updateUI({
        howerStarIcon: false,
      })
    );
  };

  // Only show FloatingGenie when home is not visible
  if (showHome) {
    return null;
  }

  return (
    <div
      className="floating-logo"
      onClick={handleFloatingGenieClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="floating-logo__inner">
        <img
          src={
            howerStarIcon
              ? genieIcons?.genielogowhite
              : genieIcons?.genieLogoWhiteWithoutStar
          }
          alt="Genie Logo"
          className="floating-logo__image"
        />
        <img
          src={genieIcons?.genieTextWhite}
          alt="Genie Text"
          className="floating-logo__text"
        />
      </div>
    </div>
  );
};

export default FloatingGenie;
