import { useState, useEffect } from 'react';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import PinkBorderSVG from '@/components/PinkBorderSVG';
import YellowBorderSVG from '@/components/YellowBorderSVG';
import { formatTimeMatchTime } from '@/utils/functions';
import clsx from 'clsx';

const HEADER = {
  clubLogo: '/images/test/club-badge.png',
  tournamentName: 'KSCA Inter Club Snooker 2026',
};

const TEAM_SCORE = { left: 34, center: 22, right: 32 };
const FAME_SCORE = { left: 34, center: 22, right: 32 };

const PLAYER_ONE = {
  name: 'Rakesh Chowhan',
  score: 222,
  breakScore: 222,
  balls: ['red', 'red', 'red', 'red', 'red', 'yellow', 'black', 'red', 'red', 'blank', 'blank'] as BallType[],
};

const PLAYER_TWO = {
  name: 'Rakesh Chowhan',
  score: 222,
  breakScore: undefined,
  balls: ['red', 'red', 'red', 'red', 'red', 'yellow', 'black', 'red', 'red', 'blank', 'blank'] as BallType[],
};

type BallType = 'red' | 'yellow' | 'green' | 'brown' | 'blue' | 'pink' | 'black' | 'blank';

const BALL_IMAGE_MAP: Record<BallType, string> = {
  red: '/images/balls/red-ball.svg',
  yellow: '/images/balls/yellow-ball.svg',
  green: '/images/balls/green-ball.svg',
  brown: '/images/balls/brown-ball.svg',
  blue: '/images/balls/blue-ball.svg',
  pink: '/images/balls/pink-ball.svg',
  black: '/images/balls/black-ball.svg',
  blank: '/images/balls/placeholder-ball.svg',
};

const ScoreTest = () => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="bg-[url(/score-card-bg-pattern.png)] bg-cover bg-center h-screen px-[min(3vh,3vw)] bg-no-repeat flex flex-col overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-3 items-center border-b-2 py-[min(1.9vh,1.9vw)] [border-image-source:linear-gradient(90deg,rgba(227,139,249,0)_13.13%,rgba(227,139,249,0.8)_49.22%,rgba(227,139,249,0)_87.72%)] [border-image-slice:1]">
        <div className="flex items-center gap-[min(3vh,3vw)] py-[min(1.1vh,1.1vw)] w-fit justify-self-start">
          <ImageWithFallback
            className="object-cover rounded-full size-[min(10vh,10vw)]"
            fallback="/images/user-dummy-pic.jpg"
            src={HEADER.clubLogo}
          />
          <p className="text-score-text font-semibold text-[min(4vh,4vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase">
            {HEADER.tournamentName}
          </p>
        </div>

        <ImageWithFallback
          className="justify-self-center w-[min(37vh,37vw)] h-auto"
          fallback="/images/clubliv-final-logo.png"
          src="/images/logos/clubliv-logo.svg"
        />

        <p className="text-score-text font-semibold text-[min(4vh,4vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-end">
          match time {formatTimeMatchTime(elapsed)}
        </p>
      </div>

      {/* Cards + Center */}
      <div className="flex gap-[min(1.7vh,1.7vw)] px[min(3vw,3vh)] py-[min(2vh,2vw)] pb[min(2.1vh,2.1vw)]">
        <PlayerCard isActive name={PLAYER_ONE.name} score={PLAYER_ONE.score} breakScore={PLAYER_ONE.breakScore} balls={PLAYER_ONE.balls} />

        {/* Center Panel */}
        <div className="shrink-0 py-[min(1.8vh,1.8vw)]">
          <div
            className="rounded-[min(5.6vh,5.6vw)] p-[min(0.5vh,0.5vw)] h-full"
            style={{
              background: `
              linear-gradient(233.61deg,#FFECFF -11.62%,rgba(255,255,255,0) 50.44%),
              linear-gradient(172.2deg,rgba(191,178,247,0) 71.46%,#E8B2F7 107.96%),
              linear-gradient(347.86deg,rgba(210,154,245,0) 13.85%,#F4D3F2 105.37%)
            `,
              boxShadow: `
              0px 0px 10px 0px #FFEDFF,
              10px 10px 10px 0px #0F0B23CC,
              -11px 0px 10px 0px #0E0B24CC
            `,
            }}
          >
            <div className="rounded-[min(5.1vh,5.1vw)] bg-[linear-gradient(180deg,#371E56_0%,#0D0624_100%)] h-full flex flex-col shrink-0 px-[min(2vh,2vw)] py-[min(2.6vh,2.6vw)] gap-[min(2.2vh,2.2vw)] justify-center">
              <ScoreGrid label="Team Score" score={TEAM_SCORE} />

              <div className="flex justify-center items-center">
                <div className="bg-white/5 rounded-[10px] shadow-[inset_0px_2px_4px_0px_#FFFFFF40] flex items-center h-[min(8vh,8vw)] w-fit overflow-hidden shrink-0">
                  <div className="flex justify-center items-center bg-white/5 shadow-[inset_0px_2px_4px_0px_#FFFFFF40] h-full">
                    <p className="font-medium uppercase text-score-text text-box-trim px-[min(1.5vh,1.5vw)] text-center text-[min(7.6vh,7.6vw)]">
                      t
                    </p>
                  </div>
                  <div className="bg-white flex justify-center items-center px-[min(1.5vh,1.5vw)] h-full">
                    <p className="font-medium leading-[130%] text-[min(7.6vh,7.6vw)] text-black text-box-trim py-[min(0.9vh,0.9vw)]">
                      1
                    </p>
                  </div>
                </div>
              </div>

              <img src="/images/test/divider-line.svg" alt="" className="w-full h-[min(0.37vh,0.37vw)]" />

              <ScoreGrid label="Fame Score" score={FAME_SCORE} />

              <div className="flex flex-col justify-center items-center gap-1">
                <img src="/images/snooker.svg" alt="" className="size-[min(7vh,7vw)]" />
                <p className="text-score-text leading-[130%] text-[min(3.24vh,3.24vw)] font-semibold drop-shadow-[0px_4px_16px_0px_#FFFFFF40]">
                  Snooker
                </p>
                <p className="text-text-light leading-[130%] text-[min(3.7vh,3.7vw)] font-semibold uppercase text-center pt-[min(1vh,1vw)]">
                  6 Red Singles
                </p>
              </div>
            </div>
          </div>
        </div>

        <PlayerCard name={PLAYER_TWO.name} score={PLAYER_TWO.score} breakScore={PLAYER_TWO.breakScore} balls={PLAYER_TWO.balls} />
      </div>
    </main>
  );
};

