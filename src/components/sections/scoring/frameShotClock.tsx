import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { Pause, Play } from 'lucide-react';
import { formatClockHms } from '@/utils/stopClock';

const CRITICAL_SECONDS = 5;
const VIBRATE_MS = 200;

interface FrameShotClockProps {
  isStopClockEnabled?: boolean;
  sport: 'SNOOKER' | 'BILLIARDS';

  // Frame time — pause/resume, never resets
  frameRemainingMs: number;
  isFrameClockRunning: boolean;
  isFrameClockToggleDisabled: boolean;
  onFrameClockToggle: () => void;

  // Shot clock — Start/Stop per shot
  shotRemainingSeconds: number;
  isShotClockRunning: boolean;
  isShotClockToggleDisabled: boolean;
  onShotClockToggle: () => void;
}

export function FrameShotClock({
  isStopClockEnabled,
  sport,
  frameRemainingMs,
  isFrameClockRunning,
  isFrameClockToggleDisabled,
  onFrameClockToggle,
  shotRemainingSeconds,
  isShotClockRunning,
  isShotClockToggleDisabled,
  onShotClockToggle,
}: FrameShotClockProps) {
  const isCritical = isShotClockRunning && shotRemainingSeconds <= CRITICAL_SECONDS && shotRemainingSeconds >= 1;

  const lastVibratedSecondRef = useRef<number | null>(null);
  useEffect(() => {
    if (!isCritical) {
      lastVibratedSecondRef.current = null;
      return;
    }
    if (lastVibratedSecondRef.current === shotRemainingSeconds) return;
    lastVibratedSecondRef.current = shotRemainingSeconds;
    navigator.vibrate?.(VIBRATE_MS);
  }, [isCritical, shotRemainingSeconds]);

  if (!isStopClockEnabled || sport !== 'SNOOKER') return null;

  return (
    <div className="w-full flex flex-col items-center gap-5">
      {/* Frame time — pause/resume, banked total never resets */}
      <div className="flex items-center gap-6 py-5">
        <button
          type="button"
          onClick={onFrameClockToggle}
          disabled={isFrameClockToggleDisabled}
          aria-label={isFrameClockRunning ? 'Pause frame clock' : 'Resume frame clock'}
          className="shrink-0 size-11 rounded-full bg-[#9B36BA] flex items-center justify-center disabled:opacity-40 active:opacity-70 outline-none ring-0 focus:outline-none border-none"
        >
          <div className="">
            {isFrameClockRunning ? (
              <Pause size={24} className="size-5 text-white" />
            ) : (
              <Play size={24} className="size-5 text-white" />
            )}
          </div>
        </button>
        <p className="text-score-text font-semibold text-6xl tabular-nums tracking-wide leading-[130%] text-box-trim">
          {formatClockHms(frameRemainingMs)}
        </p>
      </div>

      <button
        type="button"
        onClick={onShotClockToggle}
        disabled={isShotClockToggleDisabled}
        aria-label={isShotClockRunning ? 'Stop shot clock' : 'Start shot clock'}
        className={clsx(
          'size-44 rounded-full border-4 border-white flex items-center justify-center text-white font-medium text-7xl text-box-trim tabular-nums transition-colors disabled:opacity-40 active:opacity-80 mb-4 focus:outline-none ring-0 hover:border-white',
          isShotClockRunning ? 'bg-[#FF1B1B]' : 'bg-[#24B50D]',
          isCritical && 'animate-pulse-glow',
        )}
      >
        {shotRemainingSeconds}
      </button>
    </div>
  );
}
