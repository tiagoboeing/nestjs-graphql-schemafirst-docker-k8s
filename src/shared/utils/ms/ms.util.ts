import ms from 'ms';

/**
 * Convert a value from milliseconds to seconds.
 * @param milliseconds `1h`, `1d`, `1w`...
 * @returns values in seconds
 * @note based on `ms` package
 * @link https://github.com/vercel/ms
 */
export const millisecondsToSeconds = (milliseconds: string | number): number =>
  ms(`${milliseconds}`) / 1000;
