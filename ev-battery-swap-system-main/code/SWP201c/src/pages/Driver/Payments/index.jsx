import React, { useState, useEffect } from 'react';

// Import tất cả các component cần thiết
import PaymentTabs from './components/PaymentTabs';
import PaymentHistorySection from './components/PaymentHistorySection';
import NewPaymentSection from './components/NewPaymentSection';
import PaymentDetailModal from './components/PaymentDetailModal';
import ErrorDisplay from './components/ErrorDisplay';

// Dữ liệu giả (mock data), sau này sẽ được thay thế bằng lệnh gọi API
const mockPayments = [
  { id: 'TXN001', amount: 2000000, description: 'Nạp tiền vào ví', date: '12/10/2025 09:30', type: 'TOPUP', method: 'MOMO', status: 'COMPLETED' },
  { id: 'TXN002', amount: -1800000, description: 'Thanh toán thuê pin tháng 10', date: '05/10/2025 14:00', type: 'SUBSCRIPTION', method: 'Ví nội bộ', status: 'COMPLETED' },
  { id: 'TXN003', amount: -25000, description: 'Phí đổi pin tại trạm ABC', date: '02/10/2025 18:45', type: 'SWAP_FEE', method: 'Ví nội bộ', status: 'COMPLETED' },
  { id: 'TXN004', amount: -25000, description: 'Phí đổi pin tại trạm XYZ', date: '28/09/2025 08:15', type: 'SWAP_FEE', method: 'Ví nội bộ', status: 'COMPLETED' },
];

const DriverPayments = () => {
  // State quản lý tab đang hoạt động
  const [activeTab, setActiveTab] = useState('Lịch sử giao dịch');
  
  // State quản lý dữ liệu và trạng thái tải
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State quản lý modal chi tiết
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Giả lập việc gọi API khi component được mount
  const fetchPayments = () => {
    setIsLoading(true);
    setError(null);
    console.log("Fetching payments...");

    setTimeout(() => {
      // Logic để giả lập lỗi (ví dụ: 20% khả năng lỗi)
      if (Math.random() < 0.2) {
        setError("Không thể kết nối đến máy chủ. Vui lòng thử lại.");
      } else {
        setPayments(mockPayments);
      }
      setIsLoading(false);
    }, 1500); // Giả lập độ trễ mạng 1.5 giây
  };

  useEffect(() => {
    fetchPayments();
  }, []); // Mảng rỗng đảm bảo chỉ chạy 1 lần

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
  };

  // Hàm render nội dung cho tab Lịch sử
  const renderHistoryContent = () => {
    if (isLoading) {
      return <div>Đang tải lịch sử giao dịch...</div>;
    }
    if (error) {
      return <ErrorDisplay message={error} onRetry={fetchPayments} />;
    }
    return (
      <PaymentHistorySection
        payments={payments}
        onViewDetails={handleViewDetails}
      />
    );
  };

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Quản lý thanh toán</h1>
      
      <PaymentTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'Lịch sử giao dịch' && renderHistoryContent()}
      {activeTab === 'Nạp tiền & Thanh toán' && <NewPaymentSection />}

      {selectedPayment && (
        <PaymentDetailModal 
          payment={selectedPayment} 
          onClose={() => setSelectedPayment(null)} 
        />
      )}
    </div>
  );
};

export default DriverPayments;