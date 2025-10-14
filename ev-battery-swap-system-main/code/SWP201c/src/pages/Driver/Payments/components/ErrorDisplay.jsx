import React from 'react';

const ErrorDisplay = ({ message, onRetry }) => {
  const containerStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'rgba(255, 71, 87, 0.1)', // Màu nền đỏ nhạt
    borderRadius: '16px',
    border: '1px solid rgba(255, 71, 87, 0.3)',
  };

  const iconStyle = {
    fontSize: '48px',
    marginBottom: '20px',
  };

  const textStyle = {
    color: '#ff4757', // Màu chữ đỏ
  };

  const buttonStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    background: '#ff4757',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
  };

  return (
    <div style={containerStyle}>
      <div style={iconStyle}>⚠️</div>
      <h3 style={{ margin: '0 0 10px 0', color: 'white' }}>
        Đã xảy ra lỗi
      </h3>
      <p style={textStyle}>
        {message || 'Không thể tải dữ liệu thanh toán. Vui lòng kiểm tra lại kết nối.'}
      </p>
      {onRetry && (
        <button onClick={onRetry} style={buttonStyle}>
          Thử lại
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;