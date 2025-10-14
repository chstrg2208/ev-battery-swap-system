import React from 'react';

const PaymentDetailModal = ({ payment, onClose }) => {
  if (!payment) return null;

  const isIncome = payment.amount > 0;
  const formattedAmount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payment.amount);

  // Styles
  const overlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  };
  const modalStyle = {
    background: '#1a202c', color: 'white', borderRadius: '16px',
    padding: '30px', width: '90%', maxWidth: '500px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };
  const detailRowStyle = {
    display: 'flex', justifyContent: 'space-between',
    padding: '12px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <h3 style={{ marginTop: 0, textAlign: 'center' }}>Chi tiết giao dịch</h3>
        <div style={{...detailRowStyle, flexDirection: 'column', alignItems: 'center', border: 'none'}}>
           <div style={{ fontSize: '28px', fontWeight: 'bold', color: isIncome ? '#19c37d' : '#ff4757' }}>{formattedAmount}</div>
           <div style={{ background: isIncome ? '#19c37d' : '#ff4757', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', marginTop: '10px' }}>
              {payment.status === 'COMPLETED' ? 'THÀNH CÔNG' : 'THẤT BẠI'}
           </div>
        </div>

        <div style={detailRowStyle}>
          <span style={{ color: '#9aa4c7' }}>Mã giao dịch</span>
          <span style={{ fontWeight: '600' }}>{payment.id}</span>
        </div>
        <div style={detailRowStyle}>
          <span style={{ color: '#9aa4c7' }}>Nội dung</span>
          <span style={{ fontWeight: '600' }}>{payment.description}</span>
        </div>
        <div style={detailRowStyle}>
          <span style={{ color: '#9aa4c7' }}>Thời gian</span>
          <span style={{ fontWeight: '600' }}>{payment.date}</span>
        </div>
        <div style={{...detailRowStyle, border: 'none'}}>
          <span style={{ color: '#9aa4c7' }}>Phương thức</span>
          <span style={{ fontWeight: '600' }}>{payment.method}</span>
        </div>
        
        <button onClick={onClose} style={{
          width: '100%', marginTop: '30px', background: '#6ab7ff', border: 'none',
          color: 'white', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px'
        }}>
          Đóng
        </button>
      </div>
    </div>
  );
};

export default PaymentDetailModal;