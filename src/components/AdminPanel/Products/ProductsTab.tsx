import React, {useEffect, useState} from 'react';
import {Product} from '../../../types/product.types';
import {Notification} from '../../Notification/Notification';
import {AddProductModal} from './AddProductModal';
import {EditProductModal} from './EditProductModal';
import {ProductAdminCard} from './ProductAdminCard';
import {productApi} from "../../../services/product.api";
import Breadcrumbs from "../../Breadcrumbs/Breadcrumbs";
import SectionHeader from "../../Partials/SectionHeader";
import {BsBoxArrowInUpRight} from "@react-icons/all-files/bs/BsBoxArrowInUpRight";
import {BsBoxArrowUpRight} from "@react-icons/all-files/bs/BsBoxArrowUpRight";

export const ProductsTab: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [notification, setNotification] = useState<{
        message: string;
        type: 'success' | 'error';
    } | null>(null);
    const [filter, setFilter] = useState<'all' | 'active' | 'archived'>('active');
    const [isNavOpen, setIsNavOpen] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productApi.getAll();
                setProducts(data);
            } catch (error) {
                console.error('Ошибка загрузки товаров:', error);
                setNotification({message: 'Не удалось загрузить товары', type: 'error'});
            }
        };

        fetchProducts();
    }, []);

    const handleAddProduct = async (formData: FormData) => {
        try {
            await productApi.add(formData);
            setNotification({message: 'Товар успешно добавлен', type: 'success'});
            setIsModalOpen(false);
            const updated = await productApi.getAll();
            setProducts(updated);
        } catch (error) {
            console.error('Ошибка добавления товара:', error);
            setNotification({message: 'Ошибка при добавлении товара', type: 'error'});
        }
    };

    const handleEditProduct = async (updatedProduct: Product) => {
        if (!selectedProduct) {
            setNotification({message: 'Не выбран товар для редактирования', type: 'error'});
            return;
        }

        try {
            await productApi.update(selectedProduct.id, updatedProduct);
            setNotification({message: 'Товар успешно обновлён', type: 'success'});
            setIsEditModalOpen(false);
            const updated = await productApi.getAll();
            setProducts(updated);
        } catch (error) {
            console.error('Ошибка редактирования товара:', error);
            setNotification({message: 'Ошибка при редактировании товара', type: 'error'});
        }
    };

    const handleArchive = async (productId: number) => {
        try {
            await productApi.archive(productId);
            setNotification({message: 'Товар успешно архивирован', type: 'success'});
            const updated = await productApi.getAll();
            setProducts(updated);
        } catch (error) {
            console.error('Ошибка архивации товара:', error);
            setNotification({message: 'Ошибка при архивации товара', type: 'error'});
        }
    };

    const handleDelete = async (productId: number) => {
        try {
            await productApi.remove(productId);
            setNotification({message: 'Товар успешно удалён', type: 'success'});
            const updated = await productApi.getAll();
            setProducts(updated);
        } catch (error) {
            console.error('Ошибка удаления товара:', error);
            setNotification({message: 'Ошибка при удалении товара', type: 'error'});
        }
    };

    const filteredProducts = products.filter((product) => {
        if (filter === 'active') return product.stock > 0;
        if (filter === 'archived') return product.stock === 0;
        return true; // то есть = all
    });


    return (
        <section className="admin-panel">
            <Breadcrumbs/>
            <SectionHeader title="Управление товарами" comment=""/>

            <div className={`admin-panel__navigation ${isNavOpen ? '' : 'admin-panel__navigation--collapsed'}`}>
                {isNavOpen && (
                    <>
                        <button
                            className="admin-panel__button"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Добавить товар
                        </button>

                        <div className="admin-panel__filter">
                            <label htmlFor="product-filter" className="form__label"></label>
                            <select id="product-filter" className="form__control" value={filter}
                                onChange={(e) =>
                                    setFilter(e.target.value as 'all' | 'active' | 'archived')
                                }
                            >
                                <option value="all">Все товары</option>
                                <option value="active">В продаже</option>
                                <option value="archived">Архив</option>
                            </select>
                        </div>
                    </>
                )}

                <button className="admin-panel__toggle-button"
                        onClick={() => setIsNavOpen((prev) => !prev)}
                        aria-label={isNavOpen ? 'Свернуть меню' : 'Развернуть меню'}>
                    {isNavOpen ? <BsBoxArrowUpRight/> : <BsBoxArrowInUpRight/>}
                </button>
            </div>

            <div className="product-list">
                {filteredProducts.length === 0 ? (
                    <p className="product__none">
                        {filter === 'active'
                            ? 'Нет товаров в продаже'
                            : filter === 'archived'
                                ? 'Нет архивированных товаров'
                                : 'Нет товаров'}
                    </p>
                ) : (
                    <div className="product-list__grid">
                        {filteredProducts.map((product) => (
                            <ProductAdminCard
                                key={product.id}
                                product={product}
                                onEdit={() => {
                                    setSelectedProduct(product);
                                    setIsEditModalOpen(true);
                                }}
                                onArchive={() => handleArchive(product.id)}
                                onDelete={() => handleDelete(product.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <AddProductModal
                    onSubmit={handleAddProduct}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {isEditModalOpen && selectedProduct && (
                <EditProductModal
                    product={selectedProduct}
                    onSubmit={handleEditProduct}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )}

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </section>
    );
};