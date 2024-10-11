import { type Set, TeamDetails, Turn, Point } from '../types';

const getLastElement = <T>(array: T[]): T | null => (array.length > 0 ? array[array.length - 1] : null);

const getSecondLastElement = <T>(array: T[]): T | null => (array.length > 1 ? array[array.length - 2] : null);

// SETS

export const getActiveSet = (sets: Set[]): Set | undefined => sets.find((value) => value.status === 'ONGOING');

export const getActiveSetIndex = (sets: Set[]): number => sets.findIndex((value) => value.status === 'ONGOING');

export const getLastSet = (sets: Set[]): Set | null => getSecondLastElement(sets);

export const getLastSetIndex = (sets: Set[]): number => (sets.length > 0 ? sets.length - 2 : -1);

// TURNS

export const getActiveTurn = (set: Set | null): Turn | null => (set ? getLastElement(set.turns) : null);

export const getLastTurn = (set: Set): Turn | null => getSecondLastElement(set.turns);

export const getActiveTurnIndex = (set: Set | null): number =>
  set && set.turns.length > 0 ? set.turns.length - 1 : -1;

// POINTS

export const getActivePoint = (turn: Turn | null): Point | null =>
  turn ? getLastElement(turn.points) : null;

export const getSecondLastPoint = (turn: Turn | null): Point | null =>
  getSecondLastElement(turn?.points ?? []);

export const getAllPointsAfter = (
  turns: Turn[],
  startTurnIndex: number,
  startPointIndex: number,
): Point[] => {
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
