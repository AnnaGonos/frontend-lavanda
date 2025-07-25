import React from 'react';
import { Category } from '../../types/category.type';

interface CategoryNoticeProps {
    category: string;
}

const CategoryNotice: React.FC<CategoryNoticeProps> = ({ category }) => {
    const isFloralCategory = [
        Category.MONOBUKET,
        Category.DUOBUKET,
        Category.FLOWER_ARRANGEMENTS,
        Category.WEDDING_BUQUET,
    ].includes(category as Category);

    const getNoticeText = () => {
        if (isFloralCategory) {
            return 'Фото вдохновляющее. Каждый наш букет — уникальная авторская работа. Мы не копируем букеты 1:1, но соберём похожие по цвету и стилю, из самых свежих и сезонных цветов.';
        }

        if ([
            Category.VASES,
            Category.POSTCARDS,
            Category.SOFT_TOYS,
            Category.GIFT_CERTIFICATE,
        ].includes(category as Category)) {
            return 'Фото соответствует товару. Вы получите его в точности как на изображении.';
        }

        if ([
            Category.INDOOR_PLANTS,
            Category.GARDEN_PRODUCTS,
        ].includes(category as Category)) {
            return 'Комнатные растения и товары для сада - живые и натуральные. Возможны небольшие отличия в размере и внешнем виде.';
        }

        if (category === Category.GIFT_SETS) {
            return 'Подарочный набор может отличаться по упаковке или вложению. Мы уточним детали перед сборкой.';
        }

        return 'Товар может отличаться от фото, если это цветочная композиция. Для других товаров - вы получите товар в том виде, в каком он представлен.';
    };

    return (
        <div className={`category-notice category-notice--${category}`}>
            <p><strong>Важно!</strong></p>
            <p className="category-notice__text">{getNoticeText()}</p>
        </div>
    );
};

export default CategoryNotice;