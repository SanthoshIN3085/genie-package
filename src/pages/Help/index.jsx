import React from "react";
import { HELP_SECTIONS } from "./constant";
import ReleaseNotes from "./Pages/ReleaseNotes";
import KeyboardShortcuts from "./Pages/KeyboardShortcuts";
import FAQ from "./Pages/FAQ";
import { useDispatch, useSelector } from "react-redux";
import { updateSettings } from "Reducers/genie/reducer";
import Sidebar from "./Sidebar";
import MainLayout from "Components/layout/MainLayout";

const Help = ({ handleSideNavClick = () => {} }) => {
  const { settings } = useSelector((state) => state.genie);
  const { activeSectionSettings } = settings;

  const dispatch = useDispatch();

  const renderContent = () => {
    switch (activeSectionSettings) {
      case HELP_SECTIONS.FAQ:
        return <FAQ />;
      case HELP_SECTIONS.RELEASE_NOTES:
        return <ReleaseNotes />;
      case HELP_SECTIONS.KEYBOARD_SHORTCUTS:
        return <KeyboardShortcuts />;
      default:
        return dispatch(
          updateSettings({
            helpTabs: false,
            activeSectionSettings: "faq",
          })
        );
    }
  };

  return (
    <>
      <MainLayout
        sidebar={<Sidebar handleSideNavClick={handleSideNavClick} />}
        content={<div className="genie__help_settings">{renderContent()}</div>}
        istextLogo
      />
    </>
  );
};

export default Help;
