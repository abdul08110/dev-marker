/**
 * SNOOKER STATE ASYNC HANDLER FOR STATE DISPATCH FUNCTIONS
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '..';
import { addPlayer, changeAheadNumber, changeOnNumber, completeSet, createPoint, createSet, createTurn, decrementSetScore, decrementTurnScore, incrementSetScore, incrementTotalScore, incrementTurnScore, makeAllPlayersInactive, removeTurn, setActivePlayer, setMatchId, setTeamPlayer, undoLastPoint, updateFormat, updateHandicap, updateNoOfFrames, updateStreaming, updateTimeInMinutes } from '../slices/snookerSlice';
import { Player, PointType } from '../types';
import { checkIfLastBallIsFreeBall, getNumberAhead, getNumberOnTableOfTheCurrentFrame } from '../selectors/snookerSelector';
import { timeStringToDecimalMinutes } from '@/utils/functions';
import { getActiveSet, getActiveSetIndex, getActiveTeam, getActiveTurn, getActiveTurnIndex, getLastPoint } from '../selectors/commonSport';
import { toast } from '@/components/ui/use-toast';

export const handleSelectionOfActiveTeam = createAsyncThunk<void, { teamIndex: number }, { state: RootState; dispatch: AppDispatch }>(
    'snooker/handleSelectionOfActiveTeam',
    async ({ teamIndex }, { dispatch, getState }) => {
        let state = getState();

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

        state = getState();

        const activeSet = getActiveSet(state.snooker.scoreHistory)!;

        const numberAhead = await getNumberAhead(activeSet, teamIndex === 0 ? 'team1' : 'team2');
        const numberOn = await getNumberOnTableOfTheCurrentFrame(activeSet, state.snooker.format);

        await dispatch(changeAheadNumber({ value: numberAhead }));
        await dispatch(changeOnNumber({ value: numberOn }));
    }
)

export const handleChangeScoreOnTrigger = createAsyncThunk<void, { point: number, type: PointType }, { state: RootState; dispatch: AppDispatch }>(
    'snooker/handleChangeScore',
    async ({ point, type }, { dispatch, getState }) => {
        let state = getState();

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

        state = getState();

        const activeSet = getActiveSet(state.snooker.scoreHistory)!;


        const numberAhead = await getNumberAhead(activeSet, activeTeam.team1Active ? 'team1' : 'team2');
        const numberOn = await getNumberOnTableOfTheCurrentFrame(activeSet, state.snooker.format);

        await dispatch(changeAheadNumber({ value: numberAhead }));
        await dispatch(changeOnNumber({ value: numberOn }));

        if (numberOn === 0) {
            toast({
                title: "Frame Completed",
                className: 'bg-white',
            });

            await dispatch(incrementTotalScore({ score: 1, teamIndex: activeTeam.team1Active ? 0 : 1 }))
            await dispatch(completeSet());
            await dispatch(makeAllPlayersInactive());
            await dispatch(changeAheadNumber({ value: 0 }));
            await dispatch(changeOnNumber({ value: 0 }));
        }
    }
)

export const handleMatchStart = createAsyncThunk<void, { matchId: string }, { state: RootState; dispatch: AppDispatch }>(
    'snooker/handleMatchStart',
    async ({ matchId }, { dispatch }) => {
        await dispatch(setMatchId({
            matchId: matchId
        }));
        await dispatch(handleNewSet({}));
    }
)

export const handleNewSet = createAsyncThunk<void, {}, { state: RootState; dispatch: AppDispatch }>(
    'snooker/handleNewSet',
    async ({ }, { dispatch }) => {
        await dispatch(createSet());
        await dispatch(changeAheadNumber({ value: 0 }));
        await dispatch(changeOnNumber({ value: 0 }));
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

export const handleUndoScoreClicked = createAsyncThunk<void, {}, { state: RootState; dispatch: AppDispatch }>(
    'snooker/undoScore',
    async ({ }, { dispatch, getState }) => {
        let state = getState();
        let currentSet = getActiveSet(state.snooker.scoreHistory);
        const currentSetIndex = getActiveSetIndex(state.snooker.scoreHistory);
        const team = getActiveTeam(state.snooker.players.team1, state.snooker.players.team2);

        if (currentSet && currentSet.turns.length > 0) {
            let currentTurn = getActiveTurn(currentSet);
            const currentTurnIndex = getActiveTurnIndex(currentSet);

            if (currentTurn) {
                if (currentTurn.points.length === 0) {
                    await dispatch(removeTurn({ setIndex: currentSetIndex, turnIndex: currentTurnIndex }));
                    const state = getState();
                    currentSet = getActiveSet(state.snooker.scoreHistory);
                    console.log(currentSet?.turns);
                    currentTurn = getActiveTurn(currentSet);
                    if (currentTurn) {
                        const playerId = currentTurn.turnPlayerId;
                        await dispatch(setActivePlayer({ playerId }));
                    }
                } else {
                    const lastPoint = getLastPoint(currentTurn)!;

                    if (lastPoint.type === PointType.FOUL) {
                        const penalty = lastPoint.penalty;
                        await dispatch(decrementSetScore({ score: penalty, teamIndex: team.team1Active ? 1 : 0 }));
                    } else {
                        const score = lastPoint.score;
                        await dispatch(decrementTurnScore({ score }));
                        await dispatch(decrementSetScore({ score, teamIndex: team.team1Active ? 0 : 1 }));
                    }
                    await dispatch(undoLastPoint({ setIndex: getActiveSetIndex(state.snooker.scoreHistory), turnIndex: getActiveTurnIndex(currentSet) }))
                }
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
    }
)
