import { cn } from '@/lib/utils';

interface GameFormatProps {
  sport: string;
  format: string | null;
  isTournament: boolean;
  isStopClockEnabled: boolean | undefined;
}

export function GameFormat({ sport, format, isTournament, isStopClockEnabled }: GameFormatProps) {
  const icon = (
    <div className={cn('flex flex-col justify-center items-center gap-1 py-5')}>
      {sport === 'SNOOKER' ? (
        <>
          <img src="/images/snooker.svg" alt="" className="size-[min(7vh,7vw)]" />
          <p className="text-score-text leading-[130%] text-[min(3.24vh,3.24vw)] font-semibold drop-shadow-[0px_4px_16px_0px_#FFFFFF40]">
            Snooker
          </p>
        </>
      ) : (
        <>
          <img src="/images/billiards.svg" alt="" className="size-[min(7vh,7vw)]" />
          <p className="text-score-text leading-[130%] text-[min(3.24vh,3.24vw)] font-semibold drop-shadow-[0px_4px_16px_0px_#FFFFFF40] pb-3">
            Billiards
          </p>
        </>
      )}
    </div>
  );

  if (!isTournament) {
    return icon;
  }

  return (
    <div className={cn(isTournament ? '' : 'space-y-4')}>
      {icon}
      <div className={cn('text-center', isTournament ? 'pb-5' : 'pb-0')}>
        <p className="text-score-text text-wrap whitespace-pre-line leading-[130%] text-[min(3.24vh,3.24vw)] font-semibold drop-shadow-[0px_4px_16px_0px_#FFFFFF40]">
          {/* {format} */}
          {format?.split(' ').map((word, index) => {
            return (
              <span key={index}>
                {word}
                {index === 1 ? <br /> : ' '}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}
