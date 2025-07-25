import React from 'react';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import PageMeta from '../PageMeta/PageMeta';
import SectionHeader from '../Partials/SectionHeader';
import {TiShoppingCart} from "@react-icons/all-files/ti/TiShoppingCart";
import {FaTruck} from "@react-icons/all-files/fa/FaTruck";
import {GiCardboardBox} from "@react-icons/all-files/gi/GiCardboardBox";
import { FaStarHalfAlt } from "@react-icons/all-files/fa/FaStarHalfAlt";


export const AdminPanel: React.FC = () => {
    return (
        <section className="admin-panel">
            <PageMeta title="Админ-панель"/>

            <Breadcrumbs/>
            <SectionHeader title="Админ-панель" comment="Управление сайтом"/>

            <div className="admin-panel__main-navigation">
                <a href="/admin/products" className="admin-panel__item">
                    <GiCardboardBox/>
                    <p>Товары</p>
                </a>

                <a href="/admin/orders" className="admin-panel__item">
                    <TiShoppingCart/>
                    <p>Заказы</p>
                </a>

                <a href="/admin/delivery" className="admin-panel__item">
                    <FaTruck/>
                    <p>Доставка</p>
                </a>

                <a href="/admin/reviews" className="admin-panel__item">
                    <FaStarHalfAlt/>
                    <p>Отзывы</p>
                </a>
            </div>
        </section>
    );
};
