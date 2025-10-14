import React from 'react';

// Component này chỉ dùng cho mục đích phát triển (debugging)
const DebugInfo = ({ data }) => {
  // Chỉ render component nếu đang ở môi trường development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      background: '#111',
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '15px',
      marginTop: '40px',
      fontFamily: 'monospace',
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#ffc107', textTransform: 'uppercase' }}>
        🐞 Debug Info
      </h4>
      <pre style={{
        color: '#eee',
        background: '#222',
        padding: '10px',
        borderRadius: '5px',
        whiteSpace: 'pre-wrap', // Giúp xuống dòng tự động
        wordBreak: 'break-all', // Ngắt từ nếu quá dài
        fontSize: '12px'
      }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default DebugInfo;