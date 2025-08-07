import React, { useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import * as genieIcons from "../../assets/genieIcons";
import { useFormContext } from "react-hook-form";
import { BootstrapDropdown } from "Components/RSBootstrapDropDown";
import { truncateTitle } from "../../utils/index";
import RSTooltip from "Components/RSTooltip";
import { motion, AnimatePresence } from "framer-motion";
import { TOGGLE_ANIMATION, LIST_ANIMATION, SLIDE_ANIMATION } from "./constants";
import { useDispatch, useSelector } from "react-redux";
import { PREVIOUS_PROMPT } from "../../constant/textConstants";

// Month names array
const monthNames = PREVIOUS_PROMPT.MONTHS;

// Dynamic Categories Generator - Fixed version
const generateDynamicCategories = () => {
  const today = new Date();
  const currentMonth = today.getMonth(); // 0-11

  const categories = {
    TODAY: PREVIOUS_PROMPT.CATEGORIES.TODAY,
    YESTERDAY: PREVIOUS_PROMPT.CATEGORIES.YESTERDAY,
    LAST_WEEK: PREVIOUS_PROMPT.CATEGORIES.LAST_WEEK,
    TWO_WEEKS_AGO: PREVIOUS_PROMPT.CATEGORIES.TWO_WEEKS_AGO,
    THREE_WEEKS_AGO: PREVIOUS_PROMPT.CATEGORIES.THREE_WEEKS_AGO,
    LAST_MONTH: PREVIOUS_PROMPT.CATEGORIES.LAST_MONTH,
  };

  // Add months from current month going backwards to January only
  for (let i = currentMonth; i >= 0; i--) {
    const monthKey = monthNames[i].toUpperCase().replace(/\s+/g, "_");
    categories[monthKey] = monthNames[i];
  }

  return categories;
};

// Get dynamic categories
const CATEGORIES = generateDynamicCategories();

// Helper function to get ordered categories based on current date - Fixed version
const getOrderedCategories = () => {
  const today = new Date();
  const currentMonth = today.getMonth(); // 0-11

  const baseCategories = [
    PREVIOUS_PROMPT.CATEGORIES.TODAY,
    PREVIOUS_PROMPT.CATEGORIES.YESTERDAY,
    PREVIOUS_PROMPT.CATEGORIES.LAST_WEEK,
    PREVIOUS_PROMPT.CATEGORIES.TWO_WEEKS_AGO,
    PREVIOUS_PROMPT.CATEGORIES.THREE_WEEKS_AGO,
    PREVIOUS_PROMPT.CATEGORIES.LAST_MONTH,
  ];

  // Add months from current month going backwards to January only
  const monthCategories = [];
  for (let i = currentMonth; i >= 0; i--) {
    monthCategories.push(monthNames[i]);
  }

  return [...baseCategories, ...monthCategories];
};

// Utility Functions
const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const formatDate = (date) => {
  const days = PREVIOUS_PROMPT.DAYS;
  const months = PREVIOUS_PROMPT.SHORT_MONTHS;

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${dayName}, ${day} ${month}, ${year} ${hours}:${minutes}`;
};

const getDateForCategory = (category) => {
  const today = new Date();
  const getRandomTime = (date) => {
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    return date;
  };

  // Handle basic time categories
  switch (category) {
    case PREVIOUS_PROMPT.CATEGORIES.TODAY:
      return formatDate(getRandomTime(new Date()));

    case PREVIOUS_PROMPT.CATEGORIES.YESTERDAY:
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return formatDate(getRandomTime(yesterday));

    case PREVIOUS_PROMPT.CATEGORIES.LAST_WEEK: {
      const d = new Date();
      d.setDate(d.getDate() - (7 + Math.floor(Math.random() * 7)));
      return formatDate(getRandomTime(d));
    }

    case PREVIOUS_PROMPT.CATEGORIES.TWO_WEEKS_AGO: {
      const d = new Date();
      d.setDate(d.getDate() - (14 + Math.floor(Math.random() * 7)));
      return formatDate(getRandomTime(d));
    }

    case PREVIOUS_PROMPT.CATEGORIES.THREE_WEEKS_AGO: {
      const d = new Date();
      d.setDate(d.getDate() - (21 + Math.floor(Math.random() * 7)));
      return formatDate(getRandomTime(d));
    }

    case PREVIOUS_PROMPT.CATEGORIES.LAST_MONTH: {
      const d = new Date();
      d.setMonth(d.getMonth() - 1);
      d.setDate(Math.floor(Math.random() * 28) + 1);
      return formatDate(getRandomTime(d));
    }

    default: {
      // Handle month categories dynamically
      const monthIndex = monthNames.findIndex(
        (month) => month.toLowerCase() === category.toLowerCase()
      );
      if (monthIndex !== -1) {
        const monthDate = new Date(
          today.getFullYear(),
          monthIndex,
          Math.floor(Math.random() * 28) + 1
        );
        // If the month hasn't occurred yet this year, use last year
        if (monthIndex >= today.getMonth()) {
          monthDate.setFullYear(today.getFullYear() - 1);
        }
        return formatDate(getRandomTime(monthDate));
      }

      return formatDate(getRandomTime(new Date()));
    }
  }
};

// Sub-Components
const CategoryHeader = React.memo(({ category, isExpanded = false, onToggle }) => (
  <div className="previous-prompts__category-header" onClick={onToggle}>
    <div className="previous-prompts__category-title">{category}</div>
    <motion.div
      className="previous-prompts__category-toggle"
      variants={TOGGLE_ANIMATION}
      initial="initial"
      animate={isExpanded ? "animate" : "initial"}
    >
      <img
        src={genieIcons.menuIconDownArrowselect}
        alt={PREVIOUS_PROMPT.ALT_TEXTS.EXPAND}
        className="previous-prompts__toggle-icon"
      />
    </motion.div>
  </div>
));

const PromptItem = React.memo(
  ({
    entry,
    isActive,
    onSelect,
    onClose,
    isDarkMode,
    submenuDropdown,
    onDropdownSelect,
    category,
    searchText,
    isScroll,
    skipTypingEffect = false,
  }) => {
    const highlightText = (text) => {
      if (!searchText) return text;
      const parts = text.split(new RegExp(`(${searchText})`, "gi"));
      return parts.map((part, i) =>
        part.toLowerCase() === searchText.toLowerCase() ? (
          <span key={i} className="previous-prompts__highlight">
            {part}
          </span>
        ) : (
          part
        )
      );
    };

    return (
      <li
        className={`previous-prompts__item ${
          isActive ? "previous-prompts__item--active" : ""
        }`}
      >
        {!isScroll ? (
          <RSTooltip
            text={
              <>
                <ul className="rs-tooltip-text-multi">
                  <li>
                    <span>{getDateForCategory(category)}</span>
                  </li>
                  <li>{entry.spaceidname}</li>
                </ul>
              </>
            }
            tooltipOverlayClass={"toolTipOverlayZindexCSS"}
            innerContent={false}
            className="pb4"
          >
            <span
              className="previous-prompts__item-text"
              onClick={() => {
                onSelect(entry.spaceidname, entry.spaceid, skipTypingEffect);
                onClose();
              }}
            >
              {highlightText(truncateTitle(entry.spaceidname, 25))}
            </span>
          </RSTooltip>
        ) : (
          <div className="pb4">
            <span
              className="previous-prompts__item-text"
              onClick={() => {
                onSelect(entry.spaceidname, entry.spaceid, skipTypingEffect);
                onClose();
              }}
            >
              {highlightText(truncateTitle(entry.spaceidname, 25))}
            </span>
          </div>
        )}
        <span className={`previous-prompts__dropdown`}>
          <BootstrapDropdown
            data={submenuDropdown}
            flatIcon={false}
            showUpdate={false}
            containerClass="previous-prompts__dropdown-menu"
            defaultItem={<img src={genieIcons?.dropdownMenu} alt="Menu" />}
            className="previous-prompts__dropdown-button no_caret"
            onSelect={(action) =>
              onDropdownSelect(action, entry.spaceidname, entry.spaceid)
            }
          />
        </span>
      </li>
    );
  }
);

// Main Component
const PreviousPrompt = ({
  show,
  handleClose,
  navItemsCopy,
  expandedCategories,
  setExpandedCategories,
  handleSelectedChat,
  activesubmenu,
  editing,
  handleEditChange,
  handleBlur,
  control,
  hideTooltip,
  submenuDropdown,
  handleDropdownSelect,
  skipTypingEffect = false, // When true, selected chat messages will be displayed without typing effect
}) => {
  const { ui } = useSelector((state) => state.genie);
  const { isDarkMode } = ui;
  const [editValue, setEditValue] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isScroll, setIsScroll] = useState(false);
  const handleScroll = () => {
    setIsScroll(true);
    setTimeout(() => {
      setIsScroll(false);
    }, 200);
  };
  const handleCloseWithAnimation = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleClose();
    }, 300);
  };

  // Fixed filteredCategories logic - Always show all categories
  const filteredCategories = useMemo(() => {
    const previousPromptsItem = navItemsCopy.find(
      (item) => item.id === "previousprompts"
    );
    const allData = previousPromptsItem?.subMenu?.[0] || {};

    const orderedCategories = getOrderedCategories();

    // Get today's data as fallback
    const todayData =
      allData["Today"] ||
      allData["TODAY"] ||
      allData["today"] ||
      allData[Object.keys(allData)[0]] || // First available data
      [];

    return orderedCategories.reduce((acc, category) => {
      // Try different possible key formats for the category
      let entries =
        allData[category] ||
        allData[category.toUpperCase()] ||
        allData[category.toLowerCase()] ||
        allData[category.replace(/\s+/g, "_")] ||
        allData[category.replace(/\s+/g, "_").toUpperCase()] ||
        allData[category.replace(/\s+/g, "").toLowerCase()] ||
        [];

      // If no data for this category, use today's data as fallback
      if (entries.length === 0) {
        entries = todayData;
      }

      // Always include the category, even if empty
      if (searchText) {
        const filteredEntries = entries.filter(
          (entry) =>
            entry.spaceidname &&
            entry.spaceidname.toLowerCase().includes(searchText.toLowerCase())
        );
        // Only add category if it has matching entries when searching
        if (filteredEntries.length > 0) {
          acc[category] = filteredEntries;
        }
      } else {
        // Always add category when not searching
        acc[category] = entries;
      }

      return acc;
    }, {});
  }, [navItemsCopy, searchText]);

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchText(searchValue);

    if (searchValue) {
      // Expand categories that have matching items
      const newExpandedCategories = { ...expandedCategories };
      Object.entries(filteredCategories).forEach(([category, entries]) => {
        const hasMatch = entries.some(
          (entry) =>
            entry.spaceidname &&
            entry.spaceidname.toLowerCase().includes(searchValue.toLowerCase())
        );
        if (hasMatch) {
          newExpandedCategories[category] = true;
        }
      });
      setExpandedCategories(newExpandedCategories);
    } else {
      // When search is cleared, collapse all except first category
      const categories = Object.keys(filteredCategories);
      const newExpandedCategories = {};
      categories.forEach((category, index) => {
        newExpandedCategories[category] = index === 0; // Only first category is expanded
      });
      setExpandedCategories(newExpandedCategories);
    }
  };

  const handleCategoryToggle = useCallback(
    (category) => {
      setExpandedCategories((prev) => ({
        ...prev,
        [category]: !prev[category],
      }));
    },
    [setExpandedCategories]
  );

  const handleEditChangeWrapper = useCallback(
    (e) => {
      setEditValue(e.target.value);
      handleEditChange(e);
    },
    [handleEditChange]
  );

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`previous-prompts`}
          variants={SLIDE_ANIMATION}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="previous-prompts__header">
            <motion.div
              className="previous-prompts__close"
              onClick={handleCloseWithAnimation}
            >
              <RSTooltip text={"Close"}>
                <img
                  src={genieIcons?.closeSmall}
                  alt="Close"
                  className="previous-prompts__close-icon"
                />
              </RSTooltip>
            </motion.div>
          </div>
          <div>
            <h4 className="previous-prompts__title">Previous Prompts</h4>
          </div>

          <div className="previous-prompts__search-container">
            <input
              type="text"
              placeholder="Search prompts.."
              value={searchText}
              onChange={handleSearch}
              className="previous-prompts__item-text"
            />
            <img src={genieIcons?.Search} />
          </div>
          <div
            className="previous-prompts__content"
            onScroll={() => handleScroll()}
          >
            {Object.entries(filteredCategories).map(([category, entries]) => (
              <div
                key={category}
                className="previous-prompts__category"
                data-category={category}
              >
                <CategoryHeader
                  category={category}
                  isExpanded={expandedCategories[category]}
                  onToggle={() => handleCategoryToggle(category)}
                />
                {expandedCategories[category] && (
                  <ul className="previous-prompts__list">
                    <AnimatePresence>
                      <motion.div
                        variants={LIST_ANIMATION}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="mt10"
                      >
                        {entries && entries.length > 0 ? (
                          entries.map((entry, index) => (
                            <PromptItem
                              key={`${entry.spaceid}-${category}-${index}`}
                              entry={entry}
                              isActive={activesubmenu === entry.spaceidname}
                              editValue={editValue}
                              onEditChange={handleEditChangeWrapper}
                              onBlur={handleBlur}
                              onSelect={handleSelectedChat}
                              onClose={handleClose}
                              isDarkMode={isDarkMode}
                              control={control}
                              submenuDropdown={submenuDropdown}
                              onDropdownSelect={handleDropdownSelect}
                              category={category}
                              searchText={searchText}
                              isScroll={isScroll}
                              skipTypingEffect={skipTypingEffect}
                            />
                          ))
                        ) : (
                          <li className="previous-prompts__item previous-prompts__item--empty">
                            <span className="previous-prompts__item-text">
                              No prompts for {category}
                            </span>
                          </li>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </ul>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// PropTypes
PreviousPrompt.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  navItemsCopy: PropTypes.array.isRequired,
  expandedCategories: PropTypes.object.isRequired,
  setExpandedCategories: PropTypes.func.isRequired,
  handleSelectedChat: PropTypes.func.isRequired,
  activesubmenu: PropTypes.string,
  editing: PropTypes.bool.isRequired,
  handleEditChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  hideTooltip: PropTypes.bool.isRequired,
  submenuDropdown: PropTypes.array.isRequired,
  handleDropdownSelect: PropTypes.func.isRequired,
  skipTypingEffect: PropTypes.bool,
};

CategoryHeader.propTypes = {
  category: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
};

PromptItem.propTypes = {
  entry: PropTypes.shape({
    spaceid: PropTypes.number.isRequired,
    spaceidname: PropTypes.string.isRequired,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  isScroll: PropTypes.bool,
  submenuDropdown: PropTypes.array.isRequired,
  onDropdownSelect: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  searchText: PropTypes.string,
  skipTypingEffect: PropTypes.bool,
};

export default PreviousPrompt;
