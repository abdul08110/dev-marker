import { getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import { StreamingState } from '@/hooks/useStreaming';
import { StreamType } from '@/api/app/useGetMatchData';
import YouTubePlayer from '@/components/ui/youtube-player';

interface StreamContainerProps {
  state: StreamingState | null;
}

export function StreamContainer(props: StreamContainerProps) {
  const activeSet = getActiveSet(props.state ? props.state.sets : []);
  const activeTurn = getActiveTurn(activeSet);

  return (
    <div className="h-full w-full flex justify-center items-center">
      {props.state ? (
        <div className="flex relative w-full h-full">
          {props.state.streamType === StreamType.CLOUD_PROVIDER &&
          props.state.streamData !== null &&
          props.state.streamData !== undefined &&
          props.state.streamData.provider &&
          props.state.streamData.provider === 'YOUTUBE' ? (
            <YouTubePlayer key={props.state.streamData.brodcastId} videoId={props.state.streamData.brodcastId!} />
          ) : (
            <></>
          )}

          {props.state.overlayType === 'DESTINATION' ? (
            <div className="h-full w-full absolute inset-0 flex flex-col items-center">
              <div className="w-[70%] mt-auto mb-4 bg-[#424242] flex items-center">
                <div className=" border-white border grid grid-cols-12 h-14 w-full">
                  <div className="col-span-4 rounded-r-full flex items-center p-2 relative">
                    <div className={`flex gap-2 items-center w-full rounded`}>
                      {props.state.activePlayerId === props.state.sideOnePlayerOne.id ||
                      props.state.activePlayerId === props.state.sideOnePlayerTwo?.id ? (
                        <>
                          <img className="w-6 h-6" src={'/images/red-ball.png'} />
                          <div className="absolute py-1 px-3 -top-4 left-[30%] bg-markerButton ">
                            <h5 className="text-sm">Break {activeTurn ? activeTurn?.score : 0}</h5>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                      <img
                        className="w-10 h-10"
                        src={props.state.sideOnePlayerOne.profilePhoto ? props.state.sideOnePlayerOne.profilePhoto : ''}
                      />
                      <small className="text-white text-xl">{props.state.sideOnePlayerOne.name}</small>
                    </div>
                  </div>
                  <div className="col-span-4 flex justify-center items-center gap-4 relative">
                    <div className="flex">
                      <span className="text-xl font-bold text-white">{activeSet ? activeSet?.teamOneScore : 0}</span>
                    </div>

                    <div className="flex w-44 gap-3 justify-center items-center">
                      <span className="text-xl font-bold text-white">[{props.state.teamOneScore}]</span>
                      <span className="text-xl font-bold text-white">
                        [{props.state.noOfFrames ? props.state.noOfFrames : props.state.sets.length}]
                      </span>
                      <span className="text-xl font-bold text-white">[{props.state.teamTwoScore}]</span>
                    </div>

                    <div className="flex ">
                      <span className="text-xl font-bold text-white">{activeSet ? activeSet?.teamTwoScore : 0}</span>
                    </div>

                    <div className="absolute w-full py-1 px-3 -top-4 left-0 bg-markerButton text-center">
                      <h5 className="text-sm">
                        Table {props.state.venueNo}, {props.state.clubName}{' '}
                        {new Date(props.state.actualStartTimeDate).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </h5>
                    </div>
                  </div>
                  <div className="col-span-4 rounded-l-full  flex items-center relative">
                    <div className="flex gap-2 items-center justify-end w-full p-1 rounded">
                      <small className="text-white text-xl">{props.state.sideTwoPlayerOne.name}</small>
                      <img
                        className="w-10 h-10"
                        src={props.state.sideTwoPlayerOne.profilePhoto ? props.state.sideTwoPlayerOne.profilePhoto : ''}
                      />
                      {props.state.activePlayerId === props.state.sideTwoPlayerOne.id ||
                      props.state.activePlayerId === props.state.sideTwoPlayerTwo?.id ? (
                        <>
                          <img className="w-6 h-6" src={'/images/red-ball.png'} />
                          <div className="absolute py-1 px-3 -top-4 right-[30%] bg-markerButton ">
                            <h5 className="text-sm">Break {activeTurn ? activeTurn?.score : 0}</h5>
                          </div>
                        </>
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
