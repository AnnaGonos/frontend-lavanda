import React, { useEffect, useState } from 'react';
import PageMeta from '../../components/PageMeta/PageMeta';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Product } from '../../types/product.types';
import CategoryNotice from './CategoryNotice';
import { VscZoomIn } from '@react-icons/all-files/vsc/VscZoomIn';
import {FaRegHeart} from '@react-icons/all-files/fa/FaRegHeart';
import {FaHeart} from '@react-icons/all-files/fa/FaHeart';
import axios from 'axios';
import { useAuthContext } from '../../context/AuthContext';
import { useFavoriteContext } from '../../context/FavoriteContext';
import { Notification, NotificationType } from '../Notification/Notification';
import {LoadingOverlay} from "../LoadingOverlay/LoadingOverlay";

export const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const { token, openAuthModal } = useAuthContext();
    const { favoriteIds, setFavoriteIds, setFavoriteCount } = useFavoriteContext();
    const navigate = useNavigate();

    const [notification, setNotification] = useState<{
        message: string;
        type: NotificationType;
    } | null>(null);

    const [isFavorite, setIsFavorite] = useState(false);

    const openImageModal = (image: string) => {
        setSelectedImage(image);
        setIsModalOpen(true);
    };

    const closeImageModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isModalOpen) {
                closeImageModal();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isModalOpen]);

    const showNotification = (message: string, type: NotificationType) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 6500);
    };

    useEffect(() => {
        let isMounted = true;

        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${id}`);
                if (!response.ok) throw new Error('Товар не найден');
                const data = await response.json();
                if (!isMounted) return;

                setProduct(data);

                if (token && favoriteIds.length > 0) {
                    setIsFavorite(favoriteIds.includes(data.id));
                } else {
                    setIsFavorite(false);
                }
            } catch (err) {
                setError('Не удалось загрузить товар');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();

        return () => {
            isMounted = false;
        };
    }, [id, token, favoriteIds]);


    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (!token) {
            showNotification('Войдите, чтобы добавить в избранное', 'error');
            openAuthModal();
            return;
        }

        if (!product?.id) {
            showNotification('Товар не найден', 'error');
            return;
        }

        const newIsFavorite = !isFavorite;
        setIsFavorite(newIsFavorite);

        try {
            const res = await axios.post(
                'http://localhost:5000/api/favorites/toggle',
                { productId: product.id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = res.data;

            if (newIsFavorite) {
                setFavoriteIds((prev) => [...prev, product.id]);
            } else {
                setFavoriteIds((prev) => prev.filter((id) => id !== product.id));
            }

            setFavoriteCount((prev: number) =>
                newIsFavorite ? prev + 1 : Math.max(0, prev - 1)
            );

            showNotification(data.message, 'success');
        } catch (error) {
            console.error('Ошибка при изменении избранного', error);
            setIsFavorite(isFavorite); // откат
            showNotification('Ошибка при изменении избранного', 'error');

            if (axios.isAxiosError(error) && error.response?.status === 401) {
                showNotification('Необходима авторизация', 'error');
                openAuthModal();
            }
        }
    };

    if (loading) {
        return <LoadingOverlay text="Загружаем товар..." />;
    }


    if (error || !product) return <div>{error || 'Товар не найден'}</div>;

    return (
        <>
            <PageMeta title={product.name} description={product.description} />

            <Breadcrumbs currentTitle={product.name} />

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <section className="product-detail">
                <div className="product-detail__image" onClick={() => openImageModal(product.image)}>
                    <img src={product.image} alt={product.name} className="product-detail__image-main" />
                    <VscZoomIn />
                </div>

                <div className="product-detail__main">
                    <div className="product-detail_header">
                        <h1>{product.name}</h1>
                    </div>

                    <div className="product-detail__info">
                        <p className="product-card__prices price-main">
                            {product.discount ? (
                                <>
                                    <span className="product-card__price">{product.discount} ₽</span>
                                    <span className="product-card__price price-old">{product.price} ₽</span>
                                </>
                            ) : (
                                <span className="product-card__price">{product.price} ₽</span>
                            )}
                        </p>
                        <div className="product-detail__actions">
                            <button className="product-detail__button">Добавить в корзину</button>

                            <button
                                className={
                                    isFavorite
                                        ? 'product-detail__favorite product-detail__favorite--active'
                                        : 'product-detail__favorite'
                                }
                                onClick={toggleFavorite}
                                disabled={loading}
                                aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                            >
                                {isFavorite ? (
                                    <FaHeart className="product-detail__icon--active" />
                                ) : (
                                    <FaRegHeart className="product-card__icon" />
                                )}
                            </button>
                        </div>


                        <p><strong>Состав:</strong> {product.composition}</p>
                        <p className="product-detail__description">{product.description}</p>
                        <CategoryNotice category={product.category} />
                    </div>
                </div>
            </section>

            {isModalOpen && selectedImage && (
                <div className="image-modal" onClick={closeImageModal}>
                    <div className="image-modal__content" onClick={(e) => e.stopPropagation()}>
                        <button className="image-modal__close" onClick={closeImageModal}>
                            &times;
                        </button>
                        <img src={selectedImage} alt="Увеличенное изображение" className="image-modal__img" />
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductDetailPage;
