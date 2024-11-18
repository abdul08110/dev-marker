import { useNavigate, useSearchParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import useGetTournamentTeams from '@/api/app/useGetTournamentTeams';
import { ConfigureTournamentData } from '@/components/forms/app/configureTournament';
import { RootState, useAppDispatch } from '@/stores';
import { useSelector } from 'react-redux';
import { setStateTournament } from '@/stores/thunks/sportThunks';

const useTournament = () => {
  // HOOKS
  const clubs = useSelector((state: RootState) => state.club);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get('tournamentId');
  const dispatch = useAppDispatch();

  // API
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

    const teamOnePlayerOne = teams.find((team) => team.id === data.teamOneId)?.users[0];
    const teamTwoPlayerOne = teams.find((team) => team.id === data.teamTwoId)?.users[0];


    const modifiedData = {
      ...data,
      sideOnePlayerOne: teamOnePlayerOne!,
      sideTwoPlayerOne:teamTwoPlayerOne!,
    }
    

    await dispatch(setStateTournament({ data: modifiedData, tournamentId: tournamentId! }));

    navigate(`/app/billiards`);

    setLoading(false);
  };

  return {
    loading,
    teams,
    handleMatchCreation,
  };
};

export default useTournament;
