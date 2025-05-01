import axios from 'axios';

const API_ENDPOINT = import.meta.env.VITE_API_URL;

const getAccessToken = () => localStorage.getItem("accessToken");

const api = axios.create({
    baseURL: API_ENDPOINT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to dynamically set headers
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Set Content-Type dynamically
        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        } else if (config.data) {
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Error during request setup:', error.response ?? error.request ?? error.message);
        return Promise.reject(error || 'An error occurred');
    }
);

export default api;
