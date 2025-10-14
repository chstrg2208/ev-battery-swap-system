import React from 'react';

const ProfileFormActions = ({ onSave }) => {
  return (
    <div style={{ marginTop: '30px' }}>
      <button onClick={onSave} style={{
        width: '100%', background: '#19c37d', border: 'none', color: 'white',
        padding: '15px', borderRadius: '8px', cursor: 'pointer',
        fontWeight: '600', fontSize: '16px'
      }}>
        Lưu thay đổi
      </button>
    </div>
  );
};

export default ProfileFormActions;