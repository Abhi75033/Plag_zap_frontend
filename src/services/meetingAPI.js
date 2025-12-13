import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://plagzap-backend-8yxx.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Meeting API endpoints
export const meetingAPI = {
    // Create a new meeting
    createMeeting: (title, maxParticipants = 50) =>
        api.post('/meetings/create', { title, maxParticipants }),

    // Get meeting details
    getMeeting: (code) =>
        api.get(`/meetings/${code}`),

    // Join a meeting
    joinMeeting: (code) =>
        api.post(`/meetings/${code}/join`),

    // End a meeting (host only)
    endMeeting: (code) =>
        api.post(`/meetings/${code}/end`),

    // Get user's meetings
    getMyMeetings: () =>
        api.get('/meetings/user/my-meetings')
};

export default api;
