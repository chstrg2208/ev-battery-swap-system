import React from 'react';

const DebugInfo = ({ data }) => {
  return (
    <div style={{
      background: '#111', border: '1px solid #333',
      borderRadius: '8px', padding: '15px', marginTop: '30px'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#ffc107' }}>Debug Info</h4>
      <pre style={{
        color: '#eee', background: '#222', padding: '10px',
        borderRadius: '5px', whiteSpace: 'pre-wrap', wordBreak: 'break-all'
      }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default DebugInfo;