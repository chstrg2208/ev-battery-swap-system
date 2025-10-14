// Driver/Profile/components/ProfileDisplay.jsx
// Display mode for profile information (read-only)

import React from 'react';

// Giả sử bạn có hàm này trong thư mục utils, nếu chưa có hãy tạo nó.
// import { formatPhoneNumber } from '../utils';

// --- Bắt đầu phần code ---
const ProfileDisplay = ({ user }) => {
  const infoItemStyle = {
    marginBottom: '25px'
  };

  const labelStyle = {
    color: '#B0B0B0',
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const valueStyle = {
    color: '#FFFFFF',
    fontSize: '1.1rem',
    fontWeight: '500'
  };

  // Hàm format số điện thoại (tạm thời để ở đây nếu bạn chưa có)
  const formatPhoneNumber = (phone) => phone || '';

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '30px'
    }}>
      {/* Full Name */}
      <div style={infoItemStyle}>
        <div style={labelStyle}>Họ và tên</div>
        <div style={valueStyle}>
          {user?.fullName || user?.username || 'Chưa cập nhật'}
        </div>
      </div>

      {/* Email */}
      <div style={infoItemStyle}>
        <div style={labelStyle}>Email</div>
        <div style={valueStyle}>
          {user?.email || 'Chưa cập nhật'}
        </div>
      </div>

      {/* Phone */}
      <div style={infoItemStyle}>
        <div style={labelStyle}>Số điện thoại</div>
        <div style={valueStyle}>
          {user?.phone ? formatPhoneNumber(user.phone) : 'Chưa cập nhật'}
        </div>
      </div>

      {/* Address */}
      <div style={infoItemStyle}>
        <div style={labelStyle}>Địa chỉ</div>
        <div style={valueStyle}>
          {user?.address || 'Chưa cập nhật'}
        </div>
      </div>
    </div>
  );
};

// <-- SỬA LỖI: Thêm dòng "export default" vào cuối file
export default ProfileDisplay;