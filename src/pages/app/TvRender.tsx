import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import { StreamContainer } from '@/components/sections/stream/StreamContainer';
import useStreaming from '@/hooks/useStreaming';
import { useSearchParams } from 'react-router-dom';

export function TvRender() {
  const [searchParams] = useSearchParams();
  const searchParamsVenueId = searchParams.get('venueId');

  const {
    loading: streamingLoading,
    viewershipData,
    timeLeft,
    onVideoEnd,
    currentTime,
    updateTime,
    sponsorshipVideoUrl,
  } = useStreaming(searchParamsVenueId || undefined);

  if (streamingLoading) {
    return <SnookerMarkingLoading />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <StreamContainer
        sponsorshipVideoUrl={sponsorshipVideoUrl ?? undefined}
        updateTimer={updateTime}
        stopWatchTime={currentTime}
        onVideoEnd={onVideoEnd}
        timeLeft={timeLeft}
        state={viewershipData}
        isPortrait={false}
        showBottomScrubber={false}
        isTv={true}
      />
    </div>
  );
}
