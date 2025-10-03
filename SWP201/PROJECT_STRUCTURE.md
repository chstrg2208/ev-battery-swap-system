# SWP201 - EV Battery Swap System

## 📁 Project Structure

```
src/
├── 📄 index.js                    # Main entry point
├── 📄 App.jsx                     # Root component
├── 
├── 📁 pages/                      # Page components
│   ├── 📁 Driver/                 # Driver/User pages
│   │   ├── 📄 Dashboard.jsx       # Main dashboard
│   │   ├── 📄 Profile.jsx         # User profile
│   │   ├── 📄 Vehicles.jsx        # Vehicle management
│   │   ├── 📄 Subscriptions.jsx   # Gói Basic/Plus/Premium
│   │   ├── 📄 Contracts.jsx       # Hợp đồng thuê pin
│   │   ├── 📄 StationsMap.jsx     # Map + booking
│   │   ├── 📄 SwapBattery.jsx     # QR scan + confirm swap
│   │   ├── 📄 Payments.jsx        # Thanh toán định kỳ + phí vượt
│   │   └── 📄 Support.jsx         # Issue reporting
│   │
│   ├── 📁 Staff/                  # Staff pages
│   │   ├── 📄 Dashboard.jsx       # Staff overview
│   │   ├── 📄 BatteryStock.jsx    # Battery inventory
│   │   ├── 📄 SwapConfirm.jsx     # Confirm swaps
│   │   ├── 📄 Issues.jsx          # Handle issues
│   │   └── 📄 Reports.jsx         # Staff reports
│   │
│   └── 📁 Admin/                  # Admin pages
│       ├── 📄 Dashboard.jsx       # System overview
│       ├── 📄 Users.jsx           # User management
│       ├── 📄 Stations.jsx        # Station management
│       ├── 📄 Batteries.jsx       # Battery fleet
│       ├── 📄 Subscriptions.jsx   # Plan management
│       ├── 📄 Contracts.jsx       # Contract management
│       └── 📄 Reports.jsx         # System reports
│
├── 📁 services/                   # API services
│   ├── 📄 authService.js          # Authentication
│   ├── 📄 contractService.js      # Contract operations
│   ├── 📄 paymentService.js       # Payment processing
│   ├── 📄 stationService.js       # Station data
│   └── 📄 batteryService.js       # Battery operations
│
├── 📁 layouts/                    # Layout components
│   ├── 📄 DriverLayout.jsx        # Driver layout wrapper
│   ├── 📄 StaffLayout.jsx         # Staff layout wrapper
│   └── 📄 AdminLayout.jsx         # Admin layout wrapper
│
├── 📁 routes/                     # Route definitions
│   ├── 📄 DriverRoutes.jsx        # Driver route config
│   ├── 📄 StaffRoutes.jsx         # Staff route config
│   ├── 📄 AdminRoutes.jsx         # Admin route config
│   └── 📄 AppRoutes.jsx           # Main route config
│
└── 📁 store/                      # State management
    ├── 📄 authSlice.js            # Auth state
    ├── 📄 contractSlice.js        # Contract state
    ├── 📄 paymentSlice.js         # Payment state
    ├── 📄 stationSlice.js         # Station state
    └── 📄 batterySlice.js         # Battery state
```

## 🚀 Getting Started

1. Install dependencies
2. Set up environment variables
3. Configure database connections
4. Implement TODO items in each file
5. Add styling and UI components

## 🔧 Development

- **Driver Features**: Battery swap, payments, subscriptions
- **Staff Features**: Battery management, swap confirmation
- **Admin Features**: System management, reports, user control

## 📋 TODO

- [ ] Implement authentication logic
- [ ] Add database connections
- [ ] Create UI components
- [ ] Set up payment processing
- [ ] Implement real-time updates
- [ ] Add mobile responsiveness
- [ ] Set up testing framework
- [ ] Add error handling
- [ ] Implement logging
- [ ] Add performance monitoring