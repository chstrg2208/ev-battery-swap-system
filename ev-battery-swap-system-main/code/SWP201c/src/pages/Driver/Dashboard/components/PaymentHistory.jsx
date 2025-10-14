import React from 'react';

const PaymentHistory = ({ payments = [] }) => {
  return (
    <div style={{
      background: 'rgba(26, 32, 44, 0.8)', borderRadius: '15px', padding: '25px',
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Giao dịch gần đây</h3>
      <div>
        {payments.length > 0 ? payments.map((payment, index) => (
          <div key={payment.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '15px 0',
            borderBottom: index < payments.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
          }}>
            <div>
              <div style={{ fontWeight: '600' }}>{payment.type}</div>
              <div style={{ fontSize: '12px', color: '#9aa4c7' }}>{payment.date}</div>
            </div>
            <div style={{
              fontWeight: '700',
              color: payment.amount.startsWith('+') ? '#19c37d' : '#ff4757'
            }}>
              {payment.amount}
            </div>
          </div>
        )) : <p style={{ color: '#9aa4c7' }}>Chưa có giao dịch nào.</p>}
      </div>
    </div>
  );
};

export default PaymentHistory;