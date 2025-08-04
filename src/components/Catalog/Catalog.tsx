import React, {useEffect, useState, useRef} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import PageMeta from '../../components/PageMeta/PageMeta';
import SectionHeader from '../../components/Partials/SectionHeader';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import './Catalog.css';
import {Link} from 'react-router-dom';
import {Notification, NotificationType} from '../Notification/Notification';
import {ProductCard} from './ProductCard';
import {useAuthContext} from '../../context/AuthContext';
import {useFavoriteContext} from '../../context/FavoriteContext';
import {LoadingOverlay} from '../LoadingOverlay/LoadingOverlay';
import {Product} from "../../types/product.types";
import {Category, CategoryList} from "../../types/category.type";


const ITEMS_PER_PAGE = 12;

export const CatalogPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<{
        message: string;
        type: NotificationType;
    } | null>(null);

    const {token} = useAuthContext();
    const {setFavoriteCount, setFavoriteIds} = useFavoriteContext();

    const navigate = useNavigate();
    const location = useLocation();
    const observer = useRef<IntersectionObserver | null>(null);
    const lastProductRef = useRef<HTMLAnchorElement | null>(null);

    const params = new URLSearchParams(location.search);
    const urlCategory = params.get('category') || 'ALL';
    const urlSort = (params.get('sort') || 'default') as 'default' | 'price:asc' | 'price:desc';

    const [selectedCategory, setSelectedCategory] = useState<'ALL' | Category>(
        urlCategory === 'ALL' ? 'ALL' : (urlCategory as Category)
    );
    const [sort, setSort] = useState<'default' | 'price:asc' | 'price:desc'>(urlSort);

    const loadProducts = async (offset = 0) => {
        try {
            const queryParams = new URLSearchParams();
            if (selectedCategory !== 'ALL') queryParams.set('category', selectedCategory);
            queryParams.set('sort', sort);
            queryParams.set('limit', ITEMS_PER_PAGE.toString());
            queryParams.set('offset', offset.toString());

            const res = await fetch(`https://backend-lavanda.onrender.com/api/products?${queryParams.toString()}`);

            const text = await res.text();
            const data: Product[] = JSON.parse(text);

            const filtered = data.filter(p => p.stock > 0);

            if (offset === 0) {
                setProducts(filtered);
                setDisplayedProducts(filtered.slice(0, ITEMS_PER_PAGE));
                setHasMore(filtered.length > ITEMS_PER_PAGE);
            } else {
                setDisplayedProducts(prev => [...prev, ...filtered]);
                setHasMore(filtered.length === ITEMS_PER_PAGE);
            }
        } catch (err: any) {
            setError(err.message || 'Не удалось загрузить товары');
            if (offset === 0) {
                setProducts([]);
                setDisplayedProducts([]);
                setHasMore(false);
            }
        } finally {
            if (offset === 0) setLoading(false);
            else setLoadingMore(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        loadProducts(0);
    }, [selectedCategory, sort]);


    useEffect(() => {
        if (loading || loadingMore || !hasMore || displayedProducts.length === 0) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setLoadingMore(true);
                    loadProducts(displayedProducts.length);
                }
            },
            {threshold: 0.1}
        );

        if (lastProductRef.current) observer.current.observe(lastProductRef.current);

        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [loading, loadingMore, hasMore, displayedProducts.length]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedCategory !== 'ALL') params.set('category', selectedCategory);
        if (sort !== 'default') params.set('sort', sort);
        navigate(`?${params.toString()}`, {replace: true});
    }, [selectedCategory, sort, navigate]);


    useEffect(() => {
        if (!token) {
            setFavorites([]);
            setFavoriteIds([]);
            return;
        }

        fetch('https://backend-lavanda.onrender.com/api/favorites', {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then(async (res) => {
                const text = await res.text();
                if (text.trim().startsWith('__|')) {
                    console.error('API избранного вернул ASCII-баннер');
                    return [];
                }
                return JSON.parse(text);
            })
            .then((data) => {
                const ids = data.map((fav: any) => fav.product.id);
                setFavorites(ids);
                setFavoriteIds(ids);
                setFavoriteCount(ids.length);
            })
            .catch((err) => {
                console.error('Ошибка загрузки избранного:', err);
            });
    }, [token]);

    const showNotification = (message: string, type: NotificationType) => {
        setNotification({message, type});
        setTimeout(() => setNotification(null), 3000);
    };

    const handleToggleFavorite = (productId: number, isFav: boolean) => {
        if (isFav) {
            setFavorites((prev) => [...prev, productId]);
            setFavoriteIds((prev) => [...prev, productId]);
        } else {
            setFavorites((prev) => prev.filter((id) => id !== productId));
            setFavoriteIds((prev) => prev.filter((id) => id !== productId));
        }
    };


    if (loading) {
        return <LoadingOverlay text="Загружаем товары..."/>;
    }

    if (error) {
        return (
            <div className="error-page">
                <h2>Ошибка</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Попробовать снова</button>
            </div>
        );
    }

    return (
        <>
            <PageMeta title="Каталог" description="Заказать букет стало проще с нашим сайтом"/>
            <Breadcrumbs/>

            <section>
                <SectionHeader title="Каталог"/>

                {notification && (
                    <Notification message={notification.message} type={notification.type}
                                  onClose={() => setNotification(null)}/>
                )}


                <div className="product-list">
                    <div className="catalog-filters">
                        <div className="category-filter">
                            <button className={selectedCategory === 'ALL' ? 'active' : ''}
                                    onClick={() => setSelectedCategory('ALL')}>
                                Все
                            </button>

                            {CategoryList.map((category) => (
                                <button key={category} className={selectedCategory === category ? 'active' : ''}
                                        onClick={() => setSelectedCategory(category)}>
                                    {category}
                                </button>
                            ))}
                        </div>

                        <div className="sort-filter">
                            <select value={sort} onChange={(e) => setSort(e.target.value as any)}>
                                <option value="default">Порядок: по умолчанию</option>
                                <option value="price:asc">Цена: по возрастанию</option>
                                <option value="price:desc">Цена: по убыванию</option>
                            </select>
                        </div>
                    </div>

                    {displayedProducts.length === 0 ? (
                        <p className="text-center">Нет товаров по заданным фильтрам</p>
                    ) : (
                        <div className="product-list__grid">
                            {displayedProducts.map((product, index) => {
                                const isLast = index === displayedProducts.length - 1;
                                return (
                                    <Link to={`/product/${product.id}`} key={product.id}
                                          className="card__item-link" ref={isLast ? lastProductRef : undefined}>
                                        <ProductCard product={product}
                                            isFavorite={token ? favorites.includes(product.id) : false}
                                            onNotify={showNotification}
                                            onToggleFavorite={handleToggleFavorite}
                                        />
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {loadingMore && <p className="text-center">Загружаем еще больше товаров...</p>}

                </div>
            </section>
        </>
    );
};

