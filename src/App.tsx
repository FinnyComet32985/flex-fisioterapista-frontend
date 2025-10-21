import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import CatalogoEsercizi from "@/pages/CatalogoEsercizi";
import AppuntamentiPage from "@/pages/Appuntamenti";
import ChatPage from "@/pages/Chat";
import SettingsPage from "@/pages/Settings";
import DashboardPaziente from "@/pages/DashboardPaziente";
import PazientiPage from "@/pages/Pazienti";
import SchedaAllenamentoPage from "@/pages/SchedaAllenamento";
import MainLayout from "./layouts/mainLayout";




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
        </Routes>
      </Router>
  )
}
export default App