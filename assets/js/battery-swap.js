/**
 * Battery Swap IoT System
 * Handles battery swapping operations, slot management, and IoT simulation
 */
class BatterySwapSystem {
  constructor() {
    this.selectedPost = null;
    this.selectedPickupSlot = null;
    this.selectedReturnSlot = null;
    this.swapInProgress = false;
    this.globalStationData = this.initializeStationData();
  }

  initializeStationData() {
    return {
      station1: [
        { 
          id: 'A1', 
          name: 'Trụ A1',
          slots: [
            { id: 1, status: 'has-battery', battery: '100%' },
            { id: 2, status: 'has-battery', battery: '95%' },
            { id: 3, status: 'empty', battery: '0%' },
            { id: 4, status: 'charging', battery: '75%' },
            { id: 5, status: 'charging', battery: '100%' },
            { id: 6, status: 'has-battery', battery: '98%' },
            { id: 7, status: 'empty', battery: '0%' },
            { id: 8, status: 'charging', battery: '88%' },
            { id: 9, status: 'has-battery', battery: '100%' },
            { id: 10, status: 'charging', battery: '100%' }
          ]
        },
        { 
          id: 'A2', 
          name: 'Trụ A2',
          slots: [
            { id: 1, status: 'has-battery', battery: '100%' },
            { id: 2, status: 'empty', battery: '0%' },
            { id: 3, status: 'charging', battery: '92%' },
            { id: 4, status: 'empty', battery: '0%' },
            { id: 5, status: 'charging', battery: '85%' },
            { id: 6, status: 'has-battery', battery: '96%' },
            { id: 7, status: 'charging', battery: '100%' },
            { id: 8, status: 'empty', battery: '0%' },
            { id: 9, status: 'has-battery', battery: '100%' },
            { id: 10, status: 'charging', battery: '67%' }
          ]
        },
        { 
          id: 'B1', 
          name: 'Trụ B1',
          slots: [
            { id: 1, status: 'charging', battery: '45%' },
            { id: 2, status: 'charging', battery: '100%' },
            { id: 3, status: 'empty', battery: '0%' },
            { id: 4, status: 'charging', battery: '68%' },
            { id: 5, status: 'has-battery', battery: '100%' },
            { id: 6, status: 'empty', battery: '0%' },
            { id: 7, status: 'charging', battery: '100%' },
            { id: 8, status: 'has-battery', battery: '94%' },
            { id: 9, status: 'charging', battery: '72%' },
            { id: 10, status: 'empty', battery: '0%' }
          ]
        }
      ],
      station2: [
        { 
          id: 'C1', 
          name: 'Trụ C1',
          slots: [
            { id: 1, status: 'has-battery', battery: '100%' },
            { id: 2, status: 'charging', battery: '88%' },
            { id: 3, status: 'has-battery', battery: '96%' },
            { id: 4, status: 'empty', battery: '0%' },
            { id: 5, status: 'charging', battery: '100%' },
            { id: 6, status: 'has-battery', battery: '100%' },
            { id: 7, status: 'empty', battery: '0%' },
            { id: 8, status: 'charging', battery: '54%' },
            { id: 9, status: 'has-battery', battery: '92%' },
            { id: 10, status: 'charging', battery: '100%' }
          ]
        },
        { 
          id: 'D1', 
          name: 'Trụ D1',
          slots: [
            { id: 1, status: 'charging', battery: '100%' },
            { id: 2, status: 'charging', battery: '65%' },
            { id: 3, status: 'has-battery', battery: '100%' },
            { id: 4, status: 'charging', battery: '94%' },
            { id: 5, status: 'empty', battery: '0%' },
            { id: 6, status: 'has-battery', battery: '98%' },
            { id: 7, status: 'charging', battery: '100%' },
            { id: 8, status: 'empty', battery: '0%' },
            { id: 9, status: 'has-battery', battery: '100%' },
            { id: 10, status: 'charging', battery: '79%' }
          ]
        }
      ],
      station3: [
        { 
          id: 'E1', 
          name: 'Trụ E1',
          slots: [
            { id: 1, status: 'has-battery', battery: '100%' },
            { id: 2, status: 'charging', battery: '78%' },
            { id: 3, status: 'charging', battery: '100%' },
            { id: 4, status: 'empty', battery: '0%' },
            { id: 5, status: 'charging', battery: '56%' },
            { id: 6, status: 'has-battery', battery: '95%' },
            { id: 7, status: 'charging', battery: '100%' },
            { id: 8, status: 'empty', battery: '0%' },
            { id: 9, status: 'has-battery', battery: '100%' },
            { id: 10, status: 'charging', battery: '83%' }
          ]
        }
      ],
      station4: [
        { 
          id: 'F1', 
          name: 'Trụ F1',
          slots: [
            { id: 1, status: 'has-battery', battery: '100%' },
            { id: 2, status: 'charging', battery: '100%' },
            { id: 3, status: 'empty', battery: '0%' },
            { id: 4, status: 'has-battery', battery: '97%' },
            { id: 5, status: 'charging', battery: '62%' },
            { id: 6, status: 'empty', battery: '0%' },
            { id: 7, status: 'has-battery', battery: '100%' },
            { id: 8, status: 'charging', battery: '100%' },
            { id: 9, status: 'empty', battery: '0%' },
            { id: 10, status: 'charging', battery: '91%' }
          ]
        }
      ]
    };
  }

