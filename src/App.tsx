import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import CatalogoEsercizi from "@/pages/CatalogoEsercizi";
import AppuntamentiPage from "@/pages/Appuntamenti";
import ChatPage from "@/pages/Chat";
import SettingsPage from "@/pages/Settings";
import DashboardPaziente from "@/pages/DashboardPaziente";
import PazientiPage from "@/pages/Pazienti";
import SchedaAllenamentoPage from "@/pages/SchedaAllenamento";




function App() {
  return (
      <Router>

        <Routes>
          <Route path="/" element={<HomePage />} />
          
        </Routes>
      </Router>
  )
}
export default App