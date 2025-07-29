import {Product} from "./product.types";
import {OrderStatus} from "./orderStatuses";


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
    status: OrderStatus;
    deliveryMethod: 'доставка' | 'самовывоз';
    deliveryDate: string;
    deliveryPeriod: 'утро' | 'день' | 'вечер';
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
