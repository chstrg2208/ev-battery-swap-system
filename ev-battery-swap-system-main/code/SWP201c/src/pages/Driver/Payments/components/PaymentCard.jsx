import React from 'react';

const PaymentCard = ({ payment, onViewDetails }) => {
  const isIncome = payment.amount > 0;
  const amountColor = isIncome ? '#19c37d' : '#ff4757';
  const formattedAmount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payment.amount);

  return (
    <div
      onClick={() => onViewDetails(payment)}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(30, 41, 59, 0.5)',
        padding: '20px',
        borderRadius: '12px',
        borderLeft: `5px solid ${amountColor}`,
        marginBottom: '15px',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ fontSize: '24px' }}>{isIncome ? '📥' : '📤'}</div>
        <div>
          <div style={{ fontWeight: '600', color: 'white' }}>{payment.description}</div>
          <div style={{ fontSize: '14px', color: '#9aa4c7' }}>{payment.date}</div>
        </div>
      </div>
      <div style={{ fontWeight: '700', color: amountColor, fontSize: '18px' }}>
        {formattedAmount}
      </div>
    </div>
  );
};

export default PaymentCard;