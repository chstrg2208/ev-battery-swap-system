import React from 'react';

const StaffAssistanceModal = ({ isOpen, onClose }) => {
  // Nếu modal không được mở, không render gì cả
  if (!isOpen) {
    return null;
  }

  // Styles
  const overlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
  };

  const modalStyle = {
    background: '#1a202c', color: 'white',
    borderRadius: '16px', padding: '30px',
    width: '90%', maxWidth: '450px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
  };

  const contactButtonStyle = {
    display: 'block', width: '100%',
    padding: '15px', margin: '10px 0',
    borderRadius: '8px', border: 'none',
    fontSize: '16px', fontWeight: '600',
    cursor: 'pointer', textDecoration: 'none',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: '48px' }}>💬</div>
        <h3 style={{ marginTop: '10px' }}>Yêu cầu Hỗ trợ</h3>
        <p style={{ color: '#9aa4c7', marginBottom: '30px' }}>
          Nếu bạn gặp sự cố, vui lòng liên hệ với nhân viên hỗ trợ qua các kênh dưới đây:
        </p>
        
        {/* Các nút hành động */}
        <a href="tel:19001234" style={{...contactButtonStyle, background: '#19c37d', color: 'white' }}>
          Gọi Hotline (1900 1234)
        </a>
        <a href="https://zalo.me/your_zalo_number" target="_blank" rel="noopener noreferrer" style={{...contactButtonStyle, background: '#6ab7ff', color: 'white' }}>
          Nhắn tin Zalo
        </a>
        
        <button
          onClick={onClose}
          style={{
            ...contactButtonStyle,
            background: '#4A5568',
            color: '#CBD5E0',
            marginTop: '20px',
          }}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default StaffAssistanceModal;