/**
 * SNOOKER SCORING STATE REACTIVE GETTERS & HELPER FUNCTIONS
 */

import { RootState } from '@/stores';
import { SnookerPointType, type Set, SnookerScoringState, Turn, Point, SnookerCorrection } from '../types';
import { createSelector } from '@reduxjs/toolkit';
import { getActivePoint, getActiveSet, getActiveTurn, getAllPointsAfter, getLastPointPlayedInSet } from './commonSport';
import { SnookerScoringButtonEnum } from '@/components/sections/scoring/snookerScoringButtons';

const RED_POINTS = 1;
const ALL_COLORED_POINTS = 2 + 3 + 4 + 5 + 6 + 7;

const formatToRedsCount = {
  SNOOKER_15_RED: 15,
  SNOOKER_10_RED: 10,
  SNOOKER_6_RED: 6,
};

export const colorPointsOrder = [
  SnookerPointType.YELLOW,
  SnookerPointType.GREEN,
  SnookerPointType.BROWN,
  SnookerPointType.BLUE,
  SnookerPointType.PINK,
  SnookerPointType.BLACK,
];

export const ballsToPointsEnum: Record<SnookerPointType, number> = {
  [SnookerPointType.RED]: 1,
  [SnookerPointType.YELLOW]: 2,
  [SnookerPointType.GREEN]: 3,
  [SnookerPointType.BROWN]: 4,
  [SnookerPointType.BLUE]: 5,
  [SnookerPointType.PINK]: 6,
  [SnookerPointType.BLACK]: 7,
  [SnookerPointType.FOUL]: 0,
  [SnookerPointType.MISSED_POT]: 0,
  [SnookerPointType.PLAY_SAFE]: 0,
};

const calculateTotalColoredPoints = (): number => ALL_COLORED_POINTS;

export const getNumberOfRedsFromFormat = (format: keyof typeof formatToRedsCount): number => {
  return formatToRedsCount[format];
};

