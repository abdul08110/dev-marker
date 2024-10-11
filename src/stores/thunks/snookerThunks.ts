/**
 * SNOOKER STATE ASYNC HANDLER FOR STATE DISPATCH FUNCTIONS
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '..';
import {
  addPlayer,
  changeAheadNumber,
  changeOnNumber,
  changeSetScore,
  changeTurnScore,
  completeSet,
  concedeSet,
  createCorrection,
  createPoint,
  createSet,
  createTurn,
  handleBackendUpdatedState,
  handleResetSet,
  incrementTotalScore,
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
  getNextPlayerIndexAndId,
  getNumberAhead,
  getNumberOnTableOfTheCurrentFrame,
} from '../selectors/snookerSelector';
import { getTimeInMinutes, timeStringToDecimalMinutes } from '@/utils/functions';
import {
  getActivePlayer,
  getActiveSet,
  getActiveSetIndex,
  getActiveTeam,
  getActiveTurn,
  getActiveTurnIndex,
  getTeamKey,
} from '../selectors/commonSport';
import { UndoSnookerTypes, clearUndoStack, popFromUndoStack, pushToUndoStack } from '../slices/undoSlice';
import { matchUpdateDataRequest, reversePlayersRequest } from '@/api/scoring/scoringFunctions';
import { SnookerScoreCorrectionData } from '@/components/forms/app/snookerScoreCorrection';
import { SnookerConcedeFrameData } from '@/components/forms/app/snookerConcedeFrame';
import { MatchStartResponse } from '@/api/app/useGetMatchData';

// HANDLE SCORE UPDATE FROM THE BACKEND.
export const matchSyncDataFromBackend = createAsyncThunk<void, { data: MatchStartResponse }, { dispatch: AppDispatch }>(
  'snooker/matchSyncDataFromBackend',
  async ({ data }, { dispatch }) => {
    let newState = {
      format: data.sportType,
      matchId: data.id,
      isBackendUpdated: true,
      team1Score: data.teamOneScore,
      team2Score: data.teamTwoScore,
      numberAhead: 0,
      numberOn: 0,
      team1: {
        players: [
          {
            name: data.sideOnePlayerOne.name,
            isActive: data.activePlayerId === data.sideOnePlayerOne.id,
            id: data.sideOnePlayerOne.id,
            profilePhoto: data.sideOnePlayerOne.profilePhoto,
          },
        ],
        score: data.currentSetTeamOneScore,
      },
      team2: {
        players: [
          {
            name: data.sideTwoPlayerOne.name,
            isActive: data.activePlayerId === data.sideTwoPlayerOne.id,
            id: data.sideTwoPlayerOne.id,
            profilePhoto: data.sideTwoPlayerOne.profilePhoto,
          },
        ],
        score: data.currentSetTeamTwoScore,
      },
      handicap: data.handicap,
      streaming: data.streamingType,
      timeInMinutes: 30,
      scoreHistory: data.sets,
      startTimeDate: data.actualStartTimeDate,
    };

    if (data.sideTwoPlayerTwo !== null) {
      newState.team2.players.push({
        name: data.sideTwoPlayerTwo.name,
        isActive: data.activePlayerId === data.sideTwoPlayerTwo.id,
        id: data.sideTwoPlayerTwo.id,
        profilePhoto: data.sideTwoPlayerTwo.profilePhoto,
      });
    }

    if (data.sideOnePlayerTwo !== null) {
      newState.team1.players.push({
        name: data.sideOnePlayerTwo.name,
        isActive: data.activePlayerId === data.sideOnePlayerTwo.id,
        id: data.sideOnePlayerTwo.id,
        profilePhoto: data.sideOnePlayerTwo.profilePhoto,
      });
    }

    newState.timeInMinutes = getTimeInMinutes(data.actualStartTimeDate, data.expectedEndTimeDate);

    await dispatch(
      setState({
        data: newState,
      }),
    );

    await dispatch(handleSelectionOfOnAndAheadScores({}));
  },
);

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

  await dispatch(changeBackendUpdatedState({ value: false }));
  await dispatch(pushToUndoStackSnooker({ actionType: UndoSnookerTypes.MATCH_START }));
});

export const handleBreakOff = createAsyncThunk<
  void,
  { scoreOrder: string[] },
  { state: RootState; dispatch: AppDispatch }
>('snooker/handleBreakOff', async ({ scoreOrder }, { dispatch, getState }) => {
  const state = getState();

  await dispatch(setActivePlayer({ playerId: scoreOrder[0] }));
  await dispatch(handleCreateSet({ matchId: state.snooker.matchId!, scoreOrder: scoreOrder }));
  await dispatch(handleCreateTurn({ setIndex: state.snooker.scoreHistory.length, playerId: scoreOrder[0] }));
  await dispatch(handleSelectionOfOnAndAheadScores({}));

  await dispatch(changeBackendUpdatedState({ value: false }));
  await dispatch(pushToUndoStackSnooker({ actionType: UndoSnookerTypes.MATCH_START }));
});

export const handleConcedeFrame = createAsyncThunk<
  void,
  { values: SnookerConcedeFrameData },
  { state: RootState; dispatch: AppDispatch }
>('snooker/handleConcedeFrame', async ({ values }, { dispatch, getState }) => {
  let state = getState();

  const activeSet = getActiveSet(state.snooker.scoreHistory);
  const activeSetIndex = getActiveSetIndex(state.snooker.scoreHistory);

  if (!activeSet) return;

  await dispatch(concedeSet({ setIndex: activeSetIndex, winningTeamIndex: values.type === 'teamOne' ? 0 : 1 }));
  await dispatch(incrementTotalScore({ teamIndex: values.type === 'teamOne' ? 0 : 1, score: 1 }));

  await dispatch(setActivePlayer({ playerId: activeSet.scoreOrder[1] }));
  await dispatch(changeAheadNumber({ value: 0 }));
  await dispatch(changeOnNumber({ value: 0 }));

  await dispatch(changeBackendUpdatedState({ value: false }));
  await dispatch(pushToUndoStackSnooker({ actionType: UndoSnookerTypes.MATCH_START }));
});

export const handleRerackState = createAsyncThunk<void, {}, { state: RootState; dispatch: AppDispatch }>(
  'snooker/handleConcedeFrame',
  async ({}, { dispatch, getState }) => {
    let state = getState();

    const activeSet = getActiveSet(state.snooker.scoreHistory);
    const activeSetIndex = getActiveSetIndex(state.snooker.scoreHistory);

    if (!activeSet) return;

    await dispatch(handleResetSet({ setIndex: activeSetIndex }));
    await dispatch(setActivePlayer({ playerId: activeSet.scoreOrder[0] }));
    await dispatch(handleCreateTurn({ setIndex: activeSetIndex, playerId: activeSet.scoreOrder[0] }));
    await dispatch(handleSelectionOfOnAndAheadScores({}));

    await dispatch(changeBackendUpdatedState({ value: false }));
    await dispatch(pushToUndoStackSnooker({ actionType: UndoSnookerTypes.MATCH_START }));
  },
);

export const handleCorrectionState = createAsyncThunk<
  void,
  { values: SnookerScoreCorrectionData },
  { state: RootState; dispatch: AppDispatch }
>('snooker/handleCorrection', async ({ values }, { dispatch, getState }) => {
  let state = getState();
  const activeSet = getActiveSet(state.snooker.scoreHistory);
  const activeSetIndex = getActiveSetIndex(state.snooker.scoreHistory);

  if (!activeSet) return;

  await dispatch(
    createCorrection({
      correctionId: null,
      redsRemaining: values.redsRemaining,
      setIndex: activeSetIndex,
      teamOneScore: values.teamOneScore,
      teamTwoScore: values.teamTwoScore,
    }),
  );

  await dispatch(changeSetScore({ score: values.teamOneScore, teamIndex: 0, setIndex: activeSetIndex }));
  await dispatch(changeSetScore({ score: values.teamTwoScore, teamIndex: 1, setIndex: activeSetIndex }));
  await dispatch(handleSelectionOfOnAndAheadScores({}));

  await dispatch(changeBackendUpdatedState({ value: false }));
  await dispatch(pushToUndoStackSnooker({ actionType: UndoSnookerTypes.MATCH_START }));
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
    const redsLeft = calculateRedsLeft(
      activeSet ? activeSet.turns : [],
      state.snooker.format,
      activeSet && activeSet.snookerCorrections ? activeSet.snookerCorrections : [],
    );
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
    handleChangeTurnScore({
      setIndex: activeSetIndex,
      turnIndex: activeTurnIndex,
      score: activeTurn.score + point,
    }),
  );
  await dispatch(
    handleChangeSetScore({
      score: activeTeam === 0 ? point + activeSet.teamOneScore : point + activeSet.teamTwoScore,
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

  await dispatch(changeBackendUpdatedState({ value: false }));
  await dispatch(handleSelectionOfOnAndAheadScores({}));
  await dispatch(pushToUndoStackSnooker({ actionType: UndoSnookerTypes.POINT }));
});

export const handleSelectionOfBreakOffTeam = createAsyncThunk<
  void,
  { teamIndex: number },
  { state: RootState; dispatch: AppDispatch }
>('snooker/handleSelectionOfBreakOffTeam', async ({ teamIndex }, { dispatch, getState }) => {
  const state = getState();
  const teamKey = getTeamKey(teamIndex);

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
  const activeSet = getActiveSet(state.snooker.scoreHistory);
  const activeSetIndex = getActiveSetIndex(state.snooker.scoreHistory);

  if (!activeSet || activeTeam === null) return;

  await dispatch(
    handleCreatePoint({
      score: 0,
      penalty,
      type: SnookerPointType.FOUL,
      isLongShot: false,
      missCalled: missCalled,
      freeBall: freeBall,
      redsLost,
    }),
  );

  await dispatch(
    handleChangeSetScore({
      score: activeTeam === 0 ? penalty + activeSet.teamTwoScore : penalty + activeSet.teamOneScore,
      teamIndex: activeTeam === 0 ? 1 : 0,
      setIndex: activeSetIndex,
    }),
  );

  await dispatch(handleTeamSwitch({}));
  await dispatch(handleSelectionOfOnAndAheadScores({}));

  await dispatch(changeBackendUpdatedState({ value: false }));
  await dispatch(pushToUndoStackSnooker({ actionType: UndoSnookerTypes.FOUL }));
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
    await dispatch(setActivePlayer({ playerId: activeSet.scoreOrder[1] }));
  },
);

export const handleUndoScoreClicked = createAsyncThunk<void, {}, { state: RootState; dispatch: AppDispatch }>(
  'snooker/handleUndoScoreClicked',
  async ({}, { dispatch, getState }) => {
    const state = getState();
    const newState = state.undo.undoStack[state.undo.undoStack.length - 2].previousState;

    if (!newState) return;

    await dispatch(setState({ data: newState as any as SnookerScoringState }));
    await dispatch(popFromUndoStack());

    await dispatch(changeBackendUpdatedState({ value: false }));
  },
);

export const handleBackendUpdateOfData = createAsyncThunk<void, {}, { state: RootState; dispatch: AppDispatch }>(
  'snooker/handleBackendUpdateOfData',
  async ({}, { dispatch, getState }) => {
    const state = getState();

    if (state.snooker.isBackendUpdated === false) {
      const activePlayer = getActivePlayer(state.snooker.team1, state.snooker.team2);
      const activeSet = getActiveSet(state.snooker.scoreHistory);

      const res = await matchUpdateDataRequest({
        matchId: state.snooker.matchId!,
        activePlayerId: activePlayer ? activePlayer.id : null,
        sets: state.snooker.scoreHistory,
        teamOneScore: state.snooker.team1Score,
        teamTwoScore: state.snooker.team2Score,
        currentSetTeamOneScore: activeSet ? activeSet.teamOneScore : 0,
        currentSetTeamTwoScore: activeSet ? activeSet.teamTwoScore : 0,
      });

      if (res === true) {
        await dispatch(changeBackendUpdatedState({ value: true }));
      }
    }
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

  let numberAhead = 0;
  let numberOn = 0;

  if (activeSet.status === 'ONGOING') {
    numberAhead = await getNumberAhead(activeSet, activeTeam === 0 ? 'team1' : 'team2');
    numberOn = await getNumberOnTableOfTheCurrentFrame(activeSet, state.snooker.format);

    if (numberOn === 0) {
      await dispatch(handleEndFrame({}));
    }
  }

  await dispatch(changeAheadNumber({ value: numberAhead }));
  await dispatch(changeOnNumber({ value: numberOn }));
});

export const pushToUndoStackSnooker = createAsyncThunk<
  void,
  { actionType: UndoSnookerTypes },
  { state: RootState; dispatch: AppDispatch }
>('snooker/pushToUndoStackSnooker', async ({ actionType }, { dispatch, getState }) => {
  let state = getState();
  const data = {
    sliceName: 'snooker',
    previousState: state.snooker,
    type: actionType,
  };
  await dispatch(pushToUndoStack(data));
});

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

    const data = await getNextPlayerIndexAndId(scoreOrder, activePlayer.id!);

    await dispatch(setActivePlayer({ playerId: data.nextPlayerId }));

    await dispatch(handleCreateTurn({ setIndex: activeSetIndex, playerId: data.nextPlayerId }));
  },
);

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
>('snooker/handleCreateSet', async ({ scoreOrder }, { dispatch }) => {
  await dispatch(createSet({ scoreOrder }));
});

export const handleCreateTurn = createAsyncThunk<
  void,
  { setIndex: number; playerId: string },
  { state: RootState; dispatch: AppDispatch }
>('snooker/handleCreateTurn', async ({ setIndex, playerId }, { dispatch }) => {
  await dispatch(createTurn({ setIndex: setIndex, playerId: playerId }));
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

    await dispatch(
      createPoint({
        point: {
          snookerPoint: {
            redsLost,
            missCalled,
            freeBall,
            isLongShot,
            type,
            penalty,
            score,
          },
          timeScored: new Date().toISOString(),
        },
        setIndex: activeSetIndex,
        turnIndex: activeTurnIndex,
      }),
    );
  },
);

export const handleChangeTurnScore = createAsyncThunk<
  void,
  { setIndex: number; turnIndex: number; score: number },
  { state: RootState; dispatch: AppDispatch }
>('snooker/handleCreateTurnScore', async ({ setIndex, turnIndex, score }, { dispatch }) => {
  await dispatch(
    changeTurnScore({
      setIndex: setIndex,
      turnIndex: turnIndex,
      score: score,
    }),
  );
});

export const handleChangeSetScore = createAsyncThunk<
  void,
  { setIndex: number; teamIndex: number; score: number },
  { state: RootState; dispatch: AppDispatch }
>('snooker/handleCreateTurn', async ({ setIndex, teamIndex, score }, { dispatch }) => {
  await dispatch(
    changeSetScore({
      score,
      teamIndex,
      setIndex,
    }),
  );
});

export const changeBackendUpdatedState = createAsyncThunk<
  void,
  { value: boolean },
  { state: RootState; dispatch: AppDispatch }
>('snooker/handleCreateTurn', async ({ value }, { dispatch }) => {
  await dispatch(
    handleBackendUpdatedState({
      value,
    }),
  );
});
