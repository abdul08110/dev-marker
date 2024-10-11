import { useEffect } from 'react';

type BackButtonHandler = () => void;

const useBackButtonHandler = (onBackButtonClick: BackButtonHandler) => {
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      onBackButtonClick();
    };

    window.history.pushState(null, '', window.location.href);

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onBackButtonClick]);
};

export default useBackButtonHandler;