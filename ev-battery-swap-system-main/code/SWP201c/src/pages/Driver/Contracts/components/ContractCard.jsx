// src/pages/Driver/Contracts/components/ContractCard.jsx

import React from 'react';

const cardStyle = {
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  padding: '16px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  backgroundColor: 'white',
  transition: 'transform 0.2s',
};

// Hàm để lấy màu dựa trên trạng thái
const getStatusBadge = (status) => {
  const styles = {
    padding: '4px 8px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
  };
  if (status === 'active') {
    return { ...styles, backgroundColor: '#28a745' }; // Xanh lá
  }
  if (status === 'expired') {
    return { ...styles, backgroundColor: '#dc3545' }; // Đỏ
  }
  return { ...styles, backgroundColor: '#ffc107', color: 'black' }; // Vàng
};

const ContractCard = ({ contract, onViewDetails }) => {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>{contract.name}</h3>
        <span style={getStatusBadge(contract.status)}>
          {contract.status === 'active' ? 'Còn hiệu lực' : 'Đã hết hạn'}
        </span>
      </div>
      <p style={{ margin: '4px 0' }}><strong>Phương tiện:</strong> {contract.vehicle}</p>
      <p style={{ margin: '4px 0' }}><strong>Ngày bắt đầu:</strong> {contract.startDate}</p>
      <button
        onClick={() => onViewDetails(contract)} // Gọi hàm từ props khi click
        style={{ marginTop: '12px', padding: '8px 12px', width: '100%', cursor: 'pointer' }}
      >
        Xem chi tiết
      </button>
    </div>
  );
};

export default ContractCard;