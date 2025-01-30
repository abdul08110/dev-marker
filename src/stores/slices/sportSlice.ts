/**
 *  SPORT SLICER
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GeneralScoringState, Player, Point } from '../types';
import { getTeamKey } from '../selectors/commonSport';

const initialState: GeneralScoringState = {
  format: 'SNOOKER_15_RED',
  matchId: null,
  isBackendUpdated: true,
  noOfSets: null,
  maxScorePerSet: null,
  sport: 'SNOOKER',
  team1Score: 0,
  team2Score: 0,
  numberAhead: 0,
  numberOn: 0,
  isCumulativeScoring: false,
  team1: {
    players: [
      {
        name: 'Player 1',
        isActive: false,
        id: null,
        profilePhoto: null,
      },
    ],
    score: 0,
  },
  team2: {
    players: [
      {
        name: 'Player 2',
        isActive: false,
        id: null,
        profilePhoto: null,
      },
    ],
    score: 0,
  },
  handicap: 0,
  streaming: 'PRIVATE',
  timeInMinutes: 30,
  scoreHistory: [],
  startTimeDate: null,
  tournamentTeamOneId: null,
  tournamentTeamTwoId: null,
  tournamentId: null,
  tournamentTeamOneScore: null,
  tournamentTeamTwoScore: null,
  teamOneHandicap: null,
  teamTwoHandicap: null,
  isTeamOneHandicapApplied: false,
  isTeamTwoHandicapApplied: false,
  expectedEndTimeDate: null,
  tournamentSubItemId: null,
  formatName: null,
  switchType: null,
};

const sportSlice = createSlice({
  name: 'sport',
  initialState,
  reducers: {
    setTeamPlayer(state, action: PayloadAction<{ teamIndex: number; playerIndex: number; player: Player }>) {
      const team = getTeamKey(action.payload.teamIndex);
      state[team].players[action.payload.playerIndex] = {
        ...action.payload.player,
        isActive: false,
      };
    },
    resetStateSnooker(state) {
      Object.assign(state, {
        format: 'SNOOKER_15_RED',
        matchId: null,
        isBackendUpdated: true,
        sport: 'SNOOKER',
        team1Score: 0,
        team2Score: 0,
        numberAhead: 0,
        numberOn: 0,
        team1: {
          players: [
            {
              name: 'Player 1',
              isActive: false,
              id: null,
              profilePhoto: null,
            },
          ],
          score: 0,
        },
        team2: {
          players: [
            {
              name: 'Player 2',
              isActive: false,
              id: null,
              profilePhoto: null,
            },
          ],
          score: 0,
        },
        handicap: 0,
        streaming: 'PRIVATE',
        timeInMinutes: 30,
        scoreHistory: [],
        startTimeDate: null,
        noOfSets: null,
        maxScorePerSet: null,
        isTeamOneHandicapApplied: false,
        isTeamTwoHandicapApplied: false,
        expectedEndTimeDate: null,
        tournamentSubItemId: null,
        formatName: null,
        switchType: 'VISIT',
      });
    },
    resetStateBilliards(state) {
      Object.assign(state, {
        format: 'BILLIARDS_TIME_BASED',
        matchId: null,
        isBackendUpdated: true,
        sport: 'BILLIARDS',
        team1Score: 0,
        team2Score: 0,
        numberAhead: 0,
        numberOn: 0,
        team1: {
          players: [
            {
              name: 'Player 1',
              isActive: false,
              id: null,
              profilePhoto: null,
            },
          ],
          score: 0,
        },
        team2: {
          players: [
            {
              name: 'Player 2',
              isActive: false,
              id: null,
              profilePhoto: null,
            },
          ],
          score: 0,
        },
        handicap: 0,
        streaming: 'PRIVATE',
        timeInMinutes: 30,
        scoreHistory: [],
        startTimeDate: null,
        noOfSets: null,
        maxScorePerSet: null,
        isTeamOneHandicapApplied: false,
        isTeamTwoHandicapApplied: false,
        expectedEndTimeDate: null,
        tournamentSubItemId: null,
        formatName: null,
        switchType: null,
      });
    },
    setMatchId(state, action: PayloadAction<{ matchId: string }>) {
      state.matchId = action.payload.matchId;
    },
    setActivePlayer(state, action: PayloadAction<{ playerId: string }>) {
      const id = action.payload.playerId;

      state.team1.players.forEach((player) => {
        player.isActive = player.id === id;
      });
      state.team2.players.forEach((player) => {
        player.isActive = player.id === id;
      });
    },
    setState(state, action: PayloadAction<{ data: GeneralScoringState }>) {
      Object.assign(state, action.payload.data);
    },
    createSet(state, action: PayloadAction<{ scoreOrder: string[]; calculateHandicap: boolean }>) {
      const scoreOrder = action.payload.scoreOrder;
      const shouldCalculateHandicap = action.payload.calculateHandicap;

      state.scoreHistory.push({
        teamOneScore: state.handicap > 0 && shouldCalculateHandicap ? state.handicap : 0,
        teamTwoScore: state.handicap < 0 && shouldCalculateHandicap ? Math.abs(state.handicap) : 0,
        turns: [],
        status: 'ONGOING',
        snookerCorrections: [],
        billiardsCorrections: [],
        scoreOrder: scoreOrder,
        setConcededTo: null,
      });
    },
    createSnookerCorrection(
      state,
      action: PayloadAction<{
        setIndex: number;
        teamOneScore: number;
        teamTwoScore: number;
        redsRemaining: number;
      }>,
    ) {
      const data = action.payload;
      state.scoreHistory[data.setIndex].snookerCorrections.push({
        teamOneScore: data.teamOneScore,
        teamTwoScore: data.teamTwoScore,
        redsRemaining: data.redsRemaining,
        timeScored: new Date().toISOString(),
      });
    },
    concedeSet(
      state,
      action: PayloadAction<{
        setIndex: number;
        winningTeamIndex: 0 | 1;
      }>,
    ) {
      const data = action.payload;
      state.scoreHistory[data.setIndex].setConcededTo = data.winningTeamIndex;
      state.scoreHistory[data.setIndex].status = 'CONCEDED';
    },
    deleteSet(state, action: PayloadAction<{ setIndex: number }>) {
      state.scoreHistory.splice(action.payload.setIndex, 1);
    },
    completeSet(state, action: PayloadAction<{ setIndex: number }>) {
      state.scoreHistory[action.payload.setIndex].status = 'COMPLETED';
    },
    setExpectedEndTimeDate(state, action: PayloadAction< { expectedEndTimeDate: string | null }>) {
      state.expectedEndTimeDate = action.payload.expectedEndTimeDate;
    },
    changeSetStatus(state, action: PayloadAction<{ setIndex: number; status: 'COMPLETED' | 'ONGOING' | 'CONCEDED' }>) {
      state.scoreHistory[action.payload.setIndex].status = action.payload.status;
    },
    createTurn(state, action: PayloadAction<{ setIndex: number; playerId: string }>) {
      const id = action.payload.playerId;

      state.scoreHistory[action.payload.setIndex].turns.push({
        timeScored: new Date().toISOString(),
        turnPlayerId: id,
        score: 0,
        points: [],
      });
    },
    createPoint(state, action: PayloadAction<{ point: Point; turnIndex: number; setIndex: number }>) {
      const data = action.payload;
      state.scoreHistory[data.setIndex].turns[data.turnIndex].points.push({
        ...data.point,
        timeScored: new Date().toISOString(),
      });
    },
    changeTurnScore(state, action: PayloadAction<{ setIndex: number; turnIndex: number; score: number }>) {
      state.scoreHistory[action.payload.setIndex].turns[action.payload.turnIndex].score = action.payload.score;
    },
    handleResetSet(state, action: PayloadAction<{ setIndex: number }>) {
      state.scoreHistory[action.payload.setIndex].snookerCorrections = [];
      state.scoreHistory[action.payload.setIndex].billiardsCorrections = [];
      state.scoreHistory[action.payload.setIndex].teamOneScore = 0;
      state.scoreHistory[action.payload.setIndex].teamTwoScore = 0;
      state.scoreHistory[action.payload.setIndex].turns = [];
    },
    incrementTotalScore(state, action: PayloadAction<{ score: number; teamIndex: number }>) {
      if (action.payload.teamIndex === 0) {
        state.team1Score += action.payload.score;
      } else {
        state.team2Score += action.payload.score;
      }
    },
    changeSetScore(state, action: PayloadAction<{ score: number; teamIndex: number; setIndex: number }>) {
      const teamName = action.payload.teamIndex === 0 ? 'teamOneScore' : 'teamTwoScore';
      state.scoreHistory[action.payload.setIndex][teamName] = action.payload.score;
    },
    updateHandicap(state, action: PayloadAction<{ handicap: number }>) {
      state.handicap = action.payload.handicap;
    },
    updateTimeInMinutes(state, action: PayloadAction<{ timeInMinutes: number }>) {
      state.timeInMinutes = action.payload.timeInMinutes;
    },
    updateFormat(
      state,
      action: PayloadAction<{
        format: 'SNOOKER_15_RED' | 'SNOOKER_10_RED' | 'SNOOKER_6_RED' | 'BILLIARDS_RACE_TO' | 'BILLIARDS_TIME_BASED';
      }>,
    ) {
      state.format = action.payload.format;
    },
    updateNoOfSets(state, action: PayloadAction<{ no: number }>) {
      state.noOfSets = action.payload.no;
    },
    updateMaxScorePerSet(state, action: PayloadAction<{ maxScorePerSet: number }>) {
      state.maxScorePerSet = action.payload.maxScorePerSet;
    },
    updateStreaming(state, action: PayloadAction<{ streaming: 'PUBLIC' | 'PRIVATE' }>) {
      state.streaming = action.payload.streaming;
    },
    addPlayer(state, action: PayloadAction<{ teamIndex: number }>) {
      const team = getTeamKey(action.payload.teamIndex);
      state[team].players[1] = {
        name: 'Player 2',
        isActive: false,
        id: null,
        profilePhoto: null,
      };
    },
    changeAheadNumber(state, action: PayloadAction<{ value: number }>) {
      state.numberAhead = action.payload.value;
    },
    changeOnNumber(state, action: PayloadAction<{ value: number }>) {
      state.numberOn = action.payload.value;
    },
    makeAllPlayersInactive(state) {
      state.team1.players.forEach((value) => (value.isActive = false));
      state.team2.players.forEach((value) => (value.isActive = false));
    },
    reverseTeamPlayers(state) {
      const teamOnePlayers = state.team1.players;
      const teamTwoPlayers = state.team2.players;
      const teamOneHandicap = state.teamOneHandicap;
      const teamTwoHandicap = state.teamTwoHandicap;

      state.team1.players = teamTwoPlayers;
      state.team2.players = teamOnePlayers;
      state.teamOneHandicap = teamTwoHandicap;
      state.teamTwoHandicap = teamOneHandicap;
    },
    updateMatchStartedTimeDateUtc(state, action: PayloadAction<{ startTimeDate: string }>) {
      state.startTimeDate = action.payload.startTimeDate;
    },
    handleBackendUpdatedState(state, action: PayloadAction<{ value: boolean }>) {
      state.isBackendUpdated = action.payload.value;
    },
    updateTeamHandicapApplied(state, action: PayloadAction<{ teamIndex: 0 | 1; value: boolean }>) {
      const teamName = action.payload.teamIndex === 0 ? 'isTeamOneHandicapApplied' : 'isTeamTwoHandicapApplied';
      state[teamName] = action.payload.value;
    },
  },
});

export const {
  updateHandicap,
  updateTimeInMinutes,
  updateFormat,
  updateStreaming,
  setTeamPlayer,
  setMatchId,
  setActivePlayer,
  createTurn,
  createPoint,
  changeTurnScore,
  changeSetScore,
  completeSet,
  addPlayer,
  changeAheadNumber,
  changeOnNumber,
  makeAllPlayersInactive,
  incrementTotalScore,
  reverseTeamPlayers,
  updateMatchStartedTimeDateUtc,
  deleteSet,
  changeSetStatus,
  createSet,
  setState,
  createSnookerCorrection,
  concedeSet,
  handleResetSet,
  handleBackendUpdatedState,
  resetStateSnooker,
  updateNoOfSets,
  updateMaxScorePerSet,
  updateTeamHandicapApplied,
  setExpectedEndTimeDate
} = sportSlice.actions;
export default sportSlice.reducer;
