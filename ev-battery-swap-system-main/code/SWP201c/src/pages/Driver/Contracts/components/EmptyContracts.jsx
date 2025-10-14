// src/pages/Driver/Contracts/components/EmptyContracts.jsx

import React from 'react';

const emptyStyle = {
  border: '2px dashed #ccc',
  borderRadius: '8px',
  padding: '40px',
  textAlign: 'center',
  backgroundColor: '#f9f9f9'
};

const EmptyContracts = () => {
  return (
    <div style={emptyStyle}>
      <h2>Không tìm thấy hợp đồng nào</h2>
      <p>Hiện tại bạn chưa có hợp đồng nào được ghi nhận trên hệ thống.</p>
    </div>
  );
};

export default EmptyContracts;