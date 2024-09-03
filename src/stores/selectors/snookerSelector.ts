/**
 * SNOOKER SCORING STATE REACTIVE GETTERS & HELPER FUNCTIONS
 */

import { RootState } from '@/stores';
import { PointType, type Set, SnookerScoringState, Turn, Point } from '../types';
import { createSelector } from '@reduxjs/toolkit';
import {
  getActiveSet,
  getActiveTurn,
  getAllPointsAfter,
  getLastPoint,
  getLastPointPlayedInTheSet,
  getSecondLastPointPlayedInTheSet,
} from './commonSport';
import { SnookerScoringButtonEnum } from '@/components/sections/scoring/snookerScoringButtons';

const RED_POINTS = 1;
const ALL_COLORED_POINTS = 2 + 3 + 4 + 5 + 6 + 7;

const formatToRedsCount = {
  SNOOKER_15_RED: 15,
  SNOOKER_10_RED: 10,
  SNOOKER_6_RED: 6,
};

export const colorPointsOrder = [
  PointType.YELLOW,
  PointType.GREEN,
  PointType.BROWN,
  PointType.BLUE,
  PointType.PINK,
  PointType.BLACK,
];

export const ballsToPointsEnum: Record<PointType, number> = {
  [PointType.RED]: 1,
  [PointType.YELLOW]: 2,
  [PointType.GREEN]: 3,
  [PointType.BROWN]: 4,
  [PointType.BLUE]: 5,
  [PointType.PINK]: 6,
  [PointType.BLACK]: 7,
  [PointType.FOUL]: 0,
};

const calculateTotalColoredPoints = (): number => ALL_COLORED_POINTS;

const getNumberOfRedsFromFormat = (format: keyof typeof formatToRedsCount): number => {
  return formatToRedsCount[format];
};

const getLastRedPottedTurnAndPointIndex = (turns: Turn[]): { turnIndex: number; pointIndex: number } | null => {
  for (let i = turns.length - 1; i >= 0; i--) {
    for (let j = turns[i].points.length - 1; j >= 0; j--) {
      if (turns[i].points[j].type === PointType.RED) {
        return { turnIndex: i, pointIndex: j };
      }
    }
  }
  return null;
};

export const getAllPointsAfterAllRedsHaveLeftTheTable = (turns: Turn[]) => {
  const lastRedInfo = getLastRedPottedTurnAndPointIndex(turns);
  return lastRedInfo ? getAllPointsAfter(turns, lastRedInfo.turnIndex, lastRedInfo.pointIndex) : [];
};

export const getPottedColorBallsAfterAllReds = (turns: Turn[]) => {
  return getAllPointsAfterAllRedsHaveLeftTheTable(turns)
    .filter((point) => point.type !== PointType.RED && point.type !== PointType.FOUL)
    .map((point) => point.type);
};

export const calculateRedsLeft = (turns: Turn[], format: keyof typeof formatToRedsCount): number => {
  const totalReds = getNumberOfRedsFromFormat(format);
  return turns.reduce((redsLeft, turn) => {
    return turn.points.reduce((count, point) => {
      if (point.type === PointType.RED) count--;
      if (point.type === PointType.FOUL && point.ballsLost > 0) count -= point.ballsLost;
      return count;
    }, redsLeft);
  }, totalReds);
};

export const adjustColorBallsPottedWithFreeBall = (activeSet: Set): PointType[] => {
  const pottedColorsAfterAllReds = getPottedColorBallsAfterAllReds(activeSet ? activeSet.turns : []);
  const pointsAfterAllRedsArePotted = getAllPointsAfterAllRedsHaveLeftTheTable(activeSet ? activeSet!.turns : []);

  const orderedColors = colorPointsOrder.slice();
  const pottedColors = pottedColorsAfterAllReds.slice(1);
  const pottedPoints = pointsAfterAllRedsArePotted.slice(1);

  const freeBallIndexes = pottedPoints
    .map((point, index) => (point.freeBall ? index : -1))
    .filter((index) => index !== -1);

  freeBallIndexes.forEach((freeBallIndex) => {
    const subsequentPoint = pottedColorsAfterAllReds[freeBallIndex + 1];
    if (subsequentPoint) {
      const expectedIndex = orderedColors.findIndex((color) => color === subsequentPoint);
      if (pottedColors[expectedIndex] !== subsequentPoint) {
        const lastOccurrenceIndex = pottedColors.lastIndexOf(subsequentPoint);
        if (lastOccurrenceIndex !== -1) {
          pottedColors.splice(lastOccurrenceIndex, 1);
        }
      }
    }
  });

  return pottedColors;
};

