import React from 'react';

const LOGO_URL = 'https://res.cloudinary.com/b9fdbhbp/image/upload/v1786150540/Marketmavenlogo-removebg-preview_mfevtp.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  lightText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const logoHeight = size === 'sm' ? 'h-8' : size === 'lg' ? 'h-12' : 'h-10';

  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`}>
      <img
        src={LOGO_URL}
        alt="MarketMaven"
        referrerPolicy="no-referrer"
        className={`${logoHeight} w-auto object-contain shrink-0 block`}
      />
    </div>
  );
};
