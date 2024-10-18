import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import { StreamContainer } from '@/components/sections/stream/StreamContainer';
import useStreaming from '@/hooks/useStreaming';
import { useEffect, useState } from 'react';

export function ClientStream() {
  const [matchId, setMatchId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const matchIdFromUrl = params.get('matchId');
    
    if (matchIdFromUrl) {
      setMatchId(matchIdFromUrl);
    }
    
    setLoading(false);
  }, []);

  const { loading: streamingLoading, streamingData } = useStreaming(undefined, matchId ? matchId : undefined);

  if (loading || streamingLoading) {
    return <SnookerMarkingLoading />;
  }

  return (
    <div className="h-screen w-screen">
      <StreamContainer state={streamingData} />
    </div>
  );
}