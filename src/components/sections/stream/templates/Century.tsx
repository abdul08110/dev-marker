import ImageWithFallback from '@/components/ui/image-with-fallback';
import { StreamingState } from '@/hooks/useStreaming';
import { Set, Turn } from '@/stores/types';
import { generatePlayerName } from '@/utils/functions';

interface CenturyTemplateProps {
  state: StreamingState;
  activeTurn: Turn | null;
  activeSet: Set | undefined;
  isTv: boolean;
}

export function CenturyTemplate(props: CenturyTemplateProps) {
  // const isTeamReveresed =
  //   props.state && props.state.tournamentId && props.state.tournamentSubItem
  //     ? props.state.tournamentSubItem?.tournamentItem.tournamentTeamOneId !== props.state.tournamentTeamOneId
  //     : false;

  return (
    <div className="absolute bottom-0 mx-[min(1vh,1vw)] flex flex-col items-center bg-black w-[calc(100%-min(2vh,2vw))]">
      <div className="w-full h-auto flex items-center">
        <div>
          <div className="overflow-hidden h-[min(13vh,13vw)] aspect-square">
            <ImageWithFallback
              fallback="/images/user-dummy-pic.png"
              className="size-full object-cover"
              src={
                props.state!.teamOneLogo
                  ? props.state!.teamOneLogo
                  : '/images/user-dummy-pic.png'
              }
            />
          </div>
        </div>
        <div className="flex-grow flex flex-col h-full">
          <div className="w-full h-1/3 flex justify-between items-center bg-[#D5D5D5]">
            <div className="w-auto flex min-w-[20%]">
              {(props.state!.activePlayerId === props.state!.sideOnePlayerOne.id ||
                props.state!.activePlayerId === props.state!.sideOnePlayerTwo?.id) ? (
                <div className="inline-block relative bg-primary">
                  <div className="px-[min(2vh,2vw)] py-[min(0.6vh,0.6vw)] pl-[min(3vh,3vw)]">
                    <h5 className="text-[min(2.8vh,2.8vw)] text-white font-bold uppercase whitespace-nowrap">
                      <span className="ml-3">
                        BREAK {props.activeTurn?.score || 0}
                      </span>
                    </h5>
                  </div>
                </div>
              ) : <div className="w-[min(20vh,20vw)] bg-[#D5D5D5]" />}
            </div>
            <div className="flex-1 bg-[#D5D5D5] h-[min(5vh,5vw)] flex items-center justify-center">
              <h5 className="text-[min(2.4vh,2.4vw)] text-primary font-bold uppercase whitespace-nowrap text-center w-full">
                {props.state?.tournamentName || 'Tournament'} <span className="mx-1 text-primary">|</span>{' '}
                {props.state?.format}
              </h5>
            </div>
            <div className="w-auto flex justify-end min-w-[20%]">
              {(props.state!.activePlayerId === props.state!.sideTwoPlayerOne.id ||
                props.state!.activePlayerId === props.state!.sideTwoPlayerTwo?.id) ? (
                <div className="inline-block relative bg-primary">
                  <div className="px-[min(2vh,2vw)] py-[min(0.6vh,0.6vw)] pr-[min(3vh,3vw)]">
                    <h5 className="text-[min(2.8vh,2.8vw)] text-white font-bold uppercase whitespace-nowrap">
                      <span className="ml-3">
                        BREAK {props.activeTurn?.score || 0}
                      </span>
                    </h5>
                  </div>
                </div>
              ) : <div className="w-[min(20vh,20vw)]" />}
            </div>
          </div>
          <div className="w-full h-1/3 bg-[#424242] grid grid-cols-3 items-center px-[min(2vh,2vw)]">
            <div className="col-span-1">
              <h5 className="text-[min(3vh,3vw)] text-white font-bold text-left uppercase whitespace-nowrap">
                {generatePlayerName(props.state!.sideOnePlayerOne.name, props.state!.sideOnePlayerTwo?.name)}
              </h5>
            </div>
            <div className="col-span-1 flex justify-center">
              <h5 className="text-[min(3vh,3vw)] text-white font-bold uppercase whitespace-nowrap flex items-center gap-0">
                <div className="bg-primary px-[min(1.5vh,1.5vw)] py-[min(0.4vh,0.4vw)]">
                  {props.activeSet ? props.activeSet?.teamOneScore : 0}
                </div>
                <div className="bg-[#424242] px-[min(1.5vh,1.5vw)] py-[min(0.4vh,0.4vw)]">
                  {props.state.tournamentSubItem?.tournamentItem.teamOneCumulativeFinalFrameScore}
                </div>
                <div className="bg-primary px-[min(1.5vh,1.5vw)] py-[min(0.4vh,0.4vw)]">
                  ({props.state.tournamentSubItem?.gameFormat.matchNo}/
                  {props.state.tournamentSubItem?.tournamentItem.tournamentPhase.tournamentFormats.length})
                </div>
                <div className="bg-[#424242] px-[min(1.5vh,1.5vw)] py-[min(0.4vh,0.4vw)]">
                  {props.state.tournamentSubItem?.tournamentItem.teamTwoCumulativeFinalFrameScore}
                </div>
                <div className="bg-primary px-[min(1.5vh,1.5vw)] py-[min(0.4vh,0.4vw)]">
                  {props.activeSet ? props.activeSet?.teamTwoScore : 0}
                </div>
              </h5>
            </div>
            <div className="col-span-1">
              <h5 className="text-[min(3vh,3vw)] text-white font-bold text-right uppercase whitespace-nowrap">
                {generatePlayerName(props.state!.sideTwoPlayerOne.name, props.state!.sideTwoPlayerTwo?.name)}
              </h5>
            </div>
          </div>
          <div className="w-full h-1/3 flex items-center justify-between">
            <div className="min-w-[20%] px-[min(2vh,2vw)]">
              <h5 className="text-[min(2.2vh,2.2vw)] text-white font-bold text-left uppercase whitespace-nowrap">
                {props.state?.teamOneName}
                {props.state?.tournamentSubItem?.tournamentItem.teamOneLastestGameHandicap !== undefined && (
                  <span className="ml-2 text-yellow-400">
                    {props.state.tournamentSubItem.tournamentItem.teamOneLastestGameHandicap > 0 ? '+' : ''}
                    {props.state.tournamentSubItem.tournamentItem.teamOneLastestGameHandicap}
                  </span>
                )}
              </h5>
            </div>
            <div className="min-w-[60%] flex justify-center">
            </div>
            <div className="min-w-[20%] px-[min(2vh,2vw)]">
              <h5 className="text-[min(2.2vh,2.2vw)] text-white font-bold text-right uppercase whitespace-nowrap">
                {props.state?.teamTwoName}
                {props.state?.tournamentSubItem?.tournamentItem.teamTwoLastestGameHandicap !== undefined && (
                  <span className="ml-2 text-yellow-400">
                    {props.state.tournamentSubItem.tournamentItem.teamTwoLastestGameHandicap > 0 ? '+' : ''}
                    {props.state.tournamentSubItem.tournamentItem.teamTwoLastestGameHandicap}
                  </span>
                )}
              </h5>
            </div>
          </div>
        </div>
        <div>
          <div className="overflow-hidden h-[min(13vh,13vw)] aspect-square">
            <ImageWithFallback
              fallback="/images/user-dummy-pic.png"
              className="size-full object-cover"
              src={
                props.state!.teamTwoLogo
                  ? props.state!.teamTwoLogo
                  : '/images/user-dummy-pic.png'
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
