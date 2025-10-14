import React from 'react';

const SwapSuccess = ({ onReset }) => {
  return (
    <div className="success-container">
      <div className="success-icon">✅</div>
      <h3 style={{ marginTop: '10px', color: '#19c37d', fontSize: '24px' }}>
        Đổi pin thành công!
      </h3>
      <p style={{ color: '#9aa4c7', margin: '10px 0 30px 0' }}>
        Cảm ơn bạn đã sử dụng dịch vụ. Chúc bạn một chuyến đi an toàn!
      </p>
      <button onClick={onReset} className="btn btn-primary">
        Thực hiện đổi pin khác
      </button>
    </div>
  );
};

export default SwapSuccess;