import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../services/api';
import { THEME_TYPES, shouldAutoActivateTheme } from '../config/themeConfig';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Load theme from localStorage or default to 'dark'
    return localStorage.getItem('baseTheme') || 'dark';
  });
  
  const [specialTheme, setSpecialThemeState] = useState(() => {
    // Load special theme from localStorage
    const saved = localStorage.getItem('specialTheme');
    return saved && saved !== 'null' ? saved : null;
  });
  
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // getCurrentUser already returns data directly (not wrapped)
          const userData = await getCurrentUser();
          console.log('[AppContext] User loaded:', { 
            email: userData.email, 
            emailVerified: userData.emailVerified 
          });
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Check for auto-activation on mount and daily
  useEffect(() => {
    const checkAutoActivation = () => {
      // Check if Republic Day theme should auto-activate
      if (shouldAutoActivateTheme(THEME_TYPES.REPUBLIC_DAY)) {
        const currentSpecialTheme = localStorage.getItem('specialTheme');
        if (!currentSpecialTheme) {
          console.log('[AppContext] Auto-activating Republic Day theme');
          setSpecialTheme(THEME_TYPES.REPUBLIC_DAY);
        }
      } else {
        // Auto-deactivate if outside date range and it was auto-activated
        const wasAutoActivated = localStorage.getItem('themeAutoActivated');
        if (wasAutoActivated === 'true' && specialTheme === THEME_TYPES.REPUBLIC_DAY) {
          console.log('[AppContext] Auto-deactivating Republic Day theme');
          clearSpecialTheme();
        }
      }
    };

    checkAutoActivation();
    
    // Check daily at midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const midnightTimer = setTimeout(() => {
      checkAutoActivation();
      // Set up daily interval
      setInterval(checkAutoActivation, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    return () => clearTimeout(midnightTimer);
  }, []);

  // Apply base theme (light/dark)
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Persist to localStorage
    localStorage.setItem('baseTheme', theme);
  }, [theme]);

  // NOTE: Special themes are NOT applied globally anymore
  // They are applied locally in specific page components (e.g., Home.jsx)
  useEffect(() => {
    // Persist special theme to localStorage
    localStorage.setItem('specialTheme', specialTheme || 'null');
  }, [specialTheme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const setSpecialTheme = (themeName) => {
    setSpecialThemeState(themeName);
    // Mark if this was auto-activated
    if (shouldAutoActivateTheme(themeName)) {
      localStorage.setItem('themeAutoActivated', 'true');
    } else {
      localStorage.setItem('themeAutoActivated', 'false');
    }
  };

  const clearSpecialTheme = () => {
    setSpecialThemeState(null);
    localStorage.setItem('themeAutoActivated', 'false');
  };

  const getEffectiveTheme = () => {
    return specialTheme || theme;
  };

  const addToHistory = (item) => {
    setHistory([item, ...history]);
  };

  const login = async (credentials) => {
    const { data } = await apiLogin(credentials);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const { data } = await apiRegister(userData);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setHistory([]);
  };

  const updateUser = (userData) => {
    console.log('[AppContext] Updating user:', { 
      oldEmailVerified: user?.emailVerified, 
      newEmailVerified: userData?.emailVerified 
    });
    setUser({ ...user, ...userData });
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        specialTheme,
        setSpecialTheme,
        clearSpecialTheme,
        getEffectiveTheme,
        history,
        addToHistory,
        user,
        setUser, // Export setUser for AuthCallback
        login,
        register,
        logout,
        updateUser,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
