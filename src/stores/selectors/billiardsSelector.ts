import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/stores';
import { getActiveSet, getActiveTurn } from './commonSport';
import { BilliardPointType, GeneralScoringState } from '../types';

export const ballsToPointsEnumBilliards: Record<BilliardPointType, number> = {
  [BilliardPointType.FOUL]: 2,
  [BilliardPointType.CANNON]: 2,
  [BilliardPointType.RED_IN_OFF]: 3,
  [BilliardPointType.RED_POT]: 3,
  [BilliardPointType.WHITE_IN_OFF]: 2,
  [BilliardPointType.WHITE_POT]: 2,
};

export const getActiveTurnPointTypes = createSelector(
  (state: RootState) => state.sport,
  (scoringState) => {
    const activeSet = getActiveSet(scoringState.scoreHistory);
    const activeTurn = activeSet ? getActiveTurn(activeSet) : null;
    return activeTurn ? activeTurn.points.map((point) => point.billiardsPoint!.type) : [];
  },
);


export const getActiveTurnScore = createSelector(
  (state: RootState) => state.sport,
  (sportState: GeneralScoringState) => {
    const activeSet = getActiveSet(sportState.scoreHistory);
    const activeTurn = activeSet ? getActiveTurn(activeSet) : null;
    return activeTurn ? activeTurn.points.reduce((total, point) => total + point.billiardsPoint!.score, 0) : 0;
  },
);

export const getTeamSetScores = createSelector(
  (state: RootState) => state.sport,
  (billiardsState: GeneralScoringState) => {
    const activeSet = getActiveSet(billiardsState.scoreHistory);
    return {
      team1score: activeSet ? activeSet.teamOneScore : 0,
      team2score: activeSet ? activeSet.teamTwoScore : 0,
    };
  },
);