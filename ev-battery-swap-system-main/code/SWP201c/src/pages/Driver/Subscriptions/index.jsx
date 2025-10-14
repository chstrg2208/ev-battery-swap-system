import React from 'react';

// Import các component, bao gồm cả DebugInfo
import SubscriptionsHeader from './components/SubscriptionsHeader';
import PlansGrid from './components/PlansGrid';
import FAQSection from './components/FAQSection';
import DebugInfo from './components/DebugInfo'; // <-- IMPORT MỚI

// Dữ liệu giả
const mockPlans = [
  // ... (dữ liệu mockPlans giữ nguyên như trước)
  {
    id: 'plan_basic',
    name: 'Gói Cơ Bản',
    price: 1800000,
    features: [
      'Giới hạn 2,000 km/tháng',
      'Phí đổi pin tiêu chuẩn',
      'Hỗ trợ cơ bản 24/7'
    ]
  },
  {
    id: 'plan_pro',
    name: 'Gói Pro',
    price: 2500000,
    features: [
      'Không giới hạn quãng đường',
      'Miễn phí 10 lần đổi pin/tháng',
      'Ưu tiên hỗ trợ 24/7',
      'Bảo dưỡng pin định kỳ'
    ]
  },
  {
    id: 'plan_flex',
    name: 'Gói Linh Hoạt',
    price: 900000,
    features: [
      'Giới hạn 1,000 km/tháng',
      'Phù hợp cho người đi ít',
      'Hỗ trợ cơ bản 24/7'
    ]
  }
];
const currentDriverPlanId = 'plan_pro';

const DriverSubscriptions = () => {
  // Truyền dữ liệu mà bạn muốn xem vào component DebugInfo
  const debugData = {
    allPlans: mockPlans,
    currentPlan: currentDriverPlanId,
    // Sau này có thể thêm dữ liệu từ API...
  };

  return (
    <div>
      <SubscriptionsHeader />
      <PlansGrid plans={mockPlans} currentPlanId={currentDriverPlanId} />
      <FAQSection />

      {/* Component DebugInfo sẽ tự động ẩn đi khi build sản phẩm */}
      <DebugInfo data={debugData} />
    </div>
  );
};

export default DriverSubscriptions;