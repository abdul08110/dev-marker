import { getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import { StreamingState } from '@/hooks/useStreaming';
import { StreamType } from '@/api/app/useGetMatchData';
import YouTube from 'react-youtube';
import { useEffect, useRef, useState } from 'react';
// import { EnableAudioModal } from '@/components/modals/enableAudoModal';
import { isWithinFiveSecondsRange } from '@/utils/functions';
import clsx from 'clsx';

interface StreamContainerProps {
  state: StreamingState | null;
  isPortrait: boolean;
  timeLeft: number;
  onVideoStart: () => void;
  onVideoPause: () => void;
  onVideoEnd: () => void;
  stopWatchTime: number;
  onVideoGoToLive: () => void;
}

export function StreamContainer(props: StreamContainerProps) {
  // const [audioAllowed, setAudioAllowed] = useState<boolean | null>(null);
  // const [showAudioPrompt, setShowAudioPrompt] = useState(false);
  const activeSet = getActiveSet(props.state ? props.state.sets : []);
  const activeTurn = getActiveTurn(activeSet);
  const youTubePlayerRef = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  // const handleAudioPermission = () => {
  //   setAudioAllowed(true);
  //   setShowAudioPrompt(false);

  //   if (youTubePlayerRef.current) {
  //     youTubePlayerRef.current.unMute();
  //     youTubePlayerRef.current.playVideo();
  //   }
  // };

  const handleGoLive = () => {
    if (youTubePlayerRef.current && props.state) {
      const actualStartTime = new Date(props.state.actualStartTimeDate).getTime();
      const currentTime = Date.now();
      const elapsedSeconds = Math.floor((currentTime - actualStartTime) / 1000);

      youTubePlayerRef.current.seekTo(elapsedSeconds, true);
      props.onVideoGoToLive();
    }
  };

  // const handleAudioPermissionCloseModal = () => {
  //   setShowAudioPrompt(false);

  //   if (youTubePlayerRef.current) {
  //     youTubePlayerRef.current.mute();
  //     youTubePlayerRef.current.playVideo();
  //   }
  // };

  const handleYouTubeReady = (event: any) => {
    youTubePlayerRef.current = event.target;

    event.target.mute();
    event.target.playVideo();

    // if (audioAllowed === null) {
    //   setShowAudioPrompt(true);
    //   return;
    // } else if (audioAllowed === true) {
    //   event.target.unMute();
    //   event.target.playVideo();
    // } else if (audioAllowed === false) {
    //   event.target.mute();
    //   event.target.playVideo();
    // }
  };

  return (
    <div className="h-full w-full flex justify-center items-center">
      {/* <EnableAudioModal
        isModalOpen={showAudioPrompt}
        closeModal={handleAudioPermissionCloseModal}
        confirmModal={handleAudioPermission}
      /> */}
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
                onPlay={props.onVideoStart}
                onPause={props.onVideoPause}
                onEnd={props.onVideoEnd}
                onStateChange={(e) => {
                  console.log(e);
                }}
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
                  <img src="/images/clublogo.png" className="lg:h-14 lg:w-14 h-8 w-8 rounded-full overflow-hidden" />
                  {props.state.matchStatus === 'LIVE' ? (
                    <div
                      onClick={handleGoLive}
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
                      <span className="font-bold text-xs">LIVE</span>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>

                <div className="flex flex-col gap-2 items-center h-fit">
                  <img src={props.state.clubLogo!} className="lg:h-14 lg:w-14 h-8 w-8 " />
                  <small className="text-white font-medium lg:text-xl text-base">T-{props.state.venueNo}</small>
                </div>
              </div>
              {props.state.overlayType === 'DESTINATION' && !props.isPortrait && (
                <div className="absolute bottom-0 flex flex-col items-center w-full">
                  <div className="w-full h-[12%] bg-transparent flex justify-center mb-1">
                    <div className="flex p-1 w-full gap-1 h-full justify-center">
                      <div>
                        <img
                          className="lg:h-14 lg:w-14 h-8 w-8 aspect-square object-cover rounded-full"
                          src={
                            props.state.sideOnePlayerOne.profilePhoto
                              ? props.state.sideOnePlayerOne.profilePhoto
                              : '/images/user-dummy-pic.png'
                          }
                        />
                      </div>

                      <div className="flex-grow relative flex items-center">
                        <div className="lg:h-14 h-6 grid grid-cols-12 justify-center bg-primary border border-white w-full rounded-md items-center px-2">
                          <div className="col-span-5 flex gap-2">
                            <small className="text-white lg:text-xl text-[0.5rem] whitespace-nowrap uppercase font-bold">
                              {props.state.sideOnePlayerOne.name}
                            </small>

                            {props.state.activePlayerId === props.state.sideOnePlayerOne.id ||
                            props.state.activePlayerId === props.state.sideOnePlayerTwo?.id ? (
                              <>
                                <h5 className="lg:text-xl text-[0.5rem] text-yellow-500 font-bold text-right uppercase ml-auto whitespace-nowrap">
                                  Break {activeTurn ? activeTurn?.score : 0}
                                </h5>
                              </>
                            ) : (
                              <></>
                            )}
                          </div>

                          <div className="col-span-2 text-center flex justify-center">
                            <span className="lg:text-xl text-[0.5rem] text-white">
                              <span className="font-bold">{activeSet ? activeSet?.teamOneScore : 0}</span>
                              &nbsp;&nbsp;&nbsp;
                              {props.state.teamOneScore}&nbsp;(
                              {props.state.noOfFrames ? props.state.noOfFrames : props.state.sets.length})&nbsp;
                              {props.state.teamTwoScore}&nbsp;&nbsp;&nbsp;
                              <span className="font-bold">{activeSet ? activeSet?.teamTwoScore : 0}</span>
                            </span>
                          </div>

                          <div className="col-span-5 text-right flex gap-2 justify-end">
                            {props.state.activePlayerId === props.state.sideTwoPlayerOne.id ||
                            props.state.activePlayerId === props.state.sideTwoPlayerTwo?.id ? (
                              <>
                                <h5 className="lg:text-xl text-[0.5rem] text-yellow-500 font-bold text-left uppercase mr-auto whitespace-nowrap">
                                  Break {activeTurn ? activeTurn?.score : 0}
                                </h5>
                              </>
                            ) : (
                              <></>
                            )}

                            <small className="text-white lg:text-xl text-[0.5rem] whitespace-nowrap uppercase font-bold">
                              {props.state.sideTwoPlayerOne.name}
                            </small>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <img
                          className="lg:h-14 lg:w-14 h-8 w-8 aspect-square object-cover rounded-full"
                          src={
                            props.state.sideTwoPlayerOne.profilePhoto
                              ? props.state.sideTwoPlayerOne.profilePhoto
                              : '/images/user-dummy-pic.png'
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* <div className="absolute -bottom-3  w-full h-auto">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleScrubberChange}
                  className="w-full h-2"
                />
              </div> */}
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
