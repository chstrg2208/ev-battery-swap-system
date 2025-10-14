import React from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Đảm bảo đường dẫn đúng

// Layout chuyên dụng và đầy đủ chức năng cho Driver
const DriverLayout = () => {
  const location = useLocation();
  const { currentUser, handleLogout } = useAuth(); // Lấy hàm logout từ context

  const menuItems = [
    { icon: '🏠', label: 'Trang chủ', path: '/driver/dashboard' },
    { icon: '🔋', label: 'Đổi pin', path: '/driver/swap-battery' },
    { icon: '🗺️', label: 'Bản đồ trạm', path: '/driver/stations-map' },
    { icon: '🚗', label: 'Xe của tôi', path: '/driver/vehicles' },
    { icon: '💎', label: 'Gói dịch vụ', path: '/driver/subscriptions' },
    { icon: '📋', label: 'Hợp đồng', path: '/driver/contracts' },
    { icon: '💳', label: 'Thanh toán', path: '/driver/payments' },
    { icon: '❓', label: 'Hỗ trợ', path: '/driver/support' },
    { icon: '👤', label: 'Hồ sơ', path: '/driver/profile' },
  ];

  const roleColor = '#6ab7ff'; // Màu đặc trưng của Driver
  const roleLabel = 'Driver';

  const currentPage = menuItems.find(item => location.pathname.startsWith(item.path));
  const pageTitle = currentPage ? currentPage.label : 'Bảng điều khiển';

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: 'linear-gradient(180deg, #0b1020 0%, #0e1430 100%)',
      color: '#FFFFFF', fontFamily: 'Arial, sans-serif'
    }}>
      {/* --- Sidebar --- */}
      <aside style={{
        width: '280px', background: 'rgba(18, 24, 49, 0.95)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', height: '100vh', left: 0, top: 0
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: `linear-gradient(135deg, ${roleColor}, ${roleColor}dd)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
            }}>🔋</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '18px' }}>SWP201</div>
              <div style={{ fontSize: '12px', color: '#9aa4c7' }}>{roleLabel} Panel</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '20px 12px', overflowY: 'auto' }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                borderRadius: '10px', marginBottom: '8px', textDecoration: 'none',
                background: isActive ? `${roleColor}33` : 'transparent',
                borderLeft: isActive ? `3px solid ${roleColor}` : '3px solid transparent',
              })}
            >
              {({ isActive }) => (
                <>
                  <span style={{ fontSize: '20px' }}>{item.icon}</span>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: isActive ? '600' : '500',
                    color: isActive ? roleColor : '#FFFFFF'
                  }}>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          {/* User Info & Logout */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '10px', background: 'rgba(255, 71, 87, 0.2)',
              border: '1px solid rgba(255, 71, 87, 0.3)', borderRadius: '8px',
              color: '#ff4757', cursor: 'pointer', fontSize: '14px', fontWeight: '600'
            }}>
            🚪 Đăng xuất
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column' }}>
        <header style={{
          height: '70px', background: 'rgba(18, 24, 49, 0.6)', backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex',
          alignItems: 'center', padding: '0 30px', position: 'sticky', top: 0, zIndex: 10
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
            {pageTitle}
          </h2>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
          <Outlet /> {/* Đây là nơi các trang con sẽ hiển thị */}
        </div>
      </main>
    </div>
  );
};

export default DriverLayout;