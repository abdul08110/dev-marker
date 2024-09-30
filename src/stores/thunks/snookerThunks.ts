/**
 * SNOOKER STATE ASYNC HANDLER FOR STATE DISPATCH FUNCTIONS
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '..';
import {
  addPlayer,
  changeAheadNumber,
  changeOnNumber,
  completeSet,
  createPoint,
  createSet,
  createTurn,
  incrementSetScore,
  incrementTotalScore,
  incrementTurnScore,
  makeAllPlayersInactive,
  reverseTeamPlayers,
  setActivePlayer,
  setMatchId,
  setState,
  setTeamPlayer,
  updateFormat,
  updateHandicap,
  updateMatchStartedTimeDateUtc,
  updateStreaming,
  updateTimeInMinutes,
} from '../slices/snookerSlice';
import { Player, SnookerPointType, SnookerScoringState } from '../types';
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
  getTeamKey,
} from '../selectors/commonSport';
import { clearUndoStack, popFromUndoStack, pushToUndoStack } from '../slices/undoSlice';
import {
  createSetRequest,
  createSnookerPointRequest,
  createTurnRequest,
  reversePlayersRequest,
  setActivePlayerRequest,
} from '@/api/scoring/scoringFunctions';

// SCORING BUTTON CLICK THRUNKS

export const handleMatchStart = createAsyncThunk<
  void,
  { matchId: string; scoreOrder: string[] },
  { state: RootState; dispatch: AppDispatch }
>('snooker/handleMatchStart', async ({ matchId, scoreOrder }, { dispatch, getState }) => {
  const state = getState();
  const activePlayer = getActivePlayer(state.snooker.team1, state.snooker.team2);
  const activeTeam = getActiveTeam(state.snooker.team1, state.snooker.team2);

  if (!activePlayer || !activePlayer.id || activeTeam === null) return;

  await setActivePlayerRequest({ matchId, playerId: activePlayer.id });

  await dispatch(clearUndoStack());
  await dispatch(
    setMatchId({
      matchId: matchId,
    }),
  );
  await dispatch(updateMatchStartedTimeDateUtc({ startTimeDate: new Date().toISOString() }));

  if (activeTeam === 1) await dispatch(handleReversePlayers({ matchId }));
  await dispatch(handleCreateSet({ matchId, scoreOrder: scoreOrder }));
  await dispatch(handleCreateTurn({ setIndex: 0, playerId: activePlayer.id }));
  await dispatch(handleSelectionOfOnAndAheadScores({}));

  await dispatch(pushToUndoStackSnooker({}));
});

export const handleChangeScoreOnTrigger = createAsyncThunk<
  void,
  { pointType: SnookerPointType; isLongShot: boolean },
  { state: RootState; dispatch: AppDispatch }
>('snooker/handleChangeScore', async ({ pointType, isLongShot }, { dispatch, getState }) => {
  let state = getState();
  let point = ballsToPointsEnum[pointType];

  const activeTeam = getActiveTeam(state.snooker.team1, state.snooker.team2);
  const activeSet = getActiveSet(state.snooker.scoreHistory);
  const activeSetIndex = getActiveSetIndex(state.snooker.scoreHistory);
  const activeTurn = getActiveTurn(activeSet ? activeSet : null);
  const activeTurnIndex = getActiveTurnIndex(activeSet ? activeSet : null);

  if (!activeSet || !activeTurn || activeTeam === null) return;

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
    handleCreatePoint({
      score: point,
      penalty: 0,
      type: pointType,
      isLongShot,
      missCalled: false,
      freeBall: isFreeBall,
      redsLost: 0,
    }),
  );

  await dispatch(
    incrementTurnScore({
      setIndex: activeSetIndex,
      turnIndex: activeTurnIndex,
      score: point,
    }),
  );
  await dispatch(
    incrementSetScore({
      score: point,
      teamIndex: activeTeam,
      setIndex: activeSetIndex,
    }),
  );

  if (
    pointType === SnookerPointType.FOUL ||
    pointType === SnookerPointType.MISSED_POT ||
    pointType === SnookerPointType.PLAY_SAFE
  ) {
    await dispatch(handleTeamSwitch({}));
  }
  await dispatch(handleSelectionOfOnAndAheadScores({}));
  await dispatch(pushToUndoStackSnooker({}));
});

export const handleSelectionOfBreakOffTeam = createAsyncThunk<
  void,
  { teamIndex: number },
  { state: RootState; dispatch: AppDispatch }
>('snooker/handleSelectionOfBreakOffTeam', async ({ teamIndex }, { dispatch, getState }) => {
  const state = getState();
  const teamKey = getTeamKey(teamIndex);

  console.log(teamKey);

  const playerId = state.snooker[teamKey].players[0].id!;
  await dispatch(setActivePlayer({ playerId }));
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

export const handleFoulScore = createAsyncThunk<
  void,
  { penalty: number; missCalled: boolean; freeBall: boolean; redsLost: number },
  { state: RootState; dispatch: AppDispatch }
>('snooker/handleFoulScore', async ({ penalty, missCalled, freeBall, redsLost }, { dispatch, getState }) => {
  const state = getState();
  const activeTeam = getActiveTeam(state.snooker.team1, state.snooker.team2);
  console.log(penalty, missCalled, freeBall, redsLost);

  // await dispatch(createPoint({ score: 0, type: PointType.FOUL, penalty, ballsLost: redsLost, missCalled, freeBall }));
  // await dispatch(incrementSetScore({ score: penalty, teamIndex: activeTeam.team1Active ? 1 : 0 }));
  // await dispatch(handleSelectionOfActiveTeam({ teamIndex: activeTeam.team1Active ? 1 : 0 }));
});

export const handleSettingsStateUpdate = createAsyncThunk<
  void,
  {
    format: 'SNOOKER_15_RED' | 'SNOOKER_10_RED' | 'SNOOKER_6_RED';
    durationInMinutes: string;
    noOfPlayers: '2' | '4';
    streaming: 'PUBLIC' | 'PRIVATE';
    handicap: number;
  },
  { state: RootState; dispatch: AppDispatch }
>(
  'snooker/handleSettingsUpdate',
  async ({ format, durationInMinutes, noOfPlayers, streaming, handicap }, { dispatch }) => {
    await dispatch(updateFormat({ format }));
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
    const activeSet = getActiveSet(state.snooker.scoreHistory);
    const activeSetIndex = getActiveSetIndex(state.snooker.scoreHistory);

    if (!activeSet) return;

    const winningTeamIndex = activeSet?.teamOneScore > activeSet?.teamTwoScore ? 0 : 1;
    await dispatch(incrementTotalScore({ teamIndex: winningTeamIndex, score: 1 }));
    await dispatch(completeSet({ setIndex: activeSetIndex }));
    await dispatch(makeAllPlayersInactive());
    await dispatch(pushToUndoStackSnooker({}));
  },
);

export const handleStartNewFrame = createAsyncThunk<void, {}, { state: RootState; dispatch: AppDispatch }>(
  'snooker/startNewFrame',
  async ({}, { dispatch, getState }) => {
    // await dispatch(createSet({ setId: null }));
    const state = getState();
    const activeSetIndex = getActiveSetIndex(state.snooker.scoreHistory);

    const isSetEvenOrOdd = state.snooker.scoreHistory.length % 2;
    const activeTeam = isSetEvenOrOdd === 0 ? 'team2' : 'team1';
    const activePlayer = state.snooker[activeTeam].players[0].id!;

    await dispatch(setActivePlayer({ playerId: activePlayer }));
    await dispatch(createTurn({ turnId: null, playerId: activePlayer, setIndex: activeSetIndex }));

    await dispatch(handleSelectionOfOnAndAheadScores({}));
    await dispatch(pushToUndoStackSnooker({}));
  },
);

export const handleUndoScoreClicked = createAsyncThunk<void, {}, { state: RootState; dispatch: AppDispatch }>(
  'snooker/handleUndoScoreClicked',
  async ({}, { dispatch, getState }) => {
    const state = getState();
    const previousState = state.undo.undoStack[state.undo.undoStack.length - 2].previousState;

    if (!previousState) return;

    await dispatch(setState({ data: previousState as any as SnookerScoringState }));
    await dispatch(popFromUndoStack());
  },
);

// helper resuable thrunks.

export const handleSelectionOfOnAndAheadScores = createAsyncThunk<
  void,
  {},
  { state: RootState; dispatch: AppDispatch }
>('snooker/updateAheadAndOnScores', async ({}, { dispatch, getState }) => {
  let state = getState();
  const activeSet = getActiveSet(state.snooker.scoreHistory);
  const activeTeam = getActiveTeam(state.snooker.team1, state.snooker.team2);

  if (!activeSet) return;
  const numberAhead = await getNumberAhead(activeSet, activeTeam === 0 ? 'team1' : 'team2');
  const numberOn = await getNumberOnTableOfTheCurrentFrame(activeSet, state.snooker.format);

  await dispatch(changeAheadNumber({ value: numberAhead }));
  await dispatch(changeOnNumber({ value: numberOn }));
});

export const pushToUndoStackSnooker = createAsyncThunk<void, {}, { state: RootState; dispatch: AppDispatch }>(
  'snooker/pushToUndoStackSnooker',
  async ({}, { dispatch, getState }) => {
    let state = getState();
    const data = {
      sliceName: 'snooker',
      previousState: state.snooker,
    };
    await dispatch(pushToUndoStack(data));
  },
);

export const handleTeamSwitch = createAsyncThunk<void, {}, { state: RootState; dispatch: AppDispatch }>(
  'snooker/handleTeamSwitch',
  async ({}, { dispatch, getState }) => {
    const state = getState();
    const matchId = state.snooker.matchId;
    const activePlayer = getActivePlayer(state.snooker.team1, state.snooker.team2);
    const activeSet = getActiveSet(state.snooker.scoreHistory);
    const activeSetIndex = getActiveSetIndex(state.snooker.scoreHistory);

    if (!activeSet || !activePlayer || !matchId) return;
    const scoreOrder = activeSet.scoreOrder;
    const currentPlayerIndex = scoreOrder.findIndex((value) => value === activePlayer.id);
    const nextPlayerIndex = currentPlayerIndex + 1 > scoreOrder.length - 1 ? 0 : currentPlayerIndex + 1;
    const nextPlayerId = scoreOrder[nextPlayerIndex];

    console.log(nextPlayerIndex, nextPlayerId);

    await setActivePlayerRequest({ matchId: matchId, playerId: nextPlayerId });
    await dispatch(setActivePlayer({ playerId: nextPlayerId }));

    await dispatch(handleCreateTurn({ setIndex: activeSetIndex, playerId: nextPlayerId }));
  },
);

// handle api requests and also update of state.

export const handleReversePlayers = createAsyncThunk<
  void,
  { matchId: string },
  { state: RootState; dispatch: AppDispatch }
>('snooker/handleReversePlayers', async ({ matchId }, { dispatch, getState }) => {
  const state = getState();

  await reversePlayersRequest({ id: matchId });
  await dispatch(reverseTeamPlayers());

  if (state.snooker.handicap) {
    await dispatch(updateHandicap({ handicap: -state.snooker.handicap }));
  }
});

export const handleCreateSet = createAsyncThunk<
  void,
  { matchId: string; scoreOrder: string[] },
  { state: RootState; dispatch: AppDispatch }
>('snooker/handleCreateSet', async ({ matchId, scoreOrder }, { dispatch, getState }) => {
  const state = getState();
  const handicap = state.snooker.handicap;

  const setId = await createSetRequest({
    matchId,
    teamOneScore: handicap > 0 ? handicap : 0,
    teamTwoScore: handicap < 0 ? Math.abs(handicap) : 0,
    timeScored: new Date().toISOString(),
    scoreOrder: scoreOrder,
  });

  await dispatch(createSet({ setId, scoreOrder }));
});

export const handleCreateTurn = createAsyncThunk<
  void,
  { setIndex: number; playerId: string },
  { state: RootState; dispatch: AppDispatch }
>('snooker/handleCreateTurn', async ({ setIndex, playerId }, { dispatch, getState }) => {
  const state = getState();
  let turnId = null;
  if (state.snooker.scoreHistory[setIndex] && state.snooker.scoreHistory[setIndex].id) {
    turnId = await createTurnRequest({
      setId: state.snooker.scoreHistory[setIndex].id!,
      turnPlayerId: playerId,
      score: 0,
      timeScored: new Date().toISOString(),
    });
  }
  await dispatch(createTurn({ turnId: turnId, setIndex: setIndex, playerId: playerId }));
});

export const handleCreatePoint = createAsyncThunk<
  void,
  {
    score: number;
    penalty: number;
    type: SnookerPointType;
    isLongShot: boolean;
    missCalled: boolean;
    freeBall: boolean;
    redsLost: number;
  },
  { state: RootState; dispatch: AppDispatch }
>(
  'snooker/handleCreatePoint',
  async ({ score, penalty, type, isLongShot, missCalled, freeBall, redsLost }, { dispatch, getState }) => {
    const state = getState();
    const activeSet = getActiveSet(state.snooker.scoreHistory);
    if (!activeSet) return;
    const activeTurn = getActiveTurn(activeSet);
    if (!activeTurn) return;

    const activeTurnIndex = getActiveTurnIndex(activeSet);
    const activeSetIndex = getActiveSetIndex(state.snooker.scoreHistory);

    let pointId: string | null = null;

    if (activeTurn.id) {
      pointId = await createSnookerPointRequest({
        freeBall,
        redsLost,
        isLongShot,
        missCalled,
        penalty,
        score,
        type,
        timeScored: new Date().toISOString(),
        turnId: activeTurn.id,
      });
    }

    await dispatch(
      createPoint({
        point: {
          ballsLost: redsLost,
          missCalled,
          freeBall,
          isLong: isLongShot,
          type,
          penalty,
          score,
          timeScored: new Date().toISOString(),
        },
        setIndex: activeSetIndex,
        turnIndex: activeTurnIndex,
        pointId,
      }),
    );
  },
);
