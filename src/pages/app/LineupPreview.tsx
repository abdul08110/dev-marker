import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Lineup } from '@/components/sections/stream/Lineup';
import { LineupResponse } from '@/api/app/types/lineup';
import useGetLineup from '@/api/app/useGetLineup';
import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';

const LineupPreview = () => {
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get('tournamentId');
  const phaseId = searchParams.get('phaseId');
  const teamOneId = searchParams.get('teamOneId');
  const teamTwoId = searchParams.get('teamTwoId');

  const { getLineup, loading, error } = useGetLineup();
  const [lineup, setLineup] = useState<LineupResponse | null>(null);

  useEffect(() => {
    if (!tournamentId || !phaseId || !teamOneId || !teamTwoId) return;

    getLineup({ tournamentId, phaseId, teamOneId, teamTwoId }).then(setLineup);
  }, [tournamentId, phaseId, teamOneId, teamTwoId]);

  if (!tournamentId || !phaseId || !teamOneId || !teamTwoId) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white text-xl text-center px-8">
        Missing query params. Usage: /app/lineup?tournamentId=...&phaseId=...&teamOneId=...&teamTwoId=...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white text-xl">
        Failed to load lineup: {error}
      </div>
    );
  }

  if (loading || !lineup) {
    return <SnookerMarkingLoading />;
  }

  return <Lineup data={lineup} />;
};

export default LineupPreview;
