import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { THEME_TYPES } from '../../config/themeConfig';
import { Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const RepublicDayBanner = () => {
  const { specialTheme } = useAppContext();
  const location = useLocation();

  // Only show banner on home page when Republic Day theme is active
  const shouldShow = specialTheme === THEME_TYPES.REPUBLIC_DAY && location.pathname === '/';

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-40 overflow-hidden bg-gradient-to-r from-[#FF9933] via-white to-[#138808] border-b-2 border-[#000080]">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-4">
          {/* Banner Content */}
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bounce">🇮🇳</span>
            <Sparkles className="h-5 w-5 text-[#000080] animate-pulse" />
            
            <div>
              <p className="text-sm md:text-base font-semibold text-gray-900">
                Celebrating 77th Republic Day of India! 
                <span className="hidden sm:inline ml-2">
                  Honoring our Constitution and Democracy
                </span>
              </p>
              <p className="text-xs md:text-sm text-gray-900 font-bold mt-1 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 rounded-full inline-block shadow-md">
                🎁 2 days free access to all premium features! 
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animated accent line */}
      <div 
        className="absolute bottom-0 left-0 h-0.5 bg-[#000080] animate-pulse"
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default RepublicDayBanner;
