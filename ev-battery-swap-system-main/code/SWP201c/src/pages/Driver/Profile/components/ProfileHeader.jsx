import React from 'react';

const ProfileHeader = ({ isEditing, onToggleEdit }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      paddingBottom: '20px',
      marginBottom: '30px',
    }}>
      <h1 style={{ margin: 0, fontSize: '28px' }}>Hồ sơ của tôi</h1>
      <button
        onClick={onToggleEdit}
        style={{
          background: isEditing ? '#ff4757' : '#6ab7ff',
          border: 'none', color: 'white', padding: '10px 20px',
          borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
        }}
      >
        {isEditing ? 'Hủy' : 'Chỉnh sửa'}
      </button>
    </div>
  );
};

export default ProfileHeader;