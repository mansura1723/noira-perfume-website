import { useState } from 'react';

interface LuxuryImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  darkSurface?: boolean;
}

export function LuxuryImage({
  src,
  alt,
  className = '',
  fallbackTitle = 'NOIRA',
  darkSurface = false,
}: LuxuryImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-6 text-center ${
          darkSurface
            ? 'bg-gradient-to-br from-[#1A1A1A] via-[#101010] to-[#292929] text-[#F7F4EE]'
            : 'bg-gradient-to-br from-[#F7F4EE] via-[#E9E1D5] to-[#DFD4C4] text-[#101010]'
        } ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="font-serif text-lg tracking-[0.26em] uppercase text-[#C6A66A]">
          NOIRA
        </span>
        <span className="mt-2 text-xs tracking-[0.14em] uppercase opacity-70">
          {fallbackTitle}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
