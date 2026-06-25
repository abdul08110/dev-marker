import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';

interface InitiateScoreboardEntryProps {
  venueId: string;
  playerCount: 2 | 4;
  sport: 'snooker' | 'billiards';
}

const useInitiateScoreboardEntry = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiateScoreboardEntry = async (props: InitiateScoreboardEntryProps): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await handleApiResponse(
        axiosInstance.post<ApiResponse<{ success: boolean }>>('match/marker/initiate-scoreboard-entry', props),
      );
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { initiateScoreboardEntry, loading, error };
};

export default useInitiateScoreboardEntry;
