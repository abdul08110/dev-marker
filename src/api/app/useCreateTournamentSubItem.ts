import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';

interface MatchCreateTournametSubItemProps {
    formatId: string;
    tournamentPhaseId: string;
    teamOneId: string;
    teamTwoId: string;
}

export interface CreateTouramentSubItemResponse {
  id: string;
}

const useGetTournamentSubItem = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getTournamentSubItem = async (props: MatchCreateTournametSubItemProps, tournamentId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await handleApiResponse(
        axiosInstance.post<ApiResponse<CreateTouramentSubItemResponse>>(`tournament/marker/create-tournament-schedule/${tournamentId}`, {
            formatId: props.formatId,
            tournamentPhaseId: props.tournamentPhaseId,
            teamOneId: props.teamOneId,
            teamTwoId: props.teamTwoId,
        }),
      );

      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getTournamentSubItem, loading, error };
};

export default useGetTournamentSubItem;
