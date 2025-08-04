import axios from 'axios';
import { User } from '../types/user.type';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const getUserProfile = async (): Promise<User> => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Токен не найден');
    }

    try {
        const response = await axios.get(`${API_URL}/api/users/me`, {
            headers: {
                Authorization: `Bearer ${token.trim()}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении профиля:', error);
        throw error;
    }
};

