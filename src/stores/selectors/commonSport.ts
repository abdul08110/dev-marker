import { type Set, TeamDetails, Turn, Point } from '../types';


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

export const getLastPoint = (turn: Turn | null): Point | null => {
    return turn && turn.points.length > 0 ? turn.points[turn.points.length - 1] : null;
}

export const getTeamFromPlayerId = (id: string, team1: TeamDetails, team2: TeamDetails) => {
    return ({
        team1Player: team1.players.some(player => player.id === id),
        team2Player: team2.players.some(player => player.id === id)
    });
}

export const getActiveTeam = (team1: TeamDetails, team2: TeamDetails) => {
    return ({
        team1Active: team1.players.some(player => player.isActive === true),
        team2Active: team2.players.some(player => player.isActive === true)
    });
}

export const getActivePlayer = (team1: TeamDetails, team2: TeamDetails) => {
    const activePlayerTeamOne = team1.players.find(value => value.isActive);
    const activePlayerTeamTwo = team2.players.find(value => value.isActive);

    if (activePlayerTeamOne) return activePlayerTeamOne;
    if (activePlayerTeamTwo) return activePlayerTeamTwo;

    return null;
}

export const getLastPointPlayedInTheSet = (currentSet: Set | null) => {
    if (!currentSet) return null;
    else {
        const activeTurn = getActiveTurn(currentSet);
        if (activeTurn && activeTurn.points.length > 0) return getLastPoint(activeTurn);
        else {
            const lastTurn = getLastTurn(currentSet);
            if (lastTurn && lastTurn.points.length > 0) return getLastPoint(lastTurn);
        }
        return null;
    }
}