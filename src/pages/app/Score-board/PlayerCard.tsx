import PinkBorderSVG from '@/components/PinkBorderSVG';
import YellowBorderSVG from '@/components/YellowBorderSVG';
import { convertHandicapToString } from '@/utils/functions';
import { SnookerPointType } from '@/stores/types';
import clsx from 'clsx';
import { ProfilePicture } from './ProfilePicture';

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
          <div className="py-[min(2vh,2vw)] text-center border-b border-white/10 mx-3">
            <p className="font-semibold text-[min(4vh,4vw)] text-box-trim text-score-text">{tournamentName}</p>
          </div>
        )}
        {/* Player info */}
        <div className="border-b p-[min(2vh,2vw)] border-white/10 flex gap-[min(1.2vh,1.2vw)] mx-3">
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
            <div className="">
              <div>
                <p className="text-[min(5.3vh,5.3vw)] leading-none text-score-text text-box-trim truncate text-wrap line-clamp-2 font-medium pt-[min(1.2vh,1.2vh)]">
                  {isDoubles
                    ? (isPlayerOneActive ? playerOneName.trim() : playerTwoName?.trim())?.split(' ')[0]
                    : playerOneName.trim()}
                </p>

                {isDoubles ? (
                  <div className="pt-[min(1vh,1vw)]">
                    <div
                      className="w-full h-[min(0.3vh,0.3vw)]"
                      style={{
                        background: isActive
                          ? 'linear-gradient(90deg,rgba(223,227,115,0) 5%,rgba(223,227,115,0.7) 45%,rgba(223,227,115,0.7) 60%,rgba(223,227,115,0) 82.24%)'
                          : 'linear-gradient(90deg,rgba(227,139,249,0) 5%,rgba(227,139,249,0.7) 45%,rgba(227,139,249,0.7) 60%,rgba(227,139,249,0) 82.24%)',
                      }}
                    />
                  </div>
                ) : (
                  <div className="pt-[min(1vh,1vw)]">
                    <div
                      className="w-full h-[min(0.3vh,0.3vw)]"
                      style={{
                        background: isActive
                          ? 'linear-gradient(90deg,rgba(223,227,115,0) 5%,rgba(223,227,115,0.7) 45%,rgba(223,227,115,0.7) 60%,rgba(223,227,115,0) 82.24%)'
                          : 'linear-gradient(90deg,rgba(227,139,249,0) 5%,rgba(227,139,249,0.7) 45%,rgba(227,139,249,0.7) 60%,rgba(227,139,249,0) 82.24%)',
                      }}
                    />
                  </div>
                )}
              </div>

              {isDoubles && playerTwoName && (
                <div className="flex items-center justify-between gap-[min(1.5vh,1.5vw)] w-full pt-[min(1.5vh,1.5vw)]">
                  <p className="font-medium text-[min(5.3vh,5.3vw)] leading-[130%] text-score-text text-box-trim truncate">
                    {isDoubles
                      ? (isPlayerOneActive ? playerTwoName.trim() : playerOneName.trim())?.split(' ')[0]
                      : isPlayerOneActive
                        ? playerTwoName.trim()
                        : playerOneName.trim()}
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              {isTournament && !isDoubles && handicap != null && (
                <div
                  className="w-full h-[min(0.3vh,0.3vw)]"
                  style={{
                    background: isActive
                      ? 'linear-gradient(90deg,rgba(223,227,115,0) 5%,rgba(223,227,115,0.7) 45%,rgba(223,227,115,0.7) 60%,rgba(223,227,115,0) 82.24%)'
                      : 'linear-gradient(90deg,rgba(227,139,249,0) 5%,rgba(227,139,249,0.7) 45%,rgba(227,139,249,0.7) 60%,rgba(227,139,249,0) 82.24%)',
                  }}
                />
              )}
              {handicap != null && (
                <HandicapPill handicap={handicap} isApplied={isHandicapApplied} isActive={isActive} />
              )}
            </div>
          </div>
        </div>

        {/* Score + Break */}
        <div className="p-[min(2vh,2vw)] flex flex-col gap-[min(2.5vh,2.5vw)] justify-center items-center flex-1 ">
          <p
            className={`font-semibold text-[min(24vh,24vw)] text-box-trim ${isActive ? 'text-[#F5F85F]' : 'text-score-text'}`}
          >
            {score}
          </p>
          <div className={clsx('flex flex-col items-center gap-3', breakScore != null ? 'visible' : 'invisible')}>
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

        {/* Balls (snooker only) */}
        {sport === 'SNOOKER' && (
          <div
            className="border-t-2 [border-image-slice:1] py-[min(1.4vh,1.4vw)] flex flex-col items-center gap-[min(0.7vh,0.7vw)]"
            style={{
              borderImageSource: isActive
                ? 'linear-gradient(90deg,rgba(223,227,115,0) 5%,rgba(223,227,115,0.7) 45%,rgba(223,227,115,0.7) 60%,rgba(223,227,115,0) 82.24%)'
                : 'linear-gradient(90deg,rgba(227,139,249,0) 5%,rgba(227,139,249,0.7) 45%,rgba(227,139,249,0.7) 60%,rgba(227,139,249,0) 82.24%)',
            }}
          >
            <BallGrid balls={balls} />
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
          'bg-white/5 rounded-[6px] flex items-center h-[min(3.5vh,3.5vw)] w-fit overflow-hidden shrink-0 shadow-[inset_0px_2px_4px_0px_#FFFFFF40]',
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
