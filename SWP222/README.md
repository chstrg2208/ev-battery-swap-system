# SWP201 - Hệ Thống Đổi Pin Xe Máy Điện

![SWP201 Logo](https://img.shields.io/badge/SWP201-Battery%20Swap%20System-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📖 Mô tả

SWP201 là hệ thống đổi pin xe máy điện thông minh, cung cấp nền tảng quản lý toàn diện cho người dùng, nhân viên và quản trị viên. Hệ thống tích hợp bản đồ tương tác, thanh toán thông minh và theo dõi real-time.

## ✨ Tính năng chính

### 👤 Dashboard Người dùng
- 🔋 Đổi pin tự động qua hệ thống IoT
- 📊 Theo dõi lịch sử đổi pin và thanh toán
- 💊 Quản lý tình trạng pin xe
- 🗺️ Tìm trạm gần nhất với bản đồ tương tác
- 💳 Nhiều phương thức thanh toán
- 📦 Quản lý gói dịch vụ

### 👨‍💼 Dashboard Nhân viên
- 🏢 Quản lý trạm đổi pin
- 🔧 Theo dõi tình trạng pin và thiết bị
- 📋 Xử lý yêu cầu khách hàng
- 📊 Báo cáo hoạt động

### ⚙️ Dashboard Quản trị
- 📈 Thống kê toàn hệ thống
- 👥 Quản lý người dùng và nhân viên
- 🏪 Quản lý trạm và thiết bị
- 📋 Tạo báo cáo tự động

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js >= 14.0.0
- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)

### Cài đặt
```bash
# Clone repository
git clone https://github.com/chstrg2208/ev-battery-swap-system.git
cd ev-battery-swap-system

# Cài đặt dependencies (tùy chọn)
npm install

# Chạy ứng dụng
npm start
```

### Chạy trực tiếp
Mở file `index.html` trong trình duyệt web hoặc sử dụng live server.

## 📁 Cấu trúc dự án

```
SWP201/
├── index.html                 # File HTML chính
├── demo.html                 # File demo gốc (tham khảo)
├── package.json              # Cấu hình npm
├── README.md                 # Tài liệu dự án
└── src/
    ├── assets/
    │   ├── css/
    │   │   ├── main.css          # CSS chính
    │   │   ├── modals.css        # CSS cho modals
    │   │   └── dashboard.css     # CSS cho dashboard
    │   └── js/
    │       ├── main.js           # JavaScript chính
    │       ├── dashboard.js      # Chức năng dashboard
    │       └── payment.js        # Chức năng thanh toán
    ├── components/
    │   └── modals.js            # Component modals
    └── pages/                   # Các trang riêng biệt (future)
```

## 🎯 Tài khoản demo

Hệ thống cung cấp 3 tài khoản demo:

| Vai trò | Email | Mật khẩu | Tính năng |
|---------|-------|----------|-----------|
| 👤 User | `user@demo.com` | `123456` | Dashboard người dùng |
| 👨‍💼 Staff | `staff@demo.com` | `123456` | Dashboard nhân viên |
| ⚙️ Admin | `admin@demo.com` | `123456` | Dashboard quản trị |

## 🛠️ Công nghệ sử dụng

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Maps**: Leaflet.js
- **Icons**: SVG Icons
- **Storage**: localStorage
- **Architecture**: Component-based

## 📱 Responsive Design

Hệ thống được thiết kế responsive, tương thích với:
- 💻 Desktop (1024px+)
- 📱 Tablet (768px - 1024px)
- 📱 Mobile (< 768px)

## 🔒 Bảo mật

- Xác thực người dùng
- Phân quyền theo vai trò
- Mã hóa dữ liệu nhạy cảm
- Bảo vệ CSRF

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📞 Liên hệ

- **Email**: support@swp201.vn
- **Phone**: 1900-SWP201
- **Website**: [swp201.vn](https://swp201.vn)

## 📄 License

Dự án này được cấp phép dưới [MIT License](LICENSE).

---

⭐ **Star dự án này nếu bạn thấy hữu ích!**