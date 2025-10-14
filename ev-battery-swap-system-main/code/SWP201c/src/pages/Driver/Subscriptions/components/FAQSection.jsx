import React from 'react';

const FAQSection = () => {
  const faqs = [
    { q: 'Tôi có thể thay đổi gói cước không?', a: 'Có, bạn có thể nâng cấp hoặc thay đổi gói cước của mình bất kỳ lúc nào.' },
    { q: 'Quãng đường không sử dụng hết có được bảo lưu không?', a: 'Không, quãng đường không sử dụng trong tháng sẽ không được cộng dồn vào tháng tiếp theo.' },
    { q: 'Điều gì xảy ra nếu tôi đi quá giới hạn quãng đường?', a: 'Nếu vượt quá giới hạn, bạn sẽ phải trả một khoản phụ phí cho mỗi km vượt trội theo quy định.' },
  ];

  return (
    <div style={{ marginTop: '50px', maxWidth: '800px', margin: '50px auto 0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Câu hỏi thường gặp</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {faqs.map((faq, index) => (
          <div key={index} style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '20px', borderRadius: '12px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: 'white' }}>{faq.q}</h4>
            <p style={{ margin: 0, color: '#9aa4c7' }}>{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;