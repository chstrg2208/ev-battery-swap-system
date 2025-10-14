import React from 'react';

const inputStyle = {
  width: '100%', padding: '12px', background: 'rgba(30, 41, 59, 0.8)',
  border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px',
  color: 'white', fontSize: '16px', boxSizing: 'border-box'
};

const ProfileFormFields = ({ formData, onChange }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '8px' }}>Họ và tên</label>
        <input name="name" value={formData.name} onChange={onChange} style={inputStyle} />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '8px' }}>Số điện thoại</label>
        <input name="phone" value={formData.phone} onChange={onChange} style={inputStyle} />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
        <input name="email" value={formData.email} onChange={onChange} style={inputStyle} disabled />
      </div>
    </div>
  );
};

export default ProfileFormFields;