import React from 'react';

const TakeNewBattery = ({ selection, onConfirm }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ marginTop: 0 }}>Bước 5: Lấy pin mới</h3>
      <p style={{ color: '#9aa4c7', fontSize: '16px' }}>Hộc pin số</p>
      <div style={{ color: '#19c37d', fontSize: '48px', fontWeight: 'bold', margin: '10px 0', border: '2px solid #19c37d', borderRadius: '12px', padding: '15px' }}>
        {selection.newBatterySlot}
      </div>
      <p style={{ color: '#9aa4c7', fontSize: '16px' }}>đã được mở. Vui lòng lấy pin mới và đóng nắp lại.</p>
      <button onClick={onConfirm} style={{ marginTop: '20px', width: '100%', background: '#19c37d', border: 'none', color: 'white', padding: '15px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
        Hoàn tất
      </button>
    </div>
  );
};

export default TakeNewBattery;