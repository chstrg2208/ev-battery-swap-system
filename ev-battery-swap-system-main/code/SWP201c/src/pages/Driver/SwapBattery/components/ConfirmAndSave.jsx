// Confirm and Save to Database Component - Step 8
import React, { useState, useEffect } from 'react';

const ConfirmAndSave = ({
  selectedStation,
  selectedTower,
  selectedNewBatterySlot,
  selectedEmptySlot,
  currentBatteryLevel,
  onComplete
}) => {
  const [saving, setSaving] = useState(true);
  const [progress, setProgress] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Simulate saving to database
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setSaving(false);
          setSaveSuccess(true);
          
          // Auto complete after 2 seconds
          setTimeout(() => {
            onComplete();
          }, 2000);
          
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  const newBatteryLevel = selectedNewBatterySlot?.batteryLevel || 100;

  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      {saving ? (
        // Saving state
        <>
          <div className="loading-spinner" style={{ margin: '0 auto 32px auto' }}></div>
          
          <h3
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#333',
              marginBottom: '16px'
            }}
          >
            Đang lưu thông tin...
          </h3>

          <p style={{ fontSize: '15px', color: '#666', marginBottom: '32px' }}>
            Hệ thống đang xác nhận và lưu giao dịch đổi pin vào cơ sở dữ liệu
          </p>

          {/* Progress bar */}
          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                width: '100%',
                maxWidth: '400px',
                height: '8px',
                background: '#e0e0e0',
                borderRadius: '4px',
                overflow: 'hidden',
                margin: '0 auto 12px auto'
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #667eea, #764ba2)',
                  transition: 'width 0.3s ease',
                  borderRadius: '4px'
                }}
              />
            </div>
            <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
              {progress}% hoàn thành
            </p>
          </div>

          {/* Saving steps */}
          <div
            style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '12px',
              maxWidth: '400px',
              margin: '0 auto',
              textAlign: 'left'
            }}
          >
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
              {progress >= 20 ? '✅' : '⏳'} Xác nhận thông tin xe và pin...
            </p>
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
              {progress >= 40 ? '✅' : '⏳'} Cập nhật trạng thái slot...
            </p>
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
              {progress >= 60 ? '✅' : '⏳'} Lưu thông tin giao dịch...
            </p>
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
              {progress >= 80 ? '✅' : '⏳'} Cập nhật lịch sử đổi pin...
            </p>
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
              {progress >= 100 ? '✅' : '⏳'} Hoàn tất!
            </p>
          </div>
        </>
      ) : saveSuccess ? (
        // Success state
        <>
          <div style={{ fontSize: '80px', marginBottom: '24px' }}>✅</div>
          
          <h3
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#4caf50',
              marginBottom: '16px'
            }}
          >
            Lưu thành công!
          </h3>

          <p style={{ fontSize: '15px', color: '#666', marginBottom: '32px' }}>
            Giao dịch đổi pin đã được lưu vào hệ thống
          </p>

          {/* Transaction summary */}
          <div
            style={{
              background: '#e8f5e9',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '32px',
              maxWidth: '500px',
              margin: '0 auto',
              border: '2px solid #c8e6c9'
            }}
          >
            <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#2e7d32' }}>
              📋 Thông tin giao dịch:
            </h4>
            <div style={{ textAlign: 'left', fontSize: '14px', color: '#2e7d32' }}>
              <p style={{ margin: '8px 0' }}>
                📍 <strong>Trạm:</strong> {selectedStation?.name}
              </p>
              <p style={{ margin: '8px 0' }}>
                🔌 <strong>Trụ:</strong> Trụ {selectedTower?.towerNumber}
              </p>
              <p style={{ margin: '8px 0' }}>
                🔋 <strong>Pin cũ:</strong> {currentBatteryLevel}% → Slot {selectedEmptySlot?.slotNumber}
              </p>
              <p style={{ margin: '8px 0' }}>
                ⚡ <strong>Pin mới:</strong> {newBatteryLevel}% ← Slot {selectedNewBatterySlot?.slotNumber}
              </p>
              <p style={{ margin: '8px 0' }}>
                ⏰ <strong>Thời gian:</strong> {new Date().toLocaleString('vi-VN')}
              </p>
            </div>
          </div>

          <p style={{ fontSize: '14px', color: '#666' }}>
            Đang chuyển đến màn hình hoàn tất...
          </p>
        </>
      ) : null}
    </div>
  );
};

export default ConfirmAndSave;
