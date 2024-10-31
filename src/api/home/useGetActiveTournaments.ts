import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';
import { Tournament } from '@/stores/types';


interface GetActiveTournamentsResponse {
  results: Tournament[];
}

const useGetActiveTournaments = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  const getTournaments = async (): Promise<GetActiveTournamentsResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      let url = `tournament/marker/get-active-tournaments`;

      const data = await handleApiResponse(axiosInstance.get<ApiResponse<GetActiveTournamentsResponse>>(url));
      setTournaments(data.results);

      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getTournaments, loading, error, tournaments };
};

export default useGetActiveTournaments;
