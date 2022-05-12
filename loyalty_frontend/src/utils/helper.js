/* eslint-disable no-empty */
import validator from 'validator';

import { sprintf } from 'sprintf';

export function escapeSpecialUnicodeCharacters(str) {
  let rtn = str.replace('\u202A', '');
  rtn = rtn.replace('\u202C', '');
  return rtn;
}

export function isPhoneNumber(phoneNumber) {
  if (!validator.isMobilePhone(phoneNumber.replace('+', ''))) {
    return false;
  }
  return true;
}

export function buildCommaSeparatedString(arr) {
  let rtn = '';
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== undefined && arr[i].trim().length > 0) {
      if (rtn.length > 0) {
        rtn += ', ';
      }
      rtn += arr[i].trim();
    }
  }
  return rtn;
}

export function convertUTCToLocalDate(date) {
  if (!date) {
    return date;
  }
  date = new Date(date);
  date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return date;
}

export function convertLocalToUTCDate(date) {
  if (!date) {
    return date;
  }
  date = new Date(date);
  date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  return date;
}

export function getDefaultDateTime() {
  const today = new Date();
  const strDateTime = sprintf('%04d-%02d-%02dT12:00:00.000-07:00', today.getFullYear(), today.getMonth() + 1, today.getDate());
  return strDateTime;
}

export function convertToPlain(html) {
  const plainString = html.replace(/<[^>]+>/g, ' ');
  return plainString;
}