import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';
import { LineupResponse } from './types/lineup';

interface GetLineupProps {
  tournamentId: string;
  phaseId: string;
  teamOneId: string;
  teamTwoId: string;
}

const useGetLineup = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getLineup = async (props: GetLineupProps) => {
    setLoading(true);
    setError(null);

    try {
      const data = await handleApiResponse(
        axiosInstance.get<ApiResponse<LineupResponse>>(
          `match/marker/get-lineup/${props.tournamentId}/${props.phaseId}/${props.teamOneId}/${props.teamTwoId}`,
        ),
        false,
      );
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getLineup, loading, error };
};

export default useGetLineup;
