import React, { useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useSwapData, useSwapSteps } from './hooks';

// Import các component giao diện
import {
  SwapProgressBar,
  StationSelector,
  SwapConfirmation,
  PlaceOldBattery,
  SwapProcessing,
  TakeNewBattery,
  SwapSuccess,
} from './components';

const DriverSwapBattery = () => {
  const { currentUser, selectedVehicle } = useAuth(); // Lấy cả xe đã chọn

  // --- SỬ DỤNG CÁC HOOK ---
  const {
    stations,
    towers,
    loading,
    loadingTowers,
    error,
    fetchInitialData,
    fetchTowersByStation,
    createSwap,
  } = useSwapData(currentUser);

  const {
    currentStep,
    selection,
    setSelection,
    nextStep,
    resetSelections,
  } = useSwapSteps();

  // Tải dữ liệu ban đầu (danh sách trạm)
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Gán thông tin xe đã chọn vào state của quy trình
  useEffect(() => {
    if (selectedVehicle) {
      setSelection(prev => ({ ...prev, vehicle: selectedVehicle }));
    }
  }, [selectedVehicle, setSelection]);

  // --- HÀM XỬ LÝ QUAN TRỌNG NHẤT ---
  // Hàm này được gọi mỗi khi người dùng chọn trạm hoặc trụ
  const handleSelectionUpdate = (data) => {
    setSelection((prev) => ({ ...prev, ...data }));
    
    // NẾU người dùng vừa chọn một trạm mới (có stationId),
    // HÃY gọi API để tải danh sách trụ của trạm đó.
    if (data.stationId) {
      fetchTowersByStation(data.stationId);
    }
  };

  const handleConfirmSwap = async () => {
    // ... logic xác nhận
  };

  const renderCurrentStepComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StationSelector
            stations={stations}
            towers={towers}
            isLoadingTowers={loadingTowers}
            onConfirm={nextStep}
            updateSelection={handleSelectionUpdate} // Truyền hàm xử lý này xuống
          />
        );
      // ... các case khác
      default:
        return <div>...</div>
    }
  };

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center' }}>Đang tải dữ liệu trạm...</div>;
  }
  if (error) {
    return <div style={{ color: 'red', textAlign: 'center' }}>Lỗi: {error}</div>;
  }

  return (
    <div className="swap-container">
      <h1 className="swap-header">Quy trình Đổi pin nhanh</h1>
      <SwapProgressBar currentStep={currentStep} totalSteps={6} />
      <div className="swap-box">{renderCurrentStepComponent()}</div>
    </div>
  );
};

export default DriverSwapBattery;