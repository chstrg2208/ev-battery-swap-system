// Auth Context - Quản lý authentication
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../assets/js/helpers/helpers';
import authService from '../assets/js/services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [currentView, setCurrentView] = useState('landing');
  
  // <-- 1. THÊM STATE MỚI ĐỂ LƯU XE ĐÃ CHỌN -->
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const handleLogin = async (email, password) => {
    console.log('🔐 AuthContext: Starting login process for:', email);
    setIsLoggingIn(true);
    try {
      const response = await authService.login({ email, password });
      console.log('🔐 AuthContext: Login response:', response);
      
      if (response.success) {
        const userData = response.user;
        setCurrentUser(userData);
        setSelectedVehicle(null); // <-- THÊM: Reset xe đã chọn khi đăng nhập mới
        setCurrentView('dashboard');
        setShowLoginModal(false);
        
        const normalizeRole = (role) => {
          const roleMap = { 'Admin': 'admin', 'Staff': 'staff', 'EV Driver': 'driver', 'admin': 'admin', 'staff': 'staff', 'driver': 'driver' };
          return roleMap[role] || 'driver';
        };

        const normalizedRole = normalizeRole(userData.role);
        const updatedUser = { ...userData, role: normalizedRole };
        setCurrentUser(updatedUser);
        
        // <-- 2. SỬA ĐỔI LOGIC ĐIỀU HƯỚNG -->
        let navigationPath = '';
        if (normalizedRole === 'admin') {
            navigationPath = '/admin/dashboard';
        } else if (normalizedRole === 'staff') {
            navigationPath = '/staff/dashboard';
        } else {
            // THAY ĐỔI QUAN TRỌNG: Chuyển tài xế đến trang chọn xe
            navigationPath = '/driver/select-vehicle'; 
        }
        
        console.log('🚀 AuthContext: Navigating to:', navigationPath, 'for role:', normalizedRole);
        showToast(`Chào mừng ${userData.name}!`, 'success');
        
        setTimeout(() => {
          console.log('🎯 AuthContext: Executing navigation to:', navigationPath);
          navigate(navigationPath);
        }, 500);

      } else {
        showToast(response.message || 'Đăng nhập thất bại!', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast('Có lỗi xảy ra khi đăng nhập!', 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      setSelectedVehicle(null); // <-- THÊM: Reset xe đã chọn khi đăng xuất
      setCurrentView('landing');
      navigate('/');
      showToast('Đã đăng xuất!', 'success');
    } catch (error) {
      console.error('Logout error:', error);
      showToast('Có lỗi xảy ra khi đăng xuất!', 'error');
    }
  };

  // <-- 3. THÊM HÀM MỚI ĐỂ CẬP NHẬT XE ĐƯỢC CHỌN -->
  const selectVehicle = (vehicleData) => {
    console.log('🚗 AuthContext: Vehicle selected:', vehicleData);
    setSelectedVehicle(vehicleData);
    // Sau khi chọn xe, chuyển người dùng đến dashboard chính
    navigate('/driver/dashboard');
  };

  const value = {
    currentUser,
    setCurrentUser,
    showLoginModal,
    setShowLoginModal,
    showRegisterModal,
    setShowRegisterModal,
    isLoggingIn,
    currentView,
    setCurrentView,
    handleLogin,
    handleLogout,
    selectedVehicle, // <-- EXPORT STATE MỚI
    selectVehicle,   // <-- EXPORT HÀM MỚI
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;