import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { getAvailableThemes, THEME_TYPES } from '../../config/themeConfig';
import { Sun, Moon, Palette, X, Check, Shield } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme, specialTheme, setSpecialTheme, clearSpecialTheme, user } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  
  // Only show theme toggle for admin users
  if (!user || user.role !== 'admin') {
    return null;
  }
  
  const availableThemes = getAvailableThemes();

  const handleSpecialThemeToggle = (themeKey) => {
    if (specialTheme === themeKey) {
      clearSpecialTheme();
    } else {
      setSpecialTheme(themeKey);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors relative group"
        aria-label="Toggle theme (Admin)"
        title="Theme settings (Admin only)"
      >
        {specialTheme === THEME_TYPES.REPUBLIC_DAY ? (
          <span className="text-xl">🇮🇳</span>
        ) : theme === 'dark' ? (
          <Moon size={20} className="text-foreground" />
        ) : (
          <Sun size={20} className="text-foreground" />
        )}
        {/* Admin badge */}
        <Shield size={10} className="absolute -top-1 -right-1 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      {/* Theme Selector Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Theme Menu */}
          <div className="absolute right-0 mt-2 w-80 bg-card border border-menu-border rounded-xl shadow-2xl z-50 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Palette size={20} className="text-primary" />
                <h3 className="font-semibold text-card-foreground">Theme Settings</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-secondary/50 rounded transition-colors"
              >
                <X size={18} className="text-muted-foreground" />
              </button>
            </div>

            {/* Base Theme Toggle */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Base Theme</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (theme !== 'light') toggleTheme();
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg border transition-all ${
                    theme === 'light' && !specialTheme
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Sun size={16} />
                    <span className="text-sm font-medium">Light</span>
                    {theme === 'light' && !specialTheme && <Check size={14} />}
                  </div>
                </button>
                <button
                  onClick={() => {
                    if (theme !== 'dark') toggleTheme();
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg border transition-all ${
                    theme === 'dark' && !specialTheme
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Moon size={16} />
                    <span className="text-sm font-medium">Dark</span>
                    {theme === 'dark' && !specialTheme && <Check size={14} />}
                  </div>
                </button>
              </div>
            </div>

            {/* Special Themes */}
            {availableThemes.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Special Themes</p>
                <div className="space-y-2">
                  {availableThemes.map((themeConfig) => (
                    <button
                      key={themeConfig.key}
                      onClick={() => handleSpecialThemeToggle(themeConfig.key)}
                      className={`w-full p-3 rounded-lg border transition-all text-left ${
                        specialTheme === themeConfig.key
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-card-foreground">
                              {themeConfig.displayName}
                            </span>
                            {themeConfig.autoActive && (
                              <span className="text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full">
                                Auto
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {themeConfig.description}
                          </p>
                        </div>
                        {specialTheme === themeConfig.key && (
                          <Check size={18} className="text-primary flex-shrink-0" />
                        )}
                      </div>
                      
                      {/* Color Preview */}
                      {themeConfig.colors && (
                        <div className="flex gap-1 mt-2">
                          <div 
                            className="w-6 h-6 rounded border border-border"
                            style={{ backgroundColor: themeConfig.colors.saffron }}
                            title="Saffron"
                          />
                          <div 
                            className="w-6 h-6 rounded border border-border"
                            style={{ backgroundColor: themeConfig.colors.white }}
                            title="White"
                          />
                          <div 
                            className="w-6 h-6 rounded border border-border"
                            style={{ backgroundColor: themeConfig.colors.green }}
                            title="Green"
                          />
                          <div 
                            className="w-6 h-6 rounded border border-border"
                            style={{ backgroundColor: themeConfig.colors.navy }}
                            title="Navy Blue"
                          />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active Theme Info */}
            {specialTheme && (
              <div className="mt-4 pt-3 border-t border-border">
                <button
                  onClick={clearSpecialTheme}
                  className="w-full py-2 px-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Return to Default Theme
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeToggle;
