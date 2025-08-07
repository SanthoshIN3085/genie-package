import React, { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import RSKendoDropDownList from "../../../components/RSKendoDropdown";
import SettingsLayout from "../SettingsLayout";

const Alerts = () => {
  const [threshold, setThreshold] = useState(40);
  const [emailToggle, setEmailToggle] = useState(true);
  const [appToggle, setAppToggle] = useState(true);
  const [dailyToggle, setDailyToggle] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const { control, setValue, watch, getValues } = useFormContext();

  const toggleStates = useMemo(() => [
    {
      id: "email",
      label: "Email Notifications",
      state: emailToggle,
      setState: setEmailToggle,
      desc: "Receive alerts via email.",
    },
    {
      id: "app",
      label: "In-App Notifications",
      state: appToggle,
      setState: setAppToggle,
      desc: "Show alerts within the application.",
    },
    {
      id: "daily",
      label: "Daily Usage Report",
      state: dailyToggle,
      setState: setDailyToggle,
      desc: "Receive a summary of token usage.",
    },
  ], [emailToggle, appToggle, dailyToggle]);

  // JSON configuration for alerts section
  const alertsSectionData = useMemo(
    () => ({
      threshold: {
        label: "Low Token Balance Threshold",
        description:
          "Receive an alert when remaining tokens drop below this percentage.",
        value: threshold,
        min: 0,
        max: 100,
        unit: "%",
        footerText: "Current global threshold:",
        onChange: (value) => setThreshold(value),
        onIncrement: () => setThreshold(Math.min(100, threshold + 1)),
        onDecrement: () => setThreshold(Math.max(0, threshold - 1)),
      },
      notifications: {
        title: "Notification Settings",
        toggles: [
          {
            id: "email",
            label: "Email Notifications",
            description: "Receive alerts via email.",
            isActive: emailToggle,
            onToggle: (newValue) => setEmailToggle(newValue),
          },
          {
            id: "app",
            label: "In-App Notifications",
            description: "Show alerts within the application.",
            isActive: appToggle,
            onToggle: (newValue) => setAppToggle(newValue),
          },
          {
            id: "daily",
            label: "Daily Usage Report",
            description: "Receive a summary of token usage.",
            isActive: dailyToggle,
            onToggle: (newValue) => setDailyToggle(newValue),
          },
        ],
      },
      actions: {
        saveButton: {
          text: "Save Global Alert Settings",
          className: "alerts__button",
          onClick: () => {
            // Handle save logic here
            console.log("Saving alert settings:", {
              threshold,
              emailToggle,
              appToggle,
              dailyToggle,
            });
          },
        },
      },
    }),
    [threshold, emailToggle, appToggle, dailyToggle]
  );

  const pageData = useMemo(
    () => ({
      isHeader: [
        {
          headerTitle: "Notification Alerts",
          headerSubTitle:
            "Manage how and when you receive alerts about token usage and account activity.",
        },
      ],
      mainSection: [
        {
          title: "Global Token Usage Alerts",
          subtitle:
            "Configure default notifications for token consumption for all users.",
          mainContent: {
            type: "usage-alerts",
            data: alertsSectionData,
          },
          isbutton: false,
          buttonText: "",
          buttonPosition: "center",
          isGrid: false,
          gridData: [],
          columnData: [],
          isSearch: false,
          isfooter: false,
          footerText: "",
          chart: false,
          chartData: [],
          chartOptions: [],
          subMainSection: [],
          colValue: 8,
        },
        {
          title: "User-Specific Alert Preferences",
          subtitle: "Override global alert settings for individual users.",
          mainContent: {
            type: "user-specific",
          },
          isbutton: false,
          buttonText: "",
          buttonPosition: "center",
          isGrid: false,
          gridData: [],
          columnData: [],
          isSearch: false,
          isfooter: false,
          footerText: "",
          chart: false,
          chartData: [],
          chartOptions: [],
          subMainSection: [],
          colValue: 4,
        },
      ],
    }),
    [threshold, emailToggle, appToggle, dailyToggle]
  );

  const UserSpecific = () => {
    const userOptions = [
      { text: "Select a user to configure alerts", value: "" },
      { text: "Charlie Brown", value: "charlie" },
      { text: "Bob The Builder", value: "bob" },
      { text: "Alice Wonderland", value: "alice" },
    ];

    const selectedUserOption = userOptions.find(option => option.value === selectedUser) || userOptions[0];

    const handleUserChange = (e) => {
      console.log("User selected:", e.value);
      setSelectedUser(e.value);
      setValue("selectedUserForTokens", e.value);
    };

    return (
      <>
        <label className="alerts__toggle-label">Select user</label>
        <div className="alerts__dropdown mt10">
          <RSKendoDropDownList
            control={control}
            name="selectedUserForTokens"
            data={userOptions}
            textField="text"
            dataItemKey="value"
            defaultValue={selectedUserOption.value}
            handleChange={handleUserChange}
          />
        </div>
        {selectedUser && (
          <div className="mt10">
            <small className="text-muted">
              Selected user: {selectedUserOption.text}
            </small>
          </div>
        )}
      </>
    );
  };

  const AlertsActivityContent = () => {
    const {
      threshold: thresholdData,
      notifications,
      actions,
    } = alertsSectionData;

    return (
      <div className="alerts__section">
        <div className="alerts__threshold">
          <div className="alerts__threshold-label mb10">
            {thresholdData.label}
          </div>
          <span className="alerts__threshold-dec mb20">
            {thresholdData.description}
          </span>
          <div className="custom-slider-group mt20">
            <div className="custom-slider">
              <input
                type="range"
                min={thresholdData.min}
                max={thresholdData.max}
                value={thresholdData.value}
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  console.log("Slider changed to:", newValue);
                  thresholdData.onChange(newValue);
                }}
                onInput={(e) => {
                  const newValue = Number(e.target.value);
                  console.log("Slider input to:", newValue);
                  thresholdData.onChange(newValue);
                }}
                className="custom-slider__input"
              />
              <div className="custom-slider__bar">
                <div
                  className="custom-slider__fill"
                  style={{ width: `${thresholdData.value}%` }}
                />
                <div
                  className="custom-slider__thumb"
                  style={{ left: `calc(${thresholdData.value}% - 15px)` }}
                >
                  <span className="custom-slider__arrows">&lt;&gt;</span>
                </div>
              </div>
            </div>
            <div className="custom-slider__number-group">
              <span className="custom-slider__number">
                {thresholdData.value}
              </span>
              <div className="custom-slider__arrow-vertical">
                <button
                  className="custom-slider__arrow custom-slider__arrow--up"
                  onClick={() => {
                    const newValue = Math.min(100, thresholdData.value + 1);
                    console.log("Arrow up clicked, new value:", newValue);
                    thresholdData.onChange(newValue);
                  }}
                  tabIndex={-1}
                  type="button"
                >
                  &gt;
                </button>
                <button
                  className="custom-slider__arrow custom-slider__arrow--down"
                  onClick={() => {
                    const newValue = Math.max(0, thresholdData.value - 1);
                    console.log("Arrow down clicked, new value:", newValue);
                    thresholdData.onChange(newValue);
                  }}
                  tabIndex={-1}
                  type="button"
                >
                  &gt;
                </button>
              </div>
            </div>
            <span className="custom-slider__percent">{thresholdData.unit}</span>
          </div>
          <div className="alerts__threshold-footer">
            {thresholdData.footerText}{" "}
            <span>
              {thresholdData.value}
              {thresholdData.unit}
            </span>
          </div>
        </div>
        <div className="position-relative">
          <div className="alerts__notifications">
            {notifications.toggles.map((toggle) => (
              <div key={toggle.id} className="alerts__toggle">
                <span className="alerts__toggle-label">
                  {toggle.label}{" "}
                  <span className="alerts__toggle-desc">
                    {toggle.description}
                  </span>
                </span>
                <div
                  className={`alerts__toggle--switch ${
                    toggle.isActive ? "active" : ""
                  }`}
                  onClick={() => {
                    console.log(`Toggling ${toggle.id} from ${toggle.isActive} to ${!toggle.isActive}`);
                    toggle.onToggle(!toggle.isActive);
                  }}
                >
                  <div
                    className={`alerts__toggle--thumb ${
                      toggle.isActive ? "active" : ""
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-end">
            <button
              className={actions.saveButton.className}
              onClick={actions.saveButton.onClick}
            >
              {actions.saveButton.text}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = (content) => {
    if (!content) return null;

    const contentRenderers = {
      "user-specific": () => <UserSpecific />,
      "usage-alerts": () => <AlertsActivityContent />,
      empty: () => <div></div>,
    };

    return contentRenderers[content.type]?.() || <div></div>;
  };

  return (
    <div className="alerts__content">
      <SettingsLayout pageData={pageData} renderContent={renderContent} />
    </div>
  );
};

export default Alerts;
