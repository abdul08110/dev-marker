import { useState, useEffect } from 'react';

interface UseOnlineStatusOptions {
  onOnline?: () => void;
  onOffline?: () => void;
}

const useOnlineStatus = ({ onOnline, onOffline }: UseOnlineStatusOptions = {}) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (onOnline) onOnline();
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (onOffline) onOffline();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onOnline, onOffline]);

  return isOnline;
};

export default useOnlineStatus;