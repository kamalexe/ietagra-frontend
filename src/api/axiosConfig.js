import axios from 'axios';
import { getToken } from '../services/LocalStorageService';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
    (config) => {
        const { access_token } = getToken();
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Global Errors (Optional)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // You could handle 401 Unauthorized (Logout) here
        return Promise.reject(error);
    }
);

export default axiosInstance;
