import Lottie from 'lottie-react';
import animationData from './snooker.json';

const SnookerAnimation = () => {
  return (
    <div>
      <Lottie className='rotate-90 h-24' animationData={animationData} loop={true} />
    </div>
  );
};

export default SnookerAnimation;
