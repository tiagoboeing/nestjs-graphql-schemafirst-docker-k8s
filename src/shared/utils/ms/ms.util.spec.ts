import { millisecondsToSeconds } from './ms.util';

describe('Util "ms"', () => {
  describe('millisecondsToSeconds()', () => {
    describe('String inputs', () => {
      test('Hours', () => {
        expect(millisecondsToSeconds('1h')).toBe(3600);
        expect(millisecondsToSeconds('2h')).toBe(7200);
      });

      test('Days', () => {
        expect(millisecondsToSeconds('1d')).toBe(86400);
        expect(millisecondsToSeconds('2d')).toBe(172800);
        expect(millisecondsToSeconds('30d')).toBe(2592000);
        expect(millisecondsToSeconds('60d')).toBe(5184000);
      });

      test('Weeks', () => {
        expect(millisecondsToSeconds('1w')).toBe(604800);
        expect(millisecondsToSeconds('4w')).toBe(604800 * 4);
      });

      test('Years', () => {
        expect(millisecondsToSeconds('365d')).toBe(31536000);
      });
    });

    describe('Number inputs', () => {
      test('Hours', () => {
        expect(millisecondsToSeconds(3600000)).toBe(3600); // 1 hour
        expect(millisecondsToSeconds(7200000)).toBe(7200); // 2 hours
      });

      test('Days', () => {
        expect(millisecondsToSeconds(86400000)).toBe(86400); // 1 day
        expect(millisecondsToSeconds(172800000)).toBe(172800); // 2 days
        expect(millisecondsToSeconds(2592000000)).toBe(2592000); // 30 days
        expect(millisecondsToSeconds(5184000000)).toBe(5184000); // 60 days
      });

      test('Weeks', () => {
        expect(millisecondsToSeconds(604800000)).toBe(604800); // 1 week
        expect(millisecondsToSeconds(2419200000)).toBe(2419200); // 4 weeks
      });

      test('Years', () => {
        expect(millisecondsToSeconds(31536000000)).toBe(31536000);
      });
    });
  });
});
