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
    <div className="absolute inset-0 w-full flex justify-between lg:p-4 p-2 h-fit">
      <div className="flex flex-col gap-2 items-center h-fit">
        <img
          src="/images/clublogo.png"
          className="lg:h-14 xl:h-32 xl:w-32 lg:w-14 h-8 w-8 rounded-full overflow-hidden"
        />
        {props.showOtherLogos && (
          <>
            <img
              src="/images/logos/snooker-alley.jpeg"
              className="lg:h-14 xl:h-32 xl:w-32 lg:w-14 h-8 w-8 rounded-full overflow-hidden"
            />
          </>
        )}
      </div>

      <div className="flex flex-col gap-2 items-center h-fit">
        <img src={props.clubLogo} className="lg:h-14 xl:h-32 xl:w-32 lg:w-14 h-8 w-8 rounded-full overflow-hidden" />
        <small className="text-white font-medium lg:text-xl text-base xl:text-xl">T-{props.venueNo}</small>
        {props.tournamentLogo ? (
          <img
            src={props.tournamentLogo!}
            className="lg:h-14 xl:h-32 xl:w-32 lg:w-14 h-8 w-8 rounded-full overflow-hidden"
          />
        ) : (
          <></>
        )}

        {props.showIGLogo && (
          <img
            src="/images/logos/ig.png"
            className="lg:h-14 xl:h-32 xl:w-32 lg:w-14 h-8 w-8 rounded-full overflow-hidden"
          />
        )}

        {remaining !== null && (
          <div className="flex flex-col items-center rounded-lg overflow-hidden border border-white/10 shadow-[0_0_12px_rgba(255,255,255,0.08)]">
            <div className="bg-white/10 w-full text-center px-3 py-[2px]">
              <span
                className="text-white/50 font-medium uppercase tracking-widest"
                style={{ fontSize: 'min(2vh, 2vw)' }}
              >
                Time Left
              </span>
            </div>
            <div className="bg-black/70 px-3 py-1 w-full text-center">
              <span className="text-white font-mono font-bold tabular-nums" style={{ fontSize: 'min(1.8vh, 1.8vw)' }}>
                {formatCountdown(remaining)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
