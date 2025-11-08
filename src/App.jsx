import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PoliceLogin from "./pages/PoliceLogin";
import CitizenLogin from "./pages/CitizenLogin";
import PoliceDashboard from "./pages/PoliceDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import TwoFactorSetup from "./pages/TwoFactorSetup";
import CaseRecommendations from "./pages/CaseRecommendations";
import TwoFactorLogin from "./pages/TwoFactorLogin";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/police-login" element={<PoliceLogin />} />
        <Route path="/citizen-login" element={<CitizenLogin />} />
        <Route path="/police-dashboard" element={<PoliceDashboard />} />
        <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
        <Route path="/2fa-setup" element={<TwoFactorSetup />} />
        <Route path="/2fa-login" element={<TwoFactorLogin />} />
        <Route path="/cases/recommend/:caseNum" element={<CaseRecommendations />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;