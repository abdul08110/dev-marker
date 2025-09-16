import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { RootState } from '@/stores';
import { useSelector } from 'react-redux';
import useGetTournamentSchedule from '@/api/app/useGetTournamentSchedule';
import useGetTournament from '@/api/app/useGetTournamentById';
import useGetScheduledMatches from '@/api/app/useGetScheduledMatches';

const useTournamentSchedule = () => {
  // HOOKS
  const clubs = useSelector((state: RootState) => state.club);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get('tournamentId');

  // API
  const { getTournament, tournament, loading: tournamentLoading } = useGetTournament();
  const { getTournamentSchedule, schedule, loading } = useGetTournamentSchedule();
  const { getScheduledMatches, scheduledMatches, loading: scheduledMatchesLoading } = useGetScheduledMatches();
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
      await getTournament({ id: tournamentId! });

      if (tournament?.eventFormat! === 'SINGLES') {
        await getTournamentSchedule({ id: tournamentId! });
      } else {
        await getScheduledMatches({ id: tournamentId! });
      }
    };

    fetchDataOnMount();
  }, [tournamentId, navigate]);

  return {
    loading,
    schedule,
    tournament,
    tournamentLoading,
    scheduledMatches,
    scheduledMatchesLoading,
  };
};

export default useTournamentSchedule;
