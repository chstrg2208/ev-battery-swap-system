# 🔋 HƯỚNG DẪN SỬ DỤNG CHỨC NĂNG QUẢN LÝ ĐỔI PIN (STAFF)

## 📋 Tổng quan

Chức năng "Xác nhận đổi pin" cho phép nhân viên trạm (Staff) xử lý các yêu cầu đổi pin từ tài xế (Driver) theo quy trình chuẩn.

## 🔄 Quy trình đổi pin

### Bước 1: Tiếp nhận yêu cầu đổi pin
- Hệ thống hiển thị danh sách yêu cầu đổi pin đang chờ xử lý (status: Pending)
- Thông tin hiển thị:
  - Mã yêu cầu
  - Thông tin tài xế (tên, SĐT)
  - Biển số xe
  - Pin cũ (ID, SOC%)
  - Gói đăng ký (Basic/Premium)
  - Số lần đổi trong tháng
  - Thời gian yêu cầu

### Bước 2: Xác nhận đổi pin
1. Staff nhấn nút "✅ Xác nhận"
2. Modal hiển thị danh sách pin sẵn sàng:
   - ID pin
   - SOC (State of Charge) - % pin còn lại
   - SOH (State of Health) - % sức khỏe pin
3. Staff chọn pin mới đầy năng lượng (SOC cao)
4. Hệ thống tự động:
   - Cập nhật pin cũ → trạng thái "Charging"
   - Cập nhật pin mới → trạng thái "In Use"
   - Lưu lịch sử giao dịch vào bảng Swaps

### Bước 3: Ghi nhận thanh toán (nếu cần)
**Điều kiện:** Tài xế đã vượt quãng đường (km) của gói đăng ký

**Các gói đăng ký:**
- **Eco**: 200 km/tháng
- **Cơ bản (Basic)**: 400 km/tháng
- **Plus**: 600 km/tháng
- **Premium**: Không giới hạn km

**Tính phí vượt gói:**
- Giá: 100 VNĐ/km vượt
- Ví dụ: Gói Basic (400km), đã chạy 450km → Vượt 50km → Phí: 5,000 VNĐ

1. Modal thanh toán hiển thị:
   - Thông báo vượt gói
   - Giới hạn gói (km)
   - Đã chạy (km)
   - Số km vượt
   - Số tiền cần thanh toán (tự động tính = km vượt × 100)
   - Phương thức thanh toán:
     - Tiền mặt
     - Thẻ
     - Ví điện tử
     - Chuyển khoản

2. Staff xác nhận số tiền và phương thức thanh toán
3. Hệ thống lưu giao dịch vào bảng Payments

### Bước 4: Kiểm tra pin cũ
1. Modal kiểm tra pin hiển thị
2. Staff nhập thông tin:
   - **SOH (%)**: Đo sức khỏe pin (0-100%)
   - **Tình trạng vật lý**:
     - Tốt (Good)
     - Khá (Fair)
     - Kém (Poor)
     - Hư hỏng (Damaged)
   - **Ghi chú**: Mô tả chi tiết tình trạng
   - **Cần bảo trì**: Checkbox nếu pin cần sửa chữa

3. Nếu chọn "Cần bảo trì":
   - Pin tự động chuyển sang trạng thái "Maintenance"
   - Pin không thể sử dụng cho đến khi được sửa

4. Hệ thống lưu vào bảng Battery_History

### Bước 5: Hoàn tất
1. Staff nhấn "✅ Hoàn tất đổi pin"
2. Hệ thống tự động:
   - Cập nhật trạng thái yêu cầu → "Completed"
   - Cập nhật báo cáo trạm (Reports):
     - Tăng số lần đổi pin
     - Cộng doanh thu (nếu có thanh toán)
   - Gửi thông báo thành công

## 📊 Thống kê hiển thị

Dashboard hiển thị 3 chỉ số chính:
1. **Yêu cầu chờ xử lý**: Số yêu cầu Pending
2. **Pin sẵn sàng**: Số pin Available
3. **Đã hoàn thành**: Số yêu cầu Completed hôm nay

## 🎨 Màu sắc & Trạng thái

### Trạng thái yêu cầu:
- 🟡 **Pending**: Chờ xử lý (màu cam)
- 🔵 **Processing**: Đang xử lý (màu xanh dương)
- 🟢 **Completed**: Hoàn thành (màu xanh lá)
- 🔴 **Rejected**: Từ chối (màu đỏ)

