import React, {useEffect, useState} from 'react';
import {useAuthContext} from '../../context/AuthContext';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import './CartPage.css';
import {useNotification} from "../../context/NotificationContext";
import PageMeta from "../../components/PageMeta/PageMeta";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import SectionHeader from "../../components/Partials/SectionHeader";
import {OrderFormData} from "../../types/order.types";
import {CartItem} from "../../types/product.types";
import {DeliveryAddressSection} from "../../components/AddressInput/DeliveryAddressSection";
import {User} from "../../types/user.type";
import {LoadingOverlay} from "../../components/LoadingOverlay/LoadingOverlay";
import {sendOrderNotification} from "../../services/telegram.service";
import { sendOrderConfirmationEmail } from '../../services/emailService.service';


export const CheckoutPage: React.FC = () => {
    const { token, openAuthModal, user, setUser } = useAuthContext();
    const {showNotification} = useNotification();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState<OrderFormData>({
        deliveryMethod: 'самовывоз',
        recipientName: '',
        recipientPhone: '',
        deliveryAddress: '',
        deliveryDate: '',
        deliveryPeriod: 'день',
        comment: '',
        paymentMethod: 'cash',
    });

    const [isSelfRecipient, setIsSelfRecipient] = useState(false);
    const [useBonus, setUseBonus] = useState(false);
    const [bonusToUse, setBonusToUse] = useState<number>(0);

    useEffect(() => {
        if (useBonus && user) {
            const maxByBalance = user.bonusPoints || 0;
            const maxByOrder = getTotalAmount(); // сумма  с доставкой
            setBonusToUse(Math.min(maxByBalance, maxByOrder));
        } else {
            setBonusToUse(0);
        }
    }, [useBonus, user, formData.deliveryMethod, cartItems]);
    useEffect(() => {
        const fetchCart = async () => {
            if (!token) return;

            try {
                const res = await axios.get('https://backend-lavanda.onrender.com/api/cart/', {
                    headers: {Authorization: `Bearer ${token}`},
                });
                setCartItems(res.data);
            } catch (error) {
                console.error('Ошибка загрузки корзины:', error);
                showNotification('Ошибка загрузки корзины', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [token]);
    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) return;

            try {
                const res = await axios.get<User>('https://backend-lavanda.onrender.com/api/users/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const userData = res.data;
                console.log('Актуальный пользователь:', userData);

                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
            } catch (error) {
                console.error('Ошибка загрузки пользователя:', error);
                showNotification('Не удалось загрузить данные', 'error');
            }
        };

        fetchUserData();
    }, [token, setUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };
    const handleSelfRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setIsSelfRecipient(checked);

        if (checked && user) {
            setFormData(prev => ({
                ...prev,
                recipientName: user.firstName || '',
                recipientPhone: user.phone || '',
            }));
        } else if (!checked) {
            setFormData(prev => ({
                ...prev,
                recipientName: '',
                recipientPhone: '',
            }));
        }
    };
    const validateForm = (): boolean => {
        const {recipientName, recipientPhone, deliveryMethod, deliveryAddress, deliveryDate} = formData;

        if (!isSelfRecipient && !recipientName.trim()) {
            showNotification('Укажите имя получателя', 'error');
            return false;
        }

        if (!isSelfRecipient && !recipientPhone.trim()) {
            showNotification('Укажите телефон получателя', 'error');
            return false;
        }

        if (deliveryMethod === 'доставка' && !deliveryAddress?.trim()) {
            showNotification('Выберите адрес доставки на карте', 'error');
            return false;
        }

        if (!deliveryDate) {
            showNotification('Выберите дату доставки', 'error');
            return false;
        }

        const today = new Date().toISOString().split('T')[0];
        if (deliveryDate < today) {
            showNotification('Дата доставки не может быть в прошлом', 'error');
            return false;
        }

        if (useBonus && bonusToUse > (user?.bonusPoints || 0)) {
            showNotification('Недостаточно бонусов', 'error');
            return false;
        }

        if (bonusToUse > getTotalAmount()) {
            showNotification('Нельзя списать больше, чем сумма заказа', 'error');
            return false;
        }

        return true;
    };
    const getTotalAmount = () => {
        let total = cartItems.reduce((sum, item) => {
            const price = item.product.discount ?? item.product.price;
            return sum + price * item.quantity;
        }, 0);

        if (formData.deliveryMethod === 'доставка') {
            total += 400;
        }

        return total;
    };
    const getFinalAmount = () => {
        const total = getTotalAmount();
        return useBonus && bonusToUse ? total - bonusToUse : total;
    };

    const getBonusEarned = () => {
        const finalAmount = getFinalAmount();
        return Math.floor(finalAmount * (user?.bonusCardLevel || 1) * 0.01);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !user) return;

        if (!validateForm()) return;

        setSubmitting(true);

        try {
            const res = await axios.post(
                'https://backend-lavanda.onrender.com/api/order/create-from-cart',
                {
                    ...formData,
                    useBonusPoints: useBonus ? bonusToUse : 0,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            try {
                await sendOrderNotification(res.data);
                console.log('📤 Уведомление флористам отправлено успешно.');
            } catch (notificationError: any) {
                console.warn('⚠️ Не удалось отправить уведомление в Telegram:', notificationError?.message || notificationError);
            }

            try {
                console.log('📤 Отправка email подтверждения заказа клиенту...');

                const emailResult = await sendOrderConfirmationEmail(res.data, user.email, user.firstName);

                if (emailResult.success) {
                    console.log('✅ Email подтверждения заказа отправлен клиенту на', user.email);
                } else {
                    console.warn('⚠️ Не удалось отправить email подтверждения клиенту:', emailResult.error);
                }
            } catch (emailError: any) {
                console.error('❌ Ошибка при вызове функции отправки email:', emailError);
            }

            showNotification('Заказ оформлен!', 'success');
            navigate(`/lk/order/success/${res.data.orderNumber}`);
        } catch (error: any) {
            console.error('Ошибка оформления заказа:', error);
            showNotification(
                error.response?.data?.message || 'Не удалось оформить заказ',
                'error'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    if (!token) {
        return (
            <div className="checkout-empty">
                <PageMeta title="Оформление заказа" description="Войдите, чтобы оформить заказ"/>
                <Breadcrumbs currentTitle="Оформление заказа"/>
                <h2>Чтобы оформить заказ — войдите</h2>
                <button onClick={openAuthModal} className="checkout-login-button">
                    Войти
                </button>
            </div>
        );
    }

    if (loading) {
        return <LoadingOverlay text="Загрузка корзины..."/>;
    }

    if (cartItems.length === 0) {
        return (
            <>
                <PageMeta title="Оформление заказа" description="Ваша корзина пуста"/>
                <Breadcrumbs currentTitle="Оформление заказа"/>

                <section className="checkout">
                    <h2>В корзине пока ничего нет</h2>
                    <Link to="/catalog" className="checkout-back-button">
                        Перейти в каталог
                    </Link>
                </section>
            </>
        );
    }

    return (
        <>
            <PageMeta title="Оформление заказа" description="Завершите оформление вашего заказа"/>
            <Breadcrumbs currentTitle="Оформление заказа"/>

            <section className="checkout">
                <SectionHeader title="Оформление заказа"/>

                <form onSubmit={handleSubmit} className="checkout__form">
                    <div className="checkout__details">
                        <div className="checkout__section">
                            <div className="checkout__header">
                                <h3>Получатель</h3>
                                <label className="checkout__self-recipient">
                                    <input type="checkbox"
                                           checked={isSelfRecipient}
                                           onChange={handleSelfRecipientChange}
                                    />
                                    Я сам(-а) получу заказ
                                </label>
                            </div>

                            {!isSelfRecipient && (
                                <>
                                    <div className="checkout__content">
                                        <input type="text" name="recipientName"
                                            placeholder="Имя получателя" value={formData.recipientName}
                                            onChange={handleChange} required/>
                                        <input type="tel" name="recipientPhone" placeholder="+7 (999) 999-99-99"
                                            value={formData.recipientPhone} onChange={handleChange} required/>
                                    </div>
                                </>
                            )}

                            {isSelfRecipient && user && (
                                <div className="checkout__self-info">
                                    <p><strong>Получатель:</strong> {user.firstName} {user.lastName || ''}</p><br/>
                                    <p><strong>Телефон:</strong> {user.phone}</p>
                                </div>
                            )}
                        </div>

                        <div className="checkout__section">
                            <h3>Комментарий для флориста или курьера</h3>

                            <textarea name="comment" value={formData.comment} onChange={handleChange}
                                      placeholder="Позвоните перед приездом, упакуйте в подарочную упаковку..."/>
                        </div>

                        <div className="checkout__section">
                            <h3>Способ получения</h3>
                            <div className="checkout__radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="deliveryMethod"
                                        value="самовывоз"
                                        checked={formData.deliveryMethod === 'самовывоз'}
                                        onChange={handleChange}
                                    />
                                    Самовывоз
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="deliveryMethod"
                                        value="доставка"
                                        checked={formData.deliveryMethod === 'доставка'}
                                        onChange={handleChange}
                                    />
                                    Доставка
                                </label>
                            </div>

                            {formData.deliveryMethod === 'доставка' && (
                                <DeliveryAddressSection
                                    onAddressChange={(full) => setFormData(prev => ({...prev, deliveryAddress: full}))}
                                    initialAddress={formData.deliveryAddress}
                                />
                            )}
                        </div>

                        <div className="checkout__section">
                            <h3>Время доставки</h3>

                            <div className="checkout__content">
                                <input
                                    type="date"
                                    name="deliveryDate"
                                    value={formData.deliveryDate}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                                <select name="deliveryPeriod" value={formData.deliveryPeriod} onChange={handleChange}
                                        required>
                                    <option value="утро">Утро (9:00–12:00)</option>
                                    <option value="день">День (12:00–18:00)</option>
                                    <option value="вечер">Вечер (18:00–21:00)</option>
                                </select>
                            </div>

                        </div>

                        <div className="checkout__section">
                            <h3>Оплата</h3>
                            <div className="checkout__radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cash"
                                        checked={formData.paymentMethod === 'cash'}
                                        onChange={handleChange}
                                    />
                                    Наличными при получении
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="yookassa"
                                        checked={formData.paymentMethod === 'yookassa'}
                                        onChange={handleChange}
                                    />
                                    Онлайн-оплата
                                </label>
                            </div>
                        </div>

                        <div className="checkout__section">
                            <h3>Бонусы</h3>

                            <label className="checkout__bonus-toggle">
                                <input
                                    type="checkbox"
                                    checked={useBonus}
                                    onChange={(e) => setUseBonus(e.target.checked)}
                                />
                                Использовать все доступные бонусы
                            </label>

                            {useBonus && (
                                <div className="checkout__bonus-info">
                                    <p><strong>Списано бонусов:</strong> {bonusToUse} ₽</p>
                                    <small>1 бонус = 1 ₽</small>
                                </div>
                            )}

                            <div className="checkout__bonus-info">
                                <p><strong>Ваши бонусы:</strong> {user?.bonusPoints ?? 0} ₽</p>
                                <p><strong>Начислится за заказ:</strong> {getBonusEarned()} бонусов</p>
                            </div>
                        </div>
                    </div>

                    <div className="checkout__cart">
                        <h3>Ваш заказ ({totalQuantity})</h3>
                        <div className="checkout__items">
                            {cartItems.map(item => (
                                <div key={item.id} className="checkout__item">
                                    <img src={item.product.image} alt={item.product.name}
                                         className="checkout__item-image"/>
                                    <div className="checkout__item-info">
                                        <strong>{item.product.name}</strong>
                                        <p>{item.product.composition}</p>
                                        <p className="checkout__item-quantity">×{item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="checkout__summary">
                            <div className="checkout__summary-row">
                                <span>Товаров:</span>
                                <span>{totalQuantity} шт.</span>
                            </div>
                            <div className="checkout__summary-row">
                                <span>Сумма заказа:</span>
                                <span>{getTotalAmount()} ₽</span>
                            </div>

                            {formData.deliveryMethod === 'доставка' && (
                                <div className="checkout__summary-row">
                                    <span>Доставка:</span>
                                    <span>400 ₽</span>
                                </div>
                            )}

                            {useBonus && bonusToUse > 0 && (
                                <div className="checkout__summary-row checkout__summary-row--discount">
                                    <span>Списано бонусов:</span>
                                    <span>- {bonusToUse} ₽</span>
                                </div>
                            )}

                            <div className="checkout__summary-row checkout__summary-total">
                                <span>Итого:</span>
                                <strong>{getFinalAmount()} ₽</strong>
                            </div>

                            <button type="submit" className="checkout__button-submit" disabled={submitting}>
                                {submitting ? 'Оформляем...' : 'Оформить заказ'}
                            </button>
                        </div>
                    </div>
                </form>
            </section>
        </>
    );
};

