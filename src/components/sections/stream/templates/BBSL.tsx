import { StreamingState } from '@/hooks/useStreaming';
import { Set, Turn } from '@/stores/types';
import { generatePlayerName } from '@/utils/functions';

interface BBSLTemplateProps {
  state: StreamingState | null;
  activeTurn: Turn | null;
  activeSet: Set | undefined;
  isTv: boolean;
}

export function BBSLTemplate(props: BBSLTemplateProps) {
  const isTeamReveresed =
    props.state && props.state.tournamentId && props.state.tournamentSubItem
      ? props.state.tournamentSubItem?.tournamentItem.tournamentTeamOneId !== props.state.tournamentTeamOneId
      : false;

  return (
    <div className="absolute 360p:bottom-1 360p:mx-1 bottom-2 flex flex-col items-center bg-black mx-2 border border-white w-full">
      <div className="w-full h-auto flex items-center">
        <div className={`${props.isTv ? 'p-4' : '360p:p-2  p-4'}`}>
          <img
            className={`${props.isTv ? 'size-[8rem]' : '360p:size-6 720p:size-[4rem]  1080p:size-[8rem]'} aspect-square rounded-full object-cover`}
            src={props.state!.teamOneLogo ? props.state!.teamOneLogo : '/images/user-dummy-pic.png'}
          />
        </div>
        <div className="flex-grow flex flex-col h-full">
          <div className="w-full h-1/3 grid grid-cols-3 items-center">
            <div className="col-span-1">
              {props.state!.activePlayerId === props.state!.sideOnePlayerOne.id ||
              props.state!.activePlayerId === props.state!.sideOnePlayerTwo?.id ? (
                <h5
                  className={`${props.isTv ? 'text-4xl' : '360p:text-[0.5rem] 720p:text-lg 1080p:text-4xl'} text-yellow-500 font-bold text-left uppercase whitespace-nowrap`}
                >
                  Break {props.activeTurn ? props.activeTurn?.score : 0}
                </h5>
              ) : (
                <></>
              )}
            </div>
            <div className="col-span-1">
              <h5
                className={`${props.isTv ? 'text-4xl' : '360p:text-[0.5rem] 720p:text-lg 1080p:text-4xl'} text-white font-bold text-center uppercase whitespace-nowrap`}
              >
                {props.state?.tournamentName} | {props.state?.tournamentSubItem?.tournamentItem.tournamentPhase.name}
              </h5>
            </div>
            <div className="col-span-1">
              {props.state!.activePlayerId === props.state!.sideTwoPlayerOne.id ||
              props.state!.activePlayerId === props.state!.sideTwoPlayerTwo?.id ? (
                <h5
                  className={`${props.isTv ? 'text-4xl' : '360p:text-[0.5rem] 720p:text-lg 1080p:text-4xl'} text-yellow-500 font-bold text-right uppercase whitespace-nowrap`}
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
                className={`${props.isTv ? 'text-4xl' : '360p:text-[0.5rem] 720p:text-lg 1080p:text-4xl'} text-white text-left uppercase whitespace-nowrap`}
              >
                {generatePlayerName(props.state!.sideOnePlayerOne.name, props.state!.sideOnePlayerTwo?.name)}
              </h5>
            </div>
            <div className="col-span-1">
              <h5
                className={`${props.isTv ? 'text-4xl' : '360p:text-[0.5rem] 720p:text-lg 1080p:text-4xl'} text-white font-bold uppercase whitespace-nowrap text-center flex justify-between`}
              >
                <div className="font-bold">{props.activeSet ? props.activeSet?.teamOneScore : 0}</div>

                <div>
                  {props.state?.teamOneScore}
                  &nbsp;({props.state?.tournamentSubItem?.gameFormat.noOfSets})&nbsp;
                  {props.state?.teamTwoScore}
                </div>

                <div>
                  <span className="font-bold">{props.activeSet ? props.activeSet?.teamTwoScore : 0}</span>
                </div>
              </h5>
            </div>
            <div className="col-span-1">
              <h5
                className={`${props.isTv ? 'text-4xl' : '360p:text-[0.5rem] 720p:text-lg 1080p:text-4xl'} text-white text-right uppercase whitespace-nowrap`}
              >
                {generatePlayerName(props.state!.sideTwoPlayerOne.name, props.state!.sideTwoPlayerTwo?.name)}
              </h5>
            </div>
          </div>
          <div className="w-full h-1/3 grid grid-cols-3 items-center">
            <div className="col-span-1">
              <h5
                className={`${props.isTv ? 'text-4xl' : '360p:text-[0.5rem] 720p:text-lg 1080p:text-4xl'} text-white font-bold text-left uppercase whitespace-nowrap`}
              >
                {props.state?.teamOneName}{'  '}
                {isTeamReveresed
                  ? props.state!.tournamentSubItem?.tournamentItem.teamTwoScore!
                  : props.state!.tournamentSubItem?.tournamentItem.teamOneScore!}
              </h5>
            </div>
            <div className="col-span-1">
              <h5
                className={`${props.isTv ? 'text-4xl' : '360p:text-[0.5rem] 720p:text-lg 1080p:text-4xl'} text-white font-bold text-center uppercase whitespace-nowrap`}
              >
                {props.state?.format} | GAME #{props.state!.tournamentSubItem?.gameFormat.matchNo}
              </h5>
            </div>
            <div className="col-span-1">
              <h5
                className={`${props.isTv ? 'text-4xl' : '360p:text-[0.5rem] 720p:text-lg 1080p:text-4xl'} text-white font-bold text-right uppercase whitespace-nowrap`}
              >
                {props.state?.teamTwoName}{'  '}
                {isTeamReveresed
                  ? props.state!.tournamentSubItem?.tournamentItem.teamOneScore!
                  : props.state!.tournamentSubItem?.tournamentItem.teamTwoScore!}
              </h5>
            </div>
          </div>
        </div>
        <div className={`${props.isTv ? 'p-4' : '360p:p-2  p-4'}`}>
          <img
            className={`${props.isTv ? 'size-[5rem]' : '360p:size-6 720p:size-[4rem] 1080p:size-[8rem]'} aspect-square rounded-full object-cover`}
            src={props.state!.teamTwoLogo ? props.state!.teamTwoLogo : '/images/user-dummy-pic.png'}
          />
        </div>
      </div>
    </div>
  );
}
