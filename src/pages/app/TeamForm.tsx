import useTournamentTeamAddPlayers from '@/api/app/addTournamentTeamPlayer';
import useGetTournamentTeams from '@/api/app/useGetTournamentTeams';
import {
  AddTournamentTeamPlayerForm,
  AddTournamentTeamPlayerFormData,
} from '@/components/forms/app/addTournamentPlayer';
import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import { toast } from '@/components/ui/use-toast';
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function TeamForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get('tournamentId');
  const [loading, setLoading] = React.useState(false);
  const { addTournamentTeamPlayer } = useTournamentTeamAddPlayers();

  const { getTournamentTeams, teams } = useGetTournamentTeams();

  useEffect(() => {
    if (tournamentId === null) {
      navigate('/');
    }

    const fetchDataOnMount = async () => {
      try {
        setLoading(true);
        await getTournamentTeams({ id: tournamentId! });
      } catch (error) {
        console.error('Failed to start the match:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataOnMount();
  }, [tournamentId, navigate]);

  if (loading) {
    return <SnookerMarkingLoading />;
  }

  const handleTournamentPlayerCreation = async (data: AddTournamentTeamPlayerFormData) => {
    const res = await addTournamentTeamPlayer({
      phone: data.phone,
      name: data.name,
      teamId: data.teamId,
      tournamentId: tournamentId!,
    });

    if (res === true) {
      toast({
        title: 'Success',
        description: 'Player Added',
        variant: 'default',
      });
    }

    // navigate(0);
  };

  return (
    <div className="h-screen w-screen p-4">
      <AddTournamentTeamPlayerForm onSubmit={handleTournamentPlayerCreation} teams={teams} />
    </div>
  );
}
