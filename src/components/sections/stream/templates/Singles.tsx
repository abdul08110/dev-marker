import ImageWithFallback from '@/components/ui/image-with-fallback';
import { StreamingState } from '@/hooks/useStreaming';
import { Set, Turn } from '@/stores/types';
import { generatePlayerName } from '@/utils/functions';

interface SinglesProps {
  state: StreamingState;
  activeTurn: Turn | null;
  activeSet: Set | undefined;
  isTv: boolean;
}

export function Singles(props: SinglesProps) {
  return (
    <div className="absolute bottom-0 mx-[min(1vh,1vw)] flex flex-col items-center w-[calc(100%-min(2vh,2vw))]">
      <div className="w-full h-auto flex items-center bg-[#D5D5D5] rounded-lg">
        <div className="h-full flex items-center">
          <div className="h-full w-[min(13vh,13vw)] p-1 rounded-lg overflow-hidden">
            <ImageWithFallback
              fallback="/images/user-dummy-pic.jpg"
              className="w-full h-full object-cover aspect-square"
              src={
                props.state!.sideOnePlayerOne.profilePhoto
                  ? props.state!.sideOnePlayerOne.profilePhoto
                  : '/images/user-dummy-pic.jpg'
              }
            />
          </div>
        </div>
        <div className="flex-grow flex flex-col h-full">
          <div className="w-full h-1/3 flex justify-between items-center bg-[#D5D5D5]">
            <div className="w-auto flex min-w-[20%]">
              {props.state!.activePlayerId === props.state!.sideOnePlayerOne.id ||
              props.state!.activePlayerId === props.state!.sideOnePlayerTwo?.id ? (
                <div className="inline-block relative">
                  <div className="px-[min(2vh,2vw)] py-[min(0.6vh,0.6vw)] pl-[min(3vh,3vw)]">
                    <h5 className="text-[min(3vh,3vw)] font-bold uppercase whitespace-nowrap bg-primary bg-clip-text text-transparent">
                      <span className="ml-3">BREAK {props.activeTurn?.score || 0}</span>
                    </h5>
                  </div>
                </div>
              ) : (
                <div className="w-[min(20vh,20vw)] bg-[#D5D5D5]" />
              )}
            </div>
            <div className="flex-1 bg-[#D5D5D5] h-[min(5vh,5vw)] flex items-center justify-center">
              <h5 className="text-[min(3.2vh,3.2vw)] text-black font-[800] uppercase whitespace-nowrap text-center w-full">
                <span className="font-[800]">{props.state?.tournamentName || 'Tournament'}</span>{' '}<span className="mx-1 text-black">|</span>{' '}
                {props.state?.format}
              </h5>
            </div>
            <div className="w-auto flex justify-end min-w-[20%]">
              {props.state!.activePlayerId === props.state!.sideTwoPlayerOne.id ||
              props.state!.activePlayerId === props.state!.sideTwoPlayerTwo?.id ? (
                <div className="inline-block relative">
                  <div className="px-[min(2vh,2vw)] py-[min(0.6vh,0.6vw)] pr-[min(3vh,3vw)]">
                    <h5 className="text-[min(3vh,3vw)] font-bold uppercase whitespace-nowrap bg-primary bg-clip-text text-transparent">
                      <span className="ml-3">BREAK {props.activeTurn?.score || 0}</span>
                    </h5>
                  </div>
                </div>
              ) : (
                <div className="w-[min(20vh,20vw)]" />
              )}
            </div>
          </div>
          <div className="w-full h-1/3 bg-black rounded-md grid grid-cols-3 items-center px-[min(2vh,2vw)]">
            <div className="col-span-1">
              <h5 className="text-[min(3vh,3vw)] text-white font-bold text-left uppercase whitespace-nowrap">
                {generatePlayerName(props.state!.sideOnePlayerOne.name, props.state!.sideOnePlayerTwo?.name)}
                {props.state?.teamOneHandicap !== undefined && (
                  <span className="ml-2 text-yellow-400">
                    {props.state.teamOneHandicap && props.state.teamOneHandicap > 0 ? '+' : ''}
                    {props.state.teamOneHandicap}
                  </span>
                )}
              </h5>
            </div>
            <div className="col-span-1 flex justify-center">
              <h5 className="text-[min(3vh,3vw)] text-white font-bold uppercase whitespace-nowrap flex items-center">
                <div className="bg-primary px-[min(4vh,4vw)] py-[min(0.4vh,0.4vw)]">
                  {props.activeSet ? props.activeSet?.teamOneScore : 0}
                </div>
                <div className="bg-black px-[min(2vh,2vw)] py-[min(0.4vh,0.4vw)]">{props.state.teamOneScore}</div>
                <div className="bg-primary px-[min(2vh,2vw)] py-[min(0.4vh,0.4vw)]">
                  7
                </div>
                <div className="bg-black px-[min(2vh,2vw)] py-[min(0.4vh,0.4vw)]">{props.state.teamTwoScore}</div>
                <div className="bg-primary px-[min(4vh,4vw)] py-[min(0.4vh,0.4vw)]">
                  {props.activeSet ? props.activeSet?.teamTwoScore : 0}
                </div>
              </h5>
            </div>
            <div className="col-span-1">
              <h5 className="text-[min(3vh,3vw)] text-white font-bold text-right uppercase whitespace-nowrap">
                {props.state?.teamTwoHandicap !== undefined && (
                  <span className="mr-2 text-yellow-400">
                    {props.state.teamTwoHandicap && props.state.teamTwoHandicap > 0 ? '+' : ''}
                    {props.state.teamTwoHandicap}
                  </span>
                )}
                {generatePlayerName(props.state!.sideTwoPlayerOne.name, props.state!.sideTwoPlayerTwo?.name)}
              </h5>
            </div>
          </div>
          <div className="w-full h-1/3 flex items-center justify-between bg-[#D5D5D5]">
            <div className="min-w-[45%] px-[min(2vh,2vw)]">
              <h5 className="text-[min(2.2vh,2.2vw)] text-[#D5D5D5] font-bold text-left uppercase whitespace-nowrap">
                &nbsp;
                {/* <span className="bg-primary text-white px-[min(1vh,1vw)] ml-2">
                  {isTeamReveresed
                    ? props.state.tournamentSubItem?.tournamentItem.teamTwoScore
                    : props.state.tournamentSubItem?.tournamentItem.teamOneScore}
                </span> */}
              </h5>
            </div>
            <div className="min-w-[10%] flex justify-center">
              <div className="px-[min(2vh,2vw)] py-[min(0.4vh,0.4vw)]">
                <h5 className="text-[min(2.2vh,2.2vw)] text-white font-bold uppercase whitespace-nowrap">
                  {props.state?.tournamentSubItem?.tournamentItem.tournamentPhase.name}
                </h5>
              </div>
            </div>
            <div className="min-w-[45%] px-[min(2vh,2vw)]">
              <h5 className="text-[min(2.2vh,2.2vw)] text-yellow-400 font-bold text-right uppercase whitespace-nowrap">
                {/* <span className="bg-primary text-white px-[min(1vh,1vw)] mr-2">
                  {isTeamReveresed
                    ? props.state.tournamentSubItem?.tournamentItem.teamOneScore
                    : props.state.tournamentSubItem?.tournamentItem.teamTwoScore}
                </span>{' '} */}
                {props.state?.teamTwoName}
              </h5>
            </div>
          </div>
        </div>
        <div className="h-full flex items-center">
          <div className="h-full w-[min(13vh,13vw)] p-1 rounded-lg overflow-hidden">
            <ImageWithFallback
              fallback="/images/user-dummy-pic.jpg"
              className="w-full h-full object-cover aspect-square"
              src={
                props.state!.sideTwoPlayerOne.profilePhoto
                  ? props.state!.sideTwoPlayerOne.profilePhoto
                  : '/images/user-dummy-pic.jpg'
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
