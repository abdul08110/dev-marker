import { Card } from '@/components/ui/card';
import { StreamingState } from '@/hooks/useStreaming';
import { getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import { generatePlayerName, truncateText } from '@/utils/functions';
import clsx from 'clsx';
import { SnookerPointTypeDisplay } from '../scoring/snookerPointTypesDisplay';
import { getSnookerPointTypesByTurns } from '@/stores/selectors/snookerSelector';
import ImageWithFallback from '@/components/ui/image-with-fallback';

interface PortraitStreamDataProps {
  state: StreamingState | null;
  timeLeft: number;
}

export function PortraitData(props: PortraitStreamDataProps) {
  const activeSet = getActiveSet(props.state ? props.state.sets : []);
  const activeTurn = getActiveTurn(activeSet);
  const isTeamOneActive = props.state ? props.state.sideOnePlayerOne.id === props.state.activePlayerId : false;
  const isTeamTwoActive = props.state ? props.state.sideTwoPlayerOne.id === props.state.activePlayerId : false;

  if (!props.state) {
    return <></>;
  }

  return (
    <div className="flex-grow overflow-y-scroll flex flex-col px-2 gap-2 mt-5 mb-5">
      <div className="uppercase text-white text-center font-bold text-sm">
        <span>
          {props.state.clubName} | Table {props.state.venueNo}
        </span>
      </div>
      <Card className="gap-4 border-white p-2 grid grid-cols-3 rounded-md">
        <div className="grid-cols-1 uppercase text-white font-bold text-sm text-left flex items-center justify-start gap-2">
          {props.state.sport === 'BILLIARDS' && (
            <img className="h-4 lg:h-5 xl:h-6 w-auto" src={'/images/yellow-ball.png'} />
          )}
          {truncateText(
            generatePlayerName(
              props.state.sideOnePlayerOne.name,
              props.state.sideOnePlayerTwo ? props.state.sideOnePlayerTwo.name : undefined,
            ),
          )}
        </div>
        <div className="grid-cols-1 flex text-center items-center justify-center gap-2 text-white font-bold text-sm">
          {props.state.sport === 'SNOOKER' ? (
            <>
              <span>{activeSet ? props.state.teamOneScore : 0}</span>
              <span>
                {' '}
                (
                {props.state.tournamentId &&
                props.state.tournamentSubItem! &&
                props.state.tournamentSubItem.gameFormat.isCumulativeScoring === false
                  ? props.state.tournamentSubItem.gameFormat.noOfSets
                  : props.state.sets.length}
                ){' '}
              </span>
              <span> {activeSet ? props.state.teamTwoScore : 0}</span>
            </>
          ) : (
            <>
              <span> ({props.state.format})</span>
            </>
          )}
        </div>
        <div className="grid-cols-1 uppercase text-white font-bold text-sm text-right flex items-center justify-end gap-2">
          {truncateText(
            generatePlayerName(
              props.state.sideTwoPlayerOne.name,
              props.state.sideTwoPlayerTwo ? props.state.sideTwoPlayerTwo.name : undefined,
            ),
          )}
          {props.state.sport === 'BILLIARDS' && (
            <img className="h-4 lg:h-5 xl:h-6 w-auto" src={'/images/white-ball.png'} />
          )}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2 flex-grow">
        <div
          className={clsx('col-span-1 overflow-auto rounded-md text-center flex flex-col gap-4 text-white p-4', {
            'bg-[#5E5E5E]': !isTeamOneActive,
            'bg-primary': isTeamOneActive,
          })}
        >
          {props.state.teamOneName && <span className="font-bold text-xs">{props.state.teamOneName}</span>}
          <div className="w-full flex justify-center items-center">
            <ImageWithFallback
              className="rounded-full border-white w-12 h-12 object-cover"
              fallback="/images/user-dummy-pic.png"
              src={
                props.state.teamOneLogo
                  ? props.state.teamOneLogo
                  : props.state.sideOnePlayerOne.profilePhoto
                    ? props.state.sideOnePlayerOne.profilePhoto
                    : '/images/user-dummy-pic.png'
              }
            ></ImageWithFallback>
          </div>
          <div className="flex flex-col w-full h-18">
            <span className="text-center text-white text-3xl font-bold">{activeSet && activeSet.teamOneScore}</span>
            {isTeamOneActive && (
              <span className="text-center text-white text-md font-bold">BREAK {activeTurn && activeTurn.score}</span>
            )}
          </div>

          <div className="mt-auto">
            {props.state.sport === 'SNOOKER' && props.state && (
              <SnookerPointTypeDisplay
                class={'gap-[0.1rem]'}
                className={'text-[0.5rem] size-1 flex justify-center'}
                activeTurnPointTypes={getSnookerPointTypesByTurns(
                  activeSet?.turns?.filter((value) =>
                    [props.state!.sideOnePlayerOne, props.state!.sideOnePlayerTwo].some(
                      (player) => player && value.turnPlayerId === player.id,
                    ),
                  ) || [],
                )}
              />
            )}
          </div>
        </div>
        <div
          className={clsx('col-span-1 overflow-auto rounded-md text-center flex flex-col gap-4 text-white p-4', {
            'bg-[#5E5E5E]': !isTeamTwoActive,
            'bg-primary': isTeamTwoActive,
          })}
        >
          {props.state.teamTwoName && <span className="font-bold text-xs">{props.state.teamTwoName}</span>}
          <div className="w-full flex justify-center items-center">
            <ImageWithFallback
              fallback="/images/user-dummy-pic.png"
              className="rounded-full border-white size-12 object-cover"
              src={
                props.state.teamTwoLogo
                  ? props.state.teamTwoLogo
                  : props.state.sideTwoPlayerOne.profilePhoto
                    ? props.state.sideTwoPlayerOne.profilePhoto
                    : '/images/user-dummy-pic.png'
              }
            ></ImageWithFallback>
          </div>

          <div className="flex flex-col w-full h-18">
            <span className="text-center text-white text-3xl font-bold">{activeSet && activeSet.teamTwoScore}</span>
            {isTeamTwoActive && (
              <span className="text-center text-white text-md font-bold">BREAK {activeTurn && activeTurn.score}</span>
            )}
          </div>

          <div className="mt-auto">
            {props.state.sport === 'SNOOKER' && props.state && (
              <SnookerPointTypeDisplay
                class={'gap-[0.1rem]'}
                className={'text-[0.5rem] size-1 flex justify-center'}
                activeTurnPointTypes={getSnookerPointTypesByTurns(
                  activeSet?.turns?.filter((value) =>
                    [props.state!.sideTwoPlayerOne, props.state!.sideTwoPlayerTwo].some(
                      (player) => player && value.turnPlayerId === player.id,
                    ),
                  ) || [],
                )}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
