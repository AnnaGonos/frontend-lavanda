import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Link} from 'react-router-dom';
import './CartPage.css';
import PageMeta from "../../components/PageMeta/PageMeta";

export const OrderSuccessPage: React.FC = () => {
    const {orderNumber} = useParams<{ orderNumber: string }>();
    const navigate = useNavigate();

    return (
        <>
            <PageMeta title="Заказ оформлен" description={`Ваш заказ №${orderNumber} успешно оформлен`}/>

            <section className="order-success">

                <div className="order-success__content">
                    <h2>Ваш заказ №{orderNumber} оформлен</h2>
                    <p>Спасибо за покупку! Мы убедимся в наличии товаров. Если возникнут проблемы, мы вам перезвоним для
                        уточнения деталей </p>
                    <Link to="/lk/orders" className="order-success__button">
                        Перейти в свои заказы
                    </Link>
                </div>
            </section>
        </>
    );
};