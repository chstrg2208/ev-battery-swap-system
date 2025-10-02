/**
 * Modal Components
 * Reusable modal templates and functionality
 */

// Payment Modal HTML
const PaymentModalHTML = `
  <div id="payment-modal" class="modal">
    <div class="modal-content" style="max-width: 600px;">
      <div class="modal-header">
        <h2>💳 Thanh toán gói dịch vụ</h2>
        <span class="close" onclick="closePaymentModal()">&times;</span>
      </div>
      <div class="modal-body">
        <div id="payment-step-1">
          <div class="card" style="margin-bottom: 20px;">
            <h3 id="selected-plan-info">Gói Premium - 299.000đ/tháng</h3>
            <p class="muted" id="plan-description">8 lượt đổi pin/tháng • Ưu tiên tại trạm • Hỗ trợ 24/7</p>
          </div>
          
          <div class="form-group">
            <label>Thông tin thanh toán</label>
            <div class="payment-methods">
              <label class="payment-method active">
                <input type="radio" name="payment-method" value="credit-card" checked>
                <div class="method-info">
                  <span class="method-icon">💳</span>
                  <span>Thẻ tín dụng/ghi nợ</span>
                </div>
              </label>
              <label class="payment-method">
                <input type="radio" name="payment-method" value="bank-transfer">
                <div class="method-info">
                  <span class="method-icon">🏦</span>
                  <span>Chuyển khoản ngân hàng</span>
                </div>
              </label>
            </div>
          </div>

          <div id="credit-card-form">
            <div class="form-group">
              <label>Số thẻ *</label>
              <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19">
            </div>
            
            <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="form-group">
                <label>Tháng/Năm *</label>
                <input type="text" id="card-expiry" placeholder="MM/YY" maxlength="5">
              </div>
              <div class="form-group">
                <label>CVV *</label>
                <input type="text" id="card-cvv" placeholder="123" maxlength="3">
              </div>
            </div>
            
            <div class="form-group">
              <label>Tên chủ thẻ *</label>
              <input type="text" id="card-holder" placeholder="NGUYEN VAN A">
            </div>
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" id="agree-terms" required>
              Tôi đồng ý với <a href="#" onclick="showContract()">điều khoản dịch vụ</a> và <a href="#" onclick="showContract()">chính sách bảo mật</a>
            </label>
          </div>
        </div>

        <div id="payment-step-2" style="display: none;">
          <div class="text-center">
            <div class="loading-spinner" style="margin: 20px auto;"></div>
            <h3>Đang xử lý thanh toán...</h3>
            <p class="muted">Vui lòng không đóng cửa sổ này</p>
          </div>
        </div>

        <div id="payment-step-3" style="display: none;">
          <div class="text-center">
            <div style="font-size: 48px; color: var(--success); margin: 20px 0;">✅</div>
            <h3>Thanh toán thành công!</h3>
            <p class="muted">Gói dịch vụ đã được kích hoạt</p>
            <button class="btn btn-primary" onclick="showContract()">Xem hợp đồng điện tử</button>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn" onclick="closePaymentModal()">Hủy</button>
        <button class="btn btn-primary" id="payment-btn" onclick="processPayment()">Thanh toán ngay</button>
      </div>
    </div>
  </div>
`;

// Contract Modal HTML
const ContractModalHTML = `
  <div id="contract-modal" class="modal">
    <div class="modal-content" style="max-width: 800px;">
      <div class="modal-header">
        <h2>📄 Hợp đồng điện tử</h2>
        <span class="close" onclick="closeContractModal()">&times;</span>
      </div>
      <div class="modal-body">
        <div id="contract-content">
          <!-- Contract will be generated here -->
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn" onclick="downloadContract()">📥 Tải xuống PDF</button>
        <button class="btn btn-primary" onclick="closeContractModal()">Đóng</button>
      </div>
    </div>
  </div>
`;

// Initialize modals when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Add payment modal to DOM
  document.body.insertAdjacentHTML('beforeend', PaymentModalHTML);
  
  // Add contract modal to DOM
  document.body.insertAdjacentHTML('beforeend', ContractModalHTML);
  
  console.log('✅ Modal components loaded');
});