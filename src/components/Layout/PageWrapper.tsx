import React, {useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import {Layout} from "./Layout";
import {useAuthContext} from "../../context/AuthContext";

export const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const { openAuthModal } = useAuthContext();

    useEffect(() => {
        if (location.state?.openAuthModal) {
            openAuthModal();
        }
    }, [location]);

    return <Layout>{children}</Layout>;
};

