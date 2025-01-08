import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';

interface useLinkDeviceProps {
  venueId: string;
  type: 'SCOREBOARD' | 'TV';
  deviceIdentifier: string;
}

const useLinkDevice = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const linkDevice = async ({ venueId, type, deviceIdentifier }: useLinkDeviceProps): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const data = await handleApiResponse(
        axiosInstance.post<ApiResponse<null>>(`auth/marker/link-device-to-venue`, {
          venueId,
          type,
          deviceIdentifier,
        }),
      );

      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
      return true;
    }
  };

  return { linkDevice, loading, error };
};

export default useLinkDevice;
