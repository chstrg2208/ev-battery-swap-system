import React, { useState } from 'react'; // <-- SỬA LỖI 1: Thêm dấu {} cho useState

// Import tất cả component
import SupportHeader from './components/SupportHeader';
import SupportTabs from './components/SupportTabs';
import FAQList from './components/FAQList';
import IssueReportGrid from './components/IssueReportGrid';
import ContactInfo from './components/ContactInfo';
import ContactForm from './components/ContactForm';

const DriverSupport = () => { // <-- SỬA LỖI 2: THÊM DẤU { Ở ĐÂY

  const [activeTab, setActiveTab] = useState('Câu hỏi thường gặp');

  const renderContent = () => {
    switch(activeTab) {
      case 'Câu hỏi thường gặp':
        return <FAQList />;
      case 'Báo cáo sự cố':
        return <IssueReportGrid />;
      case 'Liên hệ trực tiếp':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }}>
            <ContactInfo />
            <ContactForm />
          </div>
        );
      default:
        return <FAQList />;
    }
  };

  return (
    <div>
      <SupportHeader />
      <SupportTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div>
        {renderContent()}
      </div>
    </div>
  );
}; // <-- Đóng dấu } của component

export default DriverSupport;