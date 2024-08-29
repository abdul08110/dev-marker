/**
 * SNOOKER SCORING STATE REACTIVE GETTERS & HELPER FUNCTIONS
 */

import { RootState } from '@/stores';
import { PointType, type Set, SnookerScoringState, Turn } from '../types';
import { createSelector } from '@reduxjs/toolkit';
import { getActiveSet, getActiveTurn, getLastPoint, getLastTurn } from './commonSport';


export const getNumberOfRedsFromFormat = (format: 'SNOOKER_15_RED' | 'SNOOKER_10_RED' | 'SNOOKER_6_RED'): number => {
    switch (format) {
        case 'SNOOKER_10_RED':
            return 10;
            break;
        case 'SNOOKER_6_RED':
            return 6;
            break;
        case 'SNOOKER_15_RED':
            return 15;
            break;
    }
}

export const getNumberOnTableOfTheCurrentFrame = async (activeSet: Set, format: 'SNOOKER_15_RED' | 'SNOOKER_10_RED' | 'SNOOKER_6_RED') => {
    const redsLeft = calculateRedsLeft(activeSet.turns, format);
    let numberOn = 0;

    if (redsLeft > 0) {
        const pointsFromReds = (redsLeft * 7) + redsLeft;
        const pointsFromColoredBalls = calculateTotalColoredPoints();

        numberOn = pointsFromReds + pointsFromColoredBalls;
    } else {
        let totalColoredPoints = calculateTotalColoredPoints();
        const lastRedPottedInfo = getLastRedPottedTurnAndPointIndex(activeSet.turns);

        let pottedColoredBalls: PointType[] = [];

        if (lastRedPottedInfo) {
            for (let i = lastRedPottedInfo.pointIndex + 1; i < activeSet.turns[lastRedPottedInfo.turnIndex].points.length; i++) {
                const point = activeSet.turns[lastRedPottedInfo.turnIndex].points[i];
                if (point.type !== PointType.RED) {
                    pottedColoredBalls.push(point.type);
                }
            }

            for (let i = lastRedPottedInfo.turnIndex + 1; i < activeSet.turns.length; i++) {
                const turn = activeSet.turns[i];
                turn.points.forEach(point => {
                    if (point.type !== PointType.RED) {
                        pottedColoredBalls.push(point.type);
                    }
                });
            }

            if (pottedColoredBalls.length === 0) {
                numberOn = 7 + totalColoredPoints;
            } else if (pottedColoredBalls.length === 1) {
                numberOn = totalColoredPoints;
            } else if (pottedColoredBalls.length > 1) {
                pottedColoredBalls = pottedColoredBalls.slice(1);
                pottedColoredBalls.forEach(pottedColor => {
                    switch (pottedColor) {
                        case PointType.YELLOW:
                            totalColoredPoints -= 2;
                            break;
                        case PointType.GREEN:
                            totalColoredPoints -= 3;
                            break;
                        case PointType.BROWN:
                            totalColoredPoints -= 4;
                            break;
                        case PointType.BLUE:
                            totalColoredPoints -= 5;
                            break;
                        case PointType.PINK:
                            totalColoredPoints -= 6;
                            break;
                        case PointType.BLACK:
                            totalColoredPoints -= 7;
                            break;
                    }
                });
            }
        }
        numberOn = totalColoredPoints;
    }

    return numberOn;
}

export const getNumberAhead = async (activeSet: Set, activeTurn: Turn, activeTeam: 'team1' | 'team2') => {
    const activePlayerScore = activeTeam === 'team1' ? activeSet.teamOneScore : activeSet.teamTwoScore;
    const opponentScore = activeTeam === 'team1' ? activeSet.teamTwoScore : activeSet.teamOneScore;

    const numberAhead = activePlayerScore - opponentScore;
    return numberAhead;
}


export const calculateRedsLeft = (turns: Turn[], format: 'SNOOKER_15_RED' | 'SNOOKER_10_RED' | 'SNOOKER_6_RED'): number => {
    let redCount = getNumberOfRedsFromFormat(format);
    turns.forEach(turn => {
        turn.points.forEach(point => {
            if (point.type === PointType.RED) {
                redCount--;
            }

            if (point.type === PointType.FOUL && point.ballsLost > 0) {
                redCount -= point.ballsLost;
            }
        });
    });
    return redCount;
};

export const calculateTotalColoredPoints = (): number => {
    return 2 + 3 + 4 + 5 + 6 + 7;
};

export const getLastRedPottedTurnAndPointIndex = (turns: Turn[]): { turnIndex: number, pointIndex: number } | null => {
    for (let i = turns.length - 1; i >= 0; i--) {
        const turn = turns[i];
        for (let j = turn.points.length - 1; j >= 0; j--) {
            if (turn.points[j].type === PointType.RED) {
                return { turnIndex: i, pointIndex: j };
            }
        }
    }
    return null;
};

