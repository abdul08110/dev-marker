import { useState } from "react";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallback: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, fallback, alt, ...props }) => {
  const [imgSrc, setImgSrc] = useState<string>(src);

  return (
    <img
      src={imgSrc}
      onError={(e) => {
        e.currentTarget.onerror = null;
        setImgSrc(fallback);
      }}
      alt={alt}
      {...props}
    />
  );
};

export default ImageWithFallback;