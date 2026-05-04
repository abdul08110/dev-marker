import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { StreamingState } from '@/hooks/useStreaming';

interface HlsStreamContainerProps {
  hlsUrl: string;
  state: StreamingState | null;
  sponsorshipVideoUrl?: string;
  onVideoEnd: () => void;
  timeLeft: number;
  stopWatchTime: number;
  updateTimer: (timeInMillseconds: number) => void;
}

export function HlsStreamContainer(props: HlsStreamContainerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !props.hlsUrl) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 6,
      });
      hlsRef.current = hls;
      hls.loadSource(props.hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(console.error);
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = props.hlsUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(console.error);
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [props.hlsUrl]);

  // Timer update for live stream
  useEffect(() => {
    if (props.state && props.state.matchStatus === 'LIVE') {
      timerIntervalRef.current = window.setInterval(() => {
        if (props.state?.actualStartTimeDate) {
          const elapsed = Date.now() - new Date(props.state.actualStartTimeDate).getTime();
          props.updateTimer(elapsed);
        }
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
      }
    };
  }, [props.state?.matchStatus, props.state?.actualStartTimeDate]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, []);

  return (
    <div className="w-full h-screen max-h-screen flex justify-center items-center">
      {props.state ? (
        <div className="relative w-full h-full flex justify-center items-center">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-contain"
            style={{ aspectRatio: '16 / 9' }}
          />
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-white text-lg">Connecting to stream...</div>
            </div>
          )}
        </div>
      ) : (
        <video
          autoPlay
          loop
          muted
          playsInline
          src={
            props.sponsorshipVideoUrl ??
            'https://clubliv.blr1.cdn.digitaloceanspaces.com/SponsorVideos/ECA%20Raman%20Nair%202024%20Gina%20Artize.mp4'
          }
          className="w-full h-auto"
        />
      )}
    </div>
  );
}
