import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';
import { SnookerPointType } from '@/stores/types';

interface CreateSetProps {
  timeScored: string;
  teamOneScore: number;
  teamTwoScore: number;
  matchId: string;
  scoreOrder: string[];
}

interface CreateSnookerPointProps {
  type: SnookerPointType;
  score: number;
  penalty: number;
  redsLost: number;
  missCalled: boolean;
  freeBall: boolean;
  turnId: string;
  timeScored: string;
  isLongShot: boolean;
}

interface ChangeTurnScoreRequestProps {
  turnId: string;
  score: number;
}

interface ChangeSetScoreRequestProps {
  setId: string;
  teamOneScore: number;
  teamTwoScore: number;
}

interface AddCorrectionProps {
  teamOneScore: number;
  teamTwoScore: number;
  redsRemaining: number;
  setId: string;
  timeScored: string;
}

interface universalDeleteProps {
  matchId: string;
  data: {
    setIds: string[],
    turnIds: string[],
    pointIds: string[],
    snookerCorrectionIds: string[],
  }
}

interface CrateSetResponse {
  setId: string;
}

interface CreateCorrectionResponse {
  correctionId: string;
}

interface CreateTurnResponse {
  turnId: string;
}

interface CreatePointResponse {
  pointId: string;
}

interface CreateTurnProps {
  turnPlayerId: string;
  score: number;
  setId: string;
  timeScored: string;
}

interface SetActivePlayerProps {
  matchId: string;
  playerId: string;
}

interface MatchPlayerReverseProps {
  id: string;
}

interface MatchReversePlayersResponse {
  response: true;
}

export const createSetRequest = async (props: CreateSetProps): Promise<string | null> => {
  try {
    const response = await handleApiResponse(
      axiosInstance.post<ApiResponse<CrateSetResponse>>(`match/marker/create-set/`, props),
    );
    return response.setId;
  } catch (error: any) {
    console.error('Error creating set:', error.message);
    return null;
  }
};

export const reversePlayersRequest = async (props: MatchPlayerReverseProps): Promise<boolean | null> => {
  try {
    const response = await handleApiResponse(
      axiosInstance.get<ApiResponse<MatchReversePlayersResponse>>(`match/marker/reverse-players/${props.id}`),
    );
    return response.response;
  } catch (error: any) {
    console.error('Error reversing players:', error.message);
    return null;
  }
};

export const createTurnRequest = async (props: CreateTurnProps): Promise<string | null> => {
  try {
    const response = await handleApiResponse(
      axiosInstance.post<ApiResponse<CreateTurnResponse>>(`match/marker/create-turn/`, props),
    );
    return response.turnId;
  } catch (error: any) {
    console.error('Error creating turn:', error.message);
    return null;
  }
};

export const setActivePlayerRequest = async (props: SetActivePlayerProps): Promise<boolean> => {
  try {
    const response = await handleApiResponse(axiosInstance.post(`match/marker/set-active-player/`, props));

    console.log(response);
    return true;
  } catch (error: any) {
    console.error('Error creating turn:', error.message);
    return false;
  }
};

export const createSnookerPointRequest = async (props: CreateSnookerPointProps): Promise<string | null> => {
  try {
    const response = await handleApiResponse(
      axiosInstance.post<ApiResponse<CreatePointResponse>>(`match/marker/create-snooker-point/`, props),
    );
    return response.pointId;
  } catch (error: any) {
    console.error('Error creating turn:', error.message);
    return null;
  }
};

export const changeTurnScoreRequest = async (props: ChangeTurnScoreRequestProps): Promise<boolean> => {
  try {
    const response = await handleApiResponse(
      axiosInstance.post<ApiResponse<boolean>>(`match/marker/handle-turn-score-change/`, props),
    );
    console.log(response);
    return true;
  } catch (error: any) {
    console.error('Error creating turn:', error.message);
    return false;
  }
};

export const changeSetScoreRequest = async (props: ChangeSetScoreRequestProps): Promise<boolean> => {
  try {
    const response = await handleApiResponse(
      axiosInstance.post<ApiResponse<boolean>>(`match/marker/handle-set-score-change/`, props),
    );
    console.log(response);
    return true;
  } catch (error: any) {
    console.error('Error creating turn:', error.message);
    return false;
  }
};

export const createCorrection = async (props: AddCorrectionProps): Promise<string | null> => {
  try {
    const response = await handleApiResponse(
      axiosInstance.post<ApiResponse<CreateCorrectionResponse>>(`match/marker/handle-snooker-corrections/`, props),
    );
    return response.correctionId;
  } catch (error: any) {
    console.error('Error creating turn:', error.message);
    return null;
  }
};

export const universalDelele = async (props: universalDeleteProps): Promise<string | null> => {
  try {
    const response = await handleApiResponse(
      axiosInstance.post<ApiResponse<CreateCorrectionResponse>>(`match/marker/match-items-delete/${props.matchId}`, props.data),
    );
    return response.correctionId;
  } catch (error: any) {
    console.error('Error creating turn:', error.message);
    return null;
  }
};

