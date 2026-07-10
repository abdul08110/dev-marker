import { useEffect, useState } from 'react';
import { computeLiveStopClockMs } from '@/utils/stopClock';

export function useStopClockTick(
  frameClockStartedAt: string | null | undefined,
  frameClockElapsedMs: number | undefined,
  stopClockFrameTimeInSeconds: number | undefined,
  startedTurnTime: string | null | undefined,
  stopClockTurnTimeInSeconds: number | undefined,
  // Both independently default to real wall-clock time. Pass the YouTube video's
  // real-world-equivalent time (actualStartTimeDate + player.getCurrentTime()) for a
  // video-embedded overlay, so each clock only starts moving once the video itself reaches that
  // point. These must stay separate — the turn reference is often CAPPED at stopClockEndedAt (a
  // fixed, non-advancing timestamp, so the turn clock freezes correctly once stopped), and that
  // fixed value must never be used (directly, or as a fallback) for frame's "now" — it would make
  // frame look permanently stuck.
  frameReferenceTimeMs?: number,
  turnReferenceTimeMs?: number,
) {
  const [tick, setTick] = useState(() =>
    computeLiveStopClockMs(
      frameClockStartedAt,
      frameClockElapsedMs,
      stopClockFrameTimeInSeconds,
      startedTurnTime,
      stopClockTurnTimeInSeconds,
      turnReferenceTimeMs ?? Date.now(),
      frameReferenceTimeMs ?? Date.now(),
    ),
  );

  useEffect(() => {
    setTick(
      computeLiveStopClockMs(
        frameClockStartedAt,
        frameClockElapsedMs,
        stopClockFrameTimeInSeconds,
        startedTurnTime,
        stopClockTurnTimeInSeconds,
        turnReferenceTimeMs ?? Date.now(),
        frameReferenceTimeMs ?? Date.now(),
      ),
    );

    // Frame time ticks continuously while running, independent of whether the turn clock is
    // running — so keep the interval alive whenever either clock is actively counting down.
    const isFrameRunning =
      !!frameClockStartedAt &&
      (frameReferenceTimeMs === undefined || frameReferenceTimeMs >= new Date(frameClockStartedAt).getTime());
    const isTurnRunning =
      !!startedTurnTime &&
      (turnReferenceTimeMs === undefined || turnReferenceTimeMs >= new Date(startedTurnTime).getTime());
    if (!isFrameRunning && !isTurnRunning) return;

    // When a fixed reference is supplied for BOTH clocks (fully video-synced mode), don't
    // free-run off Date.now() — only recompute when the caller updates the reference (new
    // effect run). If only one is fixed (or neither), the other still needs its own live interval.
    if (frameReferenceTimeMs !== undefined && turnReferenceTimeMs !== undefined) return;

    const id = setInterval(
      () =>
        setTick(
          computeLiveStopClockMs(
            frameClockStartedAt,
            frameClockElapsedMs,
            stopClockFrameTimeInSeconds,
            startedTurnTime,
            stopClockTurnTimeInSeconds,
            turnReferenceTimeMs ?? Date.now(),
            frameReferenceTimeMs ?? Date.now(),
          ),
        ),
      200,
    );
    return () => clearInterval(id);
  }, [
    frameClockStartedAt,
    frameClockElapsedMs,
    stopClockFrameTimeInSeconds,
    startedTurnTime,
    stopClockTurnTimeInSeconds,
    frameReferenceTimeMs,
    turnReferenceTimeMs,
  ]);

  return tick;
}
