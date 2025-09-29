import React from 'react';

const NextImage = ({ src, alt, ...props }: any) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} {...props} />;
};

NextImage.displayName = 'NextImage';

export default NextImage;