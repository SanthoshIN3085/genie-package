import React, { useState, useEffect, useRef } from "react";
import * as genieIcons from "../../assets/genieIcons";
import { useDispatch, useSelector } from "react-redux";
import RSTooltip from "Components/RSTooltip";
import { BootstrapDropdown } from "Components/RSBootstrapDropDown";
import { useFormContext } from "react-hook-form";
import { useLocation } from "react-router";
import {
  selectedChatMessagesAnly1,
  selectedChatMessagesAnly2,
  selectedChatMessagesAnly3,
  selectedChatMessagesAud1,
  selectedChatMessagesAud2,
  selectedChatMessagesAud3,
  selectedChatMessagesCom1,
  selectedChatMessagesCom2,
  selectedChatMessagesCom3,
} from "../../constant/constant";
import PreviousPrompt from "./PreviousPrompt";
import {
  updateSelectedPrompt,
  updatePromptGalleryFlag,
  updateUI,
  updateChat,
  updateSpeech,
  updateSearch,
  updateSettings,
  resetGenie,
} from "Reducers/genie/reducer";
import { SIDE_NAV } from "../../constant/textConstants";

const Sidenav = ({ sideNavClick = () => {} }) => {
  const { ui } = useSelector((state) => state.genie);
  const {
    collapsed,
    isDarkMode,
    workingsExpanded,
    showPreviousPrompts,
    activeItem,
    spanText,
  } = ui;
  const dispatch = useDispatch();
  const location = useLocation();
  const { control, setValue, setFocus, getValues } = useFormContext();

  // Component state

  const [hoveredItem, setHoveredItem] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [activesubmenu, setActivesubmenu] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [spaceID, setSpaceID] = useState("");
  const [hideTooltip, setHideTooltip] = useState(false);
  const [navItemsCopy, setNavItemsCopy] = useState([]);

  // Extract path segments
  const pathSegments = location.pathname.split("/");
  const extractedValue = pathSegments?.[2];

  // Navigation data mapping
  const navTodayDataMap = {
    audience: {
      data1: SIDE_NAV.PREVIOUS_PROMPTS_DATA.TODAY.REPEAT_SNEAKER_BUYERS,
      data2: SIDE_NAV.PREVIOUS_PROMPTS_DATA.TODAY.INACTIVE_APPAREL_BUYERS,
      data3: SIDE_NAV.PREVIOUS_PROMPTS_DATA.TODAY.ACTIVEWEAR_COLLECTION_LAUNCH,
    },
    communication: {
      data1: "Re-engagement campaign for lapsed buyers",
      data2: "Flash Sale campaign for apparel",
      data3: "New product launch campaign for sneakers",
    },
    analytics: {
      data1: SIDE_NAV.PREVIOUS_PROMPTS_DATA.TODAY.REPEAT_SNEAKER_BUYERS,
      data2: SIDE_NAV.PREVIOUS_PROMPTS_DATA.TODAY.INACTIVE_APPAREL_BUYERS,
      data3: SIDE_NAV.PREVIOUS_PROMPTS_DATA.TODAY.ACTIVEWEAR_COLLECTION_LAUNCH,
    },
  };

  const navTodayData1 =
    navTodayDataMap[extractedValue]?.data1 || SIDE_NAV.PREVIOUS_PROMPTS_DATA.TODAY.REPEAT_SNEAKER_BUYERS;
  const navTodayData2 =
    navTodayDataMap[extractedValue]?.data2 ||
    "Re-engagement campaign for lapsed buyers";
  const navTodayData3 =
    navTodayDataMap[extractedValue]?.data3 || SIDE_NAV.PREVIOUS_PROMPTS_DATA.TODAY.ACTIVEWEAR_COLLECTION_LAUNCH;

  const chatMessagesMap = {
    audience: {
      data1: selectedChatMessagesAud1,
      data2: selectedChatMessagesAud2,
      data3: selectedChatMessagesAud3,
    },
    communication: {
      data1: selectedChatMessagesCom1,
      data2: selectedChatMessagesCom2,
      data3: selectedChatMessagesCom3,
    },
    analytics: {
      data1: selectedChatMessagesAud1,
      data2: selectedChatMessagesAud2,
      data3: selectedChatMessagesAud3,
    },
  };

  const selectedChatMessages1 =
    chatMessagesMap[extractedValue]?.data1 || selectedChatMessagesAud1;
  const selectedChatMessages2 =
    chatMessagesMap[extractedValue]?.data2 || selectedChatMessagesAud2;
  const selectedChatMessages3 =
    chatMessagesMap[extractedValue]?.data3 || selectedChatMessagesAud3;

  // Navigation items configuration
  const navItems = [
    {
      id: SIDE_NAV.NAV_IDS.PROMPT_GALLERY,
      name: SIDE_NAV.NAVIGATION_ITEMS.PROMPT_GALLERY,
      lightIcon: genieIcons?.geniePromptGallery,
      darkIcon: genieIcons?.geniePromptGalleryDark,
      activeIcon: genieIcons?.menuicongallerydarkselect,
    },
    {
      id: SIDE_NAV.NAV_IDS.PREVIOUS_PROMPTS,
      name: SIDE_NAV.NAVIGATION_ITEMS.PREVIOUS_PROMPTS,
      lightIcon: genieIcons?.menuIconChartHistory,
      darkIcon: genieIcons?.menuIconChartHistoryDark,
      activeIcon: genieIcons?.menuIconChartHistoryDarkSelect,
      menuUp: genieIcons?.menuIconUparrow,
      menuDown: genieIcons?.menuIconDownarrow,
      subMenu: [
        {
          Today: [
            { spaceidname: navTodayData1, spaceid: 1 },
            { spaceidname: navTodayData2, spaceid: 2 },
            { spaceidname: navTodayData3, spaceid: 3 },
          ],
          Yesterday: [
            { spaceidname: SIDE_NAV.PREVIOUS_PROMPTS_DATA.YESTERDAY.SEGMENT_CREATION, spaceid: 4 },
            {
              spaceidname: SIDE_NAV.PREVIOUS_PROMPTS_DATA.YESTERDAY.CUSTOMER_SEGMENT_GENERATION_VISIONPLUS,
              spaceid: 5,
            },
          ],
          "Last 7 Days": [
            { spaceidname: SIDE_NAV.PREVIOUS_PROMPTS_DATA.LAST_7_DAYS.CUSTOMER_SEGMENT_GENERATION, spaceid: 6 },
            { spaceidname: SIDE_NAV.PREVIOUS_PROMPTS_DATA.LAST_7_DAYS.SEGMENT_LIST_CREATION, spaceid: 7 },
          ],
          "Last Month": [
            {
              spaceidname: SIDE_NAV.PREVIOUS_PROMPTS_DATA.LAST_MONTH.CUSTOMER_SEGMENT_CREATION_SPECIFIC_CRITERIA,
              spaceid: 8,
            },
            { spaceidname: SIDE_NAV.PREVIOUS_PROMPTS_DATA.LAST_MONTH.CUSTOMER_SEGMENT_GENERATION_AGE, spaceid: 9 },
          ],
        },
      ],
    },
  ];

  const bottomNavItems = [
    {
      id: "token-usage",
      name: SIDE_NAV.NAVIGATION_ITEMS.TOKEN_USAGE,
      lightIcon: genieIcons?.genieTokenUsage,
      darkIcon: genieIcons?.genieTokenDark,
      activeIcon: genieIcons?.menuicontokendarkselect,
      // hasDropdown: true,
    },
    {
      id: SIDE_NAV.NAV_IDS.HELP,
      name: SIDE_NAV.NAVIGATION_ITEMS.HELP,
      lightIcon: genieIcons?.genieHelp,
      darkIcon: genieIcons?.genieHelpDark,
      activeIcon: genieIcons?.menuiconhelpdarkselect,
      // hasDropdown: true,
    },
    {
      id: SIDE_NAV.NAV_IDS.SETTINGS,
      name: SIDE_NAV.NAVIGATION_ITEMS.SETTINGS,
      lightIcon: genieIcons?.genieSettings,
      darkIcon: genieIcons?.genieSettingsDark,
      activeIcon: genieIcons?.menuiconsettingdarkselect,
    },
  ];

  const helpDropdownItems = [
    {
      label: SIDE_NAV.HELP_DROPDOWN.FAQ,
      icon: genieIcons?.FQA,
      action: SIDE_NAV.NAV_IDS.FAQ,
      hasExternalLink: true,
    },
    {
      label: SIDE_NAV.HELP_DROPDOWN.RELEASE_NOTES,
      icon: genieIcons?.releaseNote,
      action: "release-notes",
      hasExternalLink: true,
    },
    {
      label: SIDE_NAV.HELP_DROPDOWN.KEYBOARD_SHORTCUTS,
      icon: genieIcons?.keyboardShortcuts,
      action: "keyboard-shortcuts",
      hasExternalLink: true,
    },
  ];

  const submenuDropdown = [
    <>
      <img
        src={
          isDarkMode
            ? genieIcons?.menuIconRenameDark
            : genieIcons?.menuIconRename
        }
        className="mr10"
      />
      <span>{SIDE_NAV.SUBMENU_ACTIONS.RENAME}</span>
    </>,
    <>
      <img
        src={
          isDarkMode
            ? genieIcons?.menuIconDeleteDark
            : genieIcons?.menuIconDelete
        }
        className="mr10"
      />
      <span>{SIDE_NAV.SUBMENU_ACTIONS.DELETE}</span>
    </>,
    <>
      <img src={genieIcons?.genShare} className="mr10" />
      <span>{SIDE_NAV.SUBMENU_ACTIONS.SHARE}</span>
    </>,
  ];

  // Initialize navItemsCopy and expanded categories
  useEffect(() => {
    setNavItemsCopy(navItems);

    const previousPromptsItem = navItems.find(
      (item) => item.id === SIDE_NAV.NAV_IDS.PREVIOUS_PROMPTS
    );
    if (
      previousPromptsItem &&
      previousPromptsItem.subMenu &&
      previousPromptsItem.subMenu.length > 0
    ) {
      const firstSubMenuObj = previousPromptsItem.subMenu[0];
      if (firstSubMenuObj) {
        const firstCategoryKey = Object.keys(firstSubMenuObj)[0];
        if (firstCategoryKey) {
          setExpandedCategories((prev) => ({
            ...prev,
            [firstCategoryKey]: true,
          }));
        }
      }
    }
  }, [navTodayData1, navTodayData2, navTodayData3]);

  // Focus management for editing
  useEffect(() => {
    if (editing && spaceID) {
      setTimeout(() => {
        setFocus(`fieldName-${spaceID}`);
      }, 100);
    }
  }, [editing, spaceID, setFocus]);

  // Event handlers
  const handleToggleSidebar = () => {
    dispatch(
      updateUI({
        collapsed: !collapsed,
        showWorkings: false,
      })
    );
    setTimeout(() => {
      dispatch(
        updateUI({
          spanText: !spanText,
        })
      );
    }, 500);
  };

  const handleSelectedChat = (
    spaceidname,
    selectedValue,
    skipTypingEffect = false
  ) => {
    dispatch(
      updateUI({
        activeItem: SIDE_NAV.NAV_IDS.CHAT_BOX,
      })
    );
    setActivesubmenu(spaceidname);
    const selectedMessagesdata =
      selectedValue === 1
        ? selectedChatMessages1
        : selectedValue === 2
        ? selectedChatMessages2
        : selectedChatMessages3;
    dispatch(updatePromptGalleryFlag(false));
    dispatch(
      updateChat({
        messages: [],
        selectedChat: true,
        selectedMessages: selectedMessagesdata,
        newChat: false,
        skipTypingEffect: skipTypingEffect, // Add skipTypingEffect to Redux store
      })
    );
  };

  const handleDropdownSelect = (actionValue, spaceName, spaceid) => {
    const action = actionValue?.props?.children[2]?.props?.children;

    if (action === SIDE_NAV.SUBMENU_ACTIONS.RENAME) {
      setEditing(true);
      setEditValue(spaceName);
      setSpaceID(spaceid);
      setValue(`fieldName-${spaceid}`, spaceName);
    } else if (action === SIDE_NAV.SUBMENU_ACTIONS.DELETE) {
      setNavItemsCopy((prevNavItems) =>
        prevNavItems.map((item) => {
          if (item.id === SIDE_NAV.NAV_IDS.PREVIOUS_PROMPTS && item.subMenu) {
            return {
              ...item,
              subMenu: item.subMenu.map((subItem) => {
                return Object.keys(subItem).reduce((acc, key) => {
                  acc[key] = subItem[key].filter(
                    (entry) => entry.spaceid !== spaceid
                  );
                  return acc;
                }, {});
              }),
            };
          }
          return item;
        })
      );
    }
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleBlur = () => {
    setEditing(false);
    setEditValue("");
    const editedValue = getValues(`fieldName-${spaceID}`);

    setNavItemsCopy((prevNavItems) =>
      prevNavItems.map((item) => {
        if (item.id === SIDE_NAV.NAV_IDS.PREVIOUS_PROMPTS && item.subMenu) {
          return {
            ...item,
            subMenu: item.subMenu.map((subItem) => {
              return Object.keys(subItem).reduce((acc, key) => {
                acc[key] = subItem[key].map((entry) =>
                  entry.spaceid === spaceID
                    ? { ...entry, spaceidname: editedValue }
                    : entry
                );
                return acc;
              }, {});
            }),
          };
        }
        return item;
      })
    );
  };

  const handleHelpAction = (action) => {
    dispatch(
      updateSettings({
        helpTabs: true,
        activeSection: action,
      })
    );
  };

  const getItemIcon = (item, isActive, isHovered) => {
    if (isActive || isHovered) {
      return item.activeIcon;
    }
    return isDarkMode ? item.darkIcon : item.lightIcon;
  };

  const renderNavItem = (item, isActive, isHovered) => {
    const icon = getItemIcon(item, isActive, isHovered);

    return (
      <div className="genie__sidenav__item-content">
        <img
          src={icon}
          alt={`${item.name} Icon`}
          className={`genie__sidenav__item-icon ${collapsed ? "" : "mr7 ml3"}`}
        />
        {!collapsed && spanText && (
          <span
            className={`genie__sidenav__item-text ${
              isActive ? "genie__sidenav__item-text--active" : ""
            }`}
          >
            {item.name}
          </span>
        )}
      </div>
    );
  };

  const renderHelpDropdown = (item, isActive, isHovered) => {
    const dropdownData = helpDropdownItems.map((dropdownItem) => (
      <div className="genie__sidenav__dropdown-item" key={dropdownItem.action}>
        <div className="genie__sidenav__dropdown-content">
          <img
            src={dropdownItem.icon}
            className="genie__sidenav__dropdown-icon"
            alt=""
          />
          <span>{dropdownItem.label}</span>
        </div>
        {dropdownItem.hasExternalLink && (
          <img
            src={genieIcons?.ExternalLink}
            className="genie__sidenav__dropdown-external"
            alt=""
          />
        )}
      </div>
    ));

    return (
      <BootstrapDropdown
        data={dropdownData}
        flatIcon
        showUpdate={false}
        containerClass="genie__sidenav__dropdown"
        defaultItem={renderNavItem(item, isActive, isHovered)}
        className="genie__sidenav__dropdown-trigger"
        onSelect={(selectedItem) => {
          const action = helpDropdownItems.find(
            (item) => selectedItem.key === item.action
          )?.action;
          if (action) handleHelpAction(action);
        }}
      />
    );
  };

  return (
    <div
      className={`genie__sidenav ${
        collapsed ? "genie__sidenav--collapsed" : ""
      } `}
    >
      {/* Toggle div */}
      {!workingsExpanded && (
        <div
          className="genie__sidenav__toggle"
          onClick={handleToggleSidebar}
          aria-label={collapsed ? SIDE_NAV.TOOLTIPS.EXPAND_SIDEBAR : SIDE_NAV.TOOLTIPS.COLLAPSE_SIDEBAR}
        >
          <RSTooltip
            text={collapsed ? SIDE_NAV.TOOLTIPS.OPEN_SIDEBAR : SIDE_NAV.TOOLTIPS.CLOSE_SIDEBAR}
            position="top"
            innerContent={false}
            tooltipOverlayClass={"toolTipOverlayZindexCSS"}
          >
            <div className="genie__sidenav__toggle-icon">
              <img
                src={
                  isDarkMode
                    ? genieIcons?.menuArrowExpandDark
                    : genieIcons?.menuArrowExpand
                }
                alt={SIDE_NAV.ALT_TEXTS.TOGGLE}
                className={`genie__sidenav__arrow ${
                  collapsed ? "genie__sidenav__arrow--collapsed" : ""
                }`}
              />
            </div>
          </RSTooltip>
        </div>
      )}

      {/* New Prompt div */}
      <div
        className={`genie__sidenav__new-prompt ${
          activeItem === SIDE_NAV.NAV_IDS.NEW_PROMPT
            ? "genie__sidenav__new-prompt-btn--active"
            : ""
        }`}
      >
        {collapsed ? (
          <div
            className={`genie__sidenav__new-prompt-btn `}
            onClick={() => sideNavClick(SIDE_NAV.NAV_IDS.NEW_PROMPT)}
            onMouseEnter={() => setHoveredItem(SIDE_NAV.NAV_IDS.NEW_PROMPT)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <RSTooltip text={SIDE_NAV.NEW_PROMPT} position="top">
              <img
                src={
                  activeItem === SIDE_NAV.NAV_IDS.NEW_PROMPT || hoveredItem === SIDE_NAV.NAV_IDS.NEW_PROMPT
                    ? genieIcons?.menuiconnewchartdarkselect
                    : isDarkMode
                    ? genieIcons?.genieNewChartDark
                    : genieIcons?.genieNewPrompt
                }
                alt={SIDE_NAV.ALT_TEXTS.NEW_PROMPT}
                className="genie__sidenav__new-prompt-icon"
              />
            </RSTooltip>
          </div>
        ) : (
          <div
            className={`genie__sidenav__new-prompt-btn `}
            onClick={() => sideNavClick(SIDE_NAV.NAV_IDS.NEW_PROMPT)}
            onMouseEnter={() => setHoveredItem(SIDE_NAV.NAV_IDS.NEW_PROMPT)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <img
              src={
                activeItem === SIDE_NAV.NAV_IDS.NEW_PROMPT || hoveredItem === SIDE_NAV.NAV_IDS.NEW_PROMPT
                  ? genieIcons?.menuiconnewchartdarkselect
                  : isDarkMode
                  ? genieIcons?.genieNewChartDark
                  : genieIcons?.genieNewPrompt
              }
              alt={SIDE_NAV.ALT_TEXTS.NEW_PROMPT}
              className={`genie__sidenav__new-prompt-icon ${
                collapsed ? "" : "mr7 ml3"
              }`}
            />
            {spanText && (
              <span className="genie__sidenav__new-prompt-text">
                {SIDE_NAV.NEW_PROMPT}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="genie__sidenav__divider" />

      {/* Navigation Content */}
      <div className="genie__sidenav__content">
        {/* Top Navigation Items */}
        <nav className="genie__sidenav__nav">
          <ul className="genie__sidenav__list">
            {navItems.map((item) => {
              const isActive = activeItem === item.id;
              const isHovered = hoveredItem === item.id;

              return (
                <li
                  key={item.id}
                  className={`genie__sidenav__item ${
                    isActive ? "genie__sidenav__item-btn--active" : ""
                  }`}
                >
                  {collapsed ? (
                    <RSTooltip text={item.name} position="top">
                      <div
                        className={`genie__sidenav__item-btn`}
                        onClick={() => sideNavClick(item.id)}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        {renderNavItem(item, isActive, isHovered)}
                      </div>
                    </RSTooltip>
                  ) : (
                    <div
                      className={`genie__sidenav__item-btn`}
                      onClick={() => sideNavClick(item.id)}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {renderNavItem(item, isActive, isHovered)}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Navigation Items */}
        <nav className="genie__sidenav__bottom-nav">
          <ul className="genie__sidenav__list">
            {bottomNavItems.map((item) => {
              const isActive = activeItem === item.id;
              const isHovered = hoveredItem === item.id;

              return (
                <React.Fragment key={item.id}>
                  <li
                    className={`genie__sidenav__item ${
                      isActive ? "genie__sidenav__item-btn--active" : ""
                    }`}
                  >
                    {collapsed ? (
                      <RSTooltip text={item.name} position="top">
                        <div
                          className={`genie__sidenav__item-btn `}
                          onMouseEnter={() => setHoveredItem(item.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          {item.hasDropdown ? (
                            renderHelpDropdown(item, isActive, isHovered)
                          ) : (
                            <div
                              onClick={() => sideNavClick(item.id)}
                              className="genie__sidenav__item-btn-inner"
                            >
                              {renderNavItem(item, isActive, isHovered)}
                            </div>
                          )}
                        </div>
                      </RSTooltip>
                    ) : (
                      <div
                        className={`genie__sidenav__item-btn `}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        {item.hasDropdown ? (
                          renderHelpDropdown(item, isActive, isHovered)
                        ) : (
                          <div
                            onClick={() => sideNavClick(item.id)}
                            className="genie__sidenav__item-btn-inner"
                          >
                            {renderNavItem(item, isActive, isHovered)}
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                  {item.id === "token-usage" ? (
                    <>
                      {collapsed ? (
                        <div className="genie__sidenav__progress-bar">
                          <div className="genie__sidenav__progress-fill"></div>
                        </div>
                      ) : spanText ? (
                        <div className="token-usage">
                          <div className="token-usage-value">
                            {SIDE_NAV.TOKEN_USAGE_DISPLAY.CURRENT_USAGE}
                          </div>
                          <div className="token-usage-limit">
                            {SIDE_NAV.TOKEN_USAGE_DISPLAY.LIMIT_MESSAGE}
                          </div>
                          <div>
                            <div className="genie__sidenav__progress-bar">
                              <div className="genie__sidenav__progress-fill"></div>
                            </div>
                          </div>
                          <div className="token-usage-btn-holder">
                            <div className="token-usage-btn token-usage-btn-view">
                              {SIDE_NAV.TOKEN_USAGE_DISPLAY.VIEW_BUTTON}
                            </div>
                            <div className="token-usage-btn token-usage-btn-upgrade">
                              {SIDE_NAV.TOKEN_USAGE_DISPLAY.UPGRADE_BUTTON}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </React.Fragment>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Previous Prompt Modal */}
      <PreviousPrompt
        show={showPreviousPrompts}
        handleClose={() =>
          dispatch(
            updateUI({
              showPreviousPrompts: false,
            })
          )
        }
        navItemsCopy={navItemsCopy}
        expandedCategories={expandedCategories}
        setExpandedCategories={setExpandedCategories}
        handleSelectedChat={handleSelectedChat}
        activesubmenu={activesubmenu}
        editing={editing}
        handleEditChange={handleEditChange}
        handleBlur={handleBlur}
        control={control}
        hideTooltip={hideTooltip}
        submenuDropdown={submenuDropdown}
        handleDropdownSelect={handleDropdownSelect}
        skipTypingEffect={true} // Enable skip typing effect for previous prompts - messages will appear instantly without typing animation
      />
    </div>
  );
};

export default Sidenav;
