import React from 'react';

const QuickActions = () => {
  const actions = [
    { icon: '🗺️', label: 'Tìm trạm gần nhất' },
    { icon: '💎', label: 'Nâng cấp gói' },
    { icon: '❓', label: 'Yêu cầu hỗ trợ' },
    { icon: '💳', label: 'Nạp tiền' },
  ];

  const actionButtonStyle = {
    background: 'rgba(30, 41, 59, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '20px',
    color: 'white',
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '14px',
  };

  return (
    <div style={{
      background: 'rgba(26, 32, 44, 0.8)', borderRadius: '15px', padding: '25px',
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Hành động nhanh</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
        {actions.map(action => (
          <button key={action.label} style={actionButtonStyle}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>{action.icon}</div>
            <div>{action.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;