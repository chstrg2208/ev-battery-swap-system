import React from 'react';

const SwapProcessing = () => {
  return (
    <div style={{ textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <div style={{ fontSize: '48px' }}>🔄</div> 
      <h3 style={{ marginTop: '0' }}>Đang kiểm tra pin...</h3>
      <p style={{ color: '#9aa4c7', margin: 0 }}>
        Hệ thống đang xác thực pin cũ và chuẩn bị pin mới. Vui lòng chờ...
      </p>
    </div>
  );
};

export default SwapProcessing;