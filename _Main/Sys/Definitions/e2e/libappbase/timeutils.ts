/* tslint:disable:only-arrow-functions */

import { DateTimeSelector } from '../e2elib/lib/src/pageobjects/datetimeselector.component';
import { protractor } from '../e2elib/node_modules/protractor/built/ptor';

export enum MinMaxDateStrValue {
  MaxDateStr = 'Dec-31-9999 00:00:00',
  MinDateStr = 'Jan-1-0001 00:00:00',
}

export enum Month {
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
}

/**
 * A helper function to compare an expected date with the date in a date time selector.
 * @param expectedDate Expected date to be compared with the values from date time selector.
 * @param dateTimeSelector Date time selector component.
 * @param requireFeedback [Optional] Defaults to false. Set to true if requires feedback.
 * @returns Promise of `boolean`. If `requireFeedback` is true, will return `[boolean | string]`.
 */
export async function compareDateFromDateTimeSelector(expectedDate: Date, dateTimeSelector: DateTimeSelector, requireFeedback?: false): Promise<boolean>;

/**
 * A helper function to compare an expected date with the date in a date time selector.
 * @param expectedDate Expected date to be compared with the values from date time selector.
 * @param dateTimeSelector Date time selector component.
 * @param requireFeedback [Optional] Defaults to false. Set to true if requires feedback.
 * @returns `Promise<boolean>`. If `requireFeedback` is true, will return `Promise<[boolean | string]>`.
 */
export async function compareDateFromDateTimeSelector(expectedDate: Date, dateTimeSelector: DateTimeSelector, requireFeedback?: true): Promise<[boolean, string]>;

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export async function compareDateFromDateTimeSelector(
  expectedDate: Date,
  dateTimeSelector: DateTimeSelector,
  requireFeedback: boolean = false,
): Promise<boolean | [boolean, string]> {
  const [expectedDay, expectedMonth, expectedYear] = [expectedDate.getDate(), expectedDate.toLocaleString(undefined, { month: 'short' }), expectedDate.getFullYear()];
  const [actualDayStr, actualMonth, actualYear] = await protractor.promise.all([dateTimeSelector.getDay(), dateTimeSelector.getMonth(), dateTimeSelector.getYear()]);
  const actualDay = Number(actualDayStr);
  const isMatch = expectedDay === actualDay && expectedMonth === actualMonth && expectedYear === Number(actualYear);
  if (requireFeedback) {
    const feedback = `Expected date should be ${expectedDay}-${expectedMonth}-${expectedYear}, but actual date is ${actualDay}-${actualMonth}-${actualYear}`;
    return [isMatch, feedback];
  }
  return isMatch;
}

/**
 *  Convert date to UTC
 *
 * @param date The date object to be converted to UTC
 */
export const convertDateToUTC = (date: Date): Date => {
  const millisec = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());

  return new Date(millisec);
};

/**
 * Current Year
 */
export const currentYear = '2020';

/**
 * Get the days different between 2 dates
 *
 * @param startDate start date value in Date object
 * @param endDate end date value in Date object
 * @returns Day difference in number
 */
export const getDayDifference = (startDate: Date, endDate: Date): number => {
  const diff = Math.abs(endDate.valueOf() - startDate.valueOf());
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24));

  return diffDays;
};

/**
 * Get the monday date of pass-in date
 *
 * @param date target date
 */
export const getMonday = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};

/**
 * Get date value from date time value
 *
 * @param dateTime DateTime value in string type
 * @returns Date value
 */
export const getDateFromDateTime = (dateTime: string): Date => {
  const dateTimeArray = dateTime.split(' ');
  const dateInString = dateTimeArray[0];
  const date = new Date(dateInString);
  return date;
};

/* For a given date, get the ISO week number
 *
 * Algorithm is to find nearest thursday, it's year
 * is the year of the week number. Then get weeks
 * between that date and the first day of that year.
 *
 * Note that dates in one year can be weeks of previous
 * or next year, overlap is up to 3 days.
 *
 * e.g. 2014/12/29 is Monday in week  1 of 2015
 *      2012/1/1   is Sunday in week 52 of 2011
 */
export const getWeekNumber = (date: Date): number => {
  let d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

/**
 * Get Min / Max date value in Date object
 */
export const maxDate = new Date(MinMaxDateStrValue.MaxDateStr);
export const minDate = new Date(Date.UTC(0, 0));

/**
 * To verify pass-in date value (in string) is finite date or infinite date
 *
 * @param dateInString Date value in string to do verification
 * @return boolean to indicate pass-in date value in string is finite (true) or infinite (false)
 */
export const verifyIsDateFinite = (dateInString: string): boolean => dateInString !== MinMaxDateStrValue.MaxDateStr && dateInString !== MinMaxDateStrValue.MinDateStr;
