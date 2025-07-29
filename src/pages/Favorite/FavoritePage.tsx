import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useFavoriteContext } from '../../context/FavoriteContext';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {useNotification} from "../../context/NotificationContext";
import PageMeta from "../../components/PageMeta/PageMeta";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import SectionHeader from "../../components/Partials/SectionHeader";
import {ProductCard} from "../../components/Catalog/ProductCard";
import {LoadingOverlay} from "../../components/LoadingOverlay/LoadingOverlay";


export const FavoritesPage: React.FC = () => {
    const { token, openAuthModal } = useAuthContext();
    const { favoriteIds, setFavoriteIds, setFavoriteCount } = useFavoriteContext();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get('https://backend-lavanda.onrender.com/api/favorites', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = res.data;
                const favoriteProducts = data.map((fav: any) => fav.product);
                setProducts(favoriteProducts);
            } catch (error) {
                console.error('Ошибка загрузки избранного:', error);
                showNotification('Ошибка загрузки избранного', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [token]);


    const handleRemoveFromFavorite = async (productId: number, isFav: boolean) => {
        if (!token) {
            showNotification('Войдите, чтобы добавить в избранное', 'error');
            openAuthModal();
            return;
        }

        if (!isFav) return;

        try {
            const res = await axios.post('https://backend-lavanda.onrender.com/api/favorites/toggle',
                { productId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = res.data;

            setProducts((prev) => prev.filter((product) => product.id !== productId));
            setFavoriteIds((prev) => prev.filter((id) => id !== productId));
            setFavoriteCount(Math.max(0, data.count));

            showNotification(data.message, 'success');
        } catch (error) {
            console.error('Ошибка при изменении избранного:', error);
            showNotification('Ошибка при изменении избранного', 'error');
        }
    };

    const handleLoginClick = (e: React.MouseEvent) => {
        e.preventDefault();
        showNotification('Войдите, чтобы добавить в избранное', 'error');
        openAuthModal();
    };

    if (!token) {
        return (
            <>
                <PageMeta title="Избранное" description="Сохраняйте товары в избранное, чтобы вернуться к ним позже" />

                <Breadcrumbs currentTitle="Избранное" />
                <section className="favorites-empty">
                    <h2>Чтобы увидеть избранное — войдите</h2>
                    <button onClick={handleLoginClick} className="favorites-login__button">
                        Войти
                    </button>
                </section>
            </>

        );
    }

    if (loading) {
        return <LoadingOverlay text="Загрузка избранного..." />;
    }

    if (products.length === 0) {
        return (
            <>
                <PageMeta title="Избранное" description="Ваш список избранных товаров пуст" />

                <Breadcrumbs currentTitle="Избранное" />
                <section className="favorites-empty">
                    <h2>В избранном пока ничего нет</h2>
                    <p>Добавляйте товары в избранное, чтобы вернуться к ним позже</p>
                    <button
                        className="favorites-back__button"
                        onClick={() => navigate('/catalog')}
                    >
                        Перейти в каталог
                    </button>
                </section>
            </>
        );
    }

    return (
        <>
            <PageMeta title="Избранное" description="Список избранных товаров" />

            <Breadcrumbs currentTitle="Избранное" />

            <section>
                <SectionHeader title="Избранное" />

                <div className="product-list">
                    <div className="product-list__grid">
                        {products.map((product) => (
                            <Link to={`/product/${product.id}`} key={product.id}>
                                <ProductCard
                                    product={product}
                                    isFavorite={true}
                                    onNotify={showNotification}
                                    onToggleFavorite={handleRemoveFromFavorite}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

