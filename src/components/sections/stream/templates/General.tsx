import ImageWithFallback from '@/components/ui/image-with-fallback';
import { StreamingState } from '@/hooks/useStreaming';
import { Set, Turn } from '@/stores/types';
import { convertHandicapToString, generatePlayerName } from '@/utils/functions';

interface GeneralTemplateProps {
  state: StreamingState;
  activeTurn: Turn | null;
  activeSet: Set | undefined;
  isTv: boolean;
}

export function GeneralTemplate(props: GeneralTemplateProps) {
  return (
    <div className="absolute bottom-[min(1.5vh,1.5vw)] mx-[min(1.5vh,1.5vw)] flex flex-col items-center bg-black border border-white w-[calc(100%-min(3vh,3vw))]">
      <div className="w-full h-auto flex items-center">
        <div className="p-[min(2.5vh,2.5vw)]">
          <div className="overflow-hidden size-[min(10vh,10vw)] aspect-square">
            <ImageWithFallback
              fallback="/images/user-dummy-pic.png"
              className="size-full object-cover"
              src={
                props.state!.sideOnePlayerOne.profilePhoto
                  ? props.state!.sideOnePlayerOne.profilePhoto
                  : '/images/user-dummy-pic.png'
              }
            />
          </div>
        </div>
        <div className="flex-grow flex flex-col h-full">
          <div className="w-full h-1/3 flex justify-between items-center">
            <div className="min-w-[20%]">
              {props.state!.activePlayerId === props.state!.sideOnePlayerOne.id ||
              props.state!.activePlayerId === props.state!.sideOnePlayerTwo?.id ? (
                <h5 className="text-[min(3.5vh,3.5vw)] text-yellow-500 font-bold text-left uppercase whitespace-nowrap">
                  Break {props.activeTurn ? props.activeTurn?.score : 0}
                </h5>
              ) : (
                <></>
              )}
            </div>
            <div className="min-w-[60%]">
              <></>
            </div>
            <div className="min-w-[20%]">
              {props.state!.activePlayerId === props.state!.sideTwoPlayerOne.id ||
              props.state!.activePlayerId === props.state!.sideTwoPlayerTwo?.id ? (
                <h5 className="text-[min(3.5vh,3.5vw)] text-yellow-500 font-bold text-right uppercase whitespace-nowrap">
                  Break {props.activeTurn ? props.activeTurn?.score : 0}
                </h5>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="w-full h-1/3 bg-primary grid grid-cols-3 items-center px-[min(2.5vh,2.5vw)]">
            <div className="col-span-1">
              <h5 className="text-[min(3.5vh,3.5vw)] text-white text-left uppercase whitespace-nowrap">
                {generatePlayerName(props.state!.sideOnePlayerOne.name, props.state!.sideOnePlayerTwo?.name)}
                &nbsp;&nbsp;
                {props.state.teamOneHandicap ? (
                  <span>({convertHandicapToString(props.state?.teamOneHandicap)})</span>
                ) : (
                  <></>
                )}
              </h5>
            </div>
            <div className="col-span-1">
              <h5 className="text-[min(3.5vh,3.5vw)] text-white font-bold uppercase whitespace-nowrap text-center flex justify-between">
                <div className="font-bold">{props.activeSet ? props.activeSet?.teamOneScore : 0}</div>

                <div>({props.state.sets.length})</div>

                <div>
                  <span className="font-bold">{props.activeSet ? props.activeSet?.teamTwoScore : 0}</span>
                </div>
              </h5>
            </div>
            <div className="col-span-1">
              <h5 className="text-[min(3.5vh,3.5vw)] text-white text-right uppercase whitespace-nowrap">
                {generatePlayerName(props.state!.sideTwoPlayerOne.name, props.state!.sideTwoPlayerTwo?.name)}
                &nbsp;&nbsp;
                {props.state.teamTwoHandicap ? (
                  <span>({convertHandicapToString(props.state?.teamTwoHandicap)})</span>
                ) : (
                  <></>
                )}
              </h5>
            </div>
          </div>
          <div className="w-full h-1/3 flex items-center justify-between">
            <div className="min-w-[20%]">
              <></>
            </div>
            <div className="min-w-[60%] flex justify-center">
              <div className="overflow-x-auto scrollbar-hide mx-auto">
                <h5 className="text-[min(3.5vh,3.5vw)] text-white font-bold text-center uppercase whitespace-nowrap px-[min(1vh,1vw)]">
                  {props.state?.format}
                </h5>
              </div>
            </div>
            <div className="min-w-[20%]">
              <></>
            </div>
          </div>
        </div>
        <div className="p-[min(2.5vh,2.5vw)]">
          <div className="overflow-hidden size-[min(10vh,10vw)] aspect-square">
            <ImageWithFallback
              fallback="/images/user-dummy-pic.png"
              className="size-full object-cover"
              src={props.state!.sideTwoPlayerOne?.profilePhoto ? props.state!.sideTwoPlayerOne?.profilePhoto : '/images/user-dummy-pic.png'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
