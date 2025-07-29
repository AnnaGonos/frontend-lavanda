const TELEGRAM_BOT_TOKEN = '8058907320:AAG6zeLM7Kos_Rjx2c7I8Syf8ohWJT-6cOw';
const CHAT_ID = '-4641106214';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export const sendOrderNotification = async (orderData: any) => {
    try {
        const message = formatOrderMessage(orderData);

        const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML',
                disable_web_page_preview: true
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Telegram API error: ${errorData.description}`);
        }

        const result = await response.json();
        console.log('Уведомление отправлено:', result);
        return { success: true, data: result };
    } catch (error: any) {
        console.error('Ошибка отправки уведомления:', error);
        return { success: false, error: error.message || 'Неизвестная ошибка' };
    }
};

const formatOrderMessage = (orderData: any) => {
    const {
        id,
        orderNumber,
        totalAmount,
        deliveryMethod,
        deliveryDate,
        deliveryPeriod,
        recipientName,
        recipientPhone,
        items,
        comment,
        createdAt,
        user
    } = orderData;

    const itemsList = items.map((item: any) => {
        const price = item.product.discount || item.product.price;
        const totalPrice = price * item.quantity;
        return `• ${item.product.name} - ${item.quantity} шт. (${totalPrice} ₽)`;
    }).join('\n');

    const deliveryInfo = deliveryMethod === 'доставка'
        ? `📍 <b>Доставка</b>\nАдрес: ${orderData.deliveryAddress || 'Не указан'}`
        : `🏪 <b>Самовывоз</b>`;

    const formattedDate = new Date(createdAt).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const orderLink = `https://frontend-lavanda.onrender.com/admin/orders/${id}`;

    return `
🔔 <b>НОВЫЙ ЗАКАЗ №${orderNumber}</b>

🕒 <b>Время заказа:</b> ${formattedDate}
💰 <b>Сумма:</b> ${totalAmount} ₽

${deliveryInfo}
📅 <b>Дата:</b> ${deliveryDate}
⏰ <b>Время:</b> ${deliveryPeriod}

👤 <b>Получатель:</b>
${recipientName}
📞 ${recipientPhone}

${user ? `👤 <b>Заказчик:</b>
${user.firstName} ${user.lastName || ''}
${user.phone}` : ''}

🛒 <b>Товары:</b>
${itemsList}

${comment ? `📝 <b>Комментарий:</b>
${comment}

` : ''}

🔗 Перейти к заказу: ${orderLink}
    `;
};

