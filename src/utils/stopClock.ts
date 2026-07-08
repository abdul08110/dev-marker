/**
 * Frame time and turn time are independent clocks, each derived purely from its own start
 * timestamp plus the match's configured total — never from a stored partial-remaining
 * snapshot, since every Start always resets to the full duration.
 *
 * Frame time runs continuously from `frameStartedAt` for the whole frame (no pause/resume),
 * set once per frame by the backend at Break Off. Turn (shot) time is anchored to the active
 * turn's `startedTurnTime`, set/cleared entirely client-side by the marker's Start/Stop toggle.
 */
// `now` defaults to real wall-clock time (marker, venue scoreboard) but callers rendering a
// YouTube-embedded overlay should pass the video's own real-world-equivalent time instead
// (actualStartTimeDate + player.getCurrentTime()), so the clock only appears to move once the
// video itself has reached that point, instead of jumping the instant the live data arrives.
export const computeFrameRemainingMs = (
  frameStartedAt: string | null | undefined,
  stopClockFrameTimeInSeconds?: number,
  now: number = Date.now(),
) => {
  const frameTotalMs = (stopClockFrameTimeInSeconds ?? 0) * 1000;
  if (!frameStartedAt) return frameTotalMs;
  const start = new Date(frameStartedAt).getTime();
  if (now < start) return frameTotalMs;
  return Math.max(0, frameTotalMs - (now - start));
};

export const computeTurnRemainingMs = (
  startedTurnTime: string | null | undefined,
  stopClockTurnTimeInSeconds?: number,
  now: number = Date.now(),
) => {
  const turnTotalMs = (stopClockTurnTimeInSeconds ?? 0) * 1000;
  if (!startedTurnTime) return turnTotalMs;
  const start = new Date(startedTurnTime).getTime();
  if (now < start) return turnTotalMs;
  return Math.max(0, turnTotalMs - (now - start));
};

export const computeLiveStopClockMs = (
  frameStartedAt: string | null | undefined,
  stopClockFrameTimeInSeconds: number | undefined,
  startedTurnTime: string | null | undefined,
  stopClockTurnTimeInSeconds: number | undefined,
  now: number = Date.now(),
) => ({
  remainingFrameTimeInMs: computeFrameRemainingMs(frameStartedAt, stopClockFrameTimeInSeconds, now),
  currentTurnRemainingTimeInMs: computeTurnRemainingMs(startedTurnTime, stopClockTurnTimeInSeconds, now),
});

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
