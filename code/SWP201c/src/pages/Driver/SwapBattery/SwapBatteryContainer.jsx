// Swap Battery Container - Main Logic Component
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { swapService } from '../../../assets/js/services';
import '../../../assets/css/battery-swap.css';

// Hooks
import { useSwapData, useSwapSteps } from './hooks';

// Components
import {
  SwapProgressBar,
  StationSelector,
  TowerSelector,
  NewBatterySelector,
  EmptySlotSelector,
  SwapConfirmation,
  PlaceOldBattery,
  TakeNewBattery,
  ConfirmAndSave,
  SwapSuccess,
  QRCodeModal,
  StaffAssistanceModal
} from './components';

// Utils
import { getBatteryLevel, createAssistanceData } from './utils';

const SwapBatteryContainer = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Selected vehicle state
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [currentBatteryLevel, setCurrentBatteryLevel] = useState(50); // Changed from 15 to 50 for better default

  // Modal states
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [showStaffAssistanceModal, setShowStaffAssistanceModal] = useState(false);
  const [assistanceLoading, setAssistanceLoading] = useState(false);
  const [assistanceSuccess, setAssistanceSuccess] = useState(false);

  // Custom hooks
  const swapData = useSwapData(currentUser, selectedVehicle);
  const swapSteps = useSwapSteps();

  // Destructure for easier access
  const {
    stations,
    userContract,
    towers,
    fullSlots,
    emptySlots,
    loading,
    loadingTowers,
    loadingSlots,
    error,
    fetchInitialData,
    fetchTowersByStation,
    fetchSlotsByTower,
    setError
  } = swapData;

  const {
    currentStep,
    selectedStation,
    selectedTower,
    selectedNewBatterySlot,
    selectedEmptySlot,
    swapResult,
    setCurrentStep,
    setSelectedStation,
    setSelectedTower,
    setSelectedNewBatterySlot,
    setSelectedEmptySlot,
    setSwapResult
  } = swapSteps;

  // isProcessing is no longer used but kept for UI compatibility
  const isProcessing = false;

  // Initialize - Get vehicle from navigation
  useEffect(() => {
    const vehicleFromNavigation = location.state?.selectedVehicle;
    if (vehicleFromNavigation) {
      console.log('🚗 Received selected vehicle from Dashboard:', vehicleFromNavigation);
      setSelectedVehicle(vehicleFromNavigation);
      
      // Get battery level with priority: health > batteryLevel > 50
      const batteryLevel = getBatteryLevel(vehicleFromNavigation, 50);
      console.log('🔋 Setting battery level from vehicle:', batteryLevel, 
                  '(health:', vehicleFromNavigation.health, 
                  'batteryLevel:', vehicleFromNavigation.batteryLevel, ')');
      setCurrentBatteryLevel(batteryLevel);
    } else {
      console.warn('⚠️ No vehicle received from navigation, using default battery level');
    }

    fetchInitialData(vehicleFromNavigation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, location.state]);

  // Handle station selection
  const handleSelectStation = async (station) => {
    console.log('🏪 handleSelectStation called!');
    console.log('📍 Station:', station.name, 'Status:', station.status);
    
    // Smart status checking - support multiple formats
    let canSelect = false;
    
    if (station.status === undefined || station.status === null) {
      // No status - default to active
      canSelect = true;
    } else if (typeof station.status === 'string') {
      const statusLower = station.status.toLowerCase().trim();
      canSelect = statusLower === 'active' || statusLower === 'hoạt động' || statusLower === 'available';
    } else if (typeof station.status === 'number') {
      canSelect = station.status === 1 || station.status > 0;
    } else if (typeof station.status === 'boolean') {
      canSelect = station.status === true;
    } else {
      // Unknown format - default to active
      console.warn('⚠️ Unknown status format, allowing selection');
      canSelect = true;
    }
    
    console.log('✅ Can select?', canSelect);
    
    if (canSelect) {
      console.log('� Selecting station and fetching towers...');
      setSelectedStation(station);
      setSelectedTower(null);
      await fetchTowersByStation(station.id);
      setCurrentStep(2);
      console.log('🎉 Successfully moved to step 2!');
    } else {
      console.log('❌ Station not active, cannot select');
      alert('Trạm này đang bảo trì. Vui lòng chọn trạm khác.');
    }
  };

  // Handle tower selection
  const handleSelectTower = async (tower) => {
    if (tower.status === 'active') {
      setSelectedTower(tower);
      setSelectedNewBatterySlot(null);
      setSelectedEmptySlot(null);
      await fetchSlotsByTower(tower.id);
      setCurrentStep(3);
    }
  };

  // Handle new battery slot selection
  const handleSelectNewBatterySlot = (slot) => {
    setSelectedNewBatterySlot(slot);
    setCurrentStep(4);
  };

  // Handle empty slot selection
  const handleSelectEmptySlot = (slot) => {
    setSelectedEmptySlot(slot);
    setCurrentStep(5);
  };

  // Handle staff assistance request
  const handleRequestStaffAssistance = async () => {
    if (!selectedStation) {
      alert('Vui lòng chọn trạm sạc trước khi yêu cầu hỗ trợ');
      return;
    }

    try {
      setAssistanceLoading(true);
      setAssistanceSuccess(false); // Reset success state

      const assistanceData = createAssistanceData({
        currentUser,
        selectedVehicle,
        selectedStation,
        currentBatteryLevel,
        userContract
      });

      console.log('🤝 Requesting staff assistance:', assistanceData);

      const result = await swapService.requestStaffAssistance(assistanceData);

      console.log('📡 Staff assistance result:', result);

      if (result.success) {
        console.log('✅ Staff assistance request successful!');
        setAssistanceSuccess(true);
      } else {
        console.error('❌ Staff assistance failed:', result.message);
        alert(result.message || 'Không thể gửi yêu cầu hỗ trợ');
        setShowStaffAssistanceModal(false);
      }
    } catch (error) {
      console.error('❌ Error requesting staff assistance:', error);
      alert(`Lỗi: ${error.message || 'Không thể gửi yêu cầu hỗ trợ. Vui lòng thử lại sau.'}`);
      setShowStaffAssistanceModal(false);
    } finally {
      setAssistanceLoading(false);
    }
  };

  // Handle navigation
  const handleNext = async () => {
    if (currentStep === 5) {
      // Move to step 6: Place old battery
      setCurrentStep(6);
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && !isProcessing) {
      if (currentStep === 5) {
        setCurrentStep(4);
      } else if (currentStep === 4) {
        setCurrentStep(3);
      } else if (currentStep === 3) {
        setCurrentStep(2);
      } else if (currentStep === 2) {
        setCurrentStep(1);
      }
    }
  };

  const handleFinish = () => {
    // Pass updated vehicle back to dashboard/vehicles page
    const updatedVehicleData = sessionStorage.getItem('selectedVehicle');
    if (updatedVehicleData) {
      try {
        const updatedVehicle = JSON.parse(updatedVehicleData);
        console.log('🔙 Navigating back with updated vehicle:', updatedVehicle);
        navigate('/driver/dashboard', { 
          state: { updatedVehicle },
          replace: true 
        });
        return;
      } catch (err) {
        console.warn('⚠️ Failed to parse updated vehicle:', err);
      }
    }
    navigate('/driver/dashboard');
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StationSelector
            stations={stations}
            selectedStation={selectedStation}
            selectedVehicle={selectedVehicle}
            currentBatteryLevel={currentBatteryLevel}
            loading={loading}
            error={error}
            onSelectStation={handleSelectStation}
            onRetry={() => fetchInitialData(location.state?.selectedVehicle)}
            onRequestStaffAssistance={() => setShowStaffAssistanceModal(true)}
          />
        );

      case 2:
        return (
          <TowerSelector
            towers={towers}
            selectedStation={selectedStation}
            selectedTower={selectedTower}
            loadingTowers={loadingTowers}
            onSelectTower={handleSelectTower}
            onGoBack={() => setCurrentStep(1)}
            onRequestStaffAssistance={() => setShowStaffAssistanceModal(true)}
          />
        );

      case 3:
        return (
          <NewBatterySelector
            fullSlots={fullSlots}
            selectedStation={selectedStation}
            selectedTower={selectedTower}
            selectedNewBatterySlot={selectedNewBatterySlot}
            loadingSlots={loadingSlots}
            onSelectSlot={handleSelectNewBatterySlot}
            onGoBack={() => setCurrentStep(2)}
            onRequestStaffAssistance={() => setShowStaffAssistanceModal(true)}
          />
        );

      case 4:
        return (
          <EmptySlotSelector
            emptySlots={emptySlots}
            selectedStation={selectedStation}
            selectedTower={selectedTower}
            selectedNewBatterySlot={selectedNewBatterySlot}
            selectedEmptySlot={selectedEmptySlot}
            loadingSlots={loadingSlots}
            onSelectSlot={handleSelectEmptySlot}
            onGoBack={() => setCurrentStep(3)}
            onRequestStaffAssistance={() => setShowStaffAssistanceModal(true)}
          />
        );

      case 5:
        return (
          <SwapConfirmation
            selectedStation={selectedStation}
            selectedTower={selectedTower}
            selectedVehicle={selectedVehicle}
            selectedNewBatterySlot={selectedNewBatterySlot}
            selectedEmptySlot={selectedEmptySlot}
            currentBatteryLevel={currentBatteryLevel}
            error={error}
            onShowQR={() => setShowQRPopup(true)}
            onRequestStaffAssistance={() => setShowStaffAssistanceModal(true)}
          />
        );

      case 6:
        return (
          <PlaceOldBattery
            selectedStation={selectedStation}
            selectedTower={selectedTower}
            selectedEmptySlot={selectedEmptySlot}
            selectedVehicle={selectedVehicle}
            currentBatteryLevel={currentBatteryLevel}
            onComplete={() => setCurrentStep(7)}
            onShowQR={() => setShowQRPopup(true)}
          />
        );

      case 7:
        return (
          <TakeNewBattery
            selectedStation={selectedStation}
            selectedTower={selectedTower}
            selectedNewBatterySlot={selectedNewBatterySlot}
            onComplete={() => setCurrentStep(8)}
            onShowQR={() => setShowQRPopup(true)}
          />
        );

      case 8:
        return (
          <ConfirmAndSave
            selectedStation={selectedStation}
            selectedTower={selectedTower}
            selectedNewBatterySlot={selectedNewBatterySlot}
            selectedEmptySlot={selectedEmptySlot}
            selectedVehicle={selectedVehicle}
            currentBatteryLevel={currentBatteryLevel}
            onComplete={() => {
              const newBatteryLevel = selectedNewBatterySlot?.batteryLevel || 100;
              
              // Update vehicle battery level
              if (selectedVehicle) {
                const updatedVehicle = {
                  ...selectedVehicle,
                  batteryLevel: newBatteryLevel,
                  health: newBatteryLevel
                };
                
                // Update local state
                setSelectedVehicle(updatedVehicle);
                
                // Update sessionStorage for persistence
                sessionStorage.setItem('selectedVehicle', JSON.stringify(updatedVehicle));
                console.log('✅ Updated vehicle battery level:', newBatteryLevel, '%');
                
                // Also update battery level state
                setCurrentBatteryLevel(newBatteryLevel);
              }
              
              // Set swap result before moving to success page
              setSwapResult({
                swapId: `SWAP_${Date.now()}`,
                stationName: selectedStation?.name,
                time: new Date().toLocaleString('vi-VN'),
                oldBattery: getBatteryLevel(selectedVehicle, currentBatteryLevel),
                newBattery: newBatteryLevel,
                status: 'completed'
              });
              setCurrentStep(9);
            }}
            onError={(error) => setError(error)}
          />
        );

      case 9:
        return (
          <SwapSuccess
            swapResult={swapResult}
            selectedStation={selectedStation}
            selectedVehicle={selectedVehicle}
            currentBatteryLevel={currentBatteryLevel}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="battery-swap-overlay" style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
        <div className="battery-swap-container">
          {/* Header */}
          <div className="battery-swap-header">
            <h2 className="battery-swap-title">
              <span>🔋</span>
              Quy trình đổi pin
            </h2>
            <button className="battery-swap-close-btn" onClick={handleFinish} disabled={isProcessing}>
              ×
            </button>
          </div>

          {/* Progress Bar */}
          <SwapProgressBar currentStep={currentStep} />

          {/* Content */}
          <div className="swap-content">{renderStepContent()}</div>

          {/* Actions */}
          <div className="swap-actions">
            {currentStep === 1 && !loading && (
              <>
                <button className="btn-swap btn-back" onClick={handleFinish}>
                  Hủy
                </button>
                <button
                  className="btn-swap btn-next"
                  onClick={handleNext}
                  disabled={!selectedStation}
                >
                  Tiếp tục →
                </button>
              </>
            )}

            {currentStep === 2 && !loadingTowers && (
              <>
                <button className="btn-swap btn-back" onClick={handleBack}>
                  ← Quay lại
                </button>
                <button className="btn-swap btn-next" onClick={handleNext} disabled={!selectedTower}>
                  Tiếp tục →
                </button>
              </>
            )}

            {currentStep === 3 && !loadingSlots && (
              <>
                <button className="btn-swap btn-back" onClick={handleBack}>
                  ← Quay lại
                </button>
                <button
                  className="btn-swap btn-next"
                  onClick={handleNext}
                  disabled={!selectedNewBatterySlot}
                >
                  Tiếp tục →
                </button>
              </>
            )}

            {currentStep === 4 && !loadingSlots && (
              <>
                <button className="btn-swap btn-back" onClick={handleBack}>
                  ← Quay lại
                </button>
                <button
                  className="btn-swap btn-next"
                  onClick={handleNext}
                  disabled={!selectedEmptySlot}
                >
                  Tiếp tục →
                </button>
              </>
            )}

            {currentStep === 5 && (
              <>
                <button className="btn-swap btn-back" onClick={handleBack}>
                  ← Quay lại
                </button>
                <button
                  className="btn-swap btn-confirm"
                  onClick={handleNext}
                >
                  ✓ Bắt đầu đổi pin
                </button>
              </>
            )}

            {/* Steps 6, 7, 8 - No action buttons (auto progress in components) */}
            {(currentStep === 6 || currentStep === 7 || currentStep === 8) && (
              <div style={{ width: '100%', textAlign: 'center', color: '#999', fontSize: '14px' }}>
                {currentStep === 6 && 'Đang đặt pin cũ vào trụ...'}
                {currentStep === 7 && 'Đang lấy pin mới...'}
                {currentStep === 8 && 'Đang lưu thông tin vào hệ thống...'}
              </div>
            )}

            {currentStep === 9 && (
              <button className="btn-swap btn-finish" onClick={handleFinish}>
                🏁 Hoàn tất
              </button>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        show={showQRPopup}
        currentStep={currentStep}
        currentUser={currentUser}
        selectedVehicle={selectedVehicle}
        selectedStation={selectedStation}
        selectedTower={selectedTower}
        userContract={userContract}
        currentBatteryLevel={currentBatteryLevel}
        swapResult={swapResult}
        onClose={() => setShowQRPopup(false)}
      />

      {/* Staff Assistance Modal */}
      <StaffAssistanceModal
        show={showStaffAssistanceModal}
        loading={assistanceLoading}
        success={assistanceSuccess}
        selectedStation={selectedStation}
        selectedVehicle={selectedVehicle}
        currentBatteryLevel={currentBatteryLevel}
        onConfirm={handleRequestStaffAssistance}
        onClose={() => {
          setShowStaffAssistanceModal(false);
          if (assistanceSuccess) {
            setAssistanceSuccess(false);
          }
        }}
      />
    </>
  );
};

export default SwapBatteryContainer;
