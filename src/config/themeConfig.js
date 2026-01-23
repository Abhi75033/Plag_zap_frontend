/**
 * Theme Configuration
 * Centralized theme definitions for PlagZap
 */

export const THEME_TYPES = {
    DEFAULT: 'default',
    REPUBLIC_DAY: 'republicDay',
};

export const themeConfig = {
    // Default Theme (Light/Dark Mode)
    [THEME_TYPES.DEFAULT]: {
        name: 'Default',
        displayName: 'Default Theme',
        description: 'Standard PlagZap theme with light/dark mode',
        cssClass: null, // No special class, uses base :root and .dark
        priority: 0,
    },

    // Republic Day Special Theme
    [THEME_TYPES.REPUBLIC_DAY]: {
        name: THEME_TYPES.REPUBLIC_DAY,
        displayName: 'Republic Day 🇮🇳',
        description: 'Celebrate India\'s 77th Republic Day with tricolor theme',
        cssClass: 'republic-day',
        priority: 1,

        // Theme colors (for preview/display)
        colors: {
            saffron: '#FF9933',
            white: '#FFFFFF',
            green: '#138808',
            navy: '#000080',
        },

        // Auto-activation configuration
        autoActivation: {
            enabled: true, // ENABLED: Theme auto-shows for everyone
            startDate: '2026-01-23', // Start from today
            endDate: '2026-01-27',   // Through Jan 27
        },

        // Metadata
        celebrationYear: 77,
        message: 'Celebrating 77th Republic Day of India',
    },
};

/**
 * Check if a theme should be auto-activated based on current date
 * @param {string} themeType - Theme type from THEME_TYPES
 * @returns {boolean} - Whether theme should be auto-activated
 */
export const shouldAutoActivateTheme = (themeType) => {
    const theme = themeConfig[themeType];

    if (!theme || !theme.autoActivation || !theme.autoActivation.enabled) {
        return false;
    }

    const now = new Date();
    const startDate = new Date(theme.autoActivation.startDate);
    const endDate = new Date(theme.autoActivation.endDate);

    // Set time to start/end of day for accurate comparison
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return now >= startDate && now <= endDate;
};

/**
 * Get all available special themes
 * @returns {Array} - Array of special theme configurations
 */
export const getAvailableThemes = () => {
    return Object.entries(themeConfig)
        .filter(([key]) => key !== THEME_TYPES.DEFAULT)
        .map(([key, config]) => ({
            ...config,
            key,
            autoActive: shouldAutoActivateTheme(key),
        }))
        .sort((a, b) => (b.priority || 0) - (a.priority || 0));
};

/**
 * Get theme configuration by type
 * @param {string} themeType - Theme type from THEME_TYPES
 * @returns {Object|null} - Theme configuration or null
 */
export const getThemeConfig = (themeType) => {
    return themeConfig[themeType] || null;
};

export default themeConfig;
