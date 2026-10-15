import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'horizontal' | 'vertical';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  variant = 'horizontal',
}) => {
  const [imageError, setImageError] = useState(false);

  const emblemSizes = {
    sm: 'w-9 h-9 min-w-[36px]',
    md: 'w-11 h-11 min-w-[44px]',
    lg: 'w-14 h-14 min-w-[56px]',
    xl: 'w-20 h-20 min-w-[80px]',
  };

  const titleSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  };

  const subtitleSizes = {
    sm: 'text-[10px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  const isVertical = variant === 'vertical';

  return (
    <div 
      className={`flex ${isVertical ? 'flex-col items-center text-center' : 'items-center text-right'} gap-2.5 sm:gap-3 select-none ${className}`} 
      id="brand-logo"
      dir="rtl"
    >
      {/* Official Emblem Container with Luxury Gold & Blue Ring */}
      <div className={`relative rounded-xl p-[1.5px] bg-gradient-to-tr from-blue-600 via-blue-400 to-amber-300 shadow-[0_2px_10px_rgba(29,78,216,0.25)] shrink-0 transition-transform duration-300 hover:scale-105 ${emblemSizes[size]}`}>
        <div className="w-full h-full rounded-[10px] overflow-hidden bg-[#0b192c] flex items-center justify-center">
          {!imageError ? (
            <img 
              src="/assets/img/alofuk_logo.jpg" 
              alt="شعار أكاديمية الأفق" 
              className="w-full h-full object-cover object-center"
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-[#1e40af] flex items-center justify-center text-amber-300 font-bold text-lg">
              أ
            </div>
          )}
        </div>
      </div>

      {/* Brand Title & Tagline */}
      <div className={`flex flex-col justify-center ${isVertical ? 'items-center mt-1' : 'items-start'}`}>
        <div className={`font-black text-white leading-tight flex items-center gap-1.5 ${titleSizes[size]}`}>
          <span>أكاديمية</span>
          <span className="text-[#F5C85A] drop-shadow-sm">الأفق</span>
        </div>
        
        {showSubtitle && (
          <span className={`text-slate-200/90 font-medium tracking-wide mt-0.5 leading-none ${subtitleSizes[size]}`}>
            للتدريب والاستشارات <span className="text-[#F5C85A]/80 font-normal">•</span> ماليزيا
          </span>
        )}
      </div>
    </div>
  );
};


