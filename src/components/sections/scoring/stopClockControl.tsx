import clsx from 'clsx';
import { formatClockMs, getStopClockColor } from '@/utils/stopClock';

interface StopClockControlProps {
  isStopClockEnabled?: boolean;
  sport: 'SNOOKER' | 'BILLIARDS';
  activePlayerClock?: 'RUNNING' | 'STOPPED';
  remainingFrameTimeInMs: number;
  currentTurnRemainingTimeInMs: number;
  stopClockFrameTimeInSeconds: number;
  stopClockTurnTimeInSeconds: number;
  isPending: boolean;
  onToggle: () => void;
}

const buttonClasses = clsx(
  'rounded-xl p-1 border-2 border-white text-center text-sm flex justify-center items-center disabled:opacity-50 active:opacity-50',
);

function ClockMeter({ label, ms, totalMs }: { label: string; ms: number; totalMs: number }) {
  const progress = totalMs > 0 ? ms / totalMs : 0;
  const color = getStopClockColor(progress);
  const pct = Math.min(100, Math.max(0, progress * 100));

  return (
    <div className="flex flex-col gap-1 flex-1">
      <div className="flex justify-between items-baseline">
        <span className="text-xs text-white/70 uppercase">{label}</span>
        <span className="text-sm font-semibold text-white tabular-nums">{formatClockMs(ms)}</span>
      </div>
      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function StopClockControl({
  isStopClockEnabled,
  sport,
  activePlayerClock,
  remainingFrameTimeInMs,
  currentTurnRemainingTimeInMs,
  stopClockFrameTimeInSeconds,
  stopClockTurnTimeInSeconds,
  isPending,
  onToggle,
}: StopClockControlProps) {
  if (!isStopClockEnabled || sport !== 'SNOOKER') return null;

  const isRunning = activePlayerClock === 'RUNNING';

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <ClockMeter label="Frame" ms={remainingFrameTimeInMs} totalMs={stopClockFrameTimeInSeconds * 1000} />
        <ClockMeter label="Turn" ms={currentTurnRemainingTimeInMs} totalMs={stopClockTurnTimeInSeconds * 1000} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={isRunning || isPending}
          onClick={onToggle}
          className={clsx('bg-markerButton relative h-14', buttonClasses)}
        >
          Start
        </button>
        <button
          type="button"
          disabled={!isRunning || isPending}
          onClick={onToggle}
          className={clsx('bg-markerButton relative', buttonClasses)}
        >
          Stop
        </button>
      </div>
    </div>
  );
}
