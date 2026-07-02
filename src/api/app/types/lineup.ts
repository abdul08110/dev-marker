export interface LineupPlayer {
  id: string;
  name: string;
  profilePhoto: string | null;
}

export interface LineupGameFormat {
  id: string;
  name: string;
  sport: 'SNOOKER' | 'BILLIARDS';
  noOfPlayers: number;
  noOfSets: number;
  maxScorePerSet: number | null;
  matchNo: number;
  categoryName: string;
  isCumulativeScoring: boolean;
  isHandicapAllowed: boolean;
  noOfBalls: number | null;
  maxTimePerSetInMilliSeconds: number | null;
  switchType: string | null;
  snookerHandicapType: 'FRAME' | 'DIFFERENCE' | 'UPFRONT' | null;
  relayGroupIndex: number | null;
}

export interface LineupMatchSet {
  teamOneScore: number;
  teamTwoScore: number;
}

export interface LineupMatch {
  id: string;
  matchStatus: 'LIVE' | 'COMPLETED';
  teamOneScore: number;
  teamTwoScore: number;
  currentSetTeamOneScore: number;
  currentSetTeamTwoScore: number;
  sets: LineupMatchSet[];
  teamWinningIndex: number | null;
  sport: string;
  format: string;
}

export interface LineupSubItem {
  id: string;
  status: 'PENDING' | 'LIVE' | 'COMPLETED';
  teamWinningIndex: 1 | 2 | null;
  teamOneHandicap: number;
  teamTwoHandicap: number;
  dateScheduled: string | null;
  teamOnePlayerOne: LineupPlayer | null;
  teamOnePlayerTwo: LineupPlayer | null;
  teamTwoPlayerOne: LineupPlayer | null;
  teamTwoPlayerTwo: LineupPlayer | null;
  gameFormat: LineupGameFormat;
  match: LineupMatch | null;
}

export interface LineupTeam {
  id: string;
  name: string;
  logo: string;
  code: string;
  users: LineupPlayer[];
}

export interface LineupResponse {
  id: string;
  tournamentPhaseId: string;
  teamOneScore: number;
  teamTwoScore: number;
  teamOneCumulativeFinalFrameScore: number;
  teamTwoCumulativeFinalFrameScore: number;
  teamOneLastestGameHandicap: number;
  teamTwoLastestGameHandicap: number;
  relayAggregates: any[];
  scheduledDate: string | null;
  cutOffDate: string | null;
  tournamentTeamOne: LineupTeam;
  tournamentTeamTwo: LineupTeam;
  tournamentSubItems: LineupSubItem[];
}
