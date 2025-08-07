import * as colors from '../../constant/GlobalConstant/Colors';
import Highcharts from 'highcharts';

import More from 'highcharts/highcharts-more';
import VariablePie from 'highcharts/modules/variable-pie.js';
import Funnel from 'highcharts/modules/funnel.js';
import Map from 'highcharts/modules/map';

More(Highcharts);
VariablePie(Highcharts);
Funnel(Highcharts);
Map(Highcharts);

// require("highcharts/highcharts-more.js")(Highcharts);
// require("highcharts/modules/variable-pie.js")(Highcharts);
// require("highcharts/modules/funnel.js")(Highcharts);
// require("highcharts/modules/funnel.js")(Highcharts);
// require("highcharts/modules/map")(Highcharts);

Highcharts.setOptions({
    lang: {
        thousandsSep: ',',
    },
});
export const COMMON_OPTIONS = {
    chart: {
        //marginRight: 5,
        //marginTop: 0,
        //   reflow: true,
        backgroundColor: 'rgba(255, 255, 255, 0)',
        style: {
            fontFamily: 'PoppinsRegular',
            fontWeight: 'normal',
            fontSize: colors.ch_legendtextSize,
            color: colors.ch_primary_grey,
        },
        height: 310,
    },

    title: { text: null },
    subtitle: { text: null },
    credits: { enabled: false },
    exporting: { enabled: false },
    xAxis: {
        useHTML: true,
        align: 'center',
        title: {
            style: {
                fontFamily: 'PoppinsRegular',
                color: colors.ch_primary_black,
            },
        },
        startOnTick: false,
        tickmarkplacement: 'on',
        //min: 0.5,
        minPadding: 0,
        maxPadding: 0,
        labels: {
            rotation: 0,
            style: {
                color: colors.ch_primary_black,
                fontSize: colors.ch_labletextSize,
            },
        },
        lineWidth: 1,
        tickLength: 0,
    },
    yAxis: {
        title: {
            style: {
                fontFamily: 'PoppinsRegular',
                color: colors.ch_primary_black,
            },
        },
        labels: {
            style: {
                color: colors.ch_primary_black,
                fontSize: colors.ch_labletextSize,
            },
        },
        // tickInterval: 100,
        lineWidth: 1,
        gridLineDashStyle: 'dash',
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
        },

        // pyramid chart option
        pyramid: {
            // series: {
            //   dataLabels: {
            //     enabled: true,
            //     format: '{point.name}',
            //     color: "#333",
            //     style: { color: colors.chartColorCode, fontSize: fonts.ch_labelSize, fontWeight: 'normal' }
            //   },
            //   center: ['35%', '50%'],
            //   width: '60%',
            //   height: '90%',
            // },
            series: {},
            states: {
                inactive: { opacity: 1 },
                hover: { enabled: false },
            },
            legend: {
                enabled: false,
            },
            responsive: {
                rules: [
                    {
                        condition: {
                            maxWidth: 400,
                        },
                        chartOptions: {
                            plotOptions: {
                                series: {
                                    'stroke-width': 10,
                                    dataLabels: {
                                        inside: true,
                                    },
                                    center: ['50%', '50%'],
                                    width: '100%',
                                },
                            },
                        },
                    },
                ],
            },
        },
        sankey: {},

        // Pie chart options
        pie: {
            // allowPointSelect: false,
            chart: {
                height: 240,
            },
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                //useHTML: true,
                connectorShape: 'crookedLine', // crookedLine, fixedOffset, straight
                crookDistance: '100%',
                style: {
                    color: colors.ch_primary_black,
                    fontSize: '20px',
                    fontFamily: 'PoppinsRegular',
                    fontWeight: '400',
                    textShadow: 'none',
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
            stacking: 'normal',
            lineWidth: 1,
            marker: { lineWidth: 2, symbol: 'circle', fillColor: 'white', radius: 4 },
            legend: { useHTML: true, radius: 2 },
            states: {
                inactive: { opacity: 1 },
                hover: { enabled: true },
            },
        },

        // Bar (Column) chart options
        column: {
            stacking: 'normal',
            pointWidth: 10,
            pointPadding: 0,
            //groupPadding: 0.8,
            borderWidth: 0,
            dataLabels: {
                enabled: false,
                //color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                style: {
                    textShadow: 'none',
                    textOutline: false,
                },
            },
        },

        // Line chart options
        line: {
            stacking: 'normal',
            dataLabels: {
                enabled: false,
                style: {
                    textShadow: 'none',
                    textOutline: false,
                },
            },
        },

        // Bubble chart options
        bubble: {
            chart: {
                animation: true,
                spacingTop: 0,
                spacingRight: 0,
                spacingBottom: 0,
                spacingLeft: 0,
                plotBorderWidth: 0,
                margin: [0, 0, 0, 0],
            },
        },

        // Polar chart options
        polar: {},
    },

    tooltip: {
        useHTML: true,
        shared: true,
        backgroundColor: colors.ch_secondary_black,
        borderWidth: 0,
        borderRadius: 10,
        shadow: false,
        style: {
            opacity: 1,
            fontFamily: 'PoppinsRegular',
            fontWeight: '300',
            color: '#fefefe',
        },
    },
    legend: {
        y: 10,
        // itemMarginTop: 15,
        itemStyle: {
            fontFamily: 'PoppinsRegular',
            fontWeight: 'normal',
            fontSize: colors.ch_legendtextSize,
            color: colors.ch_primary_black /*width: '60px', textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"*/,
        },
        marker: { symbol: 'square', verticalAlign: 'middle', radius: '5' },
        symbolHeight: 9,
        symbolWidth: 8,
        symbolRadius: 2,
    },
};

export default COMMON_OPTIONS;
