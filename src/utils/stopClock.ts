import { StopClockState } from '@/stores/types';

/**
 * Frame time and turn time are independent clocks. Frame time runs continuously from
 * `frameStartedAt` for the whole frame (no pause/resume), so it's derived purely from that
 * timestamp plus the match's configured total — never from the `remainingFrameTimeInMs`
 * snapshot, which the backend now recomputes fresh at send-time (using it as an elapsed-since
 * anchor would double-count that elapsed time). Turn time keeps the original snapshot + anchor
 * model since it genuinely pauses/resumes across Start/Stop presses.
 */
export const computeLiveStopClockMs = (
  stopClockState: StopClockState | null | undefined,
  stopClockFrameTimeInSeconds?: number,
) => {
  if (!stopClockState) {
    return { remainingFrameTimeInMs: 0, currentTurnRemainingTimeInMs: 0 };
  }

  const frameTotalMs = (stopClockFrameTimeInSeconds ?? 0) * 1000;
  const remainingFrameTimeInMs = stopClockState.frameStartedAt
    ? Math.max(0, frameTotalMs - (Date.now() - new Date(stopClockState.frameStartedAt).getTime()))
    : Math.max(0, stopClockState.remainingFrameTimeInMs);

  if (stopClockState.activePlayerClock === 'STOPPED' || !stopClockState.turnStartedAt) {
    return {
      remainingFrameTimeInMs,
      currentTurnRemainingTimeInMs: Math.max(0, stopClockState.currentTurnRemainingTimeInMs),
    };
  }

  const elapsed = Date.now() - new Date(stopClockState.turnStartedAt).getTime();
  return {
    remainingFrameTimeInMs,
    currentTurnRemainingTimeInMs: Math.max(0, stopClockState.currentTurnRemainingTimeInMs - elapsed),
  };
};

export const formatClockMs = (ms: number) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const interpolateColor = (from: [number, number, number], to: [number, number, number], t: number) => {
  const r = Math.round(from[0] + (to[0] - from[0]) * t);
  const g = Math.round(from[1] + (to[1] - from[1]) * t);
  const b = Math.round(from[2] + (to[2] - from[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
};

const RED: [number, number, number] = [239, 68, 68];
const YELLOW: [number, number, number] = [234, 179, 8];
const GREEN: [number, number, number] = [34, 197, 94];

/** progress: 1 = full time remaining (green), 0 = time's up (red), midpoint is yellow */
export const getStopClockColor = (progress: number) => {
  const p = Math.min(1, Math.max(0, progress));
  if (p > 0.5) return interpolateColor(YELLOW, GREEN, (p - 0.5) / 0.5);
  return interpolateColor(RED, YELLOW, p / 0.5);
};
