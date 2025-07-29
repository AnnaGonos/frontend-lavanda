import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Notification } from '../components/Notification/Notification';

interface NotificationContextType {
    showNotification: (message: string, type: 'success' | 'error') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<
        { id: number; message: string; type: 'success' | 'error' }[]
    >([]);

    const showNotification = (message: string, type: 'success' | 'error') => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, message, type }]);
    };

    const removeNotification = (id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div className="notification-container">
                {notifications.map((notif) => (
                    <Notification key={notif.id} message={notif.message} type={notif.type}
                        onClose={() => removeNotification(notif.id)}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }

    return context;
};
