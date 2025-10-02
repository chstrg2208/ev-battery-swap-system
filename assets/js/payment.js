/**
 * Payment System
 * Handles payment processing, plans, and electronic contracts
 */
class PaymentSystem {
  constructor() {
    this.currentPlanOrder = null;
    this.paymentHistory = this.loadPaymentHistory();
    this.plans = {
      basic: {
        name: 'Gói Cơ bản',
        price: 0,
        type: 'per-use',
        pricePerUse: 89000,
        features: [
          'Thanh toán theo lượt',
          'Không cam kết dài hạn', 
          'Phù hợp sử dụng thỉnh thoảng',
          'Hỗ trợ qua hotline'
        ]
      },
      premium: {
        name: 'Gói Premium',
        price: 299000,
        type: 'monthly',
        features: [
          '8 lượt đổi pin/tháng',
          'Ưu tiên tại trạm',
          'Hỗ trợ 24/7',
          'Báo cáo chi tiết',
          'Miễn phí lượt đầu mỗi ngày'
        ]
      },
      enterprise: {
        name: 'Gói Enterprise', 
        price: 899000,
        type: 'monthly',
        features: [
          'Không giới hạn lượt đổi',
          'API tích hợp',
          'Dashboard quản lý đội xe',
          'Hỗ trợ kỹ thuật riêng',
          'Báo cáo tùy chỉnh'
        ]
      }
    };
  }

  loadPaymentHistory() {
    const saved = localStorage.getItem('paymentHistory');
    return saved ? JSON.parse(saved) : [
      {
        date: '15/09/2024',
        description: 'Đổi pin tại trạm Quận 1',
        amount: '89.000đ',
        status: 'Thành công',
        orderId: 'SWP001'
      },
      {
        date: '20/09/2024', 
        description: 'Mua gói Premium',
        amount: '299.000đ',
        status: 'Thành công',
        orderId: 'SWP002'
      }
    ];
  }

  savePaymentHistory() {
    localStorage.setItem('paymentHistory', JSON.stringify(this.paymentHistory));
  }

  addPaymentRecord(record) {
    this.paymentHistory.unshift(record);
    this.savePaymentHistory();
  }

  purchasePlan(planType, planName, price, description) {
    this.currentPlanOrder = {
      type: planType,
      name: planName,
      price: price,
      description: description,
      orderDate: new Date().toISOString(),
      orderId: 'SWP' + Date.now()
    };

    // Update payment modal
    document.getElementById('selected-plan-info').textContent = `${planName} - ${price.toLocaleString()}đ`;
    document.getElementById('plan-description').textContent = description;
    document.getElementById('payment-modal').style.display = 'block';
  }

  closePaymentModal() {
    document.getElementById('payment-modal').style.display = 'none';
    document.getElementById('payment-step-1').style.display = 'block';
    document.getElementById('payment-step-2').style.display = 'none';
    document.getElementById('payment-step-3').style.display = 'none';
    document.getElementById('payment-btn').style.display = 'block';
    
    // Reset form
    this.resetPaymentForm();
  }

  resetPaymentForm() {
    document.getElementById('card-number').value = '';
    document.getElementById('card-expiry').value = '';
    document.getElementById('card-cvv').value = '';
    document.getElementById('card-holder').value = '';
    document.getElementById('agree-terms').checked = false;
  }

  validatePaymentForm() {
    const cardNumber = document.getElementById('card-number').value;
    const cardExpiry = document.getElementById('card-expiry').value;
    const cardCvv = document.getElementById('card-cvv').value;
    const cardHolder = document.getElementById('card-holder').value;
    const agreeTerms = document.getElementById('agree-terms').checked;

    if (!cardNumber || !cardExpiry || !cardCvv || !cardHolder || !agreeTerms) {
      return { valid: false, message: 'Vui lòng điền đầy đủ thông tin và đồng ý điều khoản' };
    }

    // Basic card number validation (simplified)
    if (cardNumber.replace(/\s/g, '').length < 16) {
      return { valid: false, message: 'Số thẻ không hợp lệ' };
    }

    // Expiry validation
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(cardExpiry)) {
      return { valid: false, message: 'Ngày hết hạn không hợp lệ' };
    }

    // CVV validation
    if (cardCvv.length < 3) {
      return { valid: false, message: 'CVV không hợp lệ' };
    }

