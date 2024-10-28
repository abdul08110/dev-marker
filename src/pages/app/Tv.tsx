import useMarkerClubs from '@/api/home/useMarkerClubs';
import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import { StreamContainer } from '@/components/sections/stream/StreamContainer';
import useStreaming from '@/hooks/useStreaming';
import { useEffect, useState } from 'react';

export function Tv() {
  const { getMarkerClubs } = useMarkerClubs('TV');
  const [venueId, setVenueId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getMarkerClubs();
      if (result) {
        setVenueId(result[0].venue.id);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const {
    loading: streamingLoading,
    streamingData,
    timeLeft,
    onVideoStart,
    onVideoPause,
    onVideoEnd
  } = useStreaming(venueId || undefined);

  if (loading || streamingLoading) {
    return <SnookerMarkingLoading />;
  }

  return (
    <div className="h-screen w-screen">
      <StreamContainer
        onVideoEnd={onVideoEnd}
        onVideoPause={onVideoPause}
        onVideoStart={onVideoStart}
        timeLeft={timeLeft}
        state={streamingData}
        isPortrait={false}
      />
    </div>
  );
}
