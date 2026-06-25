import { useState, useEffect } from 'react';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import PinkBorderSVG from '@/components/PinkBorderSVG';
import YellowBorderSVG from '@/components/YellowBorderSVG';
import { ScoreBoardState } from '@/hooks/useScoreboard';
import { getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import { getSnookerPointTypesByTurns } from '@/stores/selectors/snookerSelector';
import { convertHandicapToString, formatTime } from '@/utils/functions';
import { SnookerPointType } from '@/stores/types';
import clsx from 'clsx';

const BALL_IMAGE_MAP: Partial<Record<SnookerPointType, string>> = {
  [SnookerPointType.RED]: '/images/balls/red-ball.svg',
  [SnookerPointType.YELLOW]: '/images/balls/yellow-ball.svg',
  [SnookerPointType.GREEN]: '/images/balls/green-ball.svg',
  [SnookerPointType.BROWN]: '/images/balls/brown-ball.svg',
  [SnookerPointType.BLUE]: '/images/balls/blue-ball.svg',
  [SnookerPointType.PINK]: '/images/balls/pink-ball.svg',
  [SnookerPointType.BLACK]: '/images/balls/black-ball.svg',
  [SnookerPointType.FOUL]: '/images/balls/placeholder-ball.svg',
};
import TimerDial from './TimerDial';
import { ProfileCard } from '@/components/ProfileCard';
import { useFluidPx } from '@/hooks/useFluidPx';

interface NewScoreBoardProps {
  state: ScoreBoardState;
  timeLeft: number;
}

const NewScoreBoard = ({ state, timeLeft }: NewScoreBoardProps) => {
  const [elapsed, setElapsed] = useState(() =>
    state.actualStartTime ? Math.floor((Date.now() - new Date(state.actualStartTime).getTime()) / 1000) : 0,
  );

  useEffect(() => {
    if (!state.actualStartTime) return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - new Date(state.actualStartTime!).getTime()) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [state.actualStartTime]);

  const activeSet = getActiveSet(state.sets);
  const activeTurn = getActiveTurn(activeSet);
  const isTeamOneActive =
    state.sideOnePlayerOne?.id === state.activePlayerId || state.sideOnePlayerTwo?.id === state.activePlayerId;
  const isTeamTwoActive =
    state.sideTwoPlayerOne?.id === state.activePlayerId || state.sideTwoPlayerTwo?.id === state.activePlayerId;

  const teamOneFrameScore = activeSet ? activeSet.teamOneScore : 0;
  const teamTwoFrameScore = activeSet ? activeSet.teamTwoScore : 0;

  const noOfFrames = state.tournamentId === null ? state.sets.length : state.noOfFrames || 0;

  const isTeamReveresed =
    state.tournamentId && state.tournamentSubItem
      ? state.tournamentSubItem?.tournamentItem.tournamentTeamOneId !== state.tournamentTeamOneId
      : false;

  const tournamentTeamOneScore = state.tournamentSubItem
    ? state.showCummulativeScoreInCombination
      ? isTeamReveresed
        ? (state.tournamentSubItem.tournamentItem.teamTwoCumulativeFinalFrameScore ?? 0)
        : (state.tournamentSubItem.tournamentItem.teamOneCumulativeFinalFrameScore ?? 0)
      : isTeamReveresed
        ? state.tournamentSubItem.tournamentItem.teamTwoScore
        : state.tournamentSubItem.tournamentItem.teamOneScore
    : null;

  const tournamentTeamTwoScore = state.tournamentSubItem
    ? state.showCummulativeScoreInCombination
      ? isTeamReveresed
        ? (state.tournamentSubItem.tournamentItem.teamOneCumulativeFinalFrameScore ?? 0)
        : (state.tournamentSubItem.tournamentItem.teamTwoCumulativeFinalFrameScore ?? 0)
      : isTeamReveresed
        ? state.tournamentSubItem.tournamentItem.teamOneScore
        : state.tournamentSubItem.tournamentItem.teamTwoScore
    : null;

  const teamOneHandicap =
    state.showLatestHandicapInCombination && state.tournamentSubItem
      ? isTeamReveresed
        ? (state.tournamentSubItem.tournamentItem.teamTwoLastestGameHandicap ?? state.teamOneHandicap)
        : (state.tournamentSubItem.tournamentItem.teamOneLastestGameHandicap ?? state.teamOneHandicap)
      : state.teamOneHandicap;

  const teamTwoHandicap =
    state.showLatestHandicapInCombination && state.tournamentSubItem
      ? isTeamReveresed
        ? (state.tournamentSubItem.tournamentItem.teamOneLastestGameHandicap ?? state.teamTwoHandicap)
        : (state.tournamentSubItem.tournamentItem.teamTwoLastestGameHandicap ?? state.teamTwoHandicap)
      : state.teamTwoHandicap;

  const teamOneBalls =
    state.sport === 'SNOOKER'
      ? getSnookerPointTypesByTurns(
          activeSet?.turns?.filter(
            (turn) =>
              turn.turnPlayerId === state.sideOnePlayerOne.id || turn.turnPlayerId === state.sideOnePlayerTwo?.id,
          ) || [],
        )
      : [];

  const teamTwoBalls =
    state.sport === 'SNOOKER'
      ? getSnookerPointTypesByTurns(
          activeSet?.turns?.filter(
            (turn) =>
              turn.turnPlayerId === state.sideTwoPlayerOne.id || turn.turnPlayerId === state.sideTwoPlayerTwo?.id,
          ) || [],
        )
      : [];

  const isDoubles = !!state.sideOnePlayerTwo;

  const footerLabel =
    state.tournamentId && state.tournamentSubItem
      ? `GAME #${state.tournamentSubItem.gameFormat.matchNo} | ${state.tournamentSubItem.gameFormat.name} | ${state.tournamentSubItem.tournamentItem.tournamentPhase.name}`
      : state.format;

  const teamScoreCenter =
    state.tournamentId && state.tournamentSubItem && state.showFormatsAsGameNumber && state.eventFormat === 'TEAMS'
      ? `${state.tournamentSubItem.gameFormat.matchNo}/${state.tournamentSubItem.tournamentItem.tournamentPhase.tournamentFormats.length}`
      : noOfFrames
        ? `(${noOfFrames})`
        : null;

  return (
    <main className="bg-[url(/score-card-bg-pattern.png)] bg-cover bg-center h-screen px-[min(5.6vh,5.6vw)] py[min(3.7vh,3.7vw)] bg-no-repeat flex flex-col justify-between overflow-hidden gap-[min(6.5vh,6.5vw)]">
      {/* Header */}
      <div className="grid grid-cols-3 items-center border-b-2 py-[min(1.9vh,1.9vw)] [border-image-source:linear-gradient(90deg,rgba(227,139,249,0)_13.13%,rgba(227,139,249,0.8)_49.22%,rgba(227,139,249,0)_87.72%)] [border-image-slice:1]">
        <div className="flex items-center gap-[min(2.6vh,2.6vw)] py-[min(1.1vh,1.1vw)] w-fit justify-self-start">
          <ImageWithFallback
            className="object-cover size-[min(5.9vh,5.9vw)]"
            fallback="/images/user-dummy-pic.jpg"
            src={state.clubLogo ?? ''}
          />
          <p className="text-score-text font-semibold text-[min(3.3vh,3.3vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase">
            {state.tournamentId && state.tournamentSubItem ? state.tournamentName : state.clubName}
          </p>
        </div>

        <ImageWithFallback
          className="justify-self-center w-[min(37vh,37vw)] h-auto"
          fallback="/images/clubliv-final-logo.png"
          src="/images/logos/clubliv-logo.svg"
        />

        <p className="text-score-text font-semibold text-[min(3.3vh,3.3vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-end">
          match time {formatTime(elapsed)}
        </p>
      </div>

      {/* Cards + Center */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-[min(6.7vh,6.7vw)] items-stretch px-[min(4vw,4vh)]">
        {/* Card 1 - Team One */}
        <PlayerCard
          isActive={isTeamOneActive}
          profilePhoto={state.teamOneLogo ?? state.sideOnePlayerOne.profilePhoto ?? null}
          profilePhoto2={isDoubles ? (state.sideOnePlayerTwo?.profilePhoto ?? null) : undefined}
          playerOneName={state.sideOnePlayerOne.name}
          playerTwoName={state.sideOnePlayerTwo?.name}
          isDoubles={isDoubles}
          isPlayerOneActive={state.activePlayerId === state.sideOnePlayerOne.id}
          handicap={teamOneHandicap}
          isHandicapApplied={state.isTeamOneHandicapApplied}
          score={teamOneFrameScore}
          breakScore={isTeamOneActive ? activeTurn?.score : undefined}
          sport={state.sport}
          balls={teamOneBalls}
          breakSide="right"
        />

        {/* Center Panel */}
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
          <div className="rounded-[min(5.1vh,5.1vw)] py-[min(4.1vh,4.1vw)] bg-[linear-gradient(180deg,#371E56_0%,#0D0624_100%)] h-full flex flex-col justify-between shrink-0">
            {/* Team / Tournament Score */}
            {state.tournamentId && state.tournamentSubItem ? (
              <div className="space-y-[min(2.2vh,2.2vw)]">
                <p className="text-text-light font-semibold text-[min(2.8vh,2.8vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase text-center">
                  Team Score
                </p>
                <div className="border-y border-white/[.12] grid grid-cols-3 place-items-center">
                  <p className="text-score-text font-semibold text-[min(2.8vh,2.8vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase size-[min(7.4vh,7.4vw)] flex justify-center items-center">
                    {tournamentTeamOneScore}
                  </p>
                  <p className="text-score-text font-semibold text-[min(2.8vh,2.8vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase border-x h-full text-center flex justify-center items-center size-[min(7.4vh,7.4vw)] [border-image-source:linear-gradient(180deg,rgba(255,255,255,0.12)_-11.88%,#FFFFFF_55.63%,rgba(255,255,255,0.12)_123.13%)] [border-image-slice:1]">
                    {teamScoreCenter}
                  </p>
                  <p className="text-score-text font-semibold text-[min(2.8vh,2.8vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase text-center size-[min(7.4vh,7.4vw)] flex justify-center items-center">
                    {tournamentTeamTwoScore}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-[min(2.2vh,2.2vw)]">
                <p className="text-text-light font-semibold text-[min(2.8vh,2.8vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase text-center px-[min(2vw,2vh)]">
                  Frames Score
                </p>
                <div className="border-y border-white/[.12] grid grid-cols-3 place-items-center">
                  <p className="text-score-text font-semibold text-[min(2.8vh,2.8vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase size-[min(7.4vh,7.4vw)] flex justify-center items-center bg-[#595959]/[0.20] w-full">
                    {state.teamOneScore}
                  </p>
                  {teamScoreCenter && (
                    <p className="text-score-text font-semibold text-[min(2.8vh,2.8vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase border-x h-full text-center flex justify-center items-center size-[min(7.4vh,7.4vw)] [border-image-source:linear-gradient(180deg,rgba(255,255,255,0.12)_-11.88%,#FFFFFF_55.63%,rgba(255,255,255,0.12)_123.13%)] [border-image-slice:1] w-full">
                      {teamScoreCenter}
                    </p>
                  )}
                  <p className="text-score-text font-semibold text-[min(2.8vh,2.8vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase text-center size-[min(7.4vh,7.4vw)] flex justify-center items-center bg-[#595959]/[0.20] w-full">
                    {state.teamTwoScore}
                  </p>
                </div>
              </div>
            )}

            {/* Timer Dial */}
            <TimerDial timeLeft={timeLeft} />

            {/* Game Score */}
            <div className="space-y-[min(2.2vh,2.2vw)]">
              <p className="text-text-light font-semibold text-[min(2.8vh,2.8vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase text-center">
                game score
              </p>
              <div className="border-y border-white/[.12] grid grid-cols-3 place-items-center">
                <p className="text-score-text font-semibold text-[min(2.8vh,2.8vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase size-[min(7.4vh,7.4vw)] flex justify-center items-center bg-[#595959]/[0.20] w-full">
                  {teamOneFrameScore}
                </p>
                <p className="text-score-text font-semibold text-[min(2.8vh,2.8vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase border-x h-full text-center flex justify-center items-center size-[min(7.4vh,7.4vw)] [border-image-source:linear-gradient(180deg,rgba(255,255,255,0.12)_-11.88%,#FFFFFF_55.63%,rgba(255,255,255,0.12)_123.13%)] [border-image-slice:1] w-full">
                  {teamScoreCenter}
                </p>
                <p className="text-score-text font-semibold text-[min(2.8vh,2.8vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase text-center size-[min(7.4vh,7.4vw)] flex justify-center items-center bg-[#595959]/[0.20] w-full">
                  {teamTwoFrameScore}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 - Team Two */}
        <PlayerCard
          isActive={isTeamTwoActive}
          profilePhoto={state.teamTwoLogo ?? state.sideTwoPlayerOne.profilePhoto ?? null}
          profilePhoto2={isDoubles ? (state.sideTwoPlayerTwo?.profilePhoto ?? null) : undefined}
          playerOneName={state.sideTwoPlayerOne.name}
          playerTwoName={state.sideTwoPlayerTwo?.name}
          isDoubles={isDoubles}
          isPlayerOneActive={state.activePlayerId === state.sideTwoPlayerOne.id}
          handicap={teamTwoHandicap}
          isHandicapApplied={state.isTeamTwoHandicapApplied}
          score={teamTwoFrameScore}
          breakScore={isTeamTwoActive ? activeTurn?.score : undefined}
          sport={state.sport}
          balls={teamTwoBalls}
          breakSide="left"
        />
      </div>

      {/* Footer */}
      <div className="grid grid-cols-3 items-center border-t-2 [border-image-source:linear-gradient(90deg,rgba(227,139,249,0)_13.13%,rgba(227,139,249,0.8)_49.22%,rgba(227,139,249,0)_87.72%)] [border-image-slice:1] py-[min(1.7vh,1.7vw)] px-[min(2.5vw,2.5vh)]">
        <p className="text-score-text font-semibold text-[min(3.3vh,3.3vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-start py-[min(0.9vh,0.9vw)]">
          {footerLabel}
        </p>
        <div className="justify-self-center bg-[url(/table-number-bg.svg)] bg-no-repeat bg-contain relative h-[min(5.9vh,5.9vw)] w-[min(26.8vh,26.8vw)]">
          <div className="px-[min(1.5vh,1.5vw)] absolute inset-0 flex justify-center items-center">
            <p className="text-score-text font-semibold text-[min(3.3vh,3.3vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase">
              table {state.venueNo}
            </p>
          </div>
        </div>
        <p className="text-score-text font-semibold text-[min(3.3vh,3.3vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-end py-[min(0.9vh,0.9vw)]">
          {state.sport}
        </p>
      </div>
    </main>
  );
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
}

function PlayerCard({
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
}: PlayerCardProps) {
  const profileSizeSingle = useFluidPx(0.11); // ≈119px at 1080p
  const profileSizeDoubles = useFluidPx(0.1); // ≈108px at 1080p

  // Active player's photo goes to the front
  const frontPhoto = isPlayerOneActive ? profilePhoto : (profilePhoto2 ?? profilePhoto);
  const backPhoto = isPlayerOneActive ? (profilePhoto2 ?? profilePhoto) : profilePhoto;

  return (
    <div className="relative w-full h-full backdrop-blur-lg">
      {isActive ? <YellowBorderSVG /> : <PinkBorderSVG />}
      <div className="relative z-10 h-full flex flex-col p-[min(1.9vh,1.9vw)]">
        {/* Player info */}
        <div className="border-b p-[min(3vh,3vw)] border-white/10 flex gap-[min(1.5vh,1.5vw)]">
          {/* Profile image */}
          {isDoubles && profilePhoto2 !== undefined ? (
            <div className="relative shrink-0 size-[min(14vh,14vw)]">
              <div className="absolute top-0 left-0" style={{ zIndex: 1 }}>
                <ProfileCard imageUrl={backPhoto ?? '/images/empty-user.svg'} size={profileSizeDoubles} />
              </div>
              <div className="absolute bottom-0 right-0" style={{ zIndex: 2 }}>
                <ProfileCard imageUrl={frontPhoto ?? '/images/empty-user.svg'} size={profileSizeDoubles} />
              </div>
            </div>
          ) : (
            <ProfileCard imageUrl={profilePhoto ?? '/images/empty-user.svg'} size={profileSizeSingle} />
          )}

          {/* Player name(s) + handicap */}
          <div className="flex flex-col justify-center gap-[min(1.1vh,1.1vw)] min-w-0 flex-1">
            <div className="flex items-center justify-between gap-[min(1.5vh,1.5vw)] w-full">
              <p className="font-medium text-[min(3.7vh,3.7vw)] leading-[130%] uppercase text-score-text text-box-trim truncate text-wrap line-clamp-2">
                {isDoubles ? (isPlayerOneActive ? playerOneName : playerTwoName) : playerOneName}
              </p>
              {handicap != null && <HandicapPill handicap={handicap} isApplied={isHandicapApplied} />}
            </div>

            {isDoubles && playerTwoName && (
              <>
                <div
                  className="w-full h-[2px]"
                  style={{
                    background: isActive
                      ? 'linear-gradient(90deg,rgba(223,227,115,0) 5%,rgba(223,227,115,0.7) 45%,rgba(223,227,115,0.7) 60%,rgba(223,227,115,0) 82.24%)'
                      : 'linear-gradient(90deg,rgba(227,139,249,0) 5%,rgba(227,139,249,0.7) 45%,rgba(227,139,249,0.7) 60%,rgba(227,139,249,0) 82.24%)',
                  }}
                />
                <div className="flex items-center justify-between gap-[min(1.5vh,1.5vw)] w-full">
                  <p className="font-medium text-[min(3.7vh,3.7vw)] leading-[130%] uppercase text-score-text text-box-trim truncate">
                    {isPlayerOneActive ? playerTwoName : playerOneName}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Score + Break */}
        <div className="p-[min(3vh,3vw)] relative">
          <p className="font-semibold leading-[130%] uppercase text-score-text text-[min(18.5vh,18.5vw)] pl-[min(12.5vw,12.5vh)]">
            {score}
          </p>
          {breakScore != null && (
            <div className={clsx('absolute text-white top-1/2 -translate-y-[70%] right-[min(0.7vh,0.7vw)]')}>
              <p
                className={clsx(
                  'font-semibold text-[min(2.4vh,2.4vw)] leading-[130%] uppercase text-sandy-yellow px-[min(1.5vh,1.5vw)] text-right',
                )}
              >
                Break
              </p>
              <div
                className={clsx(
                  'px-[min(1.9vh,1.9vw)] bg-[linear-gradient(69.46deg,rgba(172,236,84,0.078)_12.28%,rgba(111,255,0,0.6)_179.54%)] shadow-[0px_2px_4px_0px_#FFFFFF40_inset] break-card pt-1',
                )}
              >
                <p className="font-semibold text-[min(8.3vh,8.3vw)] leading-[130%] uppercase text-sandy-yellow px-[min(1.5vh,1.5vw)]">
                  {breakScore}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Balls (snooker only) */}
        {sport === 'SNOOKER' && (
          <div
            className="border-t-2 [border-image-slice:1] px-[min(3vh,3vw)] pt-[min(1.9vh,1.9vw)] pb-[min(3vh,3vw)] flex flex-col items-center gap-[min(0.7vh,0.7vw)]"
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

function HandicapPill({ handicap, isApplied }: { handicap: number; isApplied?: boolean }) {
  return (
    <div className="bg-white/5 rounded-full shadow-[0px_2px_4px_0px_#FFFFFF40_inset] flex items-center h-[min(4.6vh,4.6vw)] w-fit overflow-hidden shrink-0">
      <div className="bg-sandy-yellow flex justify-center items-center px-[min(1.5vh,1.5vw)] h-full">
        <p
          className={clsx(
            'font-medium text-[min(3.7vh,3.7vw)] leading-[130%] uppercase text-black text-box-trim py-[min(0.9vh,0.9vw)]',
            {
              'line-through': isApplied,
            },
          )}
        >
          {convertHandicapToString(handicap)}
        </p>
      </div>
      <span className="font-medium text-[min(3.7vh,3.7vw)] leading-[130%] uppercase text-score-text text-box-trim inline-block px-[min(1.5vh,1.5vw)] py-[min(0.9vh,0.9vw)]">
        h
      </span>
    </div>
  );
}

const BALLS_PER_ROW = 11;
const TOTAL_SLOTS = BALLS_PER_ROW * 2; // fixed 22 slots, always 2 rows

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
    <>
      <div className="flex gap-[min(0.5vh,0.5vw)]">
        {slots.slice(0, BALLS_PER_ROW).map((src, i) => (
          <img key={i} src={src} className="size-[min(4vh,4vw)] object-contain" />
        ))}
      </div>
      <div className="flex gap-[min(0.5vh,0.5vw)]">
        {slots.slice(BALLS_PER_ROW).map((src, i) => (
          <img key={i} src={src} className="size-[min(4vh,4vw)] object-contain" />
        ))}
      </div>
    </>
  );
}

export default NewScoreBoard;
