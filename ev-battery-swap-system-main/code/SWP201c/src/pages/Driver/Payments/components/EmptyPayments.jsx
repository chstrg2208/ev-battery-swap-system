import React from 'react';

const EmptyPayments = () => {
  const containerStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'rgba(26, 32, 44, 0.5)',
    borderRadius: '16px',
    border: '1px dashed rgba(255, 255, 255, 0.2)',
  };

  const iconStyle = {
    fontSize: '48px',
    marginBottom: '20px',
  };

  const textStyle = {
    color: '#9aa4c7',
  };

  return (
    <div style={containerStyle}>
      <div style={iconStyle}>📂</div>
      <h3 style={{ margin: '0 0 10px 0', color: 'white' }}>
        Chưa có giao dịch nào
      </h3>
      <p style={textStyle}>
        Tất cả các giao dịch nạp tiền và thanh toán của bạn sẽ được hiển thị ở đây.
      </p>
    </div>
  );
};

export default EmptyPayments;