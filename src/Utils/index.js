import MasterData from "../constant/GlobalConstant/MasterData/MasterData";
import _get from "lodash/get";
import _find from "lodash/find";
import _isEmpty from "lodash/isEmpty";
import _forEach from "lodash/forEach";
import _cloneDeep from "lodash/cloneDeep";
import moment from "moment";
import { NUMBER_WITH_COMMA_REGEX } from "../constant/GlobalConstant/Regex";

export const isMacBook13Inch = () => {
  const userAgent = navigator.userAgent;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;

  const isMac = /Mac/.test(userAgent);

  const is13InchResolution =
    (screenWidth === 1280 && screenHeight === 800) ||
    (screenWidth === 1440 && screenHeight === 900) ||
    (screenWidth === 2560 && screenHeight === 1600) ||
    (screenWidth === 1680 && screenHeight === 1050);

  return isMac && is13InchResolution;
};

export const truncateTitle = (content, number = 15) => {
  return content?.length > number
    ? `${content?.substring(0, number)}...`
    : content;
};

// Simple decryption function (placeholder - replace with actual implementation)
const decryptWithAES = (text) => {
  try {
    // For now, just return the text as-is
    // In a real implementation, you would decrypt the AES encrypted text
    return text;
  } catch (err) {
    return null;
  }
};

export const getUserDetails = () => {
  try {
    const user = localStorage.getItem("userInfo") || "{}";
    const decryptUser = decryptWithAES(user) || "{}";
    return JSON.parse(decryptUser);
  } catch (err) {
    return {};
  }
};

export const numberWithCommas = (x) => {
  return x?.toString()?.replace(NUMBER_WITH_COMMA_REGEX, ",");
};

// Helper function to format date view
const getViewFormat = (dateFormat, date) => {
  try {
    return date.format(dateFormat);
  } catch (err) {
    return date.format("MM/DD/YYYY");
  }
};

export const getUserDateTimeFormat = (date = new Date(), type = "date") => {
  const { timeFormatId, dateFormatId, timeZoneId } = getUserDetails();
  let { timeZoneList, timeFormatList, dateFormatList } = MasterData;
  dateFormatList = _find(dateFormatList, ["dateFormatID", dateFormatId || 4]); // Default to format 4
  timeZoneList = _find(timeZoneList, ["timeZoneID", timeZoneId || 1]);
  timeFormatList = _find(timeFormatList, ["timeFormatID", timeFormatId || 1]);
  const tempDate = moment(date);
  if (tempDate.isValid()) {
    const timeFormat =
      timeFormatList?.timeformat === "12 hours" ? "hh:mm A" : "HH:mm";
    switch (type) {
      case "date":
        return tempDate.format(dateFormatList?.dateformat);
      case "time":
        return tempDate.format(timeFormat);
      case "datetime":
        return tempDate.format(dateFormatList?.dateformat + " " + timeFormat);
      case "formatDateTime":
        return (
          getViewFormat(dateFormatList?.dateformat, tempDate) +
          " " +
          tempDate?.format(timeFormat)
        );
      case "formatDate":
        return getViewFormat(dateFormatList?.dateformat, tempDate);
      case "chatDateTime":
        // Specific format for chat messages: "Mon, Jul 07, 2025 04:50 PM"
        return tempDate.format("ddd, MMM DD, YYYY hh:mm A");
      default:
        return tempDate.format(dateFormatList?.dateformat);
    }
  } else return "";
};

export function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const chartFormatNumber = (value) => {
  if (value >= 1e6) {
    const formatted = (value / 1e6).toFixed(1);
    return formatted.endsWith(".0")
      ? formatted.slice(0, -2) + "m"
      : formatted + "m";
  } else if (value >= 1e3) {
    const formatted = (value / 1e3).toFixed(1);
    return formatted.endsWith(".0")
      ? formatted.slice(0, -2) + "k"
      : formatted + "k";
  }
  return value.toString();
};

export function _isObject(objValue) {
  return (
    objValue && typeof objValue === "object" && objValue.constructor === Object
  );
}

export const formatNumber = (n) => {
  if (n >= 1000000000000) {
    return (n / 1000000000000).toFixed(0) + "T";
  } else if (n >= 100000000000) {
    return (n / 1000000000).toFixed(0) + "B";
  } else if (n >= 10000000000) {
    return (n / 1000000000).toFixed(0) + "B";
  } else if (n >= 1000000000) {
    return (n / 1000000000).toFixed(1) + "B";
  } else if (n >= 100000000) {
    return (n / 1000000).toFixed(0) + "M";
  } else if (n >= 10000000) {
    return (n / 1000000).toFixed(0) + "M";
  } else if (n >= 1000000) {
    return (n / 1000000).toFixed(1) + "M";
  } else if (n >= 100000) {
    return (n / 1000).toFixed(0) + "K";
  } else if (n >= 1000) {
    return (n / 1000).toFixed(1) + "K";
  } else {
    return String(n);
  }
};
