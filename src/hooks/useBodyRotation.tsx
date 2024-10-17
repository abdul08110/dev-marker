import { useState } from 'react';

const useBodyRotation = () => {
  const [rotation, setRotation] = useState(0);

  const rotateBody = () => {
    const newRotation = rotation + 90;
    setRotation(newRotation);

    document.body.style.transform = `rotate(${newRotation}deg)`;
    document.body.style.transformOrigin = 'center center';
  };

  return { rotation, rotateBody };
};

export default useBodyRotation;