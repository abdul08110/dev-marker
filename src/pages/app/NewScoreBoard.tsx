import { useState, useEffect } from 'react';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import { ScoreBoardState } from '@/hooks/useScoreboard';
import { getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import { getSnookerPointTypesByTurns } from '@/stores/selectors/snookerSelector';
import { formatTimeMatchTime } from '@/utils/functions';
import { formatClockMs } from '@/utils/stopClock';
import { cn } from '@/lib/utils';
import { Timer } from './Score-board/Timer';
import { useStopClockTick } from '@/hooks/useStopClockTick';
import { useStopClockVoice } from '@/hooks/useStopClockVoice';
import { TableNumber } from './Score-board/TableNumber';
import { GameFormat } from './Score-board/GameFormat';
import { TeamScore } from './Score-board/FrameScore';
import { PlayerCard } from './Score-board/PlayerCard';

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
  const stopClockTick = useStopClockTick(state.stopClockState);
  useStopClockVoice({ stopClockState: state.stopClockState, stopClockVoiceEnabled: state.stopClockVoiceEnabled });
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
  const isTournament = !!state.tournamentId;

  // const footerLabel =
  //   state.tournamentId && state.tournamentSubItem
  //     ? `GAME #${state.tournamentSubItem.gameFormat.matchNo} | ${state.tournamentSubItem.gameFormat.name} | ${state.tournamentSubItem.tournamentItem.tournamentPhase.name}`
  //     : state.format;

  const teamScoreCenter =
    state.tournamentId && state.tournamentSubItem && state.showFormatsAsGameNumber && state.eventFormat === 'TEAMS'
      ? `${state.tournamentSubItem.tournamentItem.tournamentPhase.tournamentFormats.length}`
      : noOfFrames
        ? `${noOfFrames}`
        : null;
  return (
    <main className="bg-[url(/score-card-bg-pattern.png)] bg-cover bg-center h-screen px-[min(3vh,3vw)] bg-no-repeat flex flex-col overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-3 items-center border-b-2 py-[min(1.9vh,1.9vw)] [border-image-source:linear-gradient(90deg,rgba(227,139,249,0)_13.13%,rgba(227,139,249,0.8)_49.22%,rgba(227,139,249,0)_87.72%)] [border-image-slice:1]">
        <div className="flex items-center gap-[min(3vh,3vw)] py-[min(1.1vh,1.1vw)] w-fit justify-self-start">
          {state.tournamentLogo ? (
            <ImageWithFallback
              className="object-cover size-[min(12vh,12vw)] rounded-full"
              fallback="/images/user-dummy-pic.jpg"
              src={state.tournamentLogo || ''}
            />
          ) : (
            <ImageWithFallback
              className="object-cover size-[min(10vh,10vw)]"
              fallback="/images/user-dummy-pic.jpg"
              src={state.clubLogo || ''}
            />
          )}
          <p className="text-score-text font-semibold text-[min(4vh,4vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase">
            {state.tournamentId && state.tournamentSubItem ? state.tournamentName : state.clubName}
          </p>
        </div>

        <ImageWithFallback
          className="justify-self-center w-[min(37vh,37vw)] h-auto"
          fallback="/images/clubliv-final-logo.png"
          src="/images/logos/clubliv-logo.svg"
        />

        <div className="flex items-center justify-end gap-7">
          {isTournament && state.isStopClockEnabled && (
            <div className="flex justify-center items-center">
              <div className="bg-white/5 rounded-[8px] shadow-[inset_0px_2px_4px_0px_#FFFFFF40] flex items-center h-[min(4vh,4vw)] w-fit overflow-hidden shrink-0">
                <div className="flex justify-center items-center bg-white/5 shadow-[inset_0px_2px_4px_0px_#FFFFFF40] h-full">
                  <p className="font-medium uppercase text-score-text text-box-trim px-[min(1.5vh,1.5vw)]  text-center text-[min(2.6vh,2.6vw)]">
                    t
                  </p>
                </div>
                <div className=" bg-white flex justify-center items-center px-[min(1.5vh,1.5vw)] h-full">
                  <p className="font-medium leading-[130%] text-[min(2.6vh,2.6vw)] text-black text-box-trim py-[min(0.9vh,0.9vw)]">
                    {state.venueNo}
                  </p>
                </div>
              </div>
            </div>
          )}

          <p className="text-score-text font-semibold text-[min(4vh,4vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-end">
            match time {formatTimeMatchTime(elapsed)}
          </p>
        </div>
      </div>

      {/* Cards + Center */}
      <div className="flex gap-[min(1.7vh,1.7vw)] pt-[min(1.5vh,1.5vw)] pb-[min(2vh,2vw)]">
        {/* <div className="grid grid-cols-[1fr_auto_1fr] gap-[min(1.7vh,1.7vw)] items-stretch px-[min(3vw,3vh)] pt-[min(5.1vh,5.1vw)] pb-[min(2.1vh,2.1vw)]"> */}
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
          tournamentName={state.tournamentTeamOneName ?? ''}
          isTournament={isTournament}
          isStopClockEnabled={state.isStopClockEnabled}
          turnClockMs={isTeamOneActive ? stopClockTick.currentTurnRemainingTimeInMs : undefined}
          turnClockTotalMs={(state.stopClockTurnTimeInSeconds ?? 0) * 1000}
        />

        {/* Center Panel */}
        <div
          className={cn('shrink-0', state.sport === 'SNOOKER' ? 'py-[min(1.8vh,1.8vw)]' : 'py-[min(2vh,2vw)] shrink-0')}
        >
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
            <div className="rounded-[min(5.1vh,5.1vw)] bg-[linear-gradient(180deg,#371E56_0%,#0D0624_100%)] h-full flex flex-col shrink-0 ">
              {/* Team / Tournament Score */}
              <TeamScore
                hasTournamentCombo={!!(state.tournamentId && state.tournamentSubItem)}
                tournamentTeamOneScore={tournamentTeamOneScore}
                tournamentTeamTwoScore={tournamentTeamTwoScore}
                teamOneScore={state.teamOneScore}
                teamTwoScore={state.teamTwoScore}
                teamScoreCenter={teamScoreCenter}
              />

              {/* Timer — Frame Time when stop clock is enabled (practice + tournament), else match time left (non-tournament only) */}
              {state.isStopClockEnabled ? (
                <div className="flex flex-col items-center gap-[min(0.5vh,0.5vw)] pt-[min(7.4vh,7.4vw)] space-y-2">
                  <p className="text-score-text text-box-trim font-semibold text-[min(10vh,10vw)] leading-none tabular-nums drop-shadow-[0px_4px_16px_0px_#FFFFFF40]">
                    {formatClockMs(stopClockTick.remainingFrameTimeInMs)}
                  </p>
                  <p className="text-text-light font-medium text-[min(4vh,4vw)]">Remaining</p>
                </div>
              ) : (
                <Timer timeLeft={timeLeft} isTournament={isTournament} />
              )}

              {isTournament && !state.isStopClockEnabled && (
                <div className="flex justify-center items-center py-5">
                  <ImageWithFallback
                    className="object-cover size-[min(15vh,15vw)] rounded-full overflow-hidden"
                    fallback="/images/user-dummy-pic.jpg"
                    src={state.clubLogo ?? ''}
                  />
                </div>
              )}

              {/* Table Number — in tournament, only when stop clock is off (Frame Time takes its place above) */}
              {(!isTournament || !state.isStopClockEnabled) && (
                <TableNumber venueNo={state.venueNo} isTournament={isTournament} />
              )}

              {/* Game format */}
              <GameFormat
                sport={state.sport}
                format={state.format}
                isTournament={isTournament}
                isStopClockEnabled={state.isStopClockEnabled}
              />
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
          tournamentName={state.tournamentTeamTwoName ?? ''}
          isTournament={isTournament}
          isStopClockEnabled={state.isStopClockEnabled}
          turnClockMs={isTeamTwoActive ? stopClockTick.currentTurnRemainingTimeInMs : undefined}
          turnClockTotalMs={(state.stopClockTurnTimeInSeconds ?? 0) * 1000}
        />
      </div>
    </main>
  );
};

export default NewScoreBoard;
