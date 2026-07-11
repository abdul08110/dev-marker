import { cn } from '@/lib/utils';

interface SportIconProps {
  sport: string;
}

export function SportIcon({ sport }: SportIconProps) {
  const isSnooker = sport === 'SNOOKER';
  return (
    <div className="flex flex-col justify-center items-center gap-1">
      <img src={isSnooker ? '/images/snooker.svg' : '/images/billiards.svg'} alt="" className="size-[min(8vh,8vw)]" />
      <p className="text-score-text leading-[130%] text-[min(3.5vh,3.5vw)] font-semibold drop-shadow-[0px_4px_16px_0px_#FFFFFF40] text-box-trim">
        {isSnooker ? 'Snooker' : 'Billiards'}
      </p>
    </div>
  );
}

interface FormatLabelProps {
  format: string | null;
  className?: string;
}

export function FormatLabel({ format, className }: FormatLabelProps) {
  if (!format) return null;
  return (
    <div className={cn('text-center', className)}>
      <p className="text-score-text text-wrap whitespace-pre-line leading-[130%] text-[min(3.5vh,3.5vw)] font-semibold drop-shadow-[0px_4px_16px_0px_#FFFFFF40] text-box-trim">
        {format.split(' ').map((word, index) => (
          <span key={index}>
            {word}
            {index === 1 ? <br /> : ' '}
          </span>
        ))}
      </p>
    </div>
  );
}

