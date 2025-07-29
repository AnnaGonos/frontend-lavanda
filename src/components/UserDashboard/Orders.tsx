import {User} from "../../types/user.type";
import React, {useEffect, useState} from "react";
import axios from 'axios';
import {useAuthContext} from "../../context/AuthContext";
import {useNotification} from "../../context/NotificationContext";
import {FaTruckMoving} from "@react-icons/all-files/fa/FaTruckMoving";
import {FaChevronRight} from "@react-icons/all-files/fa/FaChevronRight";
import {FaPeopleCarry} from "@react-icons/all-files/fa/FaPeopleCarry";
import {formatDeliveryPeriod, formatPrice} from "../../utils/formatPrice";
import {Order} from "../../types/order.types";
import {ORDER_STATUS_LABELS, OrderStatus} from "../../types/orderStatuses";


interface PaginatedOrdersResponse {
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const Orders: React.FC<{ userId: number }> = ({userId}) => {
    const {token} = useAuthContext();
    const {showNotification} = useNotification();

    const [orders, setOrders] = useState<Order[]>([]);
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const limit = 20;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) return;

            setLoading(true);
            try {
                const res = await axios.get<PaginatedOrdersResponse>(`https://backend-lavanda.onrender.com/api/order/my`, {
                    headers: {Authorization: `Bearer ${token}`},
                    params: {page: currentPage, limit}
                });

                setOrders(res.data.orders);
                setTotalPages(res.data.totalPages);
                setTotalOrders(res.data.total);
            } catch (error: any) {
                console.error('Ошибка загрузки заказов:', error);
                showNotification('Ошибка загрузки заказов', 'error');
                setOrders([]);
                setTotalPages(1);
                setTotalOrders(0);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token, currentPage, limit]);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('ru-RU');

    const getStatusLabel = (status: OrderStatus) => {
        return ORDER_STATUS_LABELS[status] || status;
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            setExpandedOrderId(null);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
        }
    };


    return (
        <div className="orders-tab">
            {loading ? (
                <p>Загрузка заказов...</p>
            ) : (
                <>
                    {orders.length === 0 ? (
                        <p>На этой странице у вас нет заказов.</p>
                    ) : (
                        <div className="orders-list">
                            {orders.map((order) => (
                                <div key={order.id} className="order-item">
                                    <div className="order-header">
                                        <div className="order-header__content">
                                            <div className="order-header__icon">
                                                {order.deliveryMethod == 'доставка' ? <FaTruckMoving/> :
                                                    <FaPeopleCarry/>}
                                            </div>
                                            <div className="order-header__info">
                                                <p><strong>Заказ № {order.orderNumber}</strong></p>
                                                <p>{formatDate(order.createdAt)}</p>
                                            </div>
                                            <p className={`status-badge--dashboard status-${order.status}`}>
                                                {getStatusLabel(order.status)}
                                            </p>
                                            <p className="order-header__order-total">{formatPrice(order.totalAmount)} ₽</p>

                                            <div className="order-header__info">
                                                <p>{order.deliveryMethod}</p>

                                            </div>
                                        </div>
                                        <button onClick={() =>
                                            setExpandedOrderId((prev) => (prev === order.id ? null : order.id))
                                        }>
                                            {expandedOrderId === order.id ?
                                                <FaChevronRight
                                                    className="order-header__chevron-icon order-header__chevron-icon--roll-up"/> :
                                                <FaChevronRight className="order-header__chevron-icon"/>}
                                        </button>
                                    </div>

                                    {expandedOrderId === order.id && (
                                        <div className="order-details">
                                            {order.deliveryMethod === 'доставка' && (
                                                <div className="order-details__delivery-info">
                                                    <h4><strong>Доставка</strong></h4>
                                                    <p>{order.deliveryAddress}</p>
                                                    <p>{formatDate(order.deliveryDate)}</p>
                                                    {order.deliveryPeriod && (
                                                        <small>{order.deliveryPeriod} ({formatDeliveryPeriod(order.deliveryPeriod)})</small>
                                                    )}
                                                </div>
                                            )}
                                            {order.items.map((item) => (
                                                <div key={item.product.id} className="order-product">
                                                    <img src={item.product.image.trim()} alt={item.product.name}
                                                         className="product-image"/>

                                                    <p><strong>{item.product.name}</strong></p>
                                                    <p>{item.quantity} шт</p>
                                                    {item.discount && item.discount !== item.price ? (
                                                        <span
                                                            className="order-product__price">{formatPrice(item.discount)} ₽</span>
                                                    ) : (
                                                        <span
                                                            className="order-product__price">{formatPrice(item.price)} ₽</span>
                                                    )}

                                                    <button className="order-product__button-rate">
                                                        Оценить товар
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="pagination">
                            {currentPage > 1 && (
                                <button onClick={handlePrevPage} disabled={currentPage === 1}
                                        className="pagination-btn">
                                    Назад
                                </button>
                            )}

                            <span className="pagination-info">
                                Страница {currentPage} из {totalPages}
                            </span>

                            <button onClick={handleNextPage} disabled={currentPage === totalPages}
                                    className="pagination-btn">
                                Вперед
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

