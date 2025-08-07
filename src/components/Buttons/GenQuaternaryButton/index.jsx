import React from "react";
import PropTypes from "prop-types";
import GenButton from "../GenButton";

const GenQuaternaryButton = ({
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
      className={`${className} gen-button-quaternary`}
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



GenQuaternaryButton.propTypes = {
  bgc: PropTypes.string,
  paddingright: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.oneOf(["submit", "button", "reset"]),
};

export default React.memo(GenQuaternaryButton);
