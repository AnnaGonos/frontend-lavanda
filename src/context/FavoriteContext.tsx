import React, { createContext, useState, useContext } from 'react';

interface FavoriteContextType {
    favoriteCount: number;
    setFavoriteCount: React.Dispatch<React.SetStateAction<number>>;
    favoriteIds: number[];
    setFavoriteIds: React.Dispatch<React.SetStateAction<number[]>>;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favoriteCount, setFavoriteCount] = useState<number>(0);
    const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

    return (
        <FavoriteContext.Provider
            value={{
                favoriteCount,
                setFavoriteCount,
                favoriteIds,
                setFavoriteIds
            }}
        >
            {children}
        </FavoriteContext.Provider>
    );
};

export const useFavoriteContext = () => {
    const context = useContext(FavoriteContext);
    if (!context) throw new Error('useFavoriteContext должен использоваться внутри FavoriteProvider');
    return context;
};

