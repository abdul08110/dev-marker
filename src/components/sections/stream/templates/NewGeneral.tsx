import { useState } from 'react';
import { StreamingState } from '@/hooks/useStreaming';
import { Set, Turn } from '@/stores/types';
import { convertHandicapToString, generatePlayerName } from '@/utils/functions';
import { ProfileCard } from '@/components/ProfileCard';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import { useFluidPx } from '@/hooks/useFluidPx';
import { cn, getRandomPlaceholderProfileImage } from '@/lib/utils';
import clsx from 'clsx';
import { useStopClockTick } from '@/hooks/useStopClockTick';
import ShotClockTicker from '@/pages/app/Score-board/ShotClockTicker';
import { formatClockMs } from '@/utils/stopClock';

interface GeneralTemplateProps {
  state: StreamingState;
  activeTurn: Turn | null;
  activeSet: Set | undefined;
  isTv: boolean;
}

const YELLOW_CARD_STYLE = {
  background:
    'radial-gradient(50% 50% at 50% 50%, #39205C 0%, #181332 100%) padding-box, linear-gradient(144.83deg, rgba(213, 255, 154, 0.02) -0.26%, #C1F052 34.38%, #AAEA4B 58.47%, #B7F47B 92.16%) border-box',
  border: '1px solid transparent',
};

const PINK_CARD_STYLE = {
  background:
    'linear-gradient(180deg, #371E56 0%, #0D0624 100%) padding-box, linear-gradient(144.83deg, rgba(210, 154, 245, 0.09) -0.26%, #B079E3 34.38%, #E38BF9 58.47%, #E38BF9 92.16%) border-box',
  border: '1px solid transparent',
};

