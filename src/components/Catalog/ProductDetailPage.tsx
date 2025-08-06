import React, {useEffect, useState} from 'react';
import PageMeta from '../../components/PageMeta/PageMeta';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {Product} from '../../types/product.types';
import {VscZoomIn} from '@react-icons/all-files/vsc/VscZoomIn';
import {FaRegHeart} from '@react-icons/all-files/fa/FaRegHeart';
import {FaHeart} from '@react-icons/all-files/fa/FaHeart';
import {FaStar} from "@react-icons/all-files/fa/FaStar";
import {FaQuoteLeft} from "@react-icons/all-files/fa/FaQuoteLeft";

import axios from 'axios';
import {useAuthContext} from '../../context/AuthContext';
import {useFavoriteContext} from '../../context/FavoriteContext';
import {Notification, NotificationType} from '../Notification/Notification';
import {LoadingOverlay} from "../LoadingOverlay/LoadingOverlay";
import {useCartContext} from "../../context/CartContext";
import {Review} from "../../types/review.types";


export const ProductDetailPage = () => {
    const {id} = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const {token, openAuthModal} = useAuthContext();
    const {favoriteIds, setFavoriteIds, setFavoriteCount} = useFavoriteContext();
    const {cartCount, setCartCount} = useCartContext();
    const navigate = useNavigate();

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(true);

    const [averageRating, setAverageRating] = useState<number | null>(null);
    const [totalReviews, setTotalReviews] = useState(0);

    const [notification, setNotification] = useState<{
        message: string;
        type: NotificationType;
    } | null>(null);

    const [isFavorite, setIsFavorite] = useState(false);
    const [inCart, setInCart] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const API_URL = 'https://backend-lavanda.onrender.com/api';

    const showNotification = (message: string, type: NotificationType) => {
        setNotification({message, type});
        setTimeout(() => setNotification(null), 6500);
    };

    const openImageModal = (image: string) => {
        setSelectedImage(image);
        setIsModalOpen(true);
    };

    const closeImageModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${API_URL}/products/${id}`);
                if (!response.ok) throw new Error('Товар не найден');
                const data = await response.json();
                setProduct(data);

                if (token && favoriteIds.length > 0) {
                    setIsFavorite(favoriteIds.includes(data.id));
                }

                if (token) {
                    const cartRes = await axios.get(`${API_URL}/cart`, {
                        headers: {Authorization: `Bearer ${token}`},
                    });
                    const cartItems = cartRes.data;
                    setInCart(cartItems.some((item: any) => item.product.id === data.id));
                }
            } catch (err) {
                setError('Не удалось загрузить товар');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, token, favoriteIds]);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!token) {
            showNotification('Войдите, чтобы добавить в избранное', 'error');
            openAuthModal();
            return;
        }

        if (!product) return;

        const newIsFavorite = !isFavorite;
        setIsFavorite(newIsFavorite);

        try {
            await axios.post(
                `${API_URL}/favorites/toggle`,
                {productId: product.id},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (newIsFavorite) {
                setFavoriteIds((prev) => [...prev, product.id]);
                setFavoriteCount((prev) => prev + 1);
            } else {
                setFavoriteIds((prev) => prev.filter((id) => id !== product.id));
                setFavoriteCount((prev) => Math.max(0, prev - 1));
            }

            showNotification(
                newIsFavorite ? 'Добавлено в избранное' : 'Удалено из избранного',
                'success'
            );
        } catch (error) {
            console.error('Ошибка при изменении избранного', error);
            setIsFavorite(isFavorite);
            showNotification('Ошибка при изменении избранного', 'error');
        }
    };

    const addToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!token) {
            showNotification('Войдите, чтобы добавить в корзину', 'error');
            openAuthModal();
            return;
        }

        if (!product || product.stock <= 0) {
            showNotification('Товар временно недоступен', 'error');
            return;
        }

        try {
            await axios.post(
                `${API_URL}/cart/add`,
                {productId: product.id, quantity},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setInCart(true);
            setCartCount((prev) => prev + quantity);
            showNotification('Товар добавлен в корзину', 'success');
        } catch (error) {
            console.error('Ошибка при добавлении в корзину', error);
            showNotification('Не удалось добавить товар в корзину', 'error');
        }
    };

    useEffect(() => {
        if (!product?.id) return;

        const fetchReviews = async () => {
            try {
                const res = await axios.get<Review[]>(
                    `http://localhost:5000/api/reviews?productId=${product.id}`
                );

                const reviews = res.data;

                setReviews(reviews);

                if (reviews.length > 0) {
                    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
                    setAverageRating(Math.round(avg * 2) / 2);
                    setTotalReviews(reviews.length);
                } else {
                    setAverageRating(null);
                    setTotalReviews(0);
                }
            } catch (err) {
                console.error('Ошибка загрузки отзывов:', err);
                setAverageRating(null);
                setReviews([]);
            } finally {
                setLoadingReviews(false);
            }
        };

        fetchReviews();
    }, [product?.id]);


    const goToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigate('/lk/cart');
    };

    const isProductAvailable = (product?.stock ?? 0) > 0;

    if (loading) {
        return <LoadingOverlay text="Загружаем товар..."/>;
    }

    if (error || !product) {
        return <div>{error || 'Товар не найден'}</div>;
    }

    return (
        <>
            <PageMeta title={product.name} description={product.description}/>
            <Breadcrumbs currentTitle={product.name}/>

            {notification && (
                <Notification message={notification.message} type={notification.type}
                              onClose={() => setNotification(null)}/>
            )}

            <section className="product-detail">
                <div className="product-detail__image" onClick={() => openImageModal(product.image)}>
                    <img src={product.image} alt={product.name} className="product-detail__image-main"/>
                    <VscZoomIn/>
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

                        {averageRating !== null && (
                            <div className="product-detail__rating">
                                <p>{averageRating.toFixed(1)}</p>
                                <div className="rating-stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar key={star} size={20}
                                                className={
                                                    star <= averageRating
                                                        ? 'star-full'
                                                        : star - 0.5 <= averageRating
                                                            ? 'star-half'
                                                            : 'star-empty'
                                                }
                                        />
                                    ))}
                                </div>
                                <span>( {totalReviews} )</span>
                            </div>
                        )}

                        <div className="product-detail__actions">
                            {inCart ? (
                                <button className="product-detail__button product-detail__button--view"
                                        onClick={goToCart}>
                                    Перейти в корзину
                                </button>
                            ) : (
                                <button className="product-detail__button" disabled={!isProductAvailable}
                                        onClick={addToCart}>
                                    {isProductAvailable ? 'Добавить в корзину' : 'Нет в наличии'}
                                </button>
                            )}

                            <button className={
                                isFavorite
                                    ? 'product-detail__favorite product-detail__favorite--active'
                                    : 'product-detail__favorite'
                            }
                                    onClick={toggleFavorite}
                                    disabled={loading}
                                    aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                            >
                                {isFavorite ? (
                                    <FaHeart className="product-detail__icon--active"/>
                                ) : (
                                    <FaRegHeart className="product-card__icon"/>
                                )}
                            </button>
                        </div>

                        <p><strong>Состав:</strong> {product.composition}</p>
                        <p className="product-detail__description">{product.description}</p>
                    </div>
                </div>
            </section>

            {isModalOpen && selectedImage && (
                <div className="image-modal" onClick={closeImageModal}>
                    <div className="image-modal__content" onClick={(e) => e.stopPropagation()}>
                        <button className="image-modal__close" onClick={closeImageModal}>&times;</button>
                        <img src={selectedImage} alt="Увеличенное изображение" className="image-modal__img"/>
                    </div>
                </div>
            )}

            {product && (
                <section className="product-reviews">
                    <h3>{product.name}: Отзывы ( {reviews.length} )</h3>

                    {loadingReviews ? (
                        <p>Загрузка отзывов...</p>
                    ) : reviews.length === 0 ? (
                        <p>Поделитесь, пожалуйста, своим впечатлением о данном букете. Это поможет другим пользователям
                            сделать свой выбор</p>
                    ) : (
                        <div className="reviews-list">
                            {reviews.map((review) => (
                                <div key={review.id} className="review-item">
                                    {review.imageUrl && (
                                        <div className="review-image">
                                            <img src={review.imageUrl} alt="Фото отзыва"/>
                                        </div>
                                    )}

                                    <div className="review-item__content">
                                        <div className="review-icon-background">
                                            <FaQuoteLeft />
                                        </div>

                                        <div className="review-header">
                                            <strong>{review.author.firstName}</strong>

                                            <div className="review-header__body">
                                                <span>{review.rating} <FaStar/></span>
                                                <small>{new Date(review.createdAt).toLocaleDateString('ru-RU')}</small>
                                            </div>
                                            <p className="review-description">{review.description}</p>
                                        </div>


                                        {review.comments && review.comments.length > 0 && (
                                            <div className="review-comments">
                                                {review.comments.map((comment) => (
                                                    <div key={comment.id} className="review-comment">
                                                        <div className="review-comment__header">
                                                            <strong>{comment.authorName}</strong>
                                                            <small>{new Date(comment.createdAt).toLocaleDateString('ru-RU')}</small>
                                                        </div>
                                                        <p>{comment.text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </>
    );
};

export default ProductDetailPage;

