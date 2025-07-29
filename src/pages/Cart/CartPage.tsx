import React, {useEffect, useState} from 'react';
import {useAuthContext} from '../../context/AuthContext';
import {FaTrashAlt} from '@react-icons/all-files/fa/FaTrashAlt';
import {BsPlus} from '@react-icons/all-files/bs/BsPlus';
import {BsDash} from '@react-icons/all-files/bs/BsDash';
import {BiTrash} from '@react-icons/all-files/bi/BiTrash';
import {formatPrice} from '../../utils/formatPrice';

import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import './CartPage.css';
import {useNotification} from "../../context/NotificationContext";
import PageMeta from "../../components/PageMeta/PageMeta";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import SectionHeader from "../../components/Partials/SectionHeader";
import {CartItem} from "../../types/product.types";
import {LoadingOverlay} from "../../components/LoadingOverlay/LoadingOverlay";
import {useCartContext} from "../../context/CartContext";


export const CartPage: React.FC = () => {
    const {token, openAuthModal} = useAuthContext();
    const {showNotification} = useNotification();
    const {cartCount, setCartCount} = useCartContext();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get<CartItem[]>('https://backend-lavanda.onrender.com/api/cart/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const cartData = res.data;
                setCartItems(cartData);

                const totalQuantity = cartData.reduce((sum: number, item: CartItem) => {
                    return sum + item.quantity;
                }, 0);

                setCartCount(totalQuantity);
            } catch (error) {
                console.error('Ошибка загрузки корзины:', error);
                showNotification('Ошибка загрузки корзины', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [token, setCartCount]);

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => {
        const price = item.product.discount ?? item.product.price;
        return sum + price * item.quantity;
    }, 0);

    const originalPrice = cartItems.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
    }, 0);

    const totalDiscount = originalPrice - totalPrice;

    const increment = async (cartId: number) => {
        if (!token) {
            openAuthModal();
            return;
        }

        try {
            await axios.patch(`https://backend-lavanda.onrender.com/api/cart/item/${cartId}/increment`, {}, {
                headers: {Authorization: `Bearer ${token}`},
            });

            setCartItems((prev) =>
                prev.map((item) =>
                    item.id === cartId ? {...item, quantity: item.quantity + 1} : item
                )
            );

            setCartCount(prev => prev + 1);

            showNotification('Количество увеличено', 'success');
        } catch (error) {
            console.error('Ошибка при увеличении количества:', error);
            showNotification('Ошибка при изменении количества', 'error');
        }
    };

    const decrement = async (cartId: number) => {
        if (!token) {
            openAuthModal();
            return;
        }

        try {
            await axios.patch(`https://backend-lavanda.onrender.com/api/cart/item/${cartId}/decrement`, {}, {
                headers: {Authorization: `Bearer ${token}`},
            });

            setCartItems((prev) =>
                prev.map((item) => ({
                    ...item,
                    quantity: item.id === cartId ? item.quantity - 1 : item.quantity,
                }))
                    .filter((item) => item.quantity > 0)
            );

            setCartCount(prev => Math.max(0, prev - 1));

            showNotification('Количество уменьшено', 'success');
        } catch (error) {
            console.error('Ошибка при уменьшении количества:', error);
            showNotification('Ошибка при изменении количества', 'error');
        }
    };

    const removeItem = async (cartId: number) => {
        if (!token) {
            openAuthModal();
            return;
        }

        try {
            await axios.delete(`https://backend-lavanda.onrender.com/api/cart/item/${cartId}`, {
                headers: {Authorization: `Bearer ${token}`},
            });

            const itemToRemove = cartItems.find(item => item.id === cartId);
            const quantityToRemove = itemToRemove?.quantity || 0;

            setCartItems((prev) => prev.filter((item) => item.id !== cartId));
            setCartCount(prev => Math.max(0, prev - quantityToRemove));

            showNotification('Товар удалён из корзины', 'success');
        } catch (error) {
            console.error('Ошибка при удалении товара:', error);
            showNotification('Ошибка при удалении товара', 'error');
        }
    };

    const clearCart = async () => {
        if (!token) {
            openAuthModal();
            return;
        }

        if (!window.confirm('Вы уверены, что хотите очистить корзину?')) return;

        try {
            await axios.delete('https://backend-lavanda.onrender.com/api/cart/clear', {
                headers: {Authorization: `Bearer ${token}`},
            });

            const totalQuantityBefore = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            setCartItems([]);
            setCartCount(Math.max(0, cartCount - totalQuantityBefore));

            showNotification('Корзина очищена', 'success');
        } catch (error) {
            console.error('Ошибка при очистке корзины:', error);
            showNotification('Ошибка при очистке корзины', 'error');
        }
    };

    if (!token) {
        return (
            <>
                <PageMeta title="Корзина" description="Не вошли в аккаунт, чтоыб просматривать корзину"/>
                <Breadcrumbs currentTitle="Корзина"/>

                <section className="cart">
                    <div className="cart-empty">
                        <h2>Чтобы увидеть корзину — войдите</h2>
                        <button onClick={openAuthModal} className="cart-login__button">
                            Войти
                        </button>
                    </div>
                </section>
            </>
        );
    }

    if (loading) {
        return <LoadingOverlay text="Загрузка корзины..."/>;
    }

    if (cartItems.length === 0) {
        return (
            <>
                <PageMeta title="Корзина" description="Ваша корзина пуста"/>
                <Breadcrumbs currentTitle="Корзина"/>
                <section className="cart">
                    <div className="cart-empty">
                        <h2>В корзине пока ничего нет</h2>
                        <p>Добавляйте товары, чтобы оформить заказ</p>
                        <Link to="/catalog" className="cart-back__button">
                            Перейти в каталог
                        </Link>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <PageMeta title="Корзина" description="Ваша корзина товаров"/>
            <Breadcrumbs currentTitle="Корзина"/>

            <section className="cart">
                <SectionHeader title="Корзина"/>

                <div className="cart__container">
                    <div className="cart__list">
                        <div className="cart__header">
                            <button className="cart__clear-button" onClick={clearCart} aria-label="Очистить корзину">
                                <p>Очистить корзину</p>
                                <FaTrashAlt/>
                            </button>
                        </div>

                        {cartItems.map((item) => {
                            // Проверяем наличие товара
                            const isProductAvailable = item.product.stock > 0;
                            const isProductInStock = item.product.stock >= item.quantity;

                            return (
                                <div className="cart__item" key={item.id}>
                                    <div className="cart__item-image">
                                        <img src={item.product.image} alt={item.product.name}/>
                                    </div>

                                    <div className="cart__item-info">
                                        <h3 className="cart__item-name">{item.product.name}</h3>
                                        <p className="cart__item-composition">{item.product.composition}</p>
                                        {!isProductAvailable && (
                                            <p className="cart__item-out-of-stock">Товар закончился</p>
                                        )}
                                        {isProductAvailable && !isProductInStock && (
                                            <p className="cart__item-low-stock">Осталось только {item.product.stock} шт.</p>
                                        )}
                                    </div>

                                    <div className="cart__item-prices">
                                        {item.product.discount ? (
                                            <>
                                                <span className="cart__price cart__price--discount">
                                                    {formatPrice((item.product.discount || item.product.price) * item.quantity)} ₽
                                                </span>
                                                <span className="cart__price cart__price--old">
                                                    {formatPrice(item.product.price * item.quantity)} ₽
                                                </span>
                                            </>
                                        ) : (
                                            <span className="cart__price">
                                                {formatPrice(item.product.price * item.quantity)} ₽
                                            </span>
                                        )}
                                    </div>

                                    <div className="cart__item-controls">
                                        <div className="cart__quantity-controls">
                                            <button className="cart__btn cart__btn--decrease"
                                                onClick={() => decrement(item.id)}
                                                disabled={item.quantity <= 1 || !isProductAvailable}
                                            >
                                                <BsDash/>
                                            </button>
                                            <span className="cart__quantity">{item.quantity}</span>
                                            <button className="cart__btn cart__btn--increase"
                                                onClick={() => increment(item.id)}
                                                disabled={
                                                    item.quantity >= item.product.stock ||
                                                    !isProductAvailable ||
                                                    item.quantity >= item.product.stock
                                                }
                                            >
                                                <BsPlus/>
                                            </button>
                                        </div>

                                        <button className="cart__remove-item" onClick={() => removeItem(item.id)}>
                                            <BiTrash/>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="cart__summary">
                        <h2 className="cart__summary-title">Ваша корзина</h2>

                        <div className="cart__summary-row">
                            <span>Товары ({totalQuantity})</span>
                            <span>{formatPrice(originalPrice)} ₽</span>
                        </div>

                        {totalDiscount > 0 && (
                            <div className="cart__summary-row cart__summary-row--discount">
                                <span>Скидка:</span>
                                <span className="cart__summary-price">- {formatPrice(totalDiscount)} ₽</span>
                            </div>
                        )}

                        <div className="cart__summary-row cart__summary-total">
                            <span>Итого:</span>
                            <span>{totalPrice} ₽</span>
                        </div>

                        <button
                            className="cart__button-checkout"
                            onClick={() => navigate('/lk/checkout')}
                            disabled={cartItems.some(item => item.product.stock <= 0)}
                        >
                            Перейти к оформлению
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

