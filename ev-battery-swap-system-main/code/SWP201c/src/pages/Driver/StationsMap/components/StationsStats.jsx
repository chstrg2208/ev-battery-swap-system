import React from 'react';

const StationsStats = ({ count }) => {
  return (
    <div style={{
      padding: '15px 0',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      margin: '20px 0',
      color: '#9aa4c7',
    }}>
      Tìm thấy <strong style={{ color: 'white' }}>{count}</strong> trạm phù hợp.
    </div>
  );
};

export default StationsStats;