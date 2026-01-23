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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center sm:text-left">
            
            {/* Left: Icon & Main Message */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="text-2xl drop-shadow-md">🇮🇳</span>
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400 animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 font-serif tracking-wide">
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
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <p className="text-sm font-semibold text-gray-900 dark:text-white group cursor-default">
                <span className="bg-gradient-to-r from-[#FF9933] to-[#FF9933] bg-clip-text text-transparent font-bold">
                  Limited Offer
                </span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 text-orange-600 dark:text-orange-300 shadow-[0_0_15px_rgba(255,153,51,0.1)] group-hover:shadow-[0_0_20px_rgba(255,153,51,0.2)] transition-all duration-500 text-xs tracking-wide uppercase font-bold">
                  2 DAYS FREE PREMIUM ACCESS
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
