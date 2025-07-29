import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { registerUser, loginUser } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import { useAuthContext } from '../../context/AuthContext';
import { useCartContext } from '../../context/CartContext';
import { useFavoriteContext } from '../../context/FavoriteContext';

const schema = yup.object().shape({
    firstName: yup.string().required('Имя обязательно'),
    lastName: yup.string().required('Фамилия обязательна'),
    phone: yup.string().required('Телефон обязателен'),
    password: yup.string().min(6).required('Пароль обязателен'),
    email: yup.string().email('Неверный формат email').required('Email обязателен'),
});

type FormData = yup.InferType<typeof schema>;

export const RegisterModal: React.FC = () => {
    const { closeAuthModal, toggleToLogin, login: authLogin } = useAuthContext();
    const { refreshCart } = useCartContext();
    const { refreshFavorites } = useFavoriteContext();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const [serverError, setServerError] = useState('');

    const onSubmit = async (data: FormData) => {
        try {
            await registerUser(data);

            const loginResponse = await loginUser({
                phone: data.phone,
                password: data.password
            });

            authLogin(loginResponse.accessToken, loginResponse.user);

            await Promise.all([
                refreshCart(),
                refreshFavorites()
            ]);

            closeAuthModal();
            navigate('/lk');
        } catch (err: any) {
            const message = err.response?.data?.message || 'Ошибка регистрации';
            setServerError(message);
            setError('phone', {
                type: 'manual',
                message: message
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Регистрация</h2>

            <input {...register('firstName')} placeholder="Имя" />
            {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}

            <input {...register('lastName')} placeholder="Фамилия" />
            {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}

            <input {...register('email')} placeholder="Email" />
            {errors.email && <p className="error-message">{errors.email.message}</p>}

            <InputMask mask="+7 (999) 999-99-99" {...register('phone')} placeholder="Телефон" />
            {errors.phone && <p className="error-message">{errors.phone.message}</p>}

            <input type="password" {...register('password')} placeholder="Пароль" />
            {errors.password && <p className="error-message">{errors.password.message}</p>}

            {serverError && <p className="error-message">{serverError}</p>}

            <button className="auth-modal__button" type="submit">Зарегистрироваться</button>
            <button type="button" onClick={toggleToLogin} className="auth-modal__link-back">Назад</button>
        </form>
    );
};
