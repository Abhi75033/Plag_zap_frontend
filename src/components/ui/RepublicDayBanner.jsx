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
    <div className="fixed top-16 left-0 right-0 z-40">
      {/* Glassmorphism Container */}
      <div className="relative overflow-hidden bg-white/10 backdrop-blur-md border-b-[1px] border-white/20 shadow-lg">
        {/* Subtle animated gradient background */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] animate-gradient-xy"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-2">
            {/* Content Container - Optimized for Mobile */}
            <div className="flex flex-row items-center justify-between gap-2 sm:gap-6 w-full">
              
              {/* Left: Icon & Main Message */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <div className="relative">
                  <span className="text-xl sm:text-2xl drop-shadow-md">🇮🇳</span>
                  <Sparkles className="absolute -top-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 text-yellow-400 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-100 font-serif tracking-wide whitespace-nowrap">
                    77th Republic Day
                  </p>
                  <p className="text-[10px] text-gray-600 dark:text-gray-300 uppercase tracking-widest hidden sm:block">
                    Honoring the Constitution
                  </p>
                </div>
              </div>

              {/* Divider (Hidden on mobile) */}
              <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-gray-400/30 to-transparent"></div>

              {/* Right: Premium Offer */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-1 justify-end min-w-0">
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-orange-500"></span>
                </span>
                <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white group cursor-default flex items-center gap-2 truncate">
                  <span className="bg-gradient-to-r from-[#FF9933] to-[#FF9933] bg-clip-text text-transparent font-bold hidden xs:inline">
                    Limited Offer
                  </span>
                  <span className="hidden xs:inline text-gray-400">|</span>
                  <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 text-orange-600 dark:text-orange-300 shadow-[0_0_10px_rgba(255,153,51,0.1)] text-[10px] sm:text-xs tracking-wide uppercase font-bold whitespace-normal text-center leading-tight">
                    2 DAYS FREE <span className="hidden sm:inline">PREMIUM ACCESS</span><span className="inline sm:hidden">PREMIUM</span>
                  </span>
                </p>
              </div>
            </div>

          </div>

        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#000080]/30 to-transparent"></div>
      </div>
    </div>
  );
};

export default RepublicDayBanner;
