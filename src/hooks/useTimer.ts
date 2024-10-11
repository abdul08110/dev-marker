import { useState, useRef, useEffect } from 'react';

function useTimer(initialTime: number, onTimerComplete?: () => void) {
    const [timeLeft, setTimeLeft] = useState(initialTime * 60);
    const timerInterval = useRef<NodeJS.Timeout | null>(null);

    const startTimer = () => {
        if (timerInterval.current) return;
        timerInterval.current = setInterval(() => {
            setTimeLeft((prevTime) => {
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

    const resetTimer = (newTime: number) => {
        setTimeLeft(newTime * 60);
        stopTimer();
    };

    const stopTimer = () => {
        if (timerInterval.current) {
            clearInterval(timerInterval.current);
            timerInterval.current = null;
        }
    };

    useEffect(() => {
        return () => stopTimer();
    }, []);

    return {
        timeLeft,
        setTimeLeft,
        startTimer,
        pauseTimer,
        resetTimer,
    };
}

export default useTimer;