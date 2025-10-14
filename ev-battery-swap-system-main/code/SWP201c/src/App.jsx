import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// --- Context Providers & Hooks ---
import { AuthProvider, useAuth } from './context/AuthContext';
import { SwapProvider } from './context/SwapContext';
import { AppProvider } from './context/AppContext';

// --- Common Components & Protected Routes ---
import LandingPage from './components/common/LandingPage';
import LoginModal from './components/modals/LoginModal';
import RegisterModal from './components/modals/RegisterModal';
import LoadingFallback from './components/common/LoadingFallback';
import { DriverRoute, StaffRoute, AdminRoute } from './components/ProtectedRoute';

// --- Layouts & Screens ---
import DriverLayout from './layouts/DriverLayout';
import VehicleSelectionScreen from './pages/Driver/Vehicles'; // Màn hình chọn xe

// --- Driver Pages ---
import DriverDashboard from './pages/Driver/Dashboard';
import DriverSwapBattery from './pages/Driver/SwapBattery';
import DriverStationsMap from './pages/Driver/StationsMap';
import DriverSubscriptions from './pages/Driver/Subscriptions';
import DriverContracts from './pages/Driver/Contracts';
import DriverPayments from './pages/Driver/Payments';
import DriverSupport from './pages/Driver/Support';
import DriverProfile from './pages/Driver/Profile';
// Note: DriverVehicles is now the management page, not the selection screen.

// --- Staff & Admin Pages ---
import StaffDashboard from './pages/Staff/Dashboard';
import AdminDashboard from './pages/Admin/Dashboard';

// Fix default markers for React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ====================================================================
// GATEKEEPER COMPONENT
// Checks if a driver has selected a vehicle before allowing access
// to the main application layout.
// ====================================================================
function ProtectedDriverLayout() {
  const { selectedVehicle } = useAuth();

  if (!selectedVehicle) {
    // If no vehicle is selected, force a redirect to the selection screen.
    return <Navigate to="/driver/select-vehicle" replace />;
  }

  // If a vehicle is selected, render the main DriverLayout with the sidebar.
  return <DriverLayout />;
}

// Main App Content with all routes
function AppContent() {
  const { currentUser } = useAuth();

  return (
    <div className="App">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* === ROUTE FOR VEHICLE SELECTION (NO SIDEBAR) === */}
          <Route 
            path="/driver/select-vehicle" 
            element={
              <DriverRoute>
                <VehicleSelectionScreen />
              </DriverRoute>
            } 
          />
          
          {/* === MAIN DRIVER ROUTES (WITH SIDEBAR, AFTER SELECTION) === */}
          <Route 
            path="/driver" 
            element={
              <DriverRoute>
                <ProtectedDriverLayout />
              </DriverRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} /> 
            <Route path="dashboard" element={<DriverDashboard />} />
            <Route path="swap-battery" element={<DriverSwapBattery />} />
            <Route path="vehicles" element={<div
            >Trang Quản lý Xe</div>} /> 
            <Route path="stations-map" element={<DriverStationsMap />} />
            <Route path="subscriptions" element={<DriverSubscriptions />} />
            <Route path="contracts" element={<DriverContracts />} />
            <Route path="payments" element={<DriverPayments />} />
            <Route path="support" element={<DriverSupport />} />
            <Route path="profile" element={<DriverProfile />} />
          </Route>
          
          {/* === STAFF ROUTES === */}
          <Route path="/staff/dashboard" element={<StaffRoute><StaffDashboard /></StaffRoute>} />
          
          {/* === ADMIN ROUTES === */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* === PUBLIC & REDIRECT ROUTES === */}
          <Route path="/" element={
            currentUser ? (
              <Navigate to={
                currentUser.role === 'driver' ? '/driver/dashboard' : // AuthContext will handle the select-vehicle redirect
                currentUser.role === 'staff' ? '/staff/dashboard' :
                currentUser.role === 'admin' ? '/admin/dashboard' :
                '/'
              } replace />
            ) : (
              <LandingPage />
            )
          } />
          
          {/* Fallback for any unmatched routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Modals */}
        <LoginModal />
        <RegisterModal />
      </Suspense>
    </div>
  );
}

// Main App Component that wraps everything with context providers
function App() {
  return (
    <AuthProvider>
      <SwapProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </SwapProvider>
    </AuthProvider>
  );
}

export default App;