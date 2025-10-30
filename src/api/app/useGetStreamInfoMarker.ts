import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';

interface MatchGetStreamInfoProps {
  matchId: string;
}

export enum StreamType {
  CLOUD_PROVIDER = 'CLOUD_PROVIDER',
  NVR = 'NVR',
}
export interface MatchStreamInfoResponse {
  streams: {
    streamType: StreamType;
    streamProvider: 'YOUTUBE' | 'MUX';
    streamUrl?: string;
    isPrimary: boolean;
    brodcastId?: string;
    overlayType: 'SOURCE' | 'DESTINATION' | 'SOURCE_WITH_FINAL_SCORES';
  }[];
  matchStatus: 'LIVE' | 'COMPLETED';
  startTime: string;
  venueId: string;
  sponsorshipVideoUrl: string;
}

const useGetMatchStreams = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getLiveStreamData = async (props: MatchGetStreamInfoProps) => {
    setLoading(true);
    setError(null);

    try {
      const data = await handleApiResponse(
        axiosInstance.get<ApiResponse<MatchStreamInfoResponse>>(`match/marker/get-match-streams/${props.matchId}`),
      );
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getLiveStreamData, loading, error };
};

export default useGetMatchStreams;
