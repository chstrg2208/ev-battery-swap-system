/**
 * Authentication System
 * Handles login, register, forgot password functionality
 */
class AuthSystem {
  constructor() {
    this.currentUser = null;
    this.users = [
      { email: 'demo@user.com', password: '123456', role: 'user', name: 'Nguyễn Văn Demo', phone: '0123456789', plan: 'basic' },
      { email: 'staff@swp201.com', password: '123456', role: 'staff', name: 'Trần Thị Staff', phone: '0987654321', plan: 'premium' },
      { email: 'admin@swp201.com', password: '123456', role: 'admin', name: 'Lê Văn Admin', phone: '0555666777', plan: 'enterprise' }
    ];
    this.loadUserData();
  }

  loadUserData() {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  login(email, password) {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUser = { ...user };
      localStorage.setItem('userData', JSON.stringify(this.currentUser));
      return { success: true, user: this.currentUser };
    }
    return { success: false, message: 'Email hoặc mật khẩu không đúng' };
  }

  register(userData) {
    // Check if email already exists
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      return { success: false, message: 'Email đã được sử dụng' };
    }

    // Validate required fields
    if (!userData.email || !userData.password || !userData.name || !userData.phone) {
      return { success: false, message: 'Vui lòng điền đầy đủ thông tin' };
    }

    // Create new user
    const newUser = {
      ...userData,
      role: 'user',
      plan: 'basic',
      registeredAt: new Date().toISOString()
    };

    this.users.push(newUser);
    
    // Auto login after register
    this.currentUser = { ...newUser };
    localStorage.setItem('userData', JSON.stringify(this.currentUser));
    
    return { success: true, user: this.currentUser };
  }

  forgotPassword(email) {
    const user = this.users.find(u => u.email === email);
    if (!user) {
      return { success: false, message: 'Email không tồn tại trong hệ thống' };
    }

    // In real app, send email with reset link
    // For demo, just return success
    return { 
      success: true, 
      message: 'Đã gửi email reset mật khẩu. Vui lòng kiểm tra hộp thư của bạn.' 
    };
  }

  resetPassword(email, newPassword, resetCode) {
    const user = this.users.find(u => u.email === email);
    if (!user) {
      return { success: false, message: 'Email không tồn tại' };
    }

    // In demo, accept any reset code for simplicity
    if (resetCode !== '123456') {
      return { success: false, message: 'Mã xác nhận không đúng' };
    }

    // Update password
    user.password = newPassword;
    
    return { success: true, message: 'Đổi mật khẩu thành công' };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('userData');
    return { success: true };
  }

  updateProfile(userData) {
    if (!this.currentUser) {
      return { success: false, message: 'Chưa đăng nhập' };
    }

    // Update current user
    this.currentUser = { ...this.currentUser, ...userData };
    localStorage.setItem('userData', JSON.stringify(this.currentUser));

    // Update in users array
    const userIndex = this.users.findIndex(u => u.email === this.currentUser.email);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.currentUser };
    }

    return { success: true, user: this.currentUser };
  }

  changePassword(currentPassword, newPassword) {
    if (!this.currentUser) {
      return { success: false, message: 'Chưa đăng nhập' };
    }

    if (this.currentUser.password !== currentPassword) {
      return { success: false, message: 'Mật khẩu hiện tại không đúng' };
    }

    this.currentUser.password = newPassword;
    localStorage.setItem('userData', JSON.stringify(this.currentUser));

    // Update in users array
    const userIndex = this.users.findIndex(u => u.email === this.currentUser.email);
    if (userIndex !== -1) {
      this.users[userIndex].password = newPassword;
    }

    return { success: true, message: 'Đổi mật khẩu thành công' };
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  hasRole(role) {
    return this.currentUser && this.currentUser.role === role;
  }
}

// Auth UI Controllers
class AuthUI {
  constructor(authSystem) {
    this.auth = authSystem;
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Login form
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'login-form') {
        e.preventDefault();
        this.handleLogin();
      } else if (e.target.id === 'register-form') {
        e.preventDefault();
        this.handleRegister();
      } else if (e.target.id === 'forgot-password-form') {
        e.preventDefault();
        this.handleForgotPassword();
      } else if (e.target.id === 'reset-password-form') {
        e.preventDefault();
        this.handleResetPassword();
      }
    });
  }

  handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const result = this.auth.login(email, password);
    
    if (result.success) {
      showToast('Đăng nhập thành công!', 'success');
      this.hideAuthModals();
      window.dashboardManager.showDashboard();
    } else {
      showToast(result.message, 'error');
    }
  }

  handleRegister() {
    const userData = {
      name: document.getElementById('register-name').value,
      email: document.getElementById('register-email').value,
      phone: document.getElementById('register-phone').value,
      password: document.getElementById('register-password').value,
      confirmPassword: document.getElementById('register-confirm-password').value
    };

    if (userData.password !== userData.confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp', 'error');
      return;
    }

    const result = this.auth.register(userData);
    
    if (result.success) {
      showToast('Đăng ký thành công!', 'success');
      this.hideAuthModals();
      window.dashboardManager.showDashboard();
    } else {
      showToast(result.message, 'error');
    }
  }

  handleForgotPassword() {
    const email = document.getElementById('forgot-email').value;
    
    const result = this.auth.forgotPassword(email);
    
    if (result.success) {
      showToast(result.message, 'success');
      // Show reset password form
      this.showResetPasswordForm(email);
    } else {
      showToast(result.message, 'error');
    }
  }

  handleResetPassword() {
    const email = document.getElementById('reset-email').value;
    const resetCode = document.getElementById('reset-code').value;
    const newPassword = document.getElementById('reset-new-password').value;
    const confirmPassword = document.getElementById('reset-confirm-password').value;

    if (newPassword !== confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp', 'error');
      return;
    }

    const result = this.auth.resetPassword(email, newPassword, resetCode);
    
    if (result.success) {
      showToast(result.message, 'success');
      this.hideAuthModals();
      this.showLoginModal();
    } else {
      showToast(result.message, 'error');
    }
  }

  showLoginModal() {
    document.getElementById('auth-modal').style.display = 'block';
    this.showAuthTab('login');
  }

  showRegisterModal() {
    document.getElementById('auth-modal').style.display = 'block';
    this.showAuthTab('register');
  }

  showForgotPasswordModal() {
    document.getElementById('auth-modal').style.display = 'block';
    this.showAuthTab('forgot-password');
  }

  showResetPasswordForm(email) {
    document.getElementById('reset-email').value = email;
    this.showAuthTab('reset-password');
  }

  hideAuthModals() {
    document.getElementById('auth-modal').style.display = 'none';
  }

  showAuthTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.style.display = 'none';
    });
    
    // Show selected tab
    document.getElementById(tabName + '-tab').style.display = 'block';
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[onclick="authUI.showAuthTab('${tabName}')"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
  }

  logout() {
    this.auth.logout();
    showToast('Đã đăng xuất', 'success');
    window.dashboardManager.showLandingPage();
  }
}

// Global instances
const auth = new AuthSystem();
const authUI = new AuthUI(auth);

// Global functions for backward compatibility
function showLogin() {
  authUI.showLoginModal();
}

function showRegister() {
  authUI.showRegisterModal();
}

function logout() {
  authUI.logout();
}