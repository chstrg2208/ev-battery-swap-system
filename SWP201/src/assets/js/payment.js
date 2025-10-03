// Payment Functions

// Payment method selection
function selectPaymentMethod(method) {
  // Remove selected class from all methods
  document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('selected'));
  
  // Add selected class to clicked method
  event.currentTarget.classList.add('selected');
  
  // Update radio button
  document.querySelector(`input[name="payment-method"][value="${method}"]`).checked = true;
}

function processPayment() {
  const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
  if (!selectedMethod) {
    showToast('Vui lòng chọn phương thức thanh toán', 'error');
    return;
  }
  
  showToast('Đang xử lý thanh toán...', 'info');
  
  // Simulate payment processing
  setTimeout(() => {
    showToast('Thanh toán thành công!', 'success');
    
    // Add to payment history
    const newRow = `
      <tr>
        <td>#PAY00${Date.now().toString().slice(-3)}</td>
        <td>${new Date().toLocaleString('vi-VN')}</td>
        <td>Thanh toán gói ${auth.currentUser.selectedPlan?.name || 'Premium'}</td>
        <td>${auth.currentUser.selectedPlan?.price?.split('/')[0] || '299,000đ'}</td>
        <td>${getMethodName(selectedMethod.value)}</td>
        <td><span class="status success">Thành công</span></td>
        <td><button class="action-btn" onclick="viewPaymentDetail('PAY00${Date.now().toString().slice(-3)}')">Chi tiết</button></td>
      </tr>
    `;
    document.getElementById('payment-history-table').insertAdjacentHTML('afterbegin', newRow);
  }, 2000);
}

function getMethodName(value) {
  const names = {
    'momo': 'Ví MoMo',
    'zalopay': 'ZaloPay', 
    'credit-card': 'Thẻ tín dụng',
    'bank-transfer': 'Chuyển khoản'
  };
  return names[value] || value;
}

// Plan purchase functions
function purchasePlan(planType, planName, price, description) {
  currentPlanOrder = {
    type: planType,
    name: planName,
    price: price,
    description: description,
    orderDate: new Date().toISOString(),
    orderId: 'SWP' + Date.now()
  };

  document.getElementById('selected-plan-info').textContent = `${planName} - ${price.toLocaleString()}đ`;
  document.getElementById('plan-description').textContent = description;
  document.getElementById('payment-modal').style.display = 'block';
}

function closePaymentModal() {
  const modal = document.getElementById('payment-modal');
  if (modal) {
    modal.style.display = 'none';
    modal.style.visibility = 'hidden';
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
  }
  
  const step1 = document.getElementById('payment-step-1');
  const step2 = document.getElementById('payment-step-2');
  const step3 = document.getElementById('payment-step-3');
  const paymentBtn = document.getElementById('payment-btn');
  
  if (step1) step1.style.display = 'block';
  if (step2) step2.style.display = 'none';
  if (step3) step3.style.display = 'none';
  if (paymentBtn) paymentBtn.style.display = 'block';
  
  // Reset form
  const cardNumber = document.getElementById('card-number');
  const cardExpiry = document.getElementById('card-expiry');
  const cardCvv = document.getElementById('card-cvv');
  const cardHolder = document.getElementById('card-holder');
  const agreeTerms = document.getElementById('agree-terms');
  
  if (cardNumber) cardNumber.value = '';
  if (cardExpiry) cardExpiry.value = '';
  if (cardCvv) cardCvv.value = '';
  if (cardHolder) cardHolder.value = '';
  if (agreeTerms) agreeTerms.checked = false;
}

