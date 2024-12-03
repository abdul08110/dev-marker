import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import { PortraitData } from '@/components/sections/stream/PortraitData';
import { StreamContainer } from '@/components/sections/stream/StreamContainer';
import useDeviceOrientation from '@/hooks/useDeviceOrientation';
import useStreaming from '@/hooks/useStreaming';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export function ClientStream() {
  const [matchId, setMatchId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isPortrait = useDeviceOrientation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const matchIdFromUrl = params.get('matchId');

    if (matchIdFromUrl) {
      setMatchId(matchIdFromUrl);
    }

    setLoading(false);
  }, []);

  const {
    loading: streamingLoading,
    timeLeft,
    viewershipData,
    onVideoEnd,
    updateTime,
    currentTime,
    streamingData,
  } = useStreaming(undefined, matchId ? matchId : undefined);

  if (loading || streamingLoading) {
    return <SnookerMarkingLoading />;
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <div
        className={clsx('w-full', {
          'h-auto': isPortrait,
          'h-full': !isPortrait,
        })}
      >
        <StreamContainer
          updateTimer={updateTime}
          stopWatchTime={currentTime}
          showBottomScrubber={viewershipData !== null && viewershipData.matchStatus === 'COMPLETED'}
          onVideoEnd={onVideoEnd}
          timeLeft={timeLeft}
          isPortrait={isPortrait}
          state={
            streamingData && streamingData.overlayType === 'SOURCE_WITH_FINAL_SCORES' ? streamingData : viewershipData
          }
        />
        {isPortrait && <PortraitData state={streamingData} />}
      </div>
    </div>
  );
}
