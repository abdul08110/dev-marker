import ImageWithFallback from '@/components/ui/image-with-fallback';
import { StreamingState } from '@/hooks/useStreaming';
import { Set, Turn } from '@/stores/types';
import { convertHandicapToString, generatePlayerName } from '@/utils/functions';

interface NewEcaProps {
  state: StreamingState | null;
  activeTurn: Turn | null;
  activeSet: Set | undefined;
  isTv?: boolean;
}

export function NewEca(props: NewEcaProps) {
  const isTeamReveresed =
    props.state && props.state.tournamentId && props.state.tournamentSubItem
      ? props.state.tournamentSubItem?.tournamentItem.tournamentTeamOneId !== props.state.tournamentTeamOneId
      : false;

  return (
    <div className="absolute bottom-[min(1.5vh,1.5vw)] mx-[min(1.5vh,1.5vw)] flex flex-col items-center bg-black border border-white w-[calc(100%-min(3vh,3vw))]">
      <div className="w-full h-auto flex items-center">
        <div className="p-[min(2.5vh,2.5vw)]">
          <div className="overflow-hidden size-[min(10vh,10vw)] aspect-square">
            <ImageWithFallback
              fallback="/images/user-dummy-pic.png"
              className="size-full object-cover"
              src={props.state!.teamOneLogo ? props.state!.teamOneLogo : '/images/user-dummy-pic.png'}
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
            <div className="min-w-[60%] max-w-full flex justify-center">
              <div className="overflow-x-auto scrollbar-hide mx-auto">
                <h5 className="text-[min(3.5vh,3.5vw)] text-white font-bold text-center uppercase whitespace-nowrap px-[min(1vh,1vw)]">
                  {props.state?.tournamentName} | {props.state?.tournamentSubItem?.tournamentItem.tournamentPhase.name}
                </h5>
              </div>
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
                &nbsp;&nbsp;{props.state?.teamOneHandicap ? `  (${convertHandicapToString(props.state?.teamOneHandicap)})` : ''}
              </h5>
            </div>
            <div className="col-span-1">
              <h5 className="text-[min(3.5vh,3.5vw)] text-white font-bold uppercase whitespace-nowrap text-center flex justify-between">
                <div className="font-bold">{props.activeSet ? props.activeSet?.teamOneScore : 0}</div>

                <div>
                  {isTeamReveresed
                  ? props.state!.tournamentSubItem?.tournamentItem.teamTwoScore!
                  : props.state!.tournamentSubItem?.tournamentItem.teamOneScore!}
                  &nbsp;(4)&nbsp;
                  {isTeamReveresed
                  ? props.state!.tournamentSubItem?.tournamentItem.teamOneScore!
                  : props.state!.tournamentSubItem?.tournamentItem.teamTwoScore!}
                </div>
                <div>
                  <span className="font-bold">{props.activeSet ? props.activeSet?.teamTwoScore : 0}</span>
                </div>
              </h5>
            </div>
            <div className="col-span-1">
              <h5 className="text-[min(3.5vh,3.5vw)] text-white text-right uppercase whitespace-nowrap">
                {generatePlayerName(props.state!.sideTwoPlayerOne.name, props.state!.sideTwoPlayerTwo?.name)}
                &nbsp;&nbsp;{props.state?.teamTwoHandicap ? `  (${convertHandicapToString(props.state?.teamTwoHandicap)})` : ''}
              </h5>
            </div>
          </div>
          <div className="w-full h-1/3 flex items-center justify-between">
            <div className="min-w-[20%]">
              <h5 className="text-[min(3.5vh,3.5vw)] text-white font-bold text-left uppercase whitespace-nowrap">
                {props.state?.teamOneName}
                {'  '}
              </h5>
            </div>
            <div className="min-w-[60%] flex justify-center">
              <div className="overflow-x-auto scrollbar-hide mx-auto">
                <h5 className="text-[min(3.5vh,3.5vw)] text-white font-bold text-center uppercase whitespace-nowrap px-[min(1vh,1vw)]">
                  {props.state?.format} | GAME #{props.state!.tournamentSubItem?.gameFormat.matchNo}
                </h5>
              </div>
            </div>
            <div className="min-w-[20%]">
              <h5 className="text-[min(3.5vh,3.5vw)] text-white font-bold text-right uppercase whitespace-nowrap">
                {props.state?.teamTwoName}
              </h5>
            </div>
          </div>
        </div>
        <div className="p-[min(2.5vh,2.5vw)]">
          <div className="overflow-hidden size-[min(10vh,10vw)] aspect-square">
            <ImageWithFallback
              fallback="/images/user-dummy-pic.png"
              className="size-full object-cover"
              src={props.state!.teamTwoLogo ? props.state!.teamTwoLogo : '/images/user-dummy-pic.png'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
