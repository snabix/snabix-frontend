import { useCallback, useRef } from "react";

type MutationThrottleOptions = {
  intervalMs?: number;
};

type MutationThrottleResult<T> =
  | { started: false }
  | { started: true; value: T };

const DEFAULT_MUTATION_THROTTLE_MS = 700;

export function useMutationThrottle({
  intervalMs = DEFAULT_MUTATION_THROTTLE_MS,
}: MutationThrottleOptions = {}) {
  const activeKeysRef = useRef<Set<string>>(new Set());
  const lastStartedAtRef = useRef<Map<string, number>>(new Map());

  return useCallback(async <T>(
    key: string,
    action: () => Promise<T>,
  ): Promise<MutationThrottleResult<T>> => {
    const now = Date.now();
    const lastStartedAt = lastStartedAtRef.current.get(key) ?? 0;

    if (activeKeysRef.current.has(key) || now - lastStartedAt < intervalMs) {
      return { started: false };
    }

    activeKeysRef.current.add(key);
    lastStartedAtRef.current.set(key, now);

    try {
      return {
        started: true,
        value: await action(),
      };
    } finally {
      activeKeysRef.current.delete(key);
    }
  }, [intervalMs]);
}
