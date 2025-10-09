import { useSessionLimits } from '../../hooks/use-session-limits';

describe('useSessionLimits re-export', () => {
  it('should re-export useSessionLimits from common package', () => {
    expect(useSessionLimits).toBeDefined();
    expect(typeof useSessionLimits).toBe('function');
  });
});