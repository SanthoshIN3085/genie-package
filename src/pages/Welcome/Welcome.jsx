import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import * as genieIcons from "../../assets/genieIcons";
import GeniePromptBox from "Components/GeniePromptBox/GeniePromptBox";
import { getRecommendedPrompts } from "../../constant/constant";
import {
  cardContainerVariants,
  sharedAnimationVariants,
} from "./animationConstants";
import { useDispatch, useSelector } from "react-redux";
import { updateUI, updateSearch } from "Reducers/genie/reducer";
import { WELCOME } from "../../constant/textConstants";

const ACTION_CARDS = [
  {
    id: "data-augment",
    title: WELCOME.ACTION_CARDS.DATA_AUGMENT,
    icon: {
      light: genieIcons.genieDataAugument,
      dark: genieIcons.genieDataAugumentDark,
    },
  },
  {
    id: "create-segment",
    title: WELCOME.ACTION_CARDS.CREATE_SEGMENT,
    icon: {
      light: genieIcons.ingestion,
      dark: genieIcons.genieSegmentDark,
    },
  },
  {
    id: "communication-creation",
    title: WELCOME.ACTION_CARDS.COMMUNICATION_CREATION,
    icon: {
      light: genieIcons.communication,
      dark: genieIcons.genieCampaignDark,
    },
  },
  {
    id: "content-generation",
    title: WELCOME.ACTION_CARDS.CONTENT_GENERATION,
    icon: {
      light: genieIcons.listgeneration,
      dark: genieIcons.genieListGenerationDark,
    },
  },
  {
    id: "roi-analysis",
    title: WELCOME.ACTION_CARDS.ROI_ANALYSIS,
    icon: {
      light: genieIcons.roianalysis,
      dark: genieIcons.genieROIAnalysisDark,
    },
  },
];

const Welcome = ({ handleFormSubmit }) => {
  const { ui, search } = useSelector((state) => state.genie);
  const { isDarkMode, recommendedPrompts } = ui;
  const { searchInput } = search;
  const domain = location.pathname.split("/")[1];
  const [showRecommended, setShowRecommended] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!searchInput) {
      dispatch(
        updateUI({
          recommendedPrompts: false,
        })
      );
      setShowRecommended(true);
    }
  }, [searchInput, dispatch]);

  const handleActionCardClick = (title) => {
    dispatch(
      updateSearch({
        searchInput: title,
      })
    );
  };

  const handleRecommendedPromptClick = (prompt) => {
    dispatch(
      updateSearch({
        searchInput: prompt,
      })
    );
    dispatch(
      updateUI({
        recommendedPrompts: true,
      })
    );
    setShowRecommended(false);
  };

  return (
    <div className={`welcome`}>
      <div className="welcome__header">
        <div className="welcome__header__title">{WELCOME.GREETING}</div>
        <span className="welcome__header__subtitle" id="red">
          {WELCOME.SUBTITLE}
        </span>
      </div>

      <AnimatePresence>
        <motion.div
          className={`welcome__action-cards ${
            searchInput ? "pointer-event-none" : ""
          }`}
          variants={cardContainerVariants}
          initial="visible"
          animate={searchInput ? "hidden" : "visible"}
          exit="hidden"
        >
          {ACTION_CARDS.map((card, index) => (
            <div
              className="welcome__action-card"
              onClick={() => handleActionCardClick(card.title)}
              key={index}
            >
              <img
                src={isDarkMode ? card.icon.dark : card.icon.light}
                alt={`${card.title} Icon`}
                className="welcome__action-card__icon"
              />
              <h2 className="welcome__action-card__title">
                {card.title.split(" ").map((word, index) => (
                  <span key={index}>{word}</span>
                ))}
              </h2>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      <motion.div
        className={`welcome__promptbox-container${
          searchInput ? "--search-mode" : ""
        }`}
        variants={sharedAnimationVariants}
        initial="visible"
        animate={searchInput ? "center" : "visible"}
      >
        <GeniePromptBox handleFormSubmit={handleFormSubmit} />
      </motion.div>

      <AnimatePresence>
        {showRecommended && (
          <motion.div
            className={`welcome__recommended${
              searchInput ? "--search-mode" : ""
            }`}
            variants={sharedAnimationVariants}
            initial="visible"
            animate={searchInput ? "center" : "visible"}
            exit="hidden"
          >
            {getRecommendedPrompts(domain)?.map((prompt, index) => (
              <div
                className="welcome__recommended-prompt"
                onClick={() => handleRecommendedPromptClick(prompt)}
                key={index}
              >
                <p className="welcome__recommended-prompt__text">{prompt}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Welcome;
