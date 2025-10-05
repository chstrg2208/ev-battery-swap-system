// Dashboard Functions

// User Dashboard
function initUserDashboard() {
  showUserTab('overview');
  updateUserInfo();
}

function showUserTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Remove active class from all tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected tab content
  const tabContent = document.getElementById(tabName + '-tab');
  if (tabContent) {
    tabContent.classList.add('active');
  }
  
  // Add active class to selected tab
  const activeTab = document.querySelector(`[onclick="showUserTab('${tabName}')"]`);
  if (activeTab) {
    activeTab.classList.add('active');
  }
  
  // Initialize specific tab content
  switch(tabName) {
    case 'map':
      initUserMap();
      break;
    case 'battery-swap':
      initBatterySwap();
      break;
    case 'battery-health':
      initBatteryHealth();
      break;
    case 'payment':
      initPaymentTab();
      break;
  }
}

function updateUserInfo() {
  if (auth.currentUser) {
    const user = auth.currentUser;
    const avatars = document.querySelectorAll('.user-avatar');
    avatars.forEach(avatar => {
      avatar.textContent = user.name.charAt(0).toUpperCase();
    });
  }
}

// Battery Swap Functions
function initBatterySwap() {
  loadStationOptions();
  setupBatterySwapData();
}

function loadStationOptions() {
  const stationSelect = document.getElementById('station-select');
  if (stationSelect) {
    stationSelect.innerHTML = '<option value="">Chọn trạm đổi pin</option>';
    stations.forEach((station, index) => {
      if (station.status === 'active') {
        stationSelect.innerHTML += `<option value="station${index}">${station.name} (${station.pins} pin)</option>`;
      }
    });
  }
}

function setupBatterySwapData() {
  // Setup sample data for battery swap
  globalStationData = {
    'station0': [
      {
        id: 'post1',
        name: 'Trụ A',
        slots: [
          { id: 'A1', status: 'has-battery', battery: '95%' },
          { id: 'A2', status: 'has-battery', battery: '87%' },
          { id: 'A3', status: 'charging', battery: '45%' },
          { id: 'A4', status: 'empty', battery: '0%' }
        ]
      }
    ],
    'station1': [
      {
        id: 'post1',
        name: 'Trụ B',
        slots: [
          { id: 'B1', status: 'has-battery', battery: '92%' },
          { id: 'B2', status: 'has-battery', battery: '89%' },
          { id: 'B3', status: 'has-battery', battery: '76%' },
          { id: 'B4', status: 'maintenance', battery: '0%' }
        ]
      }
    ]
  };
}

function loadStationPosts() {
  const stationSelect = document.getElementById('station-select');
  const selectedValue = stationSelect.value;
  
  if (!selectedValue) {
    document.getElementById('no-station').style.display = 'block';
    document.getElementById('post-grid').style.display = 'none';
    return;
  }
  
  document.getElementById('no-station').style.display = 'none';
  document.getElementById('post-grid').style.display = 'block';
  
  const posts = globalStationData[selectedValue] || [];
  const postGrid = document.getElementById('post-grid');
  
  postGrid.innerHTML = posts.map(post => `
    <div class="post-item" onclick="selectPost('${post.id}', '${selectedValue}')">
      <div style="font-weight: 600;">${post.name}</div>
      <div style="font-size: 12px; color: var(--muted);">
        ${post.slots.filter(s => s.status === 'has-battery').length} pin sẵn sàng
      </div>
    </div>
  `).join('');
  
  updateSwapButton();
}

