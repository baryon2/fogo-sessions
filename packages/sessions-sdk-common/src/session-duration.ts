const ONE_SECOND_IN_MS = 1000;
const ONE_MINUTE_IN_MS = 60 * ONE_SECOND_IN_MS;
const ONE_HOUR_IN_MS = 60 * ONE_MINUTE_IN_MS;
const ONE_DAY_IN_MS = 24 * ONE_HOUR_IN_MS;

export const DURATION = {
  '30-seconds': {
    label: '30 Seconds',
    value: 30 * ONE_SECOND_IN_MS,
  },
  'one-hour': {
    label: 'One Hour',
    value: ONE_HOUR_IN_MS,
  },
  'one-day': {
    label: 'One Day',
    value: ONE_DAY_IN_MS,
  },
  'one-week': {
    label: 'One Week',
    value: 7 * ONE_DAY_IN_MS,
  },
} as const;

export type DurationKey = keyof typeof DURATION;

export const getDurationValue = (duration: DurationKey): number => {
  return DURATION[duration].value;
};

export const getDurationLabel = (duration: DurationKey): string => {
  return DURATION[duration].label;
};

export const getAllDurations = () => DURATION;

export const getExpirationDate = (durationMs: number): Date => {
  return new Date(Date.now() + durationMs);
};

export const isExpired = (expiration: Date): boolean => {
  return expiration.getTime() < Date.now();
};

export const getTimeUntilExpiration = (expiration: Date): number => {
  return Math.max(0, expiration.getTime() - Date.now());
};