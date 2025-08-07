import React from "react";
import PropTypes from "prop-types";
import GenButton from "../GenButton";

const GenTertiaryButton = ({
  bgc,
  className = "",
  paddingright,
  color,
  children,
  type = "button",
  ...props
}) => {
  return (
    <GenButton
      className={`${className} gen-button-tertiary`}
      style={{
        backgroundColor: bgc,
        paddingRight: paddingright,
        color: color,
      }}
      type={type}
      {...props}
    >
      {children}
    </GenButton>
  );
};



GenTertiaryButton.propTypes = {
  bgc: PropTypes.string,
  paddingright: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.oneOf(["submit", "button", "reset"]),
};

export default React.memo(GenTertiaryButton);
