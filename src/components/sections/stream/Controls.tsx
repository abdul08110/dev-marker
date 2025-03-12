import { Button } from '@/components/ui/button';
import PauseLogo from '@/icons/Pause';
import PlayLogo from '@/icons/Play';
import MuteLogo from '@/icons/mute';
import VolumeLogo from '@/icons/volume';
import clsx from 'clsx';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useEffect } from 'react';

interface VideoControlsProps {
  isVideoPlaying: boolean;
  isSoundOn: boolean;
  videoDuration: number;
  currentTime: number;
  onSliderChange: (value: number) => void;
  onPlayPauseClick: () => void;
  onMuteUnmuteClick: () => void;
  onLiveClick: () => void;
  isStreamLive: boolean;
  isMatchTypeLive: boolean;
  onInactive: () => void;
}

export function VideoControls(props: VideoControlsProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      props.onInactive();
    }, 6000);

    const resetTimer = () => {
      clearTimeout(timer);
      const newTimer = setTimeout(() => {
        props.onInactive();
      }, 6000);
      return newTimer;
    };

    const controlsElement = document.querySelector('.video-controls');
    if (controlsElement) {
      controlsElement.addEventListener('mousemove', resetTimer);
      controlsElement.addEventListener('click', resetTimer);
    }

    return () => {
      clearTimeout(timer);
      if (controlsElement) {
        controlsElement.removeEventListener('mousemove', resetTimer);
        controlsElement.removeEventListener('click', resetTimer);
      }
    };
  }, []);

  const formatTime = (timeInMilliseconds: number): string => {
    const seconds = Math.floor(timeInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="px-4 w-full flex flex-col gap-2 bg-gradient-to-b from-transparent to-black py-4 absolute bottom-0 left-0 z-50 video-controls">
      <div className="flex w-full items-center gap-4">
        <div onClick={props.onPlayPauseClick} className="p-2 cursor-pointer">
          {props.isVideoPlaying ? (
            <PauseLogo className="h-4 w-4 text-white" />
          ) : (
            <PlayLogo className="h-4 w-4 text-white" />
          )}
        </div>

        <div className="flex-grow">
          <Slider
            className="purple-slider"
            max={props.videoDuration}
            onChange={(value) => props.onSliderChange(value as number)}
            value={props.currentTime}
          />
        </div>

        {!props.isMatchTypeLive && (
          <div className="text-white text-sm">
            {formatTime(props.currentTime)} / {formatTime(props.videoDuration)}
          </div>
        )}

        {props.isMatchTypeLive && (
          <div className="flex">
            <Button
              onClick={props.onLiveClick}
              className={clsx('p-1 h-auto text-sm font-bold', {
                'bg-red-500 text-white': props.isStreamLive,
                'bg-red-500/30 text-white': !props.isStreamLive,
              })}
            >
              LIVE
            </Button>
          </div>
        )}

        <div className="flex gap-4">
          <div onClick={props.onMuteUnmuteClick} className="p-2 cursor-pointer">
            {props.isSoundOn ? (
              <VolumeLogo className="h-4 w-4 text-white" />
            ) : (
              <MuteLogo className="h-4 w-4 text-white" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
