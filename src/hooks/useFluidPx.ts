import { useSyncExternalStore } from 'react';

const getFluidValue = (factor: number) => {
  if (typeof window === 'undefined') return 0;
  return Math.round(Math.min(window.innerHeight, window.innerWidth) * factor);
};

const subscribe = (callback: () => void) => {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
};

export function useFluidPx(factor: number): number {
  return useSyncExternalStore(
    subscribe,
    () => getFluidValue(factor),
    () => 0,
  );
}
