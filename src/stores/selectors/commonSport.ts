import { type Set, TeamDetails, Turn, Point } from '../types';

const getLastElement = <T>(array: T[]): T | null => (array.length > 0 ? array[array.length - 1] : null);

const getSecondLastElement = <T>(array: T[]): T | null => (array.length > 1 ? array[array.length - 2] : null);

export const getActiveSet = (sets: Set[]): Set | null => getLastElement(sets);

export const getLastSet = (sets: Set[]): Set | null => getSecondLastElement(sets);

export const getActiveSetIndex = (sets: Set[]): number => (sets.length > 0 ? sets.length - 1 : -1);

export const getActiveTurn = (set: Set | null): Turn | null => (set ? getLastElement(set.turns) : null);

export const getLastTurn = (set: Set): Turn | null => getSecondLastElement(set.turns);

export const getActiveTurnIndex = (set: Set): number => (set.turns.length > 0 ? set.turns.length - 1 : -1);

export const getLastPoint = (turn: Turn | null): Point | null => (turn ? getLastElement(turn.points) : null);

export const getSecondLastPoint = (turn: Turn | null): Point | null => getSecondLastElement(turn?.points ?? []);

export const getLastSetIndex = (sets: Set[]): number => (sets.length > 0 ? sets.length - 2 : -1);

export const getTeamFromPlayerId = (id: string, team1: TeamDetails, team2: TeamDetails) => ({
  team1Player: team1.players.some((player) => player.id === id),
  team2Player: team2.players.some((player) => player.id === id),
});

export const getActiveTeam = (team1: TeamDetails, team2: TeamDetails) => ({
  team1Active: team1.players.some((player) => player.isActive),
  team2Active: team2.players.some((player) => player.isActive),
});

export const getActivePlayer = (team1: TeamDetails, team2: TeamDetails) => {
  return team1.players.find((player) => player.isActive) || team2.players.find((player) => player.isActive) || null;
};

export const getLastPointPlayedInTheSet = (currentSet: Set | null): Point | null => {
  if (!currentSet) return null;

  const activeTurn = getActiveTurn(currentSet);
  if (activeTurn && activeTurn.points.length > 0) return getLastPoint(activeTurn);

  const lastTurn = getLastTurn(currentSet);
  return getLastPoint(lastTurn);
};

export const getSecondLastPointPlayedInTheSet = (currentSet: Set | null): Point | null => {
  if (!currentSet) return null;

  const activeTurn = getActiveTurn(currentSet);
  if (activeTurn) {
    if (activeTurn.points.length > 1) return getSecondLastPoint(activeTurn);
    if (activeTurn.points.length === 1) return getLastPoint(getLastTurn(currentSet));
  }

  return getSecondLastPoint(getLastTurn(currentSet));
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

export const getAllPointsAfter = (turns: Turn[], startTurnIndex: number, startPointIndex: number) => {
  let points: Point[] = [];
  for (let i = startTurnIndex; i < turns.length; i++) {
    const start = i === startTurnIndex ? startPointIndex + 1 : 0;
    points = points.concat(turns[i].points.slice(start));
  }
  return points;
};

export const getLastTurnPlayerIndex = (turns: Turn[], playerId: string): number => {
  return turns.map((turn) => turn.turnPlayerId).lastIndexOf(playerId);
};

export const isActiveTeam = (activeTeam: any, teamIndex: number): boolean => {
  return (activeTeam.team1Active && teamIndex === 0) || (activeTeam.team2Active && teamIndex === 1);
};

export const getTeamKey = (teamIndex: number): string => {
  return teamIndex === 0 ? 'team1' : 'team2';
};
