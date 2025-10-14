import React from 'react';

const SwapProgressBar = ({ currentStep, totalSteps }) => {
  const steps = ['Chọn trạm', 'Xác nhận', 'Đặt pin cũ', 'Xử lý', 'Lấy pin mới', 'Hoàn tất'];
  
  return (
    <div style={{ display: 'flex', gap: '5px', padding: '10px 0' }}>
      {steps.slice(0, totalSteps).map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <div key={index} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ height: '8px', background: isActive ? '#6ab7ff' : '#4A5568', borderRadius: '4px', marginBottom: '8px', transition: 'background 0.3s' }}></div>
            <div style={{ fontSize: '12px', color: isActive ? 'white' : '#9aa4c7', fontWeight: isCurrent ? 'bold' : 'normal' }}>
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SwapProgressBar;