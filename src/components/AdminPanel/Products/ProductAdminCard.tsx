import React from 'react';
import {Product} from "../../../types/product.types";
import {FaPaintBrush} from "@react-icons/all-files/fa/FaPaintBrush";
import {BiArchiveOut} from "@react-icons/all-files/bi/BiArchiveOut";
import {RiDeleteBin5Line} from "@react-icons/all-files/ri/RiDeleteBin5Line";


interface ProductCardProps {
    product: Product;
    onEdit: (product: Product) => void;
    onArchive: (id: number) => void;
    onDelete: (id: number) => void;
}

export const ProductAdminCard: React.FC<ProductCardProps> = ({product, onEdit, onArchive, onDelete,}) => {
    const isArchived = product.stock > 0 ? false : true;

    return (
        <div className="product-card">
            {isArchived && (
                <div className="product-card__archive"><BiArchiveOut/><p>в архиве</p></div>
            )}
            <img src={product.image} alt={product.name} className="product-card__image"/>
            <div className="product-card__info">
                <p className="product-card__category">{product.category}</p>
                <div className="product-card__info__title">
                    <h4 className="product-card__name">{product.name}</h4>
                    <p className="product-card__description">{product.description}</p>
                </div>

                <p className="product-card__prices">
                    {product.discount ? (
                        <>
                            <span className="product-card__price">{product.discount} ₽</span>
                            <span className="product-card__price price-old">{product.price} ₽</span>
                        </>
                    ) : (
                        <>
                            <span className="product-card__price">{product.price} ₽</span>
                        </>
                    )}
                </p>
                <p className="product-card__stock">В магазине: {product.stock} шт.</p>
                <div className="product-card__actions product-card__actions--admin">
                    <button className="product-card__button button button_medium button_theme_edit"
                            onClick={() => onEdit(product)}>
                        <FaPaintBrush/>
                    </button>

                    {!isArchived && (
                        <button
                            className="product-card__button button button_medium button_theme_archive"
                            onClick={() => onArchive(product.id)}
                            title="Архивировать"
                            type="button"
                        >
                            <BiArchiveOut/>
                        </button>
                    )}

                    <button className="product-card__button button button_medium button_theme_danger"
                            onClick={() => onDelete(product.id)}>
                        <RiDeleteBin5Line/>
                    </button>
                </div>
            </div>
        </div>
    );
};

