import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Creazione del Context
const AuthContext = createContext(null);

// 2. Hook personalizzato per un facile accesso al Context
export const useAuth = () => {
    return useContext(AuthContext);
};

// 3. Componente Provider
export const AuthProvider = ({ children }) => {
    // Inizializza lo stato leggendo il token dallo storage persistente (se presente)
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const isAuthenticated = !!token; // Converte il token in booleano (true se token esiste)

    // Funzione per il Login
    const login = async (apiToken: string) => {
        // 1. Salva il token nello stato
        setToken(apiToken);

        // 2. Salva il token nello storage persistente
        localStorage.setItem("token", apiToken);

        // Qui potresti anche decodificare il JWT per estrarre i dati utente
        // e salvare i dati utente nello stato
    };

    // Funzione per il Logout
    const logout = () => {
        // 1. Rimuovi il token dallo stato
        setToken(null);

        // 2. Rimuovi il token dallo storage persistente
        localStorage.removeItem("token");
    };

    // Il valore esposto dal Context
    const contextValue = {
        isAuthenticated,
        token,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

