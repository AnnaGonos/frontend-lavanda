import React from 'react';
import PageMeta from "../../components/PageMeta/PageMeta";
import SectionHeader from "../../components/Partials/SectionHeader";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import './Payment.css'

const Payment = ({children}: { children: React.ReactNode }) => {
    return (
        <>
            <PageMeta title="Оплата"
                      description="Заказать букет стало проще с нашим сайтом. Заказывайте букеты в Партизанске в несколько кликов!"/>

            <Breadcrumbs/>
            <section>
                <SectionHeader title="Оплата" comment="Легко и безопасно"/>
                <div className="payment-info__list">
                    <div className="payment-info__item">
                        <h2></h2>
                        <div><p>В нашем магазине вы можете оплатить свой заказ наличными или банковской картой.</p><br/>
                            <p>На сайте после оформления заказа автоматически произойдет переход к оплате.
                                К оплате принимаются банковские карты VISA, Mastercard, МИР российских банков,
                                возможна оплата по Системе быстрых платежей (СБП)</p><br/>
                            <p>Оплата осуществляется через систему ЮКасса, которая обеспечивает защиту с помощью
                                сертификата SSL и протокола 3D Secure, что делает процесс полностью безопасным.
                                Мы не собираем, не храним и не имеем доступа к данным платежных карт наших клиентов.</p>
                        </div>
                    </div>
                    <div className="payment-info__item">
                        <h2>Конфиденциальность</h2>
                        <p>Мы гарантируем, что не собираем, не храним и не имеем доступа к информации о ваших
                            платежных картах. Вся предоставленная вами информация защищена и используется исключительно
                            для обработки заказа.</p>
                    </div>
                    <div className="payment-info__item">
                        <h2>Обработка платежей</h2>
                        <p>После завершения оформления заказа вы получите уведомление о статусе платежа.
                            В случае успешной оплаты мы немедленно начнём подготовку вашего заказа к отправке.</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Payment;
