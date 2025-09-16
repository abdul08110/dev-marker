import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import { PortraitView } from '@/components/sections/stream/PortraitView';
import { StreamContainer } from '@/components/sections/stream/StreamContainer';
import useDeviceOrientation from '@/hooks/useDeviceOrientation';
import useStreaming from '@/hooks/useStreaming';
import clsx from 'clsx';
import { useEffect, useState } from 'react';


export function ClientStream() {
  const [matchId, setMatchId] = useState<string | null>(null);
  const [startFromSeconds, setStartFromSeconds] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const isPortrait = useDeviceOrientation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const matchIdFromUrl = params.get('matchId');
    const startFromSecondsFromUrl = params.get('startMatchFromInSeconds');

    if (matchIdFromUrl) {
      setMatchId(matchIdFromUrl);
    }

    if (startFromSecondsFromUrl) {
      setStartFromSeconds(parseInt(startFromSecondsFromUrl));
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
    <div className="h-screen w-screen flex flex-col relative">
      <div className={clsx('w-full h-full flex flex-col')}>
        <StreamContainer
          updateTimer={updateTime}
          stopWatchTime={currentTime}
          showBottomScrubber={viewershipData !== null && viewershipData.matchStatus === 'COMPLETED'}
          onVideoEnd={onVideoEnd}
          timeLeft={timeLeft}
          isPortrait={isPortrait}
          isTv={false}
          state={viewershipData}
          startFromSeconds={startFromSeconds}
        />
        {isPortrait && streamingData && streamingData?.sets && streamingData?.sets.length > 0 && (
          <PortraitView timeLeft={timeLeft} state={viewershipData} />
        )}
      </div>
    </div>
  );
}
