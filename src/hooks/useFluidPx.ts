import { useEffect, useState } from 'react';

export function useFluidPx(factor: number) {
  const [px, setPx] = useState(() => Math.round(Math.min(window.innerHeight, window.innerWidth) * factor));
  useEffect(() => {
    const update = () => setPx(Math.round(Math.min(window.innerHeight, window.innerWidth) * factor));
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [factor]);
  return px;
}
