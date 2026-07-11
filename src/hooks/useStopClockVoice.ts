import { useEffect, useRef } from 'react';
import { computeTurnRemainingMs } from '@/utils/stopClock';

interface UseStopClockVoiceParams {
  startedTurnTime?: string | null;
  stopClockTurnTimeInSeconds?: number;
  stopClockVoiceEnabled?: boolean;
}

/**
 * Plays the 5-4-3-2-1 countdown voice for the last 5 seconds of a turn. Headless — mount this
 * unconditionally wherever the scoreboard renders, independent of any visual stop-clock panel,
 * so the voice keeps working even if that panel is hidden/redesigned.
 */
export function useStopClockVoice({ startedTurnTime, stopClockTurnTimeInSeconds, stopClockVoiceEnabled }: UseStopClockVoiceParams) {
  const spokenSecondsRef = useRef<Set<number>>(new Set());
  const lastTurnStartedAtRef = useRef<string | null | undefined>(undefined);

  // Defensive: if something external (or a browser quirk) ever leaves the engine paused,
  // clear it. Never call pause() ourselves here — pausing an idle engine is what was
  // silently swallowing every speak() call (utterances queued but never spoken, only
  // surfaced via a "canceled" error once cancel() ran on the next Stop).
  useEffect(() => {
    if (!window.speechSynthesis) {
      console.warn('[StopClockVoice] window.speechSynthesis is unavailable in this browser — voice countdown cannot play.');
      return;
    }

    const keepAlive = setInterval(() => {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }, 5000);

    return () => clearInterval(keepAlive);
  }, []);

  useEffect(() => {
    if (startedTurnTime !== lastTurnStartedAtRef.current) {
      spokenSecondsRef.current = new Set();
      lastTurnStartedAtRef.current = startedTurnTime;
    }

    if (!startedTurnTime) {
      window.speechSynthesis?.cancel();
      return;
    }

    const tick = () => {
      if (!stopClockVoiceEnabled) return;

      const currentTurnRemainingTimeInMs = computeTurnRemainingMs(startedTurnTime, stopClockTurnTimeInSeconds);
      const turnSecondsLeft = Math.ceil(currentTurnRemainingTimeInMs / 1000);

      if (turnSecondsLeft < 1 || turnSecondsLeft > 5 || spokenSecondsRef.current.has(turnSecondsLeft)) return;
      spokenSecondsRef.current.add(turnSecondsLeft);

      if (!window.speechSynthesis) {
        console.warn('[StopClockVoice] speechSynthesis unavailable, skipping voice countdown for', turnSecondsLeft);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(String(turnSecondsLeft));
      utterance.onerror = (e) => console.warn('[StopClockVoice] speechSynthesis error:', e.error);
      window.speechSynthesis.speak(utterance);
    };

    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [startedTurnTime, stopClockTurnTimeInSeconds, stopClockVoiceEnabled]);
}
