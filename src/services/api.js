import axios from 'axios';

const api = axios.create({
    baseURL: 'https://plagzap-backend-8yxx.onrender.com/api',
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
// Dictionary
export const lookupDictionary = (text, targetLang) => api.post('/dictionary/lookup', { text, targetLang });

// Subscription Routes
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

// Team Messaging
export const getTeamMessages = (page = 1, tag) => api.get('/team/messages', { params: { page, tag } });
export const sendTeamMessage = (content, type = 'message', replyTo = null) => api.post('/team/messages', { content, type, replyTo });
export const deleteTeamMessage = (id) => api.delete(`/team/messages/${id}`);
export const reactToMessage = (id, emoji) => api.post(`/team/messages/${id}/react`, { emoji });
export const togglePinMessage = (id) => api.post(`/team/messages/${id}/pin`);
export const endMeeting = (code) => api.post(`/meetings/${code}/end`);
// Clear meeting history
export const clearMeetingHistory = () => api.delete('/meetings/user/clear-history');
export const getTeamMembersList = () => api.get('/team/members-list');
export const markMessagesAsRead = (messageIds) => api.post('/team/messages/read', { messageIds });
export const getMessageReceipts = (id) => api.get(`/team/messages/${id}/receipts`);
export const searchTeamMessages = (query) => api.get('/team/messages/search', { params: { q: query } });
export const getMessageReplies = (id) => api.get(`/team/messages/${id}/replies`);

// Team Admin Functions
export const clearAllMessages = () => api.delete('/team/messages/clear-all');
export const getTeamSettings = () => api.get('/team/settings');
export const updateTeamSettings = (settings) => api.patch('/team/settings', settings);
export const updateMemberRole = (memberId, role) => api.patch(`/team/members/${memberId}/role`, { role });
export const muteTeamMember = (memberId, mute, duration) => api.post(`/team/members/${memberId}/mute`, { mute, duration });
export const removeTeamMember = (memberId) => api.delete(`/team/members/${memberId}`);
export const getTeamActivity = () => api.get('/team/activity');

// Team History & Analytics
export const getTeamHistory = (page = 1) => api.get('/team/history', { params: { page } });
export const getSharedHistoryDetails = (id) => api.get(`/team/history/${id}`);
export const shareHistoryWithTeam = (id, title) => api.post(`/team/history/${id}/share`, { title });
export const unshareHistoryFromTeam = (id) => api.post(`/team/history/${id}/unshare`);
export const addHistoryComment = (id, text, type) => api.post(`/team/history/${id}/comment`, { text, type });
export const deleteHistoryComment = (id, commentId) => api.delete(`/team/history/${id}/comment/${commentId}`);
export const getTeamAnalytics = () => api.get('/team/analytics');

// Team Tasks
export const getTeamTasks = (status) => api.get('/team/tasks', { params: { status } });
export const createTeamTask = (taskData) => api.post('/team/tasks', taskData);
export const updateTeamTask = (id, updates) => api.patch(`/team/tasks/${id}`, updates);
export const deleteTeamTask = (id) => api.delete(`/team/tasks/${id}`);

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

// Admin subscription management
export const grantUserSubscription = (userId, subscriptionData) =>
    api.post(`/admin/users/${userId}/subscription`, subscriptionData);
export const updateUserSubscriptionStatus = (userId, status) =>
    api.patch(`/admin/users/${userId}/subscription`, { status });
export const revokeUserSubscription = (userId) =>
    api.delete(`/admin/users/${userId}/subscription`);

// Webhook methods
export const getWebhooks = () => api.get('/webhooks');
export const createWebhook = (data) => api.post('/webhooks', data);
export const deleteWebhook = (id) => api.delete(`/webhooks/${id}`);
export const testWebhook = (id) => api.post(`/webhooks/${id}/test`);

// Feedback (public)
export const getApprovedFeedbacks = () => api.get('/feedback');
export const submitFeedback = (data) => api.post('/feedback', data);

// Admin Feedback Management
export const getAllFeedbacks = (status) => api.get('/admin/feedbacks', { params: { status } });
export const updateFeedbackStatus = (id, status, adminNote) => api.patch(`/admin/feedbacks/${id}`, { status, adminNote });
export const deleteFeedback = (id) => api.delete(`/admin/feedbacks/${id}`);

// Coupon APIs
export const validateCoupon = (code, planId) => api.post('/subscriptions/validate-coupon', { code, planId });
export const createRazorpayOrderWithCoupon = (planId, couponCode) =>
    api.post('/subscriptions/create-order', { planId, couponCode });

// Admin Coupon Management
export const getAdminCoupons = () => api.get('/admin/coupons');
export const createAdminCoupon = (couponData) => api.post('/admin/coupons', couponData);
export const updateAdminCoupon = (id, couponData) => api.patch(`/admin/coupons/${id}`, couponData);
export const deleteAdminCoupon = (id) => api.delete(`/admin/coupons/${id}`);

// Admin Promotional Emails
export const sendPromotionalEmail = (emailData) => api.post('/admin/emails/promotional', emailData);

// Admin Price Management
export const getAdminPrices = () => api.get('/admin/prices');

export default api;
