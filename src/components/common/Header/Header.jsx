import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  genietext,
  genieClose,
  genieMinimize,
  genieDayNight,
  audioOn,
  audioOff,
  GenVideo,
  genieAI,
  betaSmall,
  beta,
  genSearchThick,
} from "../../../assets/GenieIcons";
import RSTooltip from "../../RSTooltip";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
// import Search from "../../feature/Search/Search";
import RSModal from "../../RSModal";
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
import { useTheme } from "../../../context/ThemeContext";
// import Search from "../../../features/Search/Search";
// import { updateAICommunication } from "Reducers/communication/createCommunication/Create/reducer";

const Header = ({ istextLogo = false }) => {
  const { promptGalleryFlag, ui, chat, search, speech } = useSelector(
    (state) => state.genie
  );
  const {
    promptBoxHeight,
    label,
    collapsed,
    isDarkMode,
    showWorkings,
    showVideoModal,
  } = ui;
  const { searchInput, searchInputLength, showSearch } = search;
  const { messages } = chat;
  const { isAudioMode } = speech;
  const searchRef = useRef();
  const videoRef = useRef(null); // Added video ref
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [isDarkActive, setIsDarkActive] = useState(false);
  const dispatch = useDispatch();
  const { toggleTheme } = useTheme();

  const handleClose = () => {
    dispatch(resetGenie());
  };

  // Function to handle direct fullscreen video
  const handleDirectFullscreen = () => {
    // Create a video element directly
    const video = document.createElement("video");
    video.src = "https://cfassets.resul.io/Media/Genie-RESUL-GenAI.mp4";
    video.controls = true;
    video.autoplay = true;
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.backgroundColor = "black";

    // Add event listener to handle fullscreen exit
    const handleFullscreenExit = () => {
      if (!document.fullscreenElement) {
        // Get current time before removing video
        const currentTime = video.currentTime;

        // Remove the fullscreen video
        video.remove();

        // Remove event listeners
        document.removeEventListener("fullscreenchange", handleFullscreenExit);
        document.removeEventListener(
          "webkitfullscreenchange",
          handleFullscreenExit
        );
        document.removeEventListener(
          "mozfullscreenchange",
          handleFullscreenExit
        );
        document.removeEventListener(
          "MSFullscreenChange",
          handleFullscreenExit
        );

        // Open modal and set video time
        dispatch(
          updateUI({
            showVideoModal: true,
          })
        );

        // Set the video time after modal opens
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.currentTime = currentTime;
            videoRef.current
              .play()
              .catch((e) => console.log("Autoplay prevented:", e));
          }
        }, 100);
      }
    };

    // Add fullscreen change listeners for all browsers
    document.addEventListener("fullscreenchange", handleFullscreenExit);
    document.addEventListener("webkitfullscreenchange", handleFullscreenExit);
    document.addEventListener("mozfullscreenchange", handleFullscreenExit);
    document.addEventListener("MSFullscreenChange", handleFullscreenExit);

    // Append to body temporarily
    document.body.appendChild(video);

    // Request fullscreen
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen();
    }

    // Play the video
    video.play().catch((e) => console.log("Autoplay prevented:", e));
  };

  const fadeVariant = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  const betaVariant = {
    hidden: {
      right: -45,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    visible: {
      right: collapsed ? -5 : -45,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
    exit: {
      right: -45,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current?.contains(e.target) ||
        e.target.closest(".k-animation-container")
      ) {
        return;
      }
      dispatch(
        updateSearch({
          showSearch: false,
        })
      );
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [modalSize, setModalSize] = useState("lg");

  useEffect(() => {
    const updateModalSize = () => {
      setModalSize(window.innerWidth >= 1400 ? "xxlg" : "lg");
    };

    updateModalSize();
    window.addEventListener("resize", updateModalSize);
    return () => window.removeEventListener("resize", updateModalSize);
  }, []);

  return (
    <>
      <div className="genie-header">
        <div className="genie-header__logo">
          <div className="genie-header__logo-wrapper">
            <div className="genie-header__logo-container">
              <AnimatePresence mode="wait">
                {!collapsed || istextLogo ? (
                  <motion.img
                    key="text-logo"
                    src={genietext}
                    alt="Genie-Text-Logo"
                    className="genie-header__text-logo"
                    variants={fadeVariant}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  />
                ) : (
                  <motion.img
                    key="ai-logo"
                    src={genieAI}
                    alt="Genie-AI-Logo"
                    className="genie-header__ai-logo"
                    variants={fadeVariant}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  />
                )}
              </AnimatePresence>
            </div>

            <motion.div
              className="genie-header__beta"
              animate={{
                right: collapsed && !istextLogo ? -5 : -45,
                height: collapsed && !istextLogo ? 18 : 13,
              }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
                height: {
                  duration: 0.3,
                },
              }}
            >
              <AnimatePresence mode="wait">
                {collapsed && !istextLogo ? (
                  <motion.img
                    key="beta-small"
                    src={betaSmall}
                    alt="Genie"
                    style={{ height: "100%" }}
                    variants={betaVariant}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  />
                ) : (
                  <motion.img
                    key="beta"
                    src={beta}
                    alt="Genie"
                    style={{ height: "100%" }}
                    variants={betaVariant}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        <div
          className={`genie-header__actions ${showWorkings ? "opacity-0" : ""}`}
        >
          <div className="genie-header__actions__search" ref={searchRef}>
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, x: 0, width: 0 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    width: "calc(100vw - 280px)",
                    transition: {
                      opacity: { duration: 0.4, ease: "easeInOut" },
                      x: { duration: 0.4, ease: "easeInOut" },
                      width: { duration: 0.6, ease: "easeInOut" },
                    },
                  }}
                  exit={{
                    opacity: 0,
                    x: 0,
                    width: 0,
                    transition: {
                      opacity: { duration: 0.4, ease: "easeInOut" },
                      x: { duration: 0.4, ease: "easeInOut" },
                      width: { duration: 0.6, ease: "easeInOut" },
                    },
                  }}
                  className="searchBar"
                >
                  {/* <Search /> */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <RSTooltip text={"Search"} position="bottom" className="lh0">
            <img
              src={genSearchThick}
              className={`genie-header__icon ${
                isSearchActive ? "active" : ""
              } mt2`}
              onClick={() =>
                dispatch(
                  updateSearch({
                    showSearch: true,
                  })
                )
              }
              alt="search"
            />
          </RSTooltip>

          <RSTooltip text={"Preview"} position="bottom">
            <img
              src={GenVideo}
              className={`genie-header__icon`}
              onClick={() => {
                handleDirectFullscreen();
              }}
              alt="genie video"
            />
          </RSTooltip>
          <RSTooltip
            text={isAudioMode ? "OFF" : "ON"}
            position="bottom"
            // className="click-off"
          >
            <img
              src={isAudioMode ? audioOff : audioOn}
              className={`genie-header__icon ${isAudioActive ? "active" : ""}`}
              onClick={() => {
                dispatch(
                  updateSpeech({
                    isAudioMode: !isAudioMode,
                  })
                );
                setIsAudioActive(!isAudioActive);
              }}
              alt="Audio Mode"
            />
          </RSTooltip>

          <RSTooltip
            text={isDarkMode ? "Light mode" : "Dark mode"}
            position="bottom"
          >
            <img
              src={genieDayNight}
              className={`genie-header__icon ${isDarkActive ? "active" : ""}`}
              onClick={() => {
                toggleTheme();
                setIsDarkActive(!isDarkActive);
              }}
              alt="Theme Mode"
            />
          </RSTooltip>

          <RSTooltip text="Close" position="bottom">
            <img
              src={genieClose}
              className="genie-header__icon"
              onClick={handleClose}
              alt="Close"
            />
          </RSTooltip>
        </div>
      </div>

      <RSModal
        show={showVideoModal}
        handleClose={() =>
          dispatch(
            updateUI({
              showVideoModal: false,
            })
          )
        }
        header={`Accelerate your business growth with Genie-RESUL's GenAI`}
        size={modalSize}
        className="Genie-video"
        body={
          <div className="video-container">
            <video
              ref={videoRef}
              width="100%"
              controls
              autoplay
              src="https://cfassets.resul.io/Media/Genie-RESUL-GenAI.mp4"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        }
      />
    </>
  );
};

Header.propTypes = {
  istextLogo: PropTypes.bool,
};

export default Header;
