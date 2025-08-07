import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as genieIcons from "../../../assets/genieIcons";
import { FAQs } from "../constant";
import GeniePromptBox from "../../../components/GeniePromptBox/GeniePromptBox";
import { HELP } from "../../../constant/textConstants";

const FAQ = ({}) => {
  const [openItems, setOpenItems] = useState(new Set());
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (FAQs.length > 0) {
      setOpenItems(new Set([0]));
    }
  }, []);

  useEffect(() => {
    if (searchQuery && searchQuery !== lastSearchQuery) {
      // Auto-expand items that match the search query
      const matchingIndexes = FAQs.reduce((indexes, item, index) => {
        if (
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.details.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          indexes.add(index);
        }
        return indexes;
      }, new Set());

      setOpenItems(matchingIndexes);
      setLastSearchQuery(searchQuery);
    }
  }, [searchQuery]);

  const toggleItem = (index) => {
    const newOpenItems = new Set();
    if (!openItems.has(index)) {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const highlightText = (text) => {
    if (!searchQuery || typeof text !== "string") return text;

    const escapedSearchQuery = searchQuery.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const regex = new RegExp(`(${escapedSearchQuery})`, "gi");
    const parts = text.split(regex);

    return parts
      .map((part) =>
        part.toLowerCase() === searchQuery.toLowerCase()
          ? `<span class="Genie__help__faq-item-highlight">${part}</span>`
          : part
      )
      .join("");
  };

  const filteredData = FAQs.filter(
    (item) =>
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="Genie__help__faq">
      <div>
        <div className="Genie__help__faq-title">{HELP.FAQ.TITLE}</div>
        <div className="Genie__help__faq-subtitle">{HELP.FAQ.SUBTITLE}</div>
      </div>
      <GeniePromptBox help={true} setSearchQuery={setSearchQuery} />
      <div className="Genie__help__faq-section">
        {filteredData.map((item, index) => {
          const isOpen = openItems.has(index);

          return (
            <motion.div
              key={index}
              className="Genie__help__faq-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => toggleItem(index)}
            >
              <div
                className="Genie__help__faq-item-header"
                tabIndex={0}
                aria-expanded={isOpen}
                aria-controls={`faq-content-${index}`}
              >
                <div className="Genie__help__faq-item-list-head cp">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: highlightText(item.content),
                    }}
                  />
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={genieIcons.menuIconDownArrowselect}
                      alt={isOpen ? HELP.FAQ.ALT_TEXTS.COLLAPSE : HELP.FAQ.ALT_TEXTS.EXPAND}
                      className="Genie__help__faq-item-icon mb3"
                    />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key={`details-${index}`}
                    className="Genie__help__faq-item-details-wrapper"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                    id={`faq-content-${index}`}
                  >
                    <div
                      className="Genie__help__faq-item-details"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(item.details),
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {filteredData.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="Genie__help__faq-empty"
          >
            <p>{HELP.FAQ.NO_RESULTS}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FAQ;
