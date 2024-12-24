import { StreamingState } from '@/hooks/useStreaming';
import { Set, Turn } from '@/stores/types';

interface GeneralTemplateProps {
  state: StreamingState;
  activeTurn: Turn | null;
  activeSet: Set | undefined;
  timeLeft: number;
}

export function GeneralTemplate(props: GeneralTemplateProps) {
  return (
    <div className="absolute bottom-0 flex flex-col items-center w-full">
      <div className="w-full h-auto bg-transparent flex justify-center">
        <div className="flex px-1 w-full gap-1 h-full justify-center">
          <div className="flex items-end">
            {props.state.tournamentLogo ? (
              <img
                className="lg:h-14 lg:w-14 xl:h-24 xl:w-24 h-8 w-8 aspect-square object-cover rounded-full"
                src={props.state.teamOneLogo ? props.state.teamOneLogo : '/images/user-dummy-pic.png'}
              />
            ) : (
              <></>
            )}
            {props.state.tournamentLogo === null ? (
              <img
                className="lg:h-14 lg:w-14 xl:h-24 xl:w-24 h-8 w-8 aspect-square object-cover rounded-full"
                src={
                  props.state.sideOnePlayerOne.profilePhoto
                    ? props.state.sideOnePlayerOne.profilePhoto
                    : '/images/user-dummy-pic.png'
                }
              />
            ) : (
              <></>
            )}
          </div>

          <div className="flex-grow relative flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center w-full">
              <div className="w-full grid grid-cols-3 bg-black/10 lg:p-2 p-1">
                <div className="col-span-1 flex justify-start items-end">
                  {props.state.activePlayerId === props.state.sideOnePlayerOne.id ||
                  props.state.activePlayerId === props.state.sideOnePlayerTwo?.id ? (
                    <h5 className="xl:text-xl lg:text-base text-base text-white font-bold text-left uppercase whitespace-nowrap">
                      Break {props.activeTurn ? props.activeTurn?.score : 0}
                    </h5>
                  ) : (
                    <></>
                  )}
                </div>

                {props.state.sport === 'SNOOKER' && props.state.tournamentLogo !== null ? (
                  <h5 className="col-span-1 xl:text-xl lg:text-base text-base text-white font-bold text-center">
                    {props.state.sportType === 'SNOOKER_10_RED'
                      ? '10 REDS SINGLE FRAME'
                      : props.state.sportType === 'SNOOKER_15_RED'
                        ? '15 REDS SINGLE FRAME'
                        : '6 REDS CUMULATIVE'}
                  </h5>
                ) : (
                  <div className="col-span-1"></div>
                )}

                <div className="col-span-1 flex justify-end items-end">
                  {props.state.activePlayerId === props.state.sideTwoPlayerOne.id ||
                  props.state.activePlayerId === props.state.sideTwoPlayerTwo?.id ? (
                    <h5 className="xl:text-xl lg:text-base text-base text-white font-bold text-right uppercase whitespace-nowrap">
                      Break {props.activeTurn ? props.activeTurn?.score : 0}
                    </h5>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-12 justify-center bg-primary border border-white w-full rounded-md items-center px-2">
                <div className="col-span-5 flex gap-2 items-center">
                  <small className="text-white xl:text-3xl lg:text-xl text-base whitespace-nowrap uppercase font-bold">
                    {props.state.sideOnePlayerOne.name}{' '}
                    <span className={props.state.isTeamOneHandicapApplied === true ? 'line-through' : ''}>
                      {props.state.teamOneHandicap}
                    </span>{' '}
                    {props.state.tournamentTeamOneabb && props.state.sport === 'SNOOKER'
                      ? props.state.tournamentTeamOneabb
                      : ''}
                  </small>
                </div>

                {props.state.sport === 'SNOOKER' ? (
                  <div className="col-span-2 text-center flex justify-center">
                    <span className="xl:text-3xl lg:text-xl text-base text-white">
                      <span className="font-bold">{props.activeSet ? props.activeSet?.teamOneScore : 0}</span>
                      &nbsp;&nbsp;&nbsp;
                      {props.state.tournamentTeamOneScore ? props.state.tournamentTeamOneScore : 0}
                      &nbsp;(3)&nbsp;
                      {props.state.tournamentTeamTwoScore ? props.state.tournamentTeamTwoScore : 0}
                      &nbsp;&nbsp;&nbsp;
                      <span className="font-bold">{props.activeSet ? props.activeSet?.teamTwoScore : 0}</span>
                    </span>
                  </div>
                ) : (
                  <div className="col-span-2 flex justify-center items-center">
                    {' '}
                    <span className="xl:text-3xl lg:text-xl text-base text-white">
                      <span className={'font-bold'}>{props.activeSet ? props.state.teamOneScore : 0}</span>
                      &nbsp;({props.timeLeft})&nbsp;
                      <span className={'font-bold'}>{props.activeSet ? props.state.teamTwoScore : 0}</span>
                    </span>
                  </div>
                )}

                <div className="col-span-5 text-right flex gap-2 justify-end items-center">
                  <small className="text-white xl:text-3xl lg:text-xl text-base whitespace-nowrap uppercase font-bold">
                    {props.state.tournamentTeamTwoabb && props.state.sport === 'SNOOKER'
                      ? props.state.tournamentTeamTwoabb
                      : ''}{' '}
                    <span className={props.state.isTeamTwoHandicapApplied === true ? 'line-through' : ''}>
                      {props.state.teamTwoHandicap}
                    </span>{' '}
                    {props.state.sideTwoPlayerOne.name}
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="flex items-end">
              {props.state.tournamentLogo ? (
                <img
                  className="lg:h-14 lg:w-14 xl:h-24 xl:w-24 h-8 w-8 aspect-square object-cover rounded-full"
                  src={props.state.teamTwoLogo ? props.state.teamTwoLogo : '/images/user-dummy-pic.png'}
                />
              ) : (
                <></>
              )}
              {props.state.tournamentLogo === null ? (
                <img
                  className="lg:h-14 lg:w-14 xl:h-24 xl:w-24 h-8 w-8 aspect-square object-cover rounded-full"
                  src={
                    props.state.sideTwoPlayerOne.profilePhoto
                      ? props.state.sideTwoPlayerOne.profilePhoto
                      : '/images/user-dummy-pic.png'
                  }
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
