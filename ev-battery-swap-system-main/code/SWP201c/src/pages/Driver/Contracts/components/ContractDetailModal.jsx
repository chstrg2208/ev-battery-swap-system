// src/pages/Driver/Contracts/components/ContractDetailModal.jsx

import React from 'react';

// CSS cho Modal
const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000 // Đảm bảo modal nằm trên cùng
};

const modalContentStyle = {
  background: 'white', padding: '24px', borderRadius: '8px',
  width: '90%', maxWidth: '600px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  position: 'relative'
};

const closeButtonStyle = {
  position: 'absolute', top: '10px', right: '15px',
  background: 'transparent', border: 'none',
  fontSize: '24px', cursor: 'pointer'
};

const ContractDetailModal = ({ isOpen, onClose, contract }) => {
  if (!isOpen || !contract) {
    return null;
  }

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={onClose}>&times;</button>
        <h2>Chi tiết: {contract.name}</h2>
        <hr />
        <p><strong>Mã hợp đồng:</strong> {contract.id}</p>
        <p><strong>Trạng thái:</strong> {contract.status === 'active' ? 'Còn hiệu lực' : 'Đã hết hạn'}</p>
        <p><strong>Phương tiện:</strong> {contract.vehicle}</p>
        <p><strong>Hiệu lực từ:</strong> {contract.startDate} <strong>đến</strong> {contract.endDate}</p>
        <p><strong>Nội dung:</strong> {contract.details}</p>
        <div style={{ textAlign: 'right', marginTop: '20px' }}>
            <button onClick={onClose} style={{ padding: '10px 20px' }}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default ContractDetailModal;