import { useState, useRef, useCallback, useEffect } from 'react';

interface UseStopWatchReturn {
  time: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  setTime: (newTime: number) => void;
}

const useStopWatch = (): UseStopWatchReturn => {
  const [time, setTimeState] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTimeState((prevTime) => prevTime + 10);
      }, 10);
    }
  }, [isRunning]);

  const pause = useCallback(() => {
    if (isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  }, [isRunning]);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimeState(0);
    setIsRunning(false);
  }, []);

  const setTime = useCallback((newTime: number) => {
    if (!isRunning) {
      setTimeState(newTime);
    }
  }, [isRunning]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { time: time, isRunning, start, pause, reset, setTime };
};

export default useStopWatch;