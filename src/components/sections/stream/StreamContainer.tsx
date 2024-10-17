// import { getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import { StreamingState } from '@/hooks/useStreaming';
import { StreamType } from '@/api/app/useGetMatchData';
import YouTubePlayer from '@/components/ui/youtube-player';

interface StreamContainerProps {
  state: StreamingState | null;
}

export function StreamContainer(props: StreamContainerProps) {
  // const activeSet = getActiveSet(props.state ? props.state.sets : []);
  // const activeTurn = getActiveTurn(activeSet);

  return (
    <div className="h-full w-full flex justify-center items-center">
      {props.state ? (
        <div className="flex relative w-full h-full">
          {props.state.streamType === StreamType.CLOUD_PROVIDER &&
          props.state.streamData &&
          props.state.streamData.provider &&
          props.state.streamData.provider === 'YOUTUBE' ? (
            <YouTubePlayer videoId={props.state.streamData.brodcastId!} />
          ) : (
            <></>
          )}

          {!props.state.overlayType || props.state.overlayType === 'DESTINATION' ? (
            <div className="h-full w-full absolute inset-0 flex flex-col items-center">
              <div className="w-[90%] mt-auto mb-4 bg-white/30">
                <div className=" border-primary grid grid-cols-12 h-14">
                  <div className="col-span-5 rounded-r-full flex items-center p-2">
                    <div className="w-[80%]">
                      <small className="text-black text-3xl">{props.state.sideOnePlayerOne.name}</small>
                    </div>
                    <div className="w-[20%]"></div>
                  </div>
                  <div className="col-span-2"></div>
                  <div className="col-span-5 rounded-l-full p-2 flex items-center">
                    <div className="w-[20%]">
                        &nbsp;
                    </div>
                    <div className="w-[80%] text-right">
                      <small className="text-black text-3xl">{props.state.sideTwoPlayerOne.name}</small>
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
        <video autoPlay loop muted src="/sponsor-videos/chowhan_ventures.mp4" className="w-full h-auto" />
      )}
    </div>
  );
}
