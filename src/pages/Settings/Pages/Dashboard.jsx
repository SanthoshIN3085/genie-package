import React, { useMemo, useState } from "react";
import { formatNumber } from "../../../Utils";
import * as colors from "../../../constant/GlobalConstant/Colors";
import SettingsLayout from "../SettingsLayout";
import {
  AlertIcon,
  GenieBilling,
  GenieDteail,
  GenieToken,
  GenieAudit,
  WhatsNew,
  KeyInsight,
} from "../../../assets/genieIcons";
// import RSTabber from 'Components/RSTabber';

const InsightItem = ({ title, time, description }) => (
  <div className="token-dashboard__insight-item mb15">
    <h4 className="mb0">{title}</h4>
    <small>{time}</small>
    <span>{description}</span>
  </div>
);

const KeyInsightItem = ({ label, value }) => (
  <div className="token-dashboard__insight-item mb10">
    <div className="token-dashboard__insight-header">
      <div className="d-flex align-items-center">
        <span>{label}</span>
        <span>{value}</span>
      </div>
    </div>
  </div>
);

const WHATS_NEW_ITEMS = [
  {
    title: "New: Advanced image generation module",
    time: "3 days ago",
    description:
      "Explore enhanced capabilities in our new image generation tool with more styles and higher resolution outputs.",
  },
  {
    title: "Update: Improved translation accuracy",
    time: "1 week ago",
    description:
      "We've fine-tuned our translation models for better accuracy and context understanding.",
  },
  {
    title: "Tip: Optimize token usage with batching",
    time: "2 weeks ago",
    description:
      "Learn how to reduce token consumption by batching your requests to our APIs.",
  },
];

const KEY_INSIGHTS_ITEMS = [
  {
    label: "Most used feature",
    value: "Text Generation (45% of total usage)",
  },
  {
    label: "Peak usage time",
    value: "Wednesdays, 2-4 PM UTC",
  },
  {
    label: "Potential savings",
    value: "Consider 'Concise' AI style for ~15% token reduction.",
  },
];

// Constants
const CHART_CONFIG = {
  HEIGHT: 330,
  TICK_INTERVAL: 0.7,
  POINT_WIDTH: 27,
};

// Constants
const DASHBOARD_DATA = {
  usedTokens: 6750000,
  allocatedTokens: 10000000,
  remainingTokens: 3250000,
  remainingPercentage: 32.5,
  currentPlan: {
    name: "Pro Tier",
    description: "Access to premium features and higher limits.",
  },
  usageByFeature: [
    { name: "Data augment", value: 900000, color: colors.ch_color1 },
    { name: "Create segment", value: 1650000, color: colors.ch_color2 },
    {
      name: "Communication creation",
      value: 1950000,
      color: colors.ch_color3,
    },
    { name: "Content generation", value: 910000, color: colors.ch_color4 },
    { name: "ROI analysis", value: 244000, color: colors.ch_color5 },
  ],
};

// Component for displaying metric items
const MetricItem = ({ label, value, className = "" }) => {
  const formattedValue = formatNumber(value);
  const numericPart = formattedValue.slice(0, -1);
  const suffix = formattedValue.slice(-1);

  return (
    <div className="token-dashboard__metric">
      <div className="token-dashboard__metric-label">{label}</div>
      <div className={`token-dashboard__metric-value ${className}`}>
        {numericPart}
        <span className="metric-suffix">{suffix}</span>
      </div>
    </div>
  );
};

// Component for displaying alerts
const AlertItem = ({ icon, title, timeAgo }) => (
  <div className="token-dashboard__alert-item mb15">
    <div className="d-flex align-items-start">
      <img
        src={icon}
        alt="Alert"
        className="token-dashboard__alert-icon mr10 mt3"
      />
      <div className="token-dashboard__alert-content">
        <div className="token-dashboard__alert-title">{title}</div>
        <small className="text-muted">
          {timeAgo} - <span className="link">View details</span>
        </small>
      </div>
    </div>
  </div>
);

// Component for displaying quick actions
const QuickActionItem = ({ icon, title, alt }) => (
  <div className="token-dashboard__actions-item">
    <div className="token-dashboard__actions-item-list">
      <img src={icon} alt={alt} className="token-dashboard__actions-icon" />
      <div className="token-dashboard__action-content">
        <div className="token-dashboard__action-title">{title}</div>
      </div>
    </div>
  </div>
);

// Content renderer components
const TokenStatusContent = ({ data }) => (
  <>
    <div className="token-dashboard__token-metrics">
      <MetricItem
        label="Used tokens"
        value={data.usedTokens}
        className="token-dashboard__metric-value--used"
      />
      <MetricItem
        label="Allocated tokens"
        value={data.allocatedTokens}
        className="token-dashboard__metric-value--allocated"
      />
    </div>
    <div className="token-dashboard__progress">
      <div className="token-dashboard__progress-bar">
        <div className="token-dashboard__progress-fill" />
      </div>
      <div className="token-dashboard__progress-text">
        {formatNumber(data.remainingTokens)} tokens remaining (
        <span>{data.remainingPercentage}%</span>)
      </div>
    </div>
  </>
);

const AlertsActivityContent = () => {
  const alerts = [
    {
      icon: AlertIcon,
      title: "Low token warning for 'Content Gen AI' module.",
      timeAgo: "1h ago",
    },
    {
      icon: GenieDteail,
      title: "User 'Bob' updated their email notification settings.",
      timeAgo: "3h ago",
    },
    {
      icon: GenieBilling,
      title: "Billing: Invoice #INV007 processed successfully.",
      timeAgo: "1d ago",
    },
  ];

  return (
    <div className="token-dashboard__alerts">
      {alerts.map((alert, index) => (
        <AlertItem key={index} {...alert} />
      ))}
    </div>
  );
};

