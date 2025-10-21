// src/components/utils/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/layouts/mainLayout";

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Se l'utente non è autenticato, reindirizzalo alla pagina di login.
        // `replace` evita di aggiungere una nuova voce alla cronologia di navigazione.
        return <Navigate to="/login" replace />;
    }

    // Se l'utente è autenticato, usa MainLayout che a sua volta renderizzerà
    // la pagina figlia corretta tramite <Outlet />.
    return <MainLayout />;
};

export default ProtectedRoute;
