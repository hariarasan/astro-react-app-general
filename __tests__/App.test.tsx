/**
 * Smoke tests for pure utility logic. A full render of <App /> pulls in
 * react-native-reanimated's native worklets runtime, which needs a real
 * device/simulator JS engine and isn't meaningful under plain Jest, so
 * these tests instead cover the framework-independent business logic.
 *
 * @format
 */

import { formatDisplayDate, formatYears } from '../src/utils/formatters';
import { getUtcOffsetHours } from '../src/services/timezone';

test('formatYears renders whole and fractional years', () => {
  expect(formatYears(15.9887)).toBe('16y');
  expect(formatYears(2)).toBe('2y');
  expect(formatYears(0.5)).toBe('6m');
});

test('formatDisplayDate renders a readable date', () => {
  expect(formatDisplayDate('1990-06-15')).toBe('15 Jun 1990');
});

test('getUtcOffsetHours resolves IST to +5.5', () => {
  const dob = new Date(1990, 5, 15);
  const time = new Date(2000, 0, 1, 14, 35, 0);
  expect(getUtcOffsetHours('Asia/Kolkata', dob, time)).toBeCloseTo(5.5, 5);
});
