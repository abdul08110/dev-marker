interface TimerDialProps {
  timeLeft: number; // in seconds
}

export default function TimerDial({ timeLeft }: TimerDialProps) {
  const totalTicks = 60;
  const minutesLeft = Math.min(Math.floor(timeLeft / 60), 60);

  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative size-[170px]">
        {Array.from({ length: totalTicks }).map((_, i) => {
          const angle = (i / totalTicks) * 360;
          const isActive = i < minutesLeft;

          return (
            <div key={i} className="absolute inset-0 flex justify-center" style={{ transform: `rotate(${angle}deg)` }}>
              <div className={['absolute top-0 w-0.5 h-4', isActive ? 'bg-[#E126CD]' : 'bg-slate-500/50'].join(' ')} />
            </div>
          );
        })}

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-text-light font-semibold text-[52px] leading-[130%] uppercase text-center">
            {minutesLeft}
          </p>
          <p className="text-text-light font-semibold text-base leading-[130%] uppercase text-center">Minutes</p>
        </div>
      </div>
    </div>
  );
}
