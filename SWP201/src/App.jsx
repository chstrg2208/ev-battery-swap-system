import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// Fix default markers for React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [currentView, setCurrentView] = useState('landing');
  const [dashboardTab, setDashboardTab] = useState('home');
  const [swapStep, setSwapStep] = useState(1);
  const [paymentTab, setPaymentTab] = useState('top-up');
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedPole, setSelectedPole] = useState(null);
  const [selectedPickupSlot, setSelectedPickupSlot] = useState(null);
  const [selectedReturnSlot, setSelectedReturnSlot] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: 10.7769, lng: 106.7009 });
  const [batteryData, setBatteryData] = useState({
    current: 25,
    health: 92,
    temperature: 28,
    voltage: 48.2,
    cycles: 156
  });
  
  // Demo accounts data
  const demoAccounts = {
    driver: [
      { email: 'driver1@example.com', password: '123456', name: 'Nguyễn Văn A' },
      { email: 'driver2@example.com', password: '123456', name: 'Trần Thị B' },
      { email: 'driver3@example.com', password: '123456', name: 'Lê Văn C' }
    ],
    staff: [
      { email: 'staff1@station.com', password: '123456', name: 'Phạm Văn D' },
      { email: 'staff2@station.com', password: '123456', name: 'Hoàng Thị E' }
    ],
    admin: [
      { email: 'admin@swp201.com', password: 'admin123', name: 'Admin System' }
    ]
  };

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'Trạm mới',
      message: 'Trạm sạc Station 15 đã mở tại Quận 7',
      time: '2 phút trước',
      unread: true
    },
    {
      id: 2,
      type: 'warning',
      title: 'Pin sắp hết',
      message: 'Pin hiện tại còn 15%. Tìm trạm đổi pin gần nhất?',
      time: '5 phút trước',
      unread: true
    },
    {
      id: 3,
      type: 'success',
      title: 'Đổi pin thành công',
      message: 'Bạn đã đổi pin thành công tại Station 8',
      time: '1 giờ trước',
      unread: false
    }
  ]);

  // Functions
  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type} show`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  const handleLogin = (email, password) => {
    // Check demo accounts
    for (const role in demoAccounts) {
      const account = demoAccounts[role].find(acc => acc.email === email && acc.password === password);
      if (account) {
        setCurrentUser({ ...account, role });
        setShowLoginModal(false);
        setCurrentView('dashboard');
        showToast(`Đăng nhập thành công! Chào mừng ${account.name}`);
        return;
      }
    }
    showToast('Sai email hoặc mật khẩu!', 'error');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
    setDashboardTab('home');
    showToast('Đã đăng xuất thành công!');
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, unread: false } : notif
    ));
  };

  // Mock data
  const vehicleData = {
    model: 'VinFast Feliz',
    licensePlate: '59H1-12345',
    year: 2023,
    batteryCapacity: '48V 20Ah',
    registrationDate: '15/03/2023'
  };

  const subscriptionData = {
    plan: 'Premium',
    status: 'Đang hoạt động',
    swapsLeft: 28,
    totalSwaps: 50,
    expiryDate: '15/12/2024',
    monthlyFee: 299000
  };

  const paymentHistory = [
    { id: 1, date: '15/11/2024', type: 'Nạp tiền', amount: 500000, status: 'Thành công' },
    { id: 2, date: '10/11/2024', type: 'Đổi pin', amount: -15000, status: 'Thành công' },
    { id: 3, date: '05/11/2024', type: 'Phí thuê bao', amount: -299000, status: 'Thành công' }
  ];

  const nearbyStations = [
    { 
      id: 1, 
      name: 'Station 1', 
      distance: '0.5km', 
      available: 5, 
      total: 8, 
      status: 'Hoạt động',
      waitTime: 3,
      fullBatteries: 5,
      chargingBatteries: 2,
      emptyBatteries: 1,
      lat: 10.7769,
      lng: 106.7009,
      address: '123 Nguyễn Văn Linh, Q7, TP.HCM',
      poles: [
        { id: 1, name: 'Trụ A', slots: 10, fullSlots: 4, chargingSlots: 3, emptySlots: 3 },
        { id: 2, name: 'Trụ B', slots: 10, fullSlots: 3, chargingSlots: 4, emptySlots: 3 }
      ]
    },
    { 
      id: 2, 
      name: 'Station 2', 
      distance: '1.2km', 
      available: 6, 
      total: 12, 
      status: 'Hoạt động',
      waitTime: 8,
      fullBatteries: 6,
      chargingBatteries: 4,
      emptyBatteries: 2,
      lat: 10.7829,
      lng: 106.6934,
      address: '456 Lê Văn Lương, Q7, TP.HCM',
      poles: [
        { id: 1, name: 'Trụ A', slots: 8, fullSlots: 3, chargingSlots: 2, emptySlots: 3 },
        { id: 2, name: 'Trụ B', slots: 8, fullSlots: 2, chargingSlots: 3, emptySlots: 3 },
        { id: 3, name: 'Trụ C', slots: 6, fullSlots: 1, chargingSlots: 2, emptySlots: 3 }
      ]
    },
    { 
      id: 3, 
      name: 'Station 3', 
      distance: '2.1km', 
      available: 4, 
      total: 8, 
      status: 'Hoạt động',
      waitTime: 5,
      fullBatteries: 4,
      chargingBatteries: 3,
      emptyBatteries: 1,
      lat: 10.7892,
      lng: 106.7100,
      address: '789 Huỳnh Tấn Phát, Q7, TP.HCM',
      poles: [
        { id: 1, name: 'Trụ A', slots: 6, fullSlots: 2, chargingSlots: 2, emptySlots: 2 },
        { id: 2, name: 'Trụ B', slots: 8, fullSlots: 2, chargingSlots: 3, emptySlots: 3 }
      ]
    },
    { 
      id: 4, 
      name: 'Station 4', 
      distance: '3.5km', 
      available: 3, 
      total: 6, 
      status: 'Hoạt động',
      waitTime: 12,
      fullBatteries: 3,
      chargingBatteries: 2,
      emptyBatteries: 1,
      lat: 10.7650,
      lng: 106.6800,
      address: '321 Nguyễn Hữu Thọ, Q7, TP.HCM',
      poles: [
        { id: 1, name: 'Trụ A', slots: 6, fullSlots: 2, chargingSlots: 2, emptySlots: 2 },
        { id: 2, name: 'Trụ B', slots: 6, fullSlots: 1, chargingSlots: 3, emptySlots: 2 }
      ]
    },
    { 
      id: 5, 
      name: 'Station 5', 
      distance: '4.2km', 
      available: 7, 
      total: 15, 
      status: 'Hoạt động',
      waitTime: 6,
      fullBatteries: 7,
      chargingBatteries: 5,
      emptyBatteries: 3,
      lat: 10.7950,
      lng: 106.7200,
      address: '654 Võ Văn Kiệt, Q5, TP.HCM',
      poles: [
        { id: 1, name: 'Trụ A', slots: 10, fullSlots: 4, chargingSlots: 3, emptySlots: 3 },
        { id: 2, name: 'Trụ B', slots: 8, fullSlots: 2, chargingSlots: 4, emptySlots: 2 },
        { id: 3, name: 'Trụ C', slots: 7, fullSlots: 1, chargingSlots: 3, emptySlots: 3 }
      ]
    },
    { 
      id: 6, 
      name: 'Station 6', 
      distance: '5.8km', 
      available: 2, 
      total: 6, 
      status: 'Bảo trì',
      waitTime: 0,
      fullBatteries: 0,
      chargingBatteries: 0,
      emptyBatteries: 6,
      lat: 10.7600,
      lng: 106.7300,
      address: '987 Trần Hưng Đạo, Q1, TP.HCM',
      poles: [
        { id: 1, name: 'Trụ A', slots: 6, fullSlots: 0, chargingSlots: 0, emptySlots: 6 },
        { id: 2, name: 'Trụ B', slots: 6, fullSlots: 0, chargingSlots: 0, emptySlots: 6 }
      ]
    }
  ];

  // Calculate distance between two points
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  // Map Component
  const StationMap = () => {
    const center = [userLocation.lat, userLocation.lng];
    
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(newLocation);
            showToast('Đã cập nhật vị trí hiện tại!', 'success');
          },
          (error) => {
            showToast('Không thể lấy vị trí. Sử dụng vị trí mặc định.', 'warning');
          }
        );
      } else {
        showToast('Trình duyệt không hỗ trợ định vị!', 'error');
      }
    };
    
    return (
      <div>
        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={getCurrentLocation}>
            📍 Lấy vị trí hiện tại
          </button>
        </div>
        <div className="map-container" style={{ height: '400px', borderRadius: '12px', overflow: 'hidden' }}>
          <MapContainer 
            center={center} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* User location marker */}
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>
                <div style={{ minWidth: '150px', textAlign: 'center' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#4F8CFF' }}>📍 Vị trí của bạn</h4>
                  <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
                    Tọa độ: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>

            {/* Station markers */}
            {nearbyStations.map(station => {
              const distance = calculateDistance(userLocation.lat, userLocation.lng, station.lat, station.lng);
              return (
                <Marker key={station.id} position={[station.lat, station.lng]}>
                  <Popup>
                    <div style={{ minWidth: '250px' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{station.name}</h4>
                      <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
                        📍 {station.address}
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '13px', color: '#4F8CFF' }}>
                        📏 Khoảng cách: <strong>{distance}</strong>
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '13px', color: station.status === 'Hoạt động' ? '#19c37d' : '#ff4757' }}>
                        ● {station.status}
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
                        🔋 {station.available}/{station.total} pin có sẵn
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
                        🏗️ {station.poles.length} trụ sạc
                      </p>
                      {station.status === 'Hoạt động' && (
                        <>
                          <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
                            ⏱️ Thời gian chờ: ~{station.waitTime} phút
                          </p>
                          <div style={{ marginTop: '8px', fontSize: '12px' }}>
                            <span style={{ color: '#19c37d', marginRight: '8px' }}>● {station.fullBatteries} đầy</span>
                            <span style={{ color: '#ffa500', marginRight: '8px' }}>● {station.chargingBatteries} sạc</span>
                            <span style={{ color: '#ff4757' }}>● {station.emptyBatteries} trống</span>
                          </div>
                        </>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    );
  };

  // Components
  const LandingPage = () => (
    <div id="landing">
      <header>
        <div className="container">
          <nav className="nav">
            <div className="brand">
              <div className="logo">
                <svg viewBox="0 0 24 24">
                  <path d="M13 3l3.5 6L12 11.5 8.5 9 13 3zm4.5 9L16 14.5 12 17l-4-2.5 1.5-2.5 4.5 2.5L17.5 12zM12 19l-7.5-12L3 5l9 14 9-14-1.5 2L12 19z"/>
                </svg>
              </div>
              SWP201
            </div>
            <div className="nav-links">
              <a href="#features">Tính năng</a>
              <a href="#pricing">Gói dịch vụ</a>
              <a href="#about">Về chúng tôi</a>
            </div>
            <div className="auth-buttons">
              <button className="btn" onClick={() => setShowLoginModal(true)}>Đăng nhập</button>
              <button className="btn btn-primary" onClick={() => setShowRegisterModal(true)}>Đăng ký</button>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <div className="hero">
          <div className="container">
            <div className="eyebrow">
              ⚡ Hệ thống đổi pin thông minh
            </div>
            <h1 className="title">
              Đổi pin xe điện <strong>nhanh chóng</strong><br/>
              và <strong>tiện lợi</strong>
            </h1>
            <p className="subtitle">
              Giải pháp đổi pin tự động cho xe điện với mạng lưới trạm sạc rộng khắp thành phố. 
              Chỉ 3 phút để có pin đầy 100%.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => setShowRegisterModal(true)}>
                Bắt đầu ngay
              </button>
              <button className="btn" onClick={() => setShowLoginModal(true)}>
                Đăng nhập
              </button>
            </div>
          </div>
        </div>

        <section id="features">
          <div className="container">
            <h2>Tính năng nổi bật</h2>
            <div className="grid">
              <div className="card">
                <div className="icon">⚡</div>
                <h3>Đổi pin siêu nhanh</h3>
                <p className="muted">Chỉ 3 phút để đổi pin, nhanh hơn việc đổ xăng truyền thống</p>
              </div>
              <div className="card">
                <div className="icon">📍</div>
                <h3>Mạng lưới rộng khắp</h3>
                <p className="muted">Hơn 50 trạm đổi pin trên toàn thành phố</p>
              </div>
              <div className="card featured">
                <div className="icon">📱</div>
                <h3>Ứng dụng thông minh</h3>
                <p className="muted">Theo dõi pin, tìm trạm, thanh toán tự động</p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing">
          <div className="container">
            <h2>Gói dịch vụ</h2>
            <div className="pricing">
              <div className="card">
                <h3>Basic</h3>
                <div className="price">99,000₫<span className="muted">/tháng</span></div>
                <ul className="clean">
                  <li><span className="tick">✓</span> 10 lần đổi pin/tháng</li>
                  <li><span className="tick">✓</span> Ứng dụng cơ bản</li>
                  <li><span className="tick">✓</span> Hỗ trợ 24/7</li>
                </ul>
                <button className="btn btn-primary">Chọn gói</button>
              </div>
              <div className="card featured">
                <h3>Plus <span className="chip">Phổ biến</span></h3>
                <div className="price">199,000₫<span className="muted">/tháng</span></div>
                <ul className="clean">
                  <li><span className="tick">✓</span> 30 lần đổi pin/tháng</li>
                  <li><span className="tick">✓</span> Ứng dụng đầy đủ</li>
                  <li><span className="tick">✓</span> Ưu tiên đổi pin</li>
                  <li><span className="tick">✓</span> Hỗ trợ ưu tiên</li>
                </ul>
                <button className="btn btn-primary">Chọn gói</button>
              </div>
              <div className="card">
                <h3>Premium</h3>
                <div className="price">299,000₫<span className="muted">/tháng</span></div>
                <ul className="clean">
                  <li><span className="tick">✓</span> Không giới hạn đổi pin</li>
                  <li><span className="tick">✓</span> Tính năng cao cấp</li>
                  <li><span className="tick">✓</span> Đặt trước trạm đổi</li>
                  <li><span className="tick">✓</span> Hỗ trợ VIP</li>
                </ul>
                <button className="btn btn-primary">Chọn gói</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );

  const LoginModal = () => (
    <div className="modal" style={{ display: showLoginModal ? 'block' : 'none' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Đăng nhập</h3>
          <button className="close-btn" onClick={() => setShowLoginModal(false)}>×</button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          handleLogin(formData.get('email'), formData.get('password'));
        }}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" required />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input type="password" name="password" required />
          </div>
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setShowLoginModal(false)}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Đăng nhập
            </button>
          </div>
        </form>
        <div className="demo-accounts">
          <h4>Tài khoản demo:</h4>
          <div className="demo-grid">
            {Object.entries(demoAccounts).map(([role, accounts]) => 
              accounts.map((account, index) => (
                <div
                  key={`${role}-${index}`}
                  className="demo-btn"
                  onClick={() => handleLogin(account.email, account.password)}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)} {index + 1}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const RegisterModal = () => (
    <div className="modal" style={{ display: showRegisterModal ? 'block' : 'none' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Đăng ký tài khoản</h3>
          <button className="close-btn" onClick={() => setShowRegisterModal(false)}>×</button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          showToast('Đăng ký thành công! Vui lòng đăng nhập.');
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}>
          <div className="form-row">
            <div className="form-group">
              <label>Họ và tên</label>
              <input type="text" required />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="tel" required />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Mật khẩu</label>
              <input type="password" required />
            </div>
            <div className="form-group">
              <label>Xác nhận mật khẩu</label>
              <input type="password" required />
            </div>
          </div>
          <div className="form-group">
            <label>Loại tài khoản</label>
            <select required>
              <option value="driver">Người dùng (Driver)</option>
              <option value="staff">Nhân viên (Staff)</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setShowRegisterModal(false)}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const Dashboard = () => {
    const unreadCount = notifications.filter(n => n.unread).length;

    const DashboardHeader = () => (
      <header className="dashboard-header">
        <div className="container">
          <div className="dashboard-nav">
            <div className="brand">
              <div className="logo">
                <svg viewBox="0 0 24 24">
                  <path d="M13 3l3.5 6L12 11.5 8.5 9 13 3zm4.5 9L16 14.5 12 17l-4-2.5 1.5-2.5 4.5 2.5L17.5 12zM12 19l-7.5-12L3 5l9 14 9-14-1.5 2L12 19z"/>
                </svg>
              </div>
              SWP201 - {currentUser.role === 'driver' ? 'Người dùng' : currentUser.role === 'staff' ? 'Nhân viên' : 'Quản trị'}
            </div>
            <div className="user-info">
              <div className="user-avatar">{currentUser.name[0]}</div>
              <span>{currentUser.name}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>
    );

    if (currentUser.role === 'driver') {
      return (
        <div className="dashboard active">
          <DashboardHeader />
          <div className="user-nav">
            <div className="container">
              <div className="nav-tabs">
                <button 
                  className={`nav-tab ${dashboardTab === 'home' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('home')}
                >
                  🏠 Trang chủ
                </button>
                <button 
                  className={`nav-tab ${dashboardTab === 'vehicle' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('vehicle')}
                >
                  � Xe & Pin của tôi
                </button>
                <button 
                  className={`nav-tab ${dashboardTab === 'subscription' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('subscription')}
                >
                  📋 Gói dịch vụ
                </button>
                <button 
                  className={`nav-tab ${dashboardTab === 'swap' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('swap')}
                >
                  ⚡ Đổi pin
                </button>
                <button 
                  className={`nav-tab ${dashboardTab === 'payment' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('payment')}
                >
                  💳 Thanh toán
                </button>
                <button 
                  className={`nav-tab ${dashboardTab === 'support' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('support')}
                >
                  💬 Hỗ trợ
                </button>
                <button 
                  className={`nav-tab ${dashboardTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('settings')}
                >
                  ⚙️ Cài đặt
                </button>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="dashboard-content">
              
              {/* Home Tab */}
              <div className={`tab-content ${dashboardTab === 'home' ? 'active' : ''}`}>
                <div className="stats-grid">
                  <div className="card">
                    <h4>🔋 Mức pin hiện tại</h4>
                    <div className="price">{batteryData.current}%</div>
                    <p className="muted">Còn khoảng 25km</p>
                  </div>
                  <div className="card">
                    <h4>📍 Trạm gần nhất</h4>
                    <div className="price">0.5km</div>
                    <p className="muted">Station 1 - 5 pin</p>
                  </div>
                  <div className="card">
                    <h4>💰 Số dư</h4>
                    <div className="price">485,000₫</div>
                    <p className="muted">+50,000₫ hôm qua</p>
                  </div>
                  <div className="card">
                    <h4>📊 Lần đổi còn lại</h4>
                    <div className="price">{subscriptionData.swapsLeft}</div>
                    <p className="muted">Gói {subscriptionData.plan}</p>
                  </div>
                </div>
                
                <div className="grid" style={{gridTemplateColumns: '2fr 1fr', gap: '24px'}}>
                  <div className="card">
                    <h3>🗺️ Bản đồ trạm đổi pin</h3>
                    <StationMap />
                    <div className="grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px'}}>
                      {nearbyStations.map(station => (
                        <div key={station.id} className="card" style={{padding: '12px'}}>
                          <h4>{station.name}</h4>
                          <p className="muted">{station.distance}</p>
                          <p className="muted">{station.available}/{station.total} pin</p>
                          <span className={`chip ${station.status === 'Hoạt động' ? 'success' : 'warning'}`}>{station.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="card">
                    <h3>🔔 Thông báo mới</h3>
                    {notifications.slice(0, 3).map(notif => (
                      <div key={notif.id} className="card" style={{padding: '12px', margin: '8px 0'}}>
                        <h4>{notif.title}</h4>
                        <p className="muted" style={{fontSize: '13px'}}>{notif.message}</p>
                        <p className="muted" style={{fontSize: '12px'}}>{notif.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vehicle & Battery Tab */}
              <div className={`tab-content ${dashboardTab === 'vehicle' ? 'active' : ''}`}>
                <h2>� Xe & Pin của tôi</h2>
                
                {/* Vehicle Information */}
                <div className="card" style={{marginBottom: '24px'}}>
                  <h3>🛵 Thông tin xe</h3>
                  <div className="grid" style={{gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px'}}>
                    <div>
                      <h4>Thông tin cơ bản</h4>
                      <p><strong>Mẫu xe:</strong> {vehicleData.model}</p>
                      <p><strong>Biển số:</strong> {vehicleData.licensePlate}</p>
                      <p><strong>Năm sản xuất:</strong> {vehicleData.year}</p>
                      <p><strong>Dung lượng pin:</strong> {vehicleData.batteryCapacity}</p>
                    </div>
                    <div>
                      <h4>Đăng ký & Bảo hành</h4>
                      <p><strong>Ngày đăng ký:</strong> {vehicleData.registrationDate}</p>
                      <p><strong>Trạng thái:</strong> <span className="chip">Hoạt động</span></p>
                      <p><strong>Bảo hiểm:</strong> Còn hiệu lực</p>
                      <p><strong>Kiểm định:</strong> 15/03/2025</p>
                    </div>
                  </div>
                </div>

                {/* Battery Information */}
                <div className="card">
                  <h3>🔋 Thông tin pin hiện tại</h3>
                  <div className="grid" style={{gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '20px'}}>
                    <div className="card" style={{padding: '16px', textAlign: 'center'}}>
                      <h4>Mức pin</h4>
                      <div className="price" style={{color: batteryData.current > 50 ? '#19c37d' : batteryData.current > 20 ? '#ffa500' : '#ff4757'}}>{batteryData.current}%</div>
                      <div className="charge-bar" style={{width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginTop: '8px'}}>
                        <div className="charge-fill" style={{
                          width: `${batteryData.current}%`, 
                          height: '100%', 
                          background: batteryData.current > 50 ? '#19c37d' : batteryData.current > 20 ? '#ffa500' : '#ff4757',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </div>
                    <div className="card" style={{padding: '16px', textAlign: 'center'}}>
                      <h4>Sức khỏe pin</h4>
                      <div className="price" style={{color: '#19c37d'}}>{batteryData.health}%</div>
                      <p className="muted" style={{fontSize: '14px', marginTop: '8px'}}>Tình trạng: Tốt</p>
                    </div>
                  </div>
                  
                  <div className="grid" style={{gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px'}}>
                    <div style={{textAlign: 'center'}}>
                      <h5>Nhiệt độ</h5>
                      <div className="stat-value" style={{fontSize: '24px', color: '#19c37d'}}>{batteryData.temperature}°C</div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                      <h5>Điện áp</h5>
                      <div className="stat-value" style={{fontSize: '24px', color: '#19c37d'}}>{batteryData.voltage}V</div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                      <h5>Chu kỳ sạc</h5>
                      <div className="stat-value" style={{fontSize: '24px', color: '#6ab7ff'}}>{batteryData.cycles}</div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                      <h5>Quãng đường</h5>
                      <div className="stat-value" style={{fontSize: '24px', color: '#6ab7ff'}}>12,450km</div>
                    </div>
                  </div>

                  <div className="card" style={{backgroundColor: 'rgba(255,255,255,0.02)', marginTop: '16px'}}>
                    <h4>📊 Lịch sử sử dụng</h4>
                    <div className="grid" style={{gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px'}}>
                      <div>
                        <p><strong>Thời gian sử dụng:</strong> 8 tháng 15 ngày</p>
                        <p><strong>Lần đổi pin cuối:</strong> 2 ngày trước</p>
                        <p><strong>Tổng lần đổi pin:</strong> 47 lần</p>
                      </div>
                      <div>
                        <p><strong>Quãng đường trung bình:</strong> 45km/ngày</p>
                        <p><strong>Hiệu suất pin:</strong> 95%</p>
                        <p><strong>Tiết kiệm CO₂:</strong> 1,245kg</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription Tab */}
              <div className={`tab-content ${dashboardTab === 'subscription' ? 'active' : ''}`}>
                <h2>📋 Gói dịch vụ của tôi</h2>
                <div className="card featured">
                  <h3>Gói {subscriptionData.plan} <span className="chip">{subscriptionData.status}</span></h3>
                  <div className="grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px'}}>
                    <div>
                      <h4>Lần đổi còn lại</h4>
                      <div className="price">{subscriptionData.swapsLeft}/{subscriptionData.totalSwaps}</div>
                    </div>
                    <div>
                      <h4>Ngày hết hạn</h4>
                      <div className="price">{subscriptionData.expiryDate}</div>
                    </div>
                    <div>
                      <h4>Phí hàng tháng</h4>
                      <div className="price">{subscriptionData.monthlyFee.toLocaleString()}₫</div>
                    </div>
                  </div>
                  <div style={{marginTop: '20px'}}>
                    <button className="btn btn-primary" onClick={() => showToast('Gia hạn gói thành công!')}>Gia hạn gói</button>
                    <button className="btn" style={{marginLeft: '12px'}} onClick={() => showToast('Đã chuyển sang gói Plus!')}>Thay đổi gói</button>
                  </div>
                </div>

                {/* Available Plans */}
                <div className="card" style={{marginTop: '24px'}}>
                  <h3>Các gói dịch vụ khác</h3>
                  <div className="pricing">
                    <div className="card">
                      <h3>Basic</h3>
                      <div className="price">99,000₫<span className="muted">/tháng</span></div>
                      <ul className="clean">
                        <li><span className="tick">✓</span> 10 lần đổi pin/tháng</li>
                        <li><span className="tick">✓</span> Ứng dụng cơ bản</li>
                        <li><span className="tick">✓</span> Hỗ trợ 24/7</li>
                        <li><span className="tick">✓</span> Theo dõi pin cơ bản</li>
                      </ul>
                      <button className="btn btn-primary" onClick={() => showToast('Đã chuyển sang gói Basic!')}>Chọn gói</button>
                    </div>
                    <div className="card">
                      <h3>Plus <span className="chip">Phổ biến</span></h3>
                      <div className="price">199,000₫<span className="muted">/tháng</span></div>
                      <ul className="clean">
                        <li><span className="tick">✓</span> 30 lần đổi pin/tháng</li>
                        <li><span className="tick">✓</span> Ứng dụng đầy đủ</li>
                        <li><span className="tick">✓</span> Ưu tiên đổi pin</li>
                        <li><span className="tick">✓</span> Hỗ trợ ưu tiên</li>
                        <li><span className="tick">✓</span> Thông báo real-time</li>
                        <li><span className="tick">✓</span> Đặt trước trạm</li>
                      </ul>
                      <button className="btn btn-primary" onClick={() => showToast('Đã chuyển sang gói Plus!')}>Chọn gói</button>
                    </div>
                    <div className="card featured">
                      <h3>Premium <span className="chip">Hiện tại</span></h3>
                      <div className="price">299,000₫<span className="muted">/tháng</span></div>
                      <ul className="clean">
                        <li><span className="tick">✓</span> Không giới hạn đổi pin</li>
                        <li><span className="tick">✓</span> Tính năng cao cấp</li>
                        <li><span className="tick">✓</span> Đặt trước trạm đổi</li>
                        <li><span className="tick">✓</span> Hỗ trợ VIP 24/7</li>
                        <li><span className="tick">✓</span> Phân tích chi tiết</li>
                        <li><span className="tick">✓</span> Xe thay thế khẩn cấp</li>
                        <li><span className="tick">✓</span> Bảo hiểm pin</li>
                      </ul>
                      <button className="btn btn-success" disabled>Đang sử dụng</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Swap Tab */}
              <div className={`tab-content ${dashboardTab === 'swap' ? 'active' : ''}`}>
                <h2>⚡ Đổi pin</h2>
                
                {swapStep === 1 && (
                  <div className="card">
                    <h3>Bước 1: Chọn trạm đổi pin</h3>
                    <div className="grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px'}}>
                      {nearbyStations.filter(s => s.status === 'Hoạt động').map(station => {
                        const distance = calculateDistance(userLocation.lat, userLocation.lng, station.lat, station.lng);
                        return (
                          <div key={station.id} className="card" style={{cursor: 'pointer', border: selectedStation === station.id ? '2px solid #19c37d' : '1px solid rgba(255,255,255,0.1)'}} 
                               onClick={() => {
                                 setSelectedStation(station.id);
                                 showToast('Đã chọn ' + station.name);
                               }}>
                            <h4>{station.name}</h4>
                            <p className="muted">📍 {distance} từ vị trí của bạn</p>
                            <p className="muted">🔋 {station.available}/{station.total} pin có sẵn</p>
                            <p className="muted">🏗️ {station.poles.length} trụ sạc</p>
                            <p className="muted">⏱️ Thời gian chờ: ~{station.waitTime} phút</p>
                            <div style={{marginTop: '12px'}}>
                              <span style={{color: '#19c37d'}}>● {station.fullBatteries} pin đầy</span><br/>
                              <span style={{color: '#ffa500'}}>● {station.chargingBatteries} pin đang sạc</span><br/>
                              <span style={{color: '#ff4757'}}>● {station.emptyBatteries} pin trống</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {selectedStation && (
                      <div style={{marginTop: '20px', textAlign: 'center'}}>
                        <button className="btn btn-primary" onClick={() => setSwapStep(2)}>
                          Tiếp tục với trạm đã chọn
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {swapStep === 2 && (
                  <div className="card">
                    <h3>Bước 2: Chọn trụ sạc</h3>
                    <p className="muted">Chọn một trụ có pin đầy để thực hiện đổi pin</p>
                    
                    <div className="grid" style={{gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '20px'}}>
                      {Array.from({length: 10}, (_, i) => {
                        const batteryStatus = i < 4 ? 'full' : i < 7 ? 'charging' : 'empty';
                        const batteryLevel = batteryStatus === 'full' ? 100 : batteryStatus === 'charging' ? Math.floor(Math.random() * 80) + 20 : 0;
                        const canSelect = batteryStatus === 'full';
                        
                        return (
                          <div key={i} 
                               className="card" 
                               style={{
                                 cursor: canSelect ? 'pointer' : 'not-allowed',
                                 opacity: canSelect ? 1 : 0.6,
                                 border: selectedPickupSlot === i ? '3px solid #19c37d' : '1px solid rgba(255,255,255,0.1)',
                                 textAlign: 'center',
                                 padding: '12px',
                                 backgroundColor: canSelect ? 'rgba(25, 195, 125, 0.15)' : 'rgba(255,255,255,0.05)'
                               }}
                               onClick={() => {
                                 if (canSelect) {
                                   setSelectedPickupSlot(i);
                                   showToast(`Chọn lấy pin từ Slot ${i + 1} - ${batteryLevel}%`);
                                 }
                               }}>
                            <div style={{fontSize: '20px', margin: '8px 0'}}>
                              {batteryStatus === 'full' && '🔋'}
                              {batteryStatus === 'charging' && '⚡'}
                              {batteryStatus === 'empty' && '🪫'}
                            </div>
                            <p><strong>Slot {i + 1}</strong></p>
                            <p style={{fontSize: '14px', color: batteryStatus === 'full' ? '#19c37d' : batteryStatus === 'charging' ? '#ffa500' : '#ff4757'}}>
                              {batteryLevel}%
                            </p>
                            <p className="muted" style={{fontSize: '11px'}}>
                              {batteryStatus === 'full' && 'Đầy - Có thể lấy'}
                              {batteryStatus === 'charging' && 'Đang sạc'}
                              {batteryStatus === 'empty' && 'Trống'}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {selectedPickupSlot !== null && (
                      <div className="card" style={{backgroundColor: 'rgba(25, 195, 125, 0.1)', marginBottom: '20px'}}>
                        <h4>✅ Đã chọn pin để lấy</h4>
                        <p>� <strong>Slot {selectedPickupSlot + 1}</strong> - Pin đầy 100%</p>
                        <p className="muted">Pin này sẽ được lắp vào xe của bạn</p>
                      </div>
                    )}

                    <div style={{marginTop: '20px'}}>
                      {selectedPickupSlot !== null ? (
                        <button className="btn btn-primary" onClick={() => setSwapStep(3)}>
                          Tiếp tục chọn slot để trả pin cũ
                        </button>
                      ) : (
                        <button className="btn" disabled>
                          Vui lòng chọn slot pin đầy
                        </button>
                      )}
                      <button className="btn" style={{marginLeft: '12px'}} onClick={() => {
                        setSwapStep(1);
                        setSelectedStation(null);
                        setSelectedPickupSlot(null);
                      }}>
                        Quay lại
                      </button>
                    </div>
                  </div>
                )}

                {swapStep === 3 && (
                  <div className="card">
                    <h3>Bước 3: Chọn slot trống để trả pin cũ</h3>
                    <p className="muted">Chọn một slot trống để đặt pin cũ ({batteryData.current}%) vào sạc</p>
                    
                    <div className="grid" style={{gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '20px'}}>
                      {Array.from({length: 10}, (_, i) => {
                        const batteryStatus = i < 4 ? 'full' : i < 7 ? 'charging' : 'empty';
                        const batteryLevel = batteryStatus === 'full' ? 100 : batteryStatus === 'charging' ? Math.floor(Math.random() * 80) + 20 : 0;
                        const canSelect = batteryStatus === 'empty';
                        const isPickupSlot = selectedPickupSlot === i;
                        
                        return (
                          <div key={i} 
                               className="card" 
                               style={{
                                 cursor: canSelect ? 'pointer' : 'not-allowed',
                                 opacity: isPickupSlot ? 0.3 : canSelect ? 1 : 0.6,
                                 border: selectedReturnSlot === i ? '3px solid #ff4757' : 
                                        isPickupSlot ? '2px solid #19c37d' :
                                        '1px solid rgba(255,255,255,0.1)',
                                 textAlign: 'center',
                                 padding: '12px',
                                 backgroundColor: isPickupSlot ? 'rgba(25, 195, 125, 0.2)' :
                                                canSelect ? 'rgba(255, 71, 87, 0.15)' : 'rgba(255,255,255,0.05)'
                               }}
                               onClick={() => {
                                 if (canSelect && !isPickupSlot) {
                                   setSelectedReturnSlot(i);
                                   showToast(`Chọn trả pin cũ vào Slot ${i + 1}`);
                                 }
                               }}>
                            <div style={{fontSize: '20px', margin: '8px 0'}}>
                              {isPickupSlot ? '✅' : 
                               batteryStatus === 'full' ? '🔋' :
                               batteryStatus === 'charging' ? '⚡' : '🪫'}
                            </div>
                            <p><strong>Slot {i + 1}</strong></p>
                            <p style={{fontSize: '14px', color: isPickupSlot ? '#19c37d' :
                                                                    batteryStatus === 'full' ? '#19c37d' : 
                                                                    batteryStatus === 'charging' ? '#ffa500' : '#ff4757'}}>
                              {isPickupSlot ? 'Đã chọn lấy' : `${batteryLevel}%`}
                            </p>
                            <p className="muted" style={{fontSize: '11px'}}>
                              {isPickupSlot && 'Pin đã chọn lấy'}
                              {!isPickupSlot && batteryStatus === 'full' && 'Đầy - Không thể trả'}
                              {!isPickupSlot && batteryStatus === 'charging' && 'Đang sạc'}
                              {!isPickupSlot && batteryStatus === 'empty' && 'Trống - Có thể trả'}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {selectedReturnSlot !== null && (
                      <div className="card" style={{backgroundColor: 'rgba(255, 71, 87, 0.1)', marginBottom: '20px'}}>
                        <h4>✅ Đã chọn vị trí trả pin cũ</h4>
                        <p>📦 <strong>Slot {selectedReturnSlot + 1}</strong> - Slot trống</p>
                        <p className="muted">Pin cũ ({batteryData.current}%) sẽ được đặt vào đây để sạc</p>
                      </div>
                    )}

                    <div className="card" style={{backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: '20px'}}>
                      <h4>🔄 Tóm tắt giao dịch đổi pin</h4>
                      <div className="grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', textAlign: 'center'}}>
                        <div>
                          <div style={{fontSize: '24px', marginBottom: '8px'}}>📤</div>
                          <p><strong>Lấy pin mới</strong></p>
                          <p className="muted">Slot {selectedPickupSlot + 1} - 100%</p>
                        </div>
                        <div>
                          <div style={{fontSize: '24px', marginBottom: '8px'}}>🔄</div>
                          <p><strong>Đổi pin</strong></p>
                          <p className="muted">Tự động xử lý</p>
                        </div>
                        <div>
                          <div style={{fontSize: '24px', marginBottom: '8px'}}>📥</div>
                          <p><strong>Trả pin cũ</strong></p>
                          <p className="muted">Slot {selectedReturnSlot !== null ? selectedReturnSlot + 1 : '?'} - {batteryData.current}%</p>
                        </div>
                      </div>
                    </div>

                    <div style={{marginTop: '20px'}}>
                      {selectedReturnSlot !== null ? (
                        <button className="btn btn-primary" onClick={() => setSwapStep(4)}>
                          Xác nhận đổi pin
                        </button>
                      ) : (
                        <button className="btn" disabled>
                          Vui lòng chọn slot trống để trả pin cũ
                        </button>
                      )}
                      <button className="btn" style={{marginLeft: '12px'}} onClick={() => setSwapStep(2)}>
                        Quay lại
                      </button>
                    </div>
                  </div>
                )}

                {swapStep === 4 && (
                  <div className="card">
                    <h3>Bước 4: Xác nhận tại trạm</h3>
                    <div style={{textAlign: 'center', padding: '40px'}}>
                      <div style={{width: '200px', height: '200px', border: '2px dashed rgba(255,255,255,0.3)', borderRadius: '12px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px'}}>
                        📱
                      </div>
                      <h4>Quét mã QR tại trạm đổi pin</h4>
                      <p className="muted">Đưa điện thoại lại gần màn hình trạm để xác nhận giao dịch</p>
                      
                      <div className="card" style={{backgroundColor: 'rgba(255,255,255,0.05)', margin: '20px auto', maxWidth: '400px'}}>
                        <h5>🔄 Chi tiết giao dịch</h5>
                        <div style={{textAlign: 'left', fontSize: '14px'}}>
                          <p>🏪 <strong>Trạm:</strong> {nearbyStations.find(s => s.id === selectedStation)?.name}</p>
                          <p>📤 <strong>Lấy pin:</strong> Slot {selectedPickupSlot + 1} (100%)</p>
                          <p>� <strong>Trả pin:</strong> Slot {selectedReturnSlot + 1} ({batteryData.current}%)</p>
                          <p>💰 <strong>Chi phí:</strong> 15,000₫</p>
                          <p>⏱️ <strong>Thời gian:</strong> ~3 phút</p>
                        </div>
                      </div>

                      <button className="btn btn-primary" onClick={() => {
                        setBatteryData(prev => ({...prev, current: 100}));
                        setSwapStep(1);
                        setSelectedStation(null);
                        setSelectedPickupSlot(null);
                        setSelectedReturnSlot(null);
                        showToast('🎉 Đổi pin thành công! Pin mới: 100%. Pin cũ đã vào slot sạc.', 'success');
                      }}>
                        Mô phỏng đổi pin thành công
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Tab - Enhanced */}
              <div className={`tab-content ${dashboardTab === 'payment' ? 'active' : ''}`}>
                <h2>💳 Thanh toán</h2>
                
                <div className="card">
                  <div className="nav-tabs" style={{borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px'}}>
                    <button 
                      className={`nav-tab ${paymentTab === 'top-up' ? 'active' : ''}`}
                      onClick={() => setPaymentTab('top-up')}
                    >
                      💰 Nạp tiền
                    </button>
                    <button 
                      className={`nav-tab ${paymentTab === 'history' ? 'active' : ''}`}
                      onClick={() => setPaymentTab('history')}
                    >
                      📊 Lịch sử
                    </button>
                    <button 
                      className={`nav-tab ${paymentTab === 'methods' ? 'active' : ''}`}
                      onClick={() => setPaymentTab('methods')}
                    >
                      💳 Phương thức
                    </button>
                    <button 
                      className={`nav-tab ${paymentTab === 'autopay' ? 'active' : ''}`}
                      onClick={() => setPaymentTab('autopay')}
                    >
                      🔄 Tự động
                    </button>
                  </div>

                  {paymentTab === 'top-up' && (
                    <div>
                      <div className="card" style={{marginBottom: '20px', padding: '16px', textAlign: 'center'}}>
                        <h4>💰 Số dư hiện tại</h4>
                        <div className="price" style={{fontSize: '32px', color: '#19c37d'}}>485,000₫</div>
                      </div>
                      
                      <h4>Nạp nhanh</h4>
                      <div className="grid" style={{gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px'}}>
                        <div className="card" style={{cursor: 'pointer', textAlign: 'center'}} onClick={() => showToast('Nạp 50,000₫ thành công!')}>
                          <div className="price">50,000₫</div>
                        </div>
                        <div className="card" style={{cursor: 'pointer', textAlign: 'center'}} onClick={() => showToast('Nạp 100,000₫ thành công!')}>
                          <div className="price">100,000₫</div>
                        </div>
                        <div className="card" style={{cursor: 'pointer', textAlign: 'center'}} onClick={() => showToast('Nạp 200,000₫ thành công!')}>
                          <div className="price">200,000₫</div>
                        </div>
                        <div className="card" style={{cursor: 'pointer', textAlign: 'center'}} onClick={() => showToast('Nạp 500,000₫ thành công!')}>
                          <div className="price">500,000₫</div>
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label>Số tiền khác</label>
                        <input type="number" placeholder="Nhập số tiền" min="10000" max="5000000" />
                      </div>
                      
                      <div className="form-group">
                        <label>Phương thức thanh toán</label>
                        <div className="grid" style={{gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px'}}>
                          <div className="card" style={{cursor: 'pointer', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <span style={{fontSize: '20px'}}>📱</span>
                            <span>Ví MoMo</span>
                          </div>
                          <div className="card" style={{cursor: 'pointer', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <span style={{fontSize: '20px'}}>💙</span>
                            <span>ZaloPay</span>
                          </div>
                          <div className="card" style={{cursor: 'pointer', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <span style={{fontSize: '20px'}}>🏦</span>
                            <span>VietQR</span>
                          </div>
                          <div className="card" style={{cursor: 'pointer', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <span style={{fontSize: '20px'}}>💳</span>
                            <span>Thẻ ngân hàng</span>
                          </div>
                        </div>
                      </div>
                      
                      <button className="btn btn-primary">Nạp tiền</button>
                    </div>
                  )}

                  {paymentTab === 'history' && (
                    <div>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                        <h4>Lịch sử giao dịch</h4>
                        <select style={{padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white'}}>
                          <option>Tháng này</option>
                          <option>3 tháng qua</option>
                          <option>6 tháng qua</option>
                          <option>1 năm qua</option>
                        </select>
                      </div>
                      {paymentHistory.map(payment => (
                        <div key={payment.id} className="card" style={{marginBottom: '12px', padding: '16px'}}>
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                              <div style={{fontSize: '24px'}}>
                                {payment.type === 'Nạp tiền' ? '💰' : payment.type === 'Đổi pin' ? '⚡' : '📋'}
                              </div>
                              <div>
                                <h4 style={{margin: '0'}}>{payment.type}</h4>
                                <p className="muted" style={{margin: '0', fontSize: '13px'}}>{payment.date}</p>
                              </div>
                            </div>
                            <div style={{textAlign: 'right'}}>
                              <div className={`price ${payment.amount > 0 ? 'success' : ''}`} style={{margin: '0', fontSize: '16px'}}>
                                {payment.amount > 0 ? '+' : ''}{payment.amount.toLocaleString()}₫
                              </div>
                              <span className="chip">{payment.status}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {paymentTab === 'methods' && (
                    <div>
                      <h4>Phương thức thanh toán đã lưu</h4>
                      <div className="card" style={{marginBottom: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                          <span style={{fontSize: '24px'}}>📱</span>
                          <div>
                            <h4 style={{margin: '0'}}>Ví MoMo</h4>
                            <p className="muted" style={{margin: '0', fontSize: '13px'}}>**** **** **** 1234</p>
                          </div>
                          <span className="chip">Mặc định</span>
                        </div>
                        <button className="btn">Chỉnh sửa</button>
                      </div>
                      
                      <div className="card" style={{marginBottom: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                          <span style={{fontSize: '24px'}}>🏦</span>
                          <div>
                            <h4 style={{margin: '0'}}>Vietcombank</h4>
                            <p className="muted" style={{margin: '0', fontSize: '13px'}}>**** **** **** 5678</p>
                          </div>
                        </div>
                        <button className="btn">Chỉnh sửa</button>
                      </div>
                      
                      <button className="btn btn-primary">+ Thêm phương thức mới</button>
                    </div>
                  )}

                  {paymentTab === 'autopay' && (
                    <div>
                      <h4>Thanh toán tự động</h4>
                      <div className="card" style={{padding: '16px'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                          <div>
                            <h4 style={{margin: '0'}}>Tự động nạp tiền</h4>
                            <p className="muted" style={{margin: '0', fontSize: '13px'}}>Nạp tiền khi số dư dưới 50,000₫</p>
                          </div>
                          <label style={{position: 'relative', display: 'inline-block', width: '50px', height: '24px'}}>
                            <input type="checkbox" style={{opacity: 0, width: 0, height: 0}} />
                            <span style={{position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#ccc', borderRadius: '24px', transition: '0.4s'}}></span>
                          </label>
                        </div>
                        
                        <div className="form-group">
                          <label>Số tiền nạp tự động</label>
                          <select>
                            <option>100,000₫</option>
                            <option>200,000₫</option>
                            <option>500,000₫</option>
                          </select>
                        </div>
                        
                        <div className="form-group">
                          <label>Phương thức thanh toán</label>
                          <select>
                            <option>Ví MoMo (**** 1234)</option>
                            <option>Vietcombank (**** 5678)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="card" style={{padding: '16px', marginTop: '16px'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                          <div>
                            <h4 style={{margin: '0'}}>Thanh toán gói dịch vụ tự động</h4>
                            <p className="muted" style={{margin: '0', fontSize: '13px'}}>Gia hạn tự động gói Premium hàng tháng</p>
                          </div>
                          <label style={{position: 'relative', display: 'inline-block', width: '50px', height: '24px'}}>
                            <input type="checkbox" defaultChecked style={{opacity: 0, width: 0, height: 0}} />
                            <span style={{position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#19c37d', borderRadius: '24px', transition: '0.4s'}}></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Support Tab */}
              <div className={`tab-content ${dashboardTab === 'support' ? 'active' : ''}`}>
                <h2>💬 Hỗ trợ khách hàng</h2>
                <div className="grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px'}}>
                  <div className="card" style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => showToast('Đang kết nối với tổng đài...')}>
                    <div className="icon">📞</div>
                    <h3>Hotline</h3>
                    <p className="muted">1900 1234</p>
                    <p className="muted">24/7</p>
                  </div>
                  
                  <div className="card" style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => showToast('Đang mở chat...')}>
                    <div className="icon">💬</div>
                    <h3>Live Chat</h3>
                    <p className="muted">Trò chuyện trực tiếp</p>
                    <p className="muted">Online</p>
                  </div>
                  
                  <div className="card" style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => showToast('Đang mở email...')}>
                    <div className="icon">📧</div>
                    <h3>Email</h3>
                    <p className="muted">support@swp201.com</p>
                    <p className="muted">Phản hồi trong 24h</p>
                  </div>
                </div>
                
                <div className="card" style={{marginTop: '24px'}}>
                  <h3>FAQ - Câu hỏi thường gặp</h3>
                  <div className="card" style={{marginBottom: '12px'}}>
                    <h4>Làm thế nào để đổi pin?</h4>
                    <p className="muted">Chọn trạm → Quét QR → Đợi máy đổi pin tự động → Hoàn tất</p>
                  </div>
                  <div className="card" style={{marginBottom: '12px'}}>
                    <h4>Chi phí đổi pin là bao nhiêu?</h4>
                    <p className="muted">Từ 10,000₫ - 20,000₫ tùy theo gói dịch vụ và loại pin</p>
                  </div>
                  <div className="card">
                    <h4>Pin đổi có chất lượng tốt không?</h4>
                    <p className="muted">Tất cả pin đều được kiểm tra kỹ lưỡng, đảm bảo &gt;90% dung lượng</p>
                  </div>
                </div>
              </div>

              {/* Settings Tab */}
              <div className={`tab-content ${dashboardTab === 'settings' ? 'active' : ''}`}>
                <h2>⚙️ Cài đặt</h2>
                
                {/* Profile Settings */}
                <div className="card" style={{marginBottom: '24px'}}>
                  <h3>👤 Thông tin cá nhân</h3>
                  <div className="grid" style={{gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px'}}>
                    <div className="form-group">
                      <label>Họ và tên</label>
                      <input type="text" defaultValue={currentUser.name} />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" defaultValue={currentUser.email} />
                    </div>
                    <div className="form-group">
                      <label>Số điện thoại</label>
                      <input type="tel" defaultValue="0901234567" />
                    </div>
                    <div className="form-group">
                      <label>Địa chỉ</label>
                      <input type="text" defaultValue="123 Nguyễn Văn Linh, Q7, TP.HCM" />
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={() => showToast('Cập nhật thông tin thành công!')}>
                    Cập nhật thông tin
                  </button>
                </div>

                {/* Notification Settings */}
                <div className="card" style={{marginBottom: '24px'}}>
                  <h3>🔔 Cài đặt thông báo</h3>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                    <div>
                      <h4 style={{margin: '0'}}>Thông báo push</h4>
                      <p className="muted" style={{margin: '0', fontSize: '13px'}}>Nhận thông báo trên thiết bị</p>
                    </div>
                    <label style={{position: 'relative', display: 'inline-block', width: '50px', height: '24px'}}>
                      <input type="checkbox" defaultChecked style={{opacity: 0, width: 0, height: 0}} />
                      <span style={{position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#19c37d', borderRadius: '24px', transition: '0.4s'}}></span>
                    </label>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                    <div>
                      <h4 style={{margin: '0'}}>Email thông báo</h4>
                      <p className="muted" style={{margin: '0', fontSize: '13px'}}>Nhận thông báo qua email</p>
                    </div>
                    <label style={{position: 'relative', display: 'inline-block', width: '50px', height: '24px'}}>
                      <input type="checkbox" defaultChecked style={{opacity: 0, width: 0, height: 0}} />
                      <span style={{position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#19c37d', borderRadius: '24px', transition: '0.4s'}}></span>
                    </label>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0'}}>
                    <div>
                      <h4 style={{margin: '0'}}>SMS thông báo</h4>
                      <p className="muted" style={{margin: '0', fontSize: '13px'}}>Nhận thông báo qua SMS</p>
                    </div>
                    <label style={{position: 'relative', display: 'inline-block', width: '50px', height: '24px'}}>
                      <input type="checkbox" style={{opacity: 0, width: 0, height: 0}} />
                      <span style={{position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#ccc', borderRadius: '24px', transition: '0.4s'}}></span>
                    </label>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="card" style={{marginBottom: '24px'}}>
                  <h3>🔒 Bảo mật</h3>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                    <div>
                      <h4 style={{margin: '0'}}>Xác thực 2 yếu tố</h4>
                      <p className="muted" style={{margin: '0', fontSize: '13px'}}>Bảo vệ tài khoản với mã OTP</p>
                    </div>
                    <button className="btn">Kích hoạt</button>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                    <div>
                      <h4 style={{margin: '0'}}>Đổi mật khẩu</h4>
                      <p className="muted" style={{margin: '0', fontSize: '13px'}}>Cập nhật mật khẩu đăng nhập</p>
                    </div>
                    <button className="btn">Đổi mật khẩu</button>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0'}}>
                    <div>
                      <h4 style={{margin: '0'}}>Phiên đăng nhập</h4>
                      <p className="muted" style={{margin: '0', fontSize: '13px'}}>Quản lý các thiết bị đã đăng nhập</p>
                    </div>
                    <button className="btn">Xem chi tiết</button>
                  </div>
                </div>

                {/* App Settings */}
                <div className="card">
                  <h3>📱 Cài đặt ứng dụng</h3>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                    <div>
                      <h4 style={{margin: '0'}}>Ngôn ngữ</h4>
                      <p className="muted" style={{margin: '0', fontSize: '13px'}}>Tiếng Việt</p>
                    </div>
                    <select style={{padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white'}}>
                      <option>Tiếng Việt</option>
                      <option>English</option>
                    </select>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                    <div>
                      <h4 style={{margin: '0'}}>Đơn vị tiền tệ</h4>
                      <p className="muted" style={{margin: '0', fontSize: '13px'}}>VND (₫)</p>
                    </div>
                    <select style={{padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white'}}>
                      <option>VND (₫)</option>
                      <option>USD ($)</option>
                    </select>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0'}}>
                    <div>
                      <h4 style={{margin: '0'}}>Chế độ tối</h4>
                      <p className="muted" style={{margin: '0', fontSize: '13px'}}>Luôn bật chế độ tối</p>
                    </div>
                    <label style={{position: 'relative', display: 'inline-block', width: '50px', height: '24px'}}>
                      <input type="checkbox" defaultChecked style={{opacity: 0, width: 0, height: 0}} />
                      <span style={{position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#19c37d', borderRadius: '24px', transition: '0.4s'}}></span>
                    </label>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      );
    }

    // Staff Dashboard (simplified)
    if (currentUser.role === 'staff') {
      return (
        <div className="dashboard active">
          <DashboardHeader />
          <div className="container">
            <div className="dashboard-content">
              <h2>👥 Dashboard Nhân viên</h2>
              <div className="stats-grid">
                <div className="card">
                  <h4>🔋 Pin trong kho</h4>
                  <div className="price">45</div>
                  <p className="muted">8 pin đang sạc</p>
                </div>
                <div className="card">
                  <h4>⚡ Đổi pin hôm nay</h4>
                  <div className="price">23</div>
                  <p className="muted">+5 so với hôm qua</p>
                </div>
                <div className="card">
                  <h4>🛠️ Sự cố</h4>
                  <div className="price">2</div>
                  <p className="muted">Cần xử lý</p>
                </div>
                <div className="card">
                  <h4>📊 Hiệu suất</h4>
                  <div className="price">95%</div>
                  <p className="muted">Xuất sắc</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Admin Dashboard (simplified)
    if (currentUser.role === 'admin') {
      return (
        <div className="dashboard active">
          <DashboardHeader />
          <div className="container">
            <div className="dashboard-content">
              <h2>👑 Dashboard Quản trị</h2>
              <div className="stats-grid">
                <div className="card">
                  <h4>👥 Tổng người dùng</h4>
                  <div className="price">1,234</div>
                  <p className="muted">+50 tuần này</p>
                </div>
                <div className="card">
                  <h4>🏪 Tổng trạm</h4>
                  <div className="price">67</div>
                  <p className="muted">5 trạm mới</p>
                </div>
                <div className="card">
                  <h4>💰 Doanh thu tháng</h4>
                  <div className="price">2.5M</div>
                  <p className="muted">+15% so với tháng trước</p>
                </div>
                <div className="card">
                  <h4>⚡ Lượt đổi pin</h4>
                  <div className="price">8,945</div>
                  <p className="muted">Tháng này</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="App">
      {currentView === 'landing' && <LandingPage />}
      {currentView === 'dashboard' && currentUser && <Dashboard />}
      <LoginModal />
      <RegisterModal />
    </div>
  );
}

export default App;