import React, {useState, useEffect, useMemo} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {useAuthContext} from "../../../context/AuthContext";
import {useNotification} from "../../../context/NotificationContext";
import {AdminOrder, OrdersResponse} from "../../../types/admin-order.types";
import {ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, OrderStatus} from "../../../types/orderStatuses";
import {formatDeliveryPeriod, formatPrice} from "../../../utils/formatPrice";
import Breadcrumbs from "../../Breadcrumbs/Breadcrumbs";
import SectionHeader from "../../Partials/SectionHeader";
import {LoadingOverlay} from "../../LoadingOverlay/LoadingOverlay";


const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const OrdersTab: React.FC = () => {
    const {token} = useAuthContext();
    const {showNotification} = useNotification();
    const navigate = useNavigate();

    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);

    const [filterStatus, setFilterStatus] = useState<string>('');

    const [inputDeliveryDateFrom, setInputDeliveryDateFrom] = useState<string>('');
    const [inputDeliveryDateTo, setInputDeliveryDateTo] = useState<string>('');
    const [filterDeliveryDateFrom, setFilterDeliveryDateFrom] = useState<string>('');
    const [filterDeliveryDateTo, setFilterDeliveryDateTo] = useState<string>('');

    const [sortBy, setSortBy] = useState<'createdAt' | 'deliveryDate'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

    const filterDependencies = useMemo(() => ({
        filterStatus,
        filterDeliveryDateFrom,
        filterDeliveryDateTo,
        sortBy,
        sortOrder,
        currentPage
    }), [filterStatus, filterDeliveryDateFrom, filterDeliveryDateTo, sortBy, sortOrder, currentPage]);

    useEffect(() => {
        fetchOrders();
    }, [filterDependencies]);

    const fetchOrders = async () => {
        if (!token) return;

        setLoading(true);
        try {
            const params: any = {
                page: currentPage,
                limit: 15
            };

            if (filterStatus) {
                params.status = filterStatus;
            }

            if (filterDeliveryDateFrom) {
                params.deliveryDateFrom = filterDeliveryDateFrom;
            }
            if (filterDeliveryDateTo) {
                params.deliveryDateTo = filterDeliveryDateTo;
            }

            params.sortBy = sortBy;
            params.sortOrder = sortOrder;

            const response = await axios.get<OrdersResponse>(
                `${API_BASE_URL}/api/order/admin/all`,
                {
                    headers: {Authorization: `Bearer ${token}`},
                    params
                }
            );

            setOrders(response.data.orders);
            setTotalPages(response.data.totalPages);
            setTotalOrders(response.data.total);
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

    const handleOrderClick = (orderId: number) => {
        navigate(`/admin/orders/${orderId}`);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const getStatusLabel = (status: OrderStatus) => {
        return ORDER_STATUS_LABELS[status] || status;
    };

    const getStatusColor = (status: OrderStatus) => {
        return ORDER_STATUS_COLORS[status] || '#6b7280';
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleFilterChange = (status: string) => {
        setFilterStatus(status);
        setCurrentPage(1);
    };

    const handleDeliveryDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputDeliveryDateFrom(e.target.value);
    };

    const handleDeliveryDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputDeliveryDateTo(e.target.value);
    };

    const handleApplyDeliveryDateFilter = () => {
        setFilterDeliveryDateFrom(inputDeliveryDateFrom);
        setFilterDeliveryDateTo(inputDeliveryDateTo);
        setCurrentPage(1);
    };

    const handleResetDeliveryDateFilter = () => {
        setInputDeliveryDateFrom('');
        setInputDeliveryDateTo('');
        setFilterDeliveryDateFrom('');
        setFilterDeliveryDateTo('');
        setCurrentPage(1);
    };

    const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSortBy = e.target.value as 'createdAt' | 'deliveryDate';
        setSortBy(newSortBy);
        setCurrentPage(1);
    };

    const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSortOrder = e.target.value as 'ASC' | 'DESC';
        setSortOrder(newSortOrder);
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setFilterStatus('');
        setInputDeliveryDateFrom('');
        setInputDeliveryDateTo('');
        setFilterDeliveryDateFrom('');
        setFilterDeliveryDateTo('');
        setSortBy('createdAt');
        setSortOrder('DESC');
        setCurrentPage(1);
    };

    if (loading) {
        return <LoadingOverlay text="Загрузка заказов..."/>;
    }

    return (
        <>
            <section className="admin-panel">
                <SectionHeader title="Управление заказами" comment=""/>
                <div className="orders-page">
                    <div className="orders-page__header">
                        <div className="orders-filters">
                            <div className="filter-group admin-panel__filter">
                                <label className="form__label">Статус</label>
                                <select value={filterStatus} className="filter-select form__control"
                                        onChange={(e) => handleFilterChange(e.target.value)}>
                                    <option value="">Все статусы</option>
                                    {Object.entries(ORDER_STATUS_LABELS).map(([status, label]) => (
                                        <option key={status} value={status}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-group admin-panel__filter">
                                <label className="form__label">Дата доставки</label>
                                <div style={{gap: '5px', display: 'flex', flexDirection: 'column'}}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                                        <label style={{display: 'block', fontSize: '0.8rem', marginBottom: '0.2rem'}}>
                                            От
                                        </label>
                                        <input
                                            type="date"
                                            value={inputDeliveryDateFrom}
                                            onChange={handleDeliveryDateFromChange}
                                            className="form__control"
                                        />
                                    </div>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                                        <label style={{display: 'block', fontSize: '0.8rem', marginBottom: '0.2rem'}}>
                                            До
                                        </label>
                                        <input
                                            type="date"
                                            value={inputDeliveryDateTo}
                                            onChange={handleDeliveryDateToChange}
                                            className="form__control"
                                        />
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                                        <button onClick={handleApplyDeliveryDateFilter}
                                                className="button button--primary"
                                                style={{padding: '0.25rem 0.5rem', fontSize: '0.8rem'}}
                                                disabled={!inputDeliveryDateFrom && !inputDeliveryDateTo}>
                                            Применить
                                        </button>
                                        {(inputDeliveryDateFrom || inputDeliveryDateTo) && (
                                            <button onClick={handleResetDeliveryDateFilter}
                                                    className="button button--secondary"
                                                    style={{padding: '0.25rem 0.5rem', fontSize: '0.8rem'}}>
                                                Сбросить
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="filter-group admin-panel__filter">
                                <label className="form__label">Сортировать по</label>
                                <select value={sortBy} onChange={handleSortByChange}
                                        className="filter-select form__control">
                                    <option value="createdAt">Дате создания</option>
                                    <option value="deliveryDate">Дате доставки</option>
                                </select>
                            </div>

                            <div className="filter-group admin-panel__filter">
                                <label className="form__label">№ заказа</label>
                                <select value={sortOrder} onChange={handleSortOrderChange}
                                        className="filter-select form__control">
                                    <option value="DESC">По убыванию</option>
                                    <option value="ASC">По возрастанию</option>
                                </select>
                            </div>

                            {(filterStatus || inputDeliveryDateFrom || inputDeliveryDateTo || filterDeliveryDateFrom || filterDeliveryDateTo || sortBy !== 'createdAt' || sortOrder !== 'DESC') && (
                                <div className="filter-group admin-panel__filter">
                                    <button onClick={handleResetFilters} className="filter-group__button">
                                        Сбросить всё
                                    </button>
                                </div>
                            )}
                        </div>
                        <p>Найдено: {totalOrders}</p>
                    </div>

                    <div className="orders-table-container">
                        <table className="orders-table">
                            <thead>
                            <tr>
                                <th>№ заказа</th>
                                <th>Оформили</th>
                                <th>Клиент</th>
                                <th>Сумма</th>
                                <th>Дата доставки</th>
                                <th>Доставка</th>
                                <th>Статус</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id} onClick={() => handleOrderClick(order.id)} className="order-row">
                                        <td><strong>#{order.orderNumber}</strong></td>
                                        <td>{formatDate(order.createdAt)}</td>
                                        <td>
                                            {order.user?.firstName} {order.user?.lastName}
                                            <br/>
                                            <small>{order.user?.phone}</small>
                                        </td>
                                        <td>{formatPrice(order.totalAmount)} ₽</td>
                                        <td>
                                            {order.deliveryDate ? formatDate(order.deliveryDate) : '—'}
                                            <br/>
                                            {order.deliveryPeriod && (
                                                <small>{order.deliveryPeriod} ({formatDeliveryPeriod(order.deliveryPeriod)})</small>
                                            )}
                                        </td>
                                        <td>{order.deliveryMethod === 'доставка' ? 'Доставка' : 'Самовывоз'}</td>
                                        <td>
                                            <p className="status-badge"
                                               style={{backgroundColor: getStatusColor(order.status)}}>
                                                {getStatusLabel(order.status)}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} style={{textAlign: 'center', padding: '20px'}}>
                                        Заказы не найдены
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            {currentPage > 1 && (
                                <button onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1} className="pagination-btn">
                                    Назад
                                </button>
                            )}

                            <span className="pagination-info">
                                Страница {currentPage} из {totalPages}
                            </span>

                            {currentPage < totalPages && (
                                <button onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages} className="pagination-btn">
                                    Вперед
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

