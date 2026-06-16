import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';

interface CancelScoreboardEntryProps {
  venueId: string;
}

const useCancelScoreboardEntry = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelScoreboardEntry = async (props: CancelScoreboardEntryProps): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await handleApiResponse(
        axiosInstance.post<ApiResponse<{ success: boolean }>>('match/marker/cancel-scoreboard-entry', props),
      );
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { cancelScoreboardEntry, loading, error };
};

export default useCancelScoreboardEntry;
