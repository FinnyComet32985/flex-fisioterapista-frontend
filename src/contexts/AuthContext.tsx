import { createContext, useContext, useState, useEffect } from "react";
import { type ReactNode } from "react";
import { initApi } from "@/lib/api";


const URL = "https://84dcg7p1-1337.euw.devtunnels.ms/fisioterapista";
// const URL = "http://localhost:1337/fisioterapista";

// Definiamo la "forma" del nostro context
interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (nome: string, cognome: string, email: string, password: string) => Promise<void>;
}

// 1. Creazione del Context
const AuthContext = createContext<AuthContextType | null>(null);

// 2. creazione hook useAuth
// per semplificare l'accesso all'auth context creiamo questo hook personalizzato
// nei file in cui abbiamo bisogno del contesto invece di importare sia AuthContext che useContext 
// possiamo direttamente importare useAuth che ci restituirà direttamente le funzioni di cui abbiamo bisogno
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
            URL.concat("/login"),
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            }
        );


        if (response.status !== 200) {
            const data = await response.json()
            throw new Error(data.message);
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
    const logout = async () => {
        // 1. Rimuovi il token dallo stato
        setToken(null);

        // 2. Rimuovi il token dallo storage persistente
        localStorage.removeItem("token");

        const response = await fetch(
            URL.concat("/logout"),
            {
                method: "POST",
                credentials: "include",
            })

        if (!response.ok) {
            throw new Error("Logout failed");
        }
    };

    // Funzione per il Register
    const register = async (nome:string, cognome:string, email: string, password: string) => {
        const response = await fetch(
            URL.concat("/register"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ nome, cognome, email, password }),
        });

        if (!response.ok) {
            // Lancia un errore che verrà catturato nel form di registrazione
            const data = await response.json()
            throw new Error(data.message);
        }

        // Dopo la registrazione, esegui il login automatico
        await login(email, password);
    };

    // funzione per il RefreshToken
    const refreshToken = async () => {
        const response = await fetch(
            URL.concat("/refreshToken"),
            {
                method: "POST",
                credentials: "include",
            }
        );
        if (!response.ok) {
            throw new Error("Refresh token fallito");
        }
        const data = await response.json();
        const newToken = data.accessToken;
        setToken(newToken);
        localStorage.setItem("token", newToken);
        console.log("Token rinfrescato con successo dal context.");
    }

    // inizializziamo il modulo API in modo da sostituire le sue funzioni placeholder con quelle reali
    // Usiamo useEffect per assicurarci che venga eseguito una sola volta
    useEffect(() => {
        initApi({ refreshToken, logout });
    }, [refreshToken, logout]); // Le funzioni sono stabili, quindi l'effetto non si ripeterà

    // Il valore esposto dal Context
    const contextValue: AuthContextType = {
        isAuthenticated,
        token,
        login,
        logout,
        register,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
