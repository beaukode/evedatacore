import React from "react";

interface ResponsiveImageProps {
  src?: string | null;
  alt?: string | null;
  style?: React.CSSProperties;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  style,
}) => {
  if (!src) {
    return null;
  }
  return (
    <img
      src={src || undefined}
      alt={alt || undefined}
      style={{
        height: "auto",
        maxWidth: "100%",
        ...style,
      }}
    />
  );
};

export default ResponsiveImage;
