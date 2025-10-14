import React from 'react';

const ContactInfo = () => {
  return (
    <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '30px', borderRadius: '12px' }}>
      <h3 style={{marginTop: 0}}>Thông tin liên hệ</h3>
      <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
        <div>
          <div style={{color: '#9aa4c7'}}>Hotline 24/7</div>
          <div style={{fontWeight: 600, fontSize: '18px'}}>1900 1234</div>
        </div>
        <div>
          <div style={{color: '#9aa4c7'}}>Email hỗ trợ</div>
          <div style={{fontWeight: 600, fontSize: '18px'}}>support@swp201.com</div>
        </div>
        <div>
          <div style={{color: '#9aa4c7'}}>Địa chỉ</div>
          <div style={{fontWeight: 600, fontSize: '18px'}}>Lô E2a-7, Đường D1, Khu Công nghệ cao, Long Thạnh Mỹ, Thủ Đức, TPHCM</div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;