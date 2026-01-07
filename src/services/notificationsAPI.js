import axios from 'axios';

const API_BASE = 'https://plagzapbackend-production.up.railway.app/api';

// Create axios instance with auth token
const createAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

// Notifications API
export const notificationsAPI = {
    // User endpoints
    getAll: (params) => axios.get(`${API_BASE}/notifications`, { ...createAuthConfig(), params }),
    markAsRead: (id) => axios.patch(`${API_BASE}/notifications/${id}/read`, {}, createAuthConfig()),
    markAllAsRead: () => axios.patch(`${API_BASE}/notifications/read-all`, {}, createAuthConfig()),
    delete: (id) => axios.delete(`${API_BASE}/notifications/${id}`, createAuthConfig()),

    // Admin endpoints
    getTemplates: () => axios.get(`${API_BASE}/notifications/admin/templates`, createAuthConfig()),
    getStats: () => axios.get(`${API_BASE}/notifications/admin/stats`, createAuthConfig()),
    sendToAll: (data) => axios.post(`${API_BASE}/notifications/admin/send-all`, data, createAuthConfig()),
    sendToUser: (data) => axios.post(`${API_BASE}/notifications/admin/send-user`, data, createAuthConfig())
};
