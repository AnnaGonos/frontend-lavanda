import React from 'react';
import Slider from "../../components/Slider/Slider";
import PageMeta from "../../components/PageMeta/PageMeta";
import AboutUs from "../../components/AboutUs/AboutUs";
import CatalogSection from "../../components/Catalog/CatalogSection";

const Home = ({children}: { children: React.ReactNode }) => {
    return (
        <>
            <PageMeta title="Доставка букетов, цветочных композиций в Партизанске"
                      description="Заказать букет стало проще с нашим сайтом. Заказывайте букеты в Партизанске в несколько кликов!"/>

            <Slider/>
            <section className="scrolling-text-container">
                <div className="scrolling-text">
                    <p>Бесплатная доставка от 5000₽ курьером</p>
                    <p>Бесплатная доставка от 5000₽ курьером</p>
                    <p>Бесплатная доставка от 5000₽ курьером</p>
                    <p>Бесплатная доставка от 5000₽ курьером</p>
                    <p>Бесплатная доставка от 5000₽ курьером</p>
                    <p>Бесплатная доставка от 5000₽ курьером</p>
                    <p>Бесплатная доставка от 5000₽ курьером</p>
                    <p>Бесплатная доставка от 5000₽ курьером</p>
                    <p>Бесплатная доставка от 5000₽ курьером</p>
                    <p>Бесплатная доставка от 5000₽ курьером</p>
                    <p>Бесплатная доставка от 5000₽ курьером</p>
                    <p>Бесплатная доставка от 5000₽ курьером</p>
                    <p>Бесплатная доставка от 5000₽ курьером</p>
                    <p>Бесплатная доставка от 5000₽ курьером</p>
                </div>
            </section>
            <CatalogSection/>
            <AboutUs/>
        </>
    );
};

export default Home;
