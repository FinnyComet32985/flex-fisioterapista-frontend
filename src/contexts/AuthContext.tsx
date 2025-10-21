import { createContext, useContext, useState } from "react";
import { type ReactNode } from "react";
// Definiamo la "forma" del nostro context
interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

// 1. Creazione del Context
const AuthContext = createContext<AuthContextType | null>(null);

// 2. Hook personalizzato per un facile accesso al Context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error(
            "useAuth deve essere usato all'interno di un AuthProvider"
        );
    }
    return context;
};

// 3. Componente Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Inizializza lo stato leggendo il token dallo storage persistente (se presente)
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const isAuthenticated = !!token; // Converte il token in booleano (true se token esiste)

    // Funzione per il Login
    const login = async (email: string, password: string) => {
        const response = await fetch(
            "http://localhost:1337/fisioterapista/login",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            }
        );
        console.log(response);


        if (response.status !== 200) {
            throw new Error("Login failed");
        }
        const data = await response.json();
        const apiToken = data.accessToken;


        if (!apiToken) {
            throw new Error("Login failed");
        }

        // 1. Salva il token nello stato
        setToken(apiToken);

        // 2. Salva il token nello storage persistente
        localStorage.setItem("token", apiToken);
        
    };

    // Funzione per il Logout
    const logout = () => {
        // 1. Rimuovi il token dallo stato
        setToken(null);

        // 2. Rimuovi il token dallo storage persistente
        localStorage.removeItem("token");
    };

    // Il valore esposto dal Context
    const contextValue: AuthContextType = {
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
