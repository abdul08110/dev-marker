import { ballsToPointsEnum } from '@/stores/selectors/snookerSelector';
import { SnookerPointType } from '@/stores/types';
import clsx from 'clsx';

interface SnookerPointTypeDisplayProps {
  activeTurnPointTypes: SnookerPointType[][];
  class?: string;
  isBig: boolean;
}

export function SnookerPointTypeDisplay(props: SnookerPointTypeDisplayProps) {
  const pointTypeToColorClass = {
    [SnookerPointType.YELLOW]: 'bg-yellow-500',
    [SnookerPointType.GREEN]: 'bg-green-500',
    [SnookerPointType.RED]: 'bg-red-500',
    [SnookerPointType.FOUL]: 'bg-white',
    [SnookerPointType.BROWN]: 'bg-yellow-900',
    [SnookerPointType.BLUE]: 'bg-blue-500',
    [SnookerPointType.PINK]: 'bg-pink-500',
    [SnookerPointType.BLACK]: 'bg-black',
    [SnookerPointType.MISSED_POT]: 'hidden',
    [SnookerPointType.PLAY_SAFE]: 'hidden',
  };

  return (
    <div
      className={clsx('w-full flex flex-wrap justify-center', props.class, {
        'gap-2': props.isBig,
        'gap-1': !props.isBig,
      })}
    >
      {props.activeTurnPointTypes.map((turnPoints, turnIndex) => {
        const visiblePoints = turnPoints.filter((pointType) => pointTypeToColorClass[pointType] !== 'hidden');

        if (visiblePoints.length === 0) {
          return null;
        }

        return (
          <div
            key={turnIndex}
            className={clsx(
              'flex flex-wrap gap-1 items-center',

              {
                'gap-2': props.isBig,
                'gap-1': !props.isBig,
              },
            )}
          >
            {visiblePoints.map((pointType, pointIndex) => (
              <div
                key={pointIndex}
                className={clsx(
                  'rounded-full text-white flex justify-center items-center font-bold',
                  pointTypeToColorClass[pointType],
                  `${props.isBig ? 'h-8 w-8' : 'h-4 w-4'}`,
                )}
              >
                {props.isBig ? pointType === SnookerPointType.FOUL ? 'F' : ballsToPointsEnum[pointType] : <></>}
              </div>
            ))}
            {turnIndex !== props.activeTurnPointTypes.length - 1 && (
              <div
                className={clsx('text-white', {
                  'text-xl': props.isBig,
                  'text-base': !props.isBig,
                })}
              >
                /
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
