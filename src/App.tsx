import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/logged/HomePage";
import CatalogoEsercizi from "@/pages/logged/CatalogoEsercizi";
import AppuntamentiPage from "@/pages/logged/Appuntamenti";
import ChatPage from "@/pages/logged/Chat";
import SettingsPage from "@/pages/logged/Settings";
import DashboardPaziente from "@/pages/logged/DashboardPaziente";
import PazientiPage from "@/pages/logged/Pazienti";
import SchedaAllenamentoPage from "@/pages/logged/SchedaAllenamento";
import MainLayout from "./layouts/mainLayout";
import LoginPage from "./pages/unlogged/login";




function App() {
  return (
      <Router>

        <Routes>
          <Route element={<MainLayout />} >
            <Route path="/" element={<HomePage />} />
            <Route path="/appuntamenti" element={<AppuntamentiPage />} />
            <Route path="/catalogo-esercizi" element={<CatalogoEsercizi />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/dashboard-paziente" element={<DashboardPaziente />} />
            <Route path="/pazienti" element={<PazientiPage />} />
            <Route path="/scheda-allenamento" element={<SchedaAllenamentoPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
  )
}
export default App