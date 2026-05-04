import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';

interface ClubControllerChannel {
  channelId: string;
  cameraId: string;
  cameraName: string;
  isPrimary: boolean;
}

interface ClubControllerInfo {
  id: string;
  macAddress: string;
  publicIp: string;
  publicPort: number;
  localIp: string;
}

export interface GetClubControllerResponse {
  clubController: ClubControllerInfo;
  channels: ClubControllerChannel[];
}

const useGetClubController = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getClubController = async (venueId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await handleApiResponse(
        axiosInstance.get<ApiResponse<GetClubControllerResponse>>(
          `club-controller/venue/${venueId}`,
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

  return { getClubController, loading, error };
};

export default useGetClubController;
