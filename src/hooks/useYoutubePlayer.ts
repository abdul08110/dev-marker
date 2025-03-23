import { getDurationInMilliseconds } from '@/utils/functions';
import { useRef, useState, useEffect } from 'react';

interface UseYouTubePlayerProps {
  onTimerUpdate: (timeInMilliseconds: number) => void;
  isMatchLive: boolean;
  matchStartTime: string | null;
  onLoadingStateChange?: (isLoading: boolean) => void;
}

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  goLive: () => void;
}

export function useYouTubePlayer({
  onTimerUpdate,
  isMatchLive,
  matchStartTime,
  onLoadingStateChange,
}: UseYouTubePlayerProps) {
  const youTubePlayerRef = useRef<YouTubePlayer | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [isSoundOn, setIsSoundOn] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const switchTimeStampRef = useRef<number>(0);

  const handleYouTubeReady = (event: any) => {
    youTubePlayerRef.current = event.target;
    setVideoDuration(event.target.getDuration() * 1000);
    event.target.mute();
    event.target.playVideo();
    
    setIsVideoPlaying(true);
    onLoadingStateChange?.(false);
  };

  const handleYouTubeStateChange = (event: { data: number }) => {
    // YouTube Player States:
    // -1 (unstarted)
    // 0 (ended)
    // 1 (playing)
    // 2 (paused)
    // 3 (buffering)
    // 5 (video cued)
    if (event.data === 1) {
      // Video is playing
      setIsVideoPlaying(true);
      console.log('video has starting playing');
      
      // Handle seeking if needed when player is ready and playing
      if (switchTimeStampRef.current > 0 && youTubePlayerRef.current) {
        const seekToTime = switchTimeStampRef.current / 1000;
        youTubePlayerRef.current.seekTo(seekToTime, true);
        onTimerUpdate(switchTimeStampRef.current);
        switchTimeStampRef.current = 0;
      }

      // Set up the timer interval
      clearExistingInterval();
      intervalRef.current = window.setInterval(() => {
        if (youTubePlayerRef.current) {
          onTimerUpdate(youTubePlayerRef.current.getCurrentTime() * 1000);
        }
      }, 1000);
    } else if (event.data === 2) {
      // Video is paused
      setIsVideoPlaying(false);
      clearExistingInterval();
    } else {
      // Video ended or other states
      clearExistingInterval();
    }
  };

  const clearExistingInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleMuteUnmute = () => {
    if (youTubePlayerRef.current) {
      if (isSoundOn) {
        youTubePlayerRef.current.mute();
      } else {
        youTubePlayerRef.current.unMute();
      }
    }
    setIsSoundOn((prev) => !prev);
  };

  const handlePlayPause = () => {
    if (youTubePlayerRef.current) {
      if (isVideoPlaying) {
        youTubePlayerRef.current.pauseVideo();
      } else {
        youTubePlayerRef.current.playVideo();
      }
      setIsVideoPlaying((prev) => !prev);
    }
  };

  const handleScrub = (value: number) => {
    if (youTubePlayerRef.current) {
      youTubePlayerRef.current.seekTo(value / 1000, true);
      onTimerUpdate(value);
    }
  };

  const goLive = () => {
    if (youTubePlayerRef.current) {
      youTubePlayerRef.current.seekTo(youTubePlayerRef.current.getDuration(), true);
    }
  };

  useEffect(() => {
    const durationUpdateInterval = window.setInterval(() => {
      if (youTubePlayerRef.current) {
        if (isMatchLive && matchStartTime !== null) {
          const duration = getDurationInMilliseconds(matchStartTime);
          setVideoDuration(duration);
        } else {
          setVideoDuration(youTubePlayerRef.current.getDuration() * 1000);
        }
      }
    }, 2000);

    return () => {
      clearInterval(durationUpdateInterval);
      clearExistingInterval();
    };
  }, []);

  const handleSwitchCamera = (timestamp: number) => {
    switchTimeStampRef.current = timestamp;
    onLoadingStateChange?.(true);
  };

  return {
    youTubePlayerRef,
    videoDuration,
    isSoundOn,
    isVideoPlaying,
    handleYouTubeReady,
    handleYouTubeStateChange,
    handleMuteUnmute,
    handlePlayPause,
    handleScrub,
    goLive,
    handleSwitchCamera,
  };
}
