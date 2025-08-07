import React from "react";
import { Settings_SECTIONS } from "./constant";
import Billings from "./Pages/Billings";
import Dashboard from "./Pages/Dashboard";
import AuditLog from "./Pages/AuditLog";
import Alerts from "./Pages/Alerts";
import TokenLedger from "./Pages/TokenLedger";
import { useDispatch, useSelector } from "react-redux";
import { updateSettings } from "Reducers/genie/reducer";
import Sidebar from "../Help/Sidebar";
import MainLayout from "../../components/layout/MainLayout";

const Settings = ({ handleSideNavClick = () => {} }) => {
  const { settings } = useSelector((state) => state.genie);
  const { activeSectionSettings } = settings;

  const dispatch = useDispatch();

  const renderContent = () => {
    switch (activeSectionSettings) {
      case Settings_SECTIONS.DASHBOARD:
        return <Dashboard />;
      case Settings_SECTIONS.BILLING:
        return <Billings />;
      case Settings_SECTIONS.TOKEN_MANAGEMENT:
        return <TokenLedger />;
      case Settings_SECTIONS.AUDIT_LOG:
        return <AuditLog />;
      case Settings_SECTIONS.ALERTS:
        return <Alerts />;
      default:
        return dispatch(
          updateSettings({
            settingsTab: false,
            activeSectionSettings: "dashboard",
          })
        );
    }
  };

  return (
    <MainLayout
      sidebar={<Sidebar handleSideNavClick={handleSideNavClick} />}
      content={<div className="genie__help_settings">{renderContent()}</div>}
      istextLogo
    />
  );
};

export default Settings;
