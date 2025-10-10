import { useCallback } from 'react';
import type { KeyedMutator } from 'swr';
import useSWR from 'swr';

export enum StateType {
  NotLoaded,
  Loading,
  Loaded,
  Error,
}

export type DataState<T> =
  | { type: StateType.NotLoaded; mutate: KeyedMutator<T> }
  | { type: StateType.Loading }
  | { type: StateType.Loaded; data: T; mutate: KeyedMutator<T> }
  | { type: StateType.Error; error: UseDataError; reset: () => void };

export class UseDataError extends Error {
  constructor(cause: unknown) {
    super(cause instanceof Error ? cause.message : '');
    this.name = 'UseDataError';
    this.cause = cause;
  }
}

/**
 * Enhanced SWR hook with standardized error handling and state management.
 *
 * This hook wraps the standard SWR hook to provide consistent state
 * representations and error handling across the SDK.
 */
export const useData = <T>(...args: Parameters<typeof useSWR<T>>): DataState<T> => {
  const { data, isLoading, mutate, ...rest } = useSWR(...args);

  const error = rest.error as unknown;

  const reset = useCallback(() => {
    mutate(undefined).catch((resetError: unknown) => {
      console.error('Failed to reset data', resetError);
    });
  }, [mutate]);

  if (error) {
    console.error('Data fetch failed:', error);
    return {
      type: StateType.Error,
      error: new UseDataError(error),
      reset,
    };
  } else if (isLoading) {
    return { type: StateType.Loading };
  } else if (data) {
    return {
      type: StateType.Loaded,
      data,
      mutate,
    };
  } else {
    return {
      type: StateType.NotLoaded,
      mutate,
    };
  }
};