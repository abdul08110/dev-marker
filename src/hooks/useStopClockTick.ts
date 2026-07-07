import { useEffect, useState } from 'react';
import { StopClockState } from '@/stores/types';
import { computeLiveStopClockMs } from '@/utils/stopClock';

export function useStopClockTick(stopClockState: StopClockState | null | undefined) {
  const [tick, setTick] = useState(() => computeLiveStopClockMs(stopClockState));

  useEffect(() => {
    setTick(computeLiveStopClockMs(stopClockState));

    if (!stopClockState || stopClockState.activePlayerClock !== 'RUNNING') return;

    const id = setInterval(() => setTick(computeLiveStopClockMs(stopClockState)), 200);
    return () => clearInterval(id);
  }, [stopClockState]);

  return tick;
}
