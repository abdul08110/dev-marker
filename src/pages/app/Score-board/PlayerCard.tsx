import PinkBorderSVG from '@/components/PinkBorderSVG';
import YellowBorderSVG from '@/components/YellowBorderSVG';
import { convertHandicapToString } from '@/utils/functions';
import { SnookerPointType } from '@/stores/types';
import clsx from 'clsx';
import { ProfilePicture } from './ProfilePicture';
import { cn } from '@/lib/utils';
import ShotClockTicker from './ShotClockTicker';

const BALL_IMAGE_MAP: Partial<Record<SnookerPointType, string>> = {
  [SnookerPointType.RED]: '/images/balls/red-ball.svg',
  [SnookerPointType.YELLOW]: '/images/balls/yellow-ball.svg',
  [SnookerPointType.GREEN]: '/images/balls/green-ball.svg',
  [SnookerPointType.BROWN]: '/images/balls/brown-ball.svg',
  [SnookerPointType.BLUE]: '/images/balls/blue-ball.svg',
  [SnookerPointType.PINK]: '/images/balls/pink-ball.svg',
  [SnookerPointType.BLACK]: '/images/balls/black-ball.svg',
  [SnookerPointType.FOUL]: '/images/balls/foul-ball.svg',
};

interface PlayerCardProps {
  isActive: boolean;
  profilePhoto: string | null;
  profilePhoto2?: string | null;
  playerOneName: string;
  playerTwoName?: string;
  isDoubles: boolean;
  isPlayerOneActive: boolean;
  handicap?: number | null;
  isHandicapApplied?: boolean;
  score: number;
  breakScore?: number;
  sport: string;
  balls: SnookerPointType[][];
  breakSide: 'left' | 'right';
  tournamentName: string;
  isTournament: boolean;
  isStopClockEnabled?: boolean;
  turnClockMs?: number;
  turnClockTotalMs?: number;
}

