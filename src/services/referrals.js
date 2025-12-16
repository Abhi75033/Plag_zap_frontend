import api from './api';

/**
 * Referral API Service
 * Handles all referral-related API calls
 */

export const referralAPI = {
    /**
     * Get user's referral code
     */
    getMyCode: async () => {
        const response = await api.get('/referrals/my-code');
        return response.data;
    },

    /**
     * Get referral statistics
     */
    getStats: async () => {
        const response = await api.get('/referrals/stats');
        return response.data;
    },

    /**
     * Validate a referral code
     * @param {string} code - Referral code to validate
     */
    validateCode: async (code) => {
        const response = await api.post('/referrals/validate', { code });
        return response.data;
    },

    /**
     * Get referral system configuration
     */
    getConfig: async () => {
        const response = await api.get('/referrals/config');
        return response.data;
    },
};

export default referralAPI;
