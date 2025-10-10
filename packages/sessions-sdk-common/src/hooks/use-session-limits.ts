import { useState, useCallback } from 'react';

/**
 * Hook for managing session limits state (apply limits toggle)
 */
export const useSessionLimits = (
  enableUnlimited?: boolean,
  isSessionUnlimited?: boolean
) => {
  const [applyLimits, setApplyLimits] = useState(
    !(isSessionUnlimited ?? enableUnlimited)
  );

  const toggleApplyLimits = useCallback((enabled: boolean) => {
    setApplyLimits(enabled);
  }, []);

  return {
    applyLimits,
    toggleApplyLimits,
    shouldShowLimitToggle: Boolean(enableUnlimited),
  };
};