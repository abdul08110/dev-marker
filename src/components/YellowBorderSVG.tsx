const YellowBorderSVG = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      width="705"
      height="820"
      viewBox="0 0 705 820"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <g filter="url(#filter0_d_759_4397)">
        <rect
          x="20.7998"
          y="17.8008"
          width="663"
          height="778"
          rx="60"
          fill="black"
          fill-opacity="0.01"
          shape-rendering="crispEdges"
        />
        <rect
          x="23.7998"
          y="20.8008"
          width="657"
          height="772"
          rx="57"
          stroke="url(#paint0_linear_759_4397)"
          stroke-width="6"
          shape-rendering="crispEdges"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_759_4397"
          x="-0.00019455"
          y="0.000782013"
          width="704.6"
          height="819.6"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="3" />
          <feGaussianBlur stdDeviation="10.4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.862745 0 0 0 0 0.968627 0 0 0 0 0.337255 0 0 0 1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_759_4397" />
          <feBlend
            mode="normal"
            in="BackgroundImageFix"
            in2="effect1_dropShadow_759_4397"
            result="BackgroundImageFix"
          />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        </filter>
        <linearGradient
          id="paint0_linear_759_4397"
          x1="163.3"
          y1="-103.484"
          x2="870.206"
          y2="751.493"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#D5FF9A" stop-opacity="0.02" />
          <stop offset="0.319144" stop-color="#C1F052" />
          <stop offset="0.541089" stop-color="#AAEA4B" />
          <stop offset="0.851444" stop-color="#B7F47B" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default YellowBorderSVG;
