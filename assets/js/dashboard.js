/**
 * Dashboard Management System
 * Handles different user roles dashboards and navigation
 */
class DashboardManager {
  constructor() {
    this.currentDashboard = null;
  }

  showDashboard() {
    if (!auth.isLoggedIn()) {
      showToast('Vui lòng đăng nhập trước', 'error');
      return;
    }

    document.querySelector('main').style.display = 'none';
    document.querySelector('header').style.display = 'none';
    document.querySelector('footer').style.display = 'none';

    const role = auth.getCurrentUser().role;
    let dashboardId = role + 'Dashboard';
    
    if (!document.getElementById(dashboardId)) {
      this.createDashboard(role);
    }

    document.querySelectorAll('.dashboard').forEach(d => d.classList.remove('active'));
    document.getElementById(dashboardId).classList.add('active');
    this.currentDashboard = dashboardId;
  }

  showLandingPage() {
    document.querySelectorAll('.dashboard').forEach(d => d.classList.remove('active'));
    document.querySelector('main').style.display = 'block';
    document.querySelector('header').style.display = 'block';
    document.querySelector('footer').style.display = 'block';
    this.currentDashboard = null;
  }

  createDashboard(role) {
    const dashboardHtml = this.getDashboardHtml(role);
    document.body.insertAdjacentHTML('beforeend', dashboardHtml);
  }

  getDashboardHtml(role) {
    switch(role) {
      case 'user':
        return this.getUserDashboardHtml();
      case 'staff':
        return this.getStaffDashboardHtml();
      case 'admin':
        return this.getAdminDashboardHtml();
      default:
        return this.getUserDashboardHtml();
    }
  }

  getUserDashboardHtml() {
    const user = auth.getCurrentUser();
    return `
      <div id="userDashboard" class="dashboard">
        <div class="dashboard-header">
          <div class="user-info">
            <div class="avatar">👤</div>
            <div>
              <h2>Xin chào, ${user.name}!</h2>
              <p class="muted">Chào mừng bạn đến với SWP201</p>
            </div>
          </div>
          <button class="btn btn-outline" onclick="logout()">Đăng xuất</button>
        </div>

        <div class="dashboard-nav">
          <div class="nav-tabs">
            <button class="nav-tab active" onclick="showUserTab('overview')">📊 Tổng quan</button>
            <button class="nav-tab" onclick="showUserTab('battery-swap')">🔋 Đổi pin</button>
            <button class="nav-tab" onclick="showUserTab('battery-health')">💊 Tình trạng pin</button>
            <button class="nav-tab" onclick="showUserTab('history')">📋 Lịch sử</button>
            <button class="nav-tab" onclick="showUserTab('plans')">📦 Gói dịch vụ</button>
            <button class="nav-tab" onclick="showUserTab('map')">🗺️ Bản đồ</button>
          </div>
        </div>

        <div class="dashboard-content">
          ${this.getUserOverviewTab()}
          ${this.getUserBatterySwapTab()}
          ${this.getUserBatteryHealthTab()}
          ${this.getUserHistoryTab()}
          ${this.getUserPlansTab()}
          ${this.getUserMapTab()}
        </div>
      </div>
    `;
  }

