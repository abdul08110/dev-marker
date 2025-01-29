import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { RootState } from '@/stores';
import { useSelector } from 'react-redux';
import useGetTournamentSchedule from '@/api/app/useGetTournamentSchedule';

const useTournamentSchedule = () => {
  // HOOKS
  const clubs = useSelector((state: RootState) => state.club);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get('tournamentId');

  // API
  const { getTournamentSchedule, schedule, loading } = useGetTournamentSchedule();

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
    };

    fetchDataOnMount();
  }, [tournamentId, navigate]);

  return {
    loading,
    schedule,
  };
};

export default useTournamentSchedule;
