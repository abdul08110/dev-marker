import { useId } from 'react';

type PropsType = {
  imageUrl: string;
  size?: number;
  color?: string;
};
export const ProfileCard = ({ imageUrl, size = 100, color = '#ffd500' }: PropsType) => {
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
      <div
        className="card-wrap"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Outer Border */}
        <div
          className="card-border"
          style={{
            position: 'absolute',
            inset: 0,
            background: `${color}`,
            clipPath: `url(#${borderClipId})`,
            filter: 'drop-shadow(0 3.6px 7.2px rgba(0, 0, 0, 0.25))',
          }}
        />

        {/* Inner Image Card */}
        <div
          className="card"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${imageUrl})`,
            backgroundNoRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            clipPath: `url(#${cardClipId})`,
          }}
        />
      </div>
    </div>
  );
};