  getUserOverviewTab() {
    const user = auth.getCurrentUser();
    return `
      <div id="overview-tab" class="tab-content active">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🔋</div>
            <div class="stat-value">12</div>
            <div class="stat-label">Lần đổi pin</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-value">1.2M</div>
            <div class="stat-label">Đã tiết kiệm</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📦</div>
            <div class="stat-value">${user.plan === 'premium' ? 'Premium' : user.plan === 'enterprise' ? 'Enterprise' : 'Cơ bản'}</div>
            <div class="stat-label">Gói hiện tại</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-value">4.8</div>
            <div class="stat-label">Đánh giá</div>
          </div>
        </div>

        <div class="grid" style="grid-template-columns: 2fr 1fr; gap: 24px;">
          <div class="card">
            <h3>📈 Thống kê sử dụng</h3>
            <div class="chart-placeholder">
              <div class="chart-bar" style="height: 60%;">T2</div>
              <div class="chart-bar" style="height: 80%;">T3</div>
              <div class="chart-bar" style="height: 40%;">T4</div>
              <div class="chart-bar" style="height: 90%;">T5</div>
              <div class="chart-bar" style="height: 70%;">T6</div>
              <div class="chart-bar" style="height: 30%;">T7</div>
              <div class="chart-bar" style="height: 50%;">CN</div>
            </div>
          </div>
          
          <div class="card">
            <h3>Gói dịch vụ hiện tại</h3>
            <div class="current-plan">
              <div class="plan-icon">📦</div>
              <div class="plan-info">
                <div class="plan-name">${user.plan === 'premium' ? 'Premium' : user.plan === 'enterprise' ? 'Enterprise' : 'Cơ bản'}</div>
                <div class="plan-expires">Hết hạn: ${user.planExpiry ? new Date(user.planExpiry).toLocaleDateString('vi-VN') : 'Không có'}</div>
              </div>
            </div>
            <button class="btn btn-primary" style="width: 100%;" onclick="showUserTab('plans')">Xem gói khác</button>
          </div>
        </div>

        <div class="card">
          <h3>🏃‍♂️ Hoạt động gần đây</h3>
          <div class="activity-list">
            <div class="activity-item">
              <div class="activity-icon">🔋</div>
              <div class="activity-content">
                <div class="activity-title">Đổi pin thành công</div>
                <div class="activity-time">2 giờ trước • Trạm Quận 1</div>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon">💳</div>
              <div class="activity-content">
                <div class="activity-title">Thanh toán gói Premium</div>
                <div class="activity-time">1 ngày trước • 299.000đ</div>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon">📍</div>
              <div class="activity-content">
                <div class="activity-title">Đã check-in tại trạm</div>
                <div class="activity-time">3 ngày trước • Trạm Quận 7</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getUserBatterySwapTab() {
    return `
      <div id="battery-swap-tab" class="tab-content">
        <h2>🔋 Đổi pin thông minh</h2>
        <p class="muted">Chọn trạm và trụ đổi pin phù hợp với bạn</p>
        
        <div class="form-group">
          <label>Chọn trạm đổi pin</label>
          <select id="station-select" onchange="loadStationPosts()">
            <option value="">Chọn trạm gần bạn...</option>
            <option value="station1">🏢 Trạm Quận 1 - Nguyễn Huệ</option>
            <option value="station2">🏪 Trạm Quận 7 - Phú Mỹ Hưng</option>
            <option value="station3">🏬 Trạm Thủ Đức - Khu Công Nghệ Cao</option>
            <option value="station4">🏭 Trạm Bình Thạnh - Vincom</option>
          </select>
        </div>

        <div id="post-grid" style="display: none;">
          <h3>Chọn trụ đổi pin</h3>
          <div id="posts-container" class="posts-grid"></div>
          
          <div id="selected-post-info" style="display: none;">
            <div class="card">
              <div id="post-details"></div>
            </div>
          </div>
          
          <div id="slot-selection" style="display: none;">
            <h4>Chọn slot pin</h4>
            <div class="slot-legend">
              <span class="legend-item"><div class="slot-demo ready"></div> Sẵn sàng (100%)</span>
              <span class="legend-item"><div class="slot-demo charging"></div> Đang sạc</span>
              <span class="legend-item"><div class="slot-demo empty"></div> Trống</span>
            </div>
            <div id="slot-grid" class="slot-grid"></div>
            <button id="start-swap-btn" class="btn btn-primary" onclick="startBatterySwap()" disabled>
              Chọn slot để lấy pin...
            </button>
          </div>
        </div>

        <div id="no-station" class="empty-state">
          <div class="empty-icon">🏢</div>
          <h3>Chọn trạm đổi pin</h3>
          <p>Vui lòng chọn trạm để xem các trụ đổi pin có sẵn</p>
        </div>
      </div>
    `;
  }

  getUserBatteryHealthTab() {
    return `
      <div id="battery-health-tab" class="tab-content">
        <div id="batteryHealthContent">
          <div class="loading-message">
            <div class="loading-spinner">🔄</div>
            <p>Đang tải thông tin pin...</p>
          </div>
        </div>
      </div>
    `;
  }

  getUserHistoryTab() {
    return `
      <div id="history-tab" class="tab-content">
        <h2>📋 Lịch sử giao dịch</h2>
        <p class="muted">Theo dõi các giao dịch và hoạt động của bạn</p>
        
        <div class="form-group">
          <select id="history-filter">
            <option value="all">Tất cả giao dịch</option>
            <option value="battery-swap">Đổi pin</option>
            <option value="payment">Thanh toán</option>
            <option value="plan-purchase">Mua gói</option>
          </select>
        </div>

        <div class="card">
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Mô tả</th>
                  <th>Số tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody id="history-table-body">
                <tr>
                  <td>01/10/2024</td>
                  <td>Đổi pin tại trạm Quận 1</td>
                  <td class="amount-negative">89.000đ</td>
                  <td><span class="status success">Thành công</span></td>
                </tr>
                <tr>
                  <td>28/09/2024</td>
                  <td>Mua gói Premium</td>
                  <td class="amount-negative">299.000đ</td>
                  <td><span class="status success">Thành công</span></td>
                </tr>
                <tr>
                  <td>25/09/2024</td>
                  <td>Nạp tiền vào tài khoản</td>
                  <td class="amount-positive">+500.000đ</td>
                  <td><span class="status success">Thành công</span></td>
                </tr>
                <tr>
                  <td>22/09/2024</td>
                  <td>Đổi pin tại trạm Quận 7</td>
                  <td class="amount-negative">89.000đ</td>
                  <td><span class="status success">Thành công</span></td>
                </tr>
                <tr>
                  <td>20/09/2024</td>
                  <td>Gói Premium</td>
                  <td class="amount-negative">299.000đ</td>
                  <td><span class="status success">Thành công</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  getUserPlansTab() {
    return `
      <div id="plans-tab" class="tab-content">
        <h2>📦 Chọn gói dịch vụ phù hợp</h2>
        <p class="muted">Tiết kiệm chi phí với các gói dịch vụ linh hoạt</p>
        
        <div class="pricing">
          <div class="card">
            <h3>Cơ bản</h3>
            <div class="price">89.000đ/lượt</div>
            <ul class="clean">
              <li><span class="tick">✓</span> Thanh toán theo lượt</li>
              <li><span class="tick">✓</span> Không cam kết dài hạn</li>
              <li><span class="tick">✓</span> Phù hợp sử dụng thỉnh thoảng</li>
              <li><span class="tick">✓</span> Hỗ trợ qua hotline</li>
            </ul>
            <button class="btn" onclick="selectPlan('basic')">Đang sử dụng</button>
          </div>
          
          <div class="card featured">
            <h3>Premium <span class="chip">Phổ biến</span></h3>
            <div class="price">299.000đ/tháng</div>
            <div class="muted">Tiết kiệm 46% so với trả theo lượt</div>
            <ul class="clean">
              <li><span class="tick">✓</span> 8 lượt đổi pin/tháng</li>
              <li><span class="tick">✓</span> Ưu tiên tại trạm</li>
              <li><span class="tick">✓</span> Hỗ trợ 24/7</li>
              <li><span class="tick">✓</span> Báo cáo chi tiết</li>
              <li><span class="tick">✓</span> Miễn phí lượt đầu mỗi ngày</li>
            </ul>
            <button class="btn btn-primary" onclick="purchasePlan('premium', 'Gói Premium', 299000, '8 lượt đổi pin/tháng • Ưu tiên tại trạm • Hỗ trợ 24/7')">Mua gói này</button>
          </div>
          
          <div class="card">
            <h3>Enterprise</h3>
            <div class="price">899.000đ/tháng</div>
            <div class="muted">Cho doanh nghiệp vận tải</div>
            <ul class="clean">
              <li><span class="tick">✓</span> Không giới hạn lượt đổi</li>
              <li><span class="tick">✓</span> API tích hợp</li>
              <li><span class="tick">✓</span> Dashboard quản lý đội xe</li>
              <li><span class="tick">✓</span> Hỗ trợ kỹ thuật riêng</li>
              <li><span class="tick">✓</span> Báo cáo tùy chỉnh</li>
            </ul>
            <button class="btn btn-primary" onclick="purchasePlan('enterprise', 'Gói Enterprise', 899000, 'Không giới hạn lượt đổi • API tích hợp • Dashboard quản lý đội xe')">Mua gói này</button>
          </div>
        </div>

        <div class="card" style="margin-top: 24px;">
          <h3>💰 Nạp tiền vào tài khoản</h3>
          <p class="muted">Nạp trước để thanh toán nhanh chóng hơn</p>
          <div class="grid" style="grid-template-columns: 2fr 1fr; gap: 24px;">
            <div class="form-group">
              <label>Số tiền muốn nạp</label>
              <select>
                <option>100.000đ</option>
                <option>200.000đ</option>
                <option>500.000đ</option>
                <option>1.000.000đ</option>
              </select>
            </div>
            <div style="display: flex; align-items: end;">
              <button class="btn btn-primary">Nạp tiền</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getUserMapTab() {
    return `
      <div id="map-tab" class="tab-content">
        <h2>🗺️ Bản đồ trạm đổi pin</h2>
        <p class="muted">Tìm trạm đổi pin gần bạn nhất</p>
        
        <div class="map-container">
          <div id="map" style="height: 400px; border-radius: 8px;"></div>
        </div>
        
        <div class="map-info">
          <h3>🏢 Thông tin trạm đã chọn</h3>
          <div id="station-info">
            <p class="muted">Chọn một trạm trên bản đồ để xem thông tin chi tiết</p>
          </div>
        </div>
      </div>
    `;
  }

  getStaffDashboardHtml() {
    const user = auth.getCurrentUser();
    return `
      <div id="staffDashboard" class="dashboard">
        <div class="dashboard-header">
          <div class="user-info">
            <div class="avatar">👨‍💼</div>
            <div>
              <h2>Staff Dashboard - ${user.name}</h2>
              <p class="muted">Quản lý vận hành trạm đổi pin</p>
            </div>
          </div>
          <button class="btn btn-outline" onclick="logout()">Đăng xuất</button>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">⚡</div>
            <div class="stat-value">45</div>
            <div class="stat-label">Đổi pin hôm nay</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🔋</div>
            <div class="stat-value">82%</div>
            <div class="stat-label">Pin sẵn sàng</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⚠️</div>
            <div class="stat-value">3</div>
            <div class="stat-label">Cảnh báo</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-value">128</div>
            <div class="stat-label">Khách hàng</div>
          </div>
        </div>

        <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 24px;">
          <div class="card">
            <h3>🚨 Cảnh báo hệ thống</h3>
            <div class="alert-list">
              <div class="alert-item warning">
                <div class="alert-icon">⚠️</div>
                <div class="alert-content">
                  <div class="alert-title">Pin slot A1-5 cần bảo trì</div>
                  <div class="alert-time">15 phút trước</div>
                </div>
              </div>
              <div class="alert-item error">
                <div class="alert-icon">🔴</div>
                <div class="alert-content">
                  <div class="alert-title">Trụ B2 offline</div>
                  <div class="alert-time">1 giờ trước</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card">
            <h3>📊 Hiệu suất hôm nay</h3>
            <div class="performance-chart">
              <div class="chart-placeholder">
                <div class="chart-bar" style="height: 70%;">6h</div>
                <div class="chart-bar" style="height: 85%;">8h</div>
                <div class="chart-bar" style="height: 60%;">10h</div>
                <div class="chart-bar" style="height: 90%;">12h</div>
                <div class="chart-bar" style="height: 95%;">14h</div>
                <div class="chart-bar" style="height: 80%;">16h</div>
                <div class="chart-bar" style="height: 75%;">18h</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getAdminDashboardHtml() {
    const user = auth.getCurrentUser();
    return `
      <div id="adminDashboard" class="dashboard">
        <div class="dashboard-header">
          <div class="user-info">
            <div class="avatar">👨‍💻</div>
            <div>
              <h2>Admin Dashboard - ${user.name}</h2>
              <p class="muted">Quản trị hệ thống SWP201</p>
            </div>
          </div>
          <button class="btn btn-outline" onclick="logout()">Đăng xuất</button>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-value">1,248</div>
            <div class="stat-label">Tổng người dùng</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏢</div>
            <div class="stat-value">15</div>
            <div class="stat-label">Trạm hoạt động</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-value">45.2M</div>
            <div class="stat-label">Doanh thu tháng</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📈</div>
            <div class="stat-value">+12%</div>
            <div class="stat-label">Tăng trưởng</div>
          </div>
        </div>

        <div class="grid" style="grid-template-columns: 2fr 1fr; gap: 24px;">
          <div class="card">
            <h3>📈 Biểu đồ doanh thu</h3>
            <div class="revenue-chart">
              <div class="chart-placeholder">
                <div class="chart-bar" style="height: 60%;">T1</div>
                <div class="chart-bar" style="height: 75%;">T2</div>
                <div class="chart-bar" style="height: 85%;">T3</div>
                <div class="chart-bar" style="height: 70%;">T4</div>
                <div class="chart-bar" style="height: 90%;">T5</div>
                <div class="chart-bar" style="height: 95%;">T6</div>
                <div class="chart-bar" style="height: 80%;">T7</div>
              </div>
            </div>
          </div>
          
          <div class="card">
            <h3>🎯 KPI tháng này</h3>
            <div class="kpi-list">
              <div class="kpi-item">
                <div class="kpi-label">Uptime hệ thống</div>
                <div class="kpi-value">99.8%</div>
                <div class="kpi-progress">
                  <div class="progress-bar" style="width: 99.8%"></div>
                </div>
              </div>
              <div class="kpi-item">
                <div class="kpi-label">Hài lòng khách hàng</div>
                <div class="kpi-value">4.7/5</div>
                <div class="kpi-progress">
                  <div class="progress-bar" style="width: 94%"></div>
                </div>
              </div>
              <div class="kpi-item">
                <div class="kpi-label">Mục tiêu doanh thu</div>
                <div class="kpi-value">78%</div>
                <div class="kpi-progress">
                  <div class="progress-bar" style="width: 78%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// Global instance
const dashboardManager = new DashboardManager();

// Tab management for user dashboard
function showUserTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected tab
  document.getElementById(tabName + '-tab').classList.add('active');
  
  // Update nav buttons
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.classList.remove('active');
  });
  
  event.target.classList.add('active');
  
  // Special handling for map tab
  if (tabName === 'map') {
    setTimeout(() => {
      initMap();
    }, 100);
  }
  
  // Special handling for battery health tab
  if (tabName === 'battery-health') {
    setTimeout(() => {
      if (window.batteryHealthSystem) {
        const content = window.batteryHealthSystem.renderDashboard();
        document.getElementById('batteryHealthContent').innerHTML = content;
      } else {
        // Initialize battery health system if not exists
        window.batteryHealthSystem = new BatteryHealthSystem();
        const content = window.batteryHealthSystem.renderDashboard();
        document.getElementById('batteryHealthContent').innerHTML = content;
      }
    }, 100);
  }
}

// Global functions for backward compatibility
function showDashboard() {
  dashboardManager.showDashboard();
}

function showLandingPage() {
  dashboardManager.showLandingPage();
}