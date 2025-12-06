import axios from 'axios';

const api = axios.create({
    baseURL: 'https://plagzap-backend-2.onrender.com/api',
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth APIs
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const getCurrentUser = () => api.get('/auth/me');

// Subscription APIs
export const getSubscriptionPlans = () => api.get('/subscriptions/plans');
export const createRazorpayOrder = (planId) => api.post('/subscriptions/create-order', { planId });
export const verifyRazorpayPayment = (paymentData) => api.post('/subscriptions/verify-payment', paymentData);
export const purchaseSubscription = (planId) => api.post('/subscriptions/purchase', { planId }); // Mock for testing
export const cancelSubscription = () => api.post('/subscriptions/cancel');
export const getUsage = () => api.get('/subscriptions/usage');

// Existing APIs
export const checkPlagiarism = (text) => api.post('/plagiarism/check', { text });
export const bulkCheck = (texts, filenames) => api.post('/plagiarism/bulk', { texts, filenames });
export const getBatchStatus = (batchId) => api.get(`/plagiarism/bulk/${batchId}`);
export const getUserBatches = () => api.get('/plagiarism/batches');
export const checkGrammar = (text) => api.post('/grammar/check', { text });
export const applyGrammarFixes = (text, issues) => api.post('/grammar/apply', { text, issues });
export const rewriteContent = (text, resultId) => api.post('/rewrite', { text, resultId });
export const getHistory = () => api.get('/history');
export const uploadFile = (formData) => api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const extractUrl = (url) => api.post('/extract-url', { url });
export const sendChatMessage = (message, context) => api.post('/chat', { message, context });

// Team
export const getTeam = () => api.get('/team');
export const createTeam = (name) => api.post('/team/create', { name });
export const joinTeam = (inviteCode) => api.post('/team/join', { inviteCode });
export const leaveTeam = () => api.post('/team/leave');

// Gamification
export const getGamificationStats = () => api.get('/gamification/stats');

// API Key management
export const getApiKey = () => api.get('/auth/api-key');
export const getApiKeyHistory = () => api.get('/auth/api-key/history');
export const generateApiKey = () => api.post('/auth/api-key/generate');
export const revokeApiKey = (keyId) => api.delete(`/auth/api-key/${keyId}`);

// Admin endpoints
export const getAdminStats = () => api.get('/admin/stats');
export const getAdminUsers = (page = 1) => api.get(`/admin/users?page=${page}`);
export const deleteUser = (userId) => api.delete(`/admin/users/${userId}`);

// Webhook methods
export const getWebhooks = () => api.get('/webhooks');
export const createWebhook = (data) => api.post('/webhooks', data);
export const deleteWebhook = (id) => api.delete(`/webhooks/${id}`);
export const testWebhook = (id) => api.post(`/webhooks/${id}/test`);

export default api;
