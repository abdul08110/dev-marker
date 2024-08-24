import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

interface TimeManagerProps {
    initialTime: number;
    onTimerComplete: () => void;
}

export interface TimeManagerHandle {
    startTimer: () => void;
}

const TimeManager = forwardRef<TimeManagerHandle, TimeManagerProps>(({ initialTime, onTimerComplete }, ref) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isActive, setIsActive] = useState(false);

    useImperativeHandle(ref, () => ({
        startTimer() {
            setTimeLeft(initialTime);
            setIsActive(true);
        },
    }));

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            onTimerComplete();
        }

        return () => clearInterval(timer);
    }, [isActive, timeLeft, onTimerComplete]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="w-full flex justify-center items-center">
            <div className="bg-lightPrimary p-3 text-white">
                <small>Time Left (min): <strong>{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</strong></small>
            </div>
        </div>
    );
});

export default TimeManager;