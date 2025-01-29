/**
 * SPORT STATE ASYNC HANDLER FOR STATE DISPATCH FUNCTIONS
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
  createSnookerCorrection,
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
  updateNoOfSets,
  updateMaxScorePerSet,
  updateTeamHandicapApplied,
  setExpectedEndTimeDate,
} from '../slices/sportSlice';
import { BilliardPointType, Player, SnookerPointType, SportType, TournamentItem, TournamentSubItem } from '../types';
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
import { clearUndoStack, popFromUndoStack, pushToUndoStack } from '../slices/undoSlice';
import { matchEndGameRequest, matchUpdateDataRequest, reversePlayersRequest } from '@/api/scoring/scoringFunctions';
import { SnookerScoreCorrectionData } from '@/components/forms/app/snookerScoreCorrection';
import { SnookerConcedeFrameData } from '@/components/forms/app/snookerConcedeFrame';
import { MatchStartResponse } from '@/api/app/useGetMatchData';
import { ballsToPointsEnumBilliards } from '../selectors/billiardsSelector';

// HANDLE SCORE UPDATE FROM THE BACKEND.

export const setStateTournament = createAsyncThunk<
  void,
  {
    data: {
      teamOnePlayers: Player[];
      teamTwoPlayers: Player[];
      teamOneHandicap?: number;
      teamTwoHandicap?: number;
    };
    tournamentItem: TournamentItem;
    tournamentSubItem: TournamentSubItem;
  },
  { dispatch: AppDispatch }
>('sport/setStateTournament', async ({ data, tournamentItem, tournamentSubItem }, { dispatch }) => {
  let sport = tournamentSubItem.format.sport;
  let sportType: SportType = sport === 'SNOOKER' ? 'SNOOKER_15_RED' : 'BILLIARDS_RACE_TO';
  let isCumulativeScore =
    tournamentSubItem.format.isCumulativeScoring && tournamentSubItem.format.isCumulativeScoring === true;
  let streamType: 'PUBLIC' | 'PRIVATE' = 'PRIVATE';

  let newState = {
    format: sportType,
    matchId: null,
    sport: sport,
    isBackendUpdated: false,
    team1Score: 0,
    team2Score: 0,
    numberAhead: 0,
    numberOn: 0,
    team1: {
      players: data.teamOnePlayers.map((player) => ({
        name: player.name,
        isActive: false,
        id: player.id,
        profilePhoto: player.profilePhoto,
      })),
      score: 0,
    },
    team2: {
      players: data.teamTwoPlayers.map((player) => ({
        name: player.name,
        isActive: false,
        id: player.id,
        profilePhoto: player.profilePhoto,
      })),
      score: 0,
    },
    handicap: 0,
    streaming: streamType,
    timeInMinutes:
      tournamentSubItem.format.maxTimePerSetInMilliSeconds && tournamentSubItem.format.maxTimePerSetInMilliSeconds > 0
        ? tournamentSubItem.format.maxTimePerSetInMilliSeconds / 60000
        : 0,
    startTimeDate: null,
    scoreHistory: [],
    noOfSets: tournamentSubItem.format.noOfSets ? tournamentSubItem.format.noOfSets : null,
    maxScorePerSet: tournamentSubItem.format.maxScorePerSet ? tournamentSubItem.format.maxScorePerSet : null,
    isCumulativeScoring: isCumulativeScore ? true : false,
    tournamentTeamOneId: tournamentItem.id,
    tournamentTeamTwoId: tournamentItem.id,
    tournamentId: tournamentItem.tournament.id,
    tournamentTeamOneScore: 0,
    tournamentTeamTwoScore: 0,
    teamOneHandicap: data.teamOneHandicap ? data.teamOneHandicap : null,
    teamTwoHandicap: data.teamTwoHandicap ? data.teamTwoHandicap : null,
    isTeamOneHandicapApplied: false,
    isTeamTwoHandicapApplied: false,
    expectedEndTimeDate: null,
    tournamentSubItemId: tournamentSubItem.id,
    formatName: tournamentSubItem.format.name,
  };
  await dispatch(
    setState({
      data: newState,
    }),
  );
});

export const matchSyncDataFromBackend = createAsyncThunk<void, { data: MatchStartResponse }, { dispatch: AppDispatch }>(
  'sport/matchSyncDataFromBackend',
  async ({ data }, { dispatch }) => {
    let newState = {
      format: data.sportType,
      matchId: data.id,
      sport: data.sport,
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
      timeInMinutes: data.expectedEndTimeDate
        ? getTimeInMinutes(data.actualStartTimeDate, data.expectedEndTimeDate)
        : 0,
      scoreHistory: data.sets,
      startTimeDate: data.actualStartTimeDate,
      noOfSets: data.noOfSets,
      maxScorePerSet: data.maxScorePerSet,
      isCumulativeScoring: data.cumulativeScoring && data.cumulativeScoring === true ? true : false,
      tournamentTeamOneId: data.tournamentTeamOneId ? data.tournamentTeamOneId : null,
      tournamentTeamTwoId: data.tournamentTeamTwoId ? data.tournamentTeamTwoId : null,
      tournamentId: data.tournamentId ? data.tournamentId : null,
      tournamentTeamOneScore: data.tournamentTeamOneScore ? data.tournamentTeamOneScore : null,
      tournamentTeamTwoScore: data.tournamentTeamTwoScore ? data.tournamentTeamTwoScore : null,
      teamOneHandicap: data.teamOneHandicap ? data.teamOneHandicap : null,
      teamTwoHandicap: data.teamTwoHandicap ? data.teamTwoHandicap : null,
      isTeamOneHandicapApplied: data.isTeamOneHandicapApplied ? data.isTeamOneHandicapApplied : false,
      isTeamTwoHandicapApplied: data.isTeamTwoHandicapApplied ? data.isTeamTwoHandicapApplied : false,
      expectedEndTimeDate: data.expectedEndTimeDate ? data.expectedEndTimeDate : null,
      tournamentSubItemId: data.tournamentSubItemId ? data.tournamentSubItemId : null,
      formatName: null,
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

    newState.timeInMinutes = data.expectedEndTimeDate
      ? getTimeInMinutes(data.actualStartTimeDate, data.expectedEndTimeDate)
      : 0;

    await dispatch(
      setState({
        data: newState,
      }),
    );

    if (data.sport === 'SNOOKER') {
      await dispatch(handleSelectionOfOnAndAheadScores({}));
    }
  },
);

export const handleStartTournamentMatch = createAsyncThunk<
  void,
  { scoreOrder: string[] },
  { state: RootState; dispatch: AppDispatch }
>('sport/handleMatchStart', async ({ scoreOrder }, { dispatch, getState }) => {
  const state = getState();
  const activePlayer = getActivePlayer(state.sport.team1, state.sport.team2);
  const activeTeam = getActiveTeam(state.sport.team1, state.sport.team2);

  if (!activePlayer || !activePlayer.id || activeTeam === null) return;
  await dispatch(clearUndoStack());

  if (activePlayer.id !== state.sport.team1.players[0].id) {
    await dispatch(handleReversePlayersState({ reverseOnApi: true }));
  }

  await dispatch(handleCreateSet({ scoreOrder: scoreOrder }));
  await dispatch(handleCreateTurn({ setIndex: 0, playerId: activePlayer.id }));

  if (state.sport.sport === 'SNOOKER') {
    await dispatch(handleSelectionOfOnAndAheadScores({}));
  }

  await dispatch(changeBackendUpdatedState({ value: false }));
  await dispatch(pushToUndoStackSnooker({}));
});

// SCORING BUTTON CLICK THRUNKS

export const handleMatchStart = createAsyncThunk<
  void,
  { matchId: string; scoreOrder: string[]; expectedEndTimeDate: Date | undefined },
  { state: RootState; dispatch: AppDispatch }
>('sport/handleMatchStart', async ({ matchId, scoreOrder, expectedEndTimeDate }, { dispatch, getState }) => {
  const state = getState();
  const activePlayer = getActivePlayer(state.sport.team1, state.sport.team2);
  const activeTeam = getActiveTeam(state.sport.team1, state.sport.team2);

  if (!activePlayer || !activePlayer.id || activeTeam === null) return;

  await dispatch(clearUndoStack());
  await dispatch(
    setMatchId({
      matchId: matchId,
    }),
  );
  await dispatch(updateMatchStartedTimeDateUtc({ startTimeDate: new Date().toISOString() }));
  await dispatch(
    setExpectedEndTimeDate({ expectedEndTimeDate: expectedEndTimeDate ? expectedEndTimeDate.toISOString() : null }),
  );
  await dispatch(handleCreateSet({ scoreOrder: scoreOrder }));
  await dispatch(handleCreateTurn({ setIndex: 0, playerId: activePlayer.id }));

  if (state.sport.sport === 'SNOOKER') {
    await dispatch(handleSelectionOfOnAndAheadScores({}));
  }

  await dispatch(changeBackendUpdatedState({ value: false }));
  await dispatch(pushToUndoStackSnooker({}));
});

export const handleEndGameThrunk = createAsyncThunk<void, {}, { state: RootState; dispatch: AppDispatch }>(
  'sport/handleMatchStart',
  async ({}, { dispatch, getState }) => {
    let state = getState();
    const activeSet = getActiveSet(state.sport.scoreHistory);

    if (activeSet && activeSet.status === 'ONGOING') {
      await dispatch(handleEndFrame({ updateUndoStack: true }));
    }

    state = getState();
    await matchEndGameRequest({
      matchId: state.sport.matchId!,
      teamWinningIndex: state.sport.team1Score > state.sport.team2Score ? 0 : 1,
    });
  },
);

export const handleBreakOff = createAsyncThunk<
  void,
  { scoreOrder: string[] },
  { state: RootState; dispatch: AppDispatch }
>('sport/handleBreakOff', async ({ scoreOrder }, { dispatch, getState }) => {
  const state = getState();

  await dispatch(setActivePlayer({ playerId: scoreOrder[0] }));
  await dispatch(handleCreateSet({ scoreOrder: scoreOrder }));
  await dispatch(handleCreateTurn({ setIndex: state.sport.scoreHistory.length, playerId: scoreOrder[0] }));
  await dispatch(handleSelectionOfOnAndAheadScores({}));

  await dispatch(changeBackendUpdatedState({ value: false }));
  await dispatch(pushToUndoStackSnooker({}));
});

export const handleConcedeFrame = createAsyncThunk<
  void,
  { values: SnookerConcedeFrameData },
  { state: RootState; dispatch: AppDispatch }
>('sport/handleConcedeFrame', async ({ values }, { dispatch, getState }) => {
  let state = getState();

  const activeSet = getActiveSet(state.sport.scoreHistory);
  const activeSetIndex = getActiveSetIndex(state.sport.scoreHistory);

  if (!activeSet) return;

  await dispatch(concedeSet({ setIndex: activeSetIndex, winningTeamIndex: values.type === 'teamOne' ? 0 : 1 }));
  await dispatch(incrementTotalScore({ teamIndex: values.type === 'teamOne' ? 0 : 1, score: 1 }));

  await dispatch(setActivePlayer({ playerId: activeSet.scoreOrder[1] }));
  await dispatch(changeAheadNumber({ value: 0 }));
  await dispatch(changeOnNumber({ value: 0 }));

  await dispatch(changeBackendUpdatedState({ value: false }));
  await dispatch(pushToUndoStackSnooker({}));
});

export const handleRerackState = createAsyncThunk<void, {}, { state: RootState; dispatch: AppDispatch }>(
  'sport/handleConcedeFrame',
  async ({}, { dispatch, getState }) => {
    let state = getState();

    const activeSet = getActiveSet(state.sport.scoreHistory);
    const activeSetIndex = getActiveSetIndex(state.sport.scoreHistory);

    if (!activeSet) return;

    await dispatch(handleResetSet({ setIndex: activeSetIndex }));
    await dispatch(setActivePlayer({ playerId: activeSet.scoreOrder[0] }));
    await dispatch(handleCreateTurn({ setIndex: activeSetIndex, playerId: activeSet.scoreOrder[0] }));
    await dispatch(handleSelectionOfOnAndAheadScores({}));

    await dispatch(changeBackendUpdatedState({ value: false }));
    await dispatch(pushToUndoStackSnooker({}));
  },
);

export const handleCorrectionState = createAsyncThunk<
  void,
  { values: SnookerScoreCorrectionData },
  { state: RootState; dispatch: AppDispatch }
>('sport/handleCorrection', async ({ values }, { dispatch, getState }) => {
  let state = getState();
  const activeSet = getActiveSet(state.sport.scoreHistory);
  const activeSetIndex = getActiveSetIndex(state.sport.scoreHistory);

  if (!activeSet) return;

  await dispatch(
    createSnookerCorrection({
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
  await dispatch(pushToUndoStackSnooker({}));
});

export const handleBilliardsPointTrigger = createAsyncThunk<
  void,
  { buttonType: BilliardPointType },
  { state: RootState; dispatch: AppDispatch }
>('sport/handleBilliardsPointTrigger', async ({ buttonType }, { dispatch, getState }) => {
  let state = getState();

  let point = buttonType === BilliardPointType.FOUL ? 0 : ballsToPointsEnumBilliards[buttonType];
  let penalty = buttonType === BilliardPointType.FOUL ? ballsToPointsEnumBilliards[buttonType] : 0;

  const activeTeam = getActiveTeam(state.sport.team1, state.sport.team2);
  const activeSet = getActiveSet(state.sport.scoreHistory);
  const activeSetIndex = getActiveSetIndex(state.sport.scoreHistory);
  const activeTurn = getActiveTurn(activeSet ? activeSet : null);
  const activeTurnIndex = getActiveTurnIndex(activeSet ? activeSet : null);

  if (!activeSet || !activeTurn || activeTeam === null) return;

  await dispatch(
    handleCreateBilliardsPoint({
      score: point,
      penalty: penalty,
      type: buttonType,
    }),
  );
  await dispatch(
    handleChangeTurnScore({
      setIndex: activeSetIndex,
      turnIndex: activeTurnIndex,
      score: activeTurn.score + point,
    }),
  );

  let score = 0;
  let teamIndex: 0 | 1 = 0;

  if (penalty > 0) {
    score = activeTeam === 0 ? penalty + activeSet.teamTwoScore : penalty + activeSet.teamOneScore;
    teamIndex = activeTeam === 0 ? 1 : 0;
  } else {
    score = activeTeam === 0 ? point + activeSet.teamOneScore : point + activeSet.teamTwoScore;
    teamIndex = activeTeam;
  }

  if (state.sport.teamOneHandicap && state.sport.teamTwoHandicap) {
    let handicapAdjustedScore = 0;
    if (teamIndex === 0 && !state.sport.isTeamOneHandicapApplied) {
      handicapAdjustedScore = score + state.sport.teamOneHandicap;
    } else if (teamIndex === 1 && !state.sport.isTeamTwoHandicapApplied) {
      handicapAdjustedScore = score + state.sport.teamTwoHandicap;
    } else {
      handicapAdjustedScore = score;
    }

    if (handicapAdjustedScore >= 0) {
      score = handicapAdjustedScore;
      await dispatch(updateTeamHandicapApplied({ teamIndex: teamIndex, value: true }));
    }
  }

  await dispatch(
    handleChangeSetScore({
      score: score,
      teamIndex: teamIndex,
      setIndex: activeSetIndex,
    }),
  );

  if (penalty > 0) {
    await dispatch(handleTeamSwitch({ createUndoAndPushData: false }));
  }

  // await dispatch(handleBilliardsChangeScoreCompletetion({}));

  await dispatch(changeBackendUpdatedState({ value: false }));
  await dispatch(pushToUndoStackSnooker({}));
});

export const handleChangeScoreOnTrigger = createAsyncThunk<
  void,
  { pointType: SnookerPointType; isLongShot: boolean },
  { state: RootState; dispatch: AppDispatch }
>('sport/handleChangeScore', async ({ pointType, isLongShot }, { dispatch, getState }) => {
  let state = getState();
  let point = ballsToPointsEnum[pointType];

  const activeTeam = getActiveTeam(state.sport.team1, state.sport.team2);
  const activeSet = getActiveSet(state.sport.scoreHistory);
  const activeSetIndex = getActiveSetIndex(state.sport.scoreHistory);
  const activeTurn = getActiveTurn(activeSet ? activeSet : null);
  const activeTurnIndex = getActiveTurnIndex(activeSet ? activeSet : null);

  if (!activeSet || !activeTurn || activeTeam === null) return;

  const isFreeBall = checkIfLastBallIsFreeBall(state.sport.scoreHistory);

  if (isFreeBall) {
    const redsLeft = calculateRedsLeft(
      activeSet ? activeSet.turns : [],
      state.sport.format,
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
    await dispatch(handleTeamSwitch({ createUndoAndPushData: false }));
  }

  await dispatch(changeBackendUpdatedState({ value: false }));
  await dispatch(handleSelectionOfOnAndAheadScores({}));
  await dispatch(pushToUndoStackSnooker({}));
});

export const handleSelectionOfBreakOffTeam = createAsyncThunk<
  void,
  { teamIndex: number },
  { state: RootState; dispatch: AppDispatch }
>('sport/handleSelectionOfBreakOffTeam', async ({ teamIndex }, { dispatch, getState }) => {
  const state = getState();
  const teamKey = getTeamKey(teamIndex);

  const playerId = state.sport[teamKey].players[0].id!;
  await dispatch(setActivePlayer({ playerId }));
});

export const handlePlayerSelectState = createAsyncThunk<
  void,
  { player: Player; playerIndex: number; teamIndex: number },
  { state: RootState; dispatch: AppDispatch }
>('sport/handlePlayerSelect', async ({ player, playerIndex, teamIndex }, { dispatch }) => {
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
>('sport/handleFoulScore', async ({ penalty, missCalled, freeBall, redsLost }, { dispatch, getState }) => {
  const state = getState();
  const activeTeam = getActiveTeam(state.sport.team1, state.sport.team2);
  const activeSet = getActiveSet(state.sport.scoreHistory);
  const activeSetIndex = getActiveSetIndex(state.sport.scoreHistory);

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

  await dispatch(handleTeamSwitch({ createUndoAndPushData: false }));
  await dispatch(handleSelectionOfOnAndAheadScores({}));

  await dispatch(changeBackendUpdatedState({ value: false }));
  await dispatch(pushToUndoStackSnooker({}));
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
  'sport/handleSettingsUpdate',
  async ({ format, durationInMinutes, noOfPlayers, streaming, handicap }, { dispatch }) => {
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

export const handleSettingsStateUpdateBilliards = createAsyncThunk<
  void,
  {
    format: 'BILLIARDS_TIME_BASED' | 'BILLIARDS_RACE_TO';
    durationInMinutes: string;
    noOfFrames: number;
    maxPointsPerFrame: number;
    streaming: 'PUBLIC' | 'PRIVATE';
    handicap: number;
  },
  { state: RootState; dispatch: AppDispatch }
>(
  'sport/handleSettingsUpdateBilliards',
  async ({ format, durationInMinutes, noOfFrames, maxPointsPerFrame, streaming, handicap }, { dispatch }) => {
    await dispatch(updateFormat({ format }));
    await dispatch(updateTimeInMinutes({ timeInMinutes: timeStringToDecimalMinutes(durationInMinutes) }));
    await dispatch(updateStreaming({ streaming }));
    await dispatch(updateHandicap({ handicap }));

    if (format === 'BILLIARDS_RACE_TO') {
      await dispatch(updateNoOfSets({ no: noOfFrames }));
      await dispatch(updateMaxScorePerSet({ maxScorePerSet: maxPointsPerFrame }));
    }
  },
);

export const handleEndFrame = createAsyncThunk<
  void,
  { updateUndoStack: boolean },
  { state: RootState; dispatch: AppDispatch }
>('sport/handleEndFrame', async ({ updateUndoStack }, { dispatch, getState }) => {
  const state = getState();
  const activeSet = getActiveSet(state.sport.scoreHistory);
  const activeSetIndex = getActiveSetIndex(state.sport.scoreHistory);

  if (!activeSet) return;

  const winningTeamIndex = activeSet?.teamOneScore > activeSet?.teamTwoScore ? 0 : 1;
  await dispatch(incrementTotalScore({ teamIndex: winningTeamIndex, score: 1 }));
  await dispatch(completeSet({ setIndex: activeSetIndex }));
  await dispatch(setActivePlayer({ playerId: activeSet.scoreOrder[1] }));

  if (updateUndoStack) {
    await dispatch(pushToUndoStackSnooker({}));
  }

  await dispatch(changeBackendUpdatedState({ value: false }));
});

export const handleUndoScoreClicked = createAsyncThunk<void, {}, { state: RootState; dispatch: AppDispatch }>(
  'sport/handleUndoScoreClicked',
  async ({}, { dispatch, getState }) => {
    const state = getState();
    const newState = state.undo.undoStack[state.undo.undoStack.length - 2].previousState;

    if (!newState) return;

    await dispatch(setState({ data: newState }));
    await dispatch(popFromUndoStack());

    await dispatch(changeBackendUpdatedState({ value: false }));
  },
);

export const handleBackendUpdateOfData = createAsyncThunk<void, {}, { state: RootState; dispatch: AppDispatch }>(
  'sport/handleBackendUpdateOfData',
  async ({}, { dispatch, getState }) => {
    const state = getState();

    if (state.sport.isBackendUpdated === false) {
      const activePlayer = getActivePlayer(state.sport.team1, state.sport.team2);
      const activeSet = getActiveSet(state.sport.scoreHistory);

      await dispatch(changeBackendUpdatedState({ value: true }));

      await matchUpdateDataRequest({
        matchId: state.sport.matchId!,
        activePlayerId: activePlayer ? activePlayer.id : null,
        sets: state.sport.scoreHistory,
        teamOneScore: state.sport.team1Score ? state.sport.team1Score : 0,
        teamTwoScore: state.sport.team2Score ? state.sport.team2Score : 0,
        currentSetTeamOneScore: activeSet && activeSet.teamOneScore ? activeSet.teamOneScore : 0,
        currentSetTeamTwoScore: activeSet && activeSet.teamOneScore ? activeSet.teamTwoScore : 0,
        isTeamOneHandicapApplied: state.sport.isTeamOneHandicapApplied,
        isTeamTwoHandicapApplied: state.sport.isTeamTwoHandicapApplied,
      });

      // if (res === true) {
      //   await dispatch(changeBackendUpdatedState({ value: true }));
      // }
    }
  },
);

// helper resuable thrunks.

export const handleSelectionOfOnAndAheadScores = createAsyncThunk<
  void,
  {},
  { state: RootState; dispatch: AppDispatch }
>('sport/updateAheadAndOnScores', async ({}, { dispatch, getState }) => {
  let state = getState();
  const activeSet = getActiveSet(state.sport.scoreHistory);
  const activeTeam = getActiveTeam(state.sport.team1, state.sport.team2);

  if (!activeSet) return;

  let numberAhead = 0;
  let numberOn = 0;

  if (activeSet.status === 'ONGOING') {
    numberAhead = await getNumberAhead(activeSet, activeTeam === 0 ? 'team1' : 'team2');
    numberOn = await getNumberOnTableOfTheCurrentFrame(activeSet, state.sport.format);

    if (numberOn === 0) {
      await dispatch(handleEndFrame({ updateUndoStack: false }));
    }
  }

  await dispatch(changeAheadNumber({ value: numberAhead }));
  await dispatch(changeOnNumber({ value: numberOn }));
});

export const pushToUndoStackSnooker = createAsyncThunk<void, {}, { state: RootState; dispatch: AppDispatch }>(
  'sport/pushToUndoStackSnooker',
  async ({}, { dispatch, getState }) => {
    let state = getState();
    const data = {
      sliceName: 'sport',
      previousState: state.sport,
    };
    await dispatch(pushToUndoStack(data));
  },
);

export const handleTeamSwitch = createAsyncThunk<
  void,
  { createUndoAndPushData: boolean },
  { state: RootState; dispatch: AppDispatch }
>('sport/handleTeamSwitch', async ({ createUndoAndPushData }, { dispatch, getState }) => {
  const state = getState();
  const matchId = state.sport.matchId;
  const activePlayer = getActivePlayer(state.sport.team1, state.sport.team2);
  const activeSet = getActiveSet(state.sport.scoreHistory);
  const activeSetIndex = getActiveSetIndex(state.sport.scoreHistory);

  if (!activeSet || !activePlayer || !matchId) return;

  const scoreOrder = activeSet.scoreOrder;

  const data = await getNextPlayerIndexAndId(scoreOrder, activePlayer.id!);

  await dispatch(setActivePlayer({ playerId: data.nextPlayerId }));

  await dispatch(handleCreateTurn({ setIndex: activeSetIndex, playerId: data.nextPlayerId }));

  if (createUndoAndPushData) {
    await dispatch(changeBackendUpdatedState({ value: false }));
    await dispatch(pushToUndoStackSnooker({}));
  }
});

export const handleReversePlayers = createAsyncThunk<
  void,
  { matchId: string },
  { state: RootState; dispatch: AppDispatch }
>('sport/handleReversePlayers', async ({ matchId }, { dispatch }) => {
  await reversePlayersRequest({ id: matchId });

  await dispatch(handleReversePlayersState({ reverseOnApi: false }));
});

export const handleCreateSet = createAsyncThunk<
  void,
  { scoreOrder: string[] },
  { state: RootState; dispatch: AppDispatch }
>('sport/handleCreateSet', async ({ scoreOrder }, { dispatch, getState }) => {
  const state = getState();

  await dispatch(createSet({ scoreOrder, calculateHandicap: state.sport.sport === 'SNOOKER' }));
});

export const handleCreateTurn = createAsyncThunk<
  void,
  { setIndex: number; playerId: string },
  { state: RootState; dispatch: AppDispatch }
>('sport/handleCreateTurn', async ({ setIndex, playerId }, { dispatch }) => {
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
  'sport/handleCreatePoint',
  async ({ score, penalty, type, isLongShot, missCalled, freeBall, redsLost }, { dispatch, getState }) => {
    const state = getState();
    const activeSet = getActiveSet(state.sport.scoreHistory);
    if (!activeSet) return;
    const activeTurn = getActiveTurn(activeSet);
    if (!activeTurn) return;

    const activeTurnIndex = getActiveTurnIndex(activeSet);
    const activeSetIndex = getActiveSetIndex(state.sport.scoreHistory);

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

export const handleCreateBilliardsPoint = createAsyncThunk<
  void,
  {
    score: number;
    penalty: number;
    type: BilliardPointType;
  },
  { state: RootState; dispatch: AppDispatch }
>('sport/handleCreateBilliardsPoint', async ({ score, penalty, type }, { dispatch, getState }) => {
  const state = getState();
  const activeSet = getActiveSet(state.sport.scoreHistory);
  if (!activeSet) return;
  const activeTurn = getActiveTurn(activeSet);
  if (!activeTurn) return;

  const activeTurnIndex = getActiveTurnIndex(activeSet);
  const activeSetIndex = getActiveSetIndex(state.sport.scoreHistory);

  await dispatch(
    createPoint({
      point: {
        billiardsPoint: {
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
});

export const handleChangeTurnScore = createAsyncThunk<
  void,
  { setIndex: number; turnIndex: number; score: number },
  { state: RootState; dispatch: AppDispatch }
>('sport/handleCreateTurnScore', async ({ setIndex, turnIndex, score }, { dispatch }) => {
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
>('sport/handleCreateTurn', async ({ setIndex, teamIndex, score }, { dispatch }) => {
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
>('sport/handleCreateTurn', async ({ value }, { dispatch }) => {
  await dispatch(
    handleBackendUpdatedState({
      value,
    }),
  );
});

export const handleReversePlayersState = createAsyncThunk<
  void,
  { reverseOnApi: boolean },
  { state: RootState; dispatch: AppDispatch }
>('sport/handleReversePlayersState', async ({ reverseOnApi }, { getState, dispatch }) => {
  const state = getState();
  await dispatch(reverseTeamPlayers());

  if (state.sport.handicap) {
    await dispatch(updateHandicap({ handicap: -state.sport.handicap }));
  }

  if (reverseOnApi === true) {
    await handleReversePlayers({ matchId: state.sport.matchId! });
  }
});

export const handleBilliardsChangeScoreCompletetion = createAsyncThunk<
  void,
  {},
  { state: RootState; dispatch: AppDispatch }
>('sport/handleBilliardsChangeScoreCompletion', async ({}, { getState, dispatch }) => {
  const state = getState();
  const activeSet = getActiveSet(state.sport.scoreHistory);

  if (!activeSet) return;

  if (state.sport.format === 'BILLIARDS_RACE_TO' && state.sport.maxScorePerSet) {
    if (activeSet.teamOneScore >= state.sport.maxScorePerSet || activeSet.teamTwoScore >= state.sport.maxScorePerSet) {
      await dispatch(handleEndFrame({ updateUndoStack: false }));
    }
  }
});
