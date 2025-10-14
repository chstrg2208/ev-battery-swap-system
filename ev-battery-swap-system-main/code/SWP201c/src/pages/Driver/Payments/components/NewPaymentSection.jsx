import React from 'react';

const NewPaymentSection = () => {
  const containerStyle = {
    background: 'rgba(26, 32, 44, 0.8)',
    borderRadius: '15px',
    padding: '30px',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const inputStyle = {
    width: '100%',
    padding: '15px',
    background: 'rgba(30, 41, 59, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '16px',
    boxSizing: 'border-box'
  };
  
  return (
    <div style={containerStyle}>
      <h3 style={{ marginTop: 0, textAlign: 'center' }}>Nạp tiền vào ví</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#9aa4c7' }}>Số tiền</label>
          <input type="number" placeholder="Ví dụ: 500000" style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#9aa4c7' }}>Phương thức thanh toán</label>
          <select style={inputStyle}>
            <option>Thẻ ngân hàng</option>
            <option>Ví MoMo</option>
            <option>ZaloPay</option>
          </select>
        </div>
        <button style={{
          background: '#19c37d', border: 'none', color: 'white', padding: '15px',
          borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '16px'
        }}>
          Xác nhận nạp tiền
        </button>
      </div>
    </div>
  );
};

export default NewPaymentSection;