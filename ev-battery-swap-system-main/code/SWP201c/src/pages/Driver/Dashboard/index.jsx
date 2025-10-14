import React from 'react';

// Import tất cả component
import WelcomeHeader from './components/WelcomeHeader';
import VehicleManagement from './components/VehicleManagement';
import StatsGrid from './components/StatsGrid';
import QuickActions from './components/QuickActions';
import PaymentHistory from './components/PaymentHistory';
import DebugInfo from './components/DebugInfo';

const DriverDashboard = () => {
  // Dữ liệu giả, sau này sẽ lấy từ API
  const mockData = {
    vehicle: {
      name: 'Vinfast VF8',
      plate: '51K-123.45',
      imageUrl: 'https://img1.oto.com.vn/2022/07/20/3-Gr7x2kY/mau-xe-vinfast-vf8-do-2-1264.jpg',
    },
    stats: {
      totalSwaps: 128,
      currentPlans: ['Gói Pro'],
      activeVehicles: 1,
      monthlySpent: 1825000,
    },
    payments: [
      { id: 1, type: 'Thuê pin tháng 10', amount: '-1.800.000đ', date: '05/10/2025' },
      { id: 2, type: 'Phí đổi pin', amount: '-25.000đ', date: '02/10/2025' },
      { id: 3, type: 'Nạp tiền ví', amount: '+2.000.000đ', date: '01/10/2025' },
    ]
  };

  // Hàm giả để format tiền tệ
  const formatCurrency = (amount) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <WelcomeHeader />
        <VehicleManagement vehicle={mockData.vehicle} />
      </div>

      <StatsGrid stats={mockData.stats} formatCurrency={formatCurrency} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        <QuickActions />
        <PaymentHistory payments={mockData.payments} />
      </div>

      {isDev && <DebugInfo data={mockData} />}
    </div>
  );
};

export default DriverDashboard;