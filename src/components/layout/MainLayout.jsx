import React from "react";
import Header from "../common/Header/Header";
import Footer from "../common/Footer/Footer";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

function MainLayout({
  sidebar,
  content,
  showHeader = true,
  showFooter = true,
  istextLogo = false,
}) {
  const { ui, settings } = useSelector((state) => state.genie);
  const { collapsed, home } = ui;
  const { helpTabs, settingsTab } = settings;
  return (
    <div
      className={`genie__page ${
        helpTabs || settingsTab ? "genie__page__help" : ""
      }`}
    >
      {showHeader && <Header istextLogo={istextLogo} />}
      <div
        className={`genie__page__content ${
          collapsed && !istextLogo ? "genie__page__content-collapsed" : ""
        }`}
      >
        {sidebar && <div className={`genie__page__sidebar`}>{sidebar}</div>}
        <div className={`genie__page__container ${home ? "home" : ""}`}>
          {content}
        </div>
      </div>
      {showFooter && <Footer />}
    </div>
  );
}

MainLayout.propTypes = {
  sidebar: PropTypes.node,
  content: PropTypes.node,
  showHeader: PropTypes.bool,
  showFooter: PropTypes.bool,
};

export default MainLayout;
