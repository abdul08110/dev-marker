import { Player, TournamentSubItem, Turn } from '@/stores/types';
import clsx from 'clsx';
import { SnookerPointTypeDisplay } from '../scoring/snookerPointTypesDisplay';
import { getSnookerPointTypesByTurns } from '@/stores/selectors/snookerSelector';
import { generatePlayerName, truncateText, convertHandicapToString } from '@/utils/functions';

interface ScoreBoardTeamCardProps {
  playerOne: Player;
  playerTwo: Player | null;
  score: number;
  activeTurn: Turn | null;
  activePlayerId: string | null;
  showBilliardsBall: 'YELLOW' | 'WHITE' | null;
  sport: 'SNOOKER' | 'BILLIARDS';
  contentfrom: 'top' | 'left';
  teamIndex: 0 | 1;
  tournamentTeamLogo: string | null;
  tournamentTeamName: string | null;
  tournamentId: string | null;
  teamHandicap: number | null;
  teamTurns: Turn[] | null;
  isHandicapApplied?: boolean;
  tournamentSubItem: TournamentSubItem | null;
}

export function ScoreBoardTeamCard(props: ScoreBoardTeamCardProps) {
  const isPlayerOneActive = props.playerOne.id === props.activePlayerId;
  const isPlayerTwoActive = props.playerTwo && props.playerTwo.id === props.activePlayerId;

  return (
    <div
      className={clsx('rounded-md gap-2 h-full w-full overflow-hidden col-span-1 relative pt-4 pb-4', {
        'bg-[#5E5E5E]': !(isPlayerOneActive || isPlayerTwoActive),
        'bg-primary': isPlayerOneActive || isPlayerTwoActive,
        'flex flex-col': props.contentfrom === 'top',
        'flex flex-row': props.contentfrom === 'left',
        'pr-32 pl-4': props.teamIndex === 0 && props.contentfrom === 'left',
        'pl-12 pr-12': props.teamIndex === 1 && props.contentfrom === 'left',
        'pl-4 pr-4': props.contentfrom === 'top',
      })}
    >
      {props.tournamentId === null || props.tournamentSubItem === null ? (
        <div
          className={clsx(`flex justify-center items-center gap-2 overflow-auto`, {
            'h-[30%]': props.contentfrom === 'top',
            'w-[30%]': props.contentfrom === 'left',
          })}
        >
          {isPlayerOneActive || isPlayerTwoActive ? (
            <img
              src={
                isPlayerOneActive
                  ? props.playerOne.profilePhoto
                    ? props.playerOne.profilePhoto
                    : '/images/user-dummy-pic.jpg'
                  : props.playerTwo!.profilePhoto
                    ? props.playerTwo!.profilePhoto
                    : '/images/user-dummy-pic.jpg'
              }
              className={clsx(' aspect-square object-cover rounded-full overflow-hidden', {
                '-rotate-90 w-full h-auto': props.contentfrom === 'left',
                'h-full w-auto': props.contentfrom === 'top',
              })}
            />
          ) : (
            <img
              className={clsx('aspect-square object-cover rounded-full overflow-hidden', {
                '-rotate-90 w-full h-auto': props.contentfrom === 'left',
                'h-full w-auto': props.contentfrom === 'top',
              })}
              src={props.playerOne.profilePhoto ? props.playerOne.profilePhoto : '/images/user-dummy-pic.jpg'}
            />
          )}
        </div>
      ) : (
        <div
          className={clsx(`flex justify-center items-center gap-2`, {
            'h-[30%]': props.contentfrom === 'top',
            'w-[30%]': props.contentfrom === 'left',
          })}
        >
          <img
            src={props.tournamentTeamLogo ? props.tournamentTeamLogo : '/images/user-dummy-pic.jpg'}
            className={clsx(' aspect-square object-cover rounded-full overflow-hidden', {
              '-rotate-90 w-full h-auto': props.contentfrom === 'left',
              'h-full w-auto': props.contentfrom === 'top',
            })}
          />
        </div>
      )}

      <div
        className={clsx('justify-center items-center', {
          'h-[50%] flex flex-col': props.contentfrom === 'top',
          'w-[50%] flex flex-row': props.contentfrom === 'left',
        })}
      >
        <div
          className={clsx({
            'h-[50%]': props.contentfrom === 'top',
            'w-[20%] h-full flex justify-center items-center rotate-180': props.contentfrom === 'left',
            hidden: props.sport === 'BILLIARDS',
          })}
        >
          {props.sport === 'SNOOKER' && props.teamTurns ? (
            <div className="w-full">
              <SnookerPointTypeDisplay
                isBig={true}
                scaleBasedOnheight={props.contentfrom === 'top'}
                class={clsx({ 'flex-col': props.contentfrom === 'left' })}
                activeTurnPointTypes={getSnookerPointTypesByTurns(props.teamTurns)}
                rotateBalls={props.contentfrom === 'left'}
              />
            </div>
          ) : (
            <div className="h-full w-full"></div>
          )}
        </div>
        <div
          className={clsx('text-white leading-[1] font-bold text-center', {
            'h-[30%] w-full': props.contentfrom === 'top',
            'w-[60%] h-full flex justify-center items-center': props.contentfrom === 'left',
          })}
          style={{ fontSize: props.contentfrom === 'top' ? 'clamp(0.5rem, 8vw, 10rem)' : 'clamp(1rem, 20vh, 30rem)' }}
        >
          <span
            className={clsx({
              '-rotate-90 inline-block': props.contentfrom === 'left',
              'text-green-500': props.isHandicapApplied === true,
            })}
          >
            {props.score}
          </span>
        </div>
        <div
          className={clsx('text-yellow-300 uppercase text-center', {
            'h-[20%] w-full py-2 flex justify-center items-center': props.contentfrom === 'top',
            'w-[20%] h-full flex justify-center items-center': props.contentfrom === 'left',
          })}
          style={{ fontSize: props.contentfrom === 'top' ? 'clamp(1rem, 2vw, 4rem)' : 'clamp(1rem, 10vh, 2rem)' }}
        >
          {(isPlayerOneActive || isPlayerTwoActive) && props.activeTurn ? (
            <span
              className={clsx({
                '-rotate-90 inline-block whitespace-nowrap': props.contentfrom === 'left',
              })}
            >
              Break {props.activeTurn.score}
            </span>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div
        className={clsx({
          'h-[30%] flex flex-col gap-4 justify-end w-full': props.contentfrom === 'top',
          'w-[20%] h-full flex flex-col gap-4 justify-center items-end': props.contentfrom === 'left',
        })}
      >
        <div
          style={{ fontSize: props.contentfrom === 'top' ? 'clamp(1rem, 3vw, 10rem)' : 'clamp(1rem, 3vw, 7rem)' }}
          className={clsx(
            'flex flex-col gap-1 items-center justify-center p-0 w-full font-bold text-white uppercase text-left text-nowrap',
            {
              'text-white/50': (isPlayerOneActive || isPlayerTwoActive) && isPlayerTwoActive,
              'h-fit max-h-[50%]': props.contentfrom === 'top',
              'w-full h-full max-w-[50%]': props.contentfrom === 'left',
            },
          )}
        >
          <div className="flex justify-start items-center">
            {props.sport === 'BILLIARDS' && props.showBilliardsBall !== null ? (
              <img
                className="h-10 w-10 object-contain"
                src={props.showBilliardsBall === 'YELLOW' ? '/images/yellow-ball.png' : '/images/white-ball.png'}
              />
            ) : (
              <></>
            )}
            <span
              className={clsx(
                {
                  '-rotate-90 inline-block whitespace-nowrap': props.contentfrom === 'left',
                },
                'text-center',
              )}
            >
              <span className="leading-[1px]">
                {truncateText(generatePlayerName(props.playerOne.name, props.playerTwo?.name))}
              </span>
              <span className={props.isHandicapApplied === true ? 'line-through ml-4' : 'ml-4'}>
                {props.teamHandicap ? `${convertHandicapToString(props.teamHandicap)}` : ''}
              </span>
            </span>
          </div>
          {/* {props.tournamentTeamName ? (
            <div>
              <span>{props.tournamentTeamName}</span>{' '}
            </div>
          ) : (
            <></>
          )} */}
        </div>
        {/* {props.playerTwo ? (
          <div
            style={{ fontSize: props.contentfrom === 'top' ? 'clamp(1rem, 2vw, 10rem)' : 'clamp(4rem, 40vw, 60rem)' }}
            className={clsx(
              'flex justify-center items-center h-fit p-2 w-full font-medium text-white uppercase text-left text-nowrap',
              {
                'text-white/50': (isPlayerOneActive || isPlayerTwoActive) && isPlayerTwoActive,
              },
            )}
          >
            {props.sport === 'BILLIARDS' && props.showBilliardsBall !== null ? (
              <img
                className="h-10 w-10 object-contain"
                src={props.showBilliardsBall === 'YELLOW' ? '/images/yellow-ball.png' : '/images/white-ball.png'}
              />
            ) : (
              <></>
            )}
            <span className='leading-[1px]'>
              {props.playerTwo.name.split(' ')[0]}
              <br />
              {props.playerTwo.name.split(' ')[1]}
            </span>{' '}
            {props.teamHandicap ? `+ ${props.teamHandicap}` : ''}
          </div>
        ) : (
          <></>
        )} */}
      </div>
    </div>
  );
}
