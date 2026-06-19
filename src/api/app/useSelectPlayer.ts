import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';

interface SelectPlayerProps {
  venueId: string;
  playerNumber: number;
  userId: string;
}

const useSelectPlayer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectPlayer = async (props: SelectPlayerProps): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await handleApiResponse(
        axiosInstance.post<ApiResponse<{ success: boolean }>>('match/marker/select-player', props),
      );
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { selectPlayer, loading, error };
};

export default useSelectPlayer;
