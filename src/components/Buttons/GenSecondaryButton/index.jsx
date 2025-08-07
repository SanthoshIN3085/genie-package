import React from "react";
import PropTypes from "prop-types";
import GenButton from "../GenButton";

const GenSecondaryButton = ({
  bgc,
  className = "",
  color,
  paddingright,
  type = "button",
  ...props
}) => {
  return (
    <GenButton
      {...props}
      className={` ${className} gen-button-link`}
      style={{
        backgroundColor: bgc,
        paddingRight: paddingright,
        color: color,
      }}
      type={type}
    >
      {props.children}
    </GenButton>
  );
};



GenSecondaryButton.propTypes = {
  className: PropTypes.string,
  bgc: PropTypes.string,
  paddingright: PropTypes.string,
  color: PropTypes.string,
  type: PropTypes.oneOf(["submit", "button", "reset"]),
};

export default React.memo(GenSecondaryButton);