  loadStationPosts() {
    const stationSelect = document.getElementById('station-select');
    const postsContainer = document.getElementById('posts-container');
    const postGrid = document.getElementById('post-grid');
    const noStation = document.getElementById('no-station');
    const selectedStation = stationSelect.value;
    
    if (selectedStation) {
      postGrid.style.display = 'block';
      noStation.style.display = 'none';
      
      // Use global data that can be updated
      const posts = this.globalStationData[selectedStation] || [];
      postsContainer.innerHTML = '';
      
      posts.forEach(post => {
        const readyBatteries = post.slots.filter(slot => 
          slot.status === 'has-battery' || 
          (slot.status === 'charging' && slot.battery === '100%')
        ).length;
        const emptySlots = post.slots.filter(slot => slot.status === 'empty').length;
        const isAvailable = readyBatteries > 0 && emptySlots > 0;
        
        const postElement = document.createElement('div');
        postElement.className = `post-item ${isAvailable ? '' : 'occupied'}`;
        postElement.onclick = () => isAvailable ? this.selectPost(post) : null;
        
        postElement.innerHTML = `
          <div style="font-weight: 600; margin-bottom: 4px;">${post.name}</div>
          <div style="font-size: 12px; margin-bottom: 4px;">
            🔋 ${readyBatteries} pin sẵn sàng
          </div>
          <div style="font-size: 11px; color: var(--muted);">
            📍 ${emptySlots} slot trống
          </div>
        `;
        
        if (!isAvailable) {
          postElement.style.cursor = 'not-allowed';
          postElement.onclick = null;
        }
        
        postsContainer.appendChild(postElement);
      });
    } else {
      postGrid.style.display = 'none';
      noStation.style.display = 'block';
      this.hideSelectedPostInfo();
    }
  }

  selectPost(post) {
    // Remove previous selection
    document.querySelectorAll('.post-item').forEach(item => {
      item.classList.remove('selected');
    });
    
    // Add selection to clicked post
    event.target.classList.add('selected');
    
    // Get updated post data from global data
    const stationSelect = document.getElementById('station-select');
    const selectedStationKey = stationSelect.value;
    
    if (this.globalStationData[selectedStationKey]) {
      const posts = this.globalStationData[selectedStationKey];
      const updatedPost = posts.find(p => p.id === post.id);
      this.selectedPost = updatedPost || post;
    } else {
      this.selectedPost = post;
    }
    
    this.selectedPickupSlot = null;
    this.selectedReturnSlot = null;
    
    this.showSelectedPostInfo(this.selectedPost);
    this.updateSwapButton();
  }

