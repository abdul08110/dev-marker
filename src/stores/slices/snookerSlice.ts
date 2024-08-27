/**
 * DEFINES SNOOKER SCORING STATE AND DISPATCH FUNCTIONS
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PointType, SetPlayerPayloadAction, SnookerScoringState } from '../types';

const initialState: SnookerScoringState = {
    format: 'SNOOKER_15_RED',
    numberOfFrames: 3,
    matchId: null,
    team1Score: 0,
    team2Score: 0,
    players: {
        team1: {
            players: [{
                playerName: 'Player 1',
                isActive: false,
                id: null,
                playerImage: null
            }],
            score: 0
        },
        team2: {
            players: [{
                playerName: 'Player 1',
                isActive: false,
                id: null,
                playerImage: null
            }],
            score: 0
        }
    },
    handicap: 0,
    streaming: 'PUBLIC',
    timeInMinutes: 30,
    scoreHistory: [],
};

const snookerSlice = createSlice({
    name: 'snooker',
    initialState,
    reducers: {
        setTeamPlayer(state, action: PayloadAction<SetPlayerPayloadAction>) {
            const team = action.payload.teamIndex === 0 ? 'team1' : 'team2'
            state.players[team].players[action.payload.playerIndex] = {
                playerName: action.payload.player.name,
                isActive: false,
                playerImage: action.payload.player.profilePhoto ? action.payload.player.profilePhoto : null,
                id: action.payload.player.id
            };
        },
        setMatchId(state, action: PayloadAction<{ matchId: string }>) {
            state.matchId = action.payload.matchId;
        },
        setActivePlayer(state, action: PayloadAction<{ playerId: string }>) {
            const id = action.payload.playerId;

            state.players.team1.players.forEach(player => {
                player.isActive = player.id === id;
            });
            state.players.team2.players.forEach(player => {
                player.isActive = player.id === id;
            });
        },
        createSet(state) {
            if (state.numberOfFrames > state.scoreHistory.length) {
                state.scoreHistory.push({
                    id: null,
                    teamOneScore: 0,
                    teamTwoScore: 0,
                    turns: [],
                    status: 'ONGOING'
                })
            }
        },
        completeSet(state) {
            state.scoreHistory[state.scoreHistory.length - 1].status = 'COMPLETED';
        },
        createTurn(state, action: PayloadAction<{ playerId: string }>) {
            const id = action.payload.playerId;
            state.scoreHistory[state.scoreHistory.length - 1].turns.push({
                id: null,
                timeScored: new Date().toISOString(),
                turnPlayerId: id,
                score: 0,
                points: []
            })
        },
        createPoint(state, action: PayloadAction<{ score: number, type: PointType, penalty: number, ballsLost: number, missCalled: boolean, freeBall: boolean }>) {
            const data = action.payload;
            const turns = state.scoreHistory[state.scoreHistory.length - 1].turns;
            state.scoreHistory[state.scoreHistory.length - 1].turns[turns.length - 1].points.push({
                ...data,
                timeScored: new Date().toISOString(),
            })
        },
        incrementTurnScore(state, action: PayloadAction<{ score: number }>) {
            const turns = state.scoreHistory[state.scoreHistory.length - 1].turns;
            state.scoreHistory[state.scoreHistory.length - 1].turns[turns.length - 1].score += action.payload.score;
        },
        incrementSetScore(state, action: PayloadAction<{ score: number, teamIndex: number }>) {
            const teamName = action.payload.teamIndex === 0 ? 'teamOneScore' : 'teamTwoScore';
            state.scoreHistory[state.scoreHistory.length - 1][teamName] += action.payload.score;
        },
        decrementTurnScore(state, action: PayloadAction<{ score: number }>) {
            const turns = state.scoreHistory[state.scoreHistory.length - 1].turns;
            state.scoreHistory[state.scoreHistory.length - 1].turns[turns.length - 1].score -= action.payload.score;
        },
        decrementSetScore(state, action: PayloadAction<{ score: number, teamIndex: number }>) {
            const teamName = action.payload.teamIndex === 0 ? 'teamOneScore' : 'teamTwoScore';
            state.scoreHistory[state.scoreHistory.length - 1][teamName] -= action.payload.score;
        },
        undoLastPoint(state, action: PayloadAction<{ setIndex: number, turnIndex: number }>) {
           state.scoreHistory[action.payload.setIndex].turns[action.payload.turnIndex].points.pop();
        },
        updateNoOfFrames(state, action: PayloadAction<{ numberOfFrames: number }>) {
            state.numberOfFrames = action.payload.numberOfFrames;
        },
        updateHandicap(state, action: PayloadAction<{ handicap: number }>) {
            state.handicap = action.payload.handicap;
        },
        updateTimeInMinutes(state, action: PayloadAction<{ timeInMinutes: number }>) {
            state.timeInMinutes = action.payload.timeInMinutes;
        },
        updateFormat(state, action: PayloadAction<{ format: 'SNOOKER_15_RED' | 'SNOOKER_10_RED' | 'SNOOKER_6_RED' }>) {
            state.format = action.payload.format;
        },
        updateStreaming(state, action: PayloadAction<{ streaming: 'PUBLIC' | 'PRIVATE' }>) {
            state.streaming = action.payload.streaming;
        },
        addPlayer(state, action: PayloadAction<{ teamIndex: number }>) {
            const teamName = action.payload.teamIndex === 0 ? 'team1' : 'team2';
            state.players[teamName].players[1] = {
                playerName: 'Player 2',
                isActive: false,
                id: null,
                playerImage: null
            }
        }
    }
});

export const { updateNoOfFrames, updateHandicap, updateTimeInMinutes, updateFormat, updateStreaming, setTeamPlayer, setMatchId, setActivePlayer, createSet, createTurn, createPoint, incrementTurnScore, incrementSetScore, completeSet, decrementTurnScore, decrementSetScore, undoLastPoint, addPlayer } = snookerSlice.actions;
export default snookerSlice.reducer;