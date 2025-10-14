import React from 'react';

const ProfileAvatar = ({ avatarUrl, isEditing }) => {
  return (
    <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
      <img
        src={avatarUrl || 'https://via.placeholder.com/120'}
        alt="Avatar"
        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
      />
      {isEditing && (
        <label style={{
          position: 'absolute', bottom: 0, right: 0, background: '#6ab7ff',
          color: 'white', width: '36px', height: '36px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', border: '2px solid #1a202c'
        }}>
          ✏️
          <input type="file" style={{ display: 'none' }} />
        </label>
      )}
    </div>
  );
};

export default ProfileAvatar;