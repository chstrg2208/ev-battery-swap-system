import React from 'react';

const PlanCard = ({ plan, isCurrent }) => {
  const cardStyle = {
    background: 'rgba(30, 41, 59, 0.8)',
    borderRadius: '16px',
    padding: '30px',
    border: `2px solid ${isCurrent ? '#6ab7ff' : 'rgba(255, 255, 255, 0.1)'}`,
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  };

  const featureListStyle = {
    listStyle: 'none',
    padding: 0,
    margin: '20px 0',
    flexGrow: 1,
    textAlign: 'left',
  };

  const featureItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
    color: '#bdc3c7',
  };

  const buttonStyle = {
    background: isCurrent ? '#4A5568' : '#6ab7ff',
    border: 'none',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    cursor: isCurrent ? 'default' : 'pointer',
    fontWeight: '600',
    fontSize: '16px',
    width: '100%',
    marginTop: 'auto',
  };

  return (
    <div style={cardStyle}>
      <h3 style={{ marginTop: 0, color: isCurrent ? '#6ab7ff' : 'white', fontSize: '22px' }}>{plan.name}</h3>
      <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
        {new Intl.NumberFormat('vi-VN').format(plan.price)}
        <span style={{ fontSize: '16px', color: '#9aa4c7' }}> / tháng</span>
      </div>

      <ul style={featureListStyle}>
        {plan.features.map((feature, index) => (
          <li key={index} style={featureItemStyle}>
            <span>✅</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button style={buttonStyle} disabled={isCurrent}>
        {isCurrent ? 'Gói hiện tại' : 'Chọn gói này'}
      </button>
    </div>
  );
};

export default PlanCard;