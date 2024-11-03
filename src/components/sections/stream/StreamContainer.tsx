import { getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import { StreamingState } from '@/hooks/useStreaming';
import { StreamType } from '@/api/app/useGetMatchData';
import YouTube from 'react-youtube';
import { useRef, useState } from 'react';
import { EnableAudioModal } from '@/components/modals/enableAudoModal';

interface StreamContainerProps {
  state: StreamingState | null;
  isPortrait: boolean;
  timeLeft: number;
  onVideoStart: () => void;
  onVideoPause: () => void;
  onVideoEnd: () => void;
}

export function StreamContainer(props: StreamContainerProps) {
  const [audioAllowed, setAudioAllowed] = useState(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(false);
  const activeSet = getActiveSet(props.state ? props.state.sets : []);
  const activeTurn = getActiveTurn(activeSet);
  const youTubePlayerRef = useRef<any>(null);

  const handleAudioPermission = () => {
    setAudioAllowed(true);
    setShowAudioPrompt(false);

    if (youTubePlayerRef.current) {
      youTubePlayerRef.current.unMute();
      youTubePlayerRef.current.playVideo();
    }
  };

  const handleYouTubeReady = (event: any) => {
    youTubePlayerRef.current = event.target;

    if (!audioAllowed) {
      event.target.mute();
      setShowAudioPrompt(true);
    } else {
      event.target.unMute();
      event.target.playVideo();
    }
  };

  return (
    <div className="h-full w-full flex justify-center items-center">
      <EnableAudioModal
        isModalOpen={showAudioPrompt}
        closeModal={() => setShowAudioPrompt(false)}
        confirmModal={handleAudioPermission}
      />
      {props.state ? (
        <div className="relative flex justify-center items-center w-full h-full">
          {props.state.streamType === StreamType.CLOUD_PROVIDER &&
          props.state.streamData !== null &&
          props.state.streamData !== undefined &&
          props.state.streamData.provider &&
          props.state.streamData.provider === 'YOUTUBE' ? (
            <div
              className="relative w-full h-full max-w-full max-h-full"
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
                className="object-contain w-full h-full"
                opts={{
                  height: '100%',
                  width: '100%',
                  playerVars: {
                    autoplay: 1,
                    controls: 0,
                  },
                }}
              />
              {/* Overlay Content */}

              <div className="absolute inset-0 pointer-events-none w-full flex justify-between p-4">
                <img src="/images/clublogo.png" className="h-14 w-14 rounded-full overflow-hidden" />

                <div className="flex flex-col gap-2 items-center">
                  <img src={props.state.clubLogo!} className="h-14 w-14" />
                  <small className="text-white font-medium text-xl">T-{props.state.venueNo}</small>
                </div>
              </div>
              {props.state.overlayType === 'DESTINATION' && !props.isPortrait && (
                <div className="absolute inset-0 flex flex-col justify-end items-center pointer-events-none">
                  <div className="w-full h-[12%] bg-transparent flex justify-center">
                    <div className="flex p-1 w-full gap-1 h-full justify-center">
                      <div>
                        <img
                          className="h-full w-auto aspect-square object-cover rounded-full"
                          src={
                            props.state.sideOnePlayerOne.profilePhoto
                              ? props.state.sideOnePlayerOne.profilePhoto
                              : '/images/user-dummy-pic.png'
                          }
                        />
                      </div>

                      <div className="flex-grow relative flex items-center">
                        {/* <div className="absolute top-0 left-0 w-full flex">
                          <div>
                            <span className="text-white md:text-base text-xs text-left">
                              {new Date(props.state.actualStartTimeDate).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex-grow text-center">
                            <span className="text-white md:text-base text-xs text-left uppercase">
                              {props.state.clubName} - Table {props.state.venueNo}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-white md:text-base text-xs text-right">
                              {new Date(props.state.actualStartTimeDate).toLocaleTimeString(undefined, {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })}
                            </span>
                          </div>
                        </div> */}

                        <div className="h-14 grid grid-cols-12 bg-primary border border-white w-full rounded-md items-center px-2">
                          <div className="col-span-5 flex gap-2">
                            {/* {props.state.activePlayerId === props.state.sideOnePlayerOne.id ||
                            props.state.activePlayerId === props.state.sideOnePlayerTwo?.id ? (
                              <>
                                <img className="lg:w-6 lg:h-6 w-4 h-4" src={'/images/white-ball-stream.png'} />
                              </>
                            ) : (
                              <></>
                            )} */}
                            <small className="text-white text-xl whitespace-nowrap uppercase font-bold">
                              {props.state.sideOnePlayerOne.name}
                            </small>

                            {props.state.activePlayerId === props.state.sideOnePlayerOne.id ||
                            props.state.activePlayerId === props.state.sideOnePlayerTwo?.id ? (
                              <>
                                <h5 className="text-xl text-yellow-500 font-bold text-right uppercase ml-auto whitespace-nowrap">
                                  Break {activeTurn ? activeTurn?.score : 0}
                                </h5>
                              </>
                            ) : (
                              <></>
                            )}
                          </div>

                          <div className="col-span-2 text-center">
                            <span className="text-xl text-white">
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
                                <h5 className="text-xl text-yellow-500 font-bold text-left uppercase mr-auto whitespace-nowrap">
                                  Break {activeTurn ? activeTurn?.score : 0}
                                </h5>
                              </>
                            ) : (
                              <></>
                            )}

                            <small className="text-white text-xl whitespace-nowrap uppercase font-bold">
                              {props.state.sideTwoPlayerOne.name}
                            </small>

                            {/* {props.state.activePlayerId === props.state.sideTwoPlayerOne.id ||
                            props.state.activePlayerId === props.state.sideTwoPlayerTwo?.id ? (
                              <>
                                <img className="lg:w-6 lg:h-6 w-4 h-4" src={'/images/white-ball-stream.png'} />
                              </>
                            ) : (
                              <></>
                            )} */}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <img
                          className="h-full w-auto aspect-square object-cover rounded-full"
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
