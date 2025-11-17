import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/logged/HomePage";
import CatalogoEsercizi from "@/pages/logged/CatalogoEsercizi";
import AppuntamentiPage from "@/pages/logged/Appuntamenti";
import ChatPage from "@/pages/logged/Chat";
import SettingsPage from "@/pages/logged/Settings";
import PazientiPage from "@/pages/logged/Pazienti";
import LoginPage from "./pages/unlogged/login";
import ProtectedRoute from "@/components/utils/ProtectedRoutes";
import RegisterPage from "./pages/unlogged/register";
import NuovoEsercizio from "./components/custom/NuovoEsercizio";
import NuovoPazienteForm from "./components/custom/NuovoPazienteForm";
import ProfiloPazientePage from "./pages/logged/ProfiloPaziente";
import DashboardPaziente from "@/components/custom/DashboardPaziente";
import NuovaSchedaForm from "./components/custom/NuovaSchedaForm";
import ModificaScheda from "./components/custom/ModificaScheda";



function App() {
  return (
      <Router>

        <Routes>
          <Route element={<ProtectedRoute/>} >
            <Route path="/profilo-paziente/:id" element={<DashboardPaziente />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/appuntamenti" element={<AppuntamentiPage />} />
            <Route path="/catalogo-esercizi" element={<CatalogoEsercizi />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/pazienti" element={<PazientiPage />} />
            <Route path="/nuovo-esercizio" element={<NuovoEsercizio />} />
            <Route path="/nuovo-paziente" element={<NuovoPazienteForm />} />
            <Route path="/profilo-paziente" element={<ProfiloPazientePage />} />
            <Route path="/nuova-scheda/:pazienteId" element={<NuovaSchedaForm />} />
            <Route path="/modifica-scheda/:pazienteId/:schedaId" element={<ModificaScheda />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
  )
}
export default App