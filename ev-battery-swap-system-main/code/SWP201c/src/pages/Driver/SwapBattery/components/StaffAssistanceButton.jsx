import React from 'react';

const StaffAssistanceButton = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <button style={{
        background: 'none',
        border: '1px solid #ffa500',
        color: '#ffa500',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
      }}>
         gặp sự cố? Yêu cầu nhân viên hỗ trợ
      </button>
    </div>
  );
};

export default StaffAssistanceButton;