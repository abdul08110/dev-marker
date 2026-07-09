/**
 *  SPORT SLICER
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GeneralScoringState, Player, Point, StopClockState } from '../types';
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
  isRankingEvent: false,
  snookerHandicapType: 'DIFFERENCE',
  phase: null,
  isStopClockEnabled: false,
  stopClockFrameTimeInSeconds: 900,
  stopClockTurnTimeInSeconds: 30,
  stopClockVoiceEnabled: false,
  stopClockState: null,
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
        teamOneHandicap: null,
        teamTwoHandicap: null,
        expectedEndTimeDate: null,
        tournamentSubItemId: null,
        tournamentTeamOneId: null,
        tournamentTeamTwoId: null,
        tournamentId: null,
        tournamentTeamOneScore: null,
        tournamentTeamTwoScore: null,
        formatName: null,
        switchType: 'VISIT',
        isRankingEvent: false,
        isStopClockEnabled: false,
        stopClockFrameTimeInSeconds: 900,
        stopClockTurnTimeInSeconds: 30,
        stopClockVoiceEnabled: false,
        stopClockState: null,
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
        tournamentTeamOneId: null,
        tournamentTeamTwoId: null,
        teamOneHandicap: null,
        teamTwoHandicap: null,
        tournamentId: null,
        tournamentTeamOneScore: null,
        tournamentTeamTwoScore: null,
        formatName: null,
        switchType: null,
        isRankingEvent: false,
        isStopClockEnabled: false,
        stopClockState: null,
      });
    },
    setMatchId(state, action: PayloadAction<{ matchId: string }>) {
      state.matchId = action.payload.matchId;
    },
    setFormatName(state, action: PayloadAction<{ formatName: string }>) {
      state.formatName = action.payload.formatName;
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

      let teamOneStartScore = 0;
      let teamTwoStartScore = 0;

      if (shouldCalculateHandicap) {
        if (state.snookerHandicapType === 'DIFFERENCE') {
          let relativeHandicap = state.handicap;
          if (state.teamOneHandicap != null || state.teamTwoHandicap != null) {
            relativeHandicap = (state.teamOneHandicap ?? 0) - (state.teamTwoHandicap ?? 0);
          }
          teamOneStartScore = relativeHandicap > 0 ? relativeHandicap : 0;
          teamTwoStartScore = relativeHandicap < 0 ? Math.abs(relativeHandicap) : 0;
        } else {
          teamOneStartScore = 0;
          teamTwoStartScore = 0;
        }
      }

      state.scoreHistory.push({
        teamOneScore: teamOneStartScore,
        teamTwoScore: teamTwoStartScore,
        turns: [],
        status: 'ONGOING',
        snookerCorrections: [],
        billiardsCorrections: [],
        scoreOrder: scoreOrder,
        setConcededTo: null,
        // Filled in once the backend confirms frame start (see setStopClockState) — not guessed
        // client-side, since frame time is authoritative from the server.
        frameStartedAt: null,
      });

      if (state.isStopClockEnabled) {
        state.stopClockState = {
          activePlayerClock: 'STOPPED',
          remainingFrameTimeInMs: state.stopClockFrameTimeInSeconds * 1000,
          currentTurnRemainingTimeInMs: state.stopClockTurnTimeInSeconds * 1000,
          turnStartedAt: null,
          frameStartedAt: null,
        };
      }
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
    setExpectedEndTimeDate(state, action: PayloadAction<{ expectedEndTimeDate: string | null }>) {
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
    updateTeamHandicaps(state, action: PayloadAction<{ teamOneHandicap: number; teamTwoHandicap: number }>) {
      state.teamOneHandicap = action.payload.teamOneHandicap || null;
      state.teamTwoHandicap = action.payload.teamTwoHandicap || null;
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
    updateIsRankingEvent(state, action: PayloadAction<{ isRankingEvent: boolean }>) {
      state.isRankingEvent = action.payload.isRankingEvent;
    },
    updateStopClockSettings(
      state,
      action: PayloadAction<{
        isStopClockEnabled: boolean;
        stopClockFrameTimeInSeconds: number;
        stopClockTurnTimeInSeconds: number;
        stopClockVoiceEnabled: boolean;
      }>,
    ) {
      state.isStopClockEnabled = action.payload.isStopClockEnabled;
      state.stopClockFrameTimeInSeconds = action.payload.stopClockFrameTimeInSeconds;
      state.stopClockTurnTimeInSeconds = action.payload.stopClockTurnTimeInSeconds;
      state.stopClockVoiceEnabled = action.payload.stopClockVoiceEnabled;
    },
    // Purely local — no backend call for the toggle itself. stopClockState.turnStartedAt is the
    // TRANSPORT value (it rides end-to-end through the update-match-data echo + MQTT relay, the
    // same way frameStartedAt does for frame time). The DISPLAY value is mirrored onto the active
    // turn's own turnStartedAt field, so the shot clock is scoped to whichever turn is active — a
    // new turn always reads as not-started even if the previous turn's clock was left running.
    // This per-turn field must stay named turnStartedAt to match the backend's Turn.turnStartedAt
    // column — it's sent as part of the full scoreHistory on every sync (handleBackendUpdateOfData)
    // and is what lets a *historical* turn (not just the live one) show a correct shot clock when
    // replayed later (VOD scrubbing, stream overlay catch-up, etc.).
    toggleTurnClock(state) {
      if (!state.stopClockState) return;

      const setIndex = state.scoreHistory.findIndex((set) => set.status === 'ONGOING');
      const turns = setIndex !== -1 ? state.scoreHistory[setIndex].turns : [];
      const activeTurn = turns[turns.length - 1];

      const isRunning = state.stopClockState.activePlayerClock === 'RUNNING';
      if (isRunning) {
        state.stopClockState.activePlayerClock = 'STOPPED';
        state.stopClockState.turnStartedAt = null;
        if (activeTurn) activeTurn.turnStartedAt = null;
      } else {
        const now = new Date().toISOString();
        state.stopClockState.activePlayerClock = 'RUNNING';
        state.stopClockState.turnStartedAt = now;
        state.stopClockState.currentTurnRemainingTimeInMs = state.stopClockTurnTimeInSeconds * 1000;
        if (activeTurn) activeTurn.turnStartedAt = now;
      }
    },
    setStopClockState(state, action: PayloadAction<{ stopClockState: StopClockState | null }>) {
      state.stopClockState = action.payload.stopClockState;

      // Mirror the frame anchor onto the active Set itself (Set.frameStartedAt), not just the
      // transport-level stopClockState — this is what lets a *historical* frame (once completed
      // and no longer "live") retain its own correct frame-start time for later replay/streaming,
      // instead of only ever reflecting whatever frame happens to be live right now.
      const setIndex = state.scoreHistory.findIndex((set) => set.status === 'ONGOING');
      if (setIndex !== -1) {
        state.scoreHistory[setIndex].frameStartedAt = action.payload.stopClockState?.frameStartedAt ?? null;
      }
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
  updateTeamHandicaps,
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
  resetStateBilliards,
  updateNoOfSets,
  updateMaxScorePerSet,
  updateTeamHandicapApplied,
  setExpectedEndTimeDate,
  updateIsRankingEvent,
  setFormatName,
  updateStopClockSettings,
  setStopClockState,
  toggleTurnClock,
} = sportSlice.actions;
export default sportSlice.reducer;
