import clsx from 'clsx';

const TICKER_SLOT_COUNT = 10;
const TICKER_CRITICAL_SECONDS = 5;
const TICKER_IMAGE_SRC: Record<'placeholder' | 'green' | 'red', string> = {
  placeholder: '/images/timer-ticker/placeholder-ticker.svg',
  green: '/images/timer-ticker/green-ticker.svg',
  red: '/images/timer-ticker/red-ticker.svg',
};

interface ShotClockTickerProps {
  remainingMs?: number;
  totalMs: number;
  barClassName?: string;
  textClassName?: string;
  gapClassName?: string;
}

const ShotClockTicker = ({
  remainingMs,
  totalMs,
  barClassName = 'h-[min(4vh,4vw)]',
  textClassName = 'text-[min(3.5vh,3.5vw)]',
  gapClassName = 'gap-[min(1vh,1vw)]',
}: ShotClockTickerProps) => {
  const total = totalMs > 0 ? totalMs : 1;
  const remaining = Math.max(0, remainingMs ?? total);
  const criticalMs = TICKER_CRITICAL_SECONDS * 1000;
  const greenPhaseMs = Math.max(total - criticalMs, 1);
  const secondsLeft = Math.ceil(remaining / 1000);

  // Last 5 seconds (5, 4, 3, 2, 1) are all critical/red — one more red slot lights up per second.
  const isCritical = secondsLeft <= TICKER_CRITICAL_SECONDS;

  // First 5 slots (left) are the critical zone (red, blinking) for seconds 5-1; last 5 slots
  // (right) are the bulk of the turn (green). Both fill right-to-left as time elapses, so the
  // fill sweeps continuously from the rightmost slot to the leftmost as the clock counts down.
  // Green fill uses the same discrete per-chunk approach as red (rather than a raw ms ratio) so
  // it lands on exactly 5/5 right as the critical zone starts, instead of jumping from 4→5 the
  // moment isCritical flips (floor() on a continuous ratio never quite reaches 5 in time).
  const greenChunkMs = greenPhaseMs / 5;
  const remainingInGreenPhase = Math.max(0, remaining - criticalMs);
  const greenChunksLeft = Math.ceil(remainingInGreenPhase / greenChunkMs);
  const greenFilled = Math.max(0, Math.min(5, 5 - greenChunksLeft));
  const redFilled = isCritical ? Math.max(0, Math.min(5, TICKER_CRITICAL_SECONDS - secondsLeft + 1)) : 0;

  const slots = Array.from({ length: TICKER_SLOT_COUNT }, (_, i): 'placeholder' | 'green' | 'red' => {
    if (i >= 5) return i >= TICKER_SLOT_COUNT - greenFilled ? 'green' : 'placeholder';
    return i >= 5 - redFilled ? 'red' : 'placeholder';
  });

  return (
    <div className={clsx('flex items-center', gapClassName)}>
      {slots.map((state, i) => (
        <img
          key={i}
          src={TICKER_IMAGE_SRC[state]}
          className={clsx(barClassName, 'object-contain', state === 'red' && 'animate-pulse-glow')}
        />
      ))}
      <p
        className={clsx('font-semibold text-white text-box-trim pl-[min(0.4vh,0.4vw)]', textClassName, isCritical && 'animate-pulse-glow')}
      >
        {secondsLeft}
      </p>
    </div>
  );
};

export default ShotClockTicker;