function ScoreGrid({ label, score }: { label: string; score: { left: number; center: number; right: number } }) {
  return (
    <div className="space-y-[min(1vh,1vw)]">
      <p className="text-text-light font-semibold text-[min(3.7vh,3.7vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase text-center">
        {label}
      </p>
      <div className="border-y border-white/[.12] grid grid-cols-3 place-items-center">
        <p className="text-score-text font-semibold text-[min(6.48vh,6.48vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] bg-[#595959]/[0.20] text-box-trim h-full w-full text-center py-[min(1.5vh,1.5vw)]">
          {score.left}
        </p>
        <p className="text-score-text font-semibold text-[min(6.48vh,6.48vw)] leading-[130%] uppercase border text-center [border-image-source:linear-gradient(90deg,#E3A9F2_0%,rgba(226,179,237,0.05)_55.91%,#E0BCE8_109.78%)] [border-image-slice:1] w-full bg-[#AB51C6] drop-shadow-[0px_4px_4px_0px_#00000040] text-box-trim h-full py-[min(1.5vh,1.5vw)]">
          {score.center}
        </p>
        <p className="text-score-text font-semibold text-[min(6.48vh,6.48vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] text-center bg-[#595959]/[0.20] w-full h-full text-box-trim py-[min(1.5vh,1.5vw)]">
          {score.right}
        </p>
      </div>
    </div>
  );
}

interface PlayerCardProps {
  isActive?: boolean;
  name: string;
  score: number;
  breakScore?: number;
  balls: BallType[];
}

function PlayerCard({ isActive, name, score, breakScore, balls }: PlayerCardProps) {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-[min(5.6vh,5.6vw)]">
      <div className="absolute inset-0 backdrop-blur-xl" />
      {isActive ? <YellowBorderSVG /> : <PinkBorderSVG />}
      <div className="relative z-10 h-full flex flex-col px-[min(1vh,1vw)] py-[min(3.5vh,3.5vw)]">
        {/* Player info */}
        <div className="p-[min(2vh,2vw)] flex gap-[min(1.2vh,1.2vw)] mx-3 items-center">
          <div className="relative shrink-0 size-[min(15.46vh,15.46vw)] rounded-full bg-white border-4 border-white/10 overflow-hidden flex items-center justify-center">
            <img src="/images/test/avatar-placeholder.png" alt="" className="w-3/5 h-3/5 object-contain" />
          </div>
          <p className="text-[min(5.3vh,5.3vw)] leading-none text-score-text text-box-trim truncate text-wrap line-clamp-2 font-extrabold">
            {name}
          </p>
        </div>

        {/* Score + Break */}
        <div className="p-[min(3vh,3vw)] flex flex-col gap-[min(4.07vh,4.07vw)] justify-center items-center flex-1">
          <p
            className={`font-semibold text-[min(24vh,24vw)] text-box-trim ${isActive ? 'text-[#F5F85F]' : 'text-score-text'}`}
          >
            {score}
          </p>
          <div className={clsx('flex flex-col items-center gap-4', breakScore != null ? 'visible' : 'invisible')}>
            <div className="px-[min(1.9vh,1.9vw)] bg-[linear-gradient(69.46deg,rgba(172,236,84,0.078)_12.28%,rgba(111,255,0,0.6)_179.54%)] shadow-[0px_2px_4px_0px_#FFFFFF40_inset] break-card w-[min(26vh,26vw)] h-[min(11.5vh,11.5vw)] flex justify-center items-center pb-5 pt-5">
              <p className="font-semibold text-[min(10.2vh,10.2vw)] leading-[130%] text-box-trim text-score-text">
                {breakScore ?? 0}
              </p>
            </div>
            <p className="font-extrabold text-[min(3.7vh,3.7vw)] text-box-trim leading-[130%] uppercase text-sandy-yellow px-[min(1.5vh,1.5vw)] text-right">
              Break
            </p>
          </div>
        </div>

        {/* Balls */}
        <div
          className="border-t-2 [border-image-slice:1] py-[min(1.4vh,1.4vw)] flex flex-col items-center gap-[min(0.7vh,0.7vw)]"
          style={{
            borderImageSource: isActive
              ? 'linear-gradient(90deg,rgba(223,227,115,0) 5%,rgba(223,227,115,0.7) 45%,rgba(223,227,115,0.7) 60%,rgba(223,227,115,0) 82.24%)'
              : 'linear-gradient(90deg,rgba(227,139,249,0) 5%,rgba(227,139,249,0.7) 45%,rgba(227,139,249,0.7) 60%,rgba(227,139,249,0) 82.24%)',
          }}
        >
          <div className="flex gap-[min(0.5vh,0.5vw)]">
            {balls.map((type, i) => (
              <img key={i} src={BALL_IMAGE_MAP[type]} className="size-[min(4.2vh,4.2vw)] object-contain" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScoreTest;