function selectPost(postId, stationKey) {
  const posts = globalStationData[stationKey];
  selectedPost = posts.find(post => post.id === postId);
  
  if (!selectedPost) return;
  
  // Update UI
  document.querySelectorAll('.post-item').forEach(item => item.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
  
  showSelectedPostInfo();
  updateSwapButton();
}

function showSelectedPostInfo() {
  if (!selectedPost) return;
  
  const infoDiv = document.getElementById('selected-post-info');
  infoDiv.style.display = 'block';
  
  infoDiv.innerHTML = `
    <h4>${selectedPost.name} - Trạng thái pin</h4>
    <div class="slot-grid">
      ${selectedPost.slots.map(slot => `
        <div class="slot-item ${slot.status}" onclick="selectSlot('${slot.id}')">
          ${slot.id}<br><small>${slot.battery}</small>
        </div>
      `).join('')}
    </div>
    <p class="muted">Chọn slot có pin đầy để đổi</p>
  `;
}

function selectSlot(slotId) {
  if (!selectedPost) return;
  
  const slot = selectedPost.slots.find(s => s.id === slotId);
  if (slot && slot.status === 'has-battery') {
    selectedPickupSlot = slot;
    selectedReturnSlot = selectedPost.slots.find(s => s.status === 'empty');
    showToast(`Đã chọn pin ${slotId} (${slot.battery})`, 'success');
    updateSwapButton();
  } else {
    showToast('Chỉ có thể chọn pin đã sạc đầy', 'warning');
  }
}

function updateSwapButton() {
  const swapBtn = document.getElementById('swap-battery-btn');
  if (selectedPost && selectedPickupSlot) {
    swapBtn.disabled = false;
    swapBtn.textContent = '🚀 Bắt đầu đổi pin';
  } else {
    swapBtn.disabled = true;
    swapBtn.textContent = 'Chọn trạm và pin';
  }
}

function startBatterySwap() {
  if (!selectedPost || !selectedPickupSlot) {
    showToast('Vui lòng chọn trạm và pin', 'warning');
    return;
  }
  
  showToast('Đang kết nối với trạm đổi pin...', 'info');
  
  setTimeout(() => {
    showToast('Đổi pin thành công! 🎉', 'success');
    
    // Reset selections
    selectedPost = null;
    selectedPickupSlot = null;
    selectedReturnSlot = null;
    
    // Reset UI
    document.getElementById('station-select').value = '';
    document.getElementById('post-grid').style.display = 'none';
    document.getElementById('no-station').style.display = 'block';
    document.getElementById('selected-post-info').style.display = 'none';
    updateSwapButton();
  }, 3000);
}

// Settings Functions
function toggleSetting(element) {
  element.classList.toggle('active');
  const isActive = element.classList.contains('active');
  showToast(`Cài đặt đã được ${isActive ? 'bật' : 'tắt'}`, 'success');
}

// Payment Sub-Tab Functions
function showPaymentSubTab(tabName) {
  // Hide all payment sub-contents
  document.querySelectorAll('.payment-sub-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Remove active class from all payment sub-tabs
  document.querySelectorAll('.payment-sub-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected payment sub-content
  const tabContent = document.getElementById(tabName + '-subtab');
  if (tabContent) {
    tabContent.classList.add('active');
  }
  
  // Add active class to selected payment sub-tab
  const activeTab = document.querySelector(`[onclick="showPaymentSubTab('${tabName}')"]`);
  if (activeTab) {
    activeTab.classList.add('active');
  }
  
  // Initialize specific payment tab content
  switch(tabName) {
    case 'history':
      initPaymentHistory();
      break;
    case 'payment':
      initPaymentTab();
      break;
    case 'autopay':
      initAutoPayTab();
      break;
  }
}

function initPaymentHistory() {
  // Payment history is already loaded in HTML
}

function initPaymentTab() {
  // Payment methods are already loaded in HTML
}

function initAutoPayTab() {
  // Auto pay settings are already loaded in HTML
}

function selectPaymentMethod(method) {
  document.querySelectorAll('.payment-method').forEach(pm => {
    pm.classList.remove('active');
  });
  
  const selectedMethod = document.querySelector(`[onclick="selectPaymentMethod('${method}')"]`);
  if (selectedMethod) {
    selectedMethod.classList.add('active');
  }
  
  showToast(`Đã chọn phương thức: ${getMethodName(method)}`, 'success');
}

function getMethodName(value) {
  const methods = {
    'card': 'Thẻ tín dụng',
    'bank': 'Chuyển khoản',
    'ewallet': 'Ví điện tử'
  };
  return methods[value] || value;
}

function updateTopUpAmount() {
  const amount = document.getElementById('topup-amount').value;
  console.log('Selected top-up amount:', amount);
}

function processTopUp() {
  const amount = document.getElementById('topup-amount').value;
  const method = document.querySelector('.payment-method.active');
  
  if (!method) {
    showToast('Vui lòng chọn phương thức thanh toán', 'warning');
    return;
  }
  
  showToast('Đang xử lý nạp tiền...', 'info');
  
  setTimeout(() => {
    showToast(`Nạp tiền ${parseInt(amount).toLocaleString('vi-VN')}đ thành công!`, 'success');
  }, 2000);
}

function toggleAutoPay() {
  const toggle = document.querySelector('#autopay-subtab .toggle-switch');
  toggle.classList.toggle('active');
  const isActive = toggle.classList.contains('active');
  
  showToast(`Tự động thanh toán đã được ${isActive ? 'bật' : 'tắt'}`, 'success');
}

function selectAutoPayMethod(method) {
  showToast(`Đã chọn phương thức tự động: ${getMethodName(method)}`, 'success');
}

function saveAutoPaySettings() {
  showToast('Đã lưu cài đặt tự động thanh toán', 'success');
}

// Staff Dashboard
function initStaffDashboard() {
  showStaffTab('overview');
  updateStaffInfo();
}

function showStaffTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Remove active class from all tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected tab content
  const tabContent = document.getElementById(tabName + '-tab');
  if (tabContent) {
    tabContent.classList.add('active');
  }
  
  // Add active class to selected tab
  const activeTab = document.querySelector(`[onclick="showStaffTab('${tabName}')"]`);
  if (activeTab) {
    activeTab.classList.add('active');
  }
}

function updateStaffInfo() {
  if (auth.currentUser) {
    const user = auth.currentUser;
    document.querySelector('#staffDashboard .user-avatar').textContent = user.name.charAt(0).toUpperCase();
    document.querySelector('#staffDashboard .user-info span').textContent = `${user.name} - Nhân viên`;
  }
}

// Admin Dashboard
function initAdminDashboard() {
  showAdminTab('overview');
  updateAdminInfo();
}

function showAdminTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Remove active class from all tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected tab content
  const tabContent = document.getElementById(tabName + '-tab');
  if (tabContent) {
    tabContent.classList.add('active');
  }
  
  // Add active class to selected tab
  const activeTab = document.querySelector(`[onclick="showAdminTab('${tabName}')"]`);
  if (activeTab) {
    activeTab.classList.add('active');
  }
}

function updateAdminInfo() {
  if (auth.currentUser) {
    const user = auth.currentUser;
    document.querySelector('#adminDashboard .user-avatar').textContent = user.name.charAt(0).toUpperCase();
    document.querySelector('#adminDashboard .user-info span').textContent = `${user.name} - Quản trị viên`;
  }
}

// Battery Swap Functions
function initBatterySwap() {
  loadStationOptions();
  setupBatterySwapData();
}

function loadStationOptions() {
  const stationSelect = document.getElementById('station-select');
  if (stationSelect) {
    stationSelect.innerHTML = '<option value="">Chọn trạm đổi pin</option>';
    stations.forEach((station, index) => {
      if (station.status === 'active') {
        stationSelect.innerHTML += `<option value="station${index}">${station.name} (${station.pins} pin)</option>`;
      }
    });
  }
}

function setupBatterySwapData() {
  // Setup sample data for battery swap
  globalStationData = {
    'station0': [
      {
        id: 'post1',
        name: 'Trụ A',
        slots: [
          { id: 'A1', status: 'has-battery', battery: '95%' },
          { id: 'A2', status: 'has-battery', battery: '87%' },
          { id: 'A3', status: 'charging', battery: '45%' },
          { id: 'A4', status: 'empty', battery: '0%' }
        ]
      },
      {
        id: 'post2',
        name: 'Trụ B',
        slots: [
          { id: 'B1', status: 'has-battery', battery: '92%' },
          { id: 'B2', status: 'has-battery', battery: '89%' },
          { id: 'B3', status: 'has-battery', battery: '76%' },
          { id: 'B4', status: 'maintenance', battery: '0%' }
        ]
      }
    ]
  };
}

function loadStationPosts() {
  const stationSelect = document.getElementById('station-select');
  const selectedValue = stationSelect.value;
  
  if (!selectedValue) {
    document.getElementById('no-station').style.display = 'block';
    document.getElementById('post-grid').style.display = 'none';
    return;
  }
  
  document.getElementById('no-station').style.display = 'none';
  document.getElementById('post-grid').style.display = 'block';
  
  const posts = globalStationData[selectedValue] || [];
  const postGrid = document.getElementById('post-grid');
  
  postGrid.innerHTML = posts.map(post => `
    <div class="post-item ${post.slots.every(s => s.status === 'occupied') ? 'occupied' : ''}" 
         onclick="selectPost('${post.id}', '${selectedValue}')">
      <div style="font-weight: 600;">${post.name}</div>
      <div style="font-size: 12px; color: var(--muted);">
        ${post.slots.filter(s => s.status === 'has-battery').length} pin sẵn sàng
      </div>
    </div>
  `).join('');
}

function selectPost(postId, stationKey) {
  const posts = globalStationData[stationKey];
  selectedPost = posts.find(post => post.id === postId);
  
  if (!selectedPost) return;
  
  // Update UI
  document.querySelectorAll('.post-item').forEach(item => item.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
  
  showSelectedPostInfo();
  updateSwapButton();
}

function showSelectedPostInfo() {
  if (!selectedPost) return;
  
  const infoDiv = document.getElementById('selected-post-info');
  infoDiv.style.display = 'block';
  
  infoDiv.innerHTML = `
    <h4>${selectedPost.name} - Chọn pin</h4>
    <div style="margin: 12px 0;">
      <h5>Chọn pin để lấy (pin đầy):</h5>
      <div class="slot-grid">
        ${selectedPost.slots.map(slot => `
          <div class="slot-item ${slot.status} ${selectedPickupSlot?.id === slot.id ? 'selected' : ''}" 
               onclick="selectPickupSlot('${slot.id}')"
               ${slot.status !== 'has-battery' ? 'style="cursor: not-allowed;"' : ''}>
            ${slot.id}<br><small>${slot.battery}</small>
          </div>
        `).join('')}
      </div>
    </div>
    <div style="margin: 12px 0;">
      <h5>Chọn vị trí trả pin cũ:</h5>
      <div class="slot-grid">
        ${selectedPost.slots.map(slot => `
          <div class="slot-item ${slot.status} ${selectedReturnSlot?.id === slot.id ? 'selected' : ''}" 
               onclick="selectReturnSlot('${slot.id}')"
               ${slot.status !== 'empty' ? 'style="cursor: not-allowed;"' : ''}>
            ${slot.id}<br><small>${slot.status === 'empty' ? 'Trống' : slot.battery}</small>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function selectPickupSlot(slotId) {
  if (!selectedPost) return;
  
  const slot = selectedPost.slots.find(s => s.id === slotId);
  if (slot && slot.status === 'has-battery') {
    selectedPickupSlot = slot;
    showSelectedPostInfo();
    updateSwapButton();
    showToast(`Đã chọn pin ${slotId} (${slot.battery})`, 'success');
  }
}

function selectReturnSlot(slotId) {
  if (!selectedPost) return;
  
  const slot = selectedPost.slots.find(s => s.id === slotId);
  if (slot && slot.status === 'empty') {
    selectedReturnSlot = slot;
    showSelectedPostInfo();
    updateSwapButton();
    showToast(`Đã chọn vị trí trả ${slotId}`, 'success');
  }
}

function updateSwapButton() {
  const swapBtn = document.getElementById('swap-battery-btn');
  if (selectedPost && selectedPickupSlot && selectedReturnSlot) {
    swapBtn.disabled = false;
    swapBtn.textContent = 'Bắt đầu đổi pin';
  } else {
    swapBtn.disabled = true;
    swapBtn.textContent = 'Chọn trạm và pin';
  }
}

function hideSelectedPostInfo() {
  document.getElementById('selected-post-info').style.display = 'none';
}

// Payment Tab Functions
function initPaymentTab() {
  showPaymentSubTab('payment');
}

function showPaymentSubTab(tabName) {
  // Remove active class from all sub-tabs and contents
  document.querySelectorAll('.payment-sub-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.payment-sub-content').forEach(content => content.classList.remove('active'));
  
  // Add active class to selected tab and content
  event.target.classList.add('active');
  document.getElementById(`${tabName}-subtab`).classList.add('active');
}

// Battery Health Functions
function initBatteryHealth() {
  if (window.batteryHealthSystem) {
    const content = window.batteryHealthSystem.renderDashboard();
    document.getElementById('batteryHealthContent').innerHTML = content;
  } else {
    document.getElementById('batteryHealthContent').innerHTML = `
      <div class="loading-message">
        <div class="loading-spinner">⚡</div>
        <p>Đang tải dữ liệu pin...</p>
      </div>
    `;
    
    // Try to initialize after a short delay
    setTimeout(() => {
      if (typeof BatteryHealthSystem !== 'undefined') {
        window.batteryHealthSystem = new BatteryHealthSystem();
        const content = window.batteryHealthSystem.renderDashboard();
        document.getElementById('batteryHealthContent').innerHTML = content;
      }
    }, 1000);
  }
}

// User Map Functions
function initUserMap() {
  if (userMap) return;
  
  userMap = L.map('user-map').setView([16.0678, 108.2208], 6);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(userMap);

  stations.forEach((station, index) => {
    const color = station.status === 'active' ? '#19c37d' : '#ff5573';
    const icon = L.divIcon({
      html: `<div style="background: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">${station.pins}</div>`,
      iconSize: [24, 24],
      className: 'custom-div-icon'
    });

    const marker = L.marker([station.lat, station.lng], { icon })
      .addTo(userMap)
      .bindPopup(`
        <div style="min-width: 200px;">
          <strong>${station.name}</strong><br>
          📍 ${station.area}<br>
          🔋 ${station.pins} pin sẵn sàng<br>
          📊 Trạng thái: ${station.status === 'active' ? 'Hoạt động' : 'Bảo trì'}<br>
          <button onclick="selectStationForBooking('${station.name}')" style="margin-top: 8px; padding: 4px 8px; background: #4f8cff; border: none; border-radius: 4px; color: white; cursor: pointer;">Đổi pin tại đây</button>
        </div>
      `);

    marker.on('click', () => {
      updateSelectedStationInfo(station);
    });
  });
}

function updateSelectedStationInfo(station) {
  const infoDiv = document.getElementById('selected-station-info');
  infoDiv.innerHTML = `
    <h4>${station.name}</h4>
    <p><strong>📍 Địa chỉ:</strong> ${station.area}</p>
    <p><strong>🔋 Pin sẵn sàng:</strong> ${station.pins}</p>
    <p><strong>📊 Trạng thái:</strong> <span class="status ${station.status === 'active' ? 'success' : 'danger'}">${station.status === 'active' ? 'Hoạt động' : 'Bảo trì'}</span></p>
    <div style="margin-top: 12px;">
      <button class="btn btn-primary" onclick="selectStationForBooking('${station.name}')" style="width: 100%;">Đổi pin tại đây</button>
    </div>
  `;
}

function selectStationForBooking(stationName) {
  // Switch to battery-swap tab and pre-select station
  showUserTab('battery-swap');
  
  // Find and select the station in dropdown
  const stationSelect = document.getElementById('station-select');
  for (let option of stationSelect.options) {
    if (option.text.includes(stationName)) {
      stationSelect.value = option.value;
      loadStationPosts();
      break;
    }
  }
  
  showToast(`Đã chọn ${stationName} để đổi pin`, 'success');
}

// Map utility functions
function findMyLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      if (userMap) {
        userMap.setView([lat, lng], 12);
        
        // Add user location marker
        L.marker([lat, lng], {
          icon: L.divIcon({
            html: '<div style="background: #4f8cff; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
            iconSize: [16, 16],
            className: 'user-location-marker'
          })
        }).addTo(userMap).bindPopup('Vị trí của bạn');
      }
      
      showToast('Đã định vị thành công', 'success');
    }, (error) => {
      showToast('Không thể xác định vị trí', 'warning');
    });
  } else {
    showToast('Trình duyệt không hỗ trợ định vị', 'warning');
  }
}

function filterActiveStations() {
  showToast('Hiển thị chỉ các trạm đang hoạt động', 'success');
}

function showAllStations() {
  showToast('Hiển thị tất cả các trạm', 'success');
}

function searchStations() {
  const searchTerm = document.getElementById('station-search').value.toLowerCase();
  showToast(`Tìm kiếm: "${searchTerm}"`, 'success');
}

function filterByDistance() {
  showToast('Đã áp dụng bộ lọc khoảng cách', 'success');
}

function focusStation(stationId) {
  const station = stations.find(s => s.name.includes('Bùi Thị Xuân') && stationId === 'station1') ||
                stations.find(s => s.name.includes('Cầu Giấy') && stationId === 'station2');
  
  if (station && userMap) {
    userMap.setView([station.lat, station.lng], 15);
    updateSelectedStationInfo(station);
    showToast(`Đã focus vào ${station.name}`, 'success');
  }
}