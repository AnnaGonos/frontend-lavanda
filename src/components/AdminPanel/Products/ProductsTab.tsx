import React, {useState, useEffect} from 'react';
import {ProductAdminCard} from './ProductAdminCard';
import {AddProductModal} from './AddProductModal';
import {EditProductModal} from './EditProductModal';
import {Notification} from '../../Notification/Notification';
import {Product} from '../../../types/product.types';
import './../AdminPanel.css';
import {BsBoxArrowUpRight} from "@react-icons/all-files/bs/BsBoxArrowUpRight";
import {BsBoxArrowInUpRight} from "@react-icons/all-files/bs/BsBoxArrowInUpRight";
import SectionHeader from "../../Partials/SectionHeader";
import {PaginatedProductsResponse, productApi} from "../../../services/product.api";


export const ProductsTab: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [limit] = useState(20);

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error'; } | null>(null);
    const [filter, setFilter] = useState<'all' | 'active' | 'archived'>('active');
    const [isNavOpen, setIsNavOpen] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data: PaginatedProductsResponse = await productApi.getAll(currentPage, limit, filter);
                setProducts(data.products);
                setTotalPages(data.totalPages);
                setTotalProducts(data.total);
            } catch (error) {
                console.error('Ошибка загрузки товаров:', error);
                setNotification({message: 'Не удалось загрузить товары', type: 'error'});
                setProducts([]);
                setTotalPages(1);
                setTotalProducts(0);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, filter, limit]);


    const handleAddProduct = async (formData: FormData) => {
        try {
            await productApi.add(formData);
            setNotification({message: 'Товар успешно добавлен', type: 'success'});
            setIsModalOpen(false);

            const data: PaginatedProductsResponse = await productApi.getAll(currentPage, limit, filter);
            setProducts(data.products);
            setTotalPages(data.totalPages);
            setTotalProducts(data.total);
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

            const data: PaginatedProductsResponse = await productApi.getAll(currentPage, limit, filter);
            setProducts(data.products);
            setTotalPages(data.totalPages);
            setTotalProducts(data.total);
        } catch (error) {
            console.error('Ошибка редактирования товара:', error);
            setNotification({message: 'Ошибка при редактировании товара', type: 'error'});
        }
    };

    const handleArchive = async (productId: number) => {
        try {
            await productApi.archive(productId);
            setNotification({message: 'Товар успешно архивирован', type: 'success'});

            const data: PaginatedProductsResponse = await productApi.getAll(currentPage, limit, filter);
            setProducts(data.products);
            setTotalPages(data.totalPages);
            setTotalProducts(data.total);
        } catch (error) {
            console.error('Ошибка архивации товара:', error);
            setNotification({message: 'Ошибка при архивации товара', type: 'error'});
        }
    };

    const handleDelete = async (productId: number) => {
        try {
            await productApi.remove(productId);
            setNotification({message: 'Товар успешно удалён', type: 'success'});

            const data: PaginatedProductsResponse = await productApi.getAll(currentPage, limit, filter);
            if (data.products.length === 0 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            } else {
                setProducts(data.products);
                setTotalPages(data.totalPages);
                setTotalProducts(data.total);
            }
        } catch (error) {
            console.error('Ошибка удаления товара:', error);
            setNotification({message: 'Ошибка при удалении товара', type: 'error'});
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <section className="admin-panel">
            <SectionHeader title="Управление товарами" comment=""/>

            <div className={`admin-panel__navigation ${isNavOpen ? '' : 'admin-panel__navigation--collapsed'}`}>
                {isNavOpen && (
                    <>
                        <button className="admin-panel__button"
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
                                    onClick={() => setCurrentPage(1)}>
                                <option value="all">Все товары</option>
                                <option value="active">В продаже</option>
                                <option value="archived">Архив</option>
                            </select>
                        </div>

                        <div className="admin-panel__pagination-info">
                            <p>Всего: {totalProducts}</p>
                        </div>
                    </>
                )}

                <button className="admin-panel__toggle-button"
                        onClick={() => setIsNavOpen((prev) => !prev)}
                        aria-label={isNavOpen ? 'Свернуть меню' : 'Развернуть меню'}>
                    {isNavOpen ? <BsBoxArrowInUpRight/> : <BsBoxArrowUpRight/>}
                </button>
            </div>


            {loading ? (
                <div className="product-list">
                    <p>Загрузка товаров...</p>
                </div>
            ) : (
                <div className="product-list">
                    {products.length === 0 ? (
                        <p className="product__none">
                            {filter === 'active'
                                ? 'Нет товаров в продаже'
                                : filter === 'archived'
                                    ? 'Нет архивированных товаров'
                                    : 'Нет товаров'}
                        </p>
                    ) : (
                        <>
                            <div className="product-list__grid">
                                {products.map((product) => (
                                    <ProductAdminCard key={product.id} product={product}
                                        onEdit={() => {
                                            setSelectedProduct(product);
                                            setIsEditModalOpen(true);
                                        }}
                                        onArchive={() => handleArchive(product.id)}
                                        onDelete={() => handleDelete(product.id)}
                                    />
                                ))}
                            </div>


                            {totalPages > 1 && (
                                <div className="pagination">
                                    {currentPage > 1 && (
                                        <button onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1} className="pagination-btn">
                                            Назад
                                        </button>
                                    )}

                                    <span className="pagination-info">
                                        Страница {currentPage} из {totalPages}
                                    </span>

                                    {currentPage < totalPages && (
                                        <button onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages} className="pagination-btn">
                                            Вперед
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

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
