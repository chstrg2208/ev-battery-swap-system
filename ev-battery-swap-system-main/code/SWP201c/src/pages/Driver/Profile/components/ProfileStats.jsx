import React from 'react';

const StatItem = ({ value, label }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '24px', fontWeight: '700' }}>{value}</div>
    <div style={{ fontSize: '14px', color: '#9aa4c7' }}>{label}</div>
  </div>
);

const ProfileStats = ({ stats }) => {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-around',
      background: 'rgba(30, 41, 59, 0.5)', borderRadius: '16px',
      padding: '20px', marginTop: '30px'
    }}>
      <StatItem value={stats.joinDate} label="Ngày tham gia" />
      <StatItem value={stats.totalTrips} label="Tổng chuyến đi" />
      <StatItem value={stats.rating} label="Đánh giá" />
    </div>
  );
};

export default ProfileStats;