import { getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import { StreamingState } from '@/hooks/useStreaming';
import { StreamType } from '@/api/app/useGetMatchData';
import YouTube, { YouTubeEvent } from 'react-youtube';
import { useEffect, useRef, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

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
  const youTubePlayerRef = useRef<any>(null);
  const intervalRef = useRef<number | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);

  const clearExistingInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleYouTubeReady = (event: any) => {
    youTubePlayerRef.current = event.target;
    setVideoDuration(event.target.getDuration() * 1000);

    event.target.mute();
    event.target.playVideo();
  };

  const handleYoutubeStateChange = async (event: YouTubeEvent<number>) => {
    if (event.data === 1) {
      clearExistingInterval();
      intervalRef.current = window.setInterval(() => {
        if (youTubePlayerRef.current) {
          props.updateTimer(youTubePlayerRef.current.getCurrentTime() * 1000);
        }
      }, 1000);
    } else {
      clearExistingInterval();
    }
  };

  useEffect(() => {
    const durationUpdateInterval = setInterval(() => {
      if (youTubePlayerRef.current) {
        setVideoDuration(youTubePlayerRef.current.getDuration() * 1000);
      }
    }, 2000);

    return () => {
      clearInterval(durationUpdateInterval); // Clear on unmount
      clearInterval(intervalRef.current as number); // Clear main timer on unmount
    };
  }, []);

  return (
    <div className="h-full w-full flex justify-center items-center">
      {props.state ? (
        <div className="relative flex justify-center items-center w-full h-full">
          {props.state.streamType === StreamType.CLOUD_PROVIDER &&
          props.state.streamData !== null &&
          props.state.streamData !== undefined &&
          props.state.streamData.provider &&
          props.state.streamData.provider === 'YOUTUBE' ? (
            <div
              className="relative w-full h-full max-w-full max-h-full overflow-hidden"
              style={{
                width: '100%',
                height: 'auto',
                aspectRatio: '16 / 9',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <YouTube
                videoId={props.state.streamData.brodcastId!}
                id={props.state.streamData.brodcastId!}
                onReady={handleYouTubeReady}
                onEnd={props.onVideoEnd}
                onStateChange={handleYoutubeStateChange}
                className="object-contain w-full h-full"
                opts={{
                  height: '100%',
                  width: '100%',
                  playerVars: {
                    autoplay: 1,
                    controls: 0,
                    rel: 0,
                    fs: 0,
                    modestbranding: 1,
                  },
                }}
              />
              {/* Overlay Content */}

              <div className="absolute inset-0 w-full flex justify-between lg:p-4 p-2 h-fit">
                <div className="flex flex-col gap-2 items-center h-fit">
                  <img
                    src="/images/clublogo.png"
                    className="lg:h-14 xl:h-24 xl:w-24 lg:w-14 h-8 w-8 rounded-full overflow-hidden"
                  />
                  {/* {props.state.matchStatus === 'LIVE' ? (
                    <div
                      // onClick={handleGoLive}
                      className={clsx('flex justify-center items-center cursor-pointer', {
                        'bg-red-500 text-white p-1': isWithinFiveSecondsRange(
                          new Date(props.state.actualStartTimeDate).toISOString(),
                          props.stopWatchTime,
                          currentTime,
                        ),
                        'bg-gray-500 text-base p-1': !isWithinFiveSecondsRange(
                          new Date(props.state.actualStartTimeDate).toISOString(),
                          props.stopWatchTime,
                          currentTime,
                        ),
                      })}
                    >
                      <span className="font-bold text-xs xl:text-xl">LIVE</span>
                    </div>
                  ) : (
                    <></>
                  )} */}
                </div>

                <div className="flex flex-col gap-2 items-center h-fit">
                  <img src={props.state.clubLogo!} className="lg:h-14 xl:h-24 xl:w-24 lg:w-14 h-8 w-8 " />
                  <small className="text-white font-medium lg:text-xl text-base xl:text-xl">
                    T-{props.state.venueNo}
                  </small>
                  <img src={props.state.tournamentLogo!} className="lg:h-14 lg:w-auto h-8 w-auto" />
                </div>
              </div>
              {props.state.overlayType === 'DESTINATION' && !props.isPortrait && (
                <div className="absolute bottom-0 flex flex-col items-center w-full">
                  <div className="w-full h-auto bg-transparent flex justify-center">
                    <div className="flex px-1 w-full gap-1 h-full justify-center">
                      <div>
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
                        <div className="grid grid-cols-12 justify-center bg-primary border border-white w-full rounded-md items-center px-2">
                          <div className="col-span-5 flex gap-2 items-center">
                            <small className="text-white xl:text-3xl lg:text-xl text-base whitespace-nowrap uppercase font-bold">
                              {props.state.sideOnePlayerOne.name} + {props.state.teamOneHandicap} (
                              {props.state.tournamentTeamOneabb})
                            </small>

                            {props.state.activePlayerId === props.state.sideOnePlayerOne.id ||
                            props.state.activePlayerId === props.state.sideOnePlayerTwo?.id ? (
                              <h5 className="text-xl text-yellow-500 font-bold text-right uppercase ml-auto whitespace-nowrap">
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
                              {props.state.tournamentTeamOneScore}&nbsp;(3)&nbsp;
                              {props.state.tournamentTeamTwoScore ? props.state.tournamentTeamTwoScore : 0}
                              &nbsp;&nbsp;&nbsp;
                              <span className="font-bold">{activeSet ? activeSet?.teamTwoScore : 0}</span>
                            </span>
                          </div>

                          <div className="col-span-5 text-right flex gap-2 justify-end items-center">
                            {props.state.activePlayerId === props.state.sideTwoPlayerOne.id ||
                            props.state.activePlayerId === props.state.sideTwoPlayerTwo?.id ? (
                              <h5 className="xl:text-3xl lg:text-xl text-base text-yellow-500 font-bold text-left uppercase mr-auto whitespace-nowrap">
                                Break {activeTurn ? activeTurn?.score : 0}
                              </h5>
                            ) : (
                              <></>
                            )}

                            <small className="text-white xl:text-3xl lg:text-xl text-base whitespace-nowrap uppercase font-bold">
                              ({props.state.tournamentTeamTwoabb}) {props.state.teamTwoHandicap} +{' '}
                              {props.state.sideTwoPlayerOne.name}
                            </small>
                          </div>
                        </div>

                        <div className="bg-black w-fit">
                          <h5 className="xl:text-xl lg:text-base text-base text-white px-4 py-1 font-medium">
                            {props.state.sportType === 'SNOOKER_10_RED'
                              ? '10 REDS SINGLE FRAME'
                              : props.state.sportType === 'SNOOKER_15_RED'
                                ? '15 REDS SINGLE FRAME'
                                : '6 REDS CUMULATIVE'}
                          </h5>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <div>
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
                  <div className="px-4  w-full h-auto">
                    {props.showBottomScrubber ? (
                      <Slider
                        className="purple-slider"
                        max={videoDuration}
                        onChange={(value) => {
                          if (youTubePlayerRef.current) {
                            youTubePlayerRef.current.seekTo((value as number) / 1000);
                          }
                          props.updateTimer(value as number);
                        }}
                        value={props.stopWatchTime}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <video
          autoPlay
          loop
          muted
          src="https://flick-automations.s3.ap-south-1.amazonaws.com/images/chowhan_ventures.mp4"
          className="w-full h-auto"
        />
      )}
    </div>
  );
}
