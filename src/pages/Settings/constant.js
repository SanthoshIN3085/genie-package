// import * as func from 'Constants/Charts/commonFunction';
// import * as colors from 'Constants/GlobalConstant/Colors';
// import * as icons from 'Constants/GlobalConstant/Glyphicons';
// import _get from 'lodash/get';
// import * as sectors from 'Constants/Sectors';
// import { getDomainName } from 'Utils/index';
// import { identity } from 'lodash';
import { SETTINGS } from "../../constant/textConstants";

export const Settings_SECTIONS = {
  HOME: "home",
  USAGE: "usage",
  BILLING: "billing",
  LIMITS: "limits",
  DASHBOARD: "dashboard",
  TOKEN_USAGE: "token_usage",
  TOKEN_MANAGEMENT: "token_management",
  NOTIFICATION: "notification",
  AUDIT_LOG: "audit_log",
  ALERTS: "alerts",
};
// const { campaignName1, campaignName2, campaignName3, campaignName19, campaignName17, campaignName15, campaignName16 } =
//     _get(sectors, getDomainName, 'banking');
// data augment
export const dataAgument = {
  // height: func.chartSizing['area'],
  // xAxis: {
  //     title: '',
  // },
  // yAxis: {
  //     title: ' ',
  // },
  // categories: func.dateOffsetByMonths(12, new Date(), 'MMM').reverse(),
  // series: [
  //     {
  //         name: 'Prompt',
  //         data: [10, 30, 23, 57, 61, 9, 33, 24, 58, 46, 58, 69],
  //         color: colors.ch_color1,
  //     },
  // ],
};

//Create segment
export const createSegment = {
  // name: 'Create segment',
  // height: 351,
  // dataLabels: {
  //     enabled: true,
  //     useHTML: true,
  //     connectorWidth: 1,
  // },
  // series: [
  //     { name: 'X followers', y: 6, z: 6, icon: icons.notification_medium },
  //     { name: 'Email subscribers', y: 7, z: 7, icon: icons.email_medium, color: colors.ch_color1 },
  //     { name: 'QR code scanners', y: 12, z: 12, icon: icons.qrcode_medium },
  //     { name: 'Facebook audience', y: 20, z: 20, icon: icons.social_facebook_medium },
  //     { name: 'Notifications users', y: 40, z: 40, icon: icons.notification_medium, color: colors.ch_color2 },
  // ],
};

export const communicationCreation = {
  // height: func.chartSizing['column'],
  // categories: [campaignName1, campaignName2, campaignName3, campaignName19],
  // xAxis: {
  //     title: '',
  // },
  // yAxis: {
  //     title: '',
  // },
  // tooltip: {
  //     shared: true,
  // },
  // pointWidth: 16,
  // series: [
  //     { name: 'Email', data: [180, 130, 165, 96], color: colors.ch_color2 },
  //     {
  //         name: 'Notifications',
  //         data: [135, 69, 124, 43],
  //         color: colors.ch_color1,
  //     },
  // ],
};

export const contentCreation = {
  // height: func.chartSizing['column'],
  // categories: [campaignName17, campaignName2, campaignName15, campaignName16],
  // xAxis: {
  //     title: '',
  // },
  // yAxis: {
  //     title: '',
  // },
  // tooltip: {
  //     shared: true,
  // },
  // pointWidth: 16,
  // series: [{ name: 'Email', data: [180, 130, 165, 96], color: colors.ch_color1 }],
};

export const totalSpend = {
  // height: func.chartSizing['pie'],
  // xAxis: {
  //     title: '',
  //     tickInterval: 0,
  // },
  // yAxis: {
  //     title: '',
  // },
  // legend: {
  //     reversed: false,
  // },
  // categories: func.daysCount(7),
  // series: [
  //     { name: 'Data augment', data: [60, 105, 55, 120, 80, 70, 160] },
  //     { name: 'Create segment', data: [40, 90, 35, 100, 60, 50, 140] },
  //     { name: 'Communication creation', data: [106, 107, 111, 133, 121, 167, 166] },
  //     { name: 'Content generation', data: [20, 17, 56, 77, 91, 10, 30] },
  // ],
};

export const BILLING_SIDEBAR = [
  {
    name: SETTINGS.BILLING_SIDEBAR[0].NAME,
  },
  {
    name: SETTINGS.BILLING_SIDEBAR[1].NAME,
  },
  {
    name: SETTINGS.BILLING_SIDEBAR[2].NAME,
  },
  // {
  //     name: 'Credit grants',
  // },
  // {
  //     name: 'Preferences',
  // },
];
