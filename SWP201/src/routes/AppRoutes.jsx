// Main App Routes
// combine tất cả routes

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DriverRoutes from './DriverRoutes';
import StaffRoutes from './StaffRoutes';
import AdminRoutes from './AdminRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/driver/*" element={<DriverRoutes />} />
      <Route path="/staff/*" element={<StaffRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/" element={<div>Landing Page - Choose Role</div>} />
    </Routes>
  );
};

export default AppRoutes;