const getLastRedPottedTurnAndPointIndex = (turns: Turn[]): { turnIndex: number; pointIndex: number } | null => {
  for (let i = turns.length - 1; i >= 0; i--) {
    for (let j = turns[i].points.length - 1; j >= 0; j--) {
      if (turns[i].points[j].snookerPoint.type === SnookerPointType.RED) {
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

export const getNextPlayerIndexAndId = (scoreOrder: string[], activePlayerId: string) => {
  const currentPlayerIndex = scoreOrder.findIndex((value) => value === activePlayerId);
  const nextPlayerIndex = currentPlayerIndex + 1 > scoreOrder.length - 1 ? 0 : currentPlayerIndex + 1;

  return {
    nextPlayerId: scoreOrder[nextPlayerIndex],
    nextPlayerIndex,
  };
};

export const getPottedColorBallsAfterAllReds = (turns: Turn[]): SnookerPointType[] => {
  return getAllPointsAfterAllRedsHaveLeftTheTable(turns)
    .filter(
      (point) =>
        point.snookerPoint &&
        'type' in point.snookerPoint &&
        point.snookerPoint.type !== SnookerPointType.RED &&
        point.snookerPoint.type !== SnookerPointType.FOUL &&
        point.snookerPoint.type !== SnookerPointType.MISSED_POT &&
        point.snookerPoint.type !== SnookerPointType.PLAY_SAFE,
    )
    .map((point) => ('type' in point.snookerPoint ? point.snookerPoint.type : undefined))
    .filter((type): type is SnookerPointType => type !== undefined);
};

export const calculateRedsLeft = (
  turns: Turn[],
  format: keyof typeof formatToRedsCount,
  corrections: SnookerCorrection[],
): number => {
  const totalReds = getNumberOfRedsFromFormat(format);

  const latestCorrection =
    corrections.length > 0
      ? corrections.reduce((latest, correction) =>
          new Date(correction.timeScored) > new Date(latest.timeScored) ? correction : latest,
        )
      : null;

  let redsLeft = latestCorrection ? latestCorrection.redsRemaining : totalReds;

  for (const turn of turns) {
    for (const point of turn.points) {
      if (!latestCorrection || new Date(point.timeScored) > new Date(latestCorrection.timeScored)) {
        if (point.snookerPoint.type === SnookerPointType.RED) {
          redsLeft--;
        } else if (point.snookerPoint.type === SnookerPointType.FOUL && point.snookerPoint.redsLost > 0) {
          redsLeft -= point.snookerPoint.redsLost;
        }
      }
    }
  }

  return Math.max(redsLeft, 0);
};

export const adjustColorBallsPottedWithFreeBall = (activeSet: Set): SnookerPointType[] => {
  const pottedColorsAfterAllReds = getPottedColorBallsAfterAllReds(activeSet ? activeSet.turns : []);
  const pointsAfterAllRedsArePotted = getAllPointsAfterAllRedsHaveLeftTheTable(activeSet ? activeSet!.turns : []);

  const orderedColors = colorPointsOrder.slice();
  const pottedColors = pottedColorsAfterAllReds.slice(1);
  const pottedPoints = pointsAfterAllRedsArePotted.slice(1);

  const freeBallIndexes = pottedPoints
    .map((point, index) => ('freeBall' in point.snookerPoint && point.snookerPoint.freeBall ? index : -1))
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

  const redsLeft = calculateRedsLeft(
    activeSet.turns,
    format,
    activeSet.snookerCorrections ? activeSet.snookerCorrections : [],
  );

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
  return point && 'freeBall' in point.snookerPoint ? point.snookerPoint.freeBall : false;
};

export const checkIfLastBallIsFreeBall = (sets: Set[]) => checkIfFreeBallPlayed(sets, getLastPointPlayedInSet);

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
    return activeTurn ? activeTurn.points.map((point) => point.snookerPoint.type) : [];
  },
);

export const calculateTeamPOSN = createSelector(
  (state: { snooker: SnookerScoringState }) => state.snooker,
  (snookerState) => {
    const activeSet = getActiveSet(snookerState.scoreHistory);
    const pointTypes = [
      SnookerPointType.RED,
      SnookerPointType.YELLOW,
      SnookerPointType.GREEN,
      SnookerPointType.BROWN,
      SnookerPointType.BLUE,
      SnookerPointType.PINK,
      SnookerPointType.BLACK,
    ];

    let [team1Potted, team2Potted] = [0, 0];
    let [team1Played, team2Played] = [0, 0];

    activeSet?.turns.forEach((turn) => {
      const potted = turn.points.filter((point) => pointTypes.includes(point.snookerPoint.type)).length;
      const totalPlayed = turn.points.length;
      if (snookerState.team1.players.some((player) => player.id === turn.turnPlayerId)) {
        team1Potted += potted;
        team1Played += totalPlayed;
      } else if (snookerState.team2.players.some((player) => player.id === turn.turnPlayerId)) {
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
    return activeTurn ? activeTurn.points.reduce((total, point) => total + point.snookerPoint.score, 0) : 0;
  },
);

export const selectHighestTurnScores = createSelector(
  (state: { snooker: SnookerScoringState }) => state.snooker,
  (snookerState) => {
    const activeSet = getActiveSet(snookerState.scoreHistory);
    const getTeamTurnScores = (team: 'team1' | 'team2') => {
      return (
        activeSet?.turns
          .filter((turn) => snookerState[team].players.some((player) => player.id === turn.turnPlayerId))
          .map((turn) => turn.points.reduce((total, point) => total + point.snookerPoint.score, 0))
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
    const lastPoint = getActivePoint(activeTurn);
    const turns = activeSet ? activeSet.turns : [];
    const redsLeft = calculateRedsLeft(
      turns,
      snookerState.format,
      activeSet && activeSet.snookerCorrections ? activeSet.snookerCorrections : [],
    );
    const pottedColorsAfterAllReds = getPottedColorBallsAfterAllReds(turns);
    const isLastBallFreeBall = checkIfLastBallIsFreeBall(snookerState.scoreHistory);
    const pointsOnTable = getNumberOnTableOfTheCurrentFrame(activeSet ? activeSet : null, snookerState.format);

    const shouldDisableColorButton = (colorIndex: number, colorName: SnookerPointType) => {
      const pottedColors = adjustColorBallsPottedWithFreeBall(activeSet!);

      if (isLastBallFreeBall && redsLeft === 0) {
        return pottedColors.includes(colorName);
      }

      return (
        !activeTurn ||
        (lastPoint &&
          'type' in lastPoint.snookerPoint &&
          lastPoint?.snookerPoint.type !== SnookerPointType.RED &&
          redsLeft > 0 &&
          !isLastBallFreeBall) ||
        (redsLeft === 0 && pottedColors.length !== colorIndex && pottedColorsAfterAllReds.length !== 0) ||
        (lastPoint === null && redsLeft > 0)
      );
    };

    return {
      [SnookerScoringButtonEnum.RED]: !activeTurn || redsLeft === 0,
      [SnookerScoringButtonEnum.YELLOW]: shouldDisableColorButton(0, SnookerPointType.YELLOW),
      [SnookerScoringButtonEnum.GREEN]: shouldDisableColorButton(1, SnookerPointType.GREEN),
      [SnookerScoringButtonEnum.BROWN]: shouldDisableColorButton(2, SnookerPointType.BROWN),
      [SnookerScoringButtonEnum.BLUE]: shouldDisableColorButton(3, SnookerPointType.BLUE),
      [SnookerScoringButtonEnum.PINK]: shouldDisableColorButton(4, SnookerPointType.PINK),
      [SnookerScoringButtonEnum.BLACK]: shouldDisableColorButton(5, SnookerPointType.BLACK),
      [SnookerScoringButtonEnum.FOUL]: !activeTurn || pointsOnTable === 0,
      [SnookerScoringButtonEnum.BREAK_OFF]: activeSet !== undefined,
      [SnookerScoringButtonEnum.PLAY_SAFE]: !activeTurn && activeSet === undefined,
      [SnookerScoringButtonEnum.MISSED_POT]: !activeTurn && activeSet === undefined,
      [SnookerScoringButtonEnum.LONG_SHOT]: !activeTurn && activeSet === undefined,
    };
  },
);

export const getNumberOfRedsLeft = createSelector(
  (state: { snooker: SnookerScoringState }) => state.snooker,
  (snookerState) => {
    const activeSet = getActiveSet(snookerState.scoreHistory);
    return calculateRedsLeft(
      activeSet ? activeSet.turns : [],
      snookerState.format,
      activeSet && activeSet.snookerCorrections ? activeSet.snookerCorrections : [],
    );
  },
);
