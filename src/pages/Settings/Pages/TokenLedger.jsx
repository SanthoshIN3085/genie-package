import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Row, Col } from "react-bootstrap";
import RSInput from "../../../components/RSInput";
import RSKendoDropDownList from "../../../components/RSKendoDropdown";
import { numberWithCommas, formatNumber } from "../../../Utils";
import RSTooltip from "Components/RSTooltip";
import GenieTokenUsed from "../../../assets/images/genie/gen-setting-token-used.svg";
import GenieTokenAllocated from "../../../assets/images/genie/gen-setting-token-allocated.svg";
import GenieResetDate from "../../../assets/images/genie/gen-setting-reset-date.svg";
import SettingsLayout from "../SettingsLayout";

function TokenLedger() {
  const { control, setValue, watch, getValues } = useFormContext();
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const dashboardData = {
    totalUsedTokens: 6750000,
    totalAllocatedTokens: 10000000,
    lastResetDate: "Jun 22, 2025",
    overallUsage: 3250000,
    usagePercentage: 32.5,
  };
  // Helper component for metric display
  const MetricDisplay = ({ value, className = "" }) => {
    const formattedValue = formatNumber(value);
    const numericPart = formattedValue.slice(0, -1);
    const suffix = formattedValue.slice(-1);

    return (
      <span className={className}>
        {numericPart}
        <span className="metric-suffix">{suffix}</span>
      </span>
    );
  };

  // User-wise usage data
  const userUsageData = [
    {
      user: "Alice Wonderland",
      email: "alice@example.com",
      tokensUsed: 550000,
      assignedTokens: 1000000,
      lastActivity: "Jun 15, 2025, 10:20 AM",
    },
    {
      user: "Bob The Builder",
      email: "bob@example.com",
      tokensUsed: 320000,
      assignedTokens: 500000,
      lastActivity: "Jun 16, 2025, 10:20 AM",
    },
    {
      user: "Charlie Brown",
      email: "charlie@example.com",
      tokensUsed: 780000,
      assignedTokens: 1000000,
      lastActivity: "Jun 17, 2025, 10:20 AM",
    },
    {
      user: "Alice Wonderland",
      email: "alice@example.com",
      tokensUsed: 550000,
      assignedTokens: 1000000,
      lastActivity: "Jun 17, 2025, 10:30 AM",
    },
  ];

  // Token Ledger data
  const tokenLedgerData = [
    {
      date: "Jun 18, 2025, 10:20 AM",
      description: "Initial token allocation for organization",
      tokensChange: +10000000,
      balance: 10000000,
    },
    {
      date: "Jun 19, 2025, 10:20 AM",
      description: "Tokens assigned to Alice (Content Gen AI module)",
      tokensChange: -500000,
      balance: 9500000,
    },
    {
      date: "Jun 20, 2025, 10:20 AM",
      description: "Usage: Text Generation API by Bob",
      tokensChange: -25000,
      balance: 9475000,
    },
    {
      date: "Jun 21, 2025, 10:20 AM",
      description: "Tokens topped up via payment (Invoice #INV123)",
      tokensChange: +1000000,
      balance: 10475000,
    },
    {
      date: "Jun 22, 2025, 10:20 AM",
      description: "Tokens allocated to Support Bot module",
      tokensChange: -200000,
      balance: 10275000,
    },
  ];
  // Module-wise usage data
  const moduleUsageData = [
    { module: "Data augmentation", used: 2500000, allocated: 2800000 },
    { module: "Segmentation", used: 1800000, allocated: 2000000 },
    { module: "journey builder", used: 1200000, allocated: 1400000 },
    { module: "Analytics", used: 1200000, allocated: 1400000 },
    { module: "Content generation", used: 1200000, allocated: 1400000 },
  ];
  // Users and modules for dropdowns
  const users = ["Select a user", ...userUsageData.map((user) => user.user)];
  const modules = [
    "Select a module",
    ...moduleUsageData.map((module) => module.module),
  ];

  // Grid columns for user-wise usage
  const userColumns = [
    {
      field: "user",
      title: "User",
      width: 150,
    },
    {
      field: "email",
      title: "Email",
      width: 200,
    },
    {
      field: "tokensUsed",
      title: "Tokens used",
      width: 150,
      cell: (props) => (
        <td className="text-right">
          <span className="font-poppins-semi-bold">
            <MetricDisplay value={props.dataItem.tokensUsed} />
          </span>
        </td>
      ),
    },
    {
      field: "assignedTokens",
      title: "Assigned tokens",
      width: 150,
      cell: (props) => (
        <td className="text-right">
          <span className="font-poppins-semi-bold">
            <MetricDisplay value={props.dataItem.assignedTokens} />
          </span>
        </td>
      ),
    },
    {
      field: "lastActivity",
      title: "Last activity",
      width: 200,
    },
  ];

  // Grid columns for token ledger
  const ledgerColumns = [
    {
      field: "date",
      title: "Date & Time",
      width: 200,
    },
    {
      field: "description",
      title: "Description",
      width: 300,
    },
    {
      field: "tokensChange",
      title: "Tokens change",
      width: 150,
      cell: (props) => (
        <td className="text-right">
          <span className={`font-poppins-semi-bold `}>
            {props.dataItem.tokensChange > 0 ? "+" : ""}
            <MetricDisplay value={Math.abs(props.dataItem.tokensChange)} />
          </span>
        </td>
      ),
    },
    {
      field: "balance",
      title: "Balance",
      width: 150,
      cell: (props) => (
        <td className="text-right">
          <span className="font-poppins-semi-bold">
            <MetricDisplay value={props.dataItem.balance} />
          </span>
        </td>
      ),
    },
  ];
  // Chart configuration for module-wise usage
  const moduleChartOptions = {
    chart: {
      type: "column",
      height: 300,
      backgroundColor: "rgba(255, 255, 255, 0)",
      spacing: [10, 10, 10, 10],
      marginBottom: 70, // Added space for legend
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      formatter: function () {
        const point = this.point;
        if (!point || typeof point.index === "undefined") {
          return false; // Don't show tooltip
        }
        const allocated = moduleUsageData[point.index].allocated / 1000000;
        const used = moduleUsageData[point.index].used / 1000000;
        return `<b>${point.category}</b><br/>Used: ${used}M<br/>Allocated: ${allocated}M`;
      },
      style: {
        fontSize: "12px",
      },
    },
    xAxis: {
      title: {
        text: null,
      },
      categories: moduleUsageData.map((item) => item.module),
      labels: {
        enabled: true,
        style: {
          fontSize: "12px",
          fontWeight: "normal",
          color: "grey",
        },
        padding: 5,
        y: 20,
      },
      lineWidth: 0,
      gridLineWidth: 2,
      gridLineColor: "#e5e5e5",
      tickWidth: 0,
      tickLength: 5,
      tickPosition: "inside",
      tickmarkPlacement: "on",
      gridLineDashStyle: "Dot",
      startOnTick: true,
      endOnTick: true,
      minPadding: 0,
      maxPadding: 0,
    },
    yAxis: {
      min: 0,
      max: 3.0,
      tickInterval: 0.8,
      labels: {
        format: "{value}M",
        enabled: true,
        style: {
          color: "grey",
          fontSize: "12px",
        },
      },
      title: {
        text: null,
      },
      gridLineWidth: 2,
      gridLineColor: "#e5e5e5",
      gridLineDashStyle: "Dot",
    },
    plotOptions: {
      column: {
        grouping: false,
        pointWidth: 30, // Increased from 35
        borderWidth: 0,
      },
      series: {
        borderRadius: 3,
        states: {
          hover: {
            brightness: 0.02,
          },
        },
      },
    },
    legend: {
      enabled: true,
      align: "center",
      verticalAlign: "bottom",
      layout: "horizontal",
      itemStyle: {
        color: "grey",
        fontWeight: "normal",
        fontSize: "12px",
      },
      symbolRadius: 2,
      symbolHeight: 8,
      symbolWidth: 8,
      y: 15,
    },
    series: [
      {
        name: "Allocated",
        color: "#EEEEEE",
        data: moduleUsageData.map((item) => ({
          y: item.allocated / 1000000,
        })),
        pointPadding: 0,
        groupPadding: 0.1,
        zIndex: 1,
      },
      {
        name: "Used",
        color: "#7BC043",
        data: moduleUsageData.map((item) => ({
          y: item.used / 1000000,
        })),
        pointPadding: 0,
        groupPadding: 0.1,
        zIndex: 2,
      },
    ],
  };
  // Content renderer function to convert JSON content to JSX
  const renderContent = (content) => {
    if (!content) return null;

    switch (content.type) {
      case "overview":
        return (
          <>
            <Row className="mb24">
              <Col md={4}>
                <div className="token-management__card no-box-shadow">
                  <div className="d-flex justify-content-between align-items-center">
                    <small>Total used tokens</small>
                    <img
                      src={GenieTokenUsed}
                      alt="Notification"
                      className="token-dashboard__alert-icon"
                      width="36"
                      height="36"
                    />
                  </div>
                  <h2>
                    <MetricDisplay value={dashboardData.totalUsedTokens} />
                  </h2>
                </div>
              </Col>
              <Col md={4}>
                <div className="token-management__card no-box-shadow">
                  <div className="d-flex justify-content-between align-items-center">
                    <small>Total allocated tokens</small>
                    <img
                      src={GenieTokenAllocated}
                      alt="Notification"
                      className="token-dashboard__alert-icon"
                      width="36"
                      height="36"
                    />
                  </div>
                  <h2>
                    <MetricDisplay value={dashboardData.totalAllocatedTokens} />
                  </h2>
                </div>
              </Col>
              <Col md={4}>
                <div className="token-management__card no-box-shadow">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="fs18">Last reset date</small>
                    <img
                      src={GenieResetDate}
                      alt="Notification"
                      className="token-dashboard__alert-icon"
                      width="36"
                      height="36"
                    />
                  </div>
                  {dashboardData.lastResetDate.length > 20 ? (
                    <RSTooltip
                      text={dashboardData.lastResetDate}
                      position="top"
                    >
                      <h2 className="text-nowrap">
                        {dashboardData.lastResetDate.substring(0, 17)}...
                      </h2>
                    </RSTooltip>
                  ) : (
                    <h2 className="text-nowrap">
                      {dashboardData.lastResetDate}
                    </h2>
                  )}
                </div>
              </Col>
            </Row>

            {/* Overall Usage Progress */}
            <div className="">
              <div className="token-dashboard__progress-bar">
                <div className="token-dashboard__progress-fill"></div>
              </div>
              <div className="token-dashboard__progress mt0">
                <small>
                  Overall usage:{" "}
                  <span className="">
                    {formatNumber(dashboardData.overallUsage)}
                  </span>{" "}
                  tokens remaining
                </small>
                <span>{dashboardData.usagePercentage}%</span>
              </div>
            </div>
          </>
        );

      case "assign-tokens":
        return (
          <>
            <Row>
              <Col>
                <div className="assign-token-container">
                  <div className="form-group token-input">
                    <div className="label">Used tokens</div>
                    <RSKendoDropDownList
                      control={control}
                      name="selectedUserForTokens"
                      data={users}
                      value={selectedUser}
                      handleChange={(e) => setSelectedUser(e.target.value)}
                      label=""
                      defaultValue={"Bob The Builder"}
                    />
                  </div>

                  <div className="token-input">
                    <div className="label">Tokens to assign</div>
                    <RSInput
                      name="tokensToAssign"
                      control={control}
                      placeholder={`e.g. ${numberWithCommas(100000)}`}
                      // isNewTheme
                      type="number"
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </>
        );
      case "module-allocation":
        return (
          <>
            <Row>
              <Col>
                <div className="assign-token-container">
                  <div className="form-group token-input">
                    <div className="label">Select module</div>
                    <RSKendoDropDownList
                      control={control}
                      name="selectedModuleForAllocation"
                      data={modules}
                      value={selectedModule}
                      handleChange={(e) => setSelectedModule(e.target.value)}
                      label=""
                      defaultValue={"Image API"}
                    />
                  </div>

                  <div className=" token-input">
                    <div className="label">New token allocation</div>
                    <RSInput
                      name="newTokenAllocation"
                      control={control}
                      placeholder={`e.g. ${numberWithCommas(500000)}`}
                      type="number"
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </>
        );

      case "empty":
        return <div></div>;

      default:
        return content;
    }
  };
  const pageData = {
    isHeader: [
      {
        headerTitle: "Tokens & Ledger",
        headerSubTitle: "View detailed token reports and transaction ledger.",
      },
    ],
    mainSection: [
      {
        title: "Token usage dashboard - Overview",
        subtitle: "A high-level view of your current token status.",
        mainContent: {
          type: "overview",
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
        colValue: false,
      },
    ],
    mainSection1: [
      {
        title: "Module-wise token usage",
        subtitle: "Detailed breakdown of token consumption by each AI module.",
        mainContent: {
          type: "",
        },
        isbutton: false,
        buttonText: "",
        buttonPosition: "center",
        isGrid: false,
        gridData: [],
        columnData: [],
        isSearch: false,
        isfooter: true,
        footerText: "Token usage per module for the current billing cycle.",
        chart: true,
        chartData: moduleChartOptions,
        chartOptions: [],
        subMainSection: [],
        colValue: false,
      },
      {
        title: "User-wise token usage",
        subtitle: "Detailed breakdown of token consumption by each AI module.",
        mainContent: {
          type: "",
        },
        isbutton: false,
        buttonText: "",
        buttonPosition: "center",
        isGrid: false,
        gridData: [],
        columnData: [],
        isSearch: false,
        isfooter: true,
        footerText: "Token usage per module for the current billing cycle.",
        chart: true,
        chartData: moduleChartOptions,
        chartOptions: [],
        subMainSection: [],
        colValue: false,
      },
    ],
    mainSection2: [
      {
        title: "User-wise token usage (Detailed report)",
        subtitle: "Track token consumption by individual users.",
        mainContent: {
          type: "",
        },
        isbutton: false,
        buttonText: "",
        buttonPosition: "center",
        isGrid: true,
        gridData: userUsageData,
        columnData: userColumns,
        isSearch: false,
        isfooter: true,
        footerText: "Individual user token usage details.",
        chart: false,
        chartData: [],
        chartOptions: [],
        subMainSection: [],
        colValue: false,
      },
    ],
    mainSection3: [
      {
        title: "Token ledger",
        subtitle: "A chronological record of all token transactions.",
        mainContent: {
          type: "",
        },
        isbutton: false,
        buttonText: "",
        buttonPosition: "center",
        isGrid: true,
        gridData: tokenLedgerData,
        columnData: ledgerColumns,
        isSearch: false,
        isfooter: true,
        footerText: "Chronological list of token movements.",
        chart: false,
        chartData: [],
        chartOptions: [],
        subMainSection: [],
        colValue: false,
      },
    ],
    mainSection4: [
      {
        title: "Token management",
        subtitle: "Allocate tokens to users and set limits for modules.",
        mainContent: {
          type: "token-management",
        },
        isbutton: false,
        buttonText: "",
        buttonPosition: false,
        isGrid: false,
        gridData: [],
        columnData: [],
        isSearch: false,
        isfooter: true,
        footerText: "Chronological list of token movements.",
        chart: false,
        chartData: [],
        chartOptions: [],
        colValue: false,
        subMainSection: [
          {
            title: "Assign tokens to user",
            subtitle: "",
            mainContent: {
              type: "assign-tokens",
            },
            isbutton: true,
            buttonText: "Assign to user",
            buttonPosition: "right",
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
            colValue: false,
            isborder: true,
          },
          {
            title: "Manage module allocation",
            subtitle: "",
            mainContent: {
              type: "module-allocation",
            },
            isbutton: true,
            buttonText: "Update module allocation",
            buttonPosition: "right",
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
            colValue: false,
            isborder: true,
          },
        ],
      },
    ],
  };
  return (
    <div className="token-management">
      <SettingsLayout pageData={pageData} renderContent={renderContent} />
    </div>
  );
}

export default TokenLedger;
