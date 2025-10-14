import React from 'react';

const SwapSuccess = ({ stationName }) => {
  return (
    <div className="success-container">
      <div className="success-icon">🎉</div>
      <h2 className="success-title">Đổi Pin Thành Công!</h2>
      <p className="success-message">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Chúc bạn một chuyến đi an toàn!</p>
      <div className="success-details">
        <div className="detail-row">
          <span className="detail-label">Trạm thực hiện:</span>
          <span className="detail-value">{stationName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Thời gian:</span>
          <span className="detail-value">{new Date().toLocaleString('vi-VN')}</span>
        </div>
      </div>
    </div>
  );
};
export default SwapSuccess;