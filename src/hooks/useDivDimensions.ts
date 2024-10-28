import { useState, useEffect, useRef, RefObject } from 'react';

interface Dimensions {
  width: number;
  offsetBottom: number;
}

function useDivDimensions<T extends HTMLElement>(): [RefObject<T>, Dimensions] {
  const ref = useRef<T>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, offsetBottom: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const offsetBottom = window.innerHeight - rect.bottom;
        
        setDimensions({ width, offsetBottom });
      }
    };

    updateDimensions();

    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return [ref, dimensions];
}

export default useDivDimensions;