import React from 'react';

const EmptyPlans = () => {
  return (
    <div style={{
      textAlign: 'center', padding: '60px 20px',
      background: 'rgba(26, 32, 44, 0.5)', borderRadius: '16px',
      border: '1px dashed rgba(255, 255, 255, 0.2)',
    }}>
      <h3 style={{ margin: 0, color: 'white' }}>Hiện chưa có gói dịch vụ nào</h3>
      <p style={{ color: '#9aa4c7' }}>Vui lòng quay lại sau hoặc liên hệ hỗ trợ để biết thêm chi tiết.</p>
    </div>
  );
};

export default EmptyPlans;