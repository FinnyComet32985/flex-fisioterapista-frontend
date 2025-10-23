import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/logged/HomePage";
import CatalogoEsercizi from "@/pages/logged/CatalogoEsercizi";
import AppuntamentiPage from "@/pages/logged/Appuntamenti";
import ChatPage from "@/pages/logged/Chat";
import SettingsPage from "@/pages/logged/Settings";
import PazientiPage from "@/pages/logged/Pazienti";
import SchedaAllenamentoPage from "@/pages/logged/SchedaAllenamento";
import LoginPage from "./pages/unlogged/login";
import ProtectedRoute from "@/components/utils/ProtectedRoutes";
import RegisterPage from "./pages/unlogged/register";
import NuovoEsercizio from "./components/custom/NuovoEsercizio";
import NuovoPazienteForm from "./components/custom/NuovoPazienteForm";
import ProfiloPazientePage from "./pages/logged/ProfiloPaziente";



function App() {
  return (
      <Router>

        <Routes>
          <Route element={<ProtectedRoute/>} >
            <Route path="/" element={<HomePage />} />
            <Route path="/appuntamenti" element={<AppuntamentiPage />} />
            <Route path="/catalogo-esercizi" element={<CatalogoEsercizi />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/pazienti" element={<PazientiPage />} />
            <Route path="/scheda-allenamento" element={<SchedaAllenamentoPage />} />
            <Route path="/nuovo-esercizio" element={<NuovoEsercizio />} />
            <Route path="/nuovo-paziente" element={<NuovoPazienteForm />} />
            <Route path="/profilo-paziente" element={<ProfiloPazientePage />} />

          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
  )
}
export default App