import { StopClockState } from '@/stores/types';

export const computeLiveStopClockMs = (stopClockState: StopClockState | null | undefined) => {
  if (!stopClockState) {
    return { remainingFrameTimeInMs: 0, currentTurnRemainingTimeInMs: 0 };
  }

  if (stopClockState.activePlayerClock === 'STOPPED' || !stopClockState.turnStartedAt) {
    return {
      remainingFrameTimeInMs: Math.max(0, stopClockState.remainingFrameTimeInMs),
      currentTurnRemainingTimeInMs: Math.max(0, stopClockState.currentTurnRemainingTimeInMs),
    };
  }

  const elapsed = Date.now() - new Date(stopClockState.turnStartedAt).getTime();
  return {
    remainingFrameTimeInMs: Math.max(0, stopClockState.remainingFrameTimeInMs - elapsed),
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
