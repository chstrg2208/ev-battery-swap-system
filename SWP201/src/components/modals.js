// Modal Components

// Create Login Modal
function createLoginModal() {
  return `
    <div id="loginModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Đăng nhập hệ thống</h3>
          <button class="close-btn" onclick="closeModal('loginModal')">&times;</button>
        </div>
        <form id="loginForm" onsubmit="return handleLogin(event)">
          <div class="form-group">
            <label for="username">Tên đăng nhập / Email</label>
            <input id="username" type="text" required placeholder="admin@example.com" />
          </div>
          <div class="form-group">
            <label for="password">Mật khẩu</label>
            <input id="password" type="password" required placeholder="••••••••" />
          </div>
          <div class="form-group">
            <label for="userRole">Vai trò</label>
            <select id="userRole" required>
              <option value="">Chọn vai trò</option>
              <option value="user">Người dùng</option>
              <option value="staff">Nhân viên</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Đăng nhập</button>
            <button type="button" class="btn" onclick="showRegister()">Đăng ký tài khoản</button>
          </div>
        </form>
        <div class="demo-accounts">
          <h4>Tài khoản demo:</h4>
          <div class="demo-grid">
            <button class="demo-btn" onclick="quickLogin('user', 'user@demo.com', '123456')">
              👤 User Demo
            </button>
            <button class="demo-btn" onclick="quickLogin('staff', 'staff@demo.com', '123456')">
              👨‍💼 Staff Demo
            </button>
            <button class="demo-btn" onclick="quickLogin('admin', 'admin@demo.com', '123456')">
              ⚙️ Admin Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Create Register Modal
function createRegisterModal() {
  return `
    <div id="registerModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Đăng ký tài khoản</h3>
          <button class="close-btn" onclick="closeModal('registerModal')">&times;</button>
        </div>
        <form id="registerForm" onsubmit="return handleRegister(event)">
          <div class="form-row">
            <div class="form-group">
              <label for="regName">Họ và tên</label>
              <input id="regName" type="text" required placeholder="Nguyễn Văn A" />
            </div>
            <div class="form-group">
              <label for="regPhone">Số điện thoại</label>
              <input id="regPhone" type="tel" required placeholder="09xx xxx xxx" />
            </div>
          </div>
          <div class="form-group">
            <label for="regEmail">Email</label>
            <input id="regEmail" type="email" required placeholder="example@email.com" />
          </div>
          <div class="form-group">
            <label for="regPassword">Mật khẩu</label>
            <input id="regPassword" type="password" required placeholder="••••••••" />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Đăng ký</button>
            <button type="button" class="btn" onclick="showLogin()">Đã có tài khoản</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// Load modals on page load
function loadModals() {
  const container = document.getElementById('modals-container');
  if (container) {
    container.innerHTML = createLoginModal() + createRegisterModal();
  }
}

// Initialize modals when DOM is loaded
document.addEventListener('DOMContentLoaded', loadModals);