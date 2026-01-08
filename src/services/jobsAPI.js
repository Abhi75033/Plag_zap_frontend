import axios from 'axios';
const API_URL = 'https://plagzapbackend-production.up.railway.app/api';


const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Job APIs
export const jobsAPI = {
    // Public
    getAll: async (params) => {
        return axios.get(`${API_URL}/jobs`, { params });
    },

    getById: async (id) => {
        return axios.get(`${API_URL}/jobs/${id}`);
    },

    // Admin
    create: async (jobData) => {
        return axios.post(`${API_URL}/jobs`, jobData, {
            headers: getAuthHeader()
        });
    },

    update: async (id, jobData) => {
        return axios.put(`${API_URL}/jobs/${id}`, jobData, {
            headers: getAuthHeader()
        });
    },

    delete: async (id) => {
        return axios.delete(`${API_URL}/jobs/${id}`, {
            headers: getAuthHeader()
        });
    },

    getAllAdmin: async () => {
        return axios.get(`${API_URL}/jobs/admin/all`, {
            headers: getAuthHeader()
        });
    }
};

// Application APIs
export const applicationsAPI = {
    // User
    apply: async (jobId, formData) => {
        return axios.post(`${API_URL}/applications/apply/${jobId}`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    getMyApplications: async () => {
        return axios.get(`${API_URL}/applications/my`, {
            headers: getAuthHeader()
        });
    },

    // Admin
    getAll: async (params) => {
        return axios.get(`${API_URL}/applications/admin/all`, {
            params,
            headers: getAuthHeader()
        });
    },

    getStats: async () => {
        return axios.get(`${API_URL}/applications/admin/stats`, {
            headers: getAuthHeader()
        });
    },

    getById: async (id) => {
        return axios.get(`${API_URL}/applications/admin/${id}`, {
            headers: getAuthHeader()
        });
    },

    updateStatus: async (id, statusData) => {
        return axios.put(`${API_URL}/applications/admin/${id}/status`, statusData, {
            headers: getAuthHeader()
        });
    },

    scheduleInterview: async (id, interviewData) => {
        return axios.post(`${API_URL}/applications/admin/${id}/interview`, interviewData, {
            headers: getAuthHeader()
        });
    },

    downloadResume: async (id) => {
        return axios.get(`${API_URL}/applications/admin/${id}/resume`, {
            headers: getAuthHeader(),
            responseType: 'blob'
        });
    }
};
