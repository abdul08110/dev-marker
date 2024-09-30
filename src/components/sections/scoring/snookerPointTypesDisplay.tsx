import { SnookerPointType } from '@/stores/types';
import clsx from 'clsx';

interface SnookerPointTypeDisplayProps {
  activeTurnPointTypes: SnookerPointType[];
}

export function SnookerPointTypeDisplay(props: SnookerPointTypeDisplayProps) {
  const pointTypeToColorClass = {
    [SnookerPointType.YELLOW]: 'bg-yellow-500',
    [SnookerPointType.GREEN]: 'bg-green-500',
    [SnookerPointType.RED]: 'bg-red-500',
    [SnookerPointType.FOUL]: 'bg-gray-500',
    [SnookerPointType.BROWN]: 'bg-yellow-900',
    [SnookerPointType.BLUE]: 'bg-blue-500',
    [SnookerPointType.PINK]: 'bg-pink-500',
    [SnookerPointType.BLACK]: 'bg-black',
    [SnookerPointType.MISSED_POT]: 'bg-gray-500',
    [SnookerPointType.PLAY_SAFE]: 'bg-gray-500',
  };

  return (
    <div className="w-full flex flex-wrap gap-1 justify-center">
      {props.activeTurnPointTypes.map((value, index) => (
        <div key={index} className={clsx('w-4 h-4 rounded-full', pointTypeToColorClass[value])}></div>
      ))}
    </div>
  );
}
