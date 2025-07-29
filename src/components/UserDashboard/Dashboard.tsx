import React, {useEffect, useState} from 'react';
import {useAuth} from "../../hooks/useAuth";
import './Dashboard.css'
import PageMeta from "../PageMeta/PageMeta";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import SectionHeader from "../Partials/SectionHeader";
import {useAuthContext} from "../../context/AuthContext";
import {useLocation, useNavigate} from "react-router-dom";
import {LoadingOverlay} from "../LoadingOverlay/LoadingOverlay";
import {AccountInfo} from "./AccountInfo";
import {EditAccount} from "./EditAccount";
import {Orders} from "./Orders";


export const Dashboard: React.FC = () => {
    const { user, loading, refetchUser } = useAuth();
    const { logout } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();

    const getTabFromPath = () => {
        const path = location.pathname;
        if (path.includes('/orders')) return 'orders';
        if (path.includes('/orders/archive')) return 'purchases';
        if (path.includes('/edit')) return 'edit';
        return 'account';
    };

    const [activeTab, setActiveTab] = useState<'account' | 'edit' | 'orders' | 'purchases'>(getTabFromPath);

    useEffect(() => {
        const path = location.pathname;
        const currentTab = getTabFromPath();

        if (currentTab !== activeTab) {
            if (activeTab === 'account') navigate('/lk');
            if (activeTab === 'edit') navigate('/lk/edit');
            if (activeTab === 'orders') navigate('/lk/orders');
        }
    }, [activeTab, navigate]);

    useEffect(() => {
        setActiveTab(getTabFromPath());
    }, [location.pathname]);

    if (loading) {
        return <LoadingOverlay text="Загружаем ваш профиль..." />;
    }

    if (!user) {
        return <div>Ошибка загрузки данных</div>;
    }

    return (
        <>
            <PageMeta title="Личный кабинет" />

            <Breadcrumbs />
            <section className="dashboard">
                <SectionHeader title="Личный кабинет" comment="Все для вашего удобства" />

                <div className="dashboard-content__list">
                    <button
                        onClick={() => setActiveTab('account')}
                        className={activeTab === 'account' ? 'tab-button active' : 'tab-button'}
                    >
                        Аккаунт
                    </button>

                    <button
                        onClick={() => setActiveTab('edit')}
                        className={activeTab === 'edit' ? 'tab-button active' : 'tab-button'}
                    >
                        Настройка
                    </button>

                    <button
                        onClick={() => setActiveTab('orders')}
                        className={activeTab === 'orders' ? 'tab-button active' : 'tab-button'}
                    >
                        Заказы
                    </button>
                </div>

                <div className="dashboard__container">
                    {activeTab === 'account' && <AccountInfo user={user} onLogout={logout} />}
                    {activeTab === 'edit' && <EditAccount user={user} onUpdateUser={refetchUser} />}
                    {activeTab === 'orders' && <Orders userId={user.id} />}
                </div>
            </section>
        </>
    );
};



