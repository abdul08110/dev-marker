import React from 'react';
import { SVGProps } from './type';

const PauseLogo: React.FC<SVGProps> = ({ className }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 6 10" className={className} id="pause">
      <path
        fill='currentColor'
        fill-rule="evenodd"
        d="M1 0a1 1 0 0 0-1 1v6a1 1 0 0 0 2 0V1a1 1 0 0 0-1-1m5 1v6a1 1 0 0 1-2 0V1a1 1 0 0 1 2 0"
      ></path>
    </svg>
  );
};

export default PauseLogo;
