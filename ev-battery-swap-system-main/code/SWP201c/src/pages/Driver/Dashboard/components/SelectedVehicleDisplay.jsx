// src/pages/Driver/Dashboard/components/SelectedVehicleDisplay.jsx
import React from 'react';

const SelectedVehicleDisplay = ({ vehicle }) => {
  if (!vehicle) return <div>Chưa chọn xe</div>;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <img
        src={vehicle.imageUrl || 'https://via.placeholder.com/80'}
        alt={vehicle.name}
        style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }}
      />
      <div>
        <div style={{ fontSize: '16px', fontWeight: '600' }}>{vehicle.name}</div>
        <div style={{ color: '#9aa4c7', fontSize: '14px' }}>{vehicle.plate}</div>
      </div>
    </div>
  );
};

export default SelectedVehicleDisplay;