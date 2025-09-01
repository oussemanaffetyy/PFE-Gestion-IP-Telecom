import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SiteTypeListPage from "./pages/SiteTypeListPage";
import VlanListPage from "./pages/VlanListPage";
import IpAddressListPage from "./pages/IpAddressListPage";

import HomePageOne from './pages/HomePageOne'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pour l'instant, on affiche juste la page d'accueil du template */}
        <Route path="/" element={<HomePageOne />} />
        <Route path="/types" element={<ProtectedRoute><MasterLayout><SiteTypeListPage /></MasterLayout></ProtectedRoute>} />
        <Route path="/vlans" element={<ProtectedRoute><MasterLayout><VlanListPage /></MasterLayout></ProtectedRoute>} />
        <Route path="/ip-addresses" element={<ProtectedRoute><MasterLayout><IpAddressListPage /></MasterLayout></ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;