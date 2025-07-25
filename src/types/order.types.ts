import {Product} from "./product.types";


export type OrderStatus =
    | 'created'
    | 'processing'
    | 'paid'
    | 'shipped'
    | 'completed'
    | 'cancelled';

export const getOrderStatusLabel = (status: OrderStatus): string => {
    const labels: Record<OrderStatus, string> = {
        created: 'Создан',
        processing: 'Обрабатывается',
        paid: 'Оплачен',
        shipped: 'Доставляется',
        completed: 'Выполнен',
        cancelled: 'Отменён',
    };
    return labels[status];
};

export interface OrderItem {
    quantity: number;
    price: number;
    discount?: number;
    product: Product;
}

export interface Order {
    id: number;
    orderNumber: string;
    createdAt: string;
    totalAmount: number;
    status: 'created' | 'processing' | 'paid' | 'shipped' | 'completed' | 'cancelled';
    deliveryMethod: 'доставка' | 'самовывоз';
    deliveryAddress?: string;
    items: OrderItem[];
}

export interface OrderFormData {
    deliveryMethod: 'доставка' | 'самовывоз';
    recipientName: string;
    recipientPhone: string;
    deliveryAddress?: string;
    deliveryDate: string;
    deliveryPeriod: 'утро' | 'день' | 'вечер';
    comment?: string;
    paymentMethod: 'cash' | 'yookassa';
    useBonusPoints?: number;
}
