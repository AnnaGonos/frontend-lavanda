import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import {AuthModal} from '../AuthModal/AuthModal';
import './Layout.css';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="layout">
            <Header />
            <main className="layout__content">{children}</main>
            <Footer />

            <AuthModal />
        </div>
    );
};