export function PlayerCard({
  isActive,
  profilePhoto,
  profilePhoto2,
  playerOneName,
  playerTwoName,
  isDoubles,
  isPlayerOneActive,
  handicap,
  isHandicapApplied,
  score,
  breakScore,
  sport,
  balls,
  tournamentName,
  isTournament,
  isStopClockEnabled,
  turnClockMs,
  turnClockTotalMs,
}: PlayerCardProps) {
  // Active player's photo goes to the front
  const frontPhoto = isPlayerOneActive ? profilePhoto : profilePhoto2;
  const backPhoto = isPlayerOneActive ? profilePhoto2 : profilePhoto;

  return (
    <div className="relative w-full h-full overflow-hidden rounded-[min(5.6vh,5.6vw)]">
      <div className="absolute inset-0 backdrop-blur-xl" />
      {isActive ? <YellowBorderSVG /> : <PinkBorderSVG />}
      <div className="relative z-10 h-full flex flex-col px-[min(1vh,1vw)] py-[min(3.5vh,3.5vw)]">
        {tournamentName && (
          <div className="relative text-center border-b border-white/10 mx-[min(1.9vh,1.9vw)] grid grid-cols-3 px-[min(3vh,3vh)] pb-[min(1.6vh,1.6vh)] pt-[min(0.8vh,0.8vh)]">
            {isTournament && handicap != null && (
              <div className="w-fit col-span-1 flex justify-center items-center">
                <HandicapPill handicap={handicap} isApplied={isHandicapApplied} isActive={isActive} />
              </div>
            )}
            <p
              className={cn(
                'font-semibold text-[min(4vh,4vw)] text-white  truncate',
                handicap === null ? 'text-center col-span-3 text-box-trim' : 'text-left col-span-2 text-box-trim',
              )}
            >
              {tournamentName}
            </p>
          </div>
        )}
        {/* Player info */}
        <div className="border-b p-[min(2vh,2vw)] border-white/10 flex gap-[min(1.2vh,1.2vw)] mx-[min(1.9vh,1.9vw)]">
          {/* Profile image */}
          <ProfilePicture
            isDoubles={isDoubles}
            isTournament={isTournament}
            profilePhoto={profilePhoto}
            profilePhoto2={profilePhoto2}
            frontPhoto={frontPhoto}
            backPhoto={backPhoto}
          />

          {/* Player name(s) + handicap */}
          <div className="flex flex-col justify-between gap-[min(1.3vh,1.3vw)] min-w-0 flex-1">
            <div>
              {isDoubles && playerTwoName ? (
                <div className="space-y-3 pr-4">
                  <p className="flex items-baseline gap-[0.3ch] text-[min(5.3vh,5.3vw)] leading-none text-score-text text-box-trim font-medium pt-[min(1.2vh,1.2vh)]">
                    <span className="min-w-0 truncate">{playerOneName.trim()}</span>
                    <span className="shrink-0">&</span>
                  </p>
                  <p className="text-[min(5.3vh,5.3vw)] leading-none text-score-text text-box-trim truncate font-medium pt-[min(0.8vh,0.8vw)]">
                    {playerTwoName.trim()}
                  </p>
                </div>
              ) : (
                <p className="text-[min(5.3vh,5.3vw)] leading-none text-score-text text-box-trim text-wrap line-clamp-2 font-medium pt-[min(1.2vh,1.2vh)]">
                  {playerOneName.trim()}
                </p>
              )}
            </div>

            <div className="space-y-2">
              {!isTournament && handicap != null && (
                <HandicapPill handicap={handicap} isApplied={isHandicapApplied} isActive={isActive} />
              )}
            </div>
          </div>
        </div>

        {/* Score + Break */}
        <div className="px-[min(2vh,2vw)] flex flex-col justify-evenly items-center flex-1 ">
          <p
            className={`font-semibold text-[min(26vh,26vw)] text-box-trim ${isActive ? 'text-[#F5F85F]' : 'text-score-text'}`}
          >
            {score}
          </p>

          <div
            className={cn(
              'rounded-[min(1.2vh,1.2vw)] bg-white/5 shadow-[inset_0px_2px_4px_0px_#FFFFFF40] w-[min(17vh,17vh)]',
              breakScore != null ? 'visible' : 'invisible',
            )}
          >
            <p className="font-medium text-[min(3vh,3vw)] text-center text-box-trim leading-[130%] text-score-text px-[min(1.5vh,1.5vh)] py-[min(1.5vh,1.5vh)]">
              break
            </p>
            <div className="bg-[#F5F85F] px-[min(1vh,1vh)] py-[min(1.2vh,1.2vh)] rounded-b-[min(1.2vh,1.2vw)]">
              <p className="font-medium text-[min(9vh,9vw)] text-center text-box-trim leading-[130%] text-[#11030F]">
                {breakScore ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* Balls (snooker only) — replaced by the shot-clock ticker when stop clock is enabled */}
        {sport === 'SNOOKER' && (
          <div
            className="border-t-[min(0.4vh,0.4vw)] [border-image-slice:1] py-[min(2vh,2vw)] flex flex-col items-center gap-[min(0.7vh,0.7vw)]"
            style={{
              borderImageSource: isActive
                ? 'linear-gradient(90deg,rgba(223,227,115,0) calc(50% - min(27vh,27vw)),rgba(223,227,115,0.7) calc(50% - min(12vh,12vw)),rgba(223,227,115,0.7) calc(50% + min(12vh,12vw)),rgba(223,227,115,0) calc(50% + min(27vh,27vw)))'
                : 'linear-gradient(90deg,rgba(227,139,249,0) calc(50% - min(27vh,27vw)),rgba(227,139,249,0.7) calc(50% - min(12vh,12vw)),rgba(227,139,249,0.7) calc(50% + min(12vh,12vw)),rgba(227,139,249,0) calc(50% + min(27vh,27vw)))',
            }}
          >
            {isStopClockEnabled ? (
              <ShotClockTicker remainingMs={turnClockMs} totalMs={turnClockTotalMs ?? 0} />
            ) : (
              <BallGrid balls={balls} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function HandicapPill({
  handicap,
  isApplied,
  isActive,
}: {
  handicap: number;
  isApplied?: boolean;
  isActive?: boolean;
}) {
  return (
    <div className="flex w-full">
      <div
        className={clsx(
          'bg-white/5 rounded-[min(0.7vh,0.7vw)] flex items-center h-[min(3.5vh,3.5vw)] w-fit overflow-hidden shrink-0 shadow-[inset_0px_2px_4px_0px_#FFFFFF40]',
        )}
      >
        <div className="bg-white/5 h-full flex justify-center items-center">
          <p className="font-medium text-[min(2.23vh,2.23vw)] leading-[130%] text-score-text text-box-trim px-[min(1.6vh,1.6vw)] ">
            h
          </p>
        </div>
        <div
          className={clsx(
            'flex justify-center items-center px-[min(1.5vh,1.5vw)] h-full',
            isActive ? 'bg-sandy-yellow' : 'bg-[#E07EF9]',
          )}
        >
          <p
            className={clsx(
              'font-medium text-[min(2.23vh,2.23vw)] text-black leading-[130%] uppercase text-box-trim py-[min(0.9vh,0.9vw)]',
              { 'line-through': isApplied },
            )}
          >
            {convertHandicapToString(handicap)}
          </p>
        </div>
      </div>
    </div>
  );
}

const TOTAL_SLOTS = 11;

function BallGrid({ balls }: { balls: SnookerPointType[][] }) {
  const potted = balls
    .flatMap((turnBalls) => turnBalls)
    .filter((type): type is SnookerPointType => type in BALL_IMAGE_MAP);

  const remainder = potted.length % TOTAL_SLOTS;
  const current = potted.length === 0 ? [] : remainder === 0 ? potted.slice(-TOTAL_SLOTS) : potted.slice(-remainder);

  const slots = Array.from({ length: TOTAL_SLOTS }, (_, i) =>
    i < current.length ? BALL_IMAGE_MAP[current[i]]! : '/images/balls/placeholder-ball.svg',
  );

  return (
    <div className="flex gap-[min(0.5vh,0.5vw)]">
      {slots.map((src, i) => (
        <img key={i} src={src} className="size-[min(4.2vh,4.2vw)] object-contain" />
      ))}
    </div>
  );
}
