import { Player, Turn } from '@/stores/types';
import clsx from 'clsx';
import { SnookerPointTypeDisplay } from '../scoring/snookerPointTypesDisplay';

interface ScoreBoardTeamCardProps {
  playerOne: Player;
  playerTwo: Player | null;
  score: number;
  activeTurn: Turn | null;
  activePlayerId: string | null;
  showBilliardsBall: 'YELLOW' | 'WHITE' | null;
  sport: 'SNOOKER' | 'BILLIARDS';
  orientation: 'portrait' | 'landscape';
}

export function ScoreBoardTeamCard(props: ScoreBoardTeamCardProps) {
  const isPlayerOneActive = props.playerOne.id === props.activePlayerId;
  const isPlayerTwoActive = props.playerTwo && props.playerTwo.id === props.activePlayerId;

  return (
    <div
      className={clsx('rounded-md p-2 items-center gap-2 w-full flex flex-col relative', {
        'bg-lightSecondary': !(isPlayerOneActive || isPlayerTwoActive),
        'bg-primary': isPlayerOneActive || isPlayerTwoActive,
      })}
    >
      <div className={`flex-grow flex flex-col justify-start items-center gap-2 min-h-24`}>
        {isPlayerOneActive || isPlayerTwoActive ? (
          <div className="px-4">
            <img
              src={
                isPlayerOneActive
                  ? props.playerOne.profilePhoto
                    ? props.playerOne.profilePhoto
                    : ''
                  : props.playerTwo!.profilePhoto
                    ? props.playerTwo!.profilePhoto
                    : ''
              }
              className="w-full aspect-square object-cover"
            />
          </div>
        ) : (
          <img src={props.playerOne.profilePhoto ? props.playerOne.profilePhoto : '/images/user-dummy-pic.png'} />
        )}
      </div>
      {(isPlayerOneActive || isPlayerTwoActive) && props.activeTurn && props.sport === 'SNOOKER' ? (
        <SnookerPointTypeDisplay
          activeTurnPointTypes={props.activeTurn.points.map((value) => value.snookerPoint!.type)}
        />
      ) : (
        <></>
      )}
      <h3 className="text-white text-6xl">{props.score}</h3>
      {(isPlayerOneActive || isPlayerTwoActive) && props.activeTurn ? (
        <div className="text-white text-xl">Break {props.activeTurn.score}</div>
      ) : (
        <></>
      )}

      <div
        className={clsx('flex justify-center items-center px-4 py-1 rounded truncate w-full', {
          'bg-lighterSecondary text-white': !(isPlayerOneActive || isPlayerTwoActive),
          'bg-white text-black': isPlayerOneActive || isPlayerTwoActive,
          'text-black/50': (isPlayerOneActive || isPlayerTwoActive) && isPlayerTwoActive,
          'text-black': (isPlayerOneActive || isPlayerTwoActive) && isPlayerOneActive,
        })}
      >
        {props.playerOne.name}
      </div>
      {props.playerTwo ? (
        <div
          className={clsx('flex justify-center items-center px-4 py-1 rounded truncate w-full', {
            'bg-lighterSecondary text-white': !(isPlayerOneActive || isPlayerTwoActive),
            'bg-white text-black': isPlayerOneActive || isPlayerTwoActive,
            'text-black/50': (isPlayerOneActive || isPlayerTwoActive) && isPlayerTwoActive,
            'text-black': (isPlayerOneActive || isPlayerTwoActive) && isPlayerOneActive,
          })}
        >
          {props.sport === 'BILLIARDS' && props.showBilliardsBall !== null ? (
            <img
              className="h-6 w-6 object-contain"
              src={props.showBilliardsBall === 'YELLOW' ? '/images/yellow-ball.png' : '/images/white-ball.png'}
            />
          ) : (
            <></>
          )}
          {props.playerOne.name}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
