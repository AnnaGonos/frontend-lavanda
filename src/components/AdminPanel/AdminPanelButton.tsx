import React, {useEffect, useRef, useState} from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import './AdminPanel.css';
import { FaCogs } from "@react-icons/all-files/fa/FaCogs";
import {TiShoppingCart} from "@react-icons/all-files/ti/TiShoppingCart";
import {GiCardboardBox} from "@react-icons/all-files/gi/GiCardboardBox";
import { FaStarHalfAlt } from "@react-icons/all-files/fa/FaStarHalfAlt";


export const AdminPanelButton: React.FC = () => {
    const { user, loading } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (loading) return null;

    const allowedRoles = ['admin', 'florist'];
    if (!user || !allowedRoles.includes(user.role)) return null;

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };

    return (
        <div className="admin-panel-dropdown" ref={dropdownRef}>
            {isOpen && (
                <div className="admin-panel-dropdown-menu">
                    <Link to="/admin/products" className="admin-panel-dropdown-item" onClick={closeDropdown}>
                        <GiCardboardBox/>
                        <span>Товары</span>
                    </Link>

                    <Link to="/admin/orders" className="admin-panel-dropdown-item" onClick={closeDropdown}>
                        <TiShoppingCart/>
                        <span>Заказы</span>
                    </Link>

                    <Link to="/admin/reviews" className="admin-panel-dropdown-item" onClick={closeDropdown}>
                        <FaStarHalfAlt/>
                        <span>Отзывы</span>
                    </Link>
                </div>
            )}

            <button
                className={`admin-panel-button ${isOpen ? 'active' : ''}`}
                title="Админ-панель"
                onClick={toggleDropdown}
            >
                <FaCogs />
            </button>
        </div>
    );
};

