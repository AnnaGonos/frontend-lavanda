import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom'
import './Header.css';
import logotype from '../../assets/images/logotype.jpg';
import {useAuthCheck} from "../../hooks/useAuthCheck";
import {useAuthContext} from "../../context/AuthContext";
import {AiOutlineMenu} from "@react-icons/all-files/ai/AiOutlineMenu";
import {VscChromeClose} from "@react-icons/all-files/vsc/VscChromeClose";
import {FaChevronRight} from "@react-icons/all-files/fa/FaChevronRight";
import {FaHeart} from '@react-icons/all-files/fa/FaHeart';
import { IoPersonCircleOutline } from "@react-icons/all-files/io5/IoPersonCircleOutline";
import {useFavoriteContext} from "../../context/FavoriteContext";
import {useCartContext} from "../../context/CartContext";


export const Header: React.FC = () => {
    const { openAuthModal } = useAuthContext();
    const isAuthenticated = useAuthCheck();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    const { favoriteCount, setFavoriteCount, setFavoriteIds } = useFavoriteContext();
    const { cartCount } = useCartContext();
    const { token } = useAuthContext();

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!token) {
                setFavoriteIds([]);
                setFavoriteCount(0);
                return;
            }

            try {
                const res = await fetch('http://localhost:5000/api/favorites', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error('Ошибка загрузки избранного');
                }

                const data = await res.json();
                const favoriteIds = data.map((fav: any) => fav.product.id);
                setFavoriteIds(favoriteIds);
                setFavoriteCount(favoriteIds.length);
            } catch (err) {
                console.error('Ошибка при загрузке избранного', err);
                setFavoriteIds([]);
                setFavoriteCount(0);
            }
        };

        fetchFavorites();
    }, [location.pathname, token]);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        setOpenSubmenu(null);
    };

    const toggleSubmenu = (menu: string) => {
        setOpenSubmenu((prev) => (prev === menu ? null : menu));
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMenu();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isMenuOpen]);

    const handleProfileClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (isAuthenticated) {
            navigate('/lk');
        } else {
            e.preventDefault();
            openAuthModal();
        }
    };

    return (
        <header className="header">
            <button className="header__burger" aria-label="Открыть меню" onClick={toggleMenu}>
                <AiOutlineMenu />
            </button>

            <div className="header__logo">
                <Link to="/">
                    <img src={logotype} alt="Логотип" />
                </Link>
            </div>

            <nav className={`header__nav nav ${isMenuOpen ? 'nav--open' : ''}`} aria-hidden={!isMenuOpen}>
                <button className="header__nav-close" onClick={closeMenu} aria-label="Закрыть меню">
                    <VscChromeClose />
                </button>

                <ul className="nav__list">
                    <li className="nav__item">
                        <button
                            className="nav__link nav__link--expandable"
                            onClick={() => toggleSubmenu('catalog')}
                            aria-expanded={openSubmenu === 'catalog'}
                            aria-controls="submenu-catalog"
                        >
                            Каталог
                            <FaChevronRight
                                className={`nav__icon-right ${openSubmenu === 'catalog' ? 'nav__icon-right--open' : ''}`}
                            />
                        </button>

                        <ul
                            id="submenu-catalog"
                            className={`submenu ${openSubmenu === 'catalog' ? 'submenu--open' : ''}`}
                            aria-hidden={openSubmenu !== 'catalog'}
                        >
                            <li className="submenu__item">
                                <Link
                                    to="/catalog/monobouquet"
                                    className={`submenu__link ${currentPath === '/catalog/monobouquet' ? 'submenu__link--active' : ''}`}
                                    onClick={closeMenu}
                                >
                                    Монобукеты
                                </Link>
                            </li>
                            <li className="submenu__item">
                                <Link
                                    to="/catalog/duobouquet"
                                    className={`submenu__link ${currentPath === '/catalog/duobouquet' ? 'submenu__link--active' : ''}`}
                                    onClick={closeMenu}
                                >
                                    Дуобукеты
                                </Link>
                            </li>
                            <li className="submenu__item">
                                <Link
                                    to="/catalog/baskets"
                                    className={`submenu__link ${currentPath === '/catalog/baskets' ? 'submenu__link--active' : ''}`}
                                    onClick={closeMenu}
                                >
                                    Корзины с цветами
                                </Link>
                            </li>
                            <li className="submenu__item">
                                <Link
                                    to="/catalog"
                                    className={`submenu__link ${currentPath === '/catalog' ? 'submenu__link--active' : ''}`}
                                    onClick={closeMenu}
                                >
                                    Все букеты и композиции
                                </Link>
                            </li>
                        </ul>
                    </li>

                    <li className="nav__item">
                        <button
                            className="nav__link nav__link--expandable"
                            onClick={() => toggleSubmenu('clients')}
                            aria-expanded={openSubmenu === 'clients'}
                            aria-controls="submenu-clients"
                        >
                            Клиентам
                            <FaChevronRight
                                className={`nav__icon-right ${openSubmenu === 'clients' ? 'nav__icon-right--open' : ''}`}
                            />
                        </button>

                        <ul id="submenu-clients"
                            className={`submenu ${openSubmenu === 'clients' ? 'submenu--open' : ''}`}
                            aria-hidden={openSubmenu !== 'clients'}
                        >
                            <li className="submenu__item">
                                <Link to="/delivery"
                                    className={`submenu__link ${currentPath === '/delivery' ? 'submenu__link--active' : ''}`}
                                    onClick={closeMenu}
                                >
                                    Доставка
                                </Link>
                            </li>
                            <li className="submenu__item">
                                <Link to="/payment"
                                    className={`submenu__link ${currentPath === '/payment' ? 'submenu__link--active' : ''}`}
                                    onClick={closeMenu}>
                                    Оплата
                                </Link>
                            </li>
                            <li className="submenu__item">
                                <Link to="/faq"
                                    className={`submenu__link ${currentPath === '/faq' ? 'submenu__link--active' : ''}`}
                                    onClick={closeMenu}>
                                    Вопрос-ответ
                                </Link>
                            </li>
                            <li className="submenu__item">
                                <Link
                                    to="/care"
                                    className={`submenu__link ${currentPath === '/care' ? 'submenu__link--active' : ''}`}
                                    onClick={closeMenu}
                                >
                                    Уход за букетом
                                </Link>
                            </li>
                        </ul>
                    </li>

                    <li className="nav__item">
                        <Link
                            to="/contacts"
                            className={`nav__link ${currentPath === '/contacts' ? 'nav__link--active' : ''}`}
                            onClick={closeMenu}
                        >
                            Контакты
                        </Link>
                    </li>
                </ul>
            </nav>


            <div className="actions">
                <Link to="/lk/favorites" className="action-icon">
                    <FaHeart />
                    {favoriteCount > 0 && (
                        <span className="favorite-count-badge">{favoriteCount}</span>
                    )}
                </Link>
                {/*<Link to="/favorites" className="action-icon">*/}
                {/*    <FaRegHeart />*/}
                {/*    {favoriteCount > 0 && (*/}
                {/*        <span className="favorite-count-badge">{favoriteCount}</span>*/}
                {/*    )}*/}

                {/*</Link>*/}
                <Link to="/lk/cart" className="action-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 1a2 2 0 0 1 2 2v2H6V3a2 2 0 0 1 2-2m3 4V3a3 3 0 1 0-6 0v2H3.36a1.5 1.5 0 0 0-1.483 1.277L.85 13.13A2.5 2.5 0 0 0 3.322 16h9.355a2.5 2.5 0 0 0 2.473-2.87l-1.028-6.853A1.5 1.5 0 0 0 12.64 5zm-1 1v1.5a.5.5 0 0 0 1 0V6h1.639a.5.5 0 0 1 .494.426l1.028 6.851A1.5 1.5 0 0 1 12.678 15H3.322a1.5 1.5 0 0 1-1.483-1.723l1.028-6.851A.5.5 0 0 1 3.36 6H5v1.5a.5.5 0 1 0 1 0V6z"/>
                    </svg>
                    {cartCount > 0 && (
                        <span className="cart-count-badge">{cartCount}</span>
                    )}
                </Link>
                <button onClick={handleProfileClick} aria-label={isAuthenticated ? "Перейти в личный кабинет" : "Войти"}
                    className={`action-icon ${currentPath === '/lk' ? 'action-icon--active' : ''} icon-person`}
                >
                    <IoPersonCircleOutline />
                </button>
            </div>

            {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
        </header>
    );
};

export default Header;
