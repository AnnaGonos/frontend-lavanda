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

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div className={`notification notification--${type}`} onClick={onClose}>
            <span className="notification__message">{message}</span>
            <button className="notification__close" aria-label="Закрыть уведомление"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            >
                ×
            </button>
        </div>
    );
};
