interface TimerDialProps {
  timeLeft: number; // in seconds
}

export default function TimerDial({ timeLeft }: TimerDialProps) {
  const totalTicks = 60;
  const showSeconds = timeLeft < 60;
  const displayValue = showSeconds ? timeLeft : Math.min(Math.floor(timeLeft / 60), 60);
  const activeCount = showSeconds ? timeLeft : displayValue;

  return (
    <div className="flex items-center justify-center py-[clamp(32px,min(4.4vh,4.4vw),58px)]">
      <div className="relative size-[clamp(113px,min(17.7vh,17.7vw),209px)]">
        {Array.from({ length: totalTicks }).map((_, i) => {
          const angle = (i / totalTicks) * 360;
          const isActive = i < activeCount;

          return (
            <div key={i} className="absolute inset-0 flex justify-center" style={{ transform: `rotate(${angle}deg)` }}>
              <div
                className={[
                  'absolute top-0 w-px h-[clamp(10px,min(1.5vh,1.5vw),20px)]',
                  isActive ? 'bg-[#E126CD]' : 'bg-white/50',
                ].join(' ')}
              />
            </div>
          );
        })}

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-text-light font-semibold text-[clamp(35px,min(4.8vh,4.8vw),64px)] leading-[130%] uppercase text-center">
            {displayValue}
          </p>
          <p className="text-text-light font-semibold text-[clamp(10px,min(1.5vh,1.5vw),20px)] leading-[130%] uppercase text-center">
            {showSeconds ? 'Seconds' : 'Minutes'}
          </p>
        </div>
      </div>
    </div>
  );
}
