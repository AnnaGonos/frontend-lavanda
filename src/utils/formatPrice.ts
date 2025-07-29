export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ru-RU').format(price);
};


export const formatDeliveryPeriod = (period: string) => {
    const periodMap: Record<string, string> = {
        'утро': '9:00–12:00',
        'день': '12:00–18:00',
        'вечер': '18:00–21:00'
    };
    return periodMap[period.toLowerCase()] || period;
};

