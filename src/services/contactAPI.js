import axios from 'axios';
const API_URL = 'https://plagzapbackend-production.up.railway.app/api';


// Get auth token
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Public API - Submit contact form
export const submitContact = (data) => {
    return axios.post(`${API_URL}/contact/submit`, data);
};

// Admin APIs
export const contactAPI = {
    // Get all contact submissions with filters
    getAll: (params = {}) => {
        return axios.get(`${API_URL}/contact/admin/all`, {
            headers: getAuthHeader(),
            params
        });
    },

    // Get contact statistics
    getStats: () => {
        return axios.get(`${API_URL}/contact/admin/stats`, {
            headers: getAuthHeader()
        });
    },

    // Update contact status
    updateStatus: (id, data) => {
        return axios.put(`${API_URL}/contact/admin/${id}/status`, data, {
            headers: getAuthHeader()
        });
    },

    // Delete contact
    delete: (id) => {
        return axios.delete(`${API_URL}/contact/admin/${id}`, {
            headers: getAuthHeader()
        });
    }
};