const QuickActionsContent = () => {
  const actions = [
    { icon: GenieToken, title: "Manage tokens", alt: "Manage tokens" },
    { icon: GenieAudit, title: "Audit logs", alt: "Audit logs" },
    { icon: GenieBilling, title: "Billing", alt: "Billing" },
  ];

  return (
    <div className="token-dashboard__actions">
      {actions.map((action, index) => (
        <QuickActionItem key={index} {...action} />
      ))}
    </div>
  );
};

// Main Dashboard component
const Dashboard = () => {
  const [insightsTab, setInsightsTab] = useState("whatsnew");

  // Debug: Monitor insightsTab changes
  React.useEffect(() => {
    console.log("insightsTab state changed to:", insightsTab);
  }, [insightsTab]);

  // Insights Tab Configuration
  const INSIGHTS_TAB_CONFIG = useMemo(
    () => [
      {
        id: "whatsnew",
        text: "What's new",
        image: WhatsNew,
        component: () => (
          <div className="token-dashboard__insights-content">
            {WHATS_NEW_ITEMS.map((item, index) => (
              <InsightItem
                key={`whats-new-${index}`}
                title={item.title}
                time={item.time}
                description={item.description}
              />
            ))}
          </div>
        ),
      },
      {
        id: "keyinsights",
        text: "Key insights",
        image: KeyInsight,
        component: () => (
          <div className="token-dashboard__insights-content">
            {KEY_INSIGHTS_ITEMS.map((item, index) => (
              <KeyInsightItem
                key={`key-insight-${index}`}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>
        ),
      },
    ],
    []
  );

  // Chart data configuration - moved inside component
  const chartData = useMemo(
    () => ({
      chart: {
        type: "column",
        height: CHART_CONFIG.HEIGHT,
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
      credits: { enabled: false },
      tooltip: {
        formatter: function () {
          return "<b>" + this.x + "</b><br/>" + this.y + " M";
        },
      },
      xAxis: {
        categories: DASHBOARD_DATA.usageByFeature.map((item) => item.name),
        labels: {
          enabled: true,
          style: { fontSize: "12px", fontWeight: "normal", color: "grey" },
        },
      },
      yAxis: {
        tickInterval: CHART_CONFIG.TICK_INTERVAL,
        labels: {
          format: "{value}M",
          enabled: true,
          style: { color: "grey" },
        },
        title: { text: null },
      },
      plotOptions: {
        column: {
          colorByPoint: true,
          pointWidth: CHART_CONFIG.POINT_WIDTH,
        },
      },
      legend: { enabled: false },
      series: [
        {
          name: "Token Usage",
          data: DASHBOARD_DATA.usageByFeature.map((item) => ({
            y: item.value / 1000000,
            color: item.color,
          })),
        },
      ],
    }),
    []
  );

  const UpdatesInsights = () => {
    return (
      <div className="token-dashboard__card-insights">
        <div className="position-relative pageSub_tab x-axis-labels-performance">
          {/* <RSTabber
                        defaultTab={0}
                        defaultClass="col-md-2 tabTransparent"
                        dynamicTab=""
                        activeClass="active"
                        tabData={INSIGHTS_TAB_CONFIG}
                        className="rs-tabs row"
                        componentClassName="mt20"
                        callBack={({ id }) => {
                            console.log('RSTabber callback called with id:', id);
                            setInsightsTab(id);
                        }}
                    /> */}
        </div>
      </div>
    );
  };

  const pageData = useMemo(
    () => ({
      isHeader: [
        {
          headerTitle: "Dashboard",
          headerSubTitle: "Where intelligence meets interface",
        },
      ],
      mainSection: [
        {
          title: "Overall token status",
          subtitle: "Your current token consumption.",
          mainContent: { type: "token-status" },
          isbutton: true,
          buttonText: "View token details",
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
        {
          title: "Important alerts & activity",
          subtitle: "Recent notifications and system events.",
          mainContent: { type: "alerts-activity" },
          isbutton: true,
          buttonText: "View all alerts & logs",
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
        {
          title: "Quick actions",
          subtitle: "Jump to key settings.",
          mainContent: { type: "quick-actions" },
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
          title: "Updates & Insights",
          subtitle: "Stay informed with the latest news and key metrics.",
          mainContent: { type: "updates-insights" },
          isbutton: false,
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
        {
          title: "Token usage by feature",
          subtitle:
            "Breakdown of token consumption across different AI functionalities.",
          mainContent: { type: "usage-by-feature" },
          isbutton: false,
          isGrid: false,
          gridData: [],
          columnData: [],
          isSearch: false,
          isfooter: false,
          footerText: "",
          chart: true,
          chartData: chartData,
          chartOptions: [],
          subMainSection: [],
          colValue: false,
        },
      ],
    }),
    [chartData]
  );

  const renderContent = (content) => {
    if (!content) return null;

    const contentRenderers = {
      "token-status": () => <TokenStatusContent data={DASHBOARD_DATA} />,
      "alerts-activity": () => <AlertsActivityContent />,
      "quick-actions": () => <QuickActionsContent />,
      "updates-insights": () => <UpdatesInsights />,
      "usage-by-feature": () => null,
      empty: () => <div></div>,
    };

    return contentRenderers[content.type]?.() || <div></div>;
  };

  return <SettingsLayout pageData={pageData} renderContent={renderContent} />;
};

export default Dashboard;
