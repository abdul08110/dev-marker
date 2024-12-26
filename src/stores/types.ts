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

export interface TournamentTeam { 
  id: string;
  name: string;
  logo: string;
  users: Player[] 
}

export interface Tournament {
  id: string;
  logo: string;
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

export enum BilliardPointType {
  RED_IN_OFF = 'RED_IN_OFF',
  RED_POT = 'RED_POT',
  WHITE_IN_OFF = 'WHITE_IN_OFF',
  WHITE_POT = 'WHITE_POT',
  CANNON = 'CANNON',
  FOUL = 'FOUL'
}

export interface Set {
  teamOneScore: number;
  teamTwoScore: number;
  scoreOrder: string[];
  turns: Turn[];
  status: 'COMPLETED' | 'ONGOING' | 'CONCEDED';
  snookerCorrections: SnookerCorrection[];
  billiardsCorrections: BilliardsCorrection[];
  setConcededTo: 0 | 1 | null;
}

export interface SnookerCorrection {
  teamOneScore: number;
  teamTwoScore: number;
  redsRemaining: number;
  timeScored: string;
}

export interface BilliardsCorrection {
  teamOneScore: number;
  teamTwoScore: number;
  timeScored: string;
}

export interface Turn {
  turnPlayerId: string;
  score: number;
  timeScored: string;
  points: Point[];
}

export interface Point {
  snookerPoint?: {
    redsLost: number;
    missCalled: boolean;
    freeBall: boolean;
    isLongShot: boolean;
    type: SnookerPointType;
    penalty: number;
    score: number;
  };
  billiardsPoint?: {
    type: BilliardPointType,
    penalty: number;
    score: number;
  };
  timeScored: string;
}

export interface GeneralScoringState {
  format: 'SNOOKER_15_RED' | 'SNOOKER_10_RED' | 'SNOOKER_6_RED' | 'BILLIARDS_RACE_TO' | 'BILLIARDS_TIME_BASED';
  numberOn: number | null;
  numberAhead: number | null;
  matchId: null | string;
  isBackendUpdated: boolean;
  sport: 'SNOOKER' | 'BILLIARDS',
  team1Score: number;
  team2Score: number;
  isTeamOneHandicapApplied: boolean;
  isTeamTwoHandicapApplied: boolean;
  team1: TeamDetails;
  team2: TeamDetails;
  streaming: 'PUBLIC' | 'PRIVATE';
  timeInMinutes: number;
  scoreHistory: Set[];
  startTimeDate: string | null;
  noOfSets: number | null
  maxScorePerSet: number | null
  handicap: number;
  isCumulativeScoring: boolean;
  tournamentTeamOneId: string | null;
  tournamentTeamTwoId: string | null;
  tournamentId: string | null;
  tournamentTeamOneScore: number | null;
  tournamentTeamTwoScore: number | null;
  teamOneHandicap: number | null;
  teamTwoHandicap: number | null;
  expectedEndTimeDate: string | null;
}


export interface ClubData {
  clubId: string;
  venueId: string;
}

export interface ClubState {
  clubs: ClubData[];
  activeClub: ClubData | null;
}
