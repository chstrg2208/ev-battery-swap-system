import React from 'react';
import { useAuth } from '../../../../context/AuthContext'; // Điều chỉnh đường dẫn nếu cần

const WelcomeHeader = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', fontWeight: '600' }}>
        Chào mừng trở lại, {currentUser?.name || 'Tài xế'}!
      </h1>
      <p style={{ margin: 0, color: '#9aa4c7' }}>
        Đây là tổng quan nhanh về hoạt động của bạn.
      </p>
    </div>
  );
};

export default WelcomeHeader;