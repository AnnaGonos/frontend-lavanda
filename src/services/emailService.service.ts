import emailjs from '@emailjs/browser';
import {Order} from '../types/order.types';
import {User} from '../types/user.type';


export const sendOrderConfirmationEmail = async (
    orderData: Order,
    customerEmail: string,
    customerFirstName: string
): Promise<{ success: boolean; error?: string }> => {
    try {
        const templateParams = {
            to_email: customerEmail,
            customer_name: customerFirstName,
            order_number: orderData.orderNumber,
            order_url: `http://localhost:3000/lk/orders`
        };

        const result = await emailjs.send('service_kq98jxw', 'template_bfh06jn', templateParams);

        return {success: true};
    } catch (error: any) {
        console.error('❌ Ошибка отправки email подтверждения заказа:', error);
        const errorMessage = error.text ? error.text : (error.message || 'Неизвестная ошибка при отправке email');
        return {success: false, error: errorMessage};
    }
};
