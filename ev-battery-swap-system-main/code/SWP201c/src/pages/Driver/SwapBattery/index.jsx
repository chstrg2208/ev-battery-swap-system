import React, { useState } from 'react';

// Import tất cả các component con cần thiết
import SwapProgressBar from './components/SwapProgressBar';
import StationSelector from './components/StationSelector';
import SwapConfirmation from './components/SwapConfirmation';
import PlaceOldBattery from './components/PlaceOldBattery';
import SwapProcessing from './components/SwapProcessing';
import TakeNewBattery from './components/TakeNewBattery';
import SwapSuccess from './components/SwapSuccess';
import StaffAssistanceButton from './components/StaffAssistanceButton';
import StaffAssistanceModal from './components/StaffAssistanceModal';

// Dữ liệu giả, sau này sẽ lấy từ API
const mockStations = [
  { id: 'ST01', name: 'Trạm Vincom Thủ Đức' },
  { id: 'ST02', name: 'Trạm Giga Mall' },
  { id: 'ST03', name: 'Trạm Emart Gò Vấp' },
];
const mockTowers = [
  { id: 'T01', stationId: 'ST01', name: 'Trụ sạc 1' },
  { id: 'T02', stationId: 'ST01', name: 'Trụ sạc 2' },
  { id: 'T03', stationId: 'ST02', name: 'Trụ sạc A' },
  { id: 'T04', stationId: 'ST03', name: 'Trụ sạc X' },
  { id: 'T05', stationId: 'ST03', name: 'Trụ sạc Y' },
];

const DriverSwapBattery = () => {
  // === STATE QUẢN LÝ QUY TRÌNH ===
  const [currentStep, setCurrentStep] = useState(1);
  const [selection, setSelection] = useState({
    vehicle: { id: 'V01', name: 'Vinfast VF8 - 51K-123.45' },
    station: null,
    tower: null,
    oldBatterySlot: null,
    newBatterySlot: null,
  });
  const [isAssistanceModalOpen, setAssistanceModalOpen] = useState(false);

  // === CÁC HÀM XỬ LÝ ===
  const updateSelection = (data) => {
    setSelection(prev => ({ ...prev, ...data }));
  };

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelection(prev => ({ ...prev, station: null, tower: null, oldBatterySlot: null, newBatterySlot: null }));
  };

  const processBatterySwap = () => {
    handleNextStep(); // Chuyển sang màn hình "Đang xử lý" (Bước 4)
    setTimeout(() => {
      updateSelection({ newBatterySlot: 'A05' }); 
      handleNextStep(); // Chuyển sang bước lấy pin mới (Bước 5)
    }, 3000);
  };

  // === LOGIC HIỂN THỊ COMPONENT TƯƠNG ỨNG ===
  const renderCurrentStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <StationSelector 
                  stations={mockStations} 
                  towers={mockTowers} 
                  onConfirm={handleNextStep} 
                  updateSelection={updateSelection} 
                />;
      case 2:
        return <SwapConfirmation 
                  selection={selection} 
                  onConfirm={handleNextStep} 
                />;
      case 3:
        return <PlaceOldBattery 
                  onConfirm={processBatterySwap} 
                  updateSelection={updateSelection} 
                />;
      case 4:
        return <SwapProcessing />;
      case 5:
        return <TakeNewBattery 
                  selection={selection} 
                  onConfirm={handleNextStep} 
                />;
      case 6:
        return <SwapSuccess onReset={handleReset} />;
      default:
        return <div>Lỗi: Bước không xác định.</div>;
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Quy trình Đổi pin nhanh</h1>
      <SwapProgressBar currentStep={currentStep} totalSteps={6} />
      
      <div style={{ marginTop: '30px', padding: '30px', background: 'rgba(26, 32, 44, 0.8)', borderRadius: '16px' }}>
        {renderCurrentStepComponent()}
      </div>
      
      {currentStep < 6 && <StaffAssistanceButton onClick={() => setAssistanceModalOpen(true)} />}

      <StaffAssistanceModal 
        isOpen={isAssistanceModalOpen} 
        onClose={() => setAssistanceModalOpen(false)} 
      />
    </div>
  );
};

export default DriverSwapBattery;