import React from 'react';
import PageMeta from "../../components/PageMeta/PageMeta";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import SectionHeader from "../../components/Partials/SectionHeader";
import flowerBouquet from '../../assets/images/care/photo_2025-06-06_08-38-36.jpg';
import composition from '../../assets/images/care/photo_2025-06-03_05-00-02.jpg';
import moreInformation from '../../assets/images/care/photo_2025-06-06_08-39-16.jpg'
import "./Care.css";

const Care = ({children}: { children: React.ReactNode }) => {
    return (
        <>
            <PageMeta title="Уход за букетами"
                      description="Несколько простых советов про уход за букетами и цветочными композициями"/>

            <Breadcrumbs/>
            <section>
                <SectionHeader title="Уход за букетом" comment="Как продлить жизнь цветам?"/>
                <div className="care__list">
                    <div className="care__item">
                        <img src={flowerBouquet} alt="Букет цветов" className="care__img"/>
                        <div className="care__content">
                            <h2>Букет</h2>
                            <ol className="care__steps">
                                <li>Снимите упаковку с букета.</li>
                                <li>Ежедневно меняйте воду в вазе и подрезайте цветы на 1-1,5 см.
                                    Подрежьте каждый стебель под углом 45 градусов и сразу поставьте цветы в воду.
                                </li>
                                <li>Отслеживайте необходимый уровень воды для цветов (гортензиям и розам требуется
                                    большее количество воды).
                                </li>
                                <li>Расположите вазу в прохладном месте, вдали от сквозняков и прямых солнечных
                                    лучей.
                                </li>
                                <li>Не опрыскивайте цветы сверху.</li>
                            </ol>
                        </div>
                    </div>
                    <div className="care__item">
                        <div className="care__content">
                            <h2>Уход за композицией</h2>
                            <ol className="care__steps">
                                <li>Регулярно поливайте основу композиции - флористическую губку. Количество
                                    воды зависит от объема композиции (от 100 мл).
                                </li>
                                <li>Рекомендуем доливать воду раз в день тонкой струйкой, чтобы шляпная коробка
                                    или корзина не промокли.
                                </li>
                                <li>Если в вашей композиции есть нобилис и он подсыхает, его следует опрыскивать
                                    водой из пульверизатора. Цветы же опрыскивать не рекомендуется.
                                </li>
                                <li>Расположите композицию в прохладном месте, вдали от скворняков и прямых
                                    солнечных лучей.
                                </li>
                            </ol>
                        </div>
                        <img src={composition} alt="Композиция" className="care__img"/>
                    </div>
                    <div className="care__item">
                        <img src={moreInformation} alt="Композиция" className="care__img"/>
                        <div className="care__content">
                            <h2>Дополнительная информация</h2>
                            <ol className="care__steps">
                                <li>Стандартно чистую вазу мы наполняем водой наполовину.
                                    Но есть цветы, которым нужно другое количество воды: <br/>
                                    - каллам и герберам - на донышке; <br/>
                                    - гортензиям - максимально много. <br/>
                                    Уточните у наших флористов по вашему букету
                                </li>
                                <li>Рекомендуем доливать воду раз в день тонкой струйкой, чтобы шляпная коробка
                                    или корзина не промокли.
                                </li>
                                <li>Если в вашей композиции есть нобилис и он подсыхает, его следует опрыскивать
                                    водой из пульверизатора. Цветы же опрыскивать не рекомендуется.
                                </li>
                                <li>Расположите композицию в прохладном месте, вдали от скворняков и прямых
                                    солнечных лучей.
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
};

export default Care;
