import { Card } from '@/components/ui/card';
import { StreamingState } from '@/hooks/useStreaming';
import { calculateStatsForTeam, getActiveSet, getActiveTurn } from '@/stores/selectors/commonSport';
import { generatePlayerName } from '@/utils/functions';
import clsx from 'clsx';
import ImageWithFallback from '@/components/ui/image-with-fallback';
import { SnookerPointTypeDisplay } from '../scoring/snookerPointTypesDisplay';
import { getSnookerPointTypesByTurns } from '@/stores/selectors/snookerSelector';

interface PortraitStreamDataProps {
  state: StreamingState | null;
  timeLeft: number;
}

export function PortraitView(props: PortraitStreamDataProps) {
  const activeSet = getActiveSet(props.state ? props.state.sets : []);
  const activeTurn = getActiveTurn(activeSet);
  const isTeamOneActive = props.state ? props.state.sideOnePlayerOne.id === props.state.activePlayerId : false;
  const isTeamTwoActive = props.state ? props.state.sideTwoPlayerOne.id === props.state.activePlayerId : false;

  const teamOneStats = calculateStatsForTeam(
    [props.state?.sideOnePlayerOne.id || '', props.state?.sideOnePlayerTwo?.id || ''],
    props.state?.sets || [],
  );
  const teamTwoStats = calculateStatsForTeam(
    [props.state?.sideTwoPlayerOne.id || '', props.state?.sideTwoPlayerTwo?.id || ''],
    props.state?.sets || [],
  );

  if (!props.state) {
    return <></>;
  }

  return (
    <div className="flex-grow overflow-y-scroll flex flex-col px-2 gap-2 mt-2 mb-2">
      <div className="grid grid-cols-1 w-full mx-auto rounded-md overflow-hidden">
        <div className="bg-[#2B2B2B] p-2 flex items-center justify-center">
          <span className="text-white font-bold text-2xl">
            {activeSet ? props.state.teamOneScore : 0} ({' '}
            {props.state.tournamentId !== null
              ? props.state.sets.length
              : props.state.eventFormat === 'TEAMS'
                ? props.state.tournamentSubItem?.tournamentItem.tournamentPhase.tournamentFormats.length
                : props.state.noOfFrames}
            ) {activeSet ? props.state.teamTwoScore : 0}
          </span>
        </div>
      </div>

      <Card className={clsx('p-2 rounded-md bg-[#141414] border-0 flex flex-col gap-3')}>
        <div className="grid grid-cols-2 gap-2">
          <div
            className={clsx('col-span-1 overflow-auto rounded-md text-center flex flex-col gap-2 text-white p-4', {
              'bg-[#1F1F1F]': !isTeamOneActive,
              'bg-[#9B36BA]': isTeamOneActive,
            })}
          >
            {/* {props.state.teamOneName && <span className="font-bold text-xs">{props.state.teamOneName}</span>} */}
            <div className="w-full flex justify-between items-start">
              <ImageWithFallback
                className="aspect-square rounded overflow-hidden border-white w-12 h-12 object-cover"
                fallback="/images/user-dummy-pic.png"
                src={
                  props.state.teamOneLogo
                    ? props.state.teamOneLogo
                    : props.state.sideOnePlayerOne.profilePhoto
                      ? props.state.sideOnePlayerOne.profilePhoto
                      : '/images/user-dummy-pic.png'
                }
              ></ImageWithFallback>

              <span className="text-white text-4xl font-bold">{activeSet && activeSet.teamOneScore}</span>
            </div>

            <div className="w-full flex flex-col gap-1 text-left font-bold uppercase text-sm">
              <span>
                {' '}
                {generatePlayerName(
                  props.state.sideOnePlayerOne.name,
                  props.state.sideOnePlayerTwo ? props.state.sideOnePlayerTwo.name : undefined,
                )}
              </span>
              {props.state.teamOneLogo || props.state.teamOneName ? (
                <span className="text-white text-xs opacity-60">{props.state.teamOneName}</span>
              ) : (
                <></>
              )}
            </div>

            <div className="w-full flex justify-between items-center mt-4">
              {props.state.teamOneHandicap ? (
                <span className="text-white text-lg font-bold bg-white bg-opacity-15 w-fit px-2 py-1 rounded-md">
                  {props.state.teamOneHandicap && props.state.teamOneHandicap > 0 ? '+' : ''}
                  {props.state.teamOneHandicap}
                </span>
              ) : (
                <></>
              )}

              {isTeamOneActive && (
                <span className="text-white text-md font-bold">BREAK {activeTurn && activeTurn.score}</span>
              )}
            </div>
          </div>

          <div
            className={clsx('col-span-1 overflow-auto rounded-md text-center flex flex-col gap-2 text-white p-4', {
              'bg-[#1F1F1F]': !isTeamTwoActive,
              'bg-[#9B36BA]': isTeamTwoActive,
            })}
          >
            {/* {props.state.teamOneName && <span className="font-bold text-xs">{props.state.teamOneName}</span>} */}
            <div className="w-full flex justify-between items-start">
              <ImageWithFallback
                className="aspect-square rounded overflow-hidden border-white w-12 h-12 object-cover"
                fallback="/images/user-dummy-pic.png"
                src={
                  props.state.teamTwoLogo
                    ? props.state.teamTwoLogo
                    : props.state.sideTwoPlayerOne.profilePhoto
                      ? props.state.sideTwoPlayerOne.profilePhoto
                      : '/images/user-dummy-pic.png'
                }
              ></ImageWithFallback>

              <span className="text-white text-4xl font-bold">{activeSet && activeSet.teamTwoScore}</span>
            </div>

            <div className="w-full flex flex-col gap-1 text-left font-bold uppercase text-sm">
              <span>
                {' '}
                {generatePlayerName(
                  props.state.sideTwoPlayerOne.name,
                  props.state.sideTwoPlayerTwo ? props.state.sideTwoPlayerTwo.name : undefined,
                )}
              </span>
              {props.state.teamTwoLogo || props.state.teamTwoName ? (
                <span className="text-white text-xs opacity-60">{props.state.teamTwoName}</span>
              ) : (
                <></>
              )}
            </div>

            <div className="w-full flex justify-between items-center mt-4">
              {props.state.teamTwoHandicap ? (
                <span className="text-white text-lg font-bold bg-white bg-opacity-15 w-fit px-2 py-1 rounded-md">
                  {props.state.teamTwoHandicap && props.state.teamTwoHandicap > 0 ? '+' : ''}
                  {props.state.teamTwoHandicap}
                </span>
              ) : (
                <></>
              )}

              {isTeamTwoActive && (
                <span className="text-white text-md font-bold">BREAK {activeTurn && activeTurn.score}</span>
              )}
            </div>
          </div>
        </div>

        {props.state.sport === 'SNOOKER' && props.state && (
          <div className="grid grid-cols-2 w-full gap-2">
            <div className="grid-cols-1 bg-[#2B2B2B] p-2 rounded-md">
              <SnookerPointTypeDisplay
                class={'gap-[0.3rem]'}
                className={'text-[0.8rem] font-mono h-5 w-5 flex justify-center'}
                activeTurnPointTypes={getSnookerPointTypesByTurns(
                  activeSet?.turns?.filter((value) =>
                    [props.state!.sideOnePlayerOne, props.state!.sideOnePlayerTwo].some(
                      (player) => player && value.turnPlayerId === player.id,
                    ),
                  ) || [],
                )}
              />
            </div>
            <div className="grid-cols-1 bg-[#2B2B2B] p-2 rounded-md">
              <SnookerPointTypeDisplay
                class={'gap-[0.3rem]'}
                className={'text-[0.8rem] font-mono h-5 w-5 flex justify-center'}
                activeTurnPointTypes={getSnookerPointTypesByTurns(
                  activeSet?.turns?.filter((value) =>
                    [props.state!.sideTwoPlayerOne, props.state!.sideTwoPlayerTwo].some(
                      (player) => player && value.turnPlayerId === player.id,
                    ),
                  ) || [],
                )}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 w-full gap-2 items-center">
          <div className="grid-cols-1 flex items-center">
            <div className=" bg-[#2B2B2B] border border-[#777777] p-1 rounded-md w-20 flex items-center justify-center">
              <span className="text-white font-bold text-lg text-center">{teamOneStats.highestBreak}</span>
            </div>
            <hr className="w-full border-[#777777]" />
          </div>
          <span className="text-white uppercase text-xs text-center w-full">Highest Break</span>
          <div className="grid-cols-1 flex items-center">
            <hr className="w-full border-[#777777]" />
            <div className=" bg-[#2B2B2B] border border-[#777777] p-1 rounded-md w-20 flex items-center justify-center">
              <span className="text-white font-bold text-lg text-center">{teamTwoStats.highestBreak}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
