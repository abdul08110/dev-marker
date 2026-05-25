import { type Set, TeamDetails, Turn, Point, Player } from '../types';

const getLastElement = <T>(array: T[]): T | null => (array.length > 0 ? array[array.length - 1] : null);

const getSecondLastElement = <T>(array: T[]): T | null => (array.length > 1 ? array[array.length - 2] : null);

// SETS

export const getActiveSet = (sets: Set[]): Set | undefined => sets.find((value) => value.status === 'ONGOING');

export const getActiveSetIndex = (sets: Set[]): number => sets.findIndex((value) => value.status === 'ONGOING');

export const getLastSet = (sets: Set[]): Set | null => getSecondLastElement(sets);

export const getLastSetIndex = (sets: Set[]): number => (sets.length > 0 ? sets.length - 2 : -1);

// TURNS

export const getActiveTurn = (set: Set | null | undefined): Turn | null => (set ? getLastElement(set.turns) : null);

export const getLastTurn = (set: Set): Turn | null => getSecondLastElement(set.turns);

export const getActiveTurnIndex = (set: Set | null): number =>
  set && set.turns.length > 0 ? set.turns.length - 1 : -1;

export const getTeamTurnsForSet = (
  set: Set | null,
  teamPlayerOneId: string | null,
  teamPlayerTwoId: string | null,
): Turn[] | undefined => {
  if (!set || !teamPlayerOneId) return undefined;
  else {
    return set.turns.filter(
      (value) =>
        value.turnPlayerId === teamPlayerOneId || (teamPlayerTwoId !== null && value.turnPlayerId === teamPlayerTwoId),
    );
  }
};

// POINTS

export const getActivePoint = (turn: Turn | null): Point | null => (turn ? getLastElement(turn.points) : null);

export const getSecondLastPoint = (turn: Turn | null): Point | null => getSecondLastElement(turn?.points ?? []);

export const getAllPointsAfter = (turns: Turn[], startTurnIndex: number, startPointIndex: number): Point[] => {
  let points: Point[] = [];
  for (let i = startTurnIndex; i < turns.length; i++) {
    const start = i === startTurnIndex ? startPointIndex + 1 : 0;
    points = points.concat(turns[i].points.slice(start));
  }
  return points;
};

export const getLastPointPlayedInSet = (set: Set): Point | null => {
  const activeTurn = getActiveTurn(set);
  if (!activeTurn) return null;
  const activePoint = getActivePoint(activeTurn);
  if (activePoint) return activePoint;

  const lastTurn = getLastTurn(set);
  const lastPoint = getActivePoint(lastTurn);

  if (lastTurn && lastPoint) return lastPoint;
  else return null;
};

// TEAM

export const getTeamIndexFromPlayerId = (id: string, team1: TeamDetails, team2: TeamDetails) => {
  const teamData = {
    team1Player: team1.players.some((player) => player.id === id),
    team2Player: team2.players.some((player) => player.id === id),
  };

  if (teamData.team1Player) return 0;
  else return 1;
};

export const getActiveTeam = (team1: TeamDetails, team2: TeamDetails) => {
  const teamData = {
    team1Active: team1.players.some((player) => player.isActive),
    team2Active: team2.players.some((player) => player.isActive),
  };

  if (teamData.team1Active) return 0;
  if (teamData.team2Active) return 1;
  else return null;
};

// PLAYER

export const getActivePlayer = (team1: TeamDetails, team2: TeamDetails) => {
  return team1.players.find((player) => player.isActive) || team2.players.find((player) => player.isActive) || null;
};

export const getAllPlayerIdsSelectedApartFromThisParticularPlayerAndTeamIndex = (
  team1: TeamDetails,
  team2: TeamDetails,
  teamIndex: number,
  playerIndex: number,
) => {
  const opponentTeamPlayers = teamIndex === 0 ? team2.players : team1.players;
  const currentTeamPlayers = teamIndex === 0 ? team1.players : team2.players;

  const currentTeamPlayerIds = currentTeamPlayers.map((player) => player.id);
  const opponentTeamPlayerIds = opponentTeamPlayers.map((player) => player.id);

  currentTeamPlayerIds.splice(playerIndex, 1);

  return [...opponentTeamPlayerIds, ...currentTeamPlayerIds];
};

export const getTeamKey = (teamIndex: number): 'team1' | 'team2' => {
  return teamIndex === 0 ? 'team1' : 'team2';
};

