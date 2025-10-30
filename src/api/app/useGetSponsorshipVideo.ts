import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';

interface GetSponsorshipVideoProps {
  matchId: string;
}

export interface GetSponsorshipVideoResponse {
  videoUrl: string;
}

const useGetSponsorshipVideo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getSponsorshipVideo = async (props: GetSponsorshipVideoProps) => {
    setLoading(true);
    setError(null);

    try {
      const data = await handleApiResponse(
        axiosInstance.get<ApiResponse<GetSponsorshipVideoResponse>>(
          `match/marker/get-sponsorship-video/${props.matchId}`,
        ),
      );
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getSponsorshipVideo, loading, error };
};

export default useGetSponsorshipVideo;
