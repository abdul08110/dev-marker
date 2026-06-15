import React from 'react';

import ImageWithFallback from '@/components/ui/image-with-fallback';
import { StreamingState } from '@/hooks/useStreaming';
import { Set, Turn } from '@/stores/types';
import { convertHandicapToString, generatePlayerName } from '@/utils/functions';

interface GeneralTemplateProps {
  state: StreamingState;
  activeTurn: Turn | null;
  activeSet: Set | undefined;
  isTv: boolean;
}

const NewGeneral = (props: GeneralTemplateProps) => {
  return (
    <div className="absolute bottom-[min(1.5vh,1.5vw)] mx-[min(1.5vh,1.5vw)] flex flex-col items-center w-[calc(100%-min(3vh,3vw))] bg-[url(/score-card-bg-pattern.png)] bg-cover bg-center rounded-[min(3vh,3vw)] bg-black shadow-[0px_3px_20.8px_0px_#BA91C8]">
      <div className="w-full h-auto flex justify-between items-stretch px-[min(1.5vh,1.5vw)] py-[min(1.1vh,1.1vw)] gap-[min(1.5vh,1.5vw)] relative">
        {/* Top Banner */}
        <div className="absolute pointer-events-none w-full left-0 right-0 -top-1/4 flex justify-center items-center bg-transparent">
          <div className="relative flex justify-center items-center w-[min(76.5vh,76.5vw)]">
            <img src="/tournament-name-box.svg" alt="background pattern" className="w-full h-auto" />
            <p className="font-semibold text-white text-[min(2.2vh,2.2vw)] tracking-wider uppercase font-sans text-center align-baseline absolute inset-x-0 pt-[min(1.1vh,1.1vw)] truncate">
              Chandra bhatiya tournament 2026 | 15 red Singles
            </p>
          </div>
        </div>

        {/* Break Banner */}
        <div className="absolute left-[min(4.4vh,4.4vw)] -top-[min(4.1vh,4.1vw)]">
          <div className="relative w-[min(22.2vh,22.2vw)]">
            {/* SVG background — shape, gradients, inner shadow */}
            <svg
              viewBox="0 0 210 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            >
              <g filter="url(#filter0_i)">
                <path
                  d="M10.9493 13.9524C12.5076 7.13086 18.5754 2.29297 25.5726 2.29297H184.179C191.177 2.29297 197.244 7.13087 198.803 13.9524L206.876 49.293H2.87598L10.9493 13.9524Z"
                  fill="url(#paint0_linear)"
                  fillOpacity="0.6"
                />
                <path
                  d="M184.18 1.14648C191.712 1.14663 198.243 6.35448 199.92 13.6973L207.994 49.0381L208.313 50.4395H1.43848L1.75781 49.0381L9.83203 13.6973C11.5094 6.35448 18.0403 1.14664 25.5723 1.14648H184.18Z"
                  stroke="url(#paint1_linear)"
                  strokeWidth="2.29299"
                />
                <path
                  d="M184.18 1.14648C191.712 1.14663 198.243 6.35448 199.92 13.6973L207.994 49.0381L208.313 50.4395H1.43848L1.75781 49.0381L9.83203 13.6973C11.5094 6.35448 18.0403 1.14664 25.5723 1.14648H184.18Z"
                  stroke="url(#paint2_linear)"
                  strokeWidth="2.29299"
                />
              </g>
              <defs>
                <filter
                  id="filter0_i"
                  x="0"
                  y="0"
                  width="209.752"
                  height="51.5859"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="11.465" />
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.690196 0 0 0 0 0.937255 0 0 0 0 0.384314 0 0 0 0.6 0"
                  />
                  <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
                </filter>
                <linearGradient
                  id="paint0_linear"
                  x1="37.3175"
                  y1="49.293"
                  x2="165.984"
                  y2="-159.989"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#ACEC54" stopOpacity="0.13" />
                  <stop offset="1" stopColor="#6FFF00" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear"
                  x1="-32.2964"
                  y1="-8.20218"
                  x2="30.9889"
                  y2="184.38"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.0897938" stopColor="#D7FFA9" />
                  <stop offset="1" stopColor="#80EF00" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear"
                  x1="89.6346"
                  y1="-62.9595"
                  x2="112.535"
                  y2="222.965"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.108869" stopColor="#8FFF00" />
                  <stop offset="0.368867" stopColor="#8FFF00" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            <div className="flex justify-center items-center gap-[min(0.7vh,0.7vw)] pt-[min(0.9vh,0.9vw)] relative">
              <p className="font-semibold text-[min(2.2vh,2.2vw)] leading-[130%] uppercase text-sandy-yellow">Break</p>
              <p className="font-semibold text-[min(3.7vh,3.7vw)] leading-[130%] uppercase text-sandy-yellow">134</p>
            </div>
          </div>
        </div>

        {/* left */}
        <div
          className="relative px-[min(2.2vh,2.2vw)] py-[min(1.5vh,1.5vw)] rounded-[min(1.9vh,1.9vw)] shadow-[0px_3px_20.8px_0px_#DCF756] shrink-0 backdrop-blur-[24px] grow flex items-center"
          style={{
            background:
              'linear-gradient(#111, #111) padding-box, linear-gradient(144.83deg, rgba(213, 255, 154, 0.02) -0.26%, #C1F052 34.38%, #AAEA4B 58.47%, #B7F47B 92.16%) border-box',
            border: '1px solid transparent',
          }}
        >
          <div className="flex items-center gap-[min(2.2vh,2.2vw)] w-full">
            <div className="overflow-hidden size-[min(10vh,10vw)] rounded-full shrink-0">
              <ImageWithFallback
                fallback="/images/user-dummy-pic.png"
                className="size-full object-cover"
                src={
                  props.state!.sideOnePlayerOne.profilePhoto
                    ? props.state!.sideOnePlayerOne.profilePhoto
                    : '/images/user-dummy-pic.png'
                }
              />
            </div>
            <div className="flex flex-col gap-y-[min(0.9vh,0.9vw)] min-w-0 flex-1">
              {/* Player */}
              <div className="flex justify-between items-center gap-[min(1.5vh,1.5vw)] min-w-0">
                {/* Player name */}
                <p className="uppercase font-bold text-[min(3vh,3vw)] text-score-text truncate min-w-0 flex-1">
                  Swaminathan ps s{' '}
                </p>

                {/* Player Handicap */}
                <div className="flex items-center rounded-full overflow-hidden bg-white/[0.05] backdrop-blur-[12px] border border-white/[0.08] shadow-[inset_0px_1.16px_2.32px_0px_rgba(255,255,255,0.25)] shrink-0">
                  <span className="font-medium text-[min(2.2vh,2.2vw)] leading-[130%] uppercase text-score-text text-box-trim inline-block px-[min(1.5vh,1.5vw)] py-[min(0.6vh,0.6vw)]">
                    h
                  </span>
                  <div className="bg-sandy-yellow px-[min(1.5vh,1.5vw)] py-[min(0.6vh,0.6vw)] shadow-[inset_0px_0px_3.07px_0px_#929504]">
                    <span className="font-medium text-[min(2.2vh,2.2vw)] leading-[130%] uppercase text-box-trim text-[#11030F]">
                      +22
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="border-2
              [border-image-source:linear-gradient(90deg,rgba(251,255,127,0)_5%,rgba(251,255,127,0.6)_51.16%,rgba(225,229,116,0)95%)] [border-image-slice:1]
              "
              />

              {/* Team */}
              <div className="flex justify-between items-center gap-[min(1.5vh,1.5vw)] min-w-0">
                {/* Team Name */}
                <p className="uppercase font-medium text-[min(2.2vh,2.2vw)] text-score-text truncate min-w-0 flex-1">
                  bull’s eye{' '}
                </p>
                {/* Team Handicap */}

                <div className="flex items-center rounded-full overflow-hidden bg-white/[0.05] backdrop-blur-[12px] border border-white/[0.08] shadow-[inset_0px_1.16px_2.32px_0px_rgba(255,255,255,0.25)] shrink-0">
                  <span className="font-medium text-[min(2.2vh,2.2vw)] leading-[130%] uppercase text-score-text text-box-trim inline-block px-[min(1.5vh,1.5vw)] py-[min(0.6vh,0.6vw)]">
                    h
                  </span>
                  <div className="bg-sandy-yellow px-[min(1.5vh,1.5vw)] py-[min(0.6vh,0.6vw)] shadow-[inset_0px_0px_3.07px_0px_#929504]">
                    <span className="font-medium text-[min(2.2vh,2.2vw)] leading-[130%] uppercase text-box-trim text-[#11030F]">
                      +22
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* middle */}
        <div
          className="shrink-0 grow-0 flex rounded-[min(1.9vh,1.9vw)] z-20 relative items-stretch"
          style={{
            background: `
      linear-gradient(#11030F, #11030F) padding-box,
      linear-gradient(233.61deg, #FFECFF -11.62%, rgba(255, 255, 255, 0) 50.44%) border-box,
      linear-gradient(347.86deg, rgba(210, 154, 245, 0) 13.85%, #F4D3F2 105.37%) border-box
    `,

            border: '2px solid transparent',
            boxShadow: `
      0px 0px 16px 0px rgba(255, 237, 255, 0.50),
      10px 10px 28px 0px rgba(15, 11, 35, 0.80),
      -11px 0px 24px 0px rgba(14, 11, 36, 0.80)
    `,
          }}
        >
          <div className="absolute -bottom-[min(3vh,3vw)] w-full flex justify-center items-center z-10">
            <div className="relative w-[min(22.2vh,22.2vw)] h-[min(4.4vh,4.4vw)]">
              {/* SVG provides the shape + gradients */}
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 232 47"
                fill="none"
                preserveAspectRatio="none"
                style={{ position: 'absolute', inset: 0 }}
              >
                <path
                  d="M23.8115 46.5H208.188C214.792 46.5 220.562 42.038 222.223 35.6465L231.353 0.5H0.647461L9.77734 35.6465C11.438 42.038 17.2078 46.5 23.8115 46.5Z"
                  fill="url(#paint0_radial_475_3806)"
                  stroke="url(#paint1_linear_475_3806)"
                />
                <defs>
                  <radialGradient
                    id="paint0_radial_475_3806"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientTransform="matrix(95.7763 -0.499992 -0.256563 -337.536 116 23.5)"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#181332" />
                    <stop offset="0.451923" stopColor="#181332" />
                  </radialGradient>
                  <linearGradient
                    id="paint1_linear_475_3806"
                    x1="116"
                    y1="260.5"
                    x2="116"
                    y2="-82.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.612803" stopColor="#E39CF5" />
                    <stop offset="0.685132" stopColor="#E0BFE7" />
                    <stop offset="0.759138" stopColor="#CD86E1" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex justify-center items-center">
                <span className="font-semibold text-[min(2.2vh,2.2vw)] leading-[130%] uppercase text-score-text px-[min(1.3vh,1.3vw)]">
                  League away
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-stretch relative z-20 rounded-[min(1.9vh,1.9vw)] overflow-hidden py-[min(2vh,2vw)]">
            <div
              className="px-[min(1.1vh,1.1vw)] bg-[#AB51C6] border border-l-0 shadow-[0px_4px_16px_0px_#FFFFFF40] w-[min(11vh,12vw)] flex justify-center items-center z-10"
              style={{ borderImageSource: 'linear-gradient(180deg, #FFFFFF 0%, #999999 100%)', borderImageSlice: 1 }}
            >
              <span className="font-semibold text-[min(3.7vh,3.7vw)] leading-[130%] uppercase text-score-text">
                283
              </span>
            </div>

            <p className="text-score-text font-semibold text-[min(3.7vh,3.7vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase border-y text-center flex justify-center items-center px-[min(1.3vh,1.3vw)] [border-image-source:linear-gradient(90deg,rgba(255,255,255,0.12)_14.82%,#FFFFFF_45%,rgba(255,255,255,0.12)_91.13%)] [border-image-slice:1] w-[min(8vh,8vw)]">
              22
            </p>
            <div
              className="px-[min(1.1vh,1.1vw)] bg-[#AB51C6] border shadow-[0px_4px_16px_0px_#FFFFFF40] w-[min(11vh,12vw)] flex justify-center items-center"
              style={{ borderImageSource: 'linear-gradient(180deg, #FFFFFF 0%, #999999 100%)', borderImageSlice: 1 }}
            >
              <span className="font-semibold text-[min(3.7vh,3.7vw)] leading-[130%] uppercase text-score-text">
                12/13
              </span>
            </div>
            <p className="text-score-text font-semibold text-[min(3.7vh,3.7vw)] drop-shadow-[0px_4px_16px_0px_#FFFFFF40] leading-[130%] uppercase border-y text-center flex justify-center items-center px-[min(1.3vh,1.3vw)] [border-image-source:linear-gradient(90deg,rgba(255,255,255,0.12)_14.82%,#FFFFFF_45%,rgba(255,255,255,0.12)_91.13%)] [border-image-slice:1] w-[min(8vh,8vw)]">
              22
            </p>
            <div
              className="px-[min(1.1vh,1.1vw)] bg-[#AB51C6] w-[min(11vh,12vw)] border border-r-0 shadow-[0px_4px_16px_0px_#FFFFFF40] flex justify-center items-center"
              style={{ borderImageSource: 'linear-gradient(180deg, #FFFFFF 0%, #999999 100%)', borderImageSlice: 1 }}
            >
              <span className="font-semibold text-[min(3.7vh,3.7vw)] leading-[130%] uppercase text-score-text">
                842
              </span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div
          className="relative px-[min(2.2vh,2.2vw)] py-[min(1.5vh,1.5vw)] rounded-[min(1.9vh,1.9vw)] shadow-[0px_3px_10.8px_0px_#E38BF9] shrink-0 backdrop-blur-[24px] grow flex items-center"
          style={{
            background:
              'linear-gradient(#111, #111) padding-box, linear-gradient(144.83deg, rgba(210, 154, 245, 0.02) -0.26%, #B079E3 34.38%, #E38BF9 58.47%, #E38BF9 92.16%) border-box',
            border: '1px solid transparent',
          }}
        >
          <div className="flex flex-row-reverse items-center gap-[min(2.2vh,2.2vw)] w-full">
            <div className="overflow-hidden size-[min(10vh,10vw)] rounded-full shrink-0">
              <ImageWithFallback
                fallback="/images/user-dummy-pic.png"
                className="size-full object-cover"
                src={
                  props.state!.sideTwoPlayerOne?.profilePhoto
                    ? props.state!.sideTwoPlayerOne?.profilePhoto
                    : '/images/user-dummy-pic.png'
                }
              />
            </div>
            <div className="flex flex-col gap-y-[min(0.9vh,0.9vw)] min-w-0 flex-1">
              {/* Player */}
              <div className="flex flex-row-reverse justify-between items-center gap-[min(1.5vh,1.5vw)] min-w-0">
                {/* Player name */}
                <p className="uppercase font-bold text-[min(3vh,3vw)] text-score-text truncate min-w-0 flex-1">
                  Swaminathan ps{' '}
                </p>

                {/* Player Handicap */}
                <div className="flex items-center rounded-full overflow-hidden bg-white/[0.05] backdrop-blur-[12px] border border-white/[0.08] shadow-[inset_0px_1.16px_2.32px_0px_rgba(255,255,255,0.25)] shrink-0">
                  <span className="font-medium text-[min(2.2vh,2.2vw)] leading-[130%] uppercase text-score-text text-box-trim inline-block px-[min(1.5vh,1.5vw)] py-[min(0.6vh,0.6vw)]">
                    h
                  </span>
                  <div className="bg-violet px-[min(1.5vh,1.5vw)] py-[min(0.6vh,0.6vw)] shadow-[inset_0px_0px_3.03px_0px_#C600F7]">
                    <span className="font-medium text-[min(2.2vh,2.2vw)] leading-[130%] uppercase text-box-trim text-[#11030F]">
                      +22
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="border-2
              [border-image-source:linear-gradient(90deg,rgba(227,139,249,0)_5%,rgba(227,139,249,0.6)_51.16%,rgba(227,139,249,0)_95%)] [border-image-slice:1]
              "
              />

              {/* Team */}
              <div className="flex flex-row-reverse justify-between items-center gap-[min(1.5vh,1.5vw)] min-w-0">
                {/* Team Name */}
                <p className="uppercase font-medium text-[min(2.2vh,2.2vw)] text-score-text truncate min-w-0 flex-1">
                  bull’s eye{' '}
                </p>
                {/* Team Handicap */}

                <div className="flex items-center rounded-full overflow-hidden bg-white/[0.05] backdrop-blur-[12px] border border-white/[0.08] shadow-[inset_0px_1.16px_2.32px_0px_rgba(255,255,255,0.25)] shrink-0">
                  <span className="font-medium text-[min(2.2vh,2.2vw)] leading-[130%] uppercase text-score-text text-box-trim inline-block px-[min(1.5vh,1.5vw)] py-[min(0.6vh,0.6vw)]">
                    h
                  </span>
                  <div className="bg-violet px-[min(1.5vh,1.5vw)] py-[min(0.6vh,0.6vw)] shadow-[inset_0px_0px_3.03px_0px_#C600F7]">
                    <span className="font-medium text-[min(2.2vh,2.2vw)] leading-[130%] uppercase text-box-trim text-[#11030F]">
                      +22
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewGeneral;
