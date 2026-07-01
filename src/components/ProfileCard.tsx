import { useId } from 'react';

type PropsType = {
  imageUrl: string;
  size?: number;
  color?: string;
  handicap?: string;
  isBorder?: boolean;
  isActive?: boolean;
};
export const ProfileCard = ({ imageUrl, size = 100, color = 'white', handicap, isBorder, isActive }: PropsType) => {
  console.log(isBorder);
  const borderClipId = useId();
  const cardClipId = useId();

  return (
    <div className="flex justify-center items-center" style={{ width: `${size}px`, height: `${size}px` }}>
      {/* Scaled SVG Definitions mapped from 0 to 1 */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          {/* Border Path scaled to fill the bounding box fully */}
          <clipPath id={borderClipId} clipPathUnits="objectBoundingBox">
            <path d="M1,0.857 C1,0.936,0.944,1,0.875,1 H0.125 C0.056,1,0,0.936,0,0.857 V0.347 C0,0.309,0.013,0.272,0.037,0.246 L0.214,0.043 C0.238,0.015,0.27,0,0.303,0 H0.875 C0.944,0,1,0.064,1,0.143 V0.857 Z" />
          </clipPath>

          {/* Inner Card Path scaled to fill the bounding box fully */}
          <clipPath id={cardClipId} clipPathUnits="objectBoundingBox">
            <path d="M0.973,0.857 C0.973,0.92,0.927,0.971,0.869,0.971 H0.131 C0.073,0.971,0.027,0.92,0.027,0.857 V0.347 C0.027,0.315,0.038,0.285,0.058,0.263 L0.232,0.061 C0.252,0.038,0.278,0.025,0.306,0.025 H0.869 C0.927,0.025,0.973,0.076,0.973,0.139 V0.857 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Card Wrapper now matches the full container dimensions */}
      <div className="relative w-full h-full">
        {/* Shadow wrapper — filter must live outside the clipped element or clip-path crops the shadow */}
        <div
          className="absolute inset-0"
          style={{
            filter: isActive
              ? 'drop-shadow(0 5px 6px rgba(255, 255, 255, 0.5))'
              : 'drop-shadow(0 3.6px 7.2px rgba(0, 0, 0, 0.35))',
          }}
        >
          {/* Outer Border */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              // background: isBorder ? color : '',
              background: `${color}`,
              clipPath: `url(#${borderClipId})`,
            }}
          />
        </div>
        {handicap ? (
          <div className="absolute bottom-0 left-0 right-0 h-4 z-30 bg-[#EB3BFA] w-full rounded-br-md rounded-bl-md flex justify-center items-center ">
            <p className="font-semibold text-xs leading-[130%] text-white">{handicap}</p>
          </div>
        ) : null}

        {/* Inner Image Card */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            clipPath: `url(#${cardClipId})`,
          }}
        />
      </div>
    </div>
  );
};
