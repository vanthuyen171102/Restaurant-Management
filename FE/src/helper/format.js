import { number } from "prop-types";
import { GiLetterBomb } from "react-icons/gi";

export function formatIsoToDate(isoDateString) {
  let date = new Date(isoDateString);
  // Extract day, month, and year components
  let day = date.getDate();
  let month = date.getMonth() + 1; // Month is zero-based, so add 1
  let year = date.getFullYear();

  // Pad day and month with leading zeroes if necessary
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  // Construct the formatted date string in "dd-mm-yyyy" format
  let formattedDate = day + "-" + month + "-" + year;

  console.log(formattedDate);
  return formattedDate;
}

export function formatDateTime(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  const day = dateTime.getDate().toString().padStart(2, '0');
  const month = (dateTime.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const year = dateTime.getFullYear();
  const hours = dateTime.getHours().toString().padStart(2, '0');
  const minutes = dateTime.getMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function formatPhoneNumber(phoneNumber) {
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");

  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return match[1] + "." + match[2] + "." + match[3];
  }

  return phoneNumber;
}

export function formatCurrency(money) {
  const roundedMoney = Math.round(Number(money));

  return roundedMoney.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
export function convertMinsToHrsMins(minutes) {
  let h = Math.floor(minutes / 60);
  let m = minutes % 60;
  h = h < 10 ? '0' + h : h; 
  m = m < 10 ? '0' + m : m; 
  return h + ':' + m;
}

export function getTimeDifference(timeline) {
  const timeLine = new Date(timeline);
  const currentTime = new Date();
  const timeDifferenceInMins = Math.floor((currentTime - timeLine) / (1000 * 60)); // Chuyển đổi từ milliseconds sang phút
  return timeDifferenceInMins;
}


