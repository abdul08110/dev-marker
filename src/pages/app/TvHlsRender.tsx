import { useEffect, useState } from 'react';
import { SnookerMarkingLoading } from '@/components/loading/snookerMarkingLoading';
import { HlsStreamContainer } from '@/components/sections/stream/HlsStreamContainer';
import useStreaming from '@/hooks/useStreaming';
import useGetClubController from '@/api/app/useGetClubController';
import { useSearchParams } from 'react-router-dom';

export function TvHlsRender() {
  const [searchParams] = useSearchParams();
  const venueId = searchParams.get('venueId');

  const {
    loading: streamingLoading,
    viewershipData,
    timeLeft,
    onVideoEnd,
    currentTime,
    updateTime,
    sponsorshipVideoUrl,
    lineupData,
    showLineup,
  } = useStreaming(venueId || undefined);

  const clubControllerHook = useGetClubController();
  const [hlsUrl, setHlsUrl] = useState<string | null>(null);

  // Fetch club controller data
  useEffect(() => {
    if (venueId) {
      clubControllerHook.getClubController(venueId).then((res) => {
        if (res) {
          console.log(res);
          // Find primary channel
          const primaryChannel = res.channels.find((ch) => ch.isPrimary);

          console.log(primaryChannel);
          if (primaryChannel) {
            const url = `http://${res.clubController.localIp}:8888/output/${primaryChannel.channelId}/index.m3u8`;
            setHlsUrl(url);
          }
        }
      });
    }
  }, [venueId]);

  // Wake Lock API to prevent screen from sleeping
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen');
        }
      } catch (err) {
        console.error('Wake Lock error:', err);
      }
    };

    requestWakeLock();

    // Re-acquire wake lock on visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, []);

  if (streamingLoading || clubControllerHook.loading) {
    return <SnookerMarkingLoading />;
  }

  if (!hlsUrl) {
    return <SnookerMarkingLoading />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <HlsStreamContainer
        hlsUrl={hlsUrl}
        sponsorshipVideoUrl={sponsorshipVideoUrl ?? undefined}
        updateTimer={updateTime}
        stopWatchTime={currentTime}
        onVideoEnd={onVideoEnd}
        timeLeft={timeLeft}
        state={viewershipData}
        lineupData={lineupData}
        showLineup={showLineup}
      />
    </div>
  );
}
