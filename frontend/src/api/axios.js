import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001",
    withCredentials: true // Fixes the cookie issue for ALL pages at once
});

// GLOBAL AUTH INTERCEPTOR: Handle stale/invalid sessions across the entire node network
API.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const msg = error.response?.data?.msg;

        // Trigger global exit if session is rejected by the backend
        if (status === 401 || (status === 404 && msg === 'User not found')) {
            console.warn("🔐 Session invalidated by central authority. Clearing node identity.");
            localStorage.removeItem('token');
            localStorage.removeItem('nexusTheme');
            localStorage.removeItem('dropPayTheme');

            // Force redirect to login if not already there
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default API;