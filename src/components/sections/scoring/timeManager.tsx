import React from 'react';

interface TimeManagerProps {
  timeLeft: number;
  size: 'small' | 'large';
}

const TimeManager: React.FC<TimeManagerProps> = ({ timeLeft, size = 'small' }) => {
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="bg-lightPrimary p-3 text-white">
        {size === 'small' ? (
          <small>
            Time Left (min): <strong>{formatTime(timeLeft)}</strong>
          </small>
        ) : (
          <h4>
            Time Left (min): <strong>{formatTime(timeLeft)}</strong>
          </h4>
        )}
      </div>
    </div>
  );
};

export default TimeManager;
