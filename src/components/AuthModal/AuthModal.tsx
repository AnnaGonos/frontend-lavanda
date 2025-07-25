import React from 'react';
import ReactDOM from 'react-dom';
import {useAuthContext} from "../../context/AuthContext";
import {LoginModal} from "./LoginModal";
import {RegisterModal} from "./RegisterModal";
import imageModal from '../../assets/images/24fc1ea0a5d692ca60dbd3dc3ecffcec.jpg';

export const AuthModal: React.FC = () => {
    const { isAuthModalOpen, closeAuthModal, modalView } = useAuthContext();

    if (!isAuthModalOpen) return null;

    const modalRoot = document.getElementById('modal-root')!;
    const currentView = modalView === 'login' ? <LoginModal /> : <RegisterModal />;

    return ReactDOM.createPortal(
        <div className="auth-modal-overlay" onClick={closeAuthModal}>
            <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
                {currentView}
            </div>
            <button className="auth-modal-close" onClick={closeAuthModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                </svg>
            </button>
            <img src={imageModal} alt="Букет цветов" className="auth-modal-img"/>
        </div>,
        modalRoot
    );
};

