import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import * as pcolors from "Constants/GlobalConstant/Colors";
import * as pfonts from "Constants/GlobalConstant/Fonts/Fonts";

import More from "highcharts/highcharts-more.js";
import VariablePie from "highcharts/modules/variable-pie.js";
import Funnel from "highcharts/modules/funnel.js";
import Sankey from "highcharts/modules/sankey.js";
import Map from "highcharts/modules/map";

More(Highcharts);
VariablePie(Highcharts);
Funnel(Highcharts);
Sankey(Highcharts);
Map(Highcharts);

// import printAny from "../HighChartDashboard/PrintAny";
// require("highcharts/highcharts-more.js")(Highcharts);
// require("highcharts/modules/variable-pie.js")(Highcharts);
// require("highcharts/modules/funnel.js")(Highcharts);
// require("highcharts/modules/sankey.js")(Highcharts);
// require("highcharts/modules/map")(Highcharts);

const NewCharts = (props) => {
  const [container, setContainer] = useState(React.createRef());

  useEffect(() => {
    // printAny("chart data", JSON.stringify(options))
    Highcharts.setOptions({
      lang: {
        thousandsSep: ",",
      },
    });
    let newChart = Highcharts["chart"](
      container.current,
      Highcharts.merge(
        props.id === 10011 ? commonOptions1 : commonOptions,
        props.options
      )
    );

    if (props.image) {
      newChart.renderer
        .image(
          props.image,
          props.style.x,
          props.style.y,
          props.style.width,
          props.style.height
        )
        .add();
    }

    return () => {
      newChart.destroy();
      newChart = null;
    };
  }, [props.options, container, props.width]);

  const chartStyle = {
    width: props.width,
    height: props.height ? props.height : "100%",
  };

  return (
    <>
      <div
        className={props.className ? props.className : null}
        style={chartStyle}
        ref={container}
      ></div>
    </>
  );
};
export default NewCharts;

const commonOptions = {
  colors: [
    pcolors.ch_color1,
    pcolors.ch_color2,
    pcolors.ch_color3,
    pcolors.ch_color4,
    pcolors.ch_color5,
    pcolors.ch_color6,
    pcolors.ch_color7,
    pcolors.ch_color8,
    pcolors.ch_color9,
  ],
  chart: {
    //marginRight: 5,
    //marginTop: 0,
    reflow: true,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    style: {
      fontFamily: pfonts.fontRegular,
      fontWeight: "normal",
      fontSize: pfonts.ch_chartSize,
      color: pcolors.chartColor,
    },
  },
  title: { text: null },
  subtitle: { text: null },
  credits: { enabled: false },
  exporting: { enabled: false },
  xAxis: {
    useHTML: true,
    align: "center",
    title: {
      style: { color: pcolors.titleColor, fontSize: pfonts.ch_titleSize },
    },
    startOnTick: false,
    tickmarkplacement: "on",
    //min: 0.5,
    minPadding: 0,
    maxPadding: 0,
    labels: {
      rotation: 0,
      style: { color: pcolors.labelColor, fontSize: pfonts.ch_labelSize },
    },
    lineWidth: 1,
    tickLength: 0,
  },
  yAxis: {
    title: {
      style: { color: pcolors.titleColor, fontSize: pfonts.ch_titleSize },
    },
    labels: {
      style: { color: pcolors.labelColor, fontSize: pfonts.ch_labelSize },
    },
    // tickInterval: 100,
    lineWidth: 1,
    gridLineDashStyle: "dash",
  },
  series: [
    {
      //backgroundColor: "rgba(0 ,0, 0, 1)",
    },
  ],

  // Plot options
  plotOptions: {
    series: {
      fillOpacity: 0.1,
      states: { hover: { enabled: true } },
    },
    // Pie chart options
    pie: {
      allowPointSelect: false,
      cursor: "default",
      dataLabels: {
        enabled: true,
        //useHTML: true,
        connectorShape: "crookedLine", // crookedLine, fixedOffset, straight
        crookDistance: "100%",
        //alignTo: '', // connectors, plotEdges
        formatter: function () {
          return (
            Highcharts.numberFormat(this.y, 0) +
            "<span class='pieDataLabelPercentage'>%</span>"
          );
        },
        style: {
          color: pcolors.chartColor,
          fontSize: pfonts.ch_pieLabelSize,
          fontFamily: pfonts.pieLabelFont,
          fontWeight: "normal",
          textShadow: "none",
          textOutline: false,
        },
        softConnector: false,
      },
      states: {
        inactive: { opacity: 1 },
        hover: { enabled: false },
      },
      showInLegend: false,
    },
    // Area chart options
    area: {
      stacking: "normal",
      lineWidth: 1,
      marker: {
        lineWidth: 2,
        symbol: "circle",
        fillColor: "white",
        radius: 3,
        lineColor: "#f68936",
        color: "#f68936",
      },
      legend: {
        useHTML: true,
        radius: 2,
      },
    },
    // Bar (Column) chart options
    column: {
      stacking: "normal",
      pointWidth: 15,
      pointPadding: 0,
      //groupPadding: 0.8,
      borderWidth: 0,
      dataLabels: {
        enabled: false,
        color:
          (Highcharts.theme && Highcharts.theme.dataLabelsColor) || "white",
        style: {
          textShadow: "none",
          textOutline: false,
        },
      },
    },
    // Line chart options
    line: {
      stacking: "normal",
      dataLabels: {
        enabled: false,
        style: {
          textShadow: "none",
          textOutline: false,
        },
      },
      legend: {
        useHTML: true,
        radius: 2,
      },
    },
    // pyramid
    pyramid: {
      states: {
        inactive: { opacity: 1 },
        hover: { enabled: false },
      },
    },
  },
  tooltip: {
    useHTML: true,
    shared: true,
    backgroundColor: pcolors.ch_secondary_black,
    borderWidth: 0,
    borderRadius: 10,
    shadow: false,
    style: {
      fontFamily: pfonts.primaryFont,
      fontSize: pfonts.ch_tooltipSize,
      fontWeight: "300",
      color: "#fefefe",
    },
  },
  legend: {
    y: 4, //10
    itemMarginTop: 2, // 15
    itemStyle: {
      fontWeight: "normal",
      fontSize: pfonts.ch_legendSize,
      color:
        pcolors.legendColor /*width: '60px', textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"*/,
    },
    marker: { symbol: "square", verticalAlign: "middle", radius: "4" },
    symbolHeight: 9,
    symbolWidth: 9,
    symbolRadius: 0,
    layout: "horizontal",
    align: "center",
    verticalAlign: "bottom",
  },
  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 500,
        },
        chartOptions: {
          chart: {
            height: 243,
          },
          subtitle: {
            text: null,
          },
          navigator: {
            enabled: false,
          },
        },
      },
    ],
  },
};