    return { valid: true };
  }

  processPayment() {
    const validation = this.validatePaymentForm();
    if (!validation.valid) {
      showToast(validation.message, 'error');
      return;
    }

    // Show processing step
    document.getElementById('payment-step-1').style.display = 'none';
    document.getElementById('payment-step-2').style.display = 'block';
    document.getElementById('payment-btn').style.display = 'none';

    // Simulate payment processing
    setTimeout(() => {
      this.completePayment();
    }, 3000);
  }

  completePayment() {
    // Payment successful
    document.getElementById('payment-step-2').style.display = 'none';
    document.getElementById('payment-step-3').style.display = 'block';

    // Update user plan
    if (auth.currentUser) {
      auth.currentUser.plan = this.currentPlanOrder.type;
      auth.currentUser.planExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      localStorage.setItem('userData', JSON.stringify(auth.currentUser));
    }

    // Add to payment history
    this.addPaymentRecord({
      date: new Date().toLocaleDateString('vi-VN'),
      description: `Mua ${this.currentPlanOrder.name}`,
      amount: `${this.currentPlanOrder.price.toLocaleString()}đ`,
      status: 'Thành công',
      orderId: this.currentPlanOrder.orderId
    });

    showToast('Thanh toán thành công! Gói dịch vụ đã được kích hoạt', 'success');
    
    // Auto refresh dashboard after delay
    setTimeout(() => {
      if (document.getElementById('userDashboard') && document.getElementById('userDashboard').classList.contains('active')) {
        location.reload(); // Refresh to update plan info
      }
    }, 2000);
  }

  getPlanInfo(planType) {
    return this.plans[planType] || this.plans.basic;
  }

  getPaymentHistory() {
    return this.paymentHistory;
  }
}

/**
 * Contract System
 * Generates electronic contracts
 */
class ContractSystem {
  constructor(paymentSystem) {
    this.paymentSystem = paymentSystem;
  }

  generateContract() {
    if (!this.paymentSystem.currentPlanOrder) {
      showToast('Không có thông tin đơn hàng', 'error');
      return;
    }

    const user = auth.currentUser;
    const contractDate = new Date().toLocaleDateString('vi-VN');
    const contractId = 'HD' + Date.now();
    
    const contractHTML = this.getContractTemplate(user, contractDate, contractId);
    document.getElementById('contract-content').innerHTML = contractHTML;
    document.getElementById('contract-modal').style.display = 'block';
  }

  getContractTemplate(user, contractDate, contractId) {
    const order = this.paymentSystem.currentPlanOrder;
    
    return `
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
            <p>Email: ${user.email}</p>
            <p>Số điện thoại: ${user.phone || 'Chưa cập nhật'}</p>
            <p>Địa chỉ: ${user.address || 'Chưa cập nhật'}</p>
          </div>

          <div class="contract-section">
            <h3>THÔNG TIN GÓI DỊCH VỤ</h3>
            <table class="contract-table">
              <tr>
                <td><strong>Tên gói:</strong></td>
                <td>${order.name}</td>
              </tr>
              <tr>
                <td><strong>Giá trị:</strong></td>
                <td>${order.price.toLocaleString()}đ</td>
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
                <td>${order.orderId}</td>
              </tr>
            </table>
          </div>

          ${this.getTermsAndConditions()}
          ${this.getSignatureSection(user, contractDate)}
          ${this.getContractFooter()}
        </div>
      </div>
    `;
  }

  getTermsAndConditions() {
    return `
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
    `;
  }

  getSignatureSection(user, contractDate) {
    return `
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
                <small>${user.email}</small><br>
                <small>${contractDate}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getContractFooter() {
    return `
      <div class="contract-footer">
        <p style="text-align: center; font-style: italic; color: #666;">
          Hợp đồng này được tạo tự động và có giá trị pháp lý theo Luật Giao dịch điện tử Việt Nam
        </p>
      </div>
    `;
  }

  closeContractModal() {
    document.getElementById('contract-modal').style.display = 'none';
  }

  downloadContract() {
    showToast('Tính năng tải xuống PDF sẽ được cập nhật sau', 'info');
  }
}

// Global instances
const paymentSystem = new PaymentSystem();
const contractSystem = new ContractSystem(paymentSystem);

// Global functions for backward compatibility
function purchasePlan(planType, planName, price, description) {
  paymentSystem.purchasePlan(planType, planName, price, description);
}

function closePaymentModal() {
  paymentSystem.closePaymentModal();
}

function processPayment() {
  paymentSystem.processPayment();
}

function showContract() {
  contractSystem.generateContract();
}

function closeContractModal() {
  contractSystem.closeContractModal();
}

function downloadContract() {
  contractSystem.downloadContract();
}

function addPaymentRecord(record) {
  paymentSystem.addPaymentRecord(record);
}