function processPaymentModal() {
  // Validate form
  const cardNumber = document.getElementById('card-number').value;
  const cardExpiry = document.getElementById('card-expiry').value;
  const cardCvv = document.getElementById('card-cvv').value;
  const cardHolder = document.getElementById('card-holder').value;
  const agreeTerms = document.getElementById('agree-terms').checked;

  if (!cardNumber || !cardExpiry || !cardCvv || !cardHolder || !agreeTerms) {
    showToast('Vui lòng điền đầy đủ thông tin và đồng ý điều khoản', 'error');
    return;
  }

  // Show processing step
  document.getElementById('payment-step-1').style.display = 'none';
  document.getElementById('payment-step-2').style.display = 'block';
  document.getElementById('payment-btn').style.display = 'none';

  // Simulate payment processing
  setTimeout(() => {
    // Payment successful
    document.getElementById('payment-step-2').style.display = 'none';
    document.getElementById('payment-step-3').style.display = 'block';

    // Update user plan
    if (auth.currentUser) {
      auth.currentUser.plan = currentPlanOrder.type;
      auth.currentUser.planExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      localStorage.setItem('userData', JSON.stringify(auth.currentUser));
    }

    // Add to payment history
    addPaymentRecord({
      date: new Date().toLocaleDateString('vi-VN'),
      description: `Mua ${currentPlanOrder.name}`,
      amount: `${currentPlanOrder.price.toLocaleString()}đ`,
      status: 'Thành công',
      orderId: currentPlanOrder.orderId
    });

    showToast('Thanh toán thành công! Gói dịch vụ đã được kích hoạt', 'success');
    
    // Update dashboard
    setTimeout(() => {
      if (document.getElementById('userDashboard').classList.contains('active')) {
        location.reload(); // Refresh to update plan info
      }
    }, 2000);
  }, 3000);
}

