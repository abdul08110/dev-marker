import { useState } from "react";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallback: string;
  cutPosition?: 'top-left' | 'top-right';
  cutSize?: number; // Size of the cut corner as percentage of image width, defaults to 8
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  fallback, 
  alt, 
  cutPosition, 
  cutSize = 8,
  style,
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);

  const getClipPath = () => {
    if (!cutPosition) return undefined;
    
    const cutPercent = `${cutSize}%`;
    
    if (cutPosition === 'top-left') {
      return `polygon(${cutPercent} 0%, 100% 0%, 100% 100%, 0% 100%, 0% ${cutPercent})`;
    } else if (cutPosition === 'top-right') {
      return `polygon(0% 0%, calc(100% - ${cutPercent}) 0%, 100% ${cutPercent}, 100% 100%, 0% 100%)`;
    }
    return undefined;
  };

  const clipPath = getClipPath();

  return (
    <img
      src={imgSrc}
      onError={(e) => {
        e.currentTarget.onerror = null;
        setImgSrc(fallback);
      }}
      alt={alt}
      style={{
        ...style,
        ...(clipPath && { clipPath }),
      }}
      {...props}
    />
  );
};

export default ImageWithFallback;