import { useEffect, useState } from 'react';

interface TopOverlayProps {
  clubLogo: string;
  tournamentLogo: string | null;
  venueNo: number;
  showOtherLogos?: boolean;
  showIGLogo?: boolean;
  expectedEndTimeDate?: string | null;
}

function useCountdown(endTime: string | null | undefined) {
  const calcRemaining = () => {
    if (!endTime) return null;
    const diff = Math.max(0, Math.floor((new Date(endTime).getTime() - Date.now()) / 1000));
    return diff;
  };

  const [seconds, setSeconds] = useState<number | null>(calcRemaining);

  useEffect(() => {
    if (!endTime) return;
    const id = setInterval(() => {
      const remaining = calcRemaining();
      setSeconds(remaining);
      if (remaining === 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  return seconds;
}

function formatCountdown(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function TopOverlay(props: TopOverlayProps) {
  const remaining = useCountdown(props.expectedEndTimeDate);

  return (
    <div className="absolute inset-0 w-full flex justify-between p-[min(1.5vh,1.5vw)] h-fit">
      <div className="flex flex-col gap-[min(1vh,1vw)] items-center h-fit">
        <img
          src="/images/clubliv-logo-v2.svg"
          className="size-[min(12vh,12vw)] rounded-full overflow-hidden object-cover"
        />
        {props.showOtherLogos && (
          <img
            src="/images/logos/snooker-alley.jpeg"
            className="size-[min(12vh,12vw)] rounded-full overflow-hidden object-cover"
          />
        )}
      </div>

      <div className="flex flex-col gap-[min(1vh,1vw)] items-center h-fit">
        <img src={props.clubLogo} className="size-[min(12vh,12vw)] rounded-full overflow-hidden object-cover" />
        <span className="text-white font-medium text-[min(2vh,2vw)]">T-{props.venueNo}</span>
        {props.tournamentLogo ? (
          <img
            src={props.tournamentLogo!}
            className="size-[min(12vh,12vw)] rounded-full overflow-hidden object-cover"
          />
        ) : (
          <></>
        )}

        {props.showIGLogo && (
          <img src="/images/logos/ig.png" className="size-[min(12vh,12vw)] rounded-full overflow-hidden object-cover" />
        )}

        {remaining !== null && (
          <div className="flex flex-col items-center rounded-[min(0.8vh,0.8vw)] overflow-hidden border border-white/10">
            <div className="bg-white/10 w-full text-center px-[min(1.2vh,1.2vw)] py-[min(0.3vh,0.3vw)]">
              <span className="text-white/50 font-medium uppercase tracking-widest text-[min(1.6vh,1.6vw)]">
                Time Left
              </span>
            </div>
            <div className="bg-black/70 px-[min(1.2vh,1.2vw)] py-[min(0.4vh,0.4vw)] w-full text-center">
              <span className="text-white font-mono font-bold tabular-nums text-[min(2vh,2vw)]">
                {formatCountdown(remaining)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
