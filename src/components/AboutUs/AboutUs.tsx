import React from 'react';
import './AboutUs.css'
import geoFill from '../../assets/images/geo-alt-fill.svg'
import flowerShop from "../../assets/images/care/photo_2025-01-27_12-14-43.jpg";
import flowerShopRight from "../../assets/images/care/photo_2025-01-27_12-04-16.jpg";
import flowerShopLeft from "../../assets/images/care/photo_2024-09-07_05-45-36.jpg";
import {Link} from "react-router-dom";
import Features from "./Features";
import {features} from "./Features.data";

const AboutUs: React.FC = () => {
    return (
        <section className="about-us">
            <div className="about-us__main">
                <img src={flowerShop} alt="Цветочный букет" className="about-us__image-shop" />

                <div className="about-us__container">
                    <h2 className="about-us__title">О нас</h2>

                    <Features items={features} />
                </div>
            </div>

            <div className="about-us__map">
                <div className="about-us__map-content">
                    <h3>Как нас найти?</h3>
                    <p className="">Если вы направляетесь к нам на общественном транспорте, то ближайшая остановка -
                        "Рынок". От нее всего пара минут неспешной ходьбы до нашего магазина.<br/> <br/>
                        Мы работаем ежедневно с 8:00 до 19:00, так что вы всегда можете заглянуть к нам за свежими,
                        яркими цветами и букетами. Будем рады видеть вас!
                    </p>
                </div>
                <div className="about-us__map-info">
                    <div className="about-us__map-address">
                        <img src={geoFill} alt=""/>
                        <p>г. Партизанск, ул. Замараева, 5</p>
                    </div>
                    <Link to="/contacts" className="about-us__button">Подробнее</Link>
                </div>

                <iframe className="about-us__image-map"
                        src="https://yandex.ru/map-widget/v1/?um=constructor%3A04372f220e817e42113272e1b01f2c7800bf6b0612480513330a82c87dc3592e&amp;source=constructor"
                        width="100%" frameBorder="0"></iframe>
                <img src={flowerShopLeft} alt="" className="about-us__image"/>
                <img src={flowerShopRight} alt="" className="about-us__image"/>
            </div>
        </section>
    );
};

export default AboutUs;
