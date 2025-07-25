import axios from 'axios';
import {
    LoginCredentials,
    RegisterCredentials,
    AuthResponse
} from '../types/auth.types';

const API_URL = 'http://localhost:5000/api/auth';

export const registerUser = async (data: RegisterCredentials): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_URL}/register`, data);
    return response.data;
};

export const loginUser = async ({ phone, password }: LoginCredentials): Promise<AuthResponse> => {
    try {
        const response = await axios.post<AuthResponse>(`${API_URL}/login`, { phone, password });
        console.log('Login response:', response.data); // <-- добавлено

        if (response.data.accessToken) {
            localStorage.setItem('token', response.data.accessToken);
            console.log('Токен сохранён в localStorage'); // <-- добавлено
        } else {
            console.error('Токен не получен');
        }

        return response.data;
    } catch (error) {
        console.error('Ошибка логина:', error);
        throw error;
    }
};

export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

