import { useEffect, useState } from 'react';
import { computeLiveStopClockMs } from '@/utils/stopClock';

export function useStopClockTick(
  frameStartedAt: string | null | undefined,
  stopClockFrameTimeInSeconds: number | undefined,
  startedTurnTime: string | null | undefined,
  stopClockTurnTimeInSeconds: number | undefined,
  // Defaults to real wall-clock time. Pass the YouTube video's real-world-equivalent time
  // (actualStartTimeDate + player.getCurrentTime()) for a video-embedded overlay, so the clock
  // only starts moving once the video itself reaches that point, instead of the instant the
  // live data (which is always ahead of the delayed video) arrives.
  referenceTimeMs?: number,
) {
  const now = referenceTimeMs ?? Date.now();

  const [tick, setTick] = useState(() =>
    computeLiveStopClockMs(frameStartedAt, stopClockFrameTimeInSeconds, startedTurnTime, stopClockTurnTimeInSeconds, now),
  );

  useEffect(() => {
    const currentNow = referenceTimeMs ?? Date.now();
    setTick(
      computeLiveStopClockMs(
        frameStartedAt,
        stopClockFrameTimeInSeconds,
        startedTurnTime,
        stopClockTurnTimeInSeconds,
        currentNow,
      ),
    );

    // Frame time ticks continuously once started, independent of whether the turn clock is
    // running — so keep the interval alive whenever either clock is actively counting down.
    const isFrameRunning = !!frameStartedAt && (referenceTimeMs === undefined || referenceTimeMs >= new Date(frameStartedAt).getTime());
    const isTurnRunning = !!startedTurnTime && (referenceTimeMs === undefined || referenceTimeMs >= new Date(startedTurnTime).getTime());
    if (!isFrameRunning && !isTurnRunning) return;

    // When a fixed referenceTimeMs is supplied (video-synced mode), don't free-run off
    // Date.now() — only recompute when the caller updates the reference (new effect run).
    if (referenceTimeMs !== undefined) return;

    const id = setInterval(
      () =>
        setTick(
          computeLiveStopClockMs(frameStartedAt, stopClockFrameTimeInSeconds, startedTurnTime, stopClockTurnTimeInSeconds),
        ),
      200,
    );
    return () => clearInterval(id);
  }, [frameStartedAt, stopClockFrameTimeInSeconds, startedTurnTime, stopClockTurnTimeInSeconds, referenceTimeMs]);

  return tick;
}
