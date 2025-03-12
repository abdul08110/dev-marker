import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';
import { Set } from '@/stores/types';

interface MatchPlayerReverseProps {
  id: string;
}

interface MatchReversePlayersResponse {
  response: true;
}

interface MatchUpdateDataProps {
  matchId: string;
  activePlayerId: string | null;
  sets: Set[];
  teamOneScore: number;
  teamTwoScore: number;
  currentSetTeamOneScore: number;
  currentSetTeamTwoScore: number;
  isTeamOneHandicapApplied?: boolean;
  isTeamTwoHandicapApplied?: boolean;
}

interface PlayerStats {
  highestBreak: number;
  noOfFiftyPlusBreaks: number;
  noOfHundredPlusBreaks: number;
  potSuccessRatio: number;
}

interface MarkerEndGameProps {
  matchId: string;
  teamWinningIndex: number;
  sideOnePlayerOneStats: PlayerStats | null;
  sideTwoPlayerOneStats: PlayerStats | null;
  sideOnePlayerTwoStats: PlayerStats | null;
  sideTwoPlayerTwoStats: PlayerStats | null;
  sets: Set[];
  teamOneScore: number;
  teamTwoScore: number;
  currentSetTeamOneScore: number;
  currentSetTeamTwoScore: number;
}

interface MatchResetTimerRequestProps {
  matchId: string;
  expectedEndTimeDate: Date;
}

export const reversePlayersRequest = async (props: MatchPlayerReverseProps): Promise<boolean | null> => {
  try {
    const response = await handleApiResponse(
      axiosInstance.get<ApiResponse<MatchReversePlayersResponse>>(`match/marker/reverse-players/${props.id}`),
    );
    return response.response;
  } catch (error: any) {
    return null;
  }
};

export const matchUpdateDataRequest = async (props: MatchUpdateDataProps): Promise<boolean | null> => {
  try {
    await handleApiResponse(
      axiosInstance.post<ApiResponse<MatchReversePlayersResponse>>(`match/marker/update-match-data/`, props),
      false,
    );
    return true;
  } catch (error: any) {
    return null;
  }
};

export const matchEndGameRequest = async (props: MarkerEndGameProps): Promise<boolean | null> => {
  try {
    await handleApiResponse(
      axiosInstance.post<ApiResponse<MatchReversePlayersResponse>>(`match/marker/end-game`, props),
    );

    return true;
  } catch (err) {
    return null;
  }
};

export const matchResetTimerRequest = async (props: MatchResetTimerRequestProps): Promise<boolean | null> => {
  try {
    await handleApiResponse(
      axiosInstance.post<ApiResponse<MatchReversePlayersResponse>>(`match/marker/reset-timer`, props),
      false,
    );

    return true;
  } catch (err) {
    return null;
  }
};
