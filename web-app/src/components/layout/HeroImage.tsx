"use client";

import React from 'react';

interface HeroImageProps {
  src: string;
  alt: string;
  fallbackSrc: string;
  className?: string;
}

export default function HeroImage({ src, alt, fallbackSrc, className }: HeroImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        (e.target as HTMLImageElement).src = fallbackSrc;
      }}
    />
  );
}
