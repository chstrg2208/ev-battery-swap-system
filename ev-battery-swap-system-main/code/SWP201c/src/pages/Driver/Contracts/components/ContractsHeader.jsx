// src/pages/Driver/Contracts/components/ContractsHeader.jsx

import React from 'react';

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '2px solid #f0f0f0',
  paddingBottom: '16px'
};

const ContractsHeader = ({ contractCount }) => {
  return (
    <div style={headerStyle}>
      <h1 style={{ margin: 0 }}>Hợp đồng của tôi ({contractCount})</h1>
      <button
        style={{ padding: '10px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Lọc hợp đồng
      </button>
    </div>
  );
};

export default ContractsHeader;