// Admin Dashboard Component
// Main administrative dashboard with beautiful design

import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalUsers: 1248,
    totalBatteries: 500,
    totalStations: 25,
    totalTransactions: 3456,
    totalSwaps: 8945,
    monthlyRevenue: 2500000,
    activeUsers: 1156,
    activeBatteries: 456
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number);
  };

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(25, 195, 125, 0.1), rgba(106, 183, 255, 0.1))',
        borderRadius: '20px',
        padding: '40px',
        marginBottom: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(25, 195, 125, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(106, 183, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 165, 0, 0.05) 0%, transparent 50%)
          `,
          zIndex: 0
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h1 style={{ 
                margin: 0, 
                color: '#FFFFFF', 
                fontSize: '2.5rem', 
                fontWeight: '700',
                background: 'linear-gradient(135deg, #19c37d, #6ab7ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                ⚙️ Dashboard Quản trị
              </h1>
              <p style={{ 
                margin: '10px 0 0 0', 
                color: '#B0B0B0', 
                fontSize: '1.1rem',
                fontWeight: '400'
              }}>
                Chào mừng bạn đến với hệ thống quản lý pin EV
              </p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              padding: '15px 25px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#19c37d', fontSize: '1.1rem', fontWeight: '600' }}>
                {currentTime.toLocaleDateString('vi-VN')}
              </div>
              <div style={{ color: '#6ab7ff', fontSize: '1.4rem', fontWeight: '700' }}>
                {currentTime.toLocaleTimeString('vi-VN')}
              </div>
            </div>
          </div>
          
          {/* Quick Stats Overview */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '15px',
            marginTop: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#19c37d', fontSize: '1.8rem', fontWeight: '700' }}>
                {formatNumber(stats.totalUsers)}
              </div>
              <div style={{ color: '#E0E0E0', fontSize: '0.9rem' }}>Người dùng</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#6ab7ff', fontSize: '1.8rem', fontWeight: '700' }}>
                {formatNumber(stats.totalBatteries)}
              </div>
              <div style={{ color: '#E0E0E0', fontSize: '0.9rem' }}>Pin</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#ffa500', fontSize: '1.8rem', fontWeight: '700' }}>
                {stats.totalStations}
              </div>
              <div style={{ color: '#E0E0E0', fontSize: '0.9rem' }}>Trạm</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#ff6b6b', fontSize: '1.8rem', fontWeight: '700' }}>
                {formatNumber(stats.totalTransactions)}
              </div>
              <div style={{ color: '#E0E0E0', fontSize: '0.9rem' }}>Giao dịch</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#4ecdc4', fontSize: '1.8rem', fontWeight: '700' }}>
                {formatCurrency(stats.monthlyRevenue)}
              </div>
              <div style={{ color: '#E0E0E0', fontSize: '0.9rem' }}>Doanh thu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px',
        marginBottom: '30px'
      }}>
        {/* Users Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(25, 195, 125, 0.1), rgba(25, 195, 125, 0.05))',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(25, 195, 125, 0.2)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, rgba(25, 195, 125, 0.2), rgba(25, 195, 125, 0.1))',
            borderRadius: '50%',
            filter: 'blur(20px)'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{
                padding: '15px',
                borderRadius: '15px',
                background: 'linear-gradient(135deg, #19c37d, #15a36a)',
                fontSize: '2rem',
                boxShadow: '0 10px 30px rgba(25, 195, 125, 0.3)'
              }}>
                👥
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.3rem' }}>Người dùng</h3>
                <p style={{ margin: 0, color: '#B0B0B0', fontSize: '0.9rem' }}>Quản lý tài khoản</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#19c37d' }}>
                  {formatNumber(stats.totalUsers)}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#19c37d' }}>
                  {formatNumber(stats.activeUsers)} hoạt động
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#19c37d', fontSize: '1.2rem' }}>+12.5%</div>
                <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>vs tháng trước</div>
              </div>
            </div>
          </div>
        </div>

        {/* Batteries Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(106, 183, 255, 0.1), rgba(106, 183, 255, 0.05))',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(106, 183, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, rgba(106, 183, 255, 0.2), rgba(106, 183, 255, 0.1))',
            borderRadius: '50%',
            filter: 'blur(20px)'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{
                padding: '15px',
                borderRadius: '15px',
                background: 'linear-gradient(135deg, #6ab7ff, #4a9eff)',
                fontSize: '2rem',
                boxShadow: '0 10px 30px rgba(106, 183, 255, 0.3)'
              }}>
                🔋
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.3rem' }}>Kho pin</h3>
                <p style={{ margin: 0, color: '#B0B0B0', fontSize: '0.9rem' }}>Quản lý pin EV</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#6ab7ff' }}>
                  {formatNumber(stats.totalBatteries)}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#6ab7ff' }}>
                  {formatNumber(stats.activeBatteries)} sẵn sàng
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#6ab7ff', fontSize: '1.2rem' }}>+8.3%</div>
                <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>vs tháng trước</div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(255, 165, 0, 0.05))',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 165, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.2), rgba(255, 165, 0, 0.1))',
            borderRadius: '50%',
            filter: 'blur(20px)'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{
                padding: '15px',
                borderRadius: '15px',
                background: 'linear-gradient(135deg, #ffa500, #e6940b)',
                fontSize: '2rem',
                boxShadow: '0 10px 30px rgba(255, 165, 0, 0.3)'
              }}>
                💰
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.3rem' }}>Doanh thu</h3>
                <p style={{ margin: 0, color: '#B0B0B0', fontSize: '0.9rem' }}>Tháng này</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ffa500' }}>
                  {formatCurrency(stats.monthlyRevenue)}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#ffa500' }}>
                  {formatNumber(stats.totalTransactions)} giao dịch
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#ffa500', fontSize: '1.2rem' }}>+15.7%</div>
                <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>vs tháng trước</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline & Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '25px',
        marginBottom: '30px'
      }}>
        {/* Recent Activities */}
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ 
            color: '#FFFFFF', 
            marginBottom: '25px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            fontSize: '1.3rem'
          }}>
            🕒 Hoạt động gần đây
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {[
              { icon: '👤', text: 'Nguyen Van A đã đăng ký tài khoản', time: '2 phút trước', color: '#19c37d' },
              { icon: '🔋', text: 'Đổi pin tại Trạm Quận 1', time: '5 phút trước', color: '#6ab7ff' },
              { icon: '💳', text: 'Tran Thi B thanh toán 50,000 VND', time: '8 phút trước', color: '#ffa500' },
              { icon: '👨‍💼', text: 'Staff Nguyen C đã đăng nhập', time: '12 phút trước', color: '#9c88ff' },
              { icon: '🔧', text: 'Bảo trì pin BAT-001', time: '15 phút trước', color: '#ff6b6b' },
              { icon: '📊', text: 'Báo cáo tháng đã được tạo', time: '20 phút trước', color: '#4ecdc4' }
            ].map((activity, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '15px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  padding: '10px',
                  borderRadius: '10px',
                  background: `${activity.color}20`,
                  border: `1px solid ${activity.color}40`
                }}>
                  {activity.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#FFFFFF', fontSize: '0.95rem', marginBottom: '2px' }}>
                    {activity.text}
                  </div>
                  <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>{activity.time}</div>
                </div>
                <div style={{
                  width: '4px',
                  height: '30px',
                  background: activity.color,
                  borderRadius: '2px'
                }} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats Chart */}
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ 
            color: '#FFFFFF', 
            marginBottom: '25px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            fontSize: '1.3rem'
          }}>
            📈 Thống kê hệ thống
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { label: 'Tỷ lệ sử dụng trạm', value: 75, color: '#19c37d' },
              { label: 'Hiệu suất pin', value: 92, color: '#6ab7ff' },
              { label: 'Hài lòng khách hàng', value: 88, color: '#ffa500' },
              { label: 'Thời gian phản hồi', value: 95, color: '#9c88ff' },
              { label: 'Độ tin cậy hệ thống', value: 99, color: '#4ecdc4' }
            ].map((stat, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ minWidth: '140px', color: '#E0E0E0', fontSize: '14px' }}>
                  {stat.label}
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    flex: 1,
                    height: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div
                      style={{
                        width: `${stat.value}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${stat.color}, ${stat.color}dd)`,
                        borderRadius: '4px',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                  <span style={{
                    color: stat.color,
                    fontSize: '14px',
                    fontWeight: '600',
                    minWidth: '35px'
                  }}>
                    {stat.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '20px',
        padding: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <h3 style={{ 
          color: '#FFFFFF', 
          marginBottom: '25px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          fontSize: '1.3rem'
        }}>
          ⚡ Thao tác nhanh
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px' 
        }}>
          {[
            { icon: '👥', title: 'Thêm người dùng mới', desc: 'Tạo tài khoản cho khách hàng', color: '#19c37d' },
            { icon: '🔋', title: 'Nhập pin mới', desc: 'Thêm pin vào kho hàng', color: '#6ab7ff' },
            { icon: '🏪', title: 'Tạo trạm mới', desc: 'Thiết lập trạm đổi pin', color: '#ffa500' },
            { icon: '📊', title: 'Xuất báo cáo', desc: 'Tạo báo cáo doanh thu', color: '#ff6b6b' },
            { icon: '🔧', title: 'Bảo trì hệ thống', desc: 'Kiểm tra và bảo trì', color: '#9c88ff' },
            { icon: '📋', title: 'Quản lý gói dịch vụ', desc: 'Tạo và chỉnh sửa gói', color: '#4ecdc4' }
          ].map((action, index) => (
            <button
              key={index}
              style={{
                background: `linear-gradient(135deg, ${action.color}20, ${action.color}10)`,
                border: `1px solid ${action.color}40`,
                borderRadius: '15px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = `0 10px 30px ${action.color}30`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  fontSize: '2rem',
                  padding: '12px',
                  borderRadius: '12px',
                  background: `${action.color}30`
                }}>
                  {action.icon}
                </div>
                <div>
                  <div style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '600', marginBottom: '5px' }}>
                    {action.title}
                  </div>
                  <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
                    {action.desc}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

  const handleFeatureClick = (route) => {
    navigate(route);
  };

  return (
    <div className="admin-dashboard" style={{ padding: '20px' }}>
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#FFFFFF', marginBottom: '10px' }}>⚙️ Dashboard Quản trị</h1>
        <p style={{ color: '#E0E0E0' }}>Tổng quan hệ thống quản lý pin EV</p>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#19c37d' }}>1,248</div>
          <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>Tổng người dùng</div>
        </div>
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6ab7ff' }}>500</div>
          <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>Quản lý pin</div>
        </div>
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffa500' }}>25</div>
          <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>Trạm đổi pin</div>
        </div>
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff6b6b' }}>3,456</div>
          <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>Giao dịch</div>
        </div>
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4ecdc4' }}>8,945</div>
          <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>Lượt đổi pin</div>
        </div>
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9c88ff' }}>2.5M</div>
          <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>Doanh thu tháng</div>
        </div>
      </div>

      {/* Admin Features Grid */}
      <div className="features-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {adminFeatures.map((feature) => (
          <div
            key={feature.id}
            onClick={() => handleFeatureClick(feature.route)}
            style={{
              background: 'rgba(26, 32, 44, 0.8)',
              borderRadius: '12px',
              padding: '25px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px)';
              e.target.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4)';
              e.target.style.borderColor = feature.color;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px',
              gap: '15px'
            }}>
              <div style={{
                fontSize: '2.5rem',
                padding: '15px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`,
                boxShadow: `0 8px 24px ${feature.color}40`
              }}>
                {feature.icon}
              </div>
              <div>
                <h3 style={{
                  margin: '0 0 8px 0',
                  color: '#FFFFFF',
                  fontSize: '1.2rem',
                  fontWeight: '600'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  margin: 0,
                  color: '#B0B0B0',
                  fontSize: '0.9rem',
                  lineHeight: '1.4'
                }}>
                  {feature.description}
                </p>
              </div>
            </div>
            <div style={{
              padding: '12px 0',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: feature.color, fontSize: '0.9rem', fontWeight: '500' }}>
                Nhấn để truy cập
              </span>
              <span style={{ color: feature.color, fontSize: '1.2rem' }}>→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '12px',
        padding: '25px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <h3 style={{ color: '#FFFFFF', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🕒 Hoạt động gần đây
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {[
            { icon: '👤', text: 'Nguyen Van A đã đăng ký tài khoản', time: '2 phút trước', color: '#19c37d' },
            { icon: '🔋', text: 'Đổi pin tại Trạm Quận 1', time: '5 phút trước', color: '#6ab7ff' },
            { icon: '💳', text: 'Tran Thi B thanh toán 50,000 VND', time: '8 phút trước', color: '#ffa500' },
            { icon: '👨‍💼', text: 'Staff Nguyen C đã đăng nhập', time: '12 phút trước', color: '#9c88ff' },
            { icon: '🔧', text: 'Bảo trì pin BAT-001', time: '15 phút trước', color: '#ff6b6b' }
          ].map((activity, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '10px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)'
            }}>
              <span style={{
                fontSize: '1.5rem',
                padding: '8px',
                borderRadius: '8px',
                background: `${activity.color}20`
              }}>
                {activity.icon}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#FFFFFF', fontSize: '0.95rem' }}>{activity.text}</div>
                <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        marginTop: '30px',
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '12px',
        padding: '25px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <h3 style={{ color: '#FFFFFF', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          ⚡ Thao tác nhanh
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {[
            { icon: '👤', text: 'Thêm người dùng', color: '#19c37d' },
            { icon: '🔋', text: 'Thêm pin mới', color: '#6ab7ff' },
            { icon: '🏪', text: 'Thêm trạm đổi pin', color: '#ffa500' },
            { icon: '📊', text: 'Xem báo cáo', color: '#9c88ff' }
          ].map((action, index) => (
            <button
              key={index}
              style={{
                background: `linear-gradient(135deg, ${action.color}, ${action.color}dd)`,
                border: 'none',
                borderRadius: '8px',
                padding: '15px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.95rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                boxShadow: `0 4px 16px ${action.color}40`
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = `0 8px 24px ${action.color}60`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = `0 4px 16px ${action.color}40`;
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{action.icon}</span>
              {action.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;