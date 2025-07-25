import React, { useEffect, useState } from 'react';
import PageMeta from '../../components/PageMeta/PageMeta';
import SectionHeader from '../../components/Partials/SectionHeader';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './Catalog.css';
import { Product } from '../../types/product.types';
import { Link } from 'react-router-dom';
import { Notification, NotificationType } from '../Notification/Notification';
import { ProductCard } from './ProductCard';
import { useAuthContext } from '../../context/AuthContext';
import {useFavoriteContext} from "../../context/FavoriteContext";
import {LoadingOverlay} from "../LoadingOverlay/LoadingOverlay";

export const CatalogPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<{
        message: string;
        type: NotificationType;
    } | null>(null);

    const { token } = useAuthContext();
    const { setFavoriteCount, setFavoriteIds } = useFavoriteContext();

    const showNotification = (message: string, type: NotificationType) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleToggleFavorite = (productId: number, isFav: boolean) => {
        if (isFav) {
            setFavorites((prev) => [...prev, productId]);
            setFavoriteIds((prev) => [...prev, productId]);
        } else {
            setFavorites((prev) => prev.filter((id) => id !== productId));
            setFavoriteIds((prev) => prev.filter((id) => id !== productId));
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/products');
            if (!res.ok) throw new Error('Ошибка загрузки товаров');
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            setError('Не удалось загрузить товары');
        } finally {
            setLoading(false);
        }
    };

    const fetchFavorites = async () => {
        if (!token) {
            setFavorites([]);
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
            const favoriteIds = data.map((fav: any) => fav.product.id);

            setFavorites(favoriteIds);
            setFavoriteIds(favoriteIds);
            setFavoriteCount(favoriteIds.length);
        } catch (err) {
            console.error('Ошибка загрузки избранного:', err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        fetchFavorites();
    }, [token]);

    if (loading) {
        return <LoadingOverlay text="Загружаем товары..." />;
    }

    if (error) return <div>{error}</div>;

    return (
        <>
            <PageMeta title="Каталог" description="Заказать букет стало проще с нашим сайтом" />

            <Breadcrumbs />

            <section>
                <SectionHeader title="Каталог" />

                {notification && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}

                <div className="product-list">
                    {products.length === 0 ? (
                        <p className="product__none">Нет товаров</p>
                    ) : (
                        <div className="product-list__grid">
                            {products.map((product) => (
                                <Link to={`/product/${product.id}`} key={product.id} className="card__item-link">
                                    <ProductCard
                                        product={product}
                                        isFavorite={token ? favorites.includes(product.id) : false}
                                        onNotify={showNotification}
                                        onToggleFavorite={handleToggleFavorite}
                                    />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};
