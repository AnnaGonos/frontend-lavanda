import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { loginUser } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useCartContext } from '../../context/CartContext';
import { useFavoriteContext } from '../../context/FavoriteContext';
import InputMask from "react-input-mask";

const schema = yup.object().shape({
    phone: yup.string().required('Телефон обязателен'),
    password: yup.string().min(6).required('Пароль обязателен'),
});

type FormData = yup.InferType<typeof schema>;

export const LoginModal: React.FC = () => {
    const { closeAuthModal, toggleToRegister, login: authLogin } = useAuthContext();
    const { refreshCart } = useCartContext();
    const { refreshFavorites } = useFavoriteContext();
    const navigate = useNavigate();

    const { register, handleSubmit, setError } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const [serverError, setServerError] = useState('');

    const onSubmit = async (data: FormData) => {
        try {
            const response = await loginUser(data);

            authLogin(response.accessToken, response.user);

            await Promise.all([refreshCart(), refreshFavorites()]);

            closeAuthModal();
            navigate('/lk');
        } catch (err: any) {
            const message = err.response?.data?.message || 'Ошибка входа';
            setServerError(message);
            setError('password', {
                type: 'manual',
                message: message
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Вход</h2>

            <InputMask mask="+7 (999) 999-99-99"{...register('phone')} placeholder="Телефон"/>

            <input type="password" {...register('password')} placeholder="Пароль"/>

            <button className="auth-modal__button" type="submit">Войти</button>

            <p className="auth-modal__footer">
                Нет аккаунта?{' '}
                <button
                    className="auth-modal__link"
                    type="button"
                    onClick={toggleToRegister}
                >
                    Зарегистрироваться
                </button>
            </p>

            {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
        </form>
    );
};

