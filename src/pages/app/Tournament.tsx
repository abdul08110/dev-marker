import { TournamentConfigurationForm } from '@/components/forms/app/configureTournament';
import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import useTournament from '@/hooks/useTournament';

export function Tournament() {
  const { loading, teams, handleMatchCreation } = useTournament();

  if (loading) {
    return <SnookerMarkingLoading />;
  }

  return (
    <div className="h-screen w-screen p-4">
      <TournamentConfigurationForm onSubmit={handleMatchCreation} teams={teams} />
    </div>
  );
}
