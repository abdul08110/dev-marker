import clsx from 'clsx';

interface OnlineOfflineIndicatorProps {
  isOnline: boolean;
}

export function OnlineOfflineIndicator(props: OnlineOfflineIndicatorProps) {
  return (
    <div className="absolute right-1 top-1">
      <div className={clsx('rounded-full h-3 w-3', props.isOnline ? 'bg-green-500' : 'bg-red-500')}></div>
    </div>
  );
}
