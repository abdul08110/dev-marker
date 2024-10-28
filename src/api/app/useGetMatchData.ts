import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';
import { Set } from '@/stores/types';

interface MatchGetLiveDataProps {
  matchId: string;
}

export enum StreamType {
  CLOUD_PROVIDER = 'CLOUD_PROVIDER',
  NVR = 'NVR',
}

export interface StreamData {
  provider?: 'YOUTUBE';
  publicUrl?: string;
  streamKey?: string;
  streamUrl?: string;
  streamId?: string;
  brodcastId?: string;
  rtspChannel?: string;
  username?: string;
  password?: string;
  ip?: string;
  port?: number;
}

export interface MatchStartResponse {
  activePlayerId: string | null;
  actualStartTimeDate: string;
  actualEndTimeDate: string | null;
  clubId: string;
  createdAt: string;
  currentSetTeamOneScore: number;
  currentSetTeamTwoScore: number;
  expectedEndTimeDate: string;
  id: string;
  noOfSets: number | null;
  handicap: number;
  sideOnePlayerOne: {
    id: string;
    name: string;
    profilePhoto: string;
  };
  sideOnePlayerTwo: {
    id: string;
    name: string;
    profilePhoto: string;
  } | null;
  sideTwoPlayerTwo: {
    id: string;
    name: string;
    profilePhoto: string;
  } | null;
  sideTwoPlayerOne: {
    id: string;
    name: string;
    profilePhoto: string;
  };
  venue: {
    no: number;
  },
  club: {
    name: string;
  },
  sport: 'SNOOKER' | 'BILLIARDS';
  sportType: 'SNOOKER_15_RED' | 'SNOOKER_10_RED' | 'SNOOKER_6_RED';
  teamOneScore: number;
  teamTwoScore: number;
  venueId: string;
  sets: Set[];
  streamingType: 'PUBLIC' | 'PRIVATE';
  maxScorePerSet: number | null;
  streamData?: StreamData;
  streamType?: StreamType;
  matchStatus: 'LIVE' | 'COMPLETED',
  overlayType?: 'SOURCE' | 'DESTINATION'
  showPlayerMatchHistory?: boolean
}

const useGetMatchLiveData = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getLiveMatchData = async (props: MatchGetLiveDataProps) => {
    setLoading(true);
    setError(null);

    try {
      const data = await handleApiResponse(
        axiosInstance.get<ApiResponse<MatchStartResponse>>(`match/marker/get-live-match-data/${props.matchId}`),
      );

      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getLiveMatchData, loading, error };
};

export default useGetMatchLiveData;
