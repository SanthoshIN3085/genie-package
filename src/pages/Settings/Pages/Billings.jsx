import React, { useMemo, useState } from "react";
import SettingsLayout from "../SettingsLayout";
// import { formatNumber } from 'Utils/index';
// import RSHighchartsContainer from "Components/Highcharts";
import * as colors from "../../../constant/GlobalConstant/Colors";
import RSTooltip from "Components/RSTooltip";
// import * as icons from 'Constants/GlobalConstant/Glyphicons';
import * as genieIcons from "../../../assets/genieIcons";

// Content renderer function to convert JSON content to JSX
const renderContent = (content) => {
  if (!content) return null;

  switch (content.type) {
    case "billing-card":
      return (
        <div className="billing-card">
          <div className="billing-tag">
            <span className="price">{content.price}</span>
            <span className="period">{content.period}</span>
          </div>
          <div className="billing-token-usage">{content.tokenUsage}</div>
          <ul>
            {content.features?.map((feature, index) => (
              <li key={index}>
                <img className="mr10" src={genieIcons?.tickBullet} />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      );

    case "payment-card":
      return (
        <div className="payment-card">
          <div className="header">{content.header}</div>
          <div>
            {content.cards?.map((item, index) => (
              <div key={index} className="card-details">
                <div>
                  <div className="name">{item.name}</div>
                  <div className="date">{item.date}</div>
                </div>
                <div
                  className={`btn ${item.button
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {item.button}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "amount-details":
      return (
        <div className="amount-details">
          <div className="header">{content.header}</div>
          <div className="number-input">
            $ <input type="number" value={content.defaultValue} />
            <div></div>
          </div>
          <div className="amount-dec">{content.description}</div>
        </div>
      );

    case "token-usage-overview":
      return (
        <div className={content.className || ""}>
          <div className="billing-progress my20">
            <div className="token-dashboard__progress-bar">
              <div className="token-dashboard__progress-fill"></div>
            </div>
            <div className="token-dashboard__progress mt0">
              <small>{content.progressText}</small>
              <span>{content.percentage}%</span>
            </div>
          </div>
        </div>
      );

    case "empty":
      return <div></div>;

    default:
      return content;
  }
};

const Billings = () => {
  const AuditData = [
    {
      id: 1,
      feature: "Text generation",
      tokenused: "25K",
      estimatecost: "0.5",
      fullTimestamp: "Jun 27, 2025, 10:20 AM",
    },
    {
      id: 2,
      feature: "Data analysis",
      tokenused: "10K",
      estimatecost: "0.75",
      fullTimestamp: "Jun 27, 2025, 10:20 AM",
    },
    {
      id: 3,
      feature: "Image processing",
      tokenused: "25K",
      estimatecost: "1",
      fullTimestamp: "Jun 27, 2025, 10:20 AM",
    },
    {
      id: 4,
      feature: "Text generation",
      tokenused: "50K",
      estimatecost: "0.75",
      fullTimestamp: "Jun 27, 2025, 10:20 AM",
    },
    {
      id: 5,
      feature: "Image processing",
      tokenused: "50K",
      estimatecost: "0.5",
      fullTimestamp: "Jun 27, 2025, 10:20 AM",
    },
  ];
  // Prepare grid data
  const gridData = AuditData?.map((item) => ({
    feature: item.feature,
    tokenused: item.tokenused,
    estimatecost: item.estimatecost,
    fullTimestamp: item.fullTimestamp,
  }));

  // Define grid columns
  const columnData = [
    {
      field: "fullTimestamp",
      title: "Date & time",
      cell: (props) => (
        <td>
          <RSTooltip
            text={props.dataItem.fullTimestamp}
            position="top"
            className="d-inline-block"
            innerContent={false}
            tooltipOverlayClass="toolTipOverlayZindexCSS"
          >
            <div className="audit-log__timestamp">
              {props.dataItem.fullTimestamp}
            </div>
          </RSTooltip>
        </td>
      ),
    },
    {
      field: "feature",
      title: "Feature",
      cell: (props) => <td>{props.dataItem.feature}</td>,
    },
    {
      field: "tokenused",
      title: "Token used",
      cell: (props) => (
        <td className="text-right">{props.dataItem.tokenused}</td>
      ),
    },
    {
      field: "estimatecost",
      title: "Estimate cost (USD)",
      width: 190,
      cell: (props) => (
        <td className="text-right">${props.dataItem.estimatecost}</td>
      ),
    },
  ];
  const AuditData1 = [
    {
      id: 1,
      invoicenumber: "000008-0016/22-23",
      invoicedate: "Wed, May 28, 2025",
      amount: "10",
      paymentmode: "Invoice",
      status: "Not Paid",
      duedate: "Tue, Jun 24, 2025",
      action: "",
    },
    {
      id: 2,
      invoicenumber: "000008-046/22-23",
      invoicedate: "Wed, May 28, 2025	",
      amount: "20",
      paymentmode: "Credit card",
      status: "Paid",
      duedate: "Tue, Jun 24, 2025",
      action: "",
    },
    {
      id: 3,
      invoicenumber: "000008-0011/22-23",
      invoicedate: "Sun, May 18, 2025",
      amount: "10",
      paymentmode: "Invoice",
      status: "Paid",
      duedate: "Mon, Jun 23, 2025",
      action: "",
    },
    {
      id: 4,
      invoicenumber: "000008-0041/22-23",
      invoicedate: "Wed, May 28, 2025",
      amount: "10",
      paymentmode: "Credit card",
      status: "Paid",
      duedate: "Sun, Jun 22, 2025",
      action: "",
    },
    {
      id: 5,
      invoicenumber: "000008-0041/22-23",
      invoicedate: "Thu, May 8, 2025",
      amount: "10",
      paymentmode: "Credit card",
      status: "Not Paid",
      duedate: "Sun, Jun 22, 2025",
      action: "",
    },
  ];
  // Prepare grid data
  const gridData1 = AuditData1?.map((item) => ({
    invoicenumber: item.invoicenumber,
    invoicedate: item.invoicedate,
    amount: item.amount,
    paymentmode: item.paymentmode,
    status: item.status,
    duedate: item.duedate,
    action: item.action,
  }));

  // Define grid columns
  const columnData1 = [
    {
      field: "invoicenumber",
      title: "Invoice number",
      width: 180,
      cell: (props) => (
        <td>
          <RSTooltip
            text={props.dataItem.invoicenumber}
            position="top"
            className="d-inline-block"
            innerContent={false}
            tooltipOverlayClass="toolTipOverlayZindexCSS"
          >
            <div className="audit-log__timestamp">
              {props.dataItem.invoicenumber}
            </div>
          </RSTooltip>
        </td>
      ),
    },
    {
      field: "invoicedate",
      title: "Invoice date",
      cell: (props) => <td>{props.dataItem.invoicedate}</td>,
    },
    {
      field: "amount",
      title: "Amount (USD)",
      cell: (props) => <td className="text-right">${props.dataItem.amount}</td>,
    },
    {
      field: "paymentmode",
      title: "Payment mode",
      cell: (props) => <td>{props.dataItem.paymentmode}</td>,
    },
    {
      field: "status",
      title: "Status",
      cell: (props) => <td>{props.dataItem.status}</td>,
    },
    {
      field: "duedate",
      title: "Due date",
      cell: (props) => <td>{props.dataItem.duedate}</td>,
    },
    {
      field: "action",
      title: "Action",
      width: 90,
      cell: (props) => (
        <td>
          <ul className="rs-list-inline rli-space-15">
            <li>
              <RSTooltip text="View" position="top">
                <i
                  className={`${icons.eye_medium} icon-md color-primary-blue`}
                ></i>
              </RSTooltip>
            </li>
            <li>
              <RSTooltip text="Download invoice" position="top">
                <i
                  className={`${icons.download_medium} icon-md color-primary-blue`}
                ></i>
              </RSTooltip>
            </li>
          </ul>
        </td>
      ),
    },
  ];
  const dashboardData = useMemo(
    () => ({
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
    }),
    []
  );
  const CHART_CONFIG = {
    HEIGHT: 250,
    TICK_INTERVAL: 0.7,
    POINT_WIDTH: 27,
  };
  // Chart data configuration
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
        categories: dashboardData.usageByFeature.map((item) => item.name),
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
          data: dashboardData.usageByFeature.map((item) => ({
            y: item.value / 1000000,
            color: item.color,
          })),
        },
      ],
    }),
    [dashboardData.usageByFeature]
  );
  const cardDetails = [
    {
      name: "Visa ending in 4242",
      date: "12/2025",
      button: "Default",
    },
    {
      name: "Mastercard ending in 5555",
      date: "06/2026",
      button: "Set as default",
    },
  ];
  const pageData = {
    isHeader: [
      {
        headerTitle: "Billing & Usage",
        headerSubTitle:
          "Manage your subscription, view token usage, and access billing history.",
      },
    ],
    mainSection: [
      {
        title: "Current plan",
        subtitle: "You are currently on the pro tier.",
        mainContent: {
          type: "billing-card",
          price: "$49",
          period: "/month",
          tokenUsage: "5,000,000 tokens/month",
          features: [
            "Advanced AI models",
            "Priority support",
            "Higher API rate limits",
          ],
        },
        isbutton: true,
        buttonText: "Manage subscription",
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
        title: "Manage payments",
        subtitle: "Update payment methods and add more tokens",
        mainContent: {
          type: "payment-card",
          header: "Payment methods",
          cards: cardDetails,
        },
        isbutton: true,
        buttonText: "Add new payment method",
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
        title: "Manage top-up",
        subtitle: "Update payment methods and add more tokens.",
        mainContent: {
          type: "amount-details",
          header: "Amount (USD)",
          defaultValue: 10,
          description:
            "Tokens will be added to your account immediately after successful payment.",
        },
        isbutton: true,
        buttonText: "Purchase tokens",
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
        title: "Token usage overview",
        subtitle: "Monitor your monthly token consumption by feature.",
        mainContent: {
          type: "token-usage-overview",
          progressText: "3.3M / 5M token used",
          percentage: 65,
          className: "",
        },
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
      {
        title: (
          <div className="opacity-0">
            <div>Token usage overview</div>
          </div>
        ),
        subtitle: (
          <div className="opacity-0">
            <div>Monitor your monthly token consumption by feature.</div>
          </div>
        ),
        mainContent: {
          type: "token-usage-overview",
          progressText: "3.3M / 5M token used",
          percentage: 65,
          chartOptions: chartData,
          className: "opacity-0",
        },
        isbutton: false,
        isGrid: false,
        gridData: [],
        columnData: [],
        isSearch: false,
        isfooter: false,
        footerText: "",
        chart: true,
        chartData: chartData,
        chartOptions: false,
        subMainSection: [],
        colValue: false,
      },
    ],
    mainSection2: [
      {
        title: "Detailed usage breakdown",
        subtitle: "see where your tokens are being spent in more detail.",
        mainContent: {
          type: "empty",
        },
        isbutton: false,
        isGrid: true,
        gridData: gridData,
        columnData: columnData,
        isSearch: true,
        isfooter: true,
        footerText: "Individual user token usage details",
        chart: false,
        chartData: [],
        chartOptions: [],
        subMainSection: [],
        colValue: false,
      },
    ],
    mainSection3: [
      {
        title: "Billing History",
        subtitle: "Access your past invoices.",
        mainContent: {
          type: "empty",
        },
        isbutton: false,
        isGrid: true,
        gridData: gridData1,
        columnData: columnData1,
        isSearch: true,
        isfooter: true,
        footerText: "Individual user token usage details",
        chart: false,
        chartData: [],
        chartOptions: [],
        subMainSection: [],
        colValue: false,
      },
    ],
  };
  return (
    <div>
      <SettingsLayout pageData={pageData} renderContent={renderContent} />
    </div>
  );
};

export default Billings;
