import React from 'react';

const FAQList = () => {
  const faqs = [
    { q: 'Làm thế nào để đổi pin?', a: 'Bạn chỉ cần đến trạm đổi pin gần nhất, mở ứng dụng và làm theo hướng dẫn để mở khóa hộc chứa pin.' },
    { q: 'Trạm sạc báo hết pin, tôi phải làm gì?', a: 'Vui lòng sử dụng bản đồ trong ứng dụng để tìm trạm khác gần bạn. Chúng tôi luôn cập nhật tình trạng pin theo thời gian thực.' },
    { q: 'Tôi có thể hủy gói dịch vụ không?', a: 'Bạn có thể hủy gia hạn gói dịch vụ của mình bất kỳ lúc nào trong phần "Gói dịch vụ" của ứng dụng.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {faqs.map((faq, index) => (
        <div key={index} style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '20px', borderRadius: '12px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: 'white' }}>{faq.q}</h4>
          <p style={{ margin: 0, color: '#9aa4c7', lineHeight: '1.6' }}>{faq.a}</p>
        </div>
      ))}
    </div>
  );
};

export default FAQList;