import React from 'react';

const IssueReportGrid = () => {
  const issues = [
    { icon: '🔋', label: 'Pin lỗi hoặc hết nhanh' },
    { icon: '🏢', label: 'Trạm sạc không hoạt động' },
    { icon: '💳', label: 'Vấn đề thanh toán' },
    { icon: '📱', label: 'Ứng dụng bị treo' },
    { icon: '❌', label: 'Không thể mở hộc pin' },
    { icon: '❓', label: 'Sự cố khác' },
  ];

  const issueButtonStyle = {
    background: 'rgba(30, 41, 59, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '25px', color: 'white',
    cursor: 'pointer', textAlign: 'center', fontSize: '16px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
  };

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px'
    }}>
      {issues.map(issue => (
        <button key={issue.label} style={issueButtonStyle}>
          <div style={{ fontSize: '32px' }}>{issue.icon}</div>
          <div>{issue.label}</div>
        </button>
      ))}
    </div>
  );
};

export default IssueReportGrid;