const commonOptions1 = {
  // colors: ['#f68936', '#70ba47', '#33b5e6', '#fd8f40', '#e7ca60', '#40abaf', '#f6f7f8', '#e9e9eb'],
  colors: [
    pcolors.ch_color1,
    pcolors.ch_color2,
    pcolors.ch_color3,
    pcolors.ch_color4,
    pcolors.ch_color5,
    pcolors.ch_color6,
    pcolors.ch_color7,
    pcolors.ch_color8,
    pcolors.ch_color9,
  ],
  chart: {
    //marginRight: 5,
    //marginTop: 0,
    reflow: true,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    style: {
      fontFamily: pfonts.fontRegular,
      fontWeight: "normal",
      fontSize: pfonts.ch_chartSize,
      color: pcolors.chartColor,
    },
  },
  title: { text: null },
  subtitle: { text: null },
  credits: { enabled: false },
  exporting: { enabled: false },
  xAxis: {
    useHTML: true,
    align: "center",
    title: {
      style: { color: pcolors.titleColor },
    },
    startOnTick: false,
    tickmarkplacement: "on",
    //min: 0.5,
    minPadding: 0,
    maxPadding: 0,
    labels: {
      rotation: 0,
      style: { color: pcolors.labelColor },
    },
    lineWidth: 1,
    tickLength: 0,
  },
  yAxis: {
    title: {
      style: { color: pcolors.titleColor },
    },
    labels: {
      style: { color: pcolors.labelColor },
    },
    // tickInterval: 100,
    lineWidth: 1,
    gridLineDashStyle: "dash",
  },
  series: [
    {
      //backgroundColor: "rgba(0 ,0, 0, 1)",
    },
  ],

  // Plot options
  plotOptions: {
    series: {
      fillOpacity: 1,
      states: {
        inactive: { opacity: 1 },
        hover: { enabled: false },
      },
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        enabled: true,
        useHTML: true,
        distance: -30,
        formatter: function () {
          if (this.point.name === "Email") {
            return '<div class="pitChartIcon pieIcon-email"><i class="icon-mail-xmedium icons-md white"></i></div>';
          }
          if (this.point.name === "SMS") {
            return '<div class="pitChartIcon pieIcon-mobile"><i class="icon-mobile-sms-xmedium icons-md white"></i></div>';
          }
          if (this.point.name === "Mobile push") {
            return '<div class="pitChartIcon pieIcon-facebook"><i class="icon-mobile-push-notification-xmedium icons-md white"></i></div>';
          }
          if (this.point.name === "Web push") {
            return '<div class="pitChartIcon pieIcon-googleplus"><i class="icon-social-web-notification-xmedium icons-md white"></i></div>';
          }
        },
        style: {
          color: "#424242",
          fontSize: pfonts.rsFontxsm,
          fontFamily: pfonts.fontRegular,
          fontWeight: "normal",
          textShadow: "none",
          textOutline: false,
        },
        softConnector: false,
      },
      showInLegend: false,
    },
  },
  tooltip: {
    useHTML: true,
    shared: true,
    backgroundColor: pcolors.tooltipBgColor,
    borderWidth: 0,
    borderRadius: 10,
    fontSize: pfonts.ch_tooltipSize,
    shadow: false,
    style: {
      fontFamily: pfonts.primaryFont,
      fontSize: pfonts.ch_tooltipSize,
      fontWeight: "300",
      color: "#fefefe",
    },
  },
  legend: {
    y: 10,
    itemMarginTop: 15,
    itemStyle: {
      fontWeight: "normal",
      fontSize: pfonts.ch_labelSize,
      color:
        pcolors.legendColor /*width: '60px', textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"*/,
    },
    marker: { symbol: "square", verticalAlign: "middle", radius: "4" },
    symbolHeight: 9,
    symbolWidth: 9,
    symbolRadius: 0,
  },
  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 500,
        },
        chartOptions: {
          chart: {
            height: 243,
          },
          subtitle: {
            text: null,
          },
          navigator: {
            enabled: false,
          },
        },
      },
    ],
  },
};
