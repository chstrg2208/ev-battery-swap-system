import React, { useState } from 'react';

// Import tất cả các component con cần thiết cho quy trình
import SwapProgressBar from './components/SwapProgressBar';
import StationSelector from './components/StationSelector';
import SwapConfirmation from './components/SwapConfirmation';
import PlaceOldBattery from './components/PlaceOldBattery';
import SwapProcessing from './components/SwapProcessing';
import TakeNewBattery from './components/TakeNewBattery';
import SwapSuccess from './components/SwapSuccess';
import StaffAssistanceButton from './components/StaffAssistanceButton';
// import QRCodeModal from './components/QRCodeModal'; // Bỏ comment nếu bạn muốn dùng
// import StaffAssistanceModal from './components/StaffAssistanceModal'; // Bỏ comment nếu bạn muốn dùng

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
  // State quản lý bước hiện tại. Bắt đầu từ bước 1.
  const [currentStep, setCurrentStep] = useState(1);
  
  // State lưu trữ tất cả thông tin người dùng chọn hoặc hệ thống trả về
  const [selection, setSelection] = useState({
    vehicle: { id: 'V01', name: 'Vinfast VF8 - 51K-123.45' }, // Giả sử đã có thông tin xe
    station: null,
    tower: null,
    oldBatterySlot: null,
    newBatterySlot: null,
  });

  // === CÁC HÀM XỬ LÝ ===
  // Hàm cập nhật dữ liệu lựa chọn
  const updateSelection = (data) => {
    setSelection(prev => ({ ...prev, ...data }));
  };

  // Hàm chuyển sang bước tiếp theo
  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  // Hàm quay về bước đầu tiên
  const handleReset = () => {
    setCurrentStep(1);
    setSelection(prev => ({ ...prev, station: null, tower: null, oldBatterySlot: null, newBatterySlot: null }));
  };

  // Hàm giả lập quá trình kiểm tra pin cũ và trả về pin mới
  const processBatterySwap = () => {
    handleNextStep(); // Chuyển sang màn hình "Đang xử lý" (Bước 4)
    
    setTimeout(() => {
      // Giả lập API trả về hộc pin mới
      updateSelection({ newBatterySlot: 'A05' }); 
      handleNextStep(); // Chuyển sang bước lấy pin mới (Bước 5)
    }, 3000); // Giả lập thời gian kiểm tra 3 giây
  };

  // === LOGIC HIỂN THỊ COMPONENT TƯƠNG ỨNG ===
  const renderCurrentStepComponent = () => {
    switch (currentStep) {
      case 1: // Chọn trạm, trụ
        return <StationSelector 
                  stations={mockStations} 
                  towers={mockTowers} 
                  onConfirm={handleNextStep} 
                  updateSelection={updateSelection} 
                />;
      case 2: // Xác nhận
        return <SwapConfirmation 
                  selection={selection} 
                  onConfirm={handleNextStep} 
                />;
      case 3: // Đặt pin cũ vào
        return <PlaceOldBattery 
                  onConfirm={processBatterySwap} 
                  updateSelection={updateSelection} 
                />;
      case 4: // Xử lý/Kiểm tra pin
        return <SwapProcessing />;
      case 5: // Lấy pin mới ra
        return <TakeNewBattery 
                  selection={selection} 
                  onConfirm={handleNextStep} 
                />;
      case 6: // Hoàn thành
        return <SwapSuccess onReset={handleReset} />;
      default:
        return <div>Lỗi: Bước không xác định.</div>;
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Quy trình Đổi pin nhanh</h1>
      
      {/* Thanh tiến trình luôn hiển thị */}
      <SwapProgressBar currentStep={currentStep} totalSteps={6} />
      
      {/* Khung chứa component của bước hiện tại */}
      <div style={{ marginTop: '30px', padding: '30px', background: 'rgba(26, 32, 44, 0.8)', borderRadius: '16px' }}>
        {renderCurrentStepComponent()}
      </div>
      
      {/* Nút hỗ trợ sẽ ẩn đi ở bước cuối cùng */}
      {currentStep < 6 && <StaffAssistanceButton />}

      {/* Các Modal sẽ được quản lý bằng state riêng, ví dụ:
        <QRCodeModal isOpen={isQRModalOpen} onClose={() => setQRModalOpen(false)} />
      */}
    </div>
  );
};

export default DriverSwapBattery;