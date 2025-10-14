import React from 'react';

const StationCard = ({ station, onSelect }) => {
  const isAvailable = station.availableBateries > 0;

  return (
    <div
      onClick={() => onSelect(station)}
      style={{
        background: 'rgba(30, 41, 59, 0.5)',
        padding: '15px',
        borderRadius: '12px',
        borderLeft: `5px solid ${isAvailable ? '#19c37d' : '#ff4757'}`,
        marginBottom: '15px',
        cursor: 'pointer',
      }}
    >
      <div style={{ fontWeight: '600', color: 'white', marginBottom: '5px' }}>{station.name}</div>
      <div style={{ fontSize: '14px', color: '#9aa4c7', marginBottom: '10px' }}>{station.address}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
        <span style={{ color: isAvailable ? '#19c37d' : '#ff4757' }}>
          {isAvailable ? 'Sẵn sàng' : 'Hết pin'}
        </span>
        <span style={{ color: 'white' }}>
          Pin có sẵn: <strong>{station.availableBateries} / {station.totalSlots}</strong>
        </span>
      </div>
    </div>
  );
};

export default StationCard;