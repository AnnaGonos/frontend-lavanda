import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types/user.type';

interface AuthContextType {
    isAuthModalOpen: boolean;
    modalView: 'login' | 'register';
    token: string | null;
    user: User | null;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    toggleToRegister: () => void;
    toggleToLogin: () => void;
    login: (token: string, userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuthContext должен использоваться внутри AuthProvider');
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [modalView, setModalView] = useState<'login' | 'register'>('login');
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken) setToken(savedToken);
        if (savedUser) setUser(JSON.parse(savedUser));

        setIsAuthenticated(!!savedToken);
    }, []);

    const openAuthModal = () => {
        setModalView('login');
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    const toggleToRegister = () => {
        setModalView('register');
    };

    const toggleToLogin = () => {
        setModalView('login');
    };

    const login = (newToken: string, userData: User) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        closeAuthModal();
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthModalOpen,
                modalView,
                token,
                user,
                setUser,
                openAuthModal,
                closeAuthModal,
                toggleToRegister,
                toggleToLogin,
                login,
                logout,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

