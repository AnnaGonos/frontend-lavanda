import {User} from "../../types/user.type";
import React, {useEffect, useState} from "react";
import axios from 'axios';
import {useAuthContext} from "../../context/AuthContext";
import {useNotification} from "../../context/NotificationContext";
import {FaTruckMoving} from "@react-icons/all-files/fa/FaTruckMoving";
import {FaChevronRight} from "@react-icons/all-files/fa/FaChevronRight";
import {FaPeopleCarry} from "@react-icons/all-files/fa/FaPeopleCarry";
import {formatPrice} from "../../utils/formatPrice";
import {Order} from "../../types/order.types";
import delivery from "../../pages/Delivery/Delivery";


export const ActiveOrders: React.FC<{ userId: number }> = ({userId}) => {
    const {token} = useAuthContext();
    const {showNotification} = useNotification();
    const [orders, setOrders] = useState<Order[]>([]);
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) return;

            try {
                const res = await axios.get<Order[]>('http://localhost:5000/api/order/my', {
                    headers: {Authorization: `Bearer ${token}`},
                });

                setOrders(res.data);

            } catch (error) {
                console.error('Ошибка загрузки заказов:', error);
                showNotification('Ошибка загрузки заказов', 'error');
            }
        };

        fetchOrders();
    }, [token]);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('ru-RU').format(price).replace(/\s/g, ' ');

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('ru-RU');

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            created: 'Создан',
            processing: 'Обрабатывается',
            paid: 'Оплачен',
            shipped: 'Доставляется',
            completed: 'Выполнен',
            cancelled: 'Отменён',
        };
        return labels[status] || status;
    };

    return (
        <div className="orders-tab">

            {orders.length === 0 ? (
                <p>У вас пока нет заказов</p>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-item">
                            <div className="order-header">
                                <div className="order-header__content">
                                    <div className="order-header__icon">
                                        {order.deliveryMethod == 'доставка' ? <FaTruckMoving/> : <FaPeopleCarry />}
                                    </div>
                                    <div className="order-header__info">
                                        <p><strong>Заказ № {order.orderNumber}</strong></p>
                                        <p>{formatDate(order.createdAt)}</p>
                                    </div>
                                    <p className={`status-badge status-${order.status}`}>
                                        {getStatusLabel(order.status)}
                                    </p>
                                    <p className="order-header__order-total">{formatPrice(order.totalAmount)} ₽</p>

                                    <div className="order-header__info">
                                        <p>{order.deliveryMethod}</p>
                                        <p>{order.deliveryAddress}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() =>
                                        setExpandedOrderId((prev) => (prev === order.id ? null : order.id))
                                    }
                                >
                                    {expandedOrderId === order.id ?
                                        <FaChevronRight
                                            className="order-header__chevron-icon order-header__chevron-icon--roll-up"/> :
                                        <FaChevronRight className="order-header__chevron-icon"/>}
                                </button>
                            </div>

                            {expandedOrderId === order.id && (
                                <div className="order-details">
                                    {order.items.map((item) => (
                                        <div key={item.product.id} className="order-product">
                                            <img src={item.product.image.trim()} alt={item.product.name}
                                                 className="product-image"/>

                                            <p><strong>{item.product.name}</strong></p>
                                            <p>{item.quantity} шт</p>
                                            {item.product.discount ? (
                                                <>
                                                    <span className="order-product__price">{item.discount} ₽</span>
                                                </>
                                            ) : (
                                                <span className="order-product__price">{item.price} ₽</span>
                                            )}

                                            <button className="order-product__button-rate">Оценить товар</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
