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
import { SportIcon, FormatLabel } from './Score-board/GameFormat';
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
  const isClockRunning = !!activeTurn?.stopClockStartedAt && !activeTurn?.stopClockEndedAt;
  const stopClockTick = useStopClockTick(
    activeSet?.frameClockStartedAt,
    activeSet?.frameClockElapsedMs,
    state.stopClockFrameTimeInSeconds,
    isClockRunning ? activeTurn?.stopClockStartedAt : null,
    state.stopClockTurnTimeInSeconds,
  );
  useStopClockVoice({
    startedTurnTime: isClockRunning ? activeTurn?.stopClockStartedAt : null,
    stopClockTurnTimeInSeconds: state.stopClockTurnTimeInSeconds,
    stopClockVoiceEnabled: state.stopClockVoiceEnabled,
  });
  const isTeamOneActive =
    state.sideOnePlayerOne?.id === state.activePlayerId || state.sideOnePlayerTwo?.id === state.activePlayerId;
  const isTeamTwoActive =
    state.sideTwoPlayerOne?.id === state.activePlayerId || state.sideTwoPlayerTwo?.id === state.activePlayerId;

  const noOfFrames = state.tournamentId === null ? state.sets.length : state.noOfFrames || 0;

  const isTeamReveresed =
    state.tournamentId && state.tournamentSubItem
      ? state.tournamentSubItem?.tournamentItem.tournamentTeamOneId !== state.tournamentTeamOneId
      : false;

  // Game score (current-frame points). For a relay game — a tournament match whose
  // format carries a relayGroupIndex — the on-screen score is the running total
  // across the relay group, so we add the matching relay aggregate's cumulative
  // score (flipped when the teams are reversed).
  const relayGroupIndex = state.tournamentSubItem?.gameFormat?.relayGroupIndex;
  const relayAggregate =
    state.tournamentId && state.tournamentSubItem && relayGroupIndex != null
      ? state.tournamentSubItem.tournamentItem.relayAggregates?.find((a) => a.relayGroupIndex === relayGroupIndex)
      : undefined;

  const relayTeamOneScore = relayAggregate
    ? isTeamReveresed
      ? relayAggregate.teamTwoCumulativeScore
      : relayAggregate.teamOneCumulativeScore
    : 0;
  const relayTeamTwoScore = relayAggregate
    ? isTeamReveresed
      ? relayAggregate.teamOneCumulativeScore
      : relayAggregate.teamTwoCumulativeScore
    : 0;

  const teamOneFrameScore = (activeSet ? activeSet.teamOneScore : 0) + relayTeamOneScore;
  const teamTwoFrameScore = (activeSet ? activeSet.teamTwoScore : 0) + relayTeamTwoScore;

  const tournamentFormats = state.tournamentSubItem?.tournamentItem.tournamentPhase.tournamentFormats ?? [];

  // Relay-aware tournament game score (games won by each team in the combination).
  // The backend increments teamOneScore/teamTwoScore for EVERY relay leg won, but a
  // relay group should count as a single game slot, awarded to whichever team wins
  // the cumulative aggregate — and only once every leg in the group has been played.
  // So we strip each group's per-leg contributions and re-add one point per fully
  // played group to the cumulative winner (a tie awards nothing). Scores here are in
  // the tournamentItem's own team1/team2 terms; the reversal is applied afterwards.
  const relayAdjustedItemScores = (() => {
    const item = state.tournamentSubItem?.tournamentItem;
    let teamOne = item?.teamOneScore ?? 0;
    let teamTwo = item?.teamTwoScore ?? 0;
    for (const aggregate of item?.relayAggregates ?? []) {
      const totalLegs = tournamentFormats.filter((f) => f.relayGroupIndex === aggregate.relayGroupIndex).length;
      const legsPlayed = aggregate.teamOneFramesWon + aggregate.teamTwoFramesWon;
      // Remove the per-leg wins the backend already tallied into the team score.
      teamOne -= aggregate.teamOneFramesWon;
      teamTwo -= aggregate.teamTwoFramesWon;
      // Award the group's single point only once all legs are played; ties award none.
      if (totalLegs > 0 && legsPlayed === totalLegs) {
        if (aggregate.teamOneCumulativeScore > aggregate.teamTwoCumulativeScore) teamOne += 1;
        else if (aggregate.teamTwoCumulativeScore > aggregate.teamOneCumulativeScore) teamTwo += 1;
      }
    }
    return { teamOne, teamTwo };
  })();

  const tournamentTeamOneScore = state.tournamentSubItem
    ? state.showCummulativeScoreInCombination
      ? isTeamReveresed
        ? (state.tournamentSubItem.tournamentItem.teamTwoCumulativeFinalFrameScore ?? 0)
        : (state.tournamentSubItem.tournamentItem.teamOneCumulativeFinalFrameScore ?? 0)
      : isTeamReveresed
        ? relayAdjustedItemScores.teamTwo
        : relayAdjustedItemScores.teamOne
    : null;

  const tournamentTeamTwoScore = state.tournamentSubItem
    ? state.showCummulativeScoreInCombination
      ? isTeamReveresed
        ? (state.tournamentSubItem.tournamentItem.teamOneCumulativeFinalFrameScore ?? 0)
        : (state.tournamentSubItem.tournamentItem.teamTwoCumulativeFinalFrameScore ?? 0)
      : isTeamReveresed
        ? relayAdjustedItemScores.teamOne
        : relayAdjustedItemScores.teamTwo
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

  // Number of games/formats in the phase. Relay formats sharing the same
  // relayGroupIndex are a single game slot, so collapse each relay group to one
  // instead of counting every relay leg as its own format.
  const formatsCount = (() => {
    const seenRelayGroups = new Set<number>();
    let count = 0;
    for (const format of tournamentFormats) {
      if (format.relayGroupIndex != null) {
        if (seenRelayGroups.has(format.relayGroupIndex)) continue;
        seenRelayGroups.add(format.relayGroupIndex);
      }
      count++;
    }
    return count;
  })();

  const teamScoreCenter =
    state.tournamentId && state.tournamentSubItem && state.showFormatsAsGameNumber && state.eventFormat === 'TEAMS'
      ? `${formatsCount}`
      : noOfFrames
        ? `${noOfFrames}`
        : null;
  return (
    <main className="bg-[url(/score-card-bg-pattern.png)] bg-cover bg-center h-screen px-[min(3vh,3vw)] bg-no-repeat flex flex-col overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-3 items-center border-b-2 py-[min(1.9vh,1.9vw)] [border-image-source:linear-gradient(90deg,rgba(227,139,249,0)_calc(50%_-_min(32vh,32vw)),rgba(227,139,249,0.8)_50%,rgba(227,139,249,0)_calc(50%_+_min(32vh,32vw)))] [border-image-slice:1]">
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

        <div className="flex items-center justify-end gap-[min(2.5vh,2.5vw)]">
          {isTournament && state.isStopClockEnabled && <TableNumber venueNo={state.venueNo} size="small" />}

          <p className="text-score-text font-semibold text-[min(4vh,4vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase w-fit justify-self-end">
            match time {formatTimeMatchTime(elapsed)}
          </p>
        </div>
      </div>

      {/* Cards + Center */}
      <div className="flex flex-1 min-h-0 gap-[min(1.7vh,1.7vw)] pt-[min(1.5vh,1.5vw)] pb-[min(2vh,2vw)]">
        {/* <div className="grid grid-cols-[1fr_auto_1fr] gap-[min(1.7vh,1.7vw)] items-stretch px-[min(3vw,3vh)] pt-[min(5.1vh,5.1vw)] pb-[min(2.1vh,2.1vw)]"> */}
        {/* Card 1 - Team One */}
        <PlayerCard
          isActive={isTeamOneActive}
          profilePhoto={state.teamOneLogo ?? state.sideOnePlayerOne.profilePhoto ?? null}
          profilePhoto2={isDoubles ? (state.sideOnePlayerTwo?.profilePhoto ?? null) : undefined}
          playerOneName={state.sideOnePlayerOne.name}
          playerOneLastName={isDoubles ? undefined : state.sideOnePlayerOne.lastName}
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
              0px 0px 6px 0px #FFEDFF40,
              10px 10px 10px 0px #0F0B23CC,
              -11px 0px 10px 0px #0E0B24CC
            `,
            }}
          >
            <div className="rounded-[min(5.1vh,5.1vw)] bg-[linear-gradient(180deg,#371E56_0%,#0D0624_100%)] h-full flex flex-col justify-between items-center gap-[min(2vh,2vw)] py-[min(2.2vh,2.2vw)] shrink-0 ">
              {/* Team / Tournament Score */}
              <TeamScore
                hasTournamentCombo={!!(state.tournamentId && state.tournamentSubItem)}
                tournamentTeamOneScore={tournamentTeamOneScore}
                tournamentTeamTwoScore={tournamentTeamTwoScore}
                teamOneScore={state.teamOneScore}
                teamTwoScore={state.teamTwoScore}
                teamScoreCenter={teamScoreCenter}
              />

              <Timer
                timeLeft={state.isStopClockEnabled ? formatClockMs(stopClockTick.remainingFrameTimeInMs) : timeLeft}
                isTournament={isTournament && state.isStopClockEnabled ? false : isTournament}
              />

              {isTournament && !state.isStopClockEnabled && (
                <div className="flex justify-center items-center">
                  <ImageWithFallback
                    className="object-cover size-[min(15vh,15vw)] rounded-full overflow-hidden"
                    fallback="/images/user-dummy-pic.jpg"
                    src={state.clubLogo ?? ''}
                  />
                </div>
              )}

              {/* Table Number — in tournament, only when stop clock is off (Frame Time takes its place above) */}
              {(!isTournament || !state.isStopClockEnabled) && <TableNumber venueNo={state.venueNo} size="large" />}

              {/* Game format — icon and label are siblings so the panel's gap/justify-between spaces them */}
              <SportIcon sport={state.sport} />
              {isTournament && <FormatLabel format={state.format} />}
            </div>
          </div>
        </div>

        {/* Card 2 - Team Two */}
        <PlayerCard
          isActive={isTeamTwoActive}
          profilePhoto={state.teamTwoLogo ?? state.sideTwoPlayerOne.profilePhoto ?? null}
          profilePhoto2={isDoubles ? (state.sideTwoPlayerTwo?.profilePhoto ?? null) : undefined}
          playerOneName={state.sideTwoPlayerOne.name}
          playerOneLastName={isDoubles ? undefined : state.sideTwoPlayerOne.lastName}
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
