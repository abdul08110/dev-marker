export interface TeamDetails {
  players: PlayerDetails[];
  score: number;
}

export interface PlayerDetails extends Player {
  isActive: boolean;
}

export interface Player {
  name: string;
  profilePhoto?: string | null;
  id: string | null;
  phoneNumber?: string;
}

export enum SnookerPointType {
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
  RED = 'RED',
  FOUL = 'FOUL',
  BROWN = 'BROWN',
  BLUE = 'BLUE',
  PINK = 'PINK',
  BLACK = 'BLACK',
  PLAY_SAFE = 'PLAY_SAFE',
  MISSED_POT = 'MISSED_POT',
}

export interface Set {
  teamOneScore: number;
  teamTwoScore: number;
  scoreOrder: string[];
  turns: Turn[];
  status: 'COMPLETED' | 'ONGOING' | 'CONCEDED';
  snookerCorrections: SnookerCorrection[];
  setConcededTo: 0 | 1 | null;
}

export interface SnookerCorrection {
  teamOneScore: number;
  teamTwoScore: number;
  redsRemaining: number;
  timeScored: string;
}

export interface Turn {
  turnPlayerId: string;
  score: number;
  timeScored: string;
  points: Point[];
}

export interface Point {
  snookerPoint: {
    redsLost: number;
    missCalled: boolean;
    freeBall: boolean;
    isLongShot: boolean;
    type: SnookerPointType;
    penalty: number;
    score: number;
  };
  timeScored: string;
}

export interface GeneralScoringState {
  matchId: null | string;
  isBackendUpdated: boolean;
  team1Score: number;
  team2Score: number;
  team1: TeamDetails;
  team2: TeamDetails;
  streaming: 'PUBLIC' | 'PRIVATE';
  timeInMinutes: number;
  scoreHistory: Set[];
  startTimeDate: string | null;
}

export interface SnookerScoringState extends GeneralScoringState {
  format: 'SNOOKER_15_RED' | 'SNOOKER_10_RED' | 'SNOOKER_6_RED';
  handicap: number;
  numberOn: number;
  numberAhead: number;
}

export interface ClubData {
  clubId: string;
  venueId: string;
}

export interface ClubState {
  clubs: ClubData[];
  activeClub: ClubData | null;
}
