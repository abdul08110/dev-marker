const YellowBorderSVG = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      viewBox="0 0 705 668"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M642.8 659.615V660.8H62.8V659.615H642.8ZM696.8 595.632V66.9676C696.8 31.6308 672.623 2.98467 642.8 2.98467H62.8C32.9767 2.98467 8.80006 31.6308 8.80005 66.9676V595.632C8.80005 630.969 32.9767 659.615 62.8 659.615V660.8C32.4244 660.8 7.80005 631.623 7.80005 595.632V66.9676C7.80006 30.9764 32.4244 1.7998 62.8 1.7998H642.8C673.176 1.7998 697.8 30.9764 697.8 66.9676V595.632C697.8 631.623 673.176 660.8 642.8 660.8V659.615C672.623 659.615 696.8 630.969 696.8 595.632Z"
        fill="white"
      />
      <g filter="url(#yellow_filter)">
        <rect
          x="20.8"
          y="17.7998"
          width="663"
          height="626"
          rx="60"
          fill="black"
          fillOpacity="0.01"
          shapeRendering="crispEdges"
        />
        <rect
          x="23.8"
          y="20.7998"
          width="657"
          height="620"
          rx="57"
          stroke="url(#yellow_grad)"
          strokeWidth="6"
          shapeRendering="crispEdges"
        />
      </g>
      <defs>
        <filter
          id="yellow_filter"
          x="0"
          y="0"
          width="704.6"
          height="667.6"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="3" />
          <feGaussianBlur stdDeviation="10.4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.862745 0 0 0 0 0.968627 0 0 0 0 0.337255 0 0 0 1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="BackgroundImageFix" in2="effect1_dropShadow" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        </filter>
        <linearGradient id="yellow_grad" x1="163.3" y1="-79.7896" x2="697.436" y2="723.089" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D5FF9A" stopOpacity="0.02" />
          <stop offset="0.319144" stopColor="#C1F052" />
          <stop offset="0.541089" stopColor="#AAEA4B" />
          <stop offset="0.851444" stopColor="#B7F47B" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default YellowBorderSVG;
