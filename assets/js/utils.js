/**
 * Utility Functions
 * Common functions used across the application
 */

// Toast notifications
function showToast(message, type = 'info') {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.toast');
  existingToasts.forEach(toast => toast.remove());

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  // Add icon based on type
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  toast.innerHTML = `${icons[type] || icons.info} ${message}`;

  document.body.appendChild(toast);

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 3000);
}

// Modal management
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'block';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
});

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

// Format date
function formatDate(date) {
  return new Date(date).toLocaleDateString('vi-VN');
}

// Format time
function formatTime(date) {
  return new Date(date).toLocaleTimeString('vi-VN');
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number (Vietnamese format)
function isValidPhone(phone) {
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
  return phoneRegex.test(phone);
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Local storage helpers
const Storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Error saving to localStorage:', e);
      return false;
    }
  },
  
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return defaultValue;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Error removing from localStorage:', e);
      return false;
    }
  },
  
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error('Error clearing localStorage:', e);
      return false;
    }
  }
};

// API simulation helpers
const API = {
  async request(endpoint, options = {}) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Simulate random failures (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('Network error');
    }
    
    // Mock response based on endpoint
    return this.mockResponse(endpoint, options);
  },
  
  mockResponse(endpoint, options) {
    // Mock different endpoints
    switch (endpoint) {
      case '/auth/login':
        return { success: true, token: 'mock-jwt-token' };
      case '/auth/register':
        return { success: true, user: { id: generateId(), ...options.body } };
      case '/stations':
        return { success: true, data: this.getStationsData() };
      case '/payment/process':
        return { success: true, transactionId: generateId() };
      default:
        return { success: true, data: null };
    }
  },
  
  getStationsData() {
    return [
      {
        id: 'station1',
        name: 'Trạm Quận 1 - Nguyễn Huệ',
        address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
        coordinates: [10.7769, 106.7009],
        status: 'active',
        posts: 3
      },
      {
        id: 'station2', 
        name: 'Trạm Quận 7 - Phú Mỹ Hưng',
        address: '456 Nguyễn Văn Linh, Quận 7, TP.HCM',
        coordinates: [10.7285, 106.7317],
        status: 'active',
        posts: 2
      },
      {
        id: 'station3',
        name: 'Trạm Thủ Đức - Khu Công Nghệ Cao',
        address: '789 Xa Lộ Hà Nội, Thủ Đức, TP.HCM',
        coordinates: [10.8480, 106.7717],
        status: 'active',
        posts: 1
      },
      {
        id: 'station4',
        name: 'Trạm Bình Thạnh - Vincom',
        address: '321 Điện Biên Phủ, Bình Thạnh, TP.HCM',
        coordinates: [10.8022, 106.7134],
        status: 'maintenance',
        posts: 1
      }
    ];
  }
};

// Event emitter for app-wide communication
class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  
  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }
  
  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }
}

// Global event emitter instance
const eventBus = new EventEmitter();

// Form validation helpers
const Validation = {
  required(value, fieldName) {
    if (!value || value.trim() === '') {
      return `${fieldName} là bắt buộc`;
    }
    return null;
  },
  
  email(value) {
    if (!isValidEmail(value)) {
      return 'Email không hợp lệ';
    }
    return null;
  },
  
  phone(value) {
    if (!isValidPhone(value)) {
      return 'Số điện thoại không hợp lệ';
    }
    return null;
  },
  
  minLength(value, length, fieldName) {
    if (value.length < length) {
      return `${fieldName} phải có ít nhất ${length} ký tự`;
    }
    return null;
  },
  
  maxLength(value, length, fieldName) {
    if (value.length > length) {
      return `${fieldName} không được vượt quá ${length} ký tự`;
    }
    return null;
  },
  
  validateForm(formData, rules) {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
      const value = formData[field];
      const fieldRules = rules[field];
      
      fieldRules.forEach(rule => {
        if (errors[field]) return; // Skip if already has error
        
        const error = this[rule.type](value, ...rule.params);
        if (error) {
          errors[field] = error;
        }
      });
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

// DOM helpers
const DOM = {
  ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  },
  
  createElement(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.innerHTML = content;
    return element;
  },
  
  show(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => el.style.display = 'block');
  },
  
  hide(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => el.style.display = 'none');
  },
  
  toggle(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.style.display = el.style.display === 'none' ? 'block' : 'none';
    });
  }
};

// Initialize app when DOM is ready
DOM.ready(() => {
  console.log('SWP201 Battery Swap System Loaded');
  
  // Initialize global error handling
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showToast('Có lỗi xảy ra. Vui lòng thử lại.', 'error');
  });
  
  // Initialize global unhandled promise rejection handling
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showToast('Có lỗi xảy ra. Vui lòng thử lại.', 'error');
    event.preventDefault();
  });
});