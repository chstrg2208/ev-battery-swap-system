// SWP201 - Main JavaScript Functions

// Authentication system
const auth = {
  currentUser: null,
  isLoggedIn: false,
  
  users: {
    'admin@demo.com': { 
      username: 'admin@demo.com', 
      password: '123456', 
      role: 'admin', 
      name: 'Admin Demo',
      phone: '0901234567',
      plan: 'enterprise',
      planExpiry: '2024-12-31'
    },
    'staff@demo.com': { 
      username: 'staff@demo.com', 
      password: '123456', 
      role: 'staff', 
      name: 'Staff Demo',
      phone: '0902345678',
      stationId: 'HCM001'
    },
    'user@demo.com': { 
      username: 'user@demo.com', 
      password: '123456', 
      role: 'user', 
      name: 'User Demo',
      phone: '0903456789',
      plan: 'premium',
      planExpiry: '2024-11-30'
    }
  },

  login: function(username, password, role) {
    const user = this.users[username];
    if (user && user.password === password && user.role === role) {
      this.currentUser = user;
      this.isLoggedIn = true;
      localStorage.setItem('userData', JSON.stringify(user));
      return { success: true, user: user };
    }
    return { success: false, message: 'Thông tin đăng nhập không đúng' };
  },

  logout: function() {
    this.currentUser = null;
    this.isLoggedIn = false;
    localStorage.removeItem('userData');
    showLandingPage();
  },

  register: function(userData) {
    const { name, phone, email, password } = userData;
    
    if (this.users[email]) {
      return { success: false, message: 'Email đã được sử dụng' };
    }

    this.users[email] = {
      username: email,
      password: password,
      role: 'user',
      name: name,
      phone: phone,
      plan: 'basic',
      registeredAt: new Date().toISOString()
    };

    return { success: true, message: 'Đăng ký thành công' };
  },

  checkSession: function() {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      this.isLoggedIn = true;
      return true;
    }
    return false;
  }
};

// Station data
const stations = [
  {
    name: 'Trạm Bùi Thị Xuân',
    area: 'Quận 1, TP.HCM',
    lat: 10.7769,
    lng: 106.7009,
    pins: 8,
    status: 'active'
  },
  {
    name: 'Trạm Cầu Giấy',
    area: 'Cầu Giấy, Hà Nội',
    lat: 21.0333,
    lng: 105.7981,
    pins: 12,
    status: 'active'
  },
  {
    name: 'Trạm Hải Châu',
    area: 'Hải Châu, Đà Nẵng',
    lat: 16.0678,
    lng: 108.2208,
    pins: 6,
    status: 'active'
  },
  {
    name: 'Trạm Thủ Đức',
    area: 'Thủ Đức, TP.HCM',
    lat: 10.8411,
    lng: 106.8098,
    pins: 15,
    status: 'active'
  },
  {
    name: 'Trạm Long Biên',
    area: 'Long Biên, Hà Nội',
    lat: 21.0434,
    lng: 105.8905,
    pins: 0,
    status: 'maintenance'
  },
  {
    name: 'Trạm Sơn Trà',
    area: 'Sơn Trà, Đà Nẵng',
    lat: 16.0836,
    lng: 108.2391,
    pins: 9,
    status: 'active'
  }
];

// Global variables
let map, userMap;
let selectedPost = null;
let selectedPickupSlot = null;
let selectedReturnSlot = null;
let currentPlanOrder = null;
let globalStationData = {};

// Utility functions
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.style.display = 'block';
  
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

