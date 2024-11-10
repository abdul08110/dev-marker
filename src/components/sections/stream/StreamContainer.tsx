import { getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import { StreamingState } from '@/hooks/useStreaming';
import { useEffect, useRef, useState } from 'react';
import 'rc-slider/assets/index.css';
import '@vidstack/react/player/styles/base.css';
import {
  Controls,
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  MuteButton,
  PlayButton,
  SeekButton,
  TimeSlider,
} from '@vidstack/react';
import {
  MuteIcon,
  PauseIcon,
  PlayIcon,
  SeekBackward10Icon,
  SeekForward10Icon,
  VolumeHighIcon,
  VolumeLowIcon,
} from '@vidstack/react/icons';

interface StreamContainerProps {
  state: StreamingState | null;
  isPortrait: boolean;
  timeLeft: number;
  showBottomScrubber: boolean;
  onVideoEnd: () => void;
  stopWatchTime: number;
  updateTimer: (timeInMillseconds: number) => void;
}

export function StreamContainer(props: StreamContainerProps) {
  const activeSet = getActiveSet(props.state ? props.state.sets : []);
  const activeTurn = getActiveTurn(activeSet);
  const player = useRef<MediaPlayerInstance>(null);
  const [isOverlayEnabled, setIsOverlayEnabled] = useState<boolean>(true);

  const disableOverlay = () => {
    setIsOverlayEnabled(!isOverlayEnabled);
  };

  useEffect(() => {
    return player.current!.subscribe(({ currentTime }) => {
      props.updateTimer(currentTime * 1000);
    });
  }, []);

  const getUrlFromStream = (brodcastId: string, provider: 'YOUTUBE' | 'MUX') => {
    switch (provider) {
      case 'MUX':
        return `https://stream.mux.com/${brodcastId}.m3u8`;
        break;
      case 'YOUTUBE':
        return `https://www.youtube.com/watch?v=${brodcastId}`;
        break;
    }
  };

  return (
    <MediaPlayer
      ref={player}
      src={
        props.state && props.state.streamData
          ? getUrlFromStream(props.state.streamData.brodcastId!, props.state.streamData.provider!)
          : ''
      }
      onDoubleClick={(event) => {
        event.preventDefault();
      }}
      onClick={disableOverlay}
      onEnded={() => props.onVideoEnd()}
      viewType={'video'}
      streamType={'on-demand'}
      autoplay
      muted
      crossOrigin
      className="relative w-full h-full max-w-full max-h-full overflow-hidden"
    >
      <MediaProvider
        iframeProps={{
          style: { pointerEvents: 'none' },
        }}
      />

      {!isOverlayEnabled ? (
        <Controls.Root onClick={(event) => event.stopPropagation()} className="flex absolute w-full h-full p-2">
          <Controls.Group className="vds-controls-group mt-auto flex gap-1 w-full items-center p-2">
            <PlayButton className="bg-black p-0 vds-button h-8 w-8 rounded-md text-center">
              <PlayIcon className="text-white play-icon h-5 w-5 ml-auto mr-auto" />
              <PauseIcon className="text-white pause-icon h-5 w-5 ml-auto mr-auto" />
            </PlayButton>
            <SeekButton className="bg-black p-0 h-8 w-8 rounded-md text-center" seconds={-10}>
              <SeekBackward10Icon className="text-white h-5 w-5 ml-auto mr-auto" />
            </SeekButton>
            <SeekButton className="bg-black p-0 h-8 w-8 rounded-md text-center" seconds={10}>
              <SeekForward10Icon className="text-white h-5 w-5 ml-auto mr-auto" />
            </SeekButton>
            <TimeSlider.Root className="flex-grow relative h-2 rounded-full">
              <TimeSlider.Track className="w-full h-full absolute inset-0" />
              <TimeSlider.TrackFill className="w-full h-full absolute inset-0 bg-gray-400 rounded-l-full rounded-r-full" />
              <TimeSlider.Progress className="slider-track-fill h-full absolute bg-white rounded-l-full rounded-r-full" />
              <TimeSlider.Thumb className="slider-thumb absolute top-1/2 -translate-y-1/2 rounded-full bg-white h-3 w-3" />
            </TimeSlider.Root>
            <MuteButton className="bg-black p-0 vds-button h-8 w-8 rounded-md text-center">
              <MuteIcon className="mute-icon text-white h-5 w-5 ml-auto mr-auto" />
              <VolumeLowIcon className="volume-low-icon text-white h-5 w-5 ml-auto mr-auto" />
              <VolumeHighIcon className="volume-high-icon text-white h-5 w-5 ml-auto mr-auto" />
            </MuteButton>
            {props.state?.matchStatus === 'LIVE' ? (
              <button className="bg-red-600 h-6 text-xs p-2 text-white flex justify-center items-center rounded-md">
                <span className="font-bold p-0">LIVE</span>
              </button>
            ) : (
              <></>
            )}
          </Controls.Group>
        </Controls.Root>
      ) : (
        <></>
      )}

      {isOverlayEnabled && props.state && props.state.overlayType === 'DESTINATION' && !props.isPortrait ? (
        <div className="absolute inset-0 w-full h-full flex flex-col">
          <div className="flex justify-between lg:p-4 p-2 h-fit">
            <div className="flex flex-col gap-2 items-center h-fit">
              <img
                src="/images/clublogo.png"
                className="lg:h-14 xl:h-24 xl:w-24 lg:w-14 h-8 w-8 rounded-full overflow-hidden"
              />
            </div>

            <div className="flex flex-col gap-2 items-center h-fit">
              <img src={props.state.clubLogo!} className="lg:h-14 xl:h-24 xl:w-24 lg:w-14 h-8 w-8 " />
              <small className="text-white font-medium lg:text-xl text-base xl:text-xl">T-{props.state.venueNo}</small>
              <img src={props.state.tournamentLogo!} className="lg:h-14 lg:w-auto h-8 w-auto" />
            </div>
          </div>
          <div className="mt-auto  h-auto bg-transparent flex justify-center w-full">
            <div className="flex px-1 w-full gap-1 h-full justify-center">
              <div className="flex items-end">
                {props.state.tournamentLogo ? (
                  <img
                    className="lg:h-14 lg:w-14 xl:h-24 xl:w-24 h-8 w-8 aspect-square object-cover rounded-full"
                    src={props.state.teamOneLogo ? props.state.teamOneLogo : '/images/user-dummy-pic.png'}
                  />
                ) : (
                  <></>
                )}
                {props.state.tournamentLogo === null ? (
                  <img
                    className="lg:h-14 lg:w-14 xl:h-24 xl:w-24 h-8 w-8 aspect-square object-cover rounded-full"
                    src={
                      props.state.sideOnePlayerOne.profilePhoto
                        ? props.state.sideOnePlayerOne.profilePhoto
                        : '/images/user-dummy-pic.png'
                    }
                  />
                ) : (
                  <></>
                )}
              </div>

              <div className="flex-grow relative flex flex-col justify-center items-center">
                <div className="flex flex-col justify-center items-center w-full">
                  <div className="w-fit">
                    <h5 className="xl:text-xl lg:text-base text-base text-white font-bold">
                      {props.state.sportType === 'SNOOKER_10_RED'
                        ? '10 REDS SINGLE FRAME'
                        : props.state.sportType === 'SNOOKER_15_RED'
                          ? '15 REDS SINGLE FRAME'
                          : '6 REDS CUMULATIVE'}
                    </h5>
                  </div>

                  <div className="grid grid-cols-12 justify-center bg-primary border border-white w-full rounded-md items-center px-2">
                    <div className="col-span-5 flex gap-2 items-center">
                      <small className="text-white xl:text-3xl lg:text-xl text-base whitespace-nowrap uppercase font-bold">
                        {props.state.sideOnePlayerOne.name} + {props.state.teamOneHandicap} (
                        {props.state.tournamentTeamOneabb})
                      </small>

                      {props.state.activePlayerId === props.state.sideOnePlayerOne.id ||
                      props.state.activePlayerId === props.state.sideOnePlayerTwo?.id ? (
                        <h5 className="xl:text-xl lg:text-md text-xs text-yellow-500 font-bold text-right uppercase ml-auto whitespace-nowrap">
                          Break {activeTurn ? activeTurn?.score : 0}
                        </h5>
                      ) : (
                        <></>
                      )}
                    </div>

                    <div className="col-span-2 text-center flex justify-center">
                      <span className="xl:text-3xl lg:text-xl text-base text-white">
                        <span className="font-bold">{activeSet ? activeSet?.teamOneScore : 0}</span>
                        &nbsp;&nbsp;&nbsp;
                        {props.state.tournamentTeamOneScore ? props.state.tournamentTeamOneScore : 0}
                        &nbsp;(3)&nbsp;
                        {props.state.tournamentTeamTwoScore ? props.state.tournamentTeamTwoScore : 0}
                        &nbsp;&nbsp;&nbsp;
                        <span className="font-bold">{activeSet ? activeSet?.teamTwoScore : 0}</span>
                      </span>
                    </div>

                    <div className="col-span-5 text-right flex gap-2 justify-end items-center">
                      {props.state.activePlayerId === props.state.sideTwoPlayerOne.id ||
                      props.state.activePlayerId === props.state.sideTwoPlayerTwo?.id ? (
                        <h5 className="xl:text-xl lg:text-md text-xs text-yellow-500 font-bold text-left uppercase mr-auto whitespace-nowrap">
                          Break {activeTurn ? activeTurn?.score : 0}
                        </h5>
                      ) : (
                        <></>
                      )}

                      <small className="text-white xl:text-3xl lg:text-xl text-base whitespace-nowrap uppercase font-bold">
                        ({props.state.tournamentTeamTwoabb}) + {props.state.teamTwoHandicap}{' '}
                        {props.state.sideTwoPlayerOne.name}
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="flex items-end">
                  {props.state.tournamentLogo ? (
                    <img
                      className="lg:h-14 lg:w-14 xl:h-24 xl:w-24 h-8 w-8 aspect-square object-cover rounded-full"
                      src={props.state.teamTwoLogo ? props.state.teamTwoLogo : '/images/user-dummy-pic.png'}
                    />
                  ) : (
                    <></>
                  )}
                  {props.state.tournamentLogo === null ? (
                    <img
                      className="lg:h-14 lg:w-14 xl:h-24 xl:w-24 h-8 w-8 aspect-square object-cover rounded-full"
                      src={
                        props.state.sideTwoPlayerOne.profilePhoto
                          ? props.state.sideTwoPlayerOne.profilePhoto
                          : '/images/user-dummy-pic.png'
                      }
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </MediaPlayer>
  );
}
