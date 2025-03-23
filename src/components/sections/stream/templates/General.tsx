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
    <div className="absolute 360p:bottom-1 360p:mx-1 bottom-2 flex flex-col items-center bg-black mx-2 border border-white w-full">
      <div className="w-full h-auto flex items-center">
        <div className={`${props.isTv ? 'p-2' : '360p:p-2  p-4'}`}>
          <ImageWithFallback
            fallback="/images/user-dummy-pic.png"
            className={`${props.isTv ? 'size-[4rem]' : '360p:size-6 720p:size-[4rem]  1080p:size-[8rem]'} aspect-square rounded-full object-cover`}
            src={
              props.state!.sideOnePlayerOne.profilePhoto
                ? props.state!.sideOnePlayerOne.profilePhoto
                : '/images/user-dummy-pic.png'
            }
          />
        </div>
        <div className="flex-grow flex flex-col h-full">
          <div className="w-full h-1/3 grid grid-cols-3 items-center">
            <div className="col-span-1">
              {props.state!.activePlayerId === props.state!.sideOnePlayerOne.id ||
              props.state!.activePlayerId === props.state!.sideOnePlayerTwo?.id ? (
                <h5
                  className={`${props.isTv ? 'text-lg' : '360p:text-[0.5rem] 720p:text-lg 1080p:text-4xl'} text-yellow-500 font-bold text-left uppercase whitespace-nowrap`}
                >
                  Break {props.activeTurn ? props.activeTurn?.score : 0}
                </h5>
              ) : (
                <></>
              )}
            </div>
            <div className="col-span-1">
              <></>
            </div>
            <div className="col-span-1">
              {props.state!.activePlayerId === props.state!.sideTwoPlayerOne.id ||
              props.state!.activePlayerId === props.state!.sideTwoPlayerTwo?.id ? (
                <h5
                  className={`${props.isTv ? 'text-lg' : '360p:text-[0.5rem] 720p:text-lg 1080p:text-4xl'} text-yellow-500 font-bold text-right uppercase whitespace-nowrap`}
                >
                  Break {props.activeTurn ? props.activeTurn?.score : 0}
                </h5>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="w-full h-1/3 bg-primary grid grid-cols-3 items-center px-4">
            <div className="col-span-1">
              <h5
                className={`${props.isTv ? 'text-lg' : '360p:text-[0.5rem] 720p:text-lg 1080p:text-4xl'} text-white text-left uppercase whitespace-nowrap`}
              >
                {generatePlayerName(props.state!.sideOnePlayerOne.name, props.state!.sideOnePlayerTwo?.name)}
                &nbsp;&nbsp;
                {
                  props.state.teamOneHandicap ? (
                    <span>({convertHandicapToString(props.state?.teamOneHandicap)})</span>
                  ) : (
                    <></>
                  )
                }
              </h5>
            </div>
            <div className="col-span-1">
              <h5
                className={`${props.isTv ? 'text-lg' : '360p:text-[0.5rem] 720p:text-lg 1080p:text-4xl'} text-white font-bold uppercase whitespace-nowrap text-center flex justify-between`}
              >
                <div className="font-bold">{props.activeSet ? props.activeSet?.teamOneScore : 0}</div>

                <div>({props.state.sets.length})</div>

                <div>
                  <span className="font-bold">{props.activeSet ? props.activeSet?.teamTwoScore : 0}</span>
                </div>
              </h5>
            </div>
            <div className="col-span-1">
              <h5
                className={`${props.isTv ? 'text-lg' : '360p:text-[0.5rem] 720p:text-lg 1080p:text-4xl'} text-white text-right uppercase whitespace-nowrap`}
              >
                {generatePlayerName(props.state!.sideTwoPlayerOne.name, props.state!.sideTwoPlayerTwo?.name)}
                &nbsp;&nbsp;
                {
                  props.state.teamTwoHandicap ? (
                    <span>({convertHandicapToString(props.state?.teamTwoHandicap)})</span>
                  ) : (
                    <></>
                  )
                }
              </h5>
            </div>
          </div>
          <div className="w-full h-1/3 grid grid-cols-3 items-center">
            <div className="col-span-1">
              <></>
            </div>
            <div className="col-span-1">
              <h5
                className={`${props.isTv ? 'text-lg' : '360p:text-[0.5rem] 720p:text-lg 1080p:text-4xl'} text-white font-bold text-center uppercase whitespace-nowrap`}
              >
                {props.state?.format}
              </h5>
            </div>
            <div className="col-span-1">
             <></>
            </div>
          </div>
        </div>
        <div className={`${props.isTv ? 'p-2' : '360p:p-2  p-4'}`}>
          <ImageWithFallback
            fallback="/images/user-dummy-pic.png"
            className={`${props.isTv ? 'size-[4rem]' : '360p:size-6 720p:size-[4rem] 1080p:size-[8rem]'} aspect-square rounded-full object-cover`}
            src={props.state!.sideTwoPlayerOne?.profilePhoto ? props.state!.sideTwoPlayerOne?.profilePhoto : '/images/user-dummy-pic.png'}
          />
        </div>
      </div>
    </div>
  );
}
