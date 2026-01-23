import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { THEME_TYPES } from '../../config/themeConfig';
import { X, Sparkles } from 'lucide-react';

const RepublicDayBanner = () => {
  const { specialTheme } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Only show if Republic Day theme is active
    if (specialTheme === THEME_TYPES.REPUBLIC_DAY) {
      // Check if user has dismissed the banner
      const dismissed = localStorage.getItem('republicDayBannerDismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    } else {
      setIsVisible(false);
      // Reset dismissal when theme is not active
      localStorage.removeItem('republicDayBannerDismissed');
    }
  }, [specialTheme]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    localStorage.setItem('republicDayBannerDismissed', 'true');
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-40 overflow-hidden bg-gradient-to-r from-[#FF9933] via-white to-[#138808] border-b-2 border-[#000080]">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Banner Content */}
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-bounce">🇮🇳</span>
              <Sparkles className="h-5 w-5 text-[#000080] animate-pulse" />
            </div>
            
            <div className="flex-1">
              <p className="text-sm md:text-base font-semibold text-gray-900">
                Celebrating 77th Republic Day of India! 
                <span className="hidden sm:inline ml-2">
                  Honoring our Constitution and Democracy
                </span>
              </p>
              <p className="text-xs text-gray-700 hidden md:block">
                Special theme active • Jai Hind! 🙏
              </p>
            </div>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1.5 rounded-full hover:bg-black/10 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4 text-gray-700" />
          </button>
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
