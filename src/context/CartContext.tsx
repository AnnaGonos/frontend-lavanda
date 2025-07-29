import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuthContext } from './AuthContext';
import { CartItem } from "../types/product.types";

interface CartContextType {
    cartCount: number;
    setCartCount: React.Dispatch<React.SetStateAction<number>>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartCount, setCartCount] = useState<number>(0);
    const { isAuthenticated } = useAuthContext();

    const fetchCartCount = async () => {
        const token = localStorage.getItem('token');

        if (!isAuthenticated || !token) {
            setCartCount(0);
            return;
        }

        try {
            const res = await fetch('https://backend-lavanda.onrender.com/api/cart/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error('Ошибка загрузки корзины');


            const data: CartItem[] = await res.json();
            const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);
            setCartCount(totalQuantity);
        } catch (err) {
            console.error('Ошибка при загрузке корзины:', err);
            setCartCount(0);
        }
    };


    useEffect(() => {
        if (isAuthenticated) {
            fetchCartCount();
        } else {
            setCartCount(0);
        }
    }, [isAuthenticated]);


    useEffect(() => {
        const handleUserStateChange = (event: CustomEvent) => {
            const { isAuthenticated: authState } = event.detail;

            if (!authState) {
                setCartCount(0);
            } else {
                fetchCartCount();
            }
        };

        window.addEventListener('userStateChanged', handleUserStateChange as EventListener);
        return () => {
            window.removeEventListener('userStateChanged', handleUserStateChange as EventListener);
        };
    }, []);

    const refreshCart = async () => {
        await fetchCartCount();
    };

    useEffect(() => {
        if (!isAuthenticated) {
            setCartCount(0);
        }
    }, [isAuthenticated]);

    return (
        <CartContext.Provider value={{ cartCount, setCartCount, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCartContext должен использоваться внутри CartProvider');
    return context;
};
