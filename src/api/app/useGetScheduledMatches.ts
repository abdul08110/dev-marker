import { useState } from 'react';
import axiosInstance from '../axios';
import { handleApiResponse } from '@/utils/handlers';
import { ApiResponse } from '@/types';
import {
  Player,
  TournamentFormat,
  TournamentItem,
  TournamentPhase,
  TournamentSubItem,
  TournamentTeam,
} from '@/stores/types';

interface GetScheduledMatchesResponse {
  data: (TournamentSubItem & {
    phase: TournamentPhase;
    tournamentItem: TournamentItem;
    tournamentTeamOne: TournamentTeam;
    tournamentTeamTwo: TournamentTeam;
    teamOnePlayerOne: Player;
    teamOnePlayerTwo: Player;
    teamTwoPlayerOne: Player;
    teamTwoPlayerTwo: Player;
    gameFormat: TournamentFormat;
  })[];
}

const useGetScheduledMatches = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduledMatches, setScheduledMatches] = useState<(TournamentSubItem & {
    phase: TournamentPhase;
    tournamentItem: TournamentItem;
    tournamentTeamOne: TournamentTeam;
    tournamentTeamTwo: TournamentTeam;
    teamOnePlayerOne: Player;
    teamOnePlayerTwo: Player;
    teamTwoPlayerOne: Player;
    teamTwoPlayerTwo: Player;
    gameFormat: TournamentFormat;
  })[] | null>(null);

  const getScheduledMatches = async ({ id }: { id: string }): Promise<GetScheduledMatchesResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      if (id) {
        let url = `tournament/marker/get-scheduled-matches/${id}`;

        const data = await handleApiResponse(axiosInstance.get<ApiResponse<GetScheduledMatchesResponse>>(url));

        setScheduledMatches(data.data);
        return data;
      } else return null;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getScheduledMatches, loading, error, scheduledMatches: scheduledMatches };
};

export default useGetScheduledMatches;
