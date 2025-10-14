import React from 'react';

const VehicleCard = ({ vehicle, onSelect }) => {
  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.8)',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <img
        src={vehicle.imageUrl}
        alt={vehicle.name}
        style={{ width: '100%', height: '150px', objectFit: 'contain', marginBottom: '20px' }}
      />
      <h3 style={{ margin: '0 0 5px 0' }}>{vehicle.name}</h3>
      <p style={{ color: '#9aa4c7', margin: '0 0 20px 0', flexGrow: 1 }}>
        Biển số: {vehicle.plate}
      </p>
      
      <button
        onClick={() => onSelect(vehicle)}
        style={{
          background: '#19c37d',
          border: 'none',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '16px',
          marginTop: 'auto' // Đẩy nút xuống dưới cùng
        }}
      >
        Chọn xe này
      </button>
    </div>
  );
};

export default VehicleCard;