function scrollToId(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// Modal functions
function showLogin() {
  document.getElementById('loginModal').style.display = 'block';
  closeModal('registerModal');
}

function showRegister() {
  document.getElementById('registerModal').style.display = 'block';
  closeModal('loginModal');
}

function showContact() {
  scrollToId('contact');
}

// Quick login for demo accounts
function quickLogin(role, username, password) {
  document.getElementById('username').value = username;
  document.getElementById('password').value = password;
  document.getElementById('userRole').value = role;
  
  const event = { preventDefault: () => {} };
  handleLogin(event);
}

// Login handler
function handleLogin(event) {
  event.preventDefault();
  console.log('handleLogin called');
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('userRole').value;
  
  console.log('Login attempt:', { username, role });

  const result = auth.login(username, password, role);
  console.log('Login result:', result);
  
  if (result.success) {
    showToast(`Đăng nhập thành công! Chào mừng ${result.user.name}`, 'success');
    closeModal('loginModal');
    
    console.log('About to call showDashboard with role:', role);
    // Call immediately instead of setTimeout
    showDashboard(role);
  } else {
    showToast(result.message, 'error');
  }
}

// Register handler
function handleRegister(event) {
  event.preventDefault();
  
  const userData = {
    name: document.getElementById('regName').value,
    phone: document.getElementById('regPhone').value,
    email: document.getElementById('regEmail').value,
    password: document.getElementById('regPassword').value
  };

  const result = auth.register(userData);
  
  if (result.success) {
    showToast(result.message, 'success');
    closeModal('registerModal');
    showLogin();
  } else {
    showToast(result.message, 'error');
  }
}

// Dashboard functions
function hideAllDashboards() {
  document.querySelectorAll('.dashboard').forEach(dashboard => {
    dashboard.classList.remove('active');
    dashboard.style.display = 'none';
  });
}

function showLandingPage() {
  hideAllDashboards();
  
  // Show main content, header, footer
  const mainContent = document.querySelector('main');
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  
  if (mainContent) mainContent.style.display = 'block';
  if (header) header.style.display = 'block';
  if (footer) footer.style.display = 'block';
  
  // Reset body overflow
  document.body.style.overflow = 'auto';
}

function showDashboard(role) {
  console.log('showDashboard called with role:', role);
  
  // Hide main content completely
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.style.display = 'none';
  }
  
  // Hide header and footer
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  if (header) header.style.display = 'none';
  if (footer) footer.style.display = 'none';
  
  hideAllDashboards();
  
  // Create dashboard if it doesn't exist
  const dashboardId = role + 'Dashboard';
  let dashboard = document.getElementById(dashboardId);
  
  if (!dashboard) {
    createDashboard(role);
    dashboard = document.getElementById(dashboardId);
  }
  
  if (dashboard) {
    // Force dashboard to be visible with strong CSS
    dashboard.className = 'dashboard active';
    dashboard.style.cssText = `
      display: block !important;
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 9999 !important;
      background: var(--bg) !important;
      color: var(--text) !important;
      overflow-y: auto !important;
      min-height: 100vh !important;
    `;
    
    // Make sure body doesn't interfere
    document.body.style.overflow = 'hidden';
    
    console.log('Dashboard made visible with forced styles');
    
    // Initialize dashboard based on role
    setTimeout(() => {
      switch(role) {
        case 'user':
          if (typeof initUserDashboard === 'function') {
            initUserDashboard();
          }
          break;
        case 'staff':
          if (typeof initStaffDashboard === 'function') {
            initStaffDashboard();
          }
          break;
        case 'admin':
          if (typeof initAdminDashboard === 'function') {
            initAdminDashboard();
          }
          break;
      }
    }, 100);
  } else {
    console.error('Dashboard creation failed for role:', role);
  }
}

// Create dashboard dynamically
function createDashboard(role) {
  const dashboardHTML = getDashboardHTML(role);
  document.body.insertAdjacentHTML('beforeend', dashboardHTML);
}

// Get dashboard HTML based on role
function getDashboardHTML(role) {
  switch(role) {
    case 'user':
      return getUserDashboardHTML();
    case 'staff':
      return getStaffDashboardHTML();
    case 'admin':
      return getAdminDashboardHTML();
    default:
      return '';
  }
}

