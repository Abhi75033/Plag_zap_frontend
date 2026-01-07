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

// Blog API
export const blogAPI = {
    // Public
    getAll: (params) => axios.get(`${API_BASE}/blogs`, { params }),
    getBySlug: (slug) => axios.get(`${API_BASE}/blogs/${slug}`),

    // Admin (require auth)
    getAllAdmin: () => axios.get(`${API_BASE}/admin/blogs`, createAuthConfig()),
    create: (data) => axios.post(`${API_BASE}/admin/blogs`, data, createAuthConfig()),
    update: (id, data) => axios.put(`${API_BASE}/admin/blogs/${id}`, data, createAuthConfig()),
    delete: (id) => axios.delete(`${API_BASE}/admin/blogs/${id}`, createAuthConfig()),
    toggleFeatured: (id) => axios.patch(`${API_BASE}/admin/blogs/${id}/featured`, {}, createAuthConfig())
};

// News API
export const newsAPI = {
    // Public
    getAll: (params) => axios.get(`${API_BASE}/news`, { params }),
    getById: (id) => axios.get(`${API_BASE}/news/${id}`),

    // Admin (require auth)
    getAllAdmin: () => axios.get(`${API_BASE}/admin/news`, createAuthConfig()),
    create: (data) => axios.post(`${API_BASE}/admin/news`, data, createAuthConfig()),
    update: (id, data) => axios.put(`${API_BASE}/admin/news/${id}`, data, createAuthConfig()),
    delete: (id) => axios.delete(`${API_BASE}/admin/news/${id}`, createAuthConfig())
};

// News Comments API
export const newsCommentsAPI = {
    // Public
    getComments: (newsId) => axios.get(`${API_BASE}/news/${newsId}/comments`),

    // Protected (require auth)
    createComment: (newsId, comment) => axios.post(`${API_BASE}/news/${newsId}/comments`, { comment }, createAuthConfig()),
    deleteComment: (commentId) => axios.delete(`${API_BASE}/news/comments/${commentId}`, createAuthConfig()),
    toggleLike: (commentId) => axios.post(`${API_BASE}/news/comments/${commentId}/like`, {}, createAuthConfig())
};