function addPaymentRecord(record) {
  // Add payment record to history table if exists
  const historyTable = document.getElementById('payment-history-table');
  if (historyTable) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>#${record.orderId}</td>
      <td>${record.date}</td>
      <td>${record.description}</td>
      <td>${record.amount}</td>
      <td>Thẻ tín dụng</td>
      <td><span class="status success">${record.status}</span></td>
      <td><button class="action-btn" onclick="viewPaymentDetail('${record.orderId}')">Chi tiết</button></td>
    `;
    historyTable.insertBefore(newRow, historyTable.firstChild);
    
    // Keep only recent 10 records
    if (historyTable.children.length > 10) {
      historyTable.removeChild(historyTable.lastChild);
    }
  }
}

function viewPaymentDetail(paymentId) {
  showToast(`Xem chi tiết giao dịch ${paymentId}`, 'info');
}

// Auto Pay Functions
function toggleAutoPay() {
  const checkbox = document.getElementById('autopay-enabled');
  const settings = document.getElementById('autopay-settings');
  const statusText = document.getElementById('autopay-status-text');
  
  if (checkbox.checked) {
    settings.style.display = 'block';
    statusText.textContent = 'Bật - Thanh toán tự động mỗi tháng';
    showToast('Đã bật thanh toán tự động', 'success');
  } else {
    settings.style.display = 'none';
    statusText.textContent = 'Tắt - Bạn sẽ thanh toán thủ công mỗi tháng';
    showToast('Đã tắt thanh toán tự động', 'info');
  }
}

function selectAutoPayMethod(method) {
  document.querySelector(`input[name="autopay-method"][value="${method}"]`).checked = true;
  
  // Visual feedback
  document.querySelectorAll('.autopay-method').forEach(el => el.style.background = 'rgba(255,255,255,.05)');
  event.currentTarget.style.background = 'rgba(79,140,255,.2)';
}

function updateAutoPaySettings() {
  const day = document.getElementById('autopay-day').value;
  showToast(`Đã cập nhật ngày thanh toán: ${day === 'end' ? 'Cuối tháng' : 'Ngày ' + day}`, 'info');
}

function saveAutoPaySettings() {
  const enabled = document.getElementById('autopay-enabled').checked;
  const day = document.getElementById('autopay-day').value;
  const method = document.querySelector('input[name="autopay-method"]:checked')?.value;
  
  if (!method) {
    showToast('Vui lòng chọn phương thức thanh toán tự động', 'warning');
    return;
  }
  
  // Save to localStorage
  const autoPaySettings = {
    enabled,
    day,
    method,
    savedAt: new Date().toISOString()
  };
  localStorage.setItem('autoPaySettings', JSON.stringify(autoPaySettings));
  
  showToast('Đã lưu cài đặt thanh toán tự động!', 'success');
}

function testAutoPay() {
  showToast('Đang test thanh toán tự động...', 'info');
  
  setTimeout(() => {
    showToast('Test thành công! Hệ thống hoạt động bình thường.', 'success');
  }, 1500);
}

// Top-up functions
function updateTopUpAmount() {
  const select = document.getElementById('top-up-amount');
  const customInput = document.getElementById('custom-amount');
  
  if (select.value === 'custom') {
    customInput.style.display = 'block';
    customInput.focus();
  } else {
    customInput.style.display = 'none';
  }
}

function processTopUp() {
  const amount = document.getElementById('top-up-amount').value;
  const customAmount = document.getElementById('custom-amount').value;
  const finalAmount = amount === 'custom' ? customAmount : amount;
  
  if (finalAmount) {
    showToast(`Đang xử lý nạp ${parseInt(finalAmount).toLocaleString()}đ...`, 'success');
    // In real app, would redirect to payment gateway
  } else {
    showToast('Vui lòng chọn số tiền cần nạp', 'warning');
  }
}

function selectPlan(planType) {
  if (planType === 'basic') {
    showToast('Bạn đã chuyển sang thanh toán theo lượt', 'success');
  }
}

function extendPlan(planType) {
  showToast('Đã gia hạn gói Premium thêm 1 tháng', 'success');
}

function upgradePlan(planType) {
  showToast('Yêu cầu nâng cấp lên Enterprise đã được gửi', 'success');
}

function filterPaymentHistory() {
  // Demo filter function - in real app would filter the table
  showToast('Đã áp dụng bộ lọc', 'success');
}

// Contract functions
function showContract() {
  if (!currentPlanOrder) {
    showToast('Không có thông tin đơn hàng', 'error');
    return;
  }

  const user = auth.currentUser;
  const contractDate = new Date().toLocaleDateString('vi-VN');
  const contractId = 'HD' + Date.now();
  
  const contractHTML = `
    <div class="contract-document">
      <div class="contract-header">
        <h2 style="text-align: center; margin-bottom: 10px;">HỢP ĐỒNG DỊCH VỤ ĐỔI PIN ĐIỆN TỬ</h2>
        <div style="text-align: center; font-size: 14px; color: #666; margin-bottom: 30px;">
          Số hợp đồng: ${contractId} | Ngày: ${contractDate}
        </div>
      </div>

      <div class="contract-body">
        <div class="contract-section">
          <h3>BÊN CUNG CẤP DỊCH VỤ (Bên A)</h3>
          <p><strong>Công ty TNHH SWP201 Battery Swap</strong></p>
          <p>Địa chỉ: Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh</p>
          <p>Điện thoại: 1900-SWP201 | Email: support@swp201.vn</p>
          <p>Mã số thuế: 0123456789</p>
        </div>

        <div class="contract-section">
          <h3>BÊN SỬ DỤNG DỊCH VỤ (Bên B)</h3>
          <p><strong>${user.name}</strong></p>
          <p>Email: ${user.username}</p>
          <p>Số điện thoại: ${user.phone || 'Chưa cập nhật'}</p>
          <p>Địa chỉ: ${user.address || 'Chưa cập nhật'}</p>
        </div>

        <div class="contract-section">
          <h3>THÔNG TIN GÓI DỊCH VỤ</h3>
          <table class="contract-table">
            <tr>
              <td><strong>Tên gói:</strong></td>
              <td>${currentPlanOrder.name}</td>
            </tr>
            <tr>
              <td><strong>Giá trị:</strong></td>
              <td>${currentPlanOrder.price.toLocaleString()}đ</td>
            </tr>
            <tr>
              <td><strong>Thời hạn:</strong></td>
              <td>30 ngày kể từ ngày kích hoạt</td>
            </tr>
            <tr>
              <td><strong>Ngày đăng ký:</strong></td>
              <td>${contractDate}</td>
            </tr>
            <tr>
              <td><strong>Mã đơn hàng:</strong></td>
              <td>${currentPlanOrder.orderId}</td>
            </tr>
          </table>
        </div>

        <div class="contract-section">
          <h3>ĐIỀU KHOẢN DỊCH VỤ</h3>
          <ol>
            <li><strong>Quyền và nghĩa vụ của Bên A:</strong>
              <ul>
                <li>Cung cấp dịch vụ đổi pin theo đúng gói đã đăng ký</li>
                <li>Đảm bảo chất lượng pin và an toàn trong quá trình sử dụng</li>
                <li>Hỗ trợ kỹ thuật 24/7 cho gói Premium và Enterprise</li>
                <li>Thông báo trước 7 ngày khi có thay đổi chính sách</li>
              </ul>
            </li>
            <li><strong>Quyền và nghĩa vụ của Bên B:</strong>
              <ul>
                <li>Thanh toán đúng hạn theo gói đã đăng ký</li>
                <li>Sử dụng dịch vụ đúng mục đích và tuân thủ quy định</li>
                <li>Bảo quản thiết bị và pin trong quá trình sử dụng</li>
                <li>Thông báo kịp thời khi có sự cố hoặc hỏng hóc</li>
              </ul>
            </li>
            <li><strong>Chính sách hoàn tiền:</strong>
              <ul>
                <li>Hoàn 100% trong 7 ngày đầu nếu chưa sử dụng</li>
                <li>Hoàn 50% nếu hủy trong 15 ngày đầu</li>
                <li>Không hoàn tiền sau 15 ngày sử dụng</li>
              </ul>
            </li>
          </ol>
        </div>

        <div class="contract-section">
          <h3>CHỮ KÝ ĐIỆN TỬ</h3>
          <div class="signature-section">
            <div class="signature-block">
              <p><strong>Bên A: SWP201 Company</strong></p>
              <div class="digital-signature">
                <div class="signature-stamp">
                  ĐÃ KÝ ĐIỆN TỬ<br>
                  <small>CEO Trần Văn An</small><br>
                  <small>${contractDate}</small>
                </div>
              </div>
            </div>
            <div class="signature-block">
              <p><strong>Bên B: ${user.name}</strong></p>
              <div class="digital-signature">
                <div class="signature-stamp">
                  ĐÃ KÝ ĐIỆN TỬ<br>
                  <small>${user.username}</small><br>
                  <small>${contractDate}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="contract-footer">
          <p style="text-align: center; font-style: italic; color: #666;">
            Hợp đồng này được tạo tự động và có giá trị pháp lý theo Luật Giao dịch điện tử Việt Nam
          </p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('contract-content').innerHTML = contractHTML;
  document.getElementById('contract-modal').style.display = 'block';
}

function closeContractModal() {
  const modal = document.getElementById('contract-modal');
  if (modal) {
    modal.style.display = 'none';
    modal.style.visibility = 'hidden';
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
  }
}

function downloadContract() {
  showToast('Tính năng tải xuống PDF sẽ được cập nhật sau', 'info');
}

// Format card inputs
document.addEventListener('DOMContentLoaded', function() {
  const cardNumberInput = document.getElementById('card-number');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formattedValue;
    });
  }

  const cardExpiryInput = document.getElementById('card-expiry');
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      e.target.value = value;
    });
  }

  // Payment method selection
  document.addEventListener('change', function(e) {
    if (e.target.name === 'payment-method') {
      document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('active');
      });
      e.target.closest('.payment-method').classList.add('active');
      
      const creditCardForm = document.getElementById('credit-card-form');
      if (e.target.value === 'credit-card') {
        creditCardForm.style.display = 'block';
      } else {
        creditCardForm.style.display = 'none';
      }
    }
  });
});