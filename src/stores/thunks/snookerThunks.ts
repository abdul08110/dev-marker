/**
 * SNOOKER STATE ASYNC HANDLER FOR STATE DISPATCH FUNCTIONS
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '..';
import { addPlayer, completeSet, createPoint, createSet, createTurn, decrementSetScore, decrementTurnScore, incrementSetScore, incrementTurnScore, setActivePlayer, setMatchId, setTeamPlayer, undoLastPoint, updateFormat, updateNoOfFrames, updateStreaming, updateTimeInMinutes } from '../slices/snookerSlice';
import { Player, PointType } from '../types';
import { checkIfLastBallIsFreeBall, getActiveSet, getActiveSetIndex, getActiveTeam, getActiveTurnIndex, getLastPoint } from '../selectors/snookerSelector';
import { timeStringToDecimalMinutes } from '@/utils/functions';

export const handleSelectionOfActiveTeam = createAsyncThunk<void, { teamIndex: number }, { state: RootState; dispatch: AppDispatch }>(
    'snooker/handleSelectionOfActiveTeam',
    async ({ teamIndex }, { dispatch, getState }) => {
        const state = getState();

        const teamKey = teamIndex === 0 ? 'team1' : 'team2';
        let playerId: string;

        if (state.snooker.players.team1.players.length === 1 && state.snooker.players.team2.players.length === 1) {
            playerId = state.snooker.players[teamKey].players[0].id!;
        } else {
            const playerOneId = state.snooker.players[teamKey].players[0].id!;
            const playerTwoId = state.snooker.players[teamKey].players[1].id!;

            const lastTurnPlayerOneIndex = state.snooker.scoreHistory[state.snooker.scoreHistory.length - 1].turns.map(turn => turn.turnPlayerId).lastIndexOf(playerOneId);
            const lastTurnPlayerTwoIndex = state.snooker.scoreHistory[state.snooker.scoreHistory.length - 1].turns.map(turn => turn.turnPlayerId).lastIndexOf(playerTwoId);

            if (lastTurnPlayerOneIndex > lastTurnPlayerTwoIndex) playerId = playerTwoId;
            else playerId = playerOneId;
        }

        await dispatch(setActivePlayer({ playerId }))
        await dispatch(createTurn({ playerId }))
    }
)

export const handleChangeScoreOnTrigger = createAsyncThunk<void, { point: number, type: PointType }, { state: RootState; dispatch: AppDispatch }>(
    'snooker/handleChangeScore',
    async ({ point, type }, { dispatch, getState }) => {
        const state = getState();

        const activeTeam = getActiveTeam(state.snooker.players.team1, state.snooker.players.team2);
        const isFreeBall = checkIfLastBallIsFreeBall(state.snooker.scoreHistory);

        point = isFreeBall ? 1 : point;

        await dispatch(createPoint({
            score: point,
            type,
            penalty: 0,
            ballsLost: 0,
            missCalled: false,
            freeBall: false
        }))
        await dispatch(incrementTurnScore({
            score: point,
        }))
        await dispatch(incrementSetScore({
            score: point,
            teamIndex: activeTeam.team1Active ? 0 : 1
        }))
    }
)

export const handleMatchStart = createAsyncThunk<void, { matchId: string }, { state: RootState; dispatch: AppDispatch }>(
    'snooker/handleMatchStart',
    async ({ matchId }, { dispatch }) => {
        await dispatch(setMatchId({
            matchId: matchId
        }));
        await dispatch(createSet());
    }
)

export const handlePlayerSelectState = createAsyncThunk<void, { player: Player, playerIndex: number, teamIndex: number }, { state: RootState; dispatch: AppDispatch }>(
    'snooker/handlePlayerSelect',
    async ({ player, playerIndex, teamIndex }, { dispatch }) => {
        await dispatch(setTeamPlayer({
            player: player,
            playerIndex: playerIndex,
            teamIndex: teamIndex
        }))
    }
)

export const handleFrameCompleted = createAsyncThunk<void, {}, { state: RootState; dispatch: AppDispatch }>(
    'snooker/handleFrameCompleted',
    async ({ }, { dispatch, getState }) => {
        const state = getState();
        if (state.snooker.numberOfFrames > state.snooker.scoreHistory.length) {
            await dispatch(createSet());

        }
        await dispatch(completeSet());
    }
)

export const handleUndoScoreClicked = createAsyncThunk<void, {}, { state: RootState; dispatch: AppDispatch }>(
    'snooker/undoScore',
    async ({ }, { dispatch, getState }) => {
        const state = getState();
        const currentSet = getActiveSet(state.snooker.scoreHistory);
        if (currentSet && currentSet.turns.length > 0) {
            const lastTurn = currentSet.turns[currentSet.turns.length - 1];

            if (lastTurn.points.length === 0) {
                currentSet.turns.pop();
            } else {
                const team = getActiveTeam(state.snooker.players.team1, state.snooker.players.team2);

                const lastPoint = getLastPoint(lastTurn)!;

                if (lastPoint.type === PointType.FOUL) {
                    const penalty = lastPoint.penalty;
                    await dispatch(decrementSetScore({ score: penalty, teamIndex: team.team1Active ? 1 : 0 }));
                } else {
                    const score = lastPoint.score;
                    await dispatch(decrementTurnScore({ score }));
                    await dispatch(decrementSetScore({ score, teamIndex: team.team1Active ? 0 : 1 }));
                }
                await dispatch(undoLastPoint({ setIndex: getActiveSetIndex(state.snooker.scoreHistory), turnIndex: getActiveTurnIndex(currentSet) }))

                lastTurn.points.pop();
            }
        }
    }

)

export const handleFoulScore = createAsyncThunk<void, { penalty: number, missCalled: boolean, freeBall: boolean, redsLost: number }, { state: RootState; dispatch: AppDispatch }>(
    'snooker/handleFoulScore',
    async ({ penalty, missCalled, freeBall, redsLost }, { dispatch, getState }) => {
        const state = getState();

        const activeTeam = getActiveTeam(state.snooker.players.team1, state.snooker.players.team2);
        await dispatch(createPoint({ score: 0, type: PointType.FOUL, penalty, ballsLost: redsLost, missCalled, freeBall }));
        await dispatch(incrementSetScore({ score: penalty, teamIndex: activeTeam.team1Active ? 1 : 0 }));
    }
)

export const handleSettingsStateUpdate = createAsyncThunk<void, { format: 'SNOOKER_15_RED' | 'SNOOKER_10_RED' | 'SNOOKER_6_RED', numberOfFrames: number, durationInMinutes: string, noOfPlayers: '2' | '4', streaming: 'PUBLIC' | 'PRIVATE', handicap: number }, { state: RootState; dispatch: AppDispatch }>(
    'snooker/handleSettingsUpdate',
    async ({ format, numberOfFrames, durationInMinutes, noOfPlayers, streaming, handicap }, { dispatch, getState }) => {
        await dispatch(updateFormat({ format }));
        await dispatch(updateNoOfFrames({ numberOfFrames }));
        await dispatch(updateTimeInMinutes({ timeInMinutes: timeStringToDecimalMinutes(durationInMinutes) }));
        await dispatch(updateFormat({ format: format }));
        await dispatch(updateStreaming({ streaming }));
        
        if (noOfPlayers === '4') {
            await dispatch(addPlayer({ teamIndex: 0 }));
            await dispatch(addPlayer({ teamIndex: 1 }));
        }
    }
)
