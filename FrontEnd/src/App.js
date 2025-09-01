import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';

// Layouts & Core Components
import MasterLayout from "./masterLayout/MasterLayout";
import ProtectedRoute from './components/ProtectedRoute';
import RouteScrollToTop from "./helper/RouteScrollToTop";

// --- PAGES DE VOTRE PROJET PFE ---
import IpCheckPage from './pages/IpCheckPage';
import SignInPage from './pages/SignInPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import RegionListPage from "./pages/RegionListPage"; 
import SiteListPage from "./pages/SiteListPage";
import SiteTypeListPage from "./pages/SiteTypeListPage";
import VlanListPage from "./pages/VlanListPage";
import IpAddressListPage from "./pages/IpAddressListPage";
import AnomalyDashboardPage from "./pages/AnomalyDashboardPage"; 
import ProfilePage from './pages/ProfilePage';
import AdminListPage from './pages/AdminListPage';
import AddAdminPage from './pages/AddAdminPage';   
import ErrorPage from "./pages/ErrorPage";



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RouteScrollToTop />
        <Routes>

          {/* --- ROUTES PUBLIQUES DE VOTRE PROJET --- */}
          <Route path="/" element={<IpCheckPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* --- ROUTES PROTÉGÉES DE VOTRE PROJET --- */}
          <Route path="/dashboard" element={<ProtectedRoute><MasterLayout><DashboardPage /></MasterLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><MasterLayout><ProfilePage /></MasterLayout></ProtectedRoute>} />
          <Route path="/admins-list" element={<ProtectedRoute><MasterLayout><AdminListPage /></MasterLayout></ProtectedRoute>} />
          <Route path="/add-admin" element={<ProtectedRoute><MasterLayout><AddAdminPage /></MasterLayout></ProtectedRoute>} />
          <Route path="/regions" element={<ProtectedRoute><MasterLayout><RegionListPage /></MasterLayout></ProtectedRoute>} />
          <Route path="/sites" element={<ProtectedRoute><MasterLayout><SiteListPage /></MasterLayout></ProtectedRoute>} />
          <Route path="/types" element={<ProtectedRoute><MasterLayout><SiteTypeListPage /></MasterLayout></ProtectedRoute>} />
          <Route path="/ip-addresses" element={<ProtectedRoute><MasterLayout><IpAddressListPage /></MasterLayout></ProtectedRoute>} />
          <Route path="/vlans" element={<ProtectedRoute><MasterLayout><VlanListPage /></MasterLayout></ProtectedRoute>} />
          <Route path="/anomalies" element={<ProtectedRoute><MasterLayout><AnomalyDashboardPage /></MasterLayout></ProtectedRoute>} />
          
          
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;