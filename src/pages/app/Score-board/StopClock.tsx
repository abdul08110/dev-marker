import { StopClockState } from '@/stores/types';
import { formatClockMs, getStopClockColor } from '@/utils/stopClock';

interface StopClockProps {
  stopClockState?: StopClockState | null;
  isStopClockEnabled?: boolean;
  stopClockFrameTimeInSeconds?: number;
  stopClockTurnTimeInSeconds?: number;
  remainingFrameMs: number;
  remainingTurnMs: number;
  sport: 'BILLIARDS' | 'SNOOKER';
}

function ClockBar({ label, ms, totalMs }: { label: string; ms: number; totalMs: number }) {
  const progress = totalMs > 0 ? ms / totalMs : 0;
  const pct = Math.min(100, Math.max(0, progress * 100));
  const color = getStopClockColor(progress);

  return (
    <div className="flex flex-col items-center gap-[min(0.4vh,0.4vw)] w-[min(30vh,30vw)]">
      <p className="text-score-text font-semibold text-[min(2.6vh,2.6vw)]">
        {label}: {formatClockMs(ms)}
      </p>
      <div className="w-full h-[min(1vh,1vw)] rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-200"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function StopClock({
  stopClockState,
  isStopClockEnabled,
  stopClockFrameTimeInSeconds,
  stopClockTurnTimeInSeconds,
  remainingFrameMs,
  remainingTurnMs,
  sport,
}: StopClockProps) {
  if (!isStopClockEnabled || sport !== 'SNOOKER' || !stopClockState) return null;

  return (
    <div className="flex justify-center items-center gap-[min(2vh,2vw)] pt-[min(2vh,2vw)]">
      <ClockBar label="Frame" ms={remainingFrameMs} totalMs={(stopClockFrameTimeInSeconds ?? 0) * 1000} />
      <ClockBar label="Turn" ms={remainingTurnMs} totalMs={(stopClockTurnTimeInSeconds ?? 0) * 1000} />
    </div>
  );
}
