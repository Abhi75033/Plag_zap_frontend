import axios from 'axios';

const api = axios.create({
    // baseURL: 'https://plagzapbackend-production.up.railway.app/api',
    baseURL: 'https://plagzapbackend-production.up.railway.app/api'
});

// Webhooks API
export const getWebhooks = () => api.get('/webhooks');

export const createWebhook = (webhookData) => api.post('/webhooks', webhookData);

export const deleteWebhook = (webhookId) => api.delete(`/webhooks/${webhookId}`);

export const testWebhook = (webhookId) => api.post(`/webhooks/${webhookId}/test`);

export default {
    getWebhooks,
    createWebhook,
    deleteWebhook,
    
    testWebhook
};
