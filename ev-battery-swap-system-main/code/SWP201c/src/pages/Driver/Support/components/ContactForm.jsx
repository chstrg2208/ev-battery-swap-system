import React from 'react';

const inputStyle = {
  width: '100%', padding: '12px', background: 'rgba(30, 41, 59, 0.8)',
  border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px',
  color: 'white', fontSize: '16px', boxSizing: 'border-box'
};

const ContactForm = () => {
  return (
    <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '30px', borderRadius: '12px' }}>
       <h3 style={{marginTop: 0}}>Gửi yêu cầu hỗ trợ</h3>
       <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
        <input type="text" placeholder="Tiêu đề" style={inputStyle} />
        <textarea placeholder="Nội dung chi tiết..." rows="6" style={{...inputStyle, resize: 'vertical'}}></textarea>
        <button style={{
          background: '#6ab7ff', border: 'none', color: 'white', padding: '15px',
          borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '16px'
        }}>
          Gửi yêu cầu
        </button>
       </div>
    </div>
  );
};

export default ContactForm;