### Màu SOC (pin cũ):
- 🔴 < 10%: Đỏ (nguy hiểm)
- 🟠 10-20%: Cam (cảnh báo)
- 🟢 > 20%: Xanh (bình thường)

### Cảnh báo vượt gói:
- ⚠️ Màu đỏ nếu số lần đổi >= giới hạn

## 📁 Cấu trúc File

```
SWP391/src/
├── pages/Staff/
│   └── SwapConfirm.jsx          # Component chính
├── services/
│   └── swapService.js           # API service
└── store/
    └── swapSlice.js             # State management (Zustand)
```

## 🔧 Các chức năng chính

### SwapConfirm.jsx
- Hiển thị danh sách yêu cầu
- Modal chọn pin mới
- Modal thanh toán
- Modal kiểm tra pin cũ
- Xử lý workflow đầy đủ

### swapService.js
- `getSwapRequests()`: Lấy danh sách yêu cầu
- `getSwapRequestById()`: Lấy chi tiết yêu cầu
- `createSwapRequest()`: Tạo yêu cầu mới
- `confirmSwap()`: Xác nhận chọn pin
- `recordPayment()`: Ghi nhận thanh toán
- `checkOldBattery()`: Kiểm tra pin cũ
- `completeSwap()`: Hoàn tất đổi pin
- `rejectSwapRequest()`: Từ chối yêu cầu
- `getSwapHistory()`: Lịch sử đổi pin
- `getSwapStats()`: Thống kê

### swapSlice.js (Zustand Store)
- State: `swapRequests`, `swapHistory`, `swapStats`, `selectedRequest`
- Actions: Tương ứng với các API calls
- Helper functions: `getPendingRequests()`, `getCompletedRequests()`, etc.

## 🚀 Cách sử dụng

### 1. Truy cập trang
```
Staff Dashboard → Click vào card "✅ Xác nhận đổi pin"
```

### 2. Xử lý yêu cầu
```
1. Xem danh sách yêu cầu Pending
2. Click "✅ Xác nhận" trên yêu cầu cần xử lý
3. Chọn pin mới từ danh sách
4. Nếu vượt gói → Nhập thông tin thanh toán
5. Kiểm tra và nhập thông tin pin cũ
6. Click "✅ Hoàn tất đổi pin"
```

### 3. Từ chối yêu cầu
```
1. Click "❌ Từ chối" trên yêu cầu
2. Xác nhận từ chối
```

## 💡 Lưu ý

1. **Pin sẵn sàng**: Chỉ hiển thị pin có trạng thái "Available"
2. **Thanh toán**: 
   - Chỉ yêu cầu khi tài xế vượt quãng đường (km) của gói
   - Gói Premium không bao giờ phải trả thêm (không giới hạn km)
   - Giá: 100 VNĐ/km vượt
3. **Kiểm tra pin**: Bắt buộc nhập SOH trước khi hoàn tất
4. **Bảo trì**: Pin đánh dấu "Cần bảo trì" sẽ không thể sử dụng
5. **Thông báo**: Hiển thị 3 giây sau mỗi thao tác

## 🎯 Mock Data

Hiện tại sử dụng mock data để demo:

**3 yêu cầu đổi pin mẫu:**
1. **SWP001** - Nguyễn Văn A (Premium, 850km, không giới hạn) ✅ Không cần trả thêm
2. **SWP002** - Trần Thị B (Basic, 380/400km) ✅ Chưa vượt gói
3. **SWP003** - Lê Văn C (Basic, 450/400km) ⚠️ Vượt 50km → Phí: 5,000 VNĐ

**5 pin sẵn sàng:**
- BAT-101 đến BAT-105 với SOC 95-100%, SOH 92-98%

**Delay:** 300-800ms để giả lập API call

## 🔜 Tích hợp Backend

Khi tích hợp backend thực, cần:
1. Thay thế mock data bằng API calls thực
2. Cập nhật endpoint URLs
3. Xử lý authentication/authorization
4. Thêm error handling chi tiết
5. Implement real-time updates (WebSocket)

## 📞 Hỗ trợ

Nếu có vấn đề, liên hệ team phát triển.

---

**Version**: 1.0.0  
**Last Updated**: 2024-10-05  
**Author**: Development Team
