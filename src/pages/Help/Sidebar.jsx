import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSettings } from "Reducers/genie/reducer";
import PropTypes from "prop-types";
import * as genieIcons from "../../assets/genieIcons";

function Sidebar({ handleSideNavClick = () => {} }) {
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.genie);
  const { activeSectionSettings, helpTabs } = settings;
  const [expandedMenus, setExpandedMenus] = useState({
    tokens:
      activeSectionSettings === "dashboard" ||
      activeSectionSettings === "token_management" ||
      activeSectionSettings === "alerts" ||
      activeSectionSettings === "audit_log",
  });

  useEffect(() => {
    setExpandedMenus((prev) => ({
      ...prev,
      tokens:
        activeSectionSettings === "dashboard" ||
        activeSectionSettings === "token_management" ||
        activeSectionSettings === "alerts" ||
        activeSectionSettings === "audit_log",
    }));
  }, [activeSectionSettings]);

  const navItemsSettings = [
    { id: "home", label: "Home", section: "home" },
    { id: "notification", label: "Notification", section: "notification" },
    { id: "billing", label: "Billing", section: "billing" },
    {
      id: "tokens",
      label: "Tokens",
      children: [
        { id: "dashboard", label: "Dashboard", section: "dashboard" },
        {
          id: "token_management",
          label: "Tokens & Ledger",
          section: "token_management",
        },
        { id: "alerts", label: "Alerts", section: "alerts" },
        { id: "audit_log", label: "Audit Logs", section: "audit_log" },
      ],
    },
  ];
  const navItemsHelp = [
    { id: "home", label: "Home", section: "home" },
    { id: "faq", label: "FAQ", section: "faq" },
    { id: "release-notes", label: "Release notes", section: "release-notes" },
    {
      id: "keyboard-shortcuts",
      label: "Keyboard shortcuts",
      section: "keyboard-shortcuts",
    },
  ];

  const navItems = helpTabs ? navItemsHelp : navItemsSettings;
  const currentTab = helpTabs ? "helpTabs" : "settingsTab";

  const handleItemClick = (item) => {
    if (item.children) {
      setExpandedMenus((prev) => ({
        ...prev,
        [item.id]: !prev[item.id],
      }));
      return;
    }

    if (item.section === "home") {
      handleSideNavClick("newprompt");
      return;
    }

    dispatch(
      updateSettings({
        currentTab: true,
        activeSectionSettings: item.section,
      })
    );
  };

  const isActive = (section) => activeSectionSettings === section;

  return (
    <div className="genie__sidenav">
      <div className="genie__sidenav__content">
        <ul className="genie__sidenav__list">
          {navItems.map((item) => (
            <React.Fragment key={item.id}>
              {item.children ? (
                <>
                  <li
                    className={`genie__sidenav__item ${
                      isActive(item.section)
                        ? "genie__sidenav__item-btn--active"
                        : ""
                    } ${item.section === "notification" ? "click-off" : ""} `}
                    onClick={() => handleItemClick(item)}
                  >
                    <span>{item.label}</span>
                    <img
                      src={
                        expandedMenus[item.id]
                          ? genieIcons?.menuIconUparrow
                          : genieIcons?.menuIconDownarrow
                      }
                    />
                  </li>
                  {expandedMenus[item.id] && (
                    <ul className="genie__sidenav__sublist">
                      {item.children.map((child) => (
                        <li
                          key={child.id}
                          className={`genie__sidenav__item ${
                            isActive(child.section)
                              ? "genie__sidenav__item-btn--active"
                              : ""
                          }`}
                          onClick={() => handleItemClick(child)}
                        >
                          <span>{child.label}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <li
                  className={`genie__sidenav__item ${
                    isActive(item.section)
                      ? "genie__sidenav__item-btn--active"
                      : ""
                  } ${item.section === "notification" ? "click-off" : ""}`}
                  onClick={() => handleItemClick(item)}
                >
                  <span>{item.label}</span>
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  handleNewChat: PropTypes.func,
  handleSideNavClick: PropTypes.func,
};

export default Sidebar;
