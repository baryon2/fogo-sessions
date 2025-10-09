import { useState, useCallback } from 'react';
import { getDurationValue, getDurationLabel, getAllDurations, type DurationKey } from '../session-duration.js';

/**
 * Hook for managing session duration selection
 */
export const useSessionDuration = (
  initialDuration: DurationKey = 'one-week'
) => {
  const [selectedDuration, setSelectedDuration] = useState<DurationKey>(initialDuration);

  const setDuration = useCallback((duration: DurationKey) => {
    setSelectedDuration(duration);
  }, []);

  return {
    selectedDuration,
    durationValue: getDurationValue(selectedDuration),
    durationLabel: getDurationLabel(selectedDuration),
    setDuration,
    availableDurations: getAllDurations(),
  };
};