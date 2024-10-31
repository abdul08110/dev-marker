import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';
import { TournamentTeam } from '@/stores/types';

interface GetTournamentTeamsProps {
  id: string;
}

interface GetTournamentTeamsResponse {
  results: TournamentTeam[];
}

const useGetTournamentTeams = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<TournamentTeam[]>([]);

  const getTournamentTeams = async ({ id }: GetTournamentTeamsProps): Promise<GetTournamentTeamsResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      let url = `tournament/marker/get-tournament-teams/${id}`;

      const data = await handleApiResponse(axiosInstance.get<ApiResponse<GetTournamentTeamsResponse>>(url));
      setTeams(data.results);

      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getTournamentTeams, loading, error, teams };
};

export default useGetTournamentTeams;
