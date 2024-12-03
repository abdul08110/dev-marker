import { Button } from '@/components/ui/button';
import PauseLogo from '@/icons/Pause';
import PlayLogo from '@/icons/Play';
import MuteLogo from '@/icons/mute';
import VolumeLogo from '@/icons/volume';
import clsx from 'clsx';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface VideoControlsProps {
  isVideoPlaying: boolean;
  isSoundOn: boolean;
  videoDuration: number;
  currentTime: number;
  onSliderChange: (value: number) => void;
  onPlayPauseClick: () => void;
  onMuteUnmuteClick: () => void;
  isStreamLive: boolean;
  isMatchTypeLive: boolean;
}

export function VideoControls(props: VideoControlsProps) {
  return (
    <div className="px-4 w-full flex flex-col gap-2 bg-gradient-to-b from-transparent to-black py-4 absolute bottom-0 left-0 z-50">
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

        <div className='flex'>
          <Button className={clsx('p-1 h-auto text-sm font-bold', {
            'bg-red-500 text-white': props.isStreamLive,
            'bg-red-500/30 text-white': !props.isStreamLive
          })}>
            LIVE
          </Button>
        </div>

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
