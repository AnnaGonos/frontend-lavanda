import React, { useState } from 'react';
import axios from 'axios';
import { User } from '../../types/user.type';
import { useNotification } from '../../context/NotificationContext';

const API_URL = 'https://backend-lavanda.onrender.com/api/users/me';

interface EditAccountProps {
    user: User;
    onUpdateUser?: () => void;
}

export const EditAccount: React.FC<EditAccountProps> = ({ user, onUpdateUser }) => {
    const [formData, setFormData] = useState(user);
    const { showNotification } = useNotification();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Токен не найден');
            }

            const updateData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
            };

            const response = await axios.patch(
                API_URL,
                updateData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                showNotification('Данные успешно обновлены', 'success');
                onUpdateUser?.();
            }
        } catch (err: any) {
            const message =
                err.response?.data?.message ||
                err.message ||
                'Ошибка при сохранении данных';

            showNotification(message, 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="edit-account-form">
            <h3>Редактирование аккаунта</h3>

            <label>
                Имя
                <input name="firstName" value={formData.firstName} onChange={handleChange} />
            </label>

            <label>
                Фамилия
                <input name="lastName" value={formData.lastName} onChange={handleChange} />
            </label>

            <label>
                Email
                <input name="email" value={formData.email} onChange={handleChange} />
            </label>

            <label>
                Телефон
                <input name="phone" value={formData.phone} onChange={handleChange} />
            </label>

            <button type="submit" className="edit-account-form__button">Сохранить изменения</button>
        </form>
    );
};

