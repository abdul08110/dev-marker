import { ballsToPointsEnum } from '@/stores/selectors/snookerSelector';
import { SnookerPointType } from '@/stores/types';
import clsx from 'clsx';

interface SnookerPointTypeDisplayProps {
  activeTurnPointTypes: SnookerPointType[][];
  class?: string;
  isBig?: boolean;
  rotateBalls?: boolean;
  scaleBasedOnheight?: boolean;
  className?: string;
}

export function SnookerPointTypeDisplay(props: SnookerPointTypeDisplayProps) {
  const pointTypeToColorClass = {
    [SnookerPointType.YELLOW]: 'bg-[radial-gradient(62.67%_50%_at_50%_50%,theme(colors.yellow.500)_0%,#996600_100%)]',
    [SnookerPointType.GREEN]: 'bg-[radial-gradient(62.67%_50%_at_50%_50%,theme(colors.green.500)_0%,#004400_100%)]',
    [SnookerPointType.RED]: 'bg-[radial-gradient(62.67%_50%_at_50%_50%,theme(colors.red.500)_0%,#990000_100%)]',
    [SnookerPointType.FOUL]: 'bg-[radial-gradient(62.67%_50%_at_50%_50%,theme(colors.gray.200)_0%,#cccccc_100%)]',
    [SnookerPointType.BROWN]: 'bg-[radial-gradient(62.67%_50%_at_50%_50%,theme(colors.yellow.900)_0%,#4d2b00_100%)]',
    [SnookerPointType.BLUE]: 'bg-[radial-gradient(62.67%_50%_at_50%_50%,theme(colors.blue.500)_0%,#001a66_100%)]',
    [SnookerPointType.PINK]: 'bg-[radial-gradient(62.67%_50%_at_50%_50%,theme(colors.pink.500)_0%,#660033_100%)]',
    [SnookerPointType.BLACK]: 'bg-[radial-gradient(62.67%_50%_at_50%_50%,theme(colors.black)_0%,#111111_100%)]',
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
      className={clsx('w-full flex flex-wrap justify-center items-center', props.class)}
    >
      {flattenedPoints.map((item, index) => {
        if (item.isSeparator) {
          return (
            <div
              key={`separator-${index}`}
              className={clsx('text-white items-center w-2', props.className)}
            >
              |
            </div>
          );
        }

        if ('pointType' in item) {
          const { pointType } = item;
          return (
            <div
              key={`point-${index}`}
              className={clsx(
                'rounded-full flex justify-center items-center font-bold h-4 w-4',
                pointTypeToColorClass[pointType],
                {
                  'rotate-90': props.rotateBalls,
                },
                props.className,
                {
                  'text-black': pointType === SnookerPointType.FOUL,
                  'text-white': pointType !== SnookerPointType.FOUL,
                }
              )}
            >
              <span>{pointType === SnookerPointType.FOUL ? 'F' : ballsToPointsEnum[pointType]}</span>
            </div>
          );
        }
      })}
    </div>
  );
}
