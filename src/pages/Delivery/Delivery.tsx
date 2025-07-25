import React from 'react';
import PageMeta from "../../components/PageMeta/PageMeta";
import SectionHeader from "../../components/Partials/SectionHeader";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import './Delivery.css'
import videoSlide from '../../assets/images/IMG_9248.MOV'

const Delivery = ({children}: { children: React.ReactNode }) => {
    return (
        <>
            <PageMeta title="Доставка букетов, цветочных композиций в Партизанске"
                      description="Заказать букет стало проще с нашим сайтом. Заказывайте букеты в Партизанске в несколько кликов!"/>
            <Breadcrumbs/>
            <section>
                <SectionHeader title="Доставка" comment="В черте и за пределами города"/>
                <div className="delivery-info__list">
                    <div className="delivery-info__item">
                        <h2>В черте города</h2>
                        <p>Бесплатная доставка при заказе от 1500 ₽.</p>
                        <p>Стоимость доставки до 1500 ₽: 200 ₽</p>
                        <p>Доставка возможна в течение 1–3 часов после оформления заказа</p>
                    </div>
                    <div className="delivery-info__item">
                        <h2>За пределы города</h2>
                        <p>Рассчитывается индивидуально, исходя из расстояния</p>
                    </div>
                    <div className="delivery-info__item delivery-info__item--side">
                        <div>
                            <p>Доставка цветов — </p>
                            <p>это наш способ быть частью ваших счастливых моментов.</p>
                        </div>
                        <video controls className="video" src={videoSlide}/>
                    </div>
                    <div className="delivery-info__item">
                        <h2>Анонимность и надёжность</h2>
                        <p>Если вы хотите отправить букет/цветочную композицию и т.п. анонимно - такая возможность
                            тоже есть! При оформлении заказа просто поставьте соответсвующую галочку и ваш букет
                            буден передан курьеру без указания имени получателя, чтобы сохранить сюрприз. </p>
                    </div>
                    <div className="delivery-info__item">
                        <h2>Примерьте к себе</h2>
                        <p>Если вы хотите заранее оценить стоимость доставки, просто добавьте товары в корзину и
                            выберите адрес — система рассчитает стоимость автоматически.</p>
                    </div>
                    <div className="delivery-info__item">
                        <h2>График доставки</h2>
                        <p>Ежедневно с 9:00 до 18:00</p>
                        <p>При необходимости возможна срочная доставка — уточняйте у менеджера через WhatsApp</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Delivery;