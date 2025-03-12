import ImageWithFallback from '@/components/ui/image-with-fallback';
import { StreamingState } from '@/hooks/useStreaming';

interface SourceFinalScoresTemplateProps {
  state: StreamingState;
}

export function SourceWithFinalScores(props: SourceFinalScoresTemplateProps) {
  return (
    <div className="absolute bottom-0 flex flex-col items-center w-full">
      <div className="w-full h-auto bg-transparent flex justify-center">
        <div className="flex px-1 w-full gap-1 h-full justify-center">
          <div>
            {props.state.tournamentLogo ? (
              <ImageWithFallback
                fallback="/images/user-dummy-pic.png"
                className="lg:h-14 lg:w-14 xl:h-24 xl:w-24 h-8 w-8 aspect-square object-cover rounded-full"
                src={props.state.teamOneLogo ? props.state.teamOneLogo : '/images/user-dummy-pic.png'}
              />
            ) : (
              <></>
            )}
            {props.state.tournamentLogo === null ? (
              <ImageWithFallback
                fallback="/images/user-dummy-pic.png"
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
            <div className="grid grid-cols-12 justify-center bg-primary border border-white w-full rounded-md items-center px-2">
              <div className="col-span-4 flex gap-2 items-center">
                <small className="text-white xl:text-3xl lg:text-xl text-base whitespace-nowrap uppercase font-bold">
                  {props.state.sideOnePlayerOne.name}&nbsp;(
                  {props.state.tournamentTeamOneabb})
                </small>
              </div>

              <div className="col-span-4 text-center flex justify-center">
                <span className="xl:text-xl lg:text-xl text-base text-white">
                  <span className="font-bold">{props.state.teamOneScore}</span>
                  &nbsp;&nbsp;&nbsp;
                  <span className="uppercase font-bold">Final Scores</span>
                  &nbsp;&nbsp;&nbsp;
                  <span className="font-bold">{props.state.teamTwoScore}</span>
                </span>
              </div>

              <div className="col-span-4 text-right flex gap-2 justify-end items-center">
                <small className="text-white xl:text-3xl lg:text-xl text-base whitespace-nowrap uppercase font-bold">
                  ({props.state.tournamentTeamTwoabb})&nbsp;
                  {props.state.sideTwoPlayerOne.name}
                </small>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <div>
              {props.state.tournamentLogo ? (
                <ImageWithFallback
                  fallback="/images/user-dummy-pic.png"
                  className="lg:h-14 lg:w-14 xl:h-24 xl:w-24 h-8 w-8 aspect-square object-cover rounded-full"
                  src={props.state.teamTwoLogo ? props.state.teamTwoLogo : '/images/user-dummy-pic.png'}
                />
              ) : (
                <></>
              )}
              {props.state.tournamentLogo === null ? (
                <ImageWithFallback
                  fallback="/images/user-dummy-pic.png"
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
