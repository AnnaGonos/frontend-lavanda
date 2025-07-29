export enum OrderStatus {
    CREATED = 'created',
    CONFIRMED = 'confirmed',
    ASSEMBLED = 'assembled',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    [OrderStatus.CREATED]: 'Оформлен',
    [OrderStatus.CONFIRMED]: 'Подтвержден',
    [OrderStatus.ASSEMBLED]: 'Собран',
    [OrderStatus.COMPLETED]: 'Доставлен',
    [OrderStatus.CANCELLED]: 'Отменён',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
    [OrderStatus.CREATED]: '#F4F8D3',
    [OrderStatus.CONFIRMED]: '#A6D6D6',
    [OrderStatus.ASSEMBLED]: '#96b0fd',
    [OrderStatus.COMPLETED]: '#D5B8F1',
    [OrderStatus.CANCELLED]: '#FF8282',
};

export const ORDER_STATUS_ORDER: OrderStatus[] = [
    OrderStatus.CREATED,
    OrderStatus.CONFIRMED,
    OrderStatus.ASSEMBLED,
    OrderStatus.COMPLETED,
];

export const getNextPossibleStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
    const transitions: Record<OrderStatus, OrderStatus[]> = {
        [OrderStatus.CREATED]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
        [OrderStatus.CONFIRMED]: [OrderStatus.ASSEMBLED, OrderStatus.CANCELLED],
        [OrderStatus.ASSEMBLED]: [OrderStatus.COMPLETED],
        [OrderStatus.COMPLETED]: [],
        [OrderStatus.CANCELLED]: [],
    };

    return transitions[currentStatus] || [];
};

