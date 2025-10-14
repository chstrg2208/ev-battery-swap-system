import React from 'react';
import StatCard from './StatCard'; // <-- Import component thẻ đơn lẻ

// Component này chứa logic và sắp xếp các thẻ
const StatsGrid = ({ stats, formatCurrency }) => {
  // Logic cấu hình dữ liệu vẫn giữ nguyên
  const statsConfig = [
    {
      icon: '🔋',
      value: stats.totalSwaps,
      label: 'Tổng lượt đổi pin',
      color: 'rgba(25, 195, 125, 0.3)',
      valueColor: '#19c37d',
      fontSize: '2rem'
    },
    {
      icon: '💎',
      value: stats.currentPlans.length > 0 ? stats.currentPlans.join(', ') : 'Chưa có gói',
      label: stats.currentPlans.length > 1 ? 'Các gói hiện tại' : 'Gói hiện tại',
      color: 'rgba(106, 183, 255, 0.3)',
      valueColor: '#6ab7ff',
      fontSize: '1.1rem'
    },
    {
      icon: '🚗',
      value: stats.activeVehicles,
      label: 'Xe đang sử dụng',
      color: 'rgba(255, 165, 0, 0.3)',
      valueColor: '#ffa500',
      fontSize: '2rem'
    },
    {
      icon: '💰',
      value: formatCurrency(stats.monthlySpent),
      label: 'Chi phí tháng này',
      color: 'rgba(156, 136, 255, 0.3)',
      valueColor: '#9c88ff',
      fontSize: '1.3rem'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
    }}>
      {/* Lặp qua config và render StatCard cho mỗi mục */}
      {statsConfig.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          color={stat.color}
          valueColor={stat.valueColor}
          fontSize={stat.fontSize}
        />
      ))}
    </div>
  );
};

export default StatsGrid;