export const calculateTotalTeamScore = (sets: Set[]) => {
  const totalScores = {
    side1: 0,
    side2: 0,
  };

  sets.forEach((value) => {
    if (value.status === 'COMPLETED') {
      value.teamOneScore > value.teamTwoScore || (value.setConcededTo !== null && value.setConcededTo === 0)
        ? (totalScores.side1 += 1)
        : (totalScores.side2 += 1);
    }
  });

  return totalScores;
};

export const calculateAllBreaksAboveThirtyForASet = async (set: Set) => {
  const breakAchievements: Array<{
    achievementType: 'THIRTY_PLUS' | 'FIFTY_PLUS' | 'HUNDRED_PLUS';
    playerId: string;
    score: number;
    turnStartTimeDate: string;
  }> = [];

  set.turns.forEach((turn) => {
    if (!turn.turnPlayerId) return;

    const breakScore = turn.points.reduce((total, point) => {
      if (point.snookerPoint) {
        return total + point.snookerPoint.score;
      } else if (point.billiardsPoint) {
        return total + point.billiardsPoint.score;
      }
      return total;
    }, 0);

    if (breakScore < 30) return;

    let achievementType: 'THIRTY_PLUS' | 'FIFTY_PLUS' | 'HUNDRED_PLUS';

    if (breakScore >= 100) {
      achievementType = 'HUNDRED_PLUS';
    } else if (breakScore >= 50) {
      achievementType = 'FIFTY_PLUS';
    } else {
      achievementType = 'THIRTY_PLUS';
    }

    breakAchievements.push({
      achievementType,
      playerId: turn.turnPlayerId,
      score: breakScore,
      turnStartTimeDate: turn.timeScored,
    });
  });

  return breakAchievements;
};

export const calculateStatsForPlayer = async (playerId: string, sets: Set[]) => {
  let highestBreak = 0;
  let fiftyPlusBreaks = 0;
  let thirtyPlusBreaks = 0;
  let hundredPlusBreaks = 0;
  let totalPots = 0;
  let successfulPots = 0;

  sets.forEach((set) => {
    const playerTurns = set.turns.filter((turn) => turn.turnPlayerId === playerId);

    playerTurns.forEach((turn) => {
      const breakScore = turn.points.reduce((total, point) => {
        if (point.snookerPoint) {
          return total + point.snookerPoint.score;
        } else if (point.billiardsPoint) {
          return total + point.billiardsPoint.score;
        }
        return total;
      }, 0);

      if (breakScore > highestBreak) {
        highestBreak = breakScore;
      }

      if (breakScore >= 100) {
        hundredPlusBreaks++;
      } else if (breakScore >= 50 && breakScore < 100) {
        fiftyPlusBreaks++;
      } else if (breakScore >= 30 && breakScore < 50) {
        thirtyPlusBreaks++;
      }

      turn.points.forEach((point) => {
        if (point.snookerPoint) {
          if (point.snookerPoint.type !== 'FOUL') {
            totalPots++;
          }
          if (point.snookerPoint.score > 0 || point.snookerPoint.type === 'PLAY_SAFE') {
            successfulPots++;
          }
        }
      });
    });
  });

  const potSuccessRatio = totalPots > 0 ? Math.round((successfulPots / totalPots) * 100) : 0;

  return {
    highestBreak,
    noOfFiftyPlusBreaks: fiftyPlusBreaks,
    noOfHundredPlusBreaks: hundredPlusBreaks,
    noOfThirtyPlusBreaks: thirtyPlusBreaks,
    potSuccessRatio,
  };
};

export const getStartTimeOfSet = async (set: Set) => {
  for (const turn of set.turns) {
    for (const point of turn.points) {
      if (point.timeScored) {
        return point.timeScored;
      }
    }
  }
  return null;
};

