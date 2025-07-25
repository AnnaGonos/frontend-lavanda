import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { registerUser, loginUser } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import { useAuthContext } from '../../context/AuthContext';

const schema = yup.object().shape({
    firstName: yup.string().required('Имя обязательно'),
    lastName: yup.string().required('Фамилия обязательна'),
    phone: yup.string().required('Телефон обязателен'),
    password: yup.string().min(6).required('Пароль обязателен'),
    email: yup.string().email('Неверный формат email').required('Email обязателен'),
});

type FormData = yup.InferType<typeof schema>;

export const RegisterModal: React.FC = () => {
    const { closeAuthModal, toggleToLogin } = useAuthContext();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: schema && yupResolver(schema),
    });

    const [serverError, setServerError] = useState('');

    const onSubmit = async (data: FormData) => {
        try {
            await registerUser(data);
            await loginUser({ phone: data.phone, password: data.password });
            closeAuthModal();
            navigate('/lk');
        } catch (err: any) {
            setServerError(err.response?.data?.message || 'Ошибка регистрации');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Регистрация</h2>

            <input {...register('firstName')} placeholder="Имя" />
            {errors.firstName && <p>{errors.firstName.message}</p>}

            <input {...register('lastName')} placeholder="Фамилия" />
            {errors.lastName && <p>{errors.lastName.message}</p>}

            <input {...register('email')} placeholder="Email" />
            {errors.email && <p>{errors.email.message}</p>}

            <InputMask mask="+7 (999) 999-99-99" {...register('phone')} placeholder="Телефон" />
            {errors.phone && <p>{errors.phone.message}</p>}

            <input type="password" {...register('password')} placeholder="Пароль" />
            {errors.password && <p>{errors.password.message}</p>}

            {serverError && <p style={{ color: 'red' }}>{serverError}</p>}

            <button className="auth-modal__button" type="submit">Зарегистрироваться</button>
            <button type="button" onClick={toggleToLogin}>Назад</button>
        </form>
    );
};


