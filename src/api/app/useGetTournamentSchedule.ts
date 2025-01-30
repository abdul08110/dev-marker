import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';
import { TournamentPhase } from '@/stores/types';

interface GetTournamentScheduleProps {
  id: string;
}

interface GetTournamentScheduleResponse {
  results: TournamentPhase;
}

const useGetTournamentSchedule = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<TournamentPhase | null>(null);

  const getTournamentSchedule = async ({
    id,
  }: GetTournamentScheduleProps): Promise<GetTournamentScheduleResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      let url = `tournament/marker/get-tournament-schedule/${id}`;

      const data = await handleApiResponse(axiosInstance.get<ApiResponse<GetTournamentScheduleResponse>>(url));

      setSchedule(data.results);

      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getTournamentSchedule, loading, error, schedule };
};

export default useGetTournamentSchedule;
