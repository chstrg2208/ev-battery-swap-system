// src/pages/Driver/Dashboard/components/VehicleManagement.jsx
import React from 'react';
import SelectedVehicleDisplay from './SelectedVehicleDisplay';

// Trong tương lai, bạn sẽ quản lý state để mở modal chọn xe ở đây
const VehicleManagement = ({ vehicle }) => {
  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.5)', borderRadius: '16px',
      padding: '20px', border: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px'
    }}>
      <SelectedVehicleDisplay vehicle={vehicle} />
      <button style={{
        background: '#6ab7ff', border: 'none', color: 'white',
        padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
      }}>
        Đổi xe
      </button>
    </div>
  );
};

export default VehicleManagement;