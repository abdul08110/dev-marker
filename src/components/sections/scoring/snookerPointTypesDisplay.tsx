import { SnookerPointType } from '@/stores/types';
import clsx from 'clsx';

interface SnookerPointTypeDisplayProps {
  activeTurnPointTypes: SnookerPointType[];
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
    <div className={clsx('w-full flex flex-wrap gap-1 justify-center', props.class)}>
      {props.activeTurnPointTypes.map((value, index) => (
        <div key={index} className={clsx('rounded-full', pointTypeToColorClass[value], `${props.isBig ? 'h-8 w-8' : 'h-4 w-4'}`)}></div>
      ))}
    </div>
  );
}
