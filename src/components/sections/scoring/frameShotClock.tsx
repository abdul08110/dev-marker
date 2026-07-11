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
    <div className="w-full flex flex-col items-center gap-[clamp(0.25rem,1.5vh,1.25rem)]">
      {/* Frame time — pause/resume, banked total never resets. The whole row is the toggle;
          3-col grid keeps the time centered (aligned with the shot-clock circle) with the
          play/pause indicator to its left. */}
      <button
        type="button"
        onClick={onFrameClockToggle}
        disabled={isFrameClockToggleDisabled}
        aria-label={isFrameClockRunning ? 'Pause frame clock' : 'Resume frame clock'}
        className="w-full grid grid-cols-[1fr_auto_1fr] items-center py-[clamp(0.25rem,1.5vh,1.25rem)] disabled:opacity-40 active:opacity-70 outline-none ring-0 focus:outline-none border-none"
      >
        <span className="justify-self-end mr-[clamp(0.75rem,3vw,1.5rem)] shrink-0 size-[clamp(1.75rem,min(9vw,5vh),2.75rem)] rounded-full bg-[#9B36BA] flex items-center justify-center">
          {isFrameClockRunning ? (
            <Pause className="size-[clamp(0.9rem,min(4vw,2.5vh),1.25rem)] text-white" />
          ) : (
            <Play className="size-[clamp(0.9rem,min(4vw,2.5vh),1.25rem)] text-white" />
          )}
        </span>
        <span className="justify-self-center text-score-text font-semibold text-[clamp(1.5rem,min(11vw,7vh),3.25rem)] tabular-nums tracking-wide leading-[130%] text-box-trim">
          {formatClockHms(frameRemainingMs)}
        </span>
      </button>

      <button
        type="button"
        onClick={onShotClockToggle}
        disabled={isShotClockToggleDisabled}
        aria-label={isShotClockRunning ? 'Stop shot clock' : 'Start shot clock'}
        className={clsx(
          'size-[clamp(4.5rem,min(35vw,21vh),10rem)] rounded-full border-4 border-white flex items-center justify-center text-white font-medium text-[clamp(2rem,min(14vw,9vh),4rem)] text-box-trim tabular-nums transition-colors disabled:opacity-40 active:opacity-80 mb-[clamp(0.5rem,2vh,1rem)] focus:outline-none ring-0 hover:border-white',
          isShotClockRunning ? 'bg-[#FF1B1B]' : 'bg-[#24B50D]',
          isCritical && 'animate-pulse-glow',
        )}
      >
        {shotRemainingSeconds}
      </button>
    </div>
  );
}
