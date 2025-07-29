import {OrderStatus} from "./orderStatuses";
import {Product} from "./product.types";

export interface AdminOrder {
    id: number;
    orderNumber: string;
    createdAt: string;
    deliveryMethod: 'доставка' | 'самовывоз';
    deliveryDate: string;
    deliveryPeriod: 'утро' | 'день' | 'вечер';
    totalAmount: number;
    status: OrderStatus;
    comment?: string;
    recipientName?: string;
    recipientPhone?: string;
    deliveryAddress?: string;
    user: {
        id: number;
        firstName: string;
        lastName: string;
        phone: string;
    };
    items: Array<{
        id: number;
        quantity: number;
        product: Product;
    }>;
}

export interface OrdersResponse {
    orders: AdminOrder[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

