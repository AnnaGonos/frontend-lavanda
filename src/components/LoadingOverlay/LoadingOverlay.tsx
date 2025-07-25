import React from 'react';
import './LoadingOverlay.css';

interface LoadingOverlayProps {
    text?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ text = 'Загрузка...' }) => {
    return (
        <div className="loading-overlay">
            <div className="loading-content">
                <div className="spinner" aria-label="Загрузка"></div>
                <p>{text}</p>
            </div>
        </div>
    );
};

