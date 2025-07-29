import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
import {FaArrowLeft, FaCheck, FaTimes} from 'react-icons/fa';
import {useNotification} from "../../../context/NotificationContext";
import {AdminOrder} from "../../../types/admin-order.types";
import {ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, OrderStatus} from "../../../types/orderStatuses";
import {useAuthContext} from "../../../context/AuthContext";
import {formatPrice} from "../../../utils/formatPrice";
import {LoadingOverlay} from "../../LoadingOverlay/LoadingOverlay";
import chevronLeft from "../../../assets/images/chevron-left.svg";

export const OrderDetails: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const {token} = useAuthContext();
    const {showNotification} = useNotification();
    const navigate = useNavigate();

    const [order, setOrder] = useState<AdminOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        if (!token || !id) return;

        try {
            const response = await axios.get<AdminOrder>(
                `https://backend-lavanda.onrender.com/api/order/admin/${id}`,
                {
                    headers: {Authorization: `Bearer ${token}`}
                }
            );

            setOrder(response.data);
            setNewStatus(response.data.status);
        } catch (error) {
            console.error('Ошибка загрузки заказа:', error);
            showNotification('Ошибка загрузки заказа', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async () => {
        if (!token || !id || !newStatus || !order) return;

        try {
            await axios.patch(
                `https://backend-lavanda.onrender.com/api/order/${id}/status`,
                {status: newStatus},
                {
                    headers: {Authorization: `Bearer ${token}`}
                }
            );

            showNotification('Статус заказа успешно обновлен', 'success');
            if (order) {
                setOrder({...order, status: newStatus});
            }
        } catch (error) {
            console.error('Ошибка обновления статуса:', error);
            showNotification('Ошибка обновления статуса', 'error');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('ru-RU');
    };

    const getStatusLabel = (status: OrderStatus) => {
        return ORDER_STATUS_LABELS[status] || status;
    };

    const getStatusColor = (status: OrderStatus) => {
        return ORDER_STATUS_COLORS[status] || '#6b7280';
    };

    const formatDeliveryPeriod = (period: string) => {
        const periodMap: Record<string, string> = {
            'утро': '9:00–12:00',
            'день': '12:00–18:00',
            'вечер': '18:00–21:00'
        };

        return periodMap[period.toLowerCase()] || period;
    };


    if (loading) {
        return <LoadingOverlay text="Загрузка заказа..."/>;
    }

    if (!order) {
        return <div className="error">Заказ не найден</div>;
    }

    return (
        <section className="orders-page">
            <div className="order-details-header">
                <button onClick={() => navigate(-1)} className="breadcrumbs__back">
                    <img src={chevronLeft} alt="Назад"/>
                </button>

                <h2>Детали заказа #{order.orderNumber}</h2>
            </div>

            <div className="order-details-content">
                <div className="order-section">
                    <div className="order-info-grid">
                        <div className="info-item">
                            <label>Дата создания:</label>
                            <span>{formatDateTime(order.createdAt)}</span>
                        </div>
                        <div className="info-item">
                            <label>Статус:</label>
                            <span className="status-badge"
                                  style={{
                                      backgroundColor: getStatusColor(order.status)
                                  }}
                            >
                                {getStatusLabel(order.status)}
                            </span>
                        </div>
                        <div className="info-item">
                            <label>Сумма:</label>
                            <span className="amount">{formatPrice(order.totalAmount)} ₽</span>
                        </div>
                    </div>
                </div>

                <div className="order-section">
                    <h3>Информация о клиенте</h3>
                    <div className="order-info-grid">
                        <div className="info-item">
                            <label>Имя:</label>
                            <span>{order.user.firstName} {order.user.lastName}</span>
                        </div>
                        <div className="info-item">
                            <label>Телефон:</label>
                            <span>{order.user.phone}</span>
                        </div>
                    </div>
                </div>

                <div className="order-section">
                    <h3>Доставка</h3>
                    <div className="order-info-grid">
                        <div className="info-item">
                            <label>Способ:</label>
                            <span>{order.deliveryMethod === 'доставка' ? 'Доставка' : 'Самовывоз'}</span>
                        </div>
                        <div className="info-item">
                            <label>Дата доставки:</label>
                            <span>{formatDate(order.deliveryDate)}</span>
                        </div>
                        <div className="info-item">
                            <label>Время доставки:</label>
                            <span>{order.deliveryPeriod ? `${order.deliveryPeriod} (${formatDeliveryPeriod(order.deliveryPeriod)})` : ''}</span>
                        </div>
                        {order.deliveryMethod === 'доставка' && order.deliveryAddress && (
                            <div className="info-item full-width">
                                <label>Адрес доставки:</label>
                                <span>{order.deliveryAddress}</span>
                            </div>
                        )}
                        {order.recipientName && (
                            <div className="info-item">
                                <label>Получатель:</label>
                                <p>
                                    {order.recipientName}
                                    {order.recipientPhone && (
                                        <span><br/>{order.recipientPhone}</span>
                                    )}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {order.comment && (
                    <div className="order-section">
                        <h3>Комментарий флористу или курьеру</h3>
                        <div className="comment-box">
                            {order.comment}
                        </div>
                    </div>
                )}

                <div className="order-section">
                    <h3>Товары в заказе</h3>
                    <div className="order-items">
                        {order.items.map((item) => (
                            <div key={item.id} className="order-item">
                                <div key={item.product.id}
                                    className="order-product clickable-product"
                                    onClick={() => navigate(`/product/${item.product.id}`)}
                                >
                                    <img src={item.product.image.trim()} alt={item.product.name}
                                         className="order-details-image"/>

                                    <div className="order-item__description">
                                        <p><strong>{item.product.name}</strong></p>
                                        <p>{item.quantity} шт</p>
                                        {item.product.discount ? (
                                            <>
                                                <span className="order-product__price">{formatPrice(item.product.discount)} ₽</span>
                                                <small>({formatPrice(item.product.discount)} ₽ × {item.quantity})</small>
                                            </>
                                        ) : (
                                            <>
                                                <span className="order-product__price"> {formatPrice(item.product.price)} ₽</span>
                                                <small>({formatPrice(item.product.price)} ₽ × {item.quantity})</small>
                                            </>
                                        )}
                                    </div>


                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="order-section">
                    <h3>Изменить статус заказа</h3>
                    <div className="status-change-form admin-panel__filter">
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                            className="status-select"
                        >
                            <option value="">Выберите статус</option>
                            {Object.entries(ORDER_STATUS_LABELS).map(([status, label]) => (
                                <option key={status} value={status}>
                                    {label}
                                </option>
                            ))}
                        </select>
                        <button onClick={handleStatusChange} disabled={!newStatus || newStatus === order.status}
                                className="update-status__button">
                            Обновить статус
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

