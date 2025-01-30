import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { RootState } from '@/stores';
import { useSelector } from 'react-redux';
import useGetTournamentSchedule from '@/api/app/useGetTournamentSchedule';
import useGetTournamentTeams from '@/api/app/useGetTournamentTeams';

const useTournamentSchedule = () => {
  // HOOKS
  const clubs = useSelector((state: RootState) => state.club);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get('tournamentId');

  // API
  const { getTournamentSchedule, schedule, loading } = useGetTournamentSchedule();
  const { getTournamentTeams, teams, loading: teamsLoading } = useGetTournamentTeams();

  // SIDE EFFECTS
  useEffect(() => {
    if (clubs.activeClub === null) {
      navigate('/');
    }
  }, [clubs.activeClub, navigate]);

  useEffect(() => {
    if (tournamentId === null) {
      navigate('/');
    }

    const fetchDataOnMount = async () => {
      await getTournamentSchedule({ id: tournamentId! });
      await getTournamentTeams({ id: tournamentId! });
    };

    fetchDataOnMount();
  }, [tournamentId, navigate]);

  return {
    loading,
    teamsLoading,
    schedule,
    teams,
  };
};

export default useTournamentSchedule;
