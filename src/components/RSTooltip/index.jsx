import React from "react";
import Proptypes from "prop-types";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const RSPTooltip = ({
  position = "top",
  text = "",
  className = "",
  children,
  trigger = ["hover", "focus", "click"],
  innerContent = true,
  tooltipOverlayClass = "",
}) => {
  const ref = React.useRef();
  return (
    <OverlayTrigger
      trigger={trigger}
      placement={position}
      delay={{ show: 150, hide: 100 }}
      overlay={<Tooltip className={`${tooltipOverlayClass}`}> {text} </Tooltip>}
      container={innerContent ? ref : null}
      popperConfig={{
        modifiers: { preventOverflow: { boundariesElement: "viewport" } },
      }}
    >
      <div className={`rs-tooltip-wrapper ${className}`} ref={ref}>
        {children}
      </div>
    </OverlayTrigger>
  );
};


RSPTooltip.propTypes = {
  position: Proptypes.string,
  text: Proptypes.oneOfType([Proptypes.string, Proptypes.object]).isRequired,
  className: Proptypes.string,
  tooltipOverlayClass: Proptypes.string,
  innerContent: Proptypes.bool,
};

export default React.memo(RSPTooltip);