export const getNumberOnTableOfTheCurrentFrame = (activeSet: Set | null, format: keyof typeof formatToRedsCount) => {
  if (!activeSet) return 0;

  const redsLeft = calculateRedsLeft(activeSet.turns, format);
  if (redsLeft > 0) {
    return redsLeft * (7 + RED_POINTS) + calculateTotalColoredPoints();
  }

  const pottedColors = adjustColorBallsPottedWithFreeBall(activeSet);
  const lastRedInfo = getLastRedPottedTurnAndPointIndex(activeSet.turns);

  const remainingColoredPoints =
    calculateTotalColoredPoints() -
    pottedColors.reduce((acc, color) => {
      return acc + ballsToPointsEnum[color];
    }, 0);

  return lastRedInfo && pottedColors.length === 0 ? 7 + remainingColoredPoints : remainingColoredPoints;
};

export const getNumberAhead = (activeSet: Set, activeTeam: 'team1' | 'team2') => {
  const activeScore = activeTeam === 'team1' ? activeSet.teamOneScore : activeSet.teamTwoScore;
  const opponentScore = activeTeam === 'team1' ? activeSet.teamTwoScore : activeSet.teamOneScore;
  return activeScore - opponentScore;
};

export const checkIfFreeBallPlayed = (sets: Set[], pointCheckFn: (set: Set) => Point | null) => {
  const activeSet = getActiveSet(sets);
  const point = pointCheckFn(activeSet!);
  return point ? point.freeBall : false;
};

export const checkIfLastBallIsFreeBall = (sets: Set[]) => checkIfFreeBallPlayed(sets, getLastPointPlayedInTheSet);

export const checkIfSecondLastBallIsFreeBall = (sets: Set[]) =>
  checkIfFreeBallPlayed(sets, getSecondLastPointPlayedInTheSet);

export const getTeamSetScores = createSelector(
  (state: RootState) => state.snooker,
  (snookerState: SnookerScoringState) => {
    const activeSet = getActiveSet(snookerState.scoreHistory);
    return {
      team1score: activeSet ? activeSet.teamOneScore : 0,
      team2score: activeSet ? activeSet.teamTwoScore : 0,
    };
  },
);

export const getActiveTurnPointTypes = createSelector(
  (state: RootState) => state.snooker,
  (snookerState: SnookerScoringState) => {
    const activeSet = getActiveSet(snookerState.scoreHistory);
    const activeTurn = activeSet ? getActiveTurn(activeSet) : null;
    return activeTurn ? activeTurn.points.map((point) => point.type) : [];
  },
);

export const calculateTeamPOSN = createSelector(
  (state: { snooker: SnookerScoringState }) => state.snooker,
  (snookerState) => {
    const activeSet = getActiveSet(snookerState.scoreHistory);
    const pointTypes = [
      PointType.RED,
      PointType.YELLOW,
      PointType.GREEN,
      PointType.BROWN,
      PointType.BLUE,
      PointType.PINK,
      PointType.BLACK,
    ];

    let [team1Potted, team2Potted] = [0, 0];
    let [team1Played, team2Played] = [0, 0];

    activeSet?.turns.forEach((turn) => {
      const potted = turn.points.filter((point) => pointTypes.includes(point.type)).length;
      const totalPlayed = turn.points.length;
      if (snookerState.players.team1.players.some((player) => player.id === turn.turnPlayerId)) {
        team1Potted += potted;
        team1Played += totalPlayed;
      } else if (snookerState.players.team2.players.some((player) => player.id === turn.turnPlayerId)) {
        team2Potted += potted;
        team2Played += totalPlayed;
      }
    });

    const calculatePOSN = (potted: number, played: number) => (played > 0 ? Math.round((potted / played) * 100) : 0);

    return {
      team1POSN: calculatePOSN(team1Potted, team1Played),
      team2POSN: calculatePOSN(team2Potted, team2Played),
      team1PottedBalls: team1Potted,
      team1TotalBallsPlayed: team1Played,
      team2PottedBalls: team2Potted,
      team2TotalBallsPlayed: team2Played,
    };
  },
);

