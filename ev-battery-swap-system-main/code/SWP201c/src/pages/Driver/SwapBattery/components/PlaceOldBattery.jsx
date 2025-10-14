import React, { useEffect } from 'react';

const PlaceOldBattery = ({ onConfirm, updateSelection }) => {
  const emptySlot = 'B02'; 
  useEffect(() => {
    updateSelection({ oldBatterySlot: emptySlot });
  }, [updateSelection, emptySlot]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ marginTop: 0 }}>Bước 3: Đặt pin cũ vào hộc</h3>
      <p style={{ color: '#9aa4c7', fontSize: '16px' }}>Hộc pin số</p>
      <div style={{ color: '#ffa500', fontSize: '48px', fontWeight: 'bold', margin: '10px 0', border: '2px solid #ffa500', borderRadius: '12px', padding: '15px' }}>
        {emptySlot}
      </div>
      <p style={{ color: '#9aa4c7', fontSize: '16px' }}>đã được mở. Vui lòng đặt pin cũ của bạn vào và đóng nắp lại.</p>
      <button onClick={onConfirm} style={{ marginTop: '20px', width: '100%', background: '#19c37d', border: 'none', color: 'white', padding: '15px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
        Tôi đã đặt pin vào
      </button>
    </div>
  );
};

export default PlaceOldBattery;