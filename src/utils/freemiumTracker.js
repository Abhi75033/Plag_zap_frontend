/**
 * Freemium Usage Tracker
 * Tracks anonymous user usage of analyzer and other features via localStorage
 */

const STORAGE_KEY = 'plagzap_freemium';
const MAX_FREE_ANALYSES = 5;

/**
 * Get current usage data from localStorage
 */
const getUsageData = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            return {
                analyzerCount: 0,
                firstUsed: null,
                lastUsed: null
            };
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Failed to read freemium data:', error);
        return {
            analyzerCount: 0,
            firstUsed: null,
            lastUsed: null
        };
    }
};

/**
 * Save usage data to localStorage
 */
const saveUsageData = (data) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save freemium data:', error);
    }
};

/**
 * Check if user can use analyzer
 */
export const canUseAnalyzer = () => {
    const data = getUsageData();
    return data.analyzerCount < MAX_FREE_ANALYSES;
};

/**
 * Get remaining analyzer uses
 */
export const getRemainingAnalyzes = () => {
    const data = getUsageData();
    return Math.max(0, MAX_FREE_ANALYSES - data.analyzerCount);
};

/**
 * Increment analyzer usage count
 */
export const incrementAnalyzerCount = () => {
    const data = getUsageData();
    const now = new Date().toISOString();

    saveUsageData({
        analyzerCount: data.analyzerCount + 1,
        firstUsed: data.firstUsed || now,
        lastUsed: now
    });
};

/**
 * Get usage stats for display
 */
export const getUsageStats = () => {
    const data = getUsageData();
    return {
        used: data.analyzerCount,
        remaining: getRemainingAnalyzes(),
        limit: MAX_FREE_ANALYSES,
        hasReachedLimit: data.analyzerCount >= MAX_FREE_ANALYSES
    };
};

/**
 * Reset usage data (for testing or premium upgrade)
 */
export const resetUsageData = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to reset freemium data:', error);
    }
};
