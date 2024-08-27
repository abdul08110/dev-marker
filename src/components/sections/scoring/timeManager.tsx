import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

export interface TimeManagerHandle {
    startTimer: () => void;
    pauseTimer: () => void;
    resetTimer: (newTime: number) => void;
}

interface TimeManagerProps {
    initialTime: number;
    onTimerComplete?: () => void;
}

const TimeManager = forwardRef<TimeManagerHandle, TimeManagerProps>(({ initialTime, onTimerComplete }, ref) => {
    const [timeLeft, setTimeLeft] = useState(initialTime * 60);
    const timerInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setTimeLeft(initialTime * 60);
        stopTimer();

        return () => stopTimer();
    }, [initialTime]);

    useImperativeHandle(ref, () => ({
        startTimer,
        pauseTimer,
        resetTimer: (newTime: number) => {
            setTimeLeft(newTime * 60);
        },
    }));

    const startTimer = () => {
        if (timerInterval.current) return;
        timerInterval.current = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    stopTimer();
                    if (onTimerComplete) {
                        onTimerComplete();
                    }
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    const pauseTimer = () => {
        if (timerInterval.current) {
            clearInterval(timerInterval.current);
            timerInterval.current = null;
        }
    };

    const stopTimer = () => {
        if (timerInterval.current) {
            clearInterval(timerInterval.current);
            timerInterval.current = null;
        }
    };

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full flex justify-center items-center">
            <div className="bg-lightPrimary p-3 text-white">
                <small>Time Left (min): <strong>{formatTime(timeLeft)}</strong></small>
            </div>
        </div>
    );
});

TimeManager.displayName = 'TimeManager';

export default TimeManager;