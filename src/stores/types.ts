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
  id: string | null;
  teamOneScore: number;
  teamTwoScore: number;
  scoreOrder: string[];
  turns: Turn[];
  status: 'COMPLETED' | 'ONGOING' | 'CONCEDED';
  corrections: Correction[];
}

export interface Correction {
  correctionId: string;
  teamOneScore: number;
  teamTwoScore: number;
  redsRemaining: number;
}

export interface Turn {
  id: string | null;
  turnPlayerId: string;
  score: number;
  timeScored: string;
  points: (Point & SnookerPoint)[];
}

export interface SnookerPoint {
  ballsLost: number;
  missCalled: boolean;
  freeBall: boolean;
  isLong: boolean;
  type: SnookerPointType;
  penalty: number;
  score: number;
  timeScored: string;
}

export interface Point {
  id: string | null;
}

export interface GeneralScoringState {
  matchId: null | string;
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
