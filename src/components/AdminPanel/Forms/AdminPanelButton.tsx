import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';
import '../AdminPanel.css';
import { FaCogs } from "@react-icons/all-files/fa/FaCogs";

export const AdminPanelButton: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) return null;

    const allowedRoles = ['admin', 'florist'];
    if (!user || !allowedRoles.includes(user.role)) return null;

    return (
        <Link to="/admin" className="admin-panel-button" title="Админ-панель">
            <FaCogs />
        </Link>
    );
};