export const calculatePointsBySide = (
  turns: Turn[],
  sideOnePlayerOne: Player,
  sideOnePlayerTwo: Player | null,
  sideTwoPlayerOne: Player,
  sideTwoPlayerTwo: Player | null,
  handicap: number,
  teamOneHandicap?: number | null,
  teamTwoHandicap?: number | null
) => {

  let teamHandicaps = (teamOneHandicap != null || teamTwoHandicap != null) ? (teamOneHandicap ?? 0) - (teamTwoHandicap ?? 0) : null;

  const handicapToTake  = teamHandicaps != null ? teamHandicaps : handicap;

  let isHandicapTeamOneOrTeamTwo: 'teamA' | 'teamB' = 'teamA';

  if (handicapToTake < 0) {
    isHandicapTeamOneOrTeamTwo = 'teamB';
  }

  const sidePoints = {
    side1: isHandicapTeamOneOrTeamTwo === 'teamA' ? 0 + handicapToTake : 0,
    side2: isHandicapTeamOneOrTeamTwo === 'teamB' ? 0 + -1 * handicapToTake : 0,
  };

  const side1Players = new Set<string | null>(
    [sideOnePlayerOne.id, sideOnePlayerTwo?.id].filter((id): id is string | null => id !== undefined),
  );

  const side2Players = new Set<string | null>(
    [sideTwoPlayerOne.id, sideTwoPlayerTwo?.id].filter((id): id is string | null => id !== undefined),
  );

  turns.forEach((turn) => {
    const totalPoints = turn.points.reduce((total, point) => {
      if (point.snookerPoint) {
        return total + point.snookerPoint.score;
      }
      if (point.billiardsPoint) {
        return total + point.billiardsPoint.score;
      }
      return total;
    }, 0);

    const penaltyPoints = turn.points.reduce((penaltyTotal, point) => {
      if (point.snookerPoint && point.snookerPoint.penalty > 0) {
        return penaltyTotal + point.snookerPoint.penalty;
      }
      if (point.billiardsPoint && point.billiardsPoint.penalty > 0) {
        return penaltyTotal + point.billiardsPoint.penalty;
      }
      return penaltyTotal;
    }, 0);

    const playerSide = side1Players.has(turn.turnPlayerId)
      ? 'side1'
      : side2Players.has(turn.turnPlayerId)
        ? 'side2'
        : null;

    if (playerSide) {
      if (playerSide === 'side1' && penaltyPoints > 0) {
        sidePoints.side2 += penaltyPoints;
      } else if (playerSide === 'side2' && penaltyPoints > 0) {
        sidePoints.side1 += penaltyPoints;
      }
      sidePoints[playerSide] += totalPoints;
    }
  });

  return sidePoints;
};

export const calculateStatsForTeam = (teamPlayerIds: string[], sets: Set[]) => {
  let highestBreak = 0;
  let fiftyPlusBreaks = 0;
  let thirtyPlusBreaks = 0;
  let hundredPlusBreaks = 0;
  let totalPots = 0;
  let successfulPots = 0;
  let safetyPots = 0;

  sets.forEach((set) => {
    const playerTurns = set.turns.filter((turn) => teamPlayerIds.includes(turn.turnPlayerId!));

    playerTurns.forEach((turn) => {
      const breakScore = turn.points.reduce((total, point) => {
        if (point.snookerPoint) {
          return total + point.snookerPoint.score;
        } else if (point.billiardsPoint) {
          return total + point.billiardsPoint.score;
        }
        return total;
      }, 0);

      if (breakScore > highestBreak) {
        highestBreak = breakScore;
      }

      if (breakScore >= 100) {
        hundredPlusBreaks++;
      } else if (breakScore >= 50 && breakScore < 100) {
        fiftyPlusBreaks++;
      } else if (breakScore >= 30 && breakScore < 50) {
        thirtyPlusBreaks++;
      }

      turn.points.forEach((point) => {
        if (point.snookerPoint) {
          if (point.snookerPoint.type !== 'FOUL') {
            totalPots++;
          }
          if (point.snookerPoint.score > 0 || point.snookerPoint.type === 'PLAY_SAFE') {
            successfulPots++;
          }

          if (point.snookerPoint.type === 'PLAY_SAFE') {
            safetyPots++;
          }
        }
      });
    });
  });

  const potSuccessRatio = totalPots > 0 ? Math.round((successfulPots / totalPots) * 100) : 0;
  const safetySuccessRatio = totalPots > 0 ? Math.round((safetyPots / totalPots) * 100) : 0;

  return {
    highestBreak,
    noOfFiftyPlusBreaks: fiftyPlusBreaks,
    noOfHundredPlusBreaks: hundredPlusBreaks,
    noOfThirtyPlusBreaks: thirtyPlusBreaks,
    potSuccessRatio,
    safetySuccessRatio,
  };
};
