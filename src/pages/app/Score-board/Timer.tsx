import { formatTime } from '@/utils/functions';

interface TimerProps {
  timeLeft: number;
  isTournament: boolean;
}

export function Timer({ timeLeft, isTournament }: TimerProps) {
  if (isTournament) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-[min(1.5vh,1.5vw)] space-y-2">
      <p className="text-score-text text-box-trim font-semibold text-[min(10vh,10vw)] leading-none tabular-nums drop-shadow-[0px_4px_16px_0px_#FFFFFF40]">
        {formatTime(timeLeft)}
      </p>
      <p className="text-text-light font-medium text-[min(4vh,4vw)] text-box-trim ">Remaining</p>
    </div>
  );
}
