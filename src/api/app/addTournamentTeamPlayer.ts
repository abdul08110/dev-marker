import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';

interface AddTournamentTeamPlayerProps {
  tournamentId: string;
  teamId: string;
  phone: string;
  name: string;
}

interface AddTournamentTeamPlayerResponse {
  result: boolean;
}

const useTournamentTeamAddPlayers = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addTournamentTeamPlayer = async ({
    phone,
    name,
    teamId,
    tournamentId,
  }: AddTournamentTeamPlayerProps): Promise<AddTournamentTeamPlayerResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const data = await handleApiResponse(
        axiosInstance.post<ApiResponse<AddTournamentTeamPlayerResponse>>(
          `tournament/marker/create-tournament-player`,
          {
            phone,
            name,
            teamId,
            tournamentId
          },
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

  return { addTournamentTeamPlayer, loading, error };
};

export default useTournamentTeamAddPlayers;
