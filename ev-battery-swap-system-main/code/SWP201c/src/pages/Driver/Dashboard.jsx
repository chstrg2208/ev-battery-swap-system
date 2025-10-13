// Driver Dashboard - Main Container (Refactored)
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import userService from '../../assets/js/services/userService';
import contractService from '../../assets/js/services/contractService';
import paymentService from '../../assets/js/services/paymentService';
import DashboardLayout from '../../layouts/DashboardLayout';
import { normalizeDashboardStats, extractErrorMessage } from '../../assets/js/utils/apiHelpers';
import { API_CONFIG } from '../../assets/js/config/api';

// Import refactored components
import {
  WelcomeHeader,
  StatsCards,
  QuickActions,
  VehicleManagement,
  PaymentHistory,
  DebugInfo
} from './Dashboard/components';

const DriverDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // State
  const [vehicles, setVehicles] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [stats, setStats] = useState({
    totalSwaps: 0,
    currentPlans: [],
    activeVehicles: 0,
    monthlySpent: 0,
    totalDistance: 0
  });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Save selectedVehicle to sessionStorage
  useEffect(() => {
    if (selectedVehicle) {
      sessionStorage.setItem('selectedVehicle', JSON.stringify(selectedVehicle));
      console.log('💾 Saved selected vehicle to session:', selectedVehicle);
    } else {
      sessionStorage.removeItem('selectedVehicle');
      console.log('🗑️ Removed selected vehicle from session');
    }
  }, [selectedVehicle]);

  // Check for updated vehicle from swap battery flow
  useEffect(() => {
    if (location.state?.updatedVehicle) {
      console.log('🔄 Received updated vehicle from swap:', location.state.updatedVehicle);
      sessionStorage.setItem('selectedVehicle', JSON.stringify(location.state.updatedVehicle));
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚗 DriverDashboard: Fetching data for user:', currentUser);
      
      if (!currentUser) {
        console.log('❌ No current user found');
        setError('Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.');
        return;
      }

      const userId = currentUser.id || currentUser.user_id || currentUser.userId;
      console.log('🆔 Using userId for API:', userId);
      
      if (!userId) {
        throw new Error('Không tìm thấy User ID hợp lệ');
      }
      
      // Fetch user dashboard data
      const userResponse = await userService.getUserById(userId);
      console.log('📊 API Response:', userResponse);
      
      if (userResponse.success && userResponse.data) {
        const userData = userResponse.data;
        const userVehicles = userData.vehicles || [];
        const userDashboard = userData.dashboard || {};
        
        // Process vehicles
        const processedVehicles = processVehicles(userVehicles);
        const finalVehicles = updateVehiclesFromSession(processedVehicles);
        
        setVehicles(finalVehicles);
        
        // Auto-select first vehicle or update selected vehicle
        updateSelectedVehicle(finalVehicles);
        
        // Fetch contracts
        const userContracts = await fetchContracts(userId, userDashboard);
        setContracts(userContracts);
        
        // Fetch payments
        const payments = await fetchPayments(userId);
        setRecentPayments(payments);
        
        // Calculate stats
        const calculatedStats = normalizeDashboardStats(
          userDashboard, 
          processedVehicles, 
          userContracts, 
          []
        );
        setStats(calculatedStats);
        
        console.log('✅ Successfully loaded dashboard data');
      } else {
        throw new Error('API không trả về dữ liệu hợp lệ');
      }
    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
      const errorMessage = extractErrorMessage(err);
      setError(`API Error: ${errorMessage}. Không thể lấy dữ liệu từ server.`);
      
      // Set empty data
      setVehicles([]);
      setContracts([]);
      setRecentPayments([]);
      setStats({
        totalSwaps: 0,
        currentPlans: ['Không có dữ liệu'],
        activeVehicles: 0,
        monthlySpent: 0,
        totalDistance: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper: Process vehicles from API
  const processVehicles = (userVehicles) => {
    return userVehicles.map(vehicle => ({
      id: vehicle.vehicleId || vehicle.id,
      plateNumber: vehicle.plateNumber || vehicle.plate_number,
      model: vehicle.vehicleModel || vehicle.model,
      batteryLevel: vehicle.health || vehicle.batteryLevel || 0,
      currentOdometer: vehicle.currentOdometer || vehicle.current_odometer || 0,
      current_odometer: vehicle.currentOdometer || vehicle.current_odometer || 0,
      batteryId: vehicle.batteryId || vehicle.battery_id,
      batteryModel: vehicle.batteryModel || vehicle.battery_model,
      batteryType: vehicle.batteryType || vehicle.battery_type,
      vinNumber: vehicle.vinNumber || vehicle.vin_number,
      compatibleBatteryTypes: vehicle.compatibleBatteryTypes || vehicle.compatible_battery_types,
      ...vehicle
    }));
  };

  // Helper: Update vehicles with sessionStorage data
  const updateVehiclesFromSession = (processedVehicles) => {
    const updatedVehicleStr = sessionStorage.getItem('selectedVehicle');
    if (!updatedVehicleStr) return processedVehicles;

    try {
      const updatedVehicle = JSON.parse(updatedVehicleStr);
      console.log('🔄 Found updated vehicle in session:', updatedVehicle);
      
      return processedVehicles.map(vehicle => {
        const idMatch = vehicle.id === updatedVehicle.id;
        const plateMatch = vehicle.plateNumber === updatedVehicle.plateNumber;
        
        if (idMatch || plateMatch) {
          console.log('✅ MATCH! Updating vehicle battery:', vehicle.plateNumber, 
                     'from', vehicle.batteryLevel, 'to', updatedVehicle.batteryLevel);
          return {
            ...vehicle,
            batteryLevel: updatedVehicle.batteryLevel || updatedVehicle.health,
            health: updatedVehicle.batteryLevel || updatedVehicle.health
          };
        }
        return vehicle;
      });
    } catch (err) {
      console.warn('⚠️ Failed to parse updated vehicle:', err);
      return processedVehicles;
    }
  };

  // Helper: Update selected vehicle
  const updateSelectedVehicle = (finalVehicles) => {
    const updatedVehicleStr = sessionStorage.getItem('selectedVehicle');
    
    if (updatedVehicleStr && selectedVehicle) {
      try {
        const updatedVehicle = JSON.parse(updatedVehicleStr);
        if (selectedVehicle.id === updatedVehicle.id || 
            selectedVehicle.plateNumber === updatedVehicle.plateNumber) {
          const updatedSelected = finalVehicles.find(v => 
            v.id === updatedVehicle.id || v.plateNumber === updatedVehicle.plateNumber
          );
          if (updatedSelected) {
            console.log('🔄 Updating selected vehicle with new battery:', updatedSelected);
            setSelectedVehicle(updatedSelected);
            return;
          }
        }
      } catch (err) {
        console.warn('⚠️ Failed to update selected vehicle:', err);
      }
    }
    
    // Auto-select first vehicle if no vehicle selected
    if (finalVehicles.length > 0 && !selectedVehicle) {
      setSelectedVehicle(finalVehicles[0]);
    }
  };

  // Helper: Fetch contracts
  const fetchContracts = async (userId, userDashboard) => {
    try {
      const contractsResponse = await contractService.getContracts(userId);
      console.log('📝 Contract service response:', contractsResponse);
      
      if (contractsResponse.success && contractsResponse.data?.length > 0) {
        return contractsResponse.data.map(contractData => ({
          id: contractData.contractId || contractData.id || contractData.contractNumber,
          contractNumber: contractData.contractNumber,
          planName: contractData.planName || contractData.plan || `Contract ${contractData.contractNumber}`,
          status: contractData.status || 'active',
          startDate: contractData.startDate,
          endDate: contractData.endDate,
          monthlyFee: contractData.monthlyFee || contractData.monthlyBaseFee,
          monthlyTotalFee: contractData.monthlyTotalFee,
          monthlyDistance: contractData.monthlyDistance || contractData.distance,
          vehiclePlate: contractData.vehiclePlate,
          vehicleId: contractData.vehicleId
        }));
      }
      
      // Fallback to dashboard data
      if (userDashboard?.contractNumber) {
        return [{
          id: userDashboard.contractNumber,
          contractNumber: userDashboard.contractNumber,
          planName: 'Contract ' + userDashboard.contractNumber,
          status: userDashboard.contractStatus || 'active',
          startDate: userDashboard.contractStartDate,
          endDate: userDashboard.contractEndDate,
          monthlyTotalFee: null,
          monthlyDistance: null,
          vehiclePlate: userDashboard.vehiclePlate
        }];
      }
      
      return [];
    } catch (err) {
      console.warn('⚠️ Contract service failed:', err);
      return [];
    }
  };

  // Helper: Fetch payments
  const fetchPayments = async (userId) => {
    try {
      const paymentsResponse = await paymentService.getPaymentHistory(userId);
      console.log('💰 Payment service response:', paymentsResponse);
      
      if (paymentsResponse.success && paymentsResponse.data) {
        return Array.isArray(paymentsResponse.data) ? 
          paymentsResponse.data.slice(0, 5) : [];
      }
      return [];
    } catch (err) {
      console.warn('⚠️ Payment API failed:', err);
      return [];
    }
  };

  // Helper: Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: '#19c37d', fontSize: '1.5rem' }}>⏳ Đang tải...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: '#ff6b6b', fontSize: '1.2rem' }}>⚠️ {error}</div>
        <button 
          onClick={fetchDashboardData}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#19c37d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <DashboardLayout role="driver">
      <div style={{ padding: '20px', minHeight: '100vh' }}>
        {/* TEST BUTTON FOR SETTINGS */}
        <button
          onClick={() => {
            console.log('🧪 TEST: Navigating to /driver/settings');
            navigate('/driver/settings');
          }}
          style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #ff6b6b, #ff5252)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            zIndex: 9999,
            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)'
          }}
        >
          🧪 TEST Settings
        </button>
        
        <DebugInfo 
          currentUser={currentUser}
          vehicles={vehicles}
          contracts={contracts}
          error={error}
        />
        
        <WelcomeHeader 
          currentUser={currentUser} 
          activeVehicles={stats.activeVehicles} 
        />
        
        <StatsCards 
          stats={stats} 
          formatCurrency={formatCurrency} 
        />
        
        <QuickActions 
          selectedVehicle={selectedVehicle} 
        />
        
        <VehicleManagement
          vehicles={vehicles}
          contracts={contracts}
          selectedVehicle={selectedVehicle}
          onSelectVehicle={setSelectedVehicle}
        />
        
        <PaymentHistory 
          payments={recentPayments} 
        />
      </div>
    </DashboardLayout>
  );
};

export default DriverDashboard;
