import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMyProfile } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProfile = async () => {
            if (token) {
                try {
                    const res = await getMyProfile();
                    setUserProfile(res.data);
                } catch (error) {
                    console.error("Session invalide, déconnexion...", error);
                    // Si le token est invalide, on le supprime
                    localStorage.removeItem('token');
                    setUserProfile(null);
                }
            }
            setLoadingProfile(false);
        };
        fetchProfile();
    }, [token]);

    return (
        <AuthContext.Provider value={{ userProfile, loadingProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personnalisé pour utiliser facilement le contexte
export const useAuth = () => {
    return useContext(AuthContext);
};