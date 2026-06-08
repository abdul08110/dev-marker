import ImageWithFallback from '@/components/ui/image-with-fallback';
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

interface NewScoreBoardProps {
  state: ScoreBoardState;
  timeLeft: number;
}

const NewScoreBoard = ({ state, timeLeft }: NewScoreBoardProps) => {
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
    <main className="bg-[url(/score-card-bg-pattern.png)] bg-cover bg-center min-h-screen px-10 py-7 bg-no-repeat flex flex-col justify-between gap-[70px]">
      {/* Header */}
      <div className="grid grid-cols-3 items-center border-b-2 py-5 [border-image-source:linear-gradient(90deg,rgba(227,139,249,0)_13.13%,rgba(227,139,249,0.8)_49.22%,rgba(227,139,249,0)_87.72%)] [border-image-slice:1]">
        <div className="flex items-center gap-7 py-3 w-fit justify-self-start">
          <ImageWithFallback
            className="object-cover size-16"
            fallback="/images/user-dummy-pic.png"
            src={state.clubLogo ?? ''}
          />
          <p className="text-score-text font-semibold text-4xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase">
            {state.tournamentId && state.tournamentSubItem ? state.tournamentName : state.clubName}
          </p>
        </div>

        <ImageWithFallback
          className="object-cover justify-self-center"
          width={400}
          height={115}
          fallback="/images/clubliv-final-logo.png"
          src={'/images/logos/clubliv-logo.svg'}
        />

        <p className="text-score-text font-semibold text-4xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-end">
          match time {formatTime(timeLeft)}
        </p>
      </div>

      {/* Cards + Center */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-12 items-stretch">
        {/* Card 1 - Team One */}
        <PlayerCard
          isActive={isTeamOneActive}
          profilePhoto={state.teamOneLogo ?? state.sideOnePlayerOne.profilePhoto ?? null}
          profilePhoto2={isDoubles ? (state.sideOnePlayerTwo?.profilePhoto ?? null) : undefined}
          playerOneName={state.sideOnePlayerOne.name}
          playerTwoName={state.sideOnePlayerTwo?.name}
          isDoubles={isDoubles}
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
          className="rounded-[60px] p-[5px] h-full"
          style={{
            background: `
              linear-gradient(233.61deg,#FFECFF -11.62%,rgba(255,255,255,0) 50.44%),
              linear-gradient(172.2deg,rgba(191,178,247,0) 71.46%,#E8B2F7 107.96%),
              linear-gradient(347.86deg,rgba(210,154,245,0) 13.85%,#F4D3F2 105.37%)
            `,
            boxShadow: `
              0px 0px 16px 0px #FFEDFF,
              10px 10px 28px 0px #0F0B23CC,
              -11px 0px 24px 0px #0E0B24CC
            `,
          }}
        >
          <div className="rounded-[55px] py-11 bg-[linear-gradient(180deg,#371E56_0%,#0D0624_100%)] h-full flex flex-col justify-between">
            {/* Team / Tournament Score */}
            {state.tournamentId && state.tournamentSubItem ? (
              <div className="space-y-6">
                <p className="text-text-light font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase text-center">
                  Team Score
                </p>
                <div className="border-y border-white/[.12] grid grid-cols-3 place-items-center">
                  <p className="text-score-text font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase size-20 flex justify-center items-center">
                    {tournamentTeamOneScore}
                  </p>
                  <p className="text-score-text font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase border-x h-full text-center flex justify-center items-center size-20 [border-image-source:linear-gradient(180deg,rgba(255,255,255,0.12)_-11.88%,#FFFFFF_55.63%,rgba(255,255,255,0.12)_123.13%)] [border-image-slice:1]">
                    {teamScoreCenter}
                  </p>
                  <p className="text-score-text font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase text-center size-20 flex justify-center items-center">
                    {tournamentTeamTwoScore}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-text-light font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase text-center">
                  Frames Won
                </p>
                <div className="border-y border-white/[.12] grid grid-cols-3 place-items-center">
                  <p className="text-score-text font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase size-20 flex justify-center items-center">
                    {state.teamOneScore}
                  </p>
                  {teamScoreCenter && (
                    <p className="text-score-text font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase border-x h-full text-center flex justify-center items-center size-20 [border-image-source:linear-gradient(180deg,rgba(255,255,255,0.12)_-11.88%,#FFFFFF_55.63%,rgba(255,255,255,0.12)_123.13%)] [border-image-slice:1]">
                      {teamScoreCenter}
                    </p>
                  )}
                  <p className="text-score-text font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase text-center size-20 flex justify-center items-center">
                    {state.teamTwoScore}
                  </p>
                </div>
              </div>
            )}

            {/* Timer Dial */}
            <TimerDial timeLeft={timeLeft} />

            {/* Game Score */}
            <div className="space-y-6">
              <p className="text-text-light font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase text-center">
                game score
              </p>
              <div className="border-y border-white/[.12] grid grid-cols-3 place-items-center">
                <p className="text-score-text font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase size-20 flex justify-center items-center">
                  {teamOneFrameScore}
                </p>
                <p className="text-score-text font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase border-x h-full text-center flex justify-center items-center size-20 [border-image-source:linear-gradient(180deg,rgba(255,255,255,0.12)_-11.88%,#FFFFFF_55.63%,rgba(255,255,255,0.12)_123.13%)] [border-image-slice:1]">
                  {teamScoreCenter}
                </p>
                <p className="text-score-text font-semibold text-3xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase text-center size-20 flex justify-center items-center">
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
      <div className="grid grid-cols-3 items-center border-t-2 [border-image-source:linear-gradient(90deg,rgba(227,139,249,0)_13.13%,rgba(227,139,249,0.8)_49.22%,rgba(227,139,249,0)_87.72%)] [border-image-slice:1] py-[18px]">
        <p className="text-score-text font-semibold text-4xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-start py-2.5">
          {footerLabel}
        </p>
        <div className="justify-self-center bg-[url(/table-number-bg.svg)] bg-no-repeat relative h-16 w-[289px]">
          <div className="px-4 absolute inset-0 flex justify-center items-center">
            <p className="text-score-text font-semibold text-4xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-end py-2.5">
              table {state.venueNo}
            </p>
          </div>
        </div>
        <p className="text-score-text font-semibold text-4xl drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-end py-2.5">
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
  handicap,
  isHandicapApplied,
  score,
  breakScore,
  sport,
  balls,
  breakSide,
}: PlayerCardProps) {
  return (
    <div className="w-full h-full border rounded-[60px] overflow-hidden p-2">
      <div
        className={clsx('border-[6px] rounded-[60px] backdrop-blur-sm h-full flex flex-col', {
          'shadow-[0px_3px_21px_0px_#DCF756]': isActive,
          'shadow-[0px_3px_21px_0px_rgba(255,255,255,0.1)]': !isActive,
        })}
      >
        {/* Player info */}
        <div className="border-b p-8 border-white/10 flex gap-4">
          {/* Profile image */}
          {isDoubles && profilePhoto2 !== undefined ? (
            <div className="relative shrink-0 size-[150px]">
              {/* Back image */}
              <div
                className="absolute top-0 left-0 bg-[#FFD400] p-[2px] size-[110px] rounded-xl overflow-hidden"
                style={{ clipPath: 'polygon(20px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20px)', zIndex: 1 }}
              >
                <ImageWithFallback
                  style={{ clipPath: 'polygon(20px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20px)' }}
                  className="object-cover rounded-xl w-full h-full"
                  fallback="/images/user-dummy-pic.png"
                  src={profilePhoto ?? '/images/user-dummy-pic.png'}
                />
              </div>
              {/* Front image */}
              <div
                className="absolute bottom-0 right-0 bg-[#FFD400] p-[2px] size-[110px] rounded-xl overflow-hidden"
                style={{ clipPath: 'polygon(20px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20px)', zIndex: 2 }}
              >
                <ImageWithFallback
                  style={{ clipPath: 'polygon(20px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20px)' }}
                  className="object-cover rounded-xl w-full h-full"
                  fallback="/images/user-dummy-pic.png"
                  src={profilePhoto2 ?? '/images/user-dummy-pic.png'}
                />
              </div>
            </div>
          ) : (
            <div
              className="bg-[#FFD400] p-[2px] size-[120px] relative rounded-xl overflow-hidden shrink-0"
              style={{ clipPath: 'polygon(24px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 24px)' }}
            >
              <ImageWithFallback
                style={{ clipPath: 'polygon(24px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 24px)' }}
                className="object-cover rounded-xl w-full h-full"
                fallback="/images/user-dummy-pic.png"
                src={profilePhoto ?? '/images/user-dummy-pic.png'}
              />
            </div>
          )}

          {/* Player name(s) + handicap */}
          <div className="flex flex-col justify-center gap-3 min-w-0 flex-1">
            <div className="flex items-center justify-between gap-4 w-full">
              <p className="font-medium text-[40px] leading-[130%] uppercase text-score-text text-box-trim truncate">
                {playerOneName}
              </p>
              {handicap != null && <HandicapPill handicap={handicap} isApplied={isHandicapApplied} />}
            </div>

            {isDoubles && playerTwoName && (
              <>
                <div className="w-full h-[2px] bg-[linear-gradient(90deg,rgba(223,227,115,0)_5%,rgba(223,227,115,0.7)_45%,rgba(223,227,115,0.7)_60%,rgba(223,227,115,0)_82.24%)]" />
                <div className="flex items-center justify-between gap-4 w-full">
                  <p className="font-medium text-[40px] leading-[130%] uppercase text-score-text text-box-trim truncate">
                    {playerTwoName}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Score + Break */}
        <div className="p-8 relative flex justify-center items-center flex-1">
          <p className="font-semibold leading-[130%] uppercase text-score-text text-[12.5rem]">{score}</p>
          {breakScore != null && (
            <div className={clsx('absolute text-white top-1/2 -translate-y-1/2 right-0')}>
              <p
                className={clsx('font-semibold text-[26px] leading-[130%] uppercase text-sandy-yellow px-4 text-right')}
              >
                Break
              </p>
              <div
                className={clsx(
                  'px-5 bg-[linear-gradient(69.46deg,rgba(172,236,84,0.078)_12.28%,rgba(111,255,0,0.6)_179.54%)] shadow-[0px_2px_4px_0px_#FFFFFF40_inset] break-card',
                )}
              >
                <p className="font-semibold text-[90px] leading-[130%] uppercase text-sandy-yellow px-4">
                  {breakScore}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Balls (snooker only) */}
        {sport === 'SNOOKER' && (
          <div className="border-t-2 px-8 py-5 [border-image-source:linear-gradient(90deg,rgba(223,227,115,0)_5%,rgba(223,227,115,0.7)_45%,rgba(223,227,115,0.7)_60%,rgba(223,227,115,0)_82.24%)] [border-image-slice:1] flex flex-col items-center gap-2">
            <BallGrid balls={balls} />
          </div>
        )}
      </div>
    </div>
  );
}

function HandicapPill({ handicap, isApplied }: { handicap: number; isApplied?: boolean }) {
  return (
    <div className="bg-white/5 rounded-full shadow-[0px_2px_4px_0px_#FFFFFF40_inset] flex items-center h-[50px] w-fit overflow-hidden shrink-0">
      <div className="bg-sandy-yellow flex justify-center items-center px-4 h-full">
        <p
          className={clsx('font-medium text-[40px] leading-[130%] uppercase text-black text-box-trim py-2.5', {
            'line-through': isApplied,
          })}
        >
          {convertHandicapToString(handicap)}
        </p>
      </div>
      <span className="font-medium text-[40px] leading-[130%] uppercase text-score-text text-box-trim inline-block px-4 py-2.5">
        h
      </span>
    </div>
  );
}

const BALLS_PER_ROW = 15;

function BallGrid({ balls }: { balls: SnookerPointType[][] }) {
  const potted = balls
    .flatMap((turnBalls) => turnBalls)
    .filter((type): type is SnookerPointType => type in BALL_IMAGE_MAP);

  // Always keep at least one full row of placeholders beyond the potted balls
  const rowsNeeded = Math.max(2, Math.ceil(potted.length / BALLS_PER_ROW) + 1);
  const totalSlots = rowsNeeded * BALLS_PER_ROW;

  const slots = Array.from({ length: totalSlots }, (_, i) =>
    i < potted.length ? BALL_IMAGE_MAP[potted[i]]! : '/images/balls/placeholder-ball.svg',
  );

  const rows = Array.from({ length: rowsNeeded }, (_, r) => slots.slice(r * BALLS_PER_ROW, (r + 1) * BALLS_PER_ROW));

  return (
    <>
      {rows.map((row, r) => (
        <div key={r} className="flex gap-1">
          {row.map((src, i) => (
            <img key={i} src={src} className="size-8 object-contain" />
          ))}
        </div>
      ))}
    </>
  );
}

export default NewScoreBoard;
