import React from "react";
import {
  Search as SearchIcon,
  SearchDownArrow,
  SearchClose,
  genSearchThick,
  advSearch,
  GenAdvSearchFilter,
} from "../../../assets/genieIcons";
import { useFormContext } from "react-hook-form";
import { BootstrapDropdown } from "Components/RSBootstrapDropDown";
import { Row, Col } from "react-bootstrap";
import RSInput from "Components/FormFields/RSInput";
import RSKendoDropdown from "Components/FormFields/RSKendoDropdown";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { expandCollapse } from "./animation";
import {
  previousPromptsList,
  selectedChatMessagesAud1,
  selectedChatMessagesAud2,
  selectedChatMessagesAud3,
} from "../../constant";
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

function Search({ setActivesubmenu = () => {}, setGeniePages = () => {} }) {
  const { control, setValue, watch, getValues } = useFormContext();
  const [showFilter, setShowFilter] = React.useState(false);
  const [searchField, setSearchField] = React.useState("Title");
  const dispatch = useDispatch();

  const handleSelectedChat = (selectedValue) => {
    dispatch(
      updateSearch({
        showSearch: false,
      })
    );
    const selectedMessages =
      selectedValue === 1
        ? selectedChatMessagesAud1
        : selectedValue === 2
        ? selectedChatMessagesAud2
        : selectedChatMessagesAud3;

    dispatch(updatePromptGalleryFlag(false));
    setGeniePages((prev) => ({ ...prev, home: false }));
    dispatch(
      updateChat({
        messages: [],
        selectedChat: true,
        selectedMessages: selectedMessages,
        newChat: false,
        skipTypingEffect: true, // Set to true to disable typing effect
      })
    );
  };

  const fieldLabels = {
    title: "Title",
    module: "Module",
    space: "Space",
    createdBy: "Created by",
    createdOn: "Created on",
  };

  const filterFields = Object.keys(fieldLabels);
  const watchedValues = watch(filterFields);
  const activeFilters = filterFields
    .map((field) => ({
      key: field,
      label: fieldLabels[field],
      value: getValues(field),
    }))
    .filter((f) => f.value);

  const handleFilterToggle = () => setShowFilter((prev) => !prev);

  const handleClearField = (field) => {
    setValue(field, "");
    if (field === "title") setValue("searchPrompt", "");
  };

  const handleDropdownChange = (selected) => {
    setSearchField(selected);
    setValue("searchPrompt", "");
  };

  const searchInput = watch("searchPrompt");
  const titleInput = watch("title");

  return (
    <div className="genie__search-container">
      <div
        className={`genie__search ${
          showFilter || searchInput?.length > 0 ? "active-filter" : ""
        }`}
      >
        <BootstrapDropdown
          data={["Title", "Created by"]}
          flatIcon
          showUpdate={false}
          defaultItem={<img src={advSearch} className="genie__adv-search" />}
          className="no_caret"
          onSelect={handleDropdownChange}
        />

        <div className="genie__search-input-wrapper">
          {activeFilters.length > 0 ? (
            <div className="genie__search-filters mt5">
              {activeFilters.map(({ key, label, value }) => (
                <div key={key} className="genie__search-chip mr15">
                  <span>
                    {label}{" "}
                    <span className="chip-value">
                      {value}{" "}
                      <span
                        className="genie__search-chip-close"
                        onClick={() => handleClearField(key)}
                      >
                        <img src={SearchClose} />
                      </span>
                    </span>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <RSInput
              control={control}
              placeholder={`By ${searchField.toLowerCase()}..`}
              name="searchPrompt"
              className="genie__search-input"
              isGenie={true}
              isNewTheme={false}
            />
          )}
        </div>

        <div className={`genie__adv-filter-icon ${showFilter ? "active" : ""}`}>
          <img
            src={GenAdvSearchFilter}
            className="genie__filter mb2 cp"
            onClick={handleFilterToggle}
          />
        </div>

        <img src={genSearchThick} className="genie__search-icon cp" />
      </div>

      <AnimatePresence initial={false}>
        {showFilter && (
          <motion.div
            key="adv-filter"
            className={`genie__adv-filter-container ${
              activeFilters.length > 0 ? "active-search" : ""
            }`}
            variants={expandCollapse}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ transformOrigin: "top" }}
          >
            <Row>
              <Col>
                <div className="mb30">
                  <RSInput control={control} placeholder="Title" name="title" />
                </div>
              </Col>
              <Col>
                <div className="mb30">
                  <RSKendoDropdown
                    control={control}
                    label="Module"
                    name="module"
                    data={[
                      "Data augmentation",
                      "Segments",
                      "Communication",
                      "Content generation",
                      "Analytics",
                    ]}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="mb30">
                  <RSKendoDropdown
                    control={control}
                    label="Space"
                    name="space"
                    data={["space"]}
                  />
                </div>
              </Col>
              <Col>
                <div className="mb30">
                  <RSKendoDropdown
                    control={control}
                    label="Created by"
                    name="createdBy"
                    data={["Sophia"]}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <div className="">
                  <RSKendoDropdown
                    control={control}
                    label="Created on"
                    name="createdOn"
                    data={["Thu, 29 May, 2025 20:05"]}
                  />
                </div>
              </Col>
              <Col />
              <Col md={6}></Col>
            </Row>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {(activeFilters.length > 0 ||
          searchInput?.length > 0 ||
          titleInput?.length > 0) && (
          <motion.div
            key="search-result"
            className="genie__search-result"
            variants={expandCollapse}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {previousPromptsList[0] &&
              Object.keys(previousPromptsList[0]).map((timePeriod) => {
                const filteredItems = previousPromptsList[0][timePeriod].filter(
                  (item) => {
                    if (!searchInput && !titleInput) return true;
                    if (titleInput) {
                      return item.spaceidname
                        ?.toLowerCase()
                        .includes(titleInput.toLowerCase());
                    }
                    if (searchInput) {
                      const fieldToSearch =
                        searchField.toLowerCase() === "title"
                          ? "spaceidname"
                          : "createdBy";
                      return item[fieldToSearch]
                        ?.toLowerCase()
                        .includes(searchInput.toLowerCase());
                    }
                    return true;
                  }
                );
                return filteredItems.length > 0 ? (
                  <div key={timePeriod} className={`time-period-group`}>
                    <ul>
                      {filteredItems.map((item) => (
                        <li
                          key={`${timePeriod}-${item.spaceid}`}
                          className="time-period-item"
                          onClick={() => handleSelectedChat(item.id)}
                        >
                          <div>{item.spaceidname}</div>
                          <div className="font-xxs color-secondary-grey">
                            {timePeriod}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null;
              })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Search;
