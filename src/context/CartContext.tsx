import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuthContext } from './AuthContext';
import {CartItem} from "../types/product.types";

interface CartContextType {
    cartCount: number;
    setCartCount: React.Dispatch<React.SetStateAction<number>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartCount, setCartCount] = useState<number>(0);
    const { token } = useAuthContext();

    useEffect(() => {
        const fetchCartCount = async () => {
            if (!token) {
                setCartCount(0);
                return;
            }

            try {
                const res = await fetch('http://localhost:5000/api/cart/', {
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

        fetchCartCount();
    }, [token]);

    return (
        <CartContext.Provider value={{ cartCount, setCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCartContext должен использоваться внутри CartProvider');
    return context;
};