const NewGeneral = (props: GeneralTemplateProps) => {
  const { state, activeTurn, activeSet } = props;
  const isDoubles = !!state.sideOnePlayerTwo;
  const hasTeamName = !!(state.teamOneName || state.teamTwoName);
  const isTournament = !!state.tournamentId;
  const isSideOneActive =
    !!state.activePlayerId &&
    (state.activePlayerId === state.sideOnePlayerOne.id || state.activePlayerId === state.sideOnePlayerTwo?.id);

  const isSideTwoActive =
    !!state.activePlayerId &&
    (state.activePlayerId === state.sideTwoPlayerOne.id || state.activePlayerId === state.sideTwoPlayerTwo?.id);

  const stopClockTick = useStopClockTick(state.stopClockState, state.stopClockFrameTimeInSeconds);
  const showStopClock = !!state.isStopClockEnabled && state.sport === 'SNOOKER';

  const breakScore = activeTurn?.score ?? 0;

  // Total frames for the format — for tournament matches this is the configured
  // noOfFrames (e.g. "race to 4"), not the number of frames played so far.
  const noOfFrames = state.tournamentId === null ? state.sets.length : state.noOfFrames || 0;
  const teamScoreCenter =
    state.tournamentId && state.tournamentSubItem && state.showFormatsAsGameNumber && state.eventFormat === 'TEAMS'
      ? `${state.tournamentSubItem.tournamentItem.tournamentPhase.tournamentFormats.length}`
      : noOfFrames
        ? `${noOfFrames}`
        : null;

  // Tournament "frames won" score can be a combination score (cumulative across
  // games in the combo) rather than this individual match's own teamOne/teamTwoScore.
  const hasTournamentCombo = !!(state.tournamentId && state.tournamentSubItem);
  const isTeamReveresed = hasTournamentCombo
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

  const displayTeamOneScore = hasTournamentCombo ? tournamentTeamOneScore : state.teamOneScore;
  const displayTeamTwoScore = hasTournamentCombo ? tournamentTeamTwoScore : state.teamTwoScore;

  // Stable per-slot fallback avatars — one each for sideOnePlayerOne/Two, sideTwoPlayerOne/Two
  const [defaultImages] = useState(() => Array.from({ length: 4 }, () => getRandomPlaceholderProfileImage()));

  // Fluid px for ProfileCard — mirrors min(Xvh, Xvw) via the shared hook
  const profileSize = useFluidPx(0.067); // ≈ 72px at 1080p, matches size-[min(6.7vh,6.7vw)]
  const profileSizeSm = useFluidPx(0.05); // ≈ 54px at 1080p, matches size-[min(5vh,5vw)]

  const leftCardStyle = isSideOneActive ? YELLOW_CARD_STYLE : PINK_CARD_STYLE;
  const rightCardStyle = isSideTwoActive ? YELLOW_CARD_STYLE : PINK_CARD_STYLE;
  const leftShadow = isSideOneActive
    ? 'shadow-[0px_2px_6px_0px_rgba(220,247,86,0.4)]'
    : 'shadow-[0px_2px_5px_0px_rgba(227,139,249,0.25)]';
  const rightShadow = isSideTwoActive
    ? 'shadow-[0px_2px_6px_0px_rgba(220,247,86,0.4)]'
    : 'shadow-[0px_2px_5px_0px_rgba(227,139,249,0.25)]';

  // ── Left card inner content ─────────────────────────────────────────────────
  const leftCardContent = isTournament ? (
    /* Tournament layout — team logo instead of player photo(s) */
    <div className="flex items-center gap-[min(2.2vh,2.2vw)] w-full">
      <div className="shrink-0 size-[min(6.7vh,6.7vw)] rounded-full overflow-hidden">
        <ImageWithFallback
          className="object-cover w-full h-full"
          fallback="/images/empty-user.svg"
          src={state.teamOneLogo ?? ''}
        />
      </div>
      <div className={cn('flex flex-col gap-y-[min(0.9vh,0.9vw)] min-w-0', state.teamOneHandicap ? 'w-full' : 'w-fit')}>
        <div className="flex justify-between items-center gap-[min(1.5vh,1.5vw)] min-w-0">
          <p className="uppercase font-bold text-[min(3vh,3vw)] text-score-text truncate min-w-0 flex-1 text-box-trim">
            {generatePlayerName(state.sideOnePlayerOne.name, isDoubles ? state.sideOnePlayerTwo?.name : undefined)}
          </p>
          {isSideOneActive ? (
            <YellowHandicapPill handicap={state.teamOneHandicap} />
          ) : (
            <VioletHandicapPill handicap={state.teamOneHandicap} />
          )}
        </div>
        {isSideOneActive ? <YellowDivider /> : <VioletDivider />}
        <div className="flex justify-between items-center gap-[min(1.5vh,1.5vw)] min-w-0">
          <p className="uppercase font-medium text-[min(2.2vh,2.2vw)] text-score-text truncate min-w-0 flex-1 text-box-trim">
            {state.teamOneName}
          </p>
        </div>
      </div>
    </div>
  ) : isDoubles ? (
    /* Double layout */
    <div className="flex items-center gap-[min(2.2vh,2.2vw)] w-full">
      <div className="relative shrink-0 size-[min(6.7vh,6.7vw)]">
        <div className="absolute top-0 left-0" style={{ zIndex: 1 }}>
          <ProfileCard imageUrl={state.sideOnePlayerOne.profilePhoto ?? defaultImages[0]} size={profileSizeSm} />
        </div>
        <div className="absolute bottom-0 right-0" style={{ zIndex: 2 }}>
          <ProfileCard imageUrl={state.sideOnePlayerTwo?.profilePhoto ?? defaultImages[1]} size={profileSizeSm} />
        </div>
      </div>
      <div className={cn('flex flex-col gap-y-[min(0.9vh,0.9vw)] min-w-0', state.teamOneHandicap ? 'w-full' : 'w-fit')}>
        <div className="flex justify-between items-center gap-[min(1.5vh,1.5vw)] min-w-0">
          <p className="uppercase font-bold text-[min(3vh,3vw)] text-score-text truncate min-w-0 flex-1 text-box-trim">
            {generatePlayerName(state.sideOnePlayerOne.name, state.sideOnePlayerTwo?.name)}
          </p>
          {isSideOneActive ? (
            <YellowHandicapPill handicap={state.teamOneHandicap} />
          ) : (
            <VioletHandicapPill handicap={state.teamOneHandicap} />
          )}
        </div>
        {isSideOneActive ? <YellowDivider /> : <VioletDivider />}
      </div>
    </div>
  ) : hasTeamName ? (
    /* Team Tournament layout */
    <div className="flex items-center gap-[min(2.2vh,2.2vw)] w-full">
      <div className="shrink-0">
        <ProfileCard imageUrl={state.sideOnePlayerOne.profilePhoto ?? defaultImages[0]} size={profileSize} />
      </div>
      <div className={cn('flex flex-col gap-y-[min(0.9vh,0.9vw)] min-w-0', state.teamOneHandicap ? 'w-full' : 'w-fit')}>
        <div className="flex justify-between items-center gap-[min(1.5vh,1.5vw)] min-w-0">
          <p className="uppercase font-bold text-[min(3vh,3vw)] text-score-text truncate min-w-0 flex-1 text-box-trim">
            {generatePlayerName(state.sideOnePlayerOne.name)}
          </p>
          {isSideOneActive ? (
            <YellowHandicapPill handicap={state.teamOneHandicap} />
          ) : (
            <VioletHandicapPill handicap={state.teamOneHandicap} />
          )}
        </div>
        {isSideOneActive ? <YellowDivider /> : <VioletDivider />}
        <div className="flex justify-between items-center gap-[min(1.5vh,1.5vw)] min-w-0">
          <p className="uppercase font-medium text-[min(2.2vh,2.2vw)] text-score-text truncate min-w-0 flex-1">
            {state.teamOneName}
          </p>
        </div>
      </div>
    </div>
  ) : (
    /* Single player layout */
    <div className="flex items-center gap-[min(2.2vh,2.2vw)] w-full">
      <div className="shrink-0">
        <ProfileCard imageUrl={state.sideOnePlayerOne.profilePhoto ?? defaultImages[0]} size={profileSize} />
      </div>
      <div className={cn('flex flex-col gap-y-[min(0.9vh,0.9vw)] min-w-0', state.teamOneHandicap ? 'w-full' : 'w-fit')}>
        <div className="flex justify-between items-center gap-[min(1.5vh,1.5vw)] min-w-0">
          <p className="uppercase font-bold text-[min(3vh,3vw)] text-score-text truncate min-w-0 flex-1 text-box-trim">
            {generatePlayerName(state.sideOnePlayerOne.name)}
          </p>
          {isSideOneActive ? (
            <YellowHandicapPill handicap={state.teamOneHandicap} />
          ) : (
            <VioletHandicapPill handicap={state.teamOneHandicap} />
          )}
        </div>
        {isSideOneActive ? <YellowDivider /> : <VioletDivider />}
      </div>
    </div>
  );

  // ── Right card inner content ────────────────────────────────────────────────
  const rightCardContent = isTournament ? (
    /* Tournament layout — team logo instead of player photo(s) */
    <div className="flex flex-row-reverse items-center gap-[min(2.2vh,2.2vw)] w-full">
      <div className="shrink-0 size-[min(6.7vh,6.7vw)] rounded-full overflow-hidden">
        <ImageWithFallback
          className="object-cover w-full h-full"
          fallback="/images/empty-user.svg"
          src={state.teamTwoLogo ?? ''}
        />
      </div>
      <div className={cn('flex flex-col gap-y-[min(0.9vh,0.9vw)] min-w-0', state.teamOneHandicap ? 'w-full' : 'w-fit')}>
        <div className="flex flex-row-reverse justify-between items-center gap-[min(1.5vh,1.5vw)] min-w-0">
          <p className="uppercase font-bold text-[min(3vh,3vw)] text-score-text truncate min-w-0 flex-1 text-right text-box-trim">
            {generatePlayerName(state.sideTwoPlayerOne.name, isDoubles ? state.sideTwoPlayerTwo?.name : undefined)}
          </p>
          {isSideTwoActive ? (
            <YellowHandicapPill handicap={state.teamTwoHandicap} />
          ) : (
            <VioletHandicapPill handicap={state.teamTwoHandicap} />
          )}
        </div>
        {isSideTwoActive ? <YellowDivider /> : <VioletDivider />}
        <div className="flex flex-row-reverse justify-between items-center gap-[min(1.5vh,1.5vw)] min-w-0">
          <p className="uppercase font-medium text-[min(2.2vh,2.2vw)] text-score-text truncate min-w-0 flex-1 text-right text-box-trim">
            {state.teamTwoName}
          </p>
        </div>
      </div>
    </div>
  ) : isDoubles ? (
    /* Double layout */
    <div className="flex flex-row-reverse items-center gap-[min(2.2vh,2.2vw)] w-full">
      <div className="relative shrink-0 size-[min(6.7vh,6.7vw)]">
        <div className="absolute top-0 left-0" style={{ zIndex: 1 }}>
          <ProfileCard imageUrl={state.sideTwoPlayerOne.profilePhoto ?? defaultImages[2]} size={profileSizeSm} />
        </div>
        <div className="absolute bottom-0 right-0" style={{ zIndex: 2 }}>
          <ProfileCard imageUrl={state.sideTwoPlayerTwo?.profilePhoto ?? defaultImages[3]} size={profileSizeSm} />
        </div>
      </div>
      <div className={cn('flex flex-col gap-y-[min(0.9vh,0.9vw)] min-w-0', state.teamOneHandicap ? 'w-full' : 'w-fit')}>
        <div className="flex flex-row-reverse justify-between items-center gap-[min(1.5vh,1.5vw)] min-w-0">
          <p className="uppercase font-bold text-[min(3vh,3vw)] text-score-text truncate min-w-0 flex-1 text-right text-box-trim">
            {generatePlayerName(state.sideTwoPlayerOne.name, state.sideTwoPlayerTwo?.name)}
          </p>
          {isSideTwoActive ? (
            <YellowHandicapPill handicap={state.teamTwoHandicap} />
          ) : (
            <VioletHandicapPill handicap={state.teamTwoHandicap} />
          )}
        </div>
        {isSideTwoActive ? <YellowDivider /> : <VioletDivider />}
      </div>
    </div>
  ) : hasTeamName ? (
    /* Team Tournament layout */
    <div className="flex flex-row-reverse items-center gap-[min(2.2vh,2.2vw)] w-full">
      <div className="shrink-0">
        <ProfileCard imageUrl={state.sideTwoPlayerOne.profilePhoto ?? defaultImages[2]} size={profileSize} />
      </div>
      <div className={cn('flex flex-col gap-y-[min(0.9vh,0.9vw)] min-w-0', state.teamOneHandicap ? 'w-full' : 'w-fit')}>
        <div className="flex flex-row-reverse justify-between items-center gap-[min(1.5vh,1.5vw)] min-w-0">
          <p className="uppercase font-bold text-[min(3vh,3vw)] text-score-text truncate min-w-0 flex-1 text-right text-box-trim">
            {generatePlayerName(state.sideTwoPlayerOne.name)}
          </p>
          {isSideTwoActive ? (
            <YellowHandicapPill handicap={state.teamTwoHandicap} />
          ) : (
            <VioletHandicapPill handicap={state.teamTwoHandicap} />
          )}
        </div>
        {isSideTwoActive ? <YellowDivider /> : <VioletDivider />}
        <div className="flex flex-row-reverse justify-between items-center gap-[min(1.5vh,1.5vw)] min-w-0">
          <p className="uppercase font-medium text-[min(2.2vh,2.2vw)] text-score-text truncate min-w-0 flex-1 text-right">
            {state.teamTwoName}
          </p>
        </div>
      </div>
    </div>
  ) : (
    /* Single player layout */
    <div className="flex flex-row-reverse items-center gap-[min(2.2vh,2.2vw)] w-full">
      <div className="shrink-0">
        <ProfileCard imageUrl={state.sideTwoPlayerOne.profilePhoto ?? defaultImages[2]} size={profileSize} />
      </div>
      <div className={cn('flex flex-col gap-y-[min(0.9vh,0.9vw)] min-w-0', state.teamOneHandicap ? 'w-full' : 'w-fit')}>
        <div className="flex flex-row-reverse justify-between items-center gap-[min(1.5vh,1.5vw)] min-w-0">
          <p className="uppercase font-bold text-[min(3vh,3vw)] text-score-text truncate min-w-0 flex-1 text-right text-box-trim">
            {generatePlayerName(state.sideTwoPlayerOne.name)}
          </p>
          {isSideTwoActive ? (
            <YellowHandicapPill handicap={state.teamTwoHandicap} />
          ) : (
            <VioletHandicapPill handicap={state.teamTwoHandicap} />
          )}
        </div>
        {isSideTwoActive ? <YellowDivider /> : <VioletDivider />}
      </div>
    </div>
  );

  return (
    <div className="absolute bottom-[min(2.5vh,2.5vw)] mx-[min(1.5vh,1.5vw)] flex flex-col items-center w-[calc(100%-min(3vh,3vw))] bg-cover bg-center rounded-[min(3vh,3vw)] shadow-[0px_2px_10px_0px_rgba(186,145,200,0.25)] bg-[radial-gradient(50%_50%_at_50%_50%,#39205C_0%,#181332_100%)]">
      <div className="w-full h-auto flex justify-between items-stretch px-[min(1.5vh,1.5vw)] py-[min(1.5vh,1.5vw)] gap-[min(1.5vh,1.5vw)] relative">
        {/* Break banner — floats above the active player's card */}
        {(isSideOneActive || isSideTwoActive) && (
          <div
            className={[
              'absolute -top-[min(3.5vh,3.5vw)] z-40',
              isSideOneActive ? 'left-[min(4.4vh,4.4vw)]' : 'right-[min(4.4vh,4.4vw)]',
            ].join(' ')}
          >
            <div className="relative w-[min(22.2vh,22.2vw)]">
              <div
                className="absolute inset-0"
                style={{
                  clipPath: 'polygon(1% 85%, 5% 25%, 12% 0%, 88% 0%, 95% 25%, 99% 85%)',
                }}
              />
              <svg
                viewBox="0 0 210 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                }}
              >
                <g filter="url(#filter0_i)">
                  <path
                    d="M10.9493 13.9524C12.5076 7.13086 18.5754 2.29297 25.5726 2.29297H184.179C191.177 2.29297 197.244 7.13087 198.803 13.9524L206.876 49.293H2.87598L10.9493 13.9524Z"
                    fill="url(#paint0_linear)"
                    fillOpacity="1"
                  />
                  <path
                    d="M184.18 1.14648C191.712 1.14663 198.243 6.35448 199.92 13.6973L207.994 49.0381L208.313 50.4395H1.43848L1.75781 49.0381L9.83203 13.6973C11.5094 6.35448 18.0403 1.14664 25.5723 1.14648H184.18Z"
                    stroke="url(#paint1_linear)"
                    strokeWidth="2.29299"
                  />
                  <path
                    d="M184.18 1.14648C191.712 1.14663 198.243 6.35448 199.92 13.6973L207.994 49.0381L208.313 50.4395H1.43848L1.75781 49.0381L9.83203 13.6973C11.5094 6.35448 18.0403 1.14664 25.5723 1.14648H184.18Z"
                    stroke="url(#paint2_linear)"
                    strokeWidth="2.29299"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_i"
                    x="0"
                    y="0"
                    width="209.752"
                    height="51.5859"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="11.465" />
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.690196 0 0 0 0 0.937255 0 0 0 0 0.384314 0 0 0 0.6 0"
                    />
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
                  </filter>
                  <linearGradient
                    id="paint0_linear"
                    x1="37.3175"
                    y1="49.293"
                    x2="165.984"
                    y2="-159.989"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#ACEC54" stopOpacity="0.13" />
                    <stop offset="1" stopColor="#6FFF00" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear"
                    x1="-32.2964"
                    y1="-8.20218"
                    x2="30.9889"
                    y2="184.38"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.0897938" stopColor="#D7FFA9" />
                    <stop offset="1" stopColor="#80EF00" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear"
                    x1="89.6346"
                    y1="-62.9595"
                    x2="112.535"
                    y2="222.965"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.108869" stopColor="#8FFF00" />
                    <stop offset="0.368867" stopColor="#8FFF00" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="flex justify-center items-center gap-[min(0.7vh,0.7vw)] py-[min(0.9vh,0.9vw)] relative">
                <p className="font-semibold text-[min(2.8vh,2.8vw)] leading-[130%] text-sandy-yellow">Break</p>
                <p className="font-semibold text-[min(3.7vh,3.7vw)] leading-[130%] text-sandy-yellow">{breakScore}</p>
              </div>
            </div>
          </div>
        )}

        {/* Left player card */}
        <div
          className={`relative isolate px-[min(2.2vh,2.2vw)] py-[min(1.5vh,1.5vw)] rounded-[min(1.9vh,1.9vw)] ${leftShadow} backdrop-blur-[24px] flex-1 min-w-0 flex items-center z-50`}
          style={leftCardStyle}
        >
          {leftCardContent}
        </div>
        {/* shot clock Player 1 — only while this side is actually on strike */}
        {showStopClock && isSideOneActive && (
          <div className="absolute pointer-events-none left-8 z-10 -bottom-[min(2.5vh,2.5vw)]">
            <div className="relative flex justify-center items-center h-[min(5.7vh,4.7vw)] w-[min(35.2vh,35.2vw)]">
              <img
                src="/shot-clock-bg.svg"
                alt="background pattern"
                className="w-full h-auto"
                style={{
                  filter: 'drop-shadow(0px -8px 5px rgba(186, 145, 200, 0.15))',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pt-1.5">
                <ShotClockTicker
                  remainingMs={stopClockTick.currentTurnRemainingTimeInMs}
                  totalMs={(state.stopClockTurnTimeInSeconds ?? 0) * 1000}
                  barClassName="size-[min(1.8vh,1.8vw)]"
                  textClassName="text-[min(2.2vh,2.2vw)]"
                  gapClassName="gap-[min(0.3vh,0.3vw)]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Middle score panel */}
        <div
          className="shrink-0 grow-0 flex rounded-[min(1.9vh,1.9vw)] z-40 relative items-stretch "
          style={{
            border: '2px solid transparent',
            background: `
  linear-gradient(#11030F, #11030F) padding-box,
  linear-gradient(
    180deg,
    rgba(227, 169, 242, 1) 0%,
    rgba(226, 179, 237, 0.6) 100%,
    rgba(17, 3, 15, 0.6) 100%
  ) border-box
`,
          }}
        >
          {/* Top Banner — tournament name, centered on this panel */}
          <div className="absolute pointer-events-none left-1/2 -translate-x-1/2 -top-1/2 flex justify-center items-center z-30">
            <div className="relative flex justify-center items-center w-[min(76.5vh,76.5vw)]">
              <img
                src="/tournament-name-box.svg"
                alt="background pattern"
                className="w-full h-auto"
                style={{
                  filter: 'drop-shadow(0px -8px 5px rgba(186, 145, 200, 0.15))',
                }}
              />

              {isTournament ? (
                <p className="font-semibold text-white text-[min(2.2vh,2.2vw)] tracking-wider uppercase font-sans text-center absolute inset-x-0 pt-[min(1.1vh,1.1vw)] truncate px-12 pb-1">
                  {state.tournamentName ?? ''} | {state.format}
                </p>
              ) : (
                <p className="font-semibold text-white text-[min(2.2vh,2.2vw)] tracking-wider uppercase font-sans text-center absolute inset-x-0 pt-[min(1.1vh,1.1vw)] truncate px-12 pb-1">
                  {state.clubName ?? ''}
                </p>
              )}
            </div>
          </div>

          {/* Format tag below center panel */}
          <div className="absolute -bottom-[min(3.5vh,3.5vw)] w-full flex justify-center items-center z-0">
            <div
              className="relative w-[min(25.2vh,25.2vw)] h-[min(4.7vh,4.7vw)]"
              style={{
                filter: 'drop-shadow(0px 8px 6px rgba(186, 145, 200, 0.15))',
              }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 232 47"
                fill="none"
                preserveAspectRatio="none"
                style={{ position: 'absolute', inset: 0 }}
              >
                <path
                  d="M23.8115 46.5H208.188C214.792 46.5 220.562 42.038 222.223 35.6465L231.353 0.5H0.647461L9.77734 35.6465C11.438 42.038 17.2078 46.5 23.8115 46.5Z"
                  fill="url(#paint0_radial_475_3806)"
                  stroke="url(#paint1_linear_475_3806)"
                />
                <defs>
                  <radialGradient
                    id="paint0_radial_475_3806"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientTransform="matrix(95.7763 -0.499992 -0.256563 -337.536 116 23.5)"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#181332" />
                    <stop offset="0.451923" stopColor="#181332" />
                  </radialGradient>
                  <linearGradient
                    id="paint1_linear_475_3806"
                    x1="116"
                    y1="260.5"
                    x2="116"
                    y2="-82.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.612803" stopColor="#E39CF5" />
                    <stop offset="0.685132" stopColor="#E0BFE7" />
                    <stop offset="0.759138" stopColor="#CD86E1" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex justify-center items-center">
                {showStopClock ? (
                  <span className="font-semibold text-[min(2.2vh,2.2vw)] leading-[130%] text-box-trim text-score-text px-[min(1.3vh,1.3vw)] truncate tabular-nums">
                    {formatClockMs(stopClockTick.remainingFrameTimeInMs)}
                  </span>
                ) : isTournament ? (
                  <span className="font-semibold text-[min(2.2vh,2.2vw)] leading-[130%] text-box-trim text-score-text px-[min(1.3vh,1.3vw)] truncate ">
                    {state.tournamentSubItem?.tournamentItem?.tournamentPhase?.name
                      ? state.tournamentSubItem.tournamentItem.tournamentPhase.name
                      : state.sport === 'SNOOKER'
                        ? 'Snooker'
                        : 'Billiards'}
                  </span>
                ) : (
                  <span className="font-semibold text-[min(2.2vh,2.2vw)] leading-[130%] text-box-trim text-score-text px-[min(1.3vh,1.3vw)] truncate ">
                    {state.sport === 'SNOOKER' ? 'Snooker' : 'Billiards'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Score cells — Game Score | Frame Score | Total Frames | Frame Score | Game Score */}
          <div className="flex items-stretch relative z-20 rounded-[min(1.9vh,1.9vw)] overflow-hidden py-[min(1vh,1vw)]">
            {/* Team 1 game score (current frame points) */}
            <div
              className="px-[min(1.1vh,1.1vw)] bg-[#AB51C6] border border-l-0 w-[min(11vh,12vw)] flex justify-center items-center z-10"
              style={{
                borderImageSource:
                  'linear-gradient(90deg, #E3A9F2 0%, rgba(226, 179, 237, 0.05) 55.91%, #E0BCE8 109.78%)',
                borderImageSlice: 1,
              }}
            >
              <span className="font-semibold text-[min(4.7vh,4.7vw)] leading-[130%] uppercase text-score-text text-box-trim">
                {activeSet?.teamOneScore ?? 0}
              </span>
            </div>

            <div className="text-score-text font-semibold text-[min(4.7vh,4.7vw)] leading[130%]  border-y text-center flex justify-center items-center px-[min(1.3vh,1.3vw)] bg-[#595959]/[.20] [border-image-source:linear-gradient(90deg,rgba(255,255,255,0.12)_14.82%,#FFFFFF_45%,rgba(255,255,255,0.12)_91.13%)] [border-image-slice:1] w-[min(8vh,8vw)]">
              <p className="text-box-trim">{displayTeamOneScore}</p>
            </div>

            {/* Total frames / break score */}
            <div
              className="px-[min(1.1vh,1.1vw)] bg-[#AB51C6] border w-[7vw] w[min(11vh,14vw)] flex justify-center items-center"
              style={{
                borderImageSource:
                  'linear-gradient(90deg, #E3A9F2 0%, rgba(226, 179, 237, 0.05) 55.91%, #E0BCE8 109.78%)',
                borderImageSlice: 1,
              }}
            >
              <span className="font-semibold text-[min(4.7vh,4.7vw)] leading-[130%] uppercase text-box-trim text-score-text text-box-trim">
                {teamScoreCenter}
              </span>
            </div>

            {/* Team 2 frame score (frames won) */}

            <div className="text-score-text font-semibold text-[min(4.7vh,4.7vw)] leading[130%]  border-y text-center flex justify-center items-center px-[min(1.3vh,1.3vw)] bg-[#595959]/[.20] [border-image-source:linear-gradient(90deg,rgba(255,255,255,0.12)_14.82%,#FFFFFF_45%,rgba(255,255,255,0.12)_91.13%)] [border-image-slice:1] w-[min(8vh,8vw)]">
              <p className="text-box-trim">{displayTeamTwoScore}</p>
            </div>

            {/* Team 2 game score (current frame points) */}
            <div
              className="px-[min(1.1vh,1.1vw)] bg-[#AB51C6] w-[min(11vh,12vw)] border border-r-0 flex justify-center items-center"
              style={{
                borderImageSource:
                  'linear-gradient(90deg, #E3A9F2 0%, rgba(226, 179, 237, 0.05) 55.91%, #E0BCE8 109.78%)',
                borderImageSlice: 1,
              }}
            >
              <span className="font-semibold text-[min(4.7vh,4.7vw)] leading-[130%] uppercase text-score-text text-box-trim">
                {activeSet?.teamTwoScore ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Right player card */}
        <div
          className={`relative isolate px-[min(2.2vh,2.2vw)] py-[min(1.5vh,1.5vw)] rounded-[min(1.9vh,1.9vw)] ${rightShadow} backdrop-blur-[24px] flex-1 min-w-0 flex items-center z-50`}
          style={rightCardStyle}
        >
          {rightCardContent}
        </div>
        {/* shot clock Player 2 — only while this side is actually on strike */}
        {showStopClock && isSideTwoActive && (
          <div className="absolute pointer-events-none right-8 z-10 -bottom-[min(2.5vh,2.5vw)]">
            <div className="relative flex justify-center items-center h-[min(5.7vh,4.7vw)] w-[min(35.2vh,35.2vw)]">
              <img
                src="/shot-clock-bg.svg"
                alt="background pattern"
                className="w-full h-auto"
                style={{
                  filter: 'drop-shadow(0px -8px 5px rgba(186, 145, 200, 0.15))',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pt-1.5">
                <ShotClockTicker
                  remainingMs={stopClockTick.currentTurnRemainingTimeInMs}
                  totalMs={(state.stopClockTurnTimeInSeconds ?? 0) * 1000}
                  barClassName="size-[min(1.8vh,1.8vw)]"
                  textClassName="text-[min(2.2vh,2.2vw)]"
                  gapClassName="gap-[min(0.3vh,0.3vw)]"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewGeneral;

// Handicap pill — yellow variant (left card)
function YellowHandicapPill({ handicap }: { handicap: number | null }) {
  const label = convertHandicapToString(handicap);
  if (!label) return null;
  return (
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
      <div className={clsx('flex justify-center items-center px-[min(1.5vh,1.5vw)] h-full bg-sandy-yellow')}>
        <p
          className={clsx(
            'font-medium text-[min(2.23vh,2.23vw)] text-black leading-[130%] uppercase text-box-trim py-[min(0.9vh,0.9vw)]',
          )}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

// Handicap pill — violet variant (right card)
function VioletHandicapPill({ handicap }: { handicap: number | null }) {
  const label = convertHandicapToString(handicap);
  if (!label) return null;
  return (
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
      <div className={clsx('flex justify-center items-center px-[min(1.5vh,1.5vw)] h-full bg-violet')}>
        <p
          className={clsx(
            'font-medium text-[min(2.23vh,2.23vw)] text-black leading-[130%] uppercase text-box-trim py-[min(0.9vh,0.9vw)]',
          )}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

// Gradient divider line — left (yellow-toned)
const YellowDivider = () => (
  <div className="border [border-image-source:linear-gradient(90deg,rgba(251,255,127,0)_5%,rgba(251,255,127,0.6)_51.16%,rgba(225,229,116,0)95%)] [border-image-slice:1]" />
);

// Gradient divider line — right (violet-toned)
const VioletDivider = () => (
  <div className="border [border-image-source:linear-gradient(90deg,rgba(227,139,249,0)_5%,rgba(227,139,249,0.6)_51.16%,rgba(227,139,249,0)_95%)] [border-image-slice:1]" />
);
