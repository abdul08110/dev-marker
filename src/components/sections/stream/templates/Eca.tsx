import ImageWithFallback from '@/components/ui/image-with-fallback';
import { Player, Turn } from '@/stores/types';

interface EcaTemplateProps {
  teamOneLogo: string | null;
  teamTwoLogo: string | null;
  activePlayerId: string | null;
  activeTurn: Turn | null;
  tournamentName: string;
  sideOnePlayerOne: Player;
  sideTwoPlayerOne: Player;
  isTeamOneHandicapApplied: boolean;
  isTeamTwoHandicapApplied: boolean;
  teamOneHandicap: number;
  teamTwoHandicap: number;
  maxScorePerSet: number;
  teamOneScore: number | null;
  teamTwoScore: number | null;
}

export function EcaTemplate(props: EcaTemplateProps) {
  return (
    <div className="absolute bottom-0 flex flex-col items-center w-full bg-white">
      <div className="w-full h-auto bg-transparent flex justify-center">
        <div className="flex px-1 w-full gap-1 h-full justify-center">
          <div className="flex items-end lg:p-2">
            <ImageWithFallback
              fallback="/images/user-dummy-pic.jpg"
              className="lg:h-14 lg:w-14 xl:h-24 xl:w-24 h-8 w-8 aspect-square object-cover rounded-full"
              src={props.teamOneLogo ? props.teamOneLogo : '/images/user-dummy-pic.jpg'}
            />
          </div>

          <div className="flex-grow relative flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center w-full">
              <div className="w-full grid grid-cols-3 lg:p-2 p-1">
                <div className="col-span-1 flex justify-start items-end">
                  {props.activePlayerId === props.sideOnePlayerOne.id && (
                    <h5 className="xl:text-xl lg:text-base text-base text-black font-bold text-left uppercase whitespace-nowrap">
                      Break {props.activeTurn ? props.activeTurn.score : 0}
                    </h5>
                  )}
                </div>

                <div className="col-span-1">
                  <h5 className="xl:text-xl text-center lg:text-base text-base text-black font-bold uppercase whitespace-nowrap">
                    {props.tournamentName}
                  </h5>
                </div>

                <div className="col-span-1 flex justify-end items-end">
                  {props.activePlayerId === props.sideTwoPlayerOne.id && (
                    <h5 className="xl:text-xl lg:text-base text-base text-black font-bold text-right uppercase whitespace-nowrap">
                      Break {props.activeTurn ? props.activeTurn?.score : 0}
                    </h5>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-12 justify-center bg-primary border border-white w-full rounded-md items-center px-2">
                <div className="col-span-4 flex gap-2 items-center">
                  <small className="text-white xl:text-3xl lg:text-xl text-base whitespace-nowrap uppercase font-bold">
                    {props.sideOnePlayerOne.name}{' '}
                    <span
                      className={
                        props.isTeamOneHandicapApplied === true ? 'line-through decoration-red-500 decoration-4' : ''
                      }
                    >
                      {props.teamOneHandicap}
                    </span>
                  </small>
                </div>

                <div className="col-span-4 flex justify-center items-center">
                  {' '}
                  <span className="xl:text-3xl lg:text-xl text-base text-white">
                    <span className={'font-bold'}>{props.teamOneScore && props.teamOneScore}</span>
                    &nbsp;({props.maxScorePerSet} UP)&nbsp;
                    <span className={'font-bold'}>{props.teamTwoScore && props.teamTwoScore}</span>
                  </span>
                </div>

                <div className="col-span-4 text-right flex gap-2 justify-end items-center">
                  <small className="text-white xl:text-3xl lg:text-xl text-base whitespace-nowrap uppercase font-bold">
                    <span
                      className={
                        props.isTeamTwoHandicapApplied === true ? 'line-through decoration-red-500 decoration-4' : ''
                      }
                    >
                      {props.teamTwoHandicap}
                    </span>{' '}
                    {props.sideTwoPlayerOne.name}
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end lg:p-2">
            <div className="flex items-end">
              <ImageWithFallback
                fallback="/images/user-dummy-pic.jpg"
                className="lg:h-14 lg:w-14 xl:h-24 xl:w-24 h-8 w-8 aspect-square object-cover rounded-full"
                src={props.teamTwoLogo ? props.teamTwoLogo : '/images/user-dummy-pic.jpg'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
