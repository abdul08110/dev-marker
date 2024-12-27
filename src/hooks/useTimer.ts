import { useEffect, useRef, useState } from 'react';

function parseDate(dateLike: Date | number | string | null | undefined): number | null {
  // Treat null or undefined the same way
  if (dateLike == null) {
    return null;
  }

  if (typeof dateLike === 'number') {
    // assume it's already a Unix timestamp in milliseconds
    return dateLike;
  } else if (dateLike instanceof Date) {
    return dateLike.getTime();
  } else {
    // parse string
    const parsed = new Date(dateLike).getTime();
    return isNaN(parsed) ? null : parsed;
  }
}

interface UseTimerOptions {
  /**
   * End date/time (required for countdown).
   * Can be a Date object, a number (ms since epoch), or an ISO date string,
   * or undefined/null.
   */
  endTime: Date | number | string | null | undefined;
  /**
   * Start date/time (optional).
   * If now < startTime, we show total (endTime - startTime).
   * Once now >= startTime, countdown = (endTime - now).
   */
  startTime?: Date | number | string | null | undefined;
  /** A callback triggered once time reaches 0. */
  onTimerComplete?: () => void;
}

/**
 * A robust countdown hook referencing the real clock each second
 * to avoid drift.
 *
 * Behavior:
 * 1) If now < startTime, countdown shows (endTime - startTime) in seconds.
 * 2) If now >= startTime, countdown shows (endTime - now).
 * 3) If now >= endTime, we clamp to 0 and call onTimerComplete (if any).
 */
export default function useTimer({ endTime, startTime, onTimerComplete }: UseTimerOptions) {
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any running interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const endTs = parseDate(endTime);
    // If no valid endTime, there's nothing to count down
    if (!endTs) {
      setTimeLeft(0);
      return;
    }

    const startTs = parseDate(startTime);

    const updateTimeLeft = () => {
      const now = Date.now();

      let secondsLeft: number;

      // If a valid startTime is provided and we're before that time,
      // show the total difference (endTs - startTs).
      if (startTs && now < startTs) {
        secondsLeft = Math.floor((endTs - startTs) / 1000);
      } else {
        // Normal countdown from now to endTime
        secondsLeft = Math.floor((endTs - now) / 1000);
      }

      if (secondsLeft <= 0) {
        setTimeLeft(0);
        if (onTimerComplete) onTimerComplete();
      } else {
        setTimeLeft(secondsLeft);
      }
    };

    // Run once immediately
    updateTimeLeft();

    // Then run every second
    intervalRef.current = setInterval(updateTimeLeft, 1000);

    // Cleanup on unmount or dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [endTime, startTime, onTimerComplete]);

  return timeLeft;
}
