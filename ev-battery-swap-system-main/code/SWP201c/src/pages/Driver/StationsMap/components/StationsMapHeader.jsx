import React from 'react';

const StationsMapHeader = ({ onSearch }) => {
  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    background: 'rgba(30, 41, 59, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '16px',
    boxSizing: 'border-box',
  };

  return (
    <div>
      <h2 style={{ margin: '0 0 15px 0' }}>Tìm trạm đổi pin</h2>
      <input
        type="text"
        placeholder="Tìm theo tên, địa chỉ..."
        onChange={(e) => onSearch(e.target.value)}
        style={inputStyle}
      />
    </div>
  );
};

export default StationsMapHeader;