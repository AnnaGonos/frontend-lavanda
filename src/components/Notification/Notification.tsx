import React, { useEffect } from 'react';
import './Notification.css';

export type NotificationType = 'success' | 'error';

interface NotificationProps {
    message: string;
    type: NotificationType;
    onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 6500);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`notification notification--${type}`}>
            <span>{message}</span>
            <button className="notification__close" onClick={onClose}>×</button>
        </div>
    );
};
