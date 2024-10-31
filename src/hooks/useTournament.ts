import { useNavigate, useSearchParams } from 'react-router-dom';
import useStartMatch from '@/api/app/useStartMatch';
import React, { useEffect } from 'react';
import useGetTournamentTeams from '@/api/app/useGetTournamentTeams';
import { ConfigureTournamentData } from '@/components/forms/app/configureTournament';
import { RootState } from '@/stores';
import { useSelector } from 'react-redux';

const useTournament = () => {
  // HOOKS
  const clubs = useSelector((state: RootState) => state.club);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get('tournamentId');

  // API
  const startMatchHook = useStartMatch();
  const { getTournamentTeams, teams } = useGetTournamentTeams();

  // LOCAL STATE
  const [loading, setLoading] = React.useState(false);

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
      setLoading(true);
      try {
        await getTournamentTeams({ id: tournamentId! });
      } catch (error) {
        console.error('Failed to start the match:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataOnMount();
  }, [tournamentId, navigate]);

  const handleMatchCreation = async (data: ConfigureTournamentData) => {
    setLoading(true);

    let sportType: 'SNOOKER_10_RED' | 'SNOOKER_15_RED' | 'SNOOKER_6_RED' = 'SNOOKER_10_RED';
    let noOfSets = 1;
    let isCumulativeScore = false;

    if (data.format === '10_REDS_SINGLE_FRAME') {
      sportType = 'SNOOKER_10_RED';
    } else if (data.format === '15_REDS_SINGLE_FRAME') {
      sportType = 'SNOOKER_15_RED';
    } else if (data.format === '6_REDS_CUMULATIVE') {
      sportType = 'SNOOKER_6_RED';
      noOfSets = 2;
      isCumulativeScore = true;
    }

    const response = await startMatchHook.startMatch({
      clubId: clubs.activeClub!.clubId!,
      sport: 'SNOOKER',
      sportType: sportType,
      venueId: clubs.activeClub!.venueId,
      sideOnePlayerOneId: data.teamOnePlayerOneId,
      sideTwoPlayerOneId: data.teamTwoPlayerOneId,
      streamingType: 'PUBLIC',
      handicap: data.handicap,
      maxScorePerSet: null,
      noOfSets: noOfSets,
      cumulativeScoring: isCumulativeScore,
      tournamentTeamOneId: data.teamOneId,
      tournamentTeamTwoId: data.teamTwoId,
      tournamentId: tournamentId!,
    });

    if (response) {
      navigate(`/app/snooker?matchId=${response}`);
    }

    setLoading(false);
  };

  return {
    loading,
    teams,
    handleMatchCreation,
  };
};

export default useTournament;
