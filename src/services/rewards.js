import api from './api';

/**
 * Rewards API Service
 * Handles all rewards-related API calls
 */

export const rewardsAPI = {
    /**
     * Get coin balance and streak info
     */
    getBalance: async () => {
        const response = await api.get('/rewards/balance');
        return response.data;
    },

    /**
     * Get transaction history
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     */
    getHistory: async (page = 1, limit = 20) => {
        const response = await api.get(`/rewards/history?page=${page}&limit=${limit}`);
        return response.data;
    },

    /**
     * Get shop items
     */
    getShop: async () => {
        const response = await api.get('/rewards/shop');
        return response.data;
    },

    /**
     * Track a meaningful action
     * @param {string} actionType - Type of action
     */
    trackActivity: async (actionType) => {
        const response = await api.post('/rewards/track-activity', { actionType });
        return response.data;
    },

    /**
     * Claim a streak milestone
     * @param {number} days - Milestone days (1, 7, 30, 45, 60)
     */
    claimMilestone: async (days) => {
        const response = await api.post('/rewards/claim-milestone', { days });
        return response.data;
    },

    /**
     * Redeem coins for an item
     * @param {string} itemType - Item to redeem
     */
    redeem: async (itemType) => {
        const response = await api.post('/rewards/redeem', { itemType });
        return response.data;
    }
};

export default rewardsAPI;
