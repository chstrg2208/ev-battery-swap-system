import React from 'react';

const SupportTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ['Câu hỏi thường gặp', 'Báo cáo sự cố', 'Liên hệ trực tiếp'];

  const tabStyle = (isActive) => ({
    padding: '12px 20px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    borderBottom: `3px solid ${isActive ? '#6ab7ff' : 'transparent'}`,
    color: isActive ? '#6ab7ff' : '#9aa4c7',
    fontWeight: isActive ? '600' : '500',
    fontSize: '16px',
    flex: 1, // Để các tab chia đều không gian
  });

  return (
    <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '30px' }}>
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          style={tabStyle(activeTab === tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default SupportTabs;