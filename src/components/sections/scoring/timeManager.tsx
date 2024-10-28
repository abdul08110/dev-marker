import React from 'react';
import clsx from 'clsx';

interface TimeManagerProps {
  timeLeft: number;
  size: 'small' | 'large';
  class?: string;
  componentClass?: string;
}

const TimeManager: React.FC<TimeManagerProps> = (props) => {
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={clsx('w-full flex justify-center items-center', props.class )}>
      <div className={clsx('bg-lightPrimary p-3 text-white', props.componentClass)}>
        {props.size === 'small' ? (
          <small>
            Time Left (min): <strong>{formatTime(props.timeLeft)}</strong>
          </small>
        ) : (
          <h4>
            Time Left (min): <strong>{formatTime(props.timeLeft)}</strong>
          </h4>
        )}
      </div>
    </div>
  );
};

export default TimeManager;
