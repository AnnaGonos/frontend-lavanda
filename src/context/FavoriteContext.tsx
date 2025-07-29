import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuthContext } from './AuthContext';

interface FavoriteContextType {
    favoriteCount: number;
    setFavoriteCount: React.Dispatch<React.SetStateAction<number>>;
    favoriteIds: number[];
    setFavoriteIds: React.Dispatch<React.SetStateAction<number[]>>;
    refreshFavorites: () => Promise<void>;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favoriteCount, setFavoriteCount] = useState<number>(0);
    const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
    const { isAuthenticated } = useAuthContext();

    const fetchFavorites = async () => {
        const token = localStorage.getItem('token');

        if (!isAuthenticated || !token) {
            setFavoriteCount(0);
            setFavoriteIds([]);
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/favorites', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error('Ошибка загрузки избранного');

            const data = await res.json();
            setFavoriteCount(data.length);
            setFavoriteIds(data.map((item: any) => item.productId));
        } catch (err) {
            console.error('Ошибка при загрузке избранного:', err);
            setFavoriteCount(0);
            setFavoriteIds([]);
        }
    };

    // Загружаем избранное при изменении аутентификации
    useEffect(() => {
        if (isAuthenticated) {
            fetchFavorites();
        } else {
            setFavoriteCount(0); // Принудительно обнуляем при выходе
            setFavoriteIds([]);
        }
    }, [isAuthenticated]);

    // Слушаем кастомное событие изменения состояния пользователя
    useEffect(() => {
        const handleUserStateChange = (event: CustomEvent) => {
            const { isAuthenticated: authState } = event.detail;

            if (!authState) {
                // Пользователь вышел - обнуляем счетчики
                setFavoriteCount(0);
                setFavoriteIds([]);
            } else {
                // Пользователь вошел - загружаем данные
                fetchFavorites();
            }
        };

        window.addEventListener('userStateChanged', handleUserStateChange as EventListener);
        return () => {
            window.removeEventListener('userStateChanged', handleUserStateChange as EventListener);
        };
    }, []);

    // Принудительное обновление при монтировании, если пользователь не авторизован
    useEffect(() => {
        if (!isAuthenticated) {
            setFavoriteCount(0);
            setFavoriteIds([]);
        }
    }, [isAuthenticated]);

    const refreshFavorites = async () => {
        await fetchFavorites();
    };

    return (
        <FavoriteContext.Provider
            value={{
                favoriteCount,
                setFavoriteCount,
                favoriteIds,
                setFavoriteIds,
                refreshFavorites
            }}
        >
            {children}
        </FavoriteContext.Provider>
    );
};

export const useFavoriteContext = () => {
    const context = useContext(FavoriteContext);
    if (!context) throw new Error('useFavoriteContext должен использоваться внутри FavoriteProvider');
    return context;
};