  showSelectedPostInfo(post) {
    const selectedPostInfo = document.getElementById('selected-post-info');
    const postDetails = document.getElementById('post-details');
    
    postDetails.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong>${post.name}</strong><br>
          <span class="muted">✅ Đã chọn trụ này</span>
        </div>
        <div style="font-size: 24px;">⚡</div>
      </div>
    `;
    
    selectedPostInfo.style.display = 'block';
    this.showSlotSelection();
  }

  hideSelectedPostInfo() {
    const selectedPostInfo = document.getElementById('selected-post-info');
    if (selectedPostInfo) {
      selectedPostInfo.style.display = 'none';
    }
  }

  showSlotSelection() {
    if (!this.selectedPost) return;
    
    const slotContainer = document.getElementById('slot-grid');
    slotContainer.innerHTML = '';
    
    this.selectedPost.slots.forEach(slot => {
      const slotElement = document.createElement('div');
      slotElement.className = 'slot-item';
      
      // Enhanced status logic with battery percentage check
      let statusClass = '';
      let batteryLevel = parseInt(slot.battery);
      
      if (slot.status === 'empty') {
        statusClass = 'empty';
      } else if (slot.status === 'charging') {
        statusClass = batteryLevel === 100 ? 'ready' : 'charging';
      } else if (slot.status === 'has-battery') {
        statusClass = 'ready';
      }
      
      slotElement.classList.add(statusClass);
      
      slotElement.innerHTML = `
        <div class="slot-number">${slot.id}</div>
        <div class="slot-status">${slot.battery}</div>
      `;
      
      // Only ready slots (green) can be selected for pickup
      if (statusClass === 'ready') {
        slotElement.onclick = () => this.selectSlot(slot, 'pickup');
      } else {
        slotElement.style.cursor = 'not-allowed';
      }
      
      slotContainer.appendChild(slotElement);
    });
    
    document.getElementById('slot-selection').style.display = 'block';
  }

  selectSlot(slot, type) {
    if (type === 'pickup') {
      // First selection is always pickup
      if (!this.selectedPickupSlot) {
        this.selectedPickupSlot = slot;
        this.highlightSelectedSlot(slot.id, 'pickup');
        showToast(`Đã chọn slot ${slot.id} để lấy pin`, 'success');
        this.showReturnSlotSelection();
      }
    } else if (type === 'return') {
      this.selectedReturnSlot = slot;
      this.highlightSelectedSlot(slot.id, 'return');
      showToast(`Đã chọn slot ${slot.id} để trả pin cũ`, 'success');
    }
    
    this.updateSwapButton();
  }

  showReturnSlotSelection() {
    // Update slot display to show empty slots for return
    const slotContainer = document.getElementById('slot-grid');
    slotContainer.innerHTML = '';
    
    this.selectedPost.slots.forEach(slot => {
      const slotElement = document.createElement('div');
      slotElement.className = 'slot-item';
      
      let statusClass = '';
      let batteryLevel = parseInt(slot.battery);
      
      if (slot.status === 'empty') {
        statusClass = 'empty';
        slotElement.onclick = () => this.selectSlot(slot, 'return');
      } else if (slot.status === 'charging') {
        statusClass = batteryLevel === 100 ? 'ready' : 'charging';
        slotElement.style.cursor = 'not-allowed';
      } else if (slot.status === 'has-battery') {
        statusClass = 'ready';
        slotElement.style.cursor = 'not-allowed';
      }
      
      slotElement.classList.add(statusClass);
      
      // Highlight previously selected pickup slot
      if (this.selectedPickupSlot && slot.id === this.selectedPickupSlot.id) {
        slotElement.classList.add('selected-pickup');
      }
      
      slotElement.innerHTML = `
        <div class="slot-number">${slot.id}</div>
        <div class="slot-status">${slot.battery}</div>
      `;
      
      slotContainer.appendChild(slotElement);
    });
    
    // Update instruction
    const instruction = document.createElement('div');
    instruction.className = 'slot-instruction';
    instruction.innerHTML = '📍 Bây giờ chọn slot trống để trả pin cũ';
    slotContainer.insertBefore(instruction, slotContainer.firstChild);
  }

  highlightSelectedSlot(slotId, type) {
    document.querySelectorAll('.slot-item').forEach(item => {
      if (type === 'pickup') {
        item.classList.remove('selected-pickup');
      } else {
        item.classList.remove('selected-return');
      }
    });
    
    const slotElements = document.querySelectorAll('.slot-item');
    slotElements.forEach(item => {
      const slotNumber = item.querySelector('.slot-number').textContent;
      if (parseInt(slotNumber) === slotId) {
        if (type === 'pickup') {
          item.classList.add('selected-pickup');
        } else {
          item.classList.add('selected-return');
        }
      }
    });
  }

  updateSwapButton() {
    const swapButton = document.getElementById('start-swap-btn');
    if (!swapButton) return;
    
    if (this.selectedPickupSlot && this.selectedReturnSlot) {
      swapButton.disabled = false;
      swapButton.textContent = `Bắt đầu đổi pin (${this.selectedPickupSlot.id} → ${this.selectedReturnSlot.id})`;
    } else if (this.selectedPickupSlot) {
      swapButton.disabled = true;
      swapButton.textContent = 'Chọn slot để trả pin cũ...';
    } else {
      swapButton.disabled = true;
      swapButton.textContent = 'Chọn slot để lấy pin...';
    }
  }

  startBatterySwap() {
    if (!this.selectedPickupSlot || !this.selectedReturnSlot || this.swapInProgress) {
      return;
    }

    this.swapInProgress = true;
    const modal = document.getElementById('swap-modal');
    modal.style.display = 'block';
    
    this.runSwapProcess();
  }

  runSwapProcess() {
    const steps = [
      { message: '🔍 Đang xác thực thông tin người dùng...', delay: 1000 },
      { message: '📋 Kiểm tra trạng thái pin và slot...', delay: 1500 },
      { message: '🔓 Mở khóa slot và lấy pin mới...', delay: 2000 },
      { message: '🔄 Thực hiện thay thế pin...', delay: 1800 },
      { message: '🔋 Đặt pin cũ vào slot sạc...', delay: 1200 },
      { message: '✅ Hoàn tất quá trình đổi pin!', delay: 1000 }
    ];

    this.processSwapSteps(steps, 0);
  }

  processSwapSteps(steps, currentStep) {
    if (currentStep >= steps.length) {
      this.finishSwap();
      return;
    }

    const step = steps[currentStep];
    document.getElementById('swap-status').textContent = step.message;
    
    // Update progress bar
    const progress = ((currentStep + 1) / steps.length) * 100;
    document.getElementById('swap-progress').style.width = progress + '%';

    setTimeout(() => {
      this.processSwapSteps(steps, currentStep + 1);
    }, step.delay);
  }

  finishSwap() {
    this.swapInProgress = false;
    document.getElementById('swap-modal').style.display = 'none';
    
    // Update slot states
    this.updateSlotStates();
    
    // Add to history
    this.addSwapHistory();
    
    // Reset selections
    this.selectedPickupSlot = null;
    this.selectedReturnSlot = null;
    
    // Reload station display
    this.loadStationPosts();
    
    showToast('Đổi pin thành công! 🎉', 'success');
  }

  updateSlotStates() {
    if (!this.selectedPost || !this.selectedPickupSlot || !this.selectedReturnSlot) return;
    
    // Find the station and post in our global data
    const stationSelect = document.getElementById('station-select');
    const selectedStationKey = stationSelect.value;
    
    // Find current post and update slot states
    if (this.globalStationData[selectedStationKey]) {
      const posts = this.globalStationData[selectedStationKey];
      const currentPost = posts.find(post => post.id === this.selectedPost.id);
      
      if (currentPost) {
        // Update pickup slot to empty
        const pickupSlot = currentPost.slots.find(slot => slot.id === this.selectedPickupSlot.id);
        if (pickupSlot) {
          pickupSlot.status = 'empty';
          pickupSlot.battery = '0%';
        }
        
        // Update return slot to charging with old battery level
        const returnSlot = currentPost.slots.find(slot => slot.id === this.selectedReturnSlot.id);
        if (returnSlot) {
          returnSlot.status = 'charging';
          returnSlot.battery = '25%'; // Assume old battery is low
        }
        
        showToast(`Cập nhật: Slot ${this.selectedPickupSlot.id} → trống, Slot ${this.selectedReturnSlot.id} → đang sạc 25%`, 'success');
      }
    }
  }

  addSwapHistory() {
    const historyRecord = {
      date: new Date().toLocaleDateString('vi-VN'),
      time: new Date().toLocaleTimeString('vi-VN'),
      station: document.getElementById('station-select').selectedOptions[0].text,
      post: this.selectedPost.name,
      pickupSlot: this.selectedPickupSlot.id,
      returnSlot: this.selectedReturnSlot.id,
      status: 'Hoàn thành'
    };

    // Add to payment history (for demo)
    addPaymentRecord({
      date: historyRecord.date,
      description: `Đổi pin tại ${historyRecord.station} - ${historyRecord.post}`,
      amount: '89.000đ',
      status: 'Thành công',
      orderId: 'SWP' + Date.now()
    });
  }

  closeSwapModal() {
    if (!this.swapInProgress) {
      document.getElementById('swap-modal').style.display = 'none';
    }
  }
}

// Global instance
const batterySwapSystem = new BatterySwapSystem();

// Global functions for backward compatibility
function loadStationPosts() {
  batterySwapSystem.loadStationPosts();
}

function selectPost(post) {
  batterySwapSystem.selectPost(post);
}

function startBatterySwap() {
  batterySwapSystem.startBatterySwap();
}

function closeSwapModal() {
  batterySwapSystem.closeSwapModal();
}