import React, {useEffect, useState} from 'react';
import {Product} from '../../types/product.types';
import {useAuthContext} from "../../context/AuthContext";
import {Link, useNavigate} from 'react-router-dom';
import {FaRegHeart} from '@react-icons/all-files/fa/FaRegHeart';
import {FaHeart} from '@react-icons/all-files/fa/FaHeart';
import axios from 'axios';
import {useFavoriteContext} from "../../context/FavoriteContext";
import {NotificationType} from "../Notification/Notification";
import {useCartContext} from "../../context/CartContext";
import {formatPrice} from "../../utils/formatPrice";


interface ProductCardProps {
    product: Product;
    isFavorite: boolean;
    onNotify: (message: string, type: NotificationType) => void;
    onToggleFavorite: (productId: number, isFav: boolean) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
                                                            product,
                                                            isFavorite: initialIsFavorite,
                                                            onNotify,
                                                            onToggleFavorite,
                                                        }) => {
    const {token, openAuthModal} = useAuthContext();
    const {setFavoriteCount} = useFavoriteContext();
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [inCart, setInCart] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { cartCount, setCartCount } = useCartContext();

    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        const checkIfInCart = async () => {
            if (!token) {
                setInCart(false);
                return;
            }

            try {
                const res = await axios.get(`${API_URL}/cart/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const cartItems = res.data;
                const isInCart = cartItems.some((item: any) => item.product.id === product.id);
                setInCart(isInCart);
            } catch (err) {
                console.error('Ошибка при проверке корзины:', err);
            }
        };

        checkIfInCart();
    }, [token, product.id]);

    useEffect(() => {
        setIsFavorite(initialIsFavorite);
    }, [initialIsFavorite]);

    const addToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!token) {
            onNotify('Войдите, чтобы добавить в корзину', 'error');
            openAuthModal();
            return;
        }

        setLoading(true);

        try {
            await axios.post(
                `${API_URL}/cart/add`,
                {productId: product.id, quantity: 1},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setInCart(true);
            setCartCount(prev => prev + 1);
            onNotify('Товар добавлен в корзину', 'success');
        } catch (error) {
            console.error('Ошибка при добавлении в корзину:', error);
            onNotify('Ошибка при добавлении в корзину', 'error');
        } finally {
            setLoading(false);
        }
    };

    const goToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/lk/cart');
    };

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (loading) return;

        if (!token) {
            onNotify('Войдите, чтобы добавить в избранное', 'error');
            openAuthModal();
            return;
        }

        const newIsFavorite = !isFavorite;
        setIsFavorite(newIsFavorite);

        try {
            const res = await axios.post(
                `${API_URL}/favorites/toggle`,
                {productId: product.id},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            onToggleFavorite(product.id, newIsFavorite);
            onNotify(
                newIsFavorite ? 'Добавлено в избранное' : 'Удалено из избранного',
                'success'
            );
        } catch (error) {
            console.error('Ошибка при изменении избранного:', error);
            setIsFavorite(initialIsFavorite);
            onNotify('Ошибка при изменении избранного', 'error');

            if (axios.isAxiosError(error) && error.response?.status === 401) {
                onNotify('Необходима авторизация', 'error');
                openAuthModal();
            }
        }
    };

    return (
        <div className="product-card">
            <div className="product-card__image-wrapper">
                <img src={product.image} alt={product.name} className="product-card__image"/>
                <button
                    className={
                        isFavorite
                            ? 'product-card__favorite product-card__favorite--active'
                            : 'product-card__favorite'
                    }
                    onClick={toggleFavorite}
                    disabled={loading}
                    aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                >
                    {isFavorite ? (
                        <FaHeart className="product-card__icon--active"/>
                    ) : (
                        <FaRegHeart className="product-card__icon"/>
                    )}
                </button>
            </div>

            <div className="product-card__info">
                <h4 className="product-card__name">{product.name}</h4>
                <p className="product-card__description">{product.composition}</p>

                <p className="product-card__prices">
                    {product.discount ? (
                        <>
                            <span className="product-card__price">{formatPrice(product.discount)} ₽</span>
                            <span className="product-card__price price-old">{formatPrice(product.price)} ₽</span>
                        </>
                    ) : (
                        <span className="product-card__price">{formatPrice(product.price)} ₽</span>
                    )}
                </p>

                <div className="product-card__actions">
                    <button className={inCart ? 'product-card__link product-card__link--in-cart' : 'product-card__link'}
                            onClick={inCart ? goToCart : addToCart} disabled={loading}>
                        {inCart ? 'В корзине' : 'В корзину'}
                    </button>
                </div>
            </div>
        </div>
    );
};