export const getActiveTurnScore = createSelector(
  (state: RootState) => state.snooker,
  (snookerState: SnookerScoringState) => {
    const activeSet = getActiveSet(snookerState.scoreHistory);
    const activeTurn = activeSet ? getActiveTurn(activeSet) : null;
    return activeTurn ? activeTurn.points.reduce((total, point) => total + point.score, 0) : 0;
  },
);

export const selectHighestTurnScores = createSelector(
  (state: { snooker: SnookerScoringState }) => state.snooker,
  (snookerState) => {
    const activeSet = getActiveSet(snookerState.scoreHistory);
    const getTeamTurnScores = (team: 'team1' | 'team2') => {
      return (
        activeSet?.turns
          .filter((turn) => snookerState.players[team].players.some((player) => player.id === turn.turnPlayerId))
          .map((turn) => turn.points.reduce((total, point) => total + point.score, 0))
          .sort((a, b) => b - a) || []
      );
    };

    return {
      team1HighestTurnScores: getTeamTurnScores('team1'),
      team2HighestTurnScores: getTeamTurnScores('team2'),
    };
  },
);

export const snookerButtonsDisabledState = createSelector(
  (state: { snooker: SnookerScoringState }) => state.snooker,
  (snookerState) => {
    const activeSet = getActiveSet(snookerState.scoreHistory);
    const activeTurn = activeSet ? getActiveTurn(activeSet) : null;
    const lastPoint = getLastPoint(activeTurn);
    const turns = activeSet ? activeSet.turns : [];
    const redsLeft = calculateRedsLeft(turns, snookerState.format);
    const pottedColorsAfterAllReds = getPottedColorBallsAfterAllReds(turns);
    const isLastBallFreeBall = checkIfLastBallIsFreeBall(snookerState.scoreHistory);
    const pointsOnTable = getNumberOnTableOfTheCurrentFrame(activeSet, snookerState.format);
    const isMatchOngoing = snookerState.scoreHistory.length > 0;
    const isFrameCompleted = activeSet?.status === 'COMPLETED';
    const allFramesPlayed = snookerState.numberOfFrames === snookerState.scoreHistory.length;

    const shouldDisableColorButton = (colorIndex: number, colorName: PointType) => {
      const pottedColors = adjustColorBallsPottedWithFreeBall(activeSet!);

      if (isLastBallFreeBall && redsLeft === 0) {
        return pottedColors.includes(colorName);
      }

      return (
        !activeTurn ||
        (lastPoint?.type !== PointType.RED && redsLeft > 0 && !isLastBallFreeBall) ||
        (redsLeft === 0 && pottedColors.length !== colorIndex && pottedColorsAfterAllReds.length !== 0)
      );
    };

    return {
      [SnookerScoringButtonEnum.START_FRAME]: (isMatchOngoing && !isFrameCompleted) || allFramesPlayed,
      [SnookerScoringButtonEnum.UNDO_SCORE]: !isMatchOngoing,
      [SnookerScoringButtonEnum.END_FRAME]: !isMatchOngoing || isFrameCompleted,
      [SnookerScoringButtonEnum.RED]: !activeTurn || redsLeft === 0,
      [SnookerScoringButtonEnum.YELLOW]: shouldDisableColorButton(0, PointType.YELLOW),
      [SnookerScoringButtonEnum.GREEN]: shouldDisableColorButton(1, PointType.GREEN),
      [SnookerScoringButtonEnum.BROWN]: shouldDisableColorButton(2, PointType.BROWN),
      [SnookerScoringButtonEnum.BLUE]: shouldDisableColorButton(3, PointType.BLUE),
      [SnookerScoringButtonEnum.PINK]: shouldDisableColorButton(4, PointType.PINK),
      [SnookerScoringButtonEnum.BLACK]: shouldDisableColorButton(5, PointType.BLACK),
      [SnookerScoringButtonEnum.END_GAME]: !isMatchOngoing,
      [SnookerScoringButtonEnum.FOUL]: !activeTurn || pointsOnTable === 0,
    };
  },
);

export const getNumberOfRedsLeft = createSelector(
  (state: { snooker: SnookerScoringState }) => state.snooker,
  (snookerState) => {
    const activeSet = getActiveSet(snookerState.scoreHistory);
    return calculateRedsLeft(activeSet ? activeSet.turns : [], snookerState.format);
  },
);
