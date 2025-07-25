import { useEffect, useState } from 'react';
import { getUserProfile } from '../services/user.api';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const data = await getUserProfile();
            setUser(data);
        } catch (err: any) {
            console.error('Ошибка загрузки профиля:', err);

            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                setUser(null);
                navigate('/', { replace: true });
            }

            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [navigate]);

    const refetchUser = async () => {
        setLoading(true);
        await fetchProfile();
    };

    return { user, loading, refetchUser };
};

