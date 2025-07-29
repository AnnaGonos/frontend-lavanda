import axios from 'axios';
import {
    LoginCredentials,
    RegisterCredentials,
    AuthResponse
} from '../types/auth.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/auth`;

const authApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

authApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

authApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.dispatchEvent(new Event('storage'));
        }
        return Promise.reject(error);
    }
);

export const registerUser = async (data: RegisterCredentials): Promise<AuthResponse> => {
    try {
        const response = await authApi.post<AuthResponse>('/register', data);
        return response.data;
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        throw handleError(error);
    }
};

export const loginUser = async ({ phone, password }: LoginCredentials): Promise<AuthResponse> => {
    try {
        const response = await authApi.post<AuthResponse>('/login', { phone, password });
        return response.data;
    } catch (error) {
        console.error('Ошибка логина:', error);
        throw handleError(error);
    }
};

export const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
};

export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
    localStorage.setItem('token', token);
};

export const getCurrentUser = (): any => {
    const user = localStorage.getItem('user');
    if (!user || user === 'undefined') {
        return null;
    }
    try {
        return JSON.parse(user);
    } catch (error) {
        console.error('Ошибка парсинга данных пользователя:', error);
        return null;
    }
};

const handleError = (error: any): Error => {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message || 'Произошла ошибка';
        return new Error(message);
    }
    return new Error('Произошла неизвестная ошибка');
};

export const validateToken = async (token: string): Promise<boolean> => {
    try {
        await authApi.get('/me');
        return true;
    } catch (error) {
        return false;
    }
};
