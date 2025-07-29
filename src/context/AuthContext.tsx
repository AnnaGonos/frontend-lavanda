import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types/user.type';
import { getCurrentUser, getToken } from '../services/auth.service';

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
    const [token, setTokenState] = useState<string | null>(null);
    const [user, setUserState] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const initializeAuth = () => {
            const savedToken = getToken();
            const savedUser = getCurrentUser();

            if (savedToken) {
                setTokenState(savedToken);
                setIsAuthenticated(true);
            }

            if (savedUser) {
                setUserState(savedUser);
            }
        };

        initializeAuth();

        const handleStorageChange = () => {
            const savedToken = getToken();
            const savedUser = getCurrentUser();

            setTokenState(savedToken);
            setUserState(savedUser);
            setIsAuthenticated(!!savedToken);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
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
        setTokenState(newToken);
        setUserState(userData);
        setIsAuthenticated(true);


        window.dispatchEvent(new CustomEvent('userStateChanged', {
            detail: { isAuthenticated: true, token: newToken }
        }));
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTokenState(null);
        setUserState(null);
        setIsAuthenticated(false);
        closeAuthModal();


        window.dispatchEvent(new CustomEvent('userStateChanged', {
            detail: { isAuthenticated: false, token: null }
        }));
    };

    const setToken = (token: string | null) => {
        setTokenState(token);
    };

    const setUser = (user: User | null) => {
        setUserState(user);
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
