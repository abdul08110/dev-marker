import { useEffect, useState } from 'react';
import { StopClockState } from '@/stores/types';
import { computeLiveStopClockMs } from '@/utils/stopClock';

export function useStopClockTick(
  stopClockState: StopClockState | null | undefined,
  stopClockFrameTimeInSeconds?: number,
) {
  const [tick, setTick] = useState(() => computeLiveStopClockMs(stopClockState, stopClockFrameTimeInSeconds));

  useEffect(() => {
    setTick(computeLiveStopClockMs(stopClockState, stopClockFrameTimeInSeconds));

    if (!stopClockState) return;

    // Frame time ticks continuously once started, independent of whether the turn clock is
    // running — so keep the interval alive whenever either clock is actively counting down.
    const isFrameRunning = !!stopClockState.frameStartedAt;
    const isTurnRunning = stopClockState.activePlayerClock === 'RUNNING';
    if (!isFrameRunning && !isTurnRunning) return;

    const id = setInterval(() => setTick(computeLiveStopClockMs(stopClockState, stopClockFrameTimeInSeconds)), 200);
    return () => clearInterval(id);
  }, [stopClockState, stopClockFrameTimeInSeconds]);

  return tick;
}
