import React from 'react';

const SwapConfirmation = ({ selection, onConfirm }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ marginTop: 0 }}>Bước 2: Xác nhận thông tin</h3>
      <div style={{
        color: '#bdc3c7',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        textAlign: 'left',
        background: 'rgba(30, 41, 59, 0.5)',
        padding: '20px',
        borderRadius: '12px'
      }}>
        {/* Sử dụng optional chaining (?.) để đảm bảo code không bị lỗi nếu thiếu dữ liệu */}
        <p style={{margin: 0}}><strong>Phương tiện:</strong> {selection?.vehicle?.name || 'Chưa xác định'}</p>
        <p style={{margin: 0}}><strong>Tại trạm:</strong> {selection?.stationName || 'Chưa chọn'}</p>
        <p style={{margin: 0}}><strong>Tại trụ:</strong> {selection?.towerName || 'Chưa chọn'}</p>
        
        <p style={{margin: '15px 0 0 0', color: 'white'}}>Vui lòng xác nhận để hệ thống tạo phiên đổi pin và mở hộc pin trống.</p>
      </div>
      <button 
        onClick={onConfirm} 
        style={{ 
          marginTop: '30px', 
          width: '100%', 
          background: '#19c37d', 
          border: 'none', 
          color: 'white', 
          padding: '15px', 
          borderRadius: '8px', 
          cursor: 'pointer', 
          fontSize: '16px', 
          fontWeight: 'bold' 
        }}
      >
        Xác nhận và Mở hộc pin
      </button>
    </div>
  );
};

export default SwapConfirmation;