// User Dashboard HTML
function getUserDashboardHTML() {
  return `
    <div id="userDashboard" class="dashboard">
      <div class="dashboard-header">
        <div class="container">
          <div class="dashboard-nav">
            <div class="brand">
              <div class="logo">
                <svg viewBox="0 0 24 24"><path d="M6 3h6l-1.5 3H7.8L6 3zm12 18h-6l1.5-3h2.7L18 21zM5 9h9l-1.5 3H6.5L5 9zm14 6h-9l1.5-3h6.5L19 15z"/></svg>
              </div>
              Dashboard Người Dùng
            </div>
            <div class="user-info">
              <div class="user-avatar">${auth.currentUser.name.charAt(0)}</div>
              <span>${auth.currentUser.name} (${auth.currentUser.role})</span>
              <button class="logout-btn" onclick="auth.logout()">Đăng xuất</button>
            </div>
          </div>
        </div>
      </div>

      <!-- User Dashboard Navigation -->
      <div class="user-nav">
        <div class="container">
          <div class="nav-tabs">
            <button class="nav-tab active" onclick="showUserTab('overview')">📊 Tổng quan</button>
            <button class="nav-tab" onclick="showUserTab('battery-swap')">🔋 Đổi pin</button>
            <button class="nav-tab" onclick="showUserTab('map')">🗺️ Bản đồ</button>
            <button class="nav-tab" onclick="showUserTab('payment')">💳 Thanh toán</button>
            <button class="nav-tab" onclick="showUserTab('settings')">⚙️ Cài đặt</button>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="container">
          
          <!-- Overview Tab -->
          <div id="overview-tab" class="tab-content active">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">12</div>
                <div class="stat-label">Lượt đổi pin</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">1,240,000đ</div>
                <div class="stat-label">Tổng chi phí</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">Premium</div>
                <div class="stat-label">Gói hiện tại</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">4.8★</div>
                <div class="stat-label">Đánh giá</div>
              </div>
            </div>

            <div class="card">
              <h3>Hoạt động gần đây</h3>
              <table>
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Hoạt động</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>15/10/2025 14:30</td>
                    <td>Đổi pin tại Trạm Bùi Thị Xuân</td>
                    <td><span class="status success">Hoàn thành</span></td>
                  </tr>
                  <tr>
                    <td>14/10/2025 10:20</td>
                    <td>Nạp tiền vào tài khoản</td>
                    <td><span class="status success">Thành công</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Battery Swap Tab -->
          <div id="battery-swap-tab" class="tab-content">
            <div class="card">
              <h3>🔋 Đổi pin ngay</h3>
              <p class="muted">Chọn trạm để đổi pin</p>
              
              <div class="station-selection">
                <label for="station-select">Chọn trạm đổi pin:</label>
                <select id="station-select" class="station-select" onchange="loadStationPosts()">
                  <option value="">Chọn trạm đổi pin</option>
                </select>
              </div>

              <div id="no-station" class="no-station">
                <p>👆 Vui lòng chọn trạm đổi pin ở trên</p>
              </div>

              <div id="post-grid" style="display: none;">
                <h5>Chọn trụ đổi pin:</h5>
                <div class="post-grid" id="posts-container">
                  <!-- Post items will be loaded here -->
                </div>
              </div>

              <div id="selected-post-info" style="display: none;" class="selected-post-info">
                <!-- Selected post info will be shown here -->
              </div>

              <div class="swap-button-container">
                <button id="swap-battery-btn" class="swap-btn" onclick="startBatterySwap()" disabled>
                  Chọn trạm và pin
                </button>
              </div>
            </div>
          </div>

          <!-- Map Tab -->
          <div id="map-tab" class="tab-content">
            <div class="card">
              <h3>🗺️ Bản đồ trạm đổi pin</h3>
              <div style="margin: 20px 0;">
                <div id="user-map" style="height: 400px; border-radius: 12px;"></div>
              </div>
              <div id="selected-station-info">
                <p class="muted">Chọn trạm trên bản đồ để xem thông tin chi tiết</p>
              </div>
            </div>
          </div>

          <!-- Payment Tab -->
          <div id="payment-tab" class="tab-content">
            <div class="card">
              <h3>💳 Thanh toán</h3>
              <div class="payment-sub-tabs">
                <button class="payment-sub-tab active" onclick="showPaymentSubTab('history')">📜 Lịch sử thanh toán</button>
                <button class="payment-sub-tab" onclick="showPaymentSubTab('payment')">💰 Thanh toán</button>
                <button class="payment-sub-tab" onclick="showPaymentSubTab('autopay')">🔄 Tự động thanh toán</button>
              </div>

              <!-- Payment History Sub-Tab -->
              <div id="payment-history-subtab" class="payment-sub-content active">
                <div class="table-filters">
                  <select class="filter-select">
                    <option value="">Tất cả loại</option>
                    <option value="battery-swap">Đổi pin</option>
                    <option value="plan">Gói dịch vụ</option>
                    <option value="topup">Nạp tiền</option>
                  </select>
                  <input type="date" class="filter-input">
                  <button class="btn">Lọc</button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Mã GD</th>
                      <th>Ngày</th>
                      <th>Loại</th>
                      <th>Số tiền</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody id="payment-history-table">
                    <tr>
                      <td>#TX001</td>
                      <td>02/10/2025</td>
                      <td>Đổi pin</td>
                      <td>89,000đ</td>
                      <td><span class="status success">Thành công</span></td>
                      <td><button class="action-btn">Chi tiết</button></td>
                    </tr>
                    <tr>
                      <td>#TX002</td>
                      <td>01/10/2025</td>
                      <td>Gói Premium</td>
                      <td>299,000đ</td>
                      <td><span class="status success">Thành công</span></td>
                      <td><button class="action-btn">Chi tiết</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Payment Sub-Tab -->
              <div id="payment-subtab" class="payment-sub-content">
                <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 20px;">
                  <div>
                    <h5>Chọn phương thức thanh toán:</h5>
                    <div class="payment-methods">
                      <div class="payment-method active" onclick="selectPaymentMethod('card')">
                        <div class="payment-method-icon">💳</div>
                        <div class="payment-method-name">Thẻ tín dụng</div>
                      </div>
                      <div class="payment-method" onclick="selectPaymentMethod('bank')">
                        <div class="payment-method-icon">🏦</div>
                        <div class="payment-method-name">Chuyển khoản</div>
                      </div>
                      <div class="payment-method" onclick="selectPaymentMethod('ewallet')">
                        <div class="payment-method-icon">📱</div>
                        <div class="payment-method-name">Ví điện tử</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5>Nạp tiền vào tài khoản:</h5>
                    <div class="form-group">
                      <label>Số tiền nạp:</label>
                      <select id="topup-amount" onchange="updateTopUpAmount()">
                        <option value="100000">100,000đ</option>
                        <option value="200000">200,000đ</option>
                        <option value="500000">500,000đ</option>
                        <option value="1000000">1,000,000đ</option>
                      </select>
                    </div>
                    <button class="btn btn-primary" onclick="processTopUp()">Nạp tiền</button>
                  </div>
                </div>
              </div>

              <!-- Auto Pay Sub-Tab -->
              <div id="autopay-subtab" class="payment-sub-content">
                <div class="autopay-settings">
                  <h5>🔄 Cài đặt tự động thanh toán</h5>
                  <div class="setting-row">
                    <span>Bật tự động thanh toán</span>
                    <div class="toggle-switch" onclick="toggleAutoPay()"></div>
                  </div>
                  <div class="setting-row">
                    <span>Phương thức mặc định</span>
                    <select onchange="selectAutoPayMethod(this.value)">
                      <option value="card">Thẻ tín dụng</option>
                      <option value="bank">Chuyển khoản</option>
                      <option value="ewallet">Ví điện tử</option>
                    </select>
                  </div>
                  <div class="setting-row">
                    <span>Hạn mức tự động</span>
                    <select>
                      <option value="100000">100,000đ/ngày</option>
                      <option value="500000">500,000đ/ngày</option>
                      <option value="1000000">1,000,000đ/ngày</option>
                    </select>
                  </div>
                  <button class="btn btn-success" onclick="saveAutoPaySettings()">Lưu cài đặt</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Settings Tab -->
          <div id="settings-tab" class="tab-content">
            <div class="card">
              <h3>⚙️ Cài đặt tài khoản</h3>
              <div class="setting-item">
                <div class="setting-label">
                  <strong>Thông báo đẩy</strong>
                  <p class="muted">Nhận thông báo về trạng thái đổi pin</p>
                </div>
                <div class="toggle-switch active" onclick="toggleSetting(this)"></div>
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <strong>Thông báo email</strong>
                  <p class="muted">Nhận email về hoạt động tài khoản</p>
                </div>
                <div class="toggle-switch" onclick="toggleSetting(this)"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
}

// Staff Dashboard HTML
function getStaffDashboardHTML() {
  return `
    <div id="staffDashboard" class="dashboard">
      <div class="dashboard-header">
        <div class="container">
          <div class="dashboard-nav">
            <div class="brand">
              <div class="logo">
                <svg viewBox="0 0 24 24"><path d="M6 3h6l-1.5 3H7.8L6 3zm12 18h-6l1.5-3h2.7L18 21zM5 9h9l-1.5 3H6.5L5 9zm14 6h-9l1.5-3h6.5L19 15z"/></svg>
              </div>
              Dashboard Nhân Viên
            </div>
            <div class="user-info">
              <div class="user-avatar">${auth.currentUser.name.charAt(0)}</div>
              <span>${auth.currentUser.name} (${auth.currentUser.role})</span>
              <button class="logout-btn" onclick="logout()">Đăng xuất</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="dashboard-content">
        <div class="container">
          <h2>Dashboard Nhân Viên</h2>
          <p>Chức năng nhân viên đang được phát triển...</p>
        </div>
      </div>
    </div>
  `;
}

// Admin Dashboard HTML  
function getAdminDashboardHTML() {
  return `
    <div id="adminDashboard" class="dashboard">
      <div class="dashboard-header">
        <div class="container">
          <div class="dashboard-nav">
            <div class="brand">
              <div class="logo">
                <svg viewBox="0 0 24 24"><path d="M6 3h6l-1.5 3H7.8L6 3zm12 18h-6l1.5-3h2.7L18 21zM5 9h9l-1.5 3H6.5L5 9zm14 6h-9l1.5-3h6.5L19 15z"/></svg>
              </div>
              Dashboard Quản Trị
            </div>
            <div class="user-info">
              <div class="user-avatar">${auth.currentUser.name.charAt(0)}</div>
              <span>${auth.currentUser.name} (${auth.currentUser.role})</span>
              <button class="logout-btn" onclick="logout()">Đăng xuất</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="dashboard-content">
        <div class="container">
          <h2>Dashboard Quản Trị</h2>
          <p>Chức năng quản trị đang được phát triển...</p>
        </div>
      </div>
    </div>
  `;
}

function logout() {
  if (confirm('Bạn có chắc muốn đăng xuất?')) {
    auth.logout();
    showToast('Đã đăng xuất thành công', 'success');
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Check for existing session
  if (auth.checkSession()) {
    showDashboard(auth.currentUser.role);
  }
  
  // Initialize map
  initMap();
  
  // Clear any stuck modals
  const modals = ['loginModal', 'registerModal', 'payment-modal', 'contract-modal'];
  modals.forEach(modalId => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
    }
  });
});

// Map initialization
function initMap() {
  if (map) return;
  
  map = L.map('map').setView([16.0678, 108.2208], 6);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  stations.forEach((station, index) => {
    const color = station.status === 'active' ? '#19c37d' : '#ff5573';
    const icon = L.divIcon({
      html: `<div style="background: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">${station.pins}</div>`,
      iconSize: [30, 30],
      className: 'custom-div-icon'
    });

    const marker = L.marker([station.lat, station.lng], { icon })
      .addTo(map)
      .bindPopup(`
        <div style="min-width: 200px;">
          <strong>${station.name}</strong><br>
          📍 ${station.area}<br>
          🔋 ${station.pins} pin sẵn sàng<br>
          📊 Trạng thái: ${station.status === 'active' ? 'Hoạt động' : 'Bảo trì'}
        </div>
      `);

    marker.on('click', () => {
      updateSelectedStation(station);
    });
  });
}

function updateSelectedStation(station) {
  const selectedDiv = document.getElementById('selected-station');
  selectedDiv.innerHTML = `
    <h3>${station.name}</h3>
    <p><strong>📍 Địa chỉ:</strong> ${station.area}</p>
    <p><strong>🔋 Pin sẵn sàng:</strong> ${station.pins}</p>
    <p><strong>📊 Trạng thái:</strong> <span class="status ${station.status === 'active' ? 'success' : 'danger'}">${station.status === 'active' ? 'Hoạt động' : 'Bảo trì'}</span></p>
    ${station.status === 'active' ? '<button class="btn btn-primary" onclick="showLogin()">Đổi pin tại đây</button>' : ''}
  `;
}