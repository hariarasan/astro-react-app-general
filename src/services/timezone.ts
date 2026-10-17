import moment from 'moment-timezone';

/**
 * Resolves the UTC offset (in hours, e.g. 5.5 for IST) that was in effect
 * at a given IANA timezone on a specific local date/time. Uses
 * moment-timezone's bundled tz database so it works correctly with
 * historical DST rules, independent of device Intl support.
 */
export function getUtcOffsetHours(
  ianaTimezone: string,
  dateOfBirth: Date,
  birthTime: Date,
): number {
  const dateStr = moment(dateOfBirth).format('YYYY-MM-DD');
  const timeStr = moment(birthTime).format('HH:mm:ss');
  const local = moment.tz(`${dateStr} ${timeStr}`, 'YYYY-MM-DD HH:mm:ss', ianaTimezone);
  // moment's utcOffset() returns minutes; convert to hours (can be fractional, e.g. 5.5)
  return local.utcOffset() / 60;
}

export function formatDateForApi(date: Date): string {
  return moment(date).format('YYYY-MM-DD');
}

export function formatTimeForApi(time: Date): string {
  return moment(time).format('HH:mm:ss');
}
