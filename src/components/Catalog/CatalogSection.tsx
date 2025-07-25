import React from 'react';
import './Catalog.css';
import flowerWedding from "../../assets/images/care/photo_2023-09-30_11-24-54.jpg";
import flowerComposition from "../../assets/images/care/photo_2023-10-02_12-01-08.jpg";
import flowerPostcards from "../../assets/images/care/photo_2025-01-27_12-07-35.jpg";
import flowerRoomPlants from "../../assets/images/care/photo_2023-10-10_13-34-41.jpg";
import flowerMonobouquet from "../../assets/images/care/photo_2025-04-06_03-40-42.jpg";
import {Link} from "react-router-dom";

const CatalogSection: React.FC = () => {
    return (
        <section className="catalog">
            <h2>Популярные категории</h2>
            <div className="catalog__grid">
                <a href="/catalog/monobouquet" className="catalog__item">
                    <p>Монобукеты</p>
                    <div className="catalog__item-image">
                        <img src={flowerMonobouquet} alt="Монобукеты" />
                    </div>
                </a>

                <a href="/catalog/wedding" className="catalog__item">
                    <p>Свадебные букеты</p>
                    <div className="catalog__item-image">
                        <img src={flowerWedding} alt="Свадебные букеты" />
                    </div>
                </a>

                <a href="/catalog/postcards" className="catalog__item">
                    <p>Открытки</p>
                    <div className="catalog__item-image">
                        <img src={flowerPostcards} alt="Открытки" />
                    </div>
                </a>

                <a href="/catalog/composition" className="catalog__item">
                    <p>Цветочные композиции</p>
                    <div className="catalog__item-image">
                        <img src={flowerComposition} alt="Цветочные композиции" />
                    </div>
                </a>

                <a href="/catalog/gifts" className="catalog__item">
                    <p>Комнатные растения</p>
                    <div className="catalog__item-image">
                        <img src={flowerRoomPlants} alt="Вазы и подарки" />
                    </div>
                </a>

                <Link to="/catalog" className="catalog__item catalog__item--view-all">
                    <div className="catalog__item-content">
                        <p>Все букеты и композиции</p>
                    </div>
                </Link>
            </div>
        </section>
    );
};

export default CatalogSection;