export const checkIfLastBallIsFreeBall = (sets: Set[]): boolean => {
    const activeSet = getActiveSet(sets);
    if (activeSet) {
        const lastTurn = getLastTurn(activeSet);

        if (lastTurn && lastTurn.points.length > 0) {
            const point = getLastPoint(lastTurn);
            if (point && point.freeBall) {
                return true
            }
        }
    }

    return false;
}

export const getTeamSetScores = createSelector(
    (state: RootState) => state.snooker,
    (snookerState: SnookerScoringState) => {

        const activeSet = getActiveSet(snookerState.scoreHistory);
        return ({
            team1score: activeSet ? activeSet.teamOneScore : 0,
            team2score: activeSet ? activeSet.teamTwoScore : 0,
        })
    }
)

export const getActiveTurnPointTypes = createSelector(
    (state: RootState) => state.snooker,
    (snookerState: SnookerScoringState) => {
        const activeSet = getActiveSet(snookerState.scoreHistory);
        if (activeSet) {
            const activeTurn = getActiveTurn(activeSet);
            if (activeTurn) {
                return activeTurn.points.map(value => value.type);
            } else {
                return ([])
            }
        } else {
            return ([])
        }
    }
)

export const calculateTeamPOSN = createSelector(
    (state: { snooker: SnookerScoringState }) => state.snooker,
    (snookerState) => {
        const pointTypesToBeConsidered = [
            PointType.RED,
            PointType.YELLOW,
            PointType.GREEN,
            PointType.BROWN,
            PointType.BLUE,
            PointType.PINK,
            PointType.BLACK
        ];

        const { scoreHistory } = snookerState;

        let team1PottedBalls = 0;
        let team2PottedBalls = 0;
        let team1TotalBallsPlayed = 0;
        let team2TotalBallsPlayed = 0;

        const activeSet = getActiveSet(scoreHistory);

        if (activeSet) {
            activeSet.turns.forEach((turn) => {
                const pottedBalls = turn.points.filter(point => pointTypesToBeConsidered.includes(point.type)).length;
                const totalBallsPlayed = turn.points.length;

                if (snookerState.players.team1.players.some(player => player.id === turn.turnPlayerId)) {
                    team1PottedBalls += pottedBalls;
                    team1TotalBallsPlayed += totalBallsPlayed;
                } else if (snookerState.players.team2.players.some(player => player.id === turn.turnPlayerId)) {
                    team2PottedBalls += pottedBalls;
                    team2TotalBallsPlayed += totalBallsPlayed;
                }
            });
        }

        const team1POSN = team1TotalBallsPlayed > 0 ? (team1PottedBalls / team1TotalBallsPlayed) * 100 : 0;
        const team2POSN = team2TotalBallsPlayed > 0 ? (team2PottedBalls / team2TotalBallsPlayed) * 100 : 0;

        return {
            team1POSN,
            team2POSN,
            team1PottedBalls,
            team1TotalBallsPlayed,
            team2PottedBalls,
            team2TotalBallsPlayed
        };
    }
);


export const getActiveTurnScore = createSelector(
    (state: RootState) => state.snooker,
    (snookerState: SnookerScoringState) => {
        const activeSet = getActiveSet(snookerState.scoreHistory);
        if (activeSet) {
            const activeTurn = getActiveTurn(activeSet);
            if (activeTurn) {
                return activeTurn.points.reduce((totalScore, point) => totalScore + point.score, 0);
            } else {
                return 0
            }
        } else {
            return 0
        }
    }
)

export const selectHighestTurnScores = createSelector(
    (state: { snooker: SnookerScoringState }) => state.snooker,
    (snookerState) => {
        const { scoreHistory } = snookerState;

        const activeSet = getActiveSet(scoreHistory);

        let team1TurnScores: number[] = [];
        let team2TurnScores: number[] = [];

        if (activeSet) {
            activeSet.turns.forEach((turn) => {
                const turnScore = turn.points.reduce((acc, point) => acc + point.score, 0);

                if (snookerState.players.team1.players.some(player => player.id === turn.turnPlayerId)) {
                    team1TurnScores.push(turnScore);
                } else if (snookerState.players.team2.players.some(player => player.id === turn.turnPlayerId)) {
                    team2TurnScores.push(turnScore);
                }
            });
        }

        team1TurnScores.sort((a, b) => b - a);
        team2TurnScores.sort((a, b) => b - a);

        return {
            team1HighestTurnScores: team1TurnScores,
            team2HighestTurnScores: team2TurnScores
        };
    }
);
