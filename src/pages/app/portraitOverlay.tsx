import { PortraitData } from '@/components/sections/stream/PortraitData';
import { PortraitView } from '@/components/sections/stream/PortraitView';
import useStreaming from '@/hooks/useStreaming';
import { useEffect, useState } from 'react';

export function PortraitOverlay() {
  const [matchId, setMatchId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const matchIdFromUrl = params.get('matchId');

    if (matchIdFromUrl) {
      setMatchId(matchIdFromUrl);
    }
  }, []);

  const {
    loading: streamingLoading,
    timeLeft,
    viewershipData,
    updateTime,
    streamingData,
  } = useStreaming(undefined, matchId ? matchId : undefined);

  useEffect(() => {
    const body = document.body;

    body.style.setProperty('background-color', 'transparent', 'important');
    body.style.setProperty('pointer-events', 'none', 'important');
    body.style.setProperty('place-items', 'start', 'important');

    return () => {
      body.style.removeProperty('background-color');
      body.style.removeProperty('pointer-events');
    };
  }, []);

  useEffect(() => {
    (window as any).onTimerUpdate = (timeInMilliseconds: number) => {
      updateTime(timeInMilliseconds);
    };

    return () => {
      delete (window as any).onTimerUpdate;
    };
  }, [updateTime]);

  if (streamingLoading || viewershipData === null || streamingData === null) {
    return <></>;
  }

  return <PortraitView timeLeft={timeLeft} state={viewershipData} />;
  }
