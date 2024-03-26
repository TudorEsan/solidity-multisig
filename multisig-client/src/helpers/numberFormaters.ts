import { Utils } from "@pulsar.money/core";
import BigNumber from "bignumber.js";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears,
} from "date-fns";

/*
 * @param {Date | number} after
 * @return {string} - 1 minutes ago, 1 hour ago, 1 day ago, 1 month ago, 1 year ago
 */
export const getDateCompare = (after: Date | number) => {
  let date = after;
  if (typeof after === "number") {
    date = new Date(after * 1000);
  }

  const currDate = new Date();
  const compareInMinutes = differenceInMinutes(currDate, date);
  if (compareInMinutes < 1) {
    return `${differenceInSeconds(currDate, date)} seconds ago`;
  }
  if (compareInMinutes < 60) {
    return `${compareInMinutes} minutes ago`;
  }
  if (compareInMinutes < 60 * 24) {
    return `${differenceInHours(currDate, date)} hour(s) ago`;
  }
  if (compareInMinutes < 60 * 30 * 24) {
    return `${differenceInDays(currDate, date)} day(s) ago`;
  }
  if (compareInMinutes < 60 * 30 * 24 * 12) {
    return `${differenceInMonths(currDate, date)} month(s) ago`;
  }
  return `${differenceInYears(currDate, date)} year(s) ago`;
};

export function convertSecondsToFrequency(seconds: number): string {
  const minute = 60;
  const hour = 3600;
  const day = 86400;
  const month = 2629746; // Average length of a month in seconds (30.44 days)

  if (seconds < minute) {
    return `${seconds} second${seconds !== 1 ? "s" : ""}`;
  }
  if (seconds < hour) {
    const minutes = seconds / minute;
    return `${Math.round(minutes)} minute${minutes !== 1 ? "s" : ""}`;
  }
  if (seconds < day) {
    const hours = seconds / hour;
    return `${Math.round(hours)} hour${hours !== 1 ? "s" : ""}`;
  }
  if (seconds < month) {
    const days = seconds / day;
    return `${Math.round(days)} day${days !== 1 ? "s" : ""}`;
  }
  const months = seconds / month;
  return `${months.toFixed(1)} month${months !== 1 ? "s" : ""}`;
}

export function formatDateDiff(date1: Date, date2: Date) {
  // Calculate the difference in milliseconds
  const diff = date2.getTime() - date1.getTime();

  // If the difference is less than or equal to zero, return 'done'
  if (diff <= 0) {
    return "done";
  }

  // Calculate the time difference in various units
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30); // Approximation
  const years = Math.floor(days / 365); // Approximation

  // Return the largest non-zero unit
  if (years > 0) return `${years} years`;
  if (months > 0) return `${months} months`;
  if (days > 0) return `${days} days`;
  if (hours > 0) return `${hours} hours`;
  if (minutes > 0) return `${minutes} minutes`;
  if (seconds > 0) return `${seconds} seconds`;

  return "done";
}

export const usdFormater = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
};

export const numberFormater = (
  value: BigNumber | number | string,
  digits: number = 3
): string => {
  const bigValue = new BigNumber(value);
  let formattedValue = bigValue.toFixed(digits);

  // Add commas to the number
  formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Remove trailing zeros after the decimal point and the decimal point itself if not needed
  formattedValue = formattedValue.replace(/(\.\d*?[1-9])0+$/, "$1");
  formattedValue = formattedValue.replace(/\.$/, "");
  return formattedValue;
};

export const shortNumberFormater = (
  value: number | string | BigNumber
): string => {
  const bigValue = new BigNumber(value);

  if (bigValue.isLessThan(1000)) {
    return numberFormater(bigValue);
  }

  if (bigValue.isLessThan(1000000)) {
    return `${numberFormater(bigValue.dividedBy(1000), 1)}K`;
  }

  if (bigValue.isLessThan(1000000000)) {
    return `${numberFormater(bigValue.dividedBy(1000000), 1)}M`;
  }

  if (bigValue.isLessThan(1000000000000)) {
    return `${numberFormater(bigValue.dividedBy(1000000000), 1)}B`;
  }

  if (bigValue.isLessThan(1000000000000000)) {
    return `${numberFormater(bigValue.dividedBy(1000000000000), 1)}T`;
  }

  return `${numberFormater(bigValue.dividedBy(1000000000000000), 1)}Q`;
};

/**
 * Formats a number, string, or BigNumber to a maximum of 18 decimal places.
 * If the input has more than 18 decimal places, it will be rounded down.
 * If the input has less than or equal to 10 decimal places, no adjustment is made.
 * If the input has more than 10 but less than 19 decimal places, the last decimal is rounded down.
 *
 * @param number - The number, string, or BigNumber to be formatted.
 * @returns The formatted number as a string.
 */
export const maxNumberFormater = (number: string | number | BigNumber) => {
  // Ensure balance is treated as a BigNumber for precision
  const balance = new BigNumber(number);
  let balanceStr = Utils.Number.bigNumberToPrettyString(balance);

  // Find the index of the decimal point
  const decimalIndex = balanceStr.indexOf(".");
  // If there is no decimal point or not enough decimals, return the original input
  if (decimalIndex === -1 || balanceStr.length <= decimalIndex + 11) {
    return balanceStr; // No adjustment needed if <= 10 decimals
  }
  // Has more than 10 decimals, need to adjust
  if (balanceStr.length > decimalIndex + 19) {
    // More than 18 decimals, floor at 18th
    balanceStr = balanceStr.substring(0, decimalIndex + 19);
  } else {
    // More than 10 decimals but less than 19, floor the last decimal
    const cutIndex = balanceStr.length - 1;
    balanceStr = balanceStr.substring(0, cutIndex);
  }

  // Ensure not to round up the last digit by using BigNumber constructor
  return balanceStr;
};
