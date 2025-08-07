import React from "react";

const GenButton = ({ className = "", children, ...props }) => {
  return (
    <button {...props} className={`gen-button ${className}`}>
      {children}
    </button>
  );
};

export default React.memo(GenButton);
