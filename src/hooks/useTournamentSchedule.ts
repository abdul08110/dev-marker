import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { RootState } from '@/stores';
import { useSelector } from 'react-redux';
import useGetTournamentSchedule from '@/api/app/useGetTournamentSchedule';
import useGetTournament from '@/api/app/useGetTournamentById';
import useGetScheduledMatches from '@/api/app/useGetScheduledMatches';
import { TournamentSubItem, TournamentPhase, TournamentItem, TournamentTeam, Player, TournamentFormat } from '@/stores/types';

type ScheduledMatch = TournamentSubItem & {
  phase: TournamentPhase;
  tournamentItem: TournamentItem;
  tournamentTeamOne: TournamentTeam;
  tournamentTeamTwo: TournamentTeam;
  teamOnePlayerOne: Player;
  teamOnePlayerTwo: Player;
  teamTwoPlayerOne: Player;
  teamTwoPlayerTwo: Player;
  gameFormat: TournamentFormat;
};

export type MatchData = ScheduledMatch;

type GroupedMatches = {
  [tournamentItemId: string]: {
    tournamentItem: TournamentItem;
    tournamentPhase: TournamentPhase;
    matches: MatchData[];
  };
};

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

  // Group scheduled matches by tournament item
  const groupedMatches = useMemo((): GroupedMatches | null => {
    if (!scheduledMatches) return null;
    
    return scheduledMatches.reduce((acc, match) => {
      const tournamentItemId = match.tournamentItem.id;
      if (!acc[tournamentItemId]) {
        acc[tournamentItemId] = {
          tournamentItem: match.tournamentItem,
          tournamentPhase: match.phase,
          matches: []
        };
      }
      acc[tournamentItemId].matches.push(match);
      return acc;
    }, {} as GroupedMatches);
  }, [scheduledMatches]);

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
      const tournamentData = await getTournament({ id: tournamentId! });

      if (tournamentData?.data?.eventFormat === 'SINGLES') {
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
    groupedMatches,
  };
};

export default useTournamentSchedule;
