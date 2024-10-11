import { Player } from '@/stores/types';
import clsx from 'clsx';

interface ScoreBoardTeamCardProps {
  playerOne: Player;
  playerTwo: Player | null;
  score: number;
  break: number;
  activePlayerId: string | null;
}

export function ScoreBoardTeamCard(props: ScoreBoardTeamCardProps) {
  const isPlayerOneActive = props.playerOne.id === props.activePlayerId;
  const isPlayerTwoActive = props.playerTwo && props.playerTwo.id === props.activePlayerId;

  return (
    <div
      className={clsx('rounded-md p-2 flex flex-col items-center gap-2 w-full', {
        'bg-lightSecondary': !(isPlayerOneActive || isPlayerTwoActive),
        'bg-primary': isPlayerOneActive || isPlayerTwoActive,
      })}
    >
      <div className="flex-grow flex flex-col justify-start items-center gap-2 min-h-24">
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
          <img src={props.playerOne.profilePhoto ? props.playerOne.profilePhoto : ''} />
        )}
      </div>
      <h3 className="text-white text-6xl">{props.score}</h3>
      {isPlayerOneActive || isPlayerTwoActive ? <div className="text-white text-xl">{props.break} Break</div> : <></>}

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
          {props.playerOne.name}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
