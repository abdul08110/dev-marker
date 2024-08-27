/**
 * SNOOKER SCORING STATE REACTIVE GETTERS & HELPER FUNCTIONS
 */

import { RootState } from '@/stores';
import { PointType, type Set, SnookerScoringState, TeamDetails, Turn, Point } from '../types';
import { createSelector } from '@reduxjs/toolkit';

export const getActiveSet = (sets: Set[]): Set | null => {
    return sets.length > 0 ? sets[sets.length - 1] : null;
};

export const getActiveSetIndex = (sets: Set[]): number => {
    return sets.length > 0 ? sets.length - 1 : -1;
};

export const getActiveTurn = (set: Set | null): Turn | null => {
    return set && set.turns.length > 0 ? set.turns[set.turns.length - 1] : null;
};

export const getLastTurn = (set: Set): Turn | null => {
    return set.turns.length > 1 ? set.turns[set.turns.length - 2] : null;
}

export const getActiveTurnIndex = (set: Set): number => {
    return set.turns.length > 0 ? set.turns.length - 1 : -1;
};

export const getLastPoint = (turn: Turn): Point | null => {
    return turn.points.length > 0 ? turn.points[turn.points.length - 1]: null;
}

export const getActiveTeam = (team1: TeamDetails, team2: TeamDetails) => {
    return ({
        team1Active: team1.players.some(player => player.isActive === true),
        team2Active: team2.players.some(player => player.isActive === true)
    });
}

export const calculateRedsLeft = (turns: Turn[]): number => {
    let redCount = 15;
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

export const selectNumberAheadAndNumberOn = createSelector(
    (state: RootState) => state.snooker,
    (snookerState: SnookerScoringState) => {
        const activeSet = getActiveSet(snookerState.scoreHistory);
        if (!activeSet) {
            return { numberAhead: 0, numberOn: 0 };
        }

        const activeTurn = getActiveTurn(activeSet);
        if (!activeTurn) {
            return { numberAhead: 0, numberOn: 0 };
        }

        const activePlayerTeam = snookerState.players.team1.players.some(player => player.id === activeTurn.turnPlayerId)
            ? 'team1'
            : 'team2';

        const activePlayerScore = activePlayerTeam === 'team1' ? activeSet.teamOneScore : activeSet.teamTwoScore;
        const opponentScore = activePlayerTeam === 'team1' ? activeSet.teamTwoScore : activeSet.teamOneScore;

        const numberAhead = activePlayerScore - opponentScore;
        const redsLeft = calculateRedsLeft(activeSet.turns);

        let numberOn = 0;

        if (redsLeft > 0) {
            const pointsFromReds = (redsLeft * 7) + redsLeft;
            const pointsFromColoredBalls = calculateTotalColoredPoints();
            numberOn = pointsFromReds + pointsFromColoredBalls;
        } else {
            let totalColoredPoints = calculateTotalColoredPoints();
            const lastRedPottedInfo = getLastRedPottedTurnAndPointIndex(activeSet.turns);

            const pottedColoredBalls = new Set<PointType>();

            if (lastRedPottedInfo) {
                for (let i = lastRedPottedInfo.pointIndex + 1; i < activeSet.turns[lastRedPottedInfo.turnIndex].points.length; i++) {
                    const point = activeSet.turns[lastRedPottedInfo.turnIndex].points[i];
                    if (point.type !== PointType.RED) {
                        pottedColoredBalls.add(point.type);
                    }

                }

                for (let i = lastRedPottedInfo.turnIndex + 1; i < activeSet.turns.length; i++) {
                    const turn = activeSet.turns[i];
                    turn.points.forEach(point => {
                        if (point.type !== PointType.RED) {
                            pottedColoredBalls.add(point.type);
                        }
                    });
                }

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



            numberOn = totalColoredPoints;
        }

        return {
            numberAhead: numberAhead,
            numberOn: numberOn
        };
    }
);