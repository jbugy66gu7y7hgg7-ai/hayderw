import React from 'react';
import { Statistics } from '../types';

interface StatsSectionProps {
  stats?: Statistics;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  const years = stats?.yearsExperience || 2008;
  const certificates = stats?.certificates || 750;
  const specialties = stats?.specialties || 35;

  return (
    <section 
      className="py-16 lg:py-20 text-white text-center relative transition-colors duration-300"
      style={{ 
        backgroundColor: 'var(--primary-color, #1d4ed8)',
        borderTop: '1px solid rgba(147, 197, 253, 0.3)',
        borderBottom: '1px solid rgba(147, 197, 253, 0.3)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title from alofuk.com */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-10 tracking-tight drop-shadow-sm">
          اعداد الشهادات الممنوحه
        </h2>

        {/* 3 Columns matching alofuk.com */}
        <div className="grid grid-cols-3 max-w-3xl mx-auto gap-4 sm:gap-8 justify-items-center">
          
          {/* Stat 1: 2008 سنه تاسست */}
          <div className="flex flex-col items-center">
            <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-mono drop-shadow">
              {years}
            </h3>
            <span className="text-xs sm:text-base font-semibold text-blue-100 mt-2 leading-snug">
              سنه <br /> تاسست
            </span>
          </div>

          {/* Stat 2: 750 شهادة ممنوحه */}
          <div className="flex flex-col items-center border-x border-blue-300/30 px-4 sm:px-8 w-full">
            <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-mono drop-shadow">
              {certificates}
            </h3>
            <span className="text-xs sm:text-base font-semibold text-blue-100 mt-2 leading-snug">
              شهادة <br /> ممنوحه
            </span>
          </div>

          {/* Stat 3: 35+ تخصص اكاديمي */}
          <div className="flex flex-col items-center">
            <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-mono drop-shadow">
              {specialties}+
            </h3>
            <span className="text-xs sm:text-base font-semibold text-blue-100 mt-2 leading-snug">
              تخصص <br /> اكاديمي
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
