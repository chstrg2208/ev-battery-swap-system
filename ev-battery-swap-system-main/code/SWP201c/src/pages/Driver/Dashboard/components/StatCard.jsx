import React from 'react';

// Component này chỉ lo việc hiển thị MỘT thẻ
const StatCard = ({ icon, label, value, color, valueColor, fontSize = '1.5rem' }) => {
  return (
    <div style={{
      background: 'rgba(26, 32, 44, 0.8)',
      borderRadius: '15px',
      padding: '25px',
      border: `1px solid ${color}`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{icon}</div>
      <div>
        <div style={{
          color: valueColor,
          fontSize: fontSize,
          fontWeight: '700',
          marginBottom: '5px',
          lineHeight: 1.2,
          wordBreak: 'break-word'
        }}>
          {value}
        </div>
        <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>{label}</div>
      </div>
    </div>
  );
};

export default StatCard;