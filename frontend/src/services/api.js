import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Ubah jika port backend berbeda
    withCredentials: true, // Untuk mendukung token/cookie authentication
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// Interceptor untuk menyisipkan token ke setiap request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor untuk handle unauthorized (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            // Redirect ke login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
