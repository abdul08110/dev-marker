import { ballsToPointsEnum } from '@/stores/selectors/snookerSelector';
import { SnookerPointType } from '@/stores/types';
import clsx from 'clsx';

interface SnookerPointTypeDisplayProps {
  activeTurnPointTypes: SnookerPointType[][];
  class?: string;
  isBig: boolean;
  rotateBalls?: boolean;
  scaleBasedOnheight?: boolean;
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

  const flattenedPoints = props.activeTurnPointTypes.flatMap((turnPoints, turnIndex) => {
    const visiblePoints = turnPoints.filter((pointType) => pointTypeToColorClass[pointType] !== 'hidden');

    if (visiblePoints.length === 0) {
      return [];
    }

    const points = visiblePoints.map((pointType) => ({
      pointType,
      turnIndex,
      isSeparator: false,
    }));

    if (turnIndex !== props.activeTurnPointTypes.length - 1) {
      return [...points, { isSeparator: true }];
    }

    return points;
  });

  return (
    <div
      className={clsx('w-full flex flex-wrap justify-center items-center', props.class, {
        'gap-2': props.isBig,
        'gap-1': !props.isBig,
        'h-full': props.scaleBasedOnheight,
      })}
    >
      {flattenedPoints.map((item, index) => {
        if (item.isSeparator) {
          return (
            <div
              key={`separator-${index}`}
              className={clsx('text-white', {
                'text-xl': props.isBig,
                'text-base': !props.isBig,
              })}
            >
              /
            </div>
          );
        }

        if ('pointType' in item) {
          const { pointType } = item;
          return (
            <div
              key={`point-${index}`}
              className={clsx(
                'rounded-full text-white flex justify-center items-center font-bold',
                pointTypeToColorClass[pointType],
                {
                  'rotate-90': props.rotateBalls,
                  'h-8 w-8': props.isBig,
                  'h-4 w-4': !props.isBig,
                  'text-[0.5rem]': !props.isBig,
                  'h-[2vh] w-[2vh] aspect-square': props.scaleBasedOnheight
                },
              )}
            >
              <span className='text-[0.8em]'>{pointType === SnookerPointType.FOUL ? 'F' : ballsToPointsEnum[pointType]}</span>
            </div>
          );
        }
      })}
    </div>
  );
}
