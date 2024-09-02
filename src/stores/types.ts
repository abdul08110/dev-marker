export interface TeamDetails {
    players: PlayerDetails[],
    score: number
}

export interface PlayerDetails {
    playerName: string,
    playerImage: string | null,
    id: string | null,
    isActive: boolean
}

export interface Player {
    name: string;
    profilePhoto?: string;
    id: string;
    phoneNumber?: string;
}

export enum PointType {
    YELLOW = "YELLOW",
    GREEN = "GREEN",
    RED = "RED",
    FOUL = "FOUL",
    BROWN = "BROWN",
    BLUE = "BLUE",
    PINK = "PINK",
    BLACK = "BLACK"
}

export interface Set {
    id: string | null
    teamOneScore: number;
    teamTwoScore: number;
    turns: Turn[];
    status: 'COMPLETED' | 'ONGOING'
}

export interface Turn {
    id: string | null
    turnPlayerId: string
    score: number
    timeScored: string
    points: Point[]

}

export interface Point {
    id?: string
    score: number
    timeScored: string
    type: PointType
    penalty: number
    ballsLost: number
    missCalled: boolean
    freeBall: boolean
}

export interface SnookerScoringState {
    format: 'SNOOKER_15_RED' | 'SNOOKER_10_RED' | 'SNOOKER_6_RED';
    matchId: null | string;
    numberOfFrames: number;
    team1Score: number;
    team2Score: number;
    players: {
        team1: TeamDetails;
        team2: TeamDetails;
    };
    handicap: number;
    streaming: 'PUBLIC' | 'PRIVATE';
    timeInMinutes: number;
    scoreHistory: Set[];
    numberOn: number;
    numberAhead: number;
    startTimeDate: string | null;
}



export interface ClubData {
    clubId: string
    venueId: string
}


export interface ClubState {
    clubs: ClubData[];
    activeClub: ClubData | null;
}

export interface SetPlayerPayloadAction {
    player: Player,
    playerIndex: number,
    teamIndex: number
}

export interface SetActivePlayerAction {
    playerIndex: number,
    teamIndex: number,
}