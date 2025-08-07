import React, { useEffect, useState, useRef } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import Proptypes from "prop-types";

export const BootstrapDropdown = ({
  data = [],
  onSelect = () => {},
  defaultItem = "",
  className = "",
  fontSize = "",
  fieldKey,
  alignRight,
  disbleItems = [],
  errorMessage,
  showUpdate = true,
  flatIcon = false,
  containerClass = "",
  isObject,
  iconFlag = false,
  ...props
}) => {
  const [title, setTitle] = useState(defaultItem);
  const [arrowPosition, setArrowPosition] = useState({ right: "13px", left: "auto" });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setTitle(defaultItem);
  }, [defaultItem, disbleItems]);

  const updateArrowPosition = () => {
    if (isOpen) {
      const dropdownMenu = dropdownRef.current?.querySelector('.dropdown-menu');
      if (dropdownMenu) {
        const rect = dropdownMenu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        // Check if dropdown menu is near the right edge
        if (rect.right > viewportWidth - 20) {
          // Dropdown is near right edge, position arrow on the left
          setArrowPosition({ right: "auto", left: "13px" });
        } else {
          // Default position on the right
          setArrowPosition({ right: "13px", left: "auto" });
        }
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('resize', updateArrowPosition);
      return () => window.removeEventListener('resize', updateArrowPosition);
    }
  }, [isOpen]);

  const handleDropdownToggle = (open) => {
    setIsOpen(open);
    if (open) {
      // Use setTimeout to ensure the dropdown menu is rendered
      setTimeout(updateArrowPosition, 0);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`rs-bootstrap-dropdown ${
        flatIcon ? "rs-bootstrap-dropdown-with-icon" : ""
      } ${containerClass}`}
      style={{
        "--arrow-right": arrowPosition.right,
        "--arrow-left": arrowPosition.left
      }}
    >
      {errorMessage && <div className="validation-message">{errorMessage}</div>}
      <DropdownButton
        align={`${alignRight ? "end" : "start"}`}
        varient=""
        className={`rs-dropdown ${className} ${fontSize}`}
        title={title}
        onToggle={handleDropdownToggle}
      >
        <div className="css-scrollbar custome-dropdown-scroll">
          {data.map((item, index) => {
            return (
              <div
                key={index}
                className={`${disbleItems.includes(item) ? "click-off" : ""}`}
              >
                {isObject ? (
                  <Dropdown.Item
                    // className={`${iconFlag && index === 0 && 'active'}`}
                    key={index}
                    onClick={() => {
                      if (showUpdate) {
                        setTitle(item[fieldKey]);
                      }
                      onSelect(item, index);
                    }}
                    disabled={item?.disabled ? item.disabled : false}
                    className={item?.disabled ? `click-off` : ""}
                  >
                    {item[fieldKey]}
                  </Dropdown.Item>
                ) : (
                  <Dropdown.Item
                    key={index}
                    onClick={() => {
                      if (showUpdate) {
                        setTitle(item);
                      }
                      onSelect(item, index);
                    }}
                  >
                    {item}
                  </Dropdown.Item>
                )}
              </div>
            );
          })}
        </div>
      </DropdownButton>
    </div>
  );
};



BootstrapDropdown.propTypes = {
  data: Proptypes.array.isRequired,
  onSelect: Proptypes.func,
  defaultItem: Proptypes.oneOfType([Proptypes.string, Proptypes.object]),
  className: Proptypes.string,
  fontSize: Proptypes.string,
  fieldKey: Proptypes.string,
  alignRight: Proptypes.bool,
  disbleItems: Proptypes.array,
  errorMessage: Proptypes.string,
  flatIcon: Proptypes.bool,
  iconFlag: Proptypes.bool,
  containerClass: Proptypes.string,
};
