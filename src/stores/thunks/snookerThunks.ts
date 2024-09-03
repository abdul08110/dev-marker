/**
 * SNOOKER STATE ASYNC HANDLER FOR STATE DISPATCH FUNCTIONS
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '..';
import {
  addPlayer,
  changeAheadNumber,
  changeOnNumber,
  changeSetStatus,
  completeSet,
  createPoint,
  createSet,
  createTurn,
  decrementSetScore,
  decrementTotalScore,
  decrementTurnScore,
  deleteSet,
  incrementSetScore,
  incrementTotalScore,
  incrementTurnScore,
  makeAllPlayersInactive,
  removeTurn,
  reverseTeamPlayers,
  setActivePlayer,
  setMatchId,
  setTeamPlayer,
  undoLastPoint,
  updateFormat,
  updateHandicap,
  updateMatchStartedTimeDateUtc,
  updateNoOfFrames,
  updateStreaming,
  updateTimeInMinutes,
} from '../slices/snookerSlice';
import { Player, PointType, Set, Turn } from '../types';
import {
  adjustColorBallsPottedWithFreeBall,
  ballsToPointsEnum,
  calculateRedsLeft,
  checkIfLastBallIsFreeBall,
  colorPointsOrder,
  getNumberAhead,
  getNumberOnTableOfTheCurrentFrame,
} from '../selectors/snookerSelector';
import { timeStringToDecimalMinutes } from '@/utils/functions';
import {
  getActivePlayer,
  getActiveSet,
  getActiveSetIndex,
  getActiveTeam,
  getActiveTurn,
  getActiveTurnIndex,
  getLastPoint,
  getLastSet,
  getLastSetIndex,
} from '../selectors/commonSport';

export const handleSelectionOfActiveTeam = createAsyncThunk<
  void,
  { teamIndex: number },
  { state: RootState; dispatch: AppDispatch }
>('snooker/handleSelectionOfActiveTeam', async ({ teamIndex }, { dispatch, getState }) => {
  let state = getState();

  const activeTeam = getActiveTeam(state.snooker.players.team1, state.snooker.players.team2);
  if (activeTeam.team1Active && teamIndex === 0) return;
  if (activeTeam.team2Active && teamIndex === 1) return;

  const teamKey = teamIndex === 0 ? 'team1' : 'team2';
  let playerId: string;

  if (state.snooker.players.team1.players.length === 1 && state.snooker.players.team2.players.length === 1) {
    playerId = state.snooker.players[teamKey].players[0].id!;
  } else {
    const playerOneId = state.snooker.players[teamKey].players[0].id!;
    const playerTwoId = state.snooker.players[teamKey].players[1].id!;

    const lastTurnPlayerOneIndex = state.snooker.scoreHistory[state.snooker.scoreHistory.length - 1].turns
      .map((turn) => turn.turnPlayerId)
      .lastIndexOf(playerOneId);
    const lastTurnPlayerTwoIndex = state.snooker.scoreHistory[state.snooker.scoreHistory.length - 1].turns
      .map((turn) => turn.turnPlayerId)
      .lastIndexOf(playerTwoId);

    if (lastTurnPlayerOneIndex > lastTurnPlayerTwoIndex) playerId = playerTwoId;
    else playerId = playerOneId;
  }

  await dispatch(setActivePlayer({ playerId }));

  if (state.snooker.matchId) {
    await dispatch(createTurn({ playerId }));

    state = getState();

    const activeSet = getActiveSet(state.snooker.scoreHistory)!;

    const numberAhead = await getNumberAhead(activeSet, teamIndex === 0 ? 'team1' : 'team2');
    const numberOn = await getNumberOnTableOfTheCurrentFrame(activeSet, state.snooker.format);

    await dispatch(changeAheadNumber({ value: numberAhead }));
    await dispatch(changeOnNumber({ value: numberOn }));
  }
});

export const handleChangeScoreOnTrigger = createAsyncThunk<
  void,
  { point: number; type: PointType },
  { state: RootState; dispatch: AppDispatch }
>('snooker/handleChangeScore', async ({ point, type }, { dispatch, getState }) => {
  let state = getState();

  const activeTeam = getActiveTeam(state.snooker.players.team1, state.snooker.players.team2);
  let activeSet = getActiveSet(state.snooker.scoreHistory);
  const isFreeBall = checkIfLastBallIsFreeBall(state.snooker.scoreHistory);

  if (isFreeBall) {
    const redsLeft = calculateRedsLeft(activeSet ? activeSet.turns : [], state.snooker.format);
    if (redsLeft === 0) {
      const pottedColorBalls = adjustColorBallsPottedWithFreeBall(activeSet!);
      const nextColorBallToBePottedIndex = pottedColorBalls.length;
      const nextColorBallToBePotted = colorPointsOrder.slice()[nextColorBallToBePottedIndex];
      const nextColorBallPoints = ballsToPointsEnum[nextColorBallToBePotted];

      point = nextColorBallPoints;
    } else {
      point = 1;
    }
  }

  await dispatch(
    createPoint({
      score: point,
      type,
      penalty: 0,
      ballsLost: 0,
      missCalled: false,
      freeBall: false,
    }),
  );
  await dispatch(
    incrementTurnScore({
      score: point,
    }),
  );
  await dispatch(
    incrementSetScore({
      score: point,
      teamIndex: activeTeam.team1Active ? 0 : 1,
    }),
  );

  state = getState();

  activeSet = getActiveSet(state.snooker.scoreHistory)!;

  const numberAhead = await getNumberAhead(activeSet, activeTeam.team1Active ? 'team1' : 'team2');
  const numberOn = await getNumberOnTableOfTheCurrentFrame(activeSet, state.snooker.format);

  await dispatch(changeAheadNumber({ value: numberAhead }));
  await dispatch(changeOnNumber({ value: numberOn }));
});

export const handleMatchStart = createAsyncThunk<
  void,
  { matchId: string },
  { state: RootState; dispatch: AppDispatch }
>('snooker/handleMatchStart', async ({ matchId }, { dispatch, getState }) => {
  const state = getState();

  await dispatch(
    setMatchId({
      matchId: matchId,
    }),
  );
  await dispatch(handleBreakOff({}));
  await dispatch(createSet());
  await dispatch(changeAheadNumber({ value: 0 }));
  await dispatch(changeOnNumber({ value: 0 }));
  await dispatch(updateMatchStartedTimeDateUtc({ startTimeDate: new Date().toISOString() }));

  const activePlayer = getActivePlayer(state.snooker.players.team1, state.snooker.players.team2);
  await dispatch(createTurn({ playerId: activePlayer!.id! }));
});

export const handlePlayerSelectState = createAsyncThunk<
  void,
  { player: Player; playerIndex: number; teamIndex: number },
  { state: RootState; dispatch: AppDispatch }
>('snooker/handlePlayerSelect', async ({ player, playerIndex, teamIndex }, { dispatch }) => {
  await dispatch(
    setTeamPlayer({
      player: player,
      playerIndex: playerIndex,
      teamIndex: teamIndex,
    }),
  );
});

export const handleBreakOff = createAsyncThunk<void, {}, { state: RootState; dispatch: AppDispatch }>(
  'snooker/handlePlayerBreak',
  async ({}, { dispatch, getState }) => {
    const state = getState();

    const activeTeam = getActiveTeam(state.snooker.players.team1, state.snooker.players.team2);

    if (activeTeam.team1Active) return;
    else {
      await dispatch(reverseTeamPlayers());

      if (state.snooker.handicap) {
        await dispatch(updateHandicap({ handicap: -state.snooker.handicap }));
      }
    }
  },
);

export const handleUndoScoreClicked = createAsyncThunk<void, {}, { state: RootState; dispatch: AppDispatch }>(
  'snooker/undoScore',
  async (_, { dispatch, getState }) => {
    let state = getState();
    const currentSet = getActiveSet(state.snooker.scoreHistory);
    const currentSetIndex = getActiveSetIndex(state.snooker.scoreHistory);

    if (!currentSet) {
      return;
    }

    const currentTurn = getActiveTurn(currentSet);
    const currentTurnIndex = getActiveTurnIndex(currentSet);
    const activeTeam = getActiveTeam(state.snooker.players.team1, state.snooker.players.team2);

    // END FRAME UNDO
    if (currentSet.status === 'COMPLETED') {
      state = getState();

      const winningTeamIndex = currentSet?.teamOneScore > currentSet?.teamTwoScore ? 0 : 1;
      await dispatch(decrementTotalScore({ teamIndex: winningTeamIndex, score: 1 }));
      await dispatch(changeSetStatus({ setIndex: currentSetIndex, status: 'ONGOING' }));
      if (!currentTurn) return;
      await dispatch(setActivePlayer({ playerId: currentTurn.turnPlayerId }));

      return;
    }

    if (!currentTurn) {
      return;
    }

    if (currentTurn.points.length === 0) {
      await handleEmptyTurn(dispatch, getState, currentSetIndex, currentTurnIndex);
    } else {
      await handleLastPoint(dispatch, currentSet, currentTurn, activeTeam, currentSetIndex, currentTurnIndex, getState);
    }
  },
);

async function handleEmptyTurn(dispatch: AppDispatch, getState: () => RootState, setIndex: number, turnIndex: number) {
  await dispatch(removeTurn({ setIndex, turnIndex }));

  let state = getState();
  let currentSet = getActiveSet(state.snooker.scoreHistory);

  let currentTurn = getActiveTurn(currentSet);

  const activeTeam = getActiveTeam(state.snooker.players.team1, state.snooker.players.team2);

  if (currentTurn) {
    const currentPoint = getLastPoint(currentTurn);

    if (currentPoint?.type === PointType.FOUL) {
      const currentTurnIndex = getActiveTurnIndex(currentSet!);
      const currentSetIndex = getActiveSetIndex(state.snooker.scoreHistory);

      await dispatch(decrementSetScore({ score: currentPoint.penalty, teamIndex: activeTeam.team1Active ? 0 : 1 }));
      await dispatch(
        undoLastPoint({
          setIndex: currentSetIndex,
          turnIndex: currentTurnIndex,
        }),
      );

      state = getState();
      currentSet = getActiveSet(state.snooker.scoreHistory);
      currentTurn = getActiveTurn(currentSet);

      await dispatch(setActivePlayer({ playerId: currentTurn!.turnPlayerId }));
      const numberAhead = await getNumberAhead(currentSet!, activeTeam.team1Active ? 'team2' : 'team1');
      const numberOn = await getNumberOnTableOfTheCurrentFrame(currentSet, state.snooker.format);

      await dispatch(changeAheadNumber({ value: numberAhead }));
      await dispatch(changeOnNumber({ value: numberOn }));
    }
  } else {
    await dispatch(deleteSet());
    const state = getState();

    if (state.snooker.scoreHistory.length === 0) {
      await dispatch(makeAllPlayersInactive());
    } else {
      const activeSet = getActiveSet(state.snooker.scoreHistory);
      const isSetEvenOrOdd = state.snooker.scoreHistory.length % 2;
      const activeTeam = isSetEvenOrOdd === 0 ? 'team2' : 'team1';

      await dispatch(makeAllPlayersInactive());
      const numberAhead = await getNumberAhead(activeSet!, activeTeam);
      const numberOn = await getNumberOnTableOfTheCurrentFrame(activeSet, state.snooker.format);

      await dispatch(changeAheadNumber({ value: numberAhead }));
      await dispatch(changeOnNumber({ value: numberOn }));
    }
  }
}

async function handleLastPoint(
  dispatch: AppDispatch,
  currentSet: Set | null,
  currentTurn: Turn | null,
  activeTeam: { team1Active: boolean; team2Active: boolean },
  setIndex: number,
  turnIndex: number,
  getState: () => RootState,
) {
  if (!currentTurn) {
    return;
  }

  const lastPoint = getLastPoint(currentTurn)!;
  const teamIndex = activeTeam.team1Active ? 0 : 1;

  await dispatch(decrementTurnScore({ score: lastPoint.score }));
  await dispatch(decrementSetScore({ score: lastPoint.score, teamIndex }));

  await dispatch(
    undoLastPoint({
      setIndex,
      turnIndex,
    }),
  );

  const state = getState();

  const activeSet = getActiveSet(state.snooker.scoreHistory);
  const isSetEvenOrOdd = state.snooker.scoreHistory.length % 2;
  const activeTeamFormatted = isSetEvenOrOdd === 0 ? 'team2' : 'team1';

  const numberAhead = await getNumberAhead(activeSet!, activeTeamFormatted);
  const numberOn = await getNumberOnTableOfTheCurrentFrame(activeSet, state.snooker.format);


  await dispatch(changeAheadNumber({ value: numberAhead }));
  await dispatch(changeOnNumber({ value: numberOn }));
}

export const handleFoulScore = createAsyncThunk<
  void,
  { penalty: number; missCalled: boolean; freeBall: boolean; redsLost: number },
  { state: RootState; dispatch: AppDispatch }
>('snooker/handleFoulScore', async ({ penalty, missCalled, freeBall, redsLost }, { dispatch, getState }) => {
  const state = getState();

  const activeTeam = getActiveTeam(state.snooker.players.team1, state.snooker.players.team2);
  await dispatch(createPoint({ score: 0, type: PointType.FOUL, penalty, ballsLost: redsLost, missCalled, freeBall }));
  await dispatch(incrementSetScore({ score: penalty, teamIndex: activeTeam.team1Active ? 1 : 0 }));
  await dispatch(handleSelectionOfActiveTeam({ teamIndex: activeTeam.team1Active ? 1 : 0 }));
});

export const handleSettingsStateUpdate = createAsyncThunk<
  void,
  {
    format: 'SNOOKER_15_RED' | 'SNOOKER_10_RED' | 'SNOOKER_6_RED';
    numberOfFrames: number;
    durationInMinutes: string;
    noOfPlayers: '2' | '4';
    streaming: 'PUBLIC' | 'PRIVATE';
    handicap: number;
  },
  { state: RootState; dispatch: AppDispatch }
>(
  'snooker/handleSettingsUpdate',
  async ({ format, numberOfFrames, durationInMinutes, noOfPlayers, streaming, handicap }, { dispatch }) => {
    await dispatch(updateFormat({ format }));
    await dispatch(updateNoOfFrames({ numberOfFrames }));
    await dispatch(updateTimeInMinutes({ timeInMinutes: timeStringToDecimalMinutes(durationInMinutes) }));
    await dispatch(updateFormat({ format: format }));
    await dispatch(updateStreaming({ streaming }));
    await dispatch(updateHandicap({ handicap }));

    if (noOfPlayers === '4') {
      await dispatch(addPlayer({ teamIndex: 0 }));
      await dispatch(addPlayer({ teamIndex: 1 }));
    }
  },
);

export const handleEndFrame = createAsyncThunk<void, {}, { state: RootState; dispatch: AppDispatch }>(
  'snooker/handleEndFrame',
  async ({}, { dispatch, getState }) => {
    const state = getState();
    let activeSet = getActiveSet(state.snooker.scoreHistory);

    if (!activeSet) return;
    const winningTeamIndex = activeSet?.teamOneScore > activeSet?.teamTwoScore ? 0 : 1;
    await dispatch(incrementTotalScore({ teamIndex: winningTeamIndex, score: 1 }));
    await dispatch(completeSet());
    await dispatch(makeAllPlayersInactive());
  },
);

export const handleStartNewFrame = createAsyncThunk<void, {}, { state: RootState; dispatch: AppDispatch }>(
  'snooker/startNewFrame',
  async ({}, { dispatch, getState }) => {
    await dispatch(createSet());

    const state = getState();

    const activeSet = getActiveSet(state.snooker.scoreHistory);

    const isSetEvenOrOdd = state.snooker.scoreHistory.length % 2;
    const activeTeam = isSetEvenOrOdd === 0 ? 'team2' : 'team1';
    const activePlayer = state.snooker.players[activeTeam].players[0].id!;

    await dispatch(setActivePlayer({ playerId: activePlayer }));
    await dispatch(createTurn({ playerId: activePlayer }));

    const numberAhead = await getNumberAhead(activeSet!, activeTeam);
    const numberOn = await getNumberOnTableOfTheCurrentFrame(activeSet, state.snooker.format);

    await dispatch(changeAheadNumber({ value: numberAhead }));
    await dispatch(changeOnNumber({ value: numberOn }));
  },
);
