import { SnookerPointType } from '@/stores/types';
import clsx from 'clsx';

interface SnookerPointTypeDisplayProps {
  activeTurnPointTypes: SnookerPointType[][];
  class?: string;
  isBig?: boolean;
  rotateBalls?: boolean;
  scaleBasedOnheight?: boolean;
  className?: string;
  align?: 'start' | 'center';
  isActive?: boolean;
}

const pointTypeToImageSrc: Partial<Record<SnookerPointType, string>> = {
  [SnookerPointType.RED]: '/images/balls/red-ball.svg',
  [SnookerPointType.YELLOW]: '/images/balls/yellow-ball.svg',
  [SnookerPointType.GREEN]: '/images/balls/green-ball.svg',
  [SnookerPointType.BROWN]: '/images/balls/brown-ball.svg',
  [SnookerPointType.BLUE]: '/images/balls/blue-ball.svg',
  [SnookerPointType.PINK]: '/images/balls/pink-ball.svg',
  [SnookerPointType.BLACK]: '/images/balls/black-ball.svg',
  [SnookerPointType.FOUL]: '/images/balls/foul-ball.svg',
};

const hiddenTypes = new Set([SnookerPointType.MISSED_POT, SnookerPointType.PLAY_SAFE]);

export function hasVisibleSnookerPoints(turnPointTypes: SnookerPointType[][]): boolean {
  return turnPointTypes.some((turnPoints) => turnPoints.some((pointType) => !hiddenTypes.has(pointType)));
}

export function SnookerPointTypeDisplay(props: SnookerPointTypeDisplayProps) {
  const flattenedPoints = props.activeTurnPointTypes.flatMap((turnPoints, turnIndex) => {
    const visiblePoints = turnPoints.filter((pointType) => !hiddenTypes.has(pointType));

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

  if (flattenedPoints.length === 0) {
    return null;
  }

  return (
    <div
      className={clsx(
        'w-full flex flex-wrap items-center',
        props.align === 'start' ? 'justify-start' : 'justify-center',
        props.class,
      )}
    >
      {flattenedPoints.map((item, index) => {
        if (item.isSeparator) {
          return (
            <div key={`separator-${index}`} className={clsx('text-white items-center w-fit px-px', props.className)}>
              |
            </div>
          );
        }

        if ('pointType' in item) {
          const { pointType } = item;
          const src = pointTypeToImageSrc[pointType];
          return (
            <img
              key={`point-${index}`}
              src={src}
              alt={pointType}
              className={clsx('h-4 w-4 object-contain', { 'rotate-90': props.rotateBalls }, props.className)}
            />
          );
        }
      })}
    </div>
  );
}
