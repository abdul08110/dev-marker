import React from 'react';
import { SVGProps } from './type';

const PlayLogo: React.FC<SVGProps> = ({ className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="none" id="play">
      <path
        fill="currentColor"
        d="M7 17.259V6.741a1 1 0 0 1 1.504-.864l9.015 5.26a1 1 0 0 1 0 1.727l-9.015 5.259A1 1 0 0 1 7 17.259Z"
      ></path>
    </svg>
  );
};

export default PlayLogo;
