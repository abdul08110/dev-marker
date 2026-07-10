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
//
// Frame time is pause/resume-able and never resets: frameClockStartedAt is the current running
// segment's start (null while paused), frameClockElapsedMs is the banked total from every
// previous segment. Not-started, running, and paused are all handled by the same formula —
// no separate branches needed.
export const computeFrameRemainingMs = (
  frameClockStartedAt: string | null | undefined,
  frameClockElapsedMs: number | undefined,
  stopClockFrameTimeInSeconds?: number,
  now: number = Date.now(),
) => {
  const frameTotalMs = (stopClockFrameTimeInSeconds ?? 0) * 1000;
  const bankedMs = frameClockElapsedMs ?? 0;
  const currentSegmentMs = frameClockStartedAt ? Math.max(0, now - new Date(frameClockStartedAt).getTime()) : 0;
  return Math.max(0, frameTotalMs - bankedMs - currentSegmentMs);
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

// Frame and turn each get their OWN "now" reference, independently defaulted to real time — they
// must never fall back to EACH OTHER's value. The overlay caps the turn's reference at
// stopClockEndedAt so the turn clock freezes correctly once stopped; that capped value is a
// fixed, non-advancing timestamp that would make frame look permanently stuck if it were ever
// used (directly or as a fallback) for frame's calculation.
export const computeLiveStopClockMs = (
  frameClockStartedAt: string | null | undefined,
  frameClockElapsedMs: number | undefined,
  stopClockFrameTimeInSeconds: number | undefined,
  startedTurnTime: string | null | undefined,
  stopClockTurnTimeInSeconds: number | undefined,
  turnNow: number = Date.now(),
  frameNow: number = Date.now(),
) => ({
  remainingFrameTimeInMs: computeFrameRemainingMs(frameClockStartedAt, frameClockElapsedMs, stopClockFrameTimeInSeconds, frameNow),
  currentTurnRemainingTimeInMs: computeTurnRemainingMs(startedTurnTime, stopClockTurnTimeInSeconds, turnNow),
});

export const formatClockMs = (ms: number) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// HH:MM:SS — frame time can exceed 60 minutes, unlike the shot clock.
export const formatClockHms = (ms: number) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
