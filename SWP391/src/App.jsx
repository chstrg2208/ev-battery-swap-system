import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// Admin Components
import AdminUsers from './pages/Admin/Users';
import AdminBatteries from './pages/Admin/Batteries';
import AdminContracts from './pages/Admin/Contracts';
import AdminStations from './pages/Admin/Stations';
import AdminReports from './pages/Admin/Reports';

// Fix default markers for React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [currentView, setCurrentView] = useState('landing');
  const [dashboardTab, setDashboardTab] = useState('home');
  
  // Battery Management States
  const [batteries, setBatteries] = useState([]);
  const [batteryHistory, setBatteryHistory] = useState([]);
  const [batteryFilter, setBatteryFilter] = useState('all');
  const [showBatteryModal, setShowBatteryModal] = useState(false);
  const [selectedBattery, setSelectedBattery] = useState(null);
  
  // Swap Request Management States
  const [swapRequests, setSwapRequests] = useState([]);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedSwapRequest, setSelectedSwapRequest] = useState(null);
  
  // Transaction Management States
  const [transactions, setTransactions] = useState([]);
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  // Swap Confirm States
  const [pendingSwapRequests, setPendingSwapRequests] = useState([]);
  const [showSwapConfirmModal, setShowSwapConfirmModal] = useState(false);
  const [selectedSwapConfirm, setSelectedSwapConfirm] = useState(null);
  
  // Issues Management States
  const [issues, setIssues] = useState([]);
  const [issueFilter, setIssueFilter] = useState('all');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  
  // Reports States
  const [reports, setReports] = useState([]);
  const [dateRange, setDateRange] = useState('week');
  const [chartData, setChartData] = useState({});
  const [swapStep, setSwapStep] = useState(1);
  const [paymentTab, setPaymentTab] = useState('monthly-invoice');
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedPole, setSelectedPole] = useState(null);
  const [selectedPickupSlot, setSelectedPickupSlot] = useState(null);
  const [selectedReturnSlot, setSelectedReturnSlot] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: 10.7769, lng: 106.7009 });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentStep, setPaymentStep] = useState(1); // 1: select method, 2: enter details, 3: success
  const [showContractModal, setShowContractModal] = useState(false);
  
  // Vehicle and Plan Selection States
  const [showVehiclePlanSelection, setShowVehiclePlanSelection] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const [batteryData, setBatteryData] = useState({
    current: 25,
    health: 92,
    temperature: 28,
    voltage: 48.2,
    cycles: 156
  });
  
  // User Vehicles and Plans Data
  const userVehiclesAndPlans = {
    'driver1@example.com': [
      {
        vehicleId: 'vehicle_1',
        vehicleName: 'Yadea G5 - BKS: 59A-12345',
        vehicleType: 'Yadea G5 Pro',
        batteryCapacity: '72V 45Ah',
        plan: {
          id: 'eco',
          name: 'Eco',
          price: 135000,
          distance: 200,
          color: '#19c37d'
        },
        batteryInfo: {
          current: 25,
          health: 92,
          temperature: 28,
          voltage: 72.2,
          cycles: 156
        }
      },
      {
        vehicleId: 'vehicle_2', 
        vehicleName: 'Honda PCX Electric - BKS: 30B-67890',
        vehicleType: 'Honda PCX Electric',
        batteryCapacity: '60V 50Ah',
        plan: {
          id: 'premium',
          name: 'Premium',
          price: 3000000,
          distance: 'Không giới hạn',
          color: '#6ab7ff'
        },
        batteryInfo: {
          current: 85,
          health: 96,
          temperature: 26,
          voltage: 60.5,
          cycles: 89
        }
      }
    ],
    'driver2@example.com': [
      {
        vehicleId: 'vehicle_3',
        vehicleName: 'VinFast Feliz S - BKS: 51A-11111', 
        vehicleType: 'VinFast Feliz S',
        batteryCapacity: '48V 24Ah',
        plan: {
          id: 'plus',
          name: 'Plus',
          price: 400000,
          distance: 600,
          color: '#ffa500'
        },
        batteryInfo: {
          current: 67,
          health: 89,
          temperature: 30,
          voltage: 47.8,
          cycles: 203
        }
      }
    ]
  };
  
  // Demo accounts data
  const demoAccounts = {
    driver: [
      { email: 'driver1@example.com', password: '123456', name: 'Nguyễn Văn A' },
      { email: 'driver2@example.com', password: '123456', name: 'Trần Thị B' },
      { email: 'driver3@example.com', password: '123456', name: 'Lê Văn C' }
    ],
    staff: [
      { 
        email: 'staff1@station.com', 
        password: '123456', 
        name: 'Phạm Văn D',
        role: 'staff',
        stationId: 'station_1',
        stationName: 'Trạm đổi pin Quận 1',
        permissions: ['view_station', 'view_details'],
        level: 'junior'
      },
      { 
        email: 'staff2@station.com', 
        password: '123456', 
        name: 'Hoàng Thị E',
        role: 'staff',
        stationId: 'station_3',
        stationName: 'Trạm đổi pin Quận 3',
        permissions: ['view_station', 'view_details', 'edit_station'],
        level: 'senior'
      }
    ],
    admin: [
      { 
        email: 'admin@swp201.com', 
        password: 'admin123', 
        name: 'Admin System',
        role: 'admin',
        permissions: ['view_all', 'edit_all', 'add_station', 'delete_station'],
        level: 'admin'
      }
    ]
  };

  // Function to get stations based on user permissions
  const getStationsForUser = (user) => {
    const allStations = [
      {
        id: 'station_1',
        name: 'Trạm đổi pin Quận 1',
        address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
        capacity: '15/20',
        status: 'Hoạt động',
        transactions: 45,
        manager: 'Nguyễn Văn A',
        phone: '028-1234-5678',
        hours: '24/7',
        rating: '4.8',
        batteries: 18,
        ready: 15
      },
      {
        id: 'station_2',
        name: 'Trạm đổi pin Quận 2',
        address: '456 Lê Văn Việt, Quận 2, TP.HCM',
        capacity: '8/15',
        status: 'Hoạt động',
        transactions: 32,
        manager: 'Trần Thị B',
        phone: '028-2345-6789',
        hours: '6:00-22:00',
        rating: '4.6',
        batteries: 12,
        ready: 8
      },
      {
        id: 'station_3',
        name: 'Trạm đổi pin Quận 3',
        address: '789 Võ Văn Tần, Quận 3, TP.HCM',
        capacity: '0/12',
        status: 'Bảo trì',
        transactions: 0,
        manager: 'Lê Văn C',
        phone: '028-3456-7890',
        hours: '24/7',
        rating: '4.5',
        batteries: 12,
        ready: 0
      },
      {
        id: 'station_4',
        name: 'Trạm đổi pin Quận 7',
        address: '321 Nguyễn Thị Thập, Quận 7, TP.HCM',
        capacity: '12/25',
        status: 'Hoạt động',
        transactions: 69,
        manager: 'Phạm Văn D',
        phone: '028-4567-8901',
        hours: '24/7',
        rating: '4.9',
        batteries: 25,
        ready: 12
      }
    ];

    if (user.level === 'admin') {
      return allStations;
    } else if (user.level === 'senior') {
      // Senior staff can see their station + other active stations
      return allStations.filter(station => 
        station.id === user.stationId || station.status === 'Hoạt động'
      );
    } else {
      // Junior staff can only see their assigned station
      return allStations.filter(station => station.id === user.stationId);
    }
  };

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'Trạm mới',
      message: 'Trạm sạc Station 15 đã mở tại Quận 7',
      time: '2 phút trước',
      unread: true
    },
    {
      id: 2,
      type: 'warning',
      title: 'Pin sắp hết',
      message: 'Pin hiện tại còn 15%. Tìm trạm đổi pin gần nhất?',
      time: '5 phút trước',
      unread: true
    },
    {
      id: 3,
      type: 'success',
      title: 'Đổi pin thành công',
      message: 'Bạn đã đổi pin thành công tại Station 8',
      time: '1 giờ trước',
      unread: false
    }
  ]);

  // Initialize battery data
  useEffect(() => {
    // Mock battery data for the station
    const mockBatteries = [
      {
        id: 'BAT001',
        model: 'LiFePO4-60Ah',
        capacity: 60,
        soh: 95,
        status: 'Full',
        lastMaintenance: '2024-01-15',
        stationId: 'station_1',
        location: 'Slot A1'
      },
      {
        id: 'BAT002',
        model: 'LiFePO4-60Ah',
        capacity: 60,
        soh: 88,
        status: 'Charging',
        lastMaintenance: '2024-01-10',
        stationId: 'station_1',
        location: 'Slot A2'
      },
      {
        id: 'BAT003',
        model: 'LiFePO4-80Ah',
        capacity: 80,
        soh: 92,
        status: 'Full',
        lastMaintenance: '2024-01-12',
        stationId: 'station_1',
        location: 'Slot B1'
      },
      {
        id: 'BAT004',
        model: 'LiFePO4-60Ah',
        capacity: 60,
        soh: 75,
        status: 'Maintenance',
        lastMaintenance: '2024-01-08',
        stationId: 'station_1',
        location: 'Slot B2'
      },
      {
        id: 'BAT005',
        model: 'LiFePO4-80Ah',
        capacity: 80,
        soh: 98,
        status: 'Full',
        lastMaintenance: '2024-01-18',
        stationId: 'station_1',
        location: 'Slot C1'
      },
      {
        id: 'BAT006',
        model: 'LiFePO4-60Ah',
        capacity: 60,
        soh: 45,
        status: 'Error',
        lastMaintenance: '2024-01-05',
        stationId: 'station_1',
        location: 'Slot C2'
      }
    ];

    // Mock battery history data
    const mockBatteryHistory = [
      {
        id: 1,
        batteryId: 'BAT001',
        oldStatus: 'Charging',
        newStatus: 'Full',
        timestamp: '2024-01-20 14:30:00',
        changedBy: 'staff1@station.com',
        reason: 'Charging completed'
      },
      {
        id: 2,
        batteryId: 'BAT002',
        oldStatus: 'Full',
        newStatus: 'Charging',
        timestamp: '2024-01-20 14:25:00',
        changedBy: 'staff1@station.com',
        reason: 'Battery swap - old battery returned'
      },
      {
        id: 3,
        batteryId: 'BAT004',
        oldStatus: 'Charging',
        newStatus: 'Maintenance',
        timestamp: '2024-01-20 13:45:00',
        changedBy: 'staff2@station.com',
        reason: 'SOH below threshold - scheduled maintenance'
      }
    ];

    setBatteries(mockBatteries);
    setBatteryHistory(mockBatteryHistory);

    // Mock swap request data
    const mockSwapRequests = [
      {
        id: 'REQ001',
        driverId: 'driver1@example.com',
        driverName: 'Nguyễn Văn A',
        driverPhone: '0901234567',
        stationId: 'station_1',
        stationName: 'Trạm đổi pin Quận 1',
        batteryOld: 'BAT002',
        batteryOldModel: 'LiFePO4-60Ah',
        batteryOldSOH: 45,
        batteryOldLocation: 'Slot A2',
        batteryNew: 'BAT001',
        batteryNewModel: 'LiFePO4-60Ah',
        batteryNewSOH: 95,
        batteryNewLocation: 'Slot A1',
        requestTime: '2024-01-20 14:25:00',
        status: 'pending',
        estimatedDuration: '2 phút',
        paymentMethod: 'MoMo',
        amount: 50000
      },
      {
        id: 'REQ002',
        driverId: 'driver2@example.com',
        driverName: 'Trần Thị B',
        driverPhone: '0907654321',
        stationId: 'station_1',
        stationName: 'Trạm đổi pin Quận 1',
        batteryOld: 'BAT003',
        batteryOldModel: 'LiFePO4-80Ah',
        batteryOldSOH: 38,
        batteryOldLocation: 'Slot B1',
        batteryNew: 'BAT005',
        batteryNewModel: 'LiFePO4-80Ah',
        batteryNewSOH: 98,
        batteryNewLocation: 'Slot C1',
        requestTime: '2024-01-20 13:45:00',
        status: 'pending',
        estimatedDuration: '2 phút',
        paymentMethod: 'Visa',
        amount: 50000
      },
      {
        id: 'REQ003',
        driverId: 'driver3@example.com',
        driverName: 'Lê Văn C',
        driverPhone: '0909876543',
        stationId: 'station_1',
        stationName: 'Trạm đổi pin Quận 1',
        batteryOld: 'BAT004',
        batteryOldModel: 'LiFePO4-60Ah',
        batteryOldSOH: 25,
        batteryOldLocation: 'Slot B2',
        batteryNew: 'BAT003',
        batteryNewModel: 'LiFePO4-80Ah',
        batteryNewSOH: 92,
        batteryNewLocation: 'Slot B1',
        requestTime: '2024-01-20 12:15:00',
        status: 'pending',
        estimatedDuration: '3 phút',
        paymentMethod: 'Bank Transfer',
        amount: 50000
      }
    ];

    setSwapRequests(mockSwapRequests);

    // Mock transaction data
    const mockTransactions = [
      {
        id: 'SWAP001',
        driverId: 'driver1@example.com',
        driverName: 'Nguyễn Văn A',
        driverPhone: '0901234567',
        stationId: 'station_1',
        stationName: 'Trạm đổi pin Quận 1',
        batteryOld: 'BAT002',
        batteryNew: 'BAT001',
        batteryOldModel: 'LiFePO4-60Ah',
        batteryNewModel: 'LiFePO4-60Ah',
        batteryOldSOH: 45,
        batteryNewSOH: 95,
        swapTime: '2024-01-20 14:30:00',
        paymentStatus: 'Success',
        paymentMethod: 'MoMo',
        amount: 50000,
        duration: '2 phút 15 giây',
        location: 'Slot A1 → Slot A2',
        completedBy: 'staff1@station.com'
      },
      {
        id: 'SWAP002',
        driverId: 'driver2@example.com',
        driverName: 'Trần Thị B',
        driverPhone: '0907654321',
        stationId: 'station_1',
        stationName: 'Trạm đổi pin Quận 1',
        batteryOld: 'BAT003',
        batteryNew: 'BAT005',
        batteryOldModel: 'LiFePO4-80Ah',
        batteryNewModel: 'LiFePO4-80Ah',
        batteryOldSOH: 38,
        batteryNewSOH: 98,
        swapTime: '2024-01-20 13:45:00',
        paymentStatus: 'Success',
        paymentMethod: 'Visa',
        amount: 50000,
        duration: '1 phút 52 giây',
        location: 'Slot B1 → Slot C1',
        completedBy: 'staff1@station.com'
      },
      {
        id: 'SWAP003',
        driverId: 'driver3@example.com',
        driverName: 'Lê Văn C',
        driverPhone: '0909876543',
        stationId: 'station_1',
        stationName: 'Trạm đổi pin Quận 1',
        batteryOld: 'BAT004',
        batteryNew: 'BAT003',
        batteryOldModel: 'LiFePO4-60Ah',
        batteryNewModel: 'LiFePO4-80Ah',
        batteryOldSOH: 25,
        batteryNewSOH: 92,
        swapTime: '2024-01-20 12:15:00',
        paymentStatus: 'Pending',
        paymentMethod: 'Bank Transfer',
        amount: 50000,
        duration: '3 phút 08 giây',
        location: 'Slot B2 → Slot B1',
        completedBy: 'staff2@station.com'
      },
      {
        id: 'SWAP004',
        driverId: 'driver1@example.com',
        driverName: 'Nguyễn Văn A',
        driverPhone: '0901234567',
        stationId: 'station_1',
        stationName: 'Trạm đổi pin Quận 1',
        batteryOld: 'BAT006',
        batteryNew: 'BAT002',
        batteryOldModel: 'LiFePO4-60Ah',
        batteryNewModel: 'LiFePO4-60Ah',
        batteryOldSOH: 15,
        batteryNewSOH: 88,
        swapTime: '2024-01-19 16:20:00',
        paymentStatus: 'Success',
        paymentMethod: 'MoMo',
        amount: 50000,
        duration: '2 phút 45 giây',
        location: 'Slot C2 → Slot A2',
        completedBy: 'staff1@station.com'
      },
      {
        id: 'SWAP005',
        driverId: 'driver2@example.com',
        driverName: 'Trần Thị B',
        driverPhone: '0907654321',
        stationId: 'station_1',
        stationName: 'Trạm đổi pin Quận 1',
        batteryOld: 'BAT001',
        batteryNew: 'BAT004',
        batteryOldModel: 'LiFePO4-60Ah',
        batteryNewModel: 'LiFePO4-60Ah',
        batteryOldSOH: 42,
        batteryNewSOH: 75,
        swapTime: '2024-01-19 10:30:00',
        paymentStatus: 'Failed',
        paymentMethod: 'MoMo',
        amount: 50000,
        duration: '4 phút 12 giây',
        location: 'Slot A1 → Slot B2',
        completedBy: 'staff2@station.com'
      }
    ];

    setTransactions(mockTransactions);

    // Mock pending swap requests data
    const mockPendingSwapRequests = [
      {
        id: 'REQ001',
        driverId: 'driver1@example.com',
        driverName: 'Nguyễn Văn A',
        driverPhone: '0901234567',
        stationId: 'station_1',
        stationName: 'Trạm đổi pin Quận 1',
        batteryOld: 'BAT002',
        batteryNew: 'BAT001',
        batteryOldModel: 'LiFePO4-60Ah',
        batteryNewModel: 'LiFePO4-60Ah',
        batteryOldSOH: 45,
        batteryNewSOH: 95,
        requestTime: '2024-01-20 15:30:00',
        status: 'pending',
        location: 'Slot A1 → Slot A2',
        estimatedDuration: '2-3 phút',
        vehicleModel: 'VinFast VF8',
        licensePlate: '30A-12345'
      },
      {
        id: 'REQ002',
        driverId: 'driver2@example.com',
        driverName: 'Trần Thị B',
        driverPhone: '0907654321',
        stationId: 'station_1',
        stationName: 'Trạm đổi pin Quận 1',
        batteryOld: 'BAT003',
        batteryNew: 'BAT005',
        batteryOldModel: 'LiFePO4-80Ah',
        batteryNewModel: 'LiFePO4-80Ah',
        batteryOldSOH: 38,
        batteryNewSOH: 98,
        requestTime: '2024-01-20 15:25:00',
        status: 'pending',
        location: 'Slot B1 → Slot C1',
        estimatedDuration: '2-3 phút',
        vehicleModel: 'Tesla Model 3',
        licensePlate: '51G-67890'
      },
      {
        id: 'REQ003',
        driverId: 'driver3@example.com',
        driverName: 'Lê Văn C',
        driverPhone: '0909876543',
        stationId: 'station_1',
        stationName: 'Trạm đổi pin Quận 1',
        batteryOld: 'BAT004',
        batteryNew: 'BAT003',
        batteryOldModel: 'LiFePO4-60Ah',
        batteryNewModel: 'LiFePO4-80Ah',
        batteryOldSOH: 25,
        batteryNewSOH: 92,
        requestTime: '2024-01-20 15:20:00',
        status: 'pending',
        location: 'Slot B2 → Slot B1',
        estimatedDuration: '3-4 phút',
        vehicleModel: 'BYD Atto 3',
        licensePlate: '43H-11111'
      }
    ];

    setPendingSwapRequests(mockPendingSwapRequests);

    // Mock issues data
    const mockIssues = [
      {
        id: 'ISS001',
        driverId: 'driver1@example.com',
        driverName: 'Nguyễn Văn A',
        driverPhone: '0901234567',
        stationId: 'station_1',
        stationName: 'Trạm đổi pin Quận 1',
        title: 'Pin không sạc được',
        description: 'Pin BAT002 sau khi đổi không sạc được, đèn báo lỗi màu đỏ',
        category: 'Battery Issue',
        priority: 'High',
        status: 'Pending',
        createdAt: '2024-01-20 14:30:00',
        updatedAt: '2024-01-20 14:30:00',
        solutionNotes: '',
        assignedTo: '',
        batteryId: 'BAT002',
        location: 'Slot A2'
      },
      {
        id: 'ISS002',
        driverId: 'driver2@example.com',
        driverName: 'Trần Thị B',
        driverPhone: '0907654321',
        stationId: 'station_1',
        stationName: 'Trạm đổi pin Quận 1',
        title: 'Máy đổi pin bị kẹt',
        description: 'Máy đổi pin tại Slot B1 bị kẹt, không thể lấy pin ra được',
        category: 'Machine Issue',
        priority: 'Critical',
        status: 'In Progress',
        createdAt: '2024-01-20 13:45:00',
        updatedAt: '2024-01-20 15:00:00',
        solutionNotes: 'Đã gọi kỹ thuật viên đến kiểm tra',
        assignedTo: 'staff1@station.com',
        batteryId: 'BAT003',
        location: 'Slot B1'
      },
      {
        id: 'ISS003',
        driverId: 'driver3@example.com',
        driverName: 'Lê Văn C',
        driverPhone: '0909876543',
        stationId: 'station_1',
        stationName: 'Trạm đổi pin Quận 1',
        title: 'Màn hình cảm ứng không hoạt động',
        description: 'Màn hình cảm ứng tại Slot C1 không phản hồi khi chạm',
        category: 'UI Issue',
        priority: 'Medium',
        status: 'Done',
        createdAt: '2024-01-20 12:15:00',
        updatedAt: '2024-01-20 16:30:00',
        solutionNotes: 'Đã khởi động lại hệ thống, màn hình hoạt động bình thường',
        assignedTo: 'staff2@station.com',
        batteryId: 'BAT004',
        location: 'Slot C1'
      },
      {
        id: 'ISS004',
        driverId: 'driver1@example.com',
        driverName: 'Nguyễn Văn A',
        driverPhone: '0901234567',
        stationId: 'station_1',
        stationName: 'Trạm đổi pin Quận 1',
        title: 'Pin sạc chậm',
        description: 'Pin BAT006 sạc rất chậm, mất hơn 2 giờ mới đầy',
        category: 'Battery Issue',
        priority: 'Low',
        status: 'Pending',
        createdAt: '2024-01-20 11:30:00',
        updatedAt: '2024-01-20 11:30:00',
        solutionNotes: '',
        assignedTo: '',
        batteryId: 'BAT006',
        location: 'Slot C2'
      },
      {
        id: 'ISS005',
        driverId: 'driver2@example.com',
        driverName: 'Trần Thị B',
        driverPhone: '0907654321',
        stationId: 'station_1',
        stationName: 'Trạm đổi pin Quận 1',
        title: 'Cảm biến nhiệt độ báo sai',
        description: 'Cảm biến nhiệt độ tại Slot A1 báo nhiệt độ cao bất thường',
        category: 'Sensor Issue',
        priority: 'Medium',
        status: 'In Progress',
        createdAt: '2024-01-20 10:45:00',
        updatedAt: '2024-01-20 14:15:00',
        solutionNotes: 'Đang kiểm tra cảm biến và hệ thống làm mát',
        assignedTo: 'staff1@station.com',
        batteryId: 'BAT001',
        location: 'Slot A1'
      }
    ];

    setIssues(mockIssues);

    // Mock reports data
    const mockReports = {
      dailyStats: [
        { date: '2024-01-14', swaps: 12, revenue: 600000, brokenBatteries: 1 },
        { date: '2024-01-15', swaps: 18, revenue: 900000, brokenBatteries: 0 },
        { date: '2024-01-16', swaps: 15, revenue: 750000, brokenBatteries: 2 },
        { date: '2024-01-17', swaps: 22, revenue: 1100000, brokenBatteries: 1 },
        { date: '2024-01-18', swaps: 19, revenue: 950000, brokenBatteries: 0 },
        { date: '2024-01-19', swaps: 25, revenue: 1250000, brokenBatteries: 1 },
        { date: '2024-01-20', swaps: 16, revenue: 800000, brokenBatteries: 2 }
      ],
      weeklyStats: {
        totalSwaps: 127,
        totalRevenue: 6350000,
        totalBrokenBatteries: 7,
        averageSwapsPerDay: 18.1,
        averageRevenuePerDay: 907143
      },
      monthlyStats: {
        totalSwaps: 485,
        totalRevenue: 24250000,
        totalBrokenBatteries: 23,
        averageSwapsPerDay: 15.6,
        averageRevenuePerDay: 782258
      }
    };

    setReports(mockReports);
  }, []);

  // Functions
  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type} show`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  const handleLogin = (email, password) => {
    // Check demo accounts
    for (const role in demoAccounts) {
      const account = demoAccounts[role].find(acc => acc.email === email && acc.password === password);
      if (account) {
        setCurrentUser({ ...account, role });
        setShowLoginModal(false);
        
        // Check if user has multiple vehicles
        const userVehicles = userVehiclesAndPlans[email] || [];
        if (userVehicles.length > 1) {
          // Show vehicle/plan selection screen
          setShowVehiclePlanSelection(true);
          showToast(`Chào mừng ${account.name}! Vui lòng chọn xe và gói dịch vụ.`);
        } else if (userVehicles.length === 1) {
          // Auto-select the only vehicle and plan
          const vehicle = userVehicles[0];
          setSelectedVehicle(vehicle);
          setSelectedPlan(vehicle.plan);
          setBatteryData(vehicle.batteryInfo);
          setCurrentView('dashboard');
          showToast(`Đăng nhập thành công! Chào mừng ${account.name}`);
        } else {
          // No vehicles assigned
          setCurrentView('dashboard');
          showToast(`Đăng nhập thành công! Chào mừng ${account.name}`);
        }
        return;
      }
    }
    showToast('Sai email hoặc mật khẩu!', 'error');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
    setDashboardTab('home');
    setSelectedVehicle(null);
    setSelectedPlan(null);
    setShowVehiclePlanSelection(false);
    setBatteryData({
      current: 25,
      health: 92,
      temperature: 28,
      voltage: 48.2,
      cycles: 156
    });
    showToast('Đã đăng xuất thành công!');
  };

  // Battery Management Functions
  const updateBatteryStatus = (batteryId, newStatus, reason = '') => {
    const battery = batteries.find(b => b.id === batteryId);
    if (!battery) return;

    const oldStatus = battery.status;
    
    // Update battery status
    setBatteries(prev => prev.map(b => 
      b.id === batteryId ? { ...b, status: newStatus } : b
    ));

    // Add to history
    const historyEntry = {
      id: batteryHistory.length + 1,
      batteryId,
      oldStatus,
      newStatus,
      timestamp: new Date().toLocaleString('vi-VN'),
      changedBy: currentUser?.email || 'system',
      reason: reason || `Status changed from ${oldStatus} to ${newStatus}`
    };

    setBatteryHistory(prev => [historyEntry, ...prev]);
    showToast(`Cập nhật trạng thái pin ${batteryId} thành công!`);
  };

  const getBatteriesForStation = (stationId) => {
    return batteries.filter(battery => battery.stationId === stationId);
  };

  const getFilteredBatteries = () => {
    const stationBatteries = getBatteriesForStation(currentUser?.stationId);
    if (batteryFilter === 'all') return stationBatteries;
    return stationBatteries.filter(battery => battery.status === batteryFilter);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Full': return '#19c37d';
      case 'Charging': return '#6ab7ff';
      case 'Maintenance': return '#f59e0b';
      case 'Error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Full': return '🔋';
      case 'Charging': return '⚡';
      case 'Maintenance': return '🔧';
      case 'Error': return '⚠️';
      default: return '❓';
    }
  };

  const getSOHColor = (soh) => {
    if (soh >= 90) return '#19c37d';
    if (soh >= 70) return '#f59e0b';
    return '#ef4444';
  };

  // Swap Request Management Functions
  const getSwapRequestsForStation = (stationId) => {
    return swapRequests.filter(request => request.stationId === stationId && request.status === 'pending');
  };

  const confirmSwap = (requestId) => {
    const request = swapRequests.find(req => req.id === requestId);
    if (!request) return;

    // Update battery statuses
    updateBatteryStatus(request.batteryOld, 'Charging', `Battery swap - old battery returned by ${request.driverName}`);
    updateBatteryStatus(request.batteryNew, 'In Use', `Battery swap - new battery assigned to ${request.driverName}`);

    // Update swap request status
    setSwapRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'completed', completedTime: new Date().toLocaleString('vi-VN') } : req
    ));

    // Add to battery history
    const historyEntry = {
      id: batteryHistory.length + 1,
      batteryId: request.batteryOld,
      oldStatus: 'In Use',
      newStatus: 'Charging',
      timestamp: new Date().toLocaleString('vi-VN'),
      changedBy: currentUser?.email || 'system',
      reason: `Swap confirmed - old battery returned by ${request.driverName}`
    };

    const historyEntry2 = {
      id: batteryHistory.length + 2,
      batteryId: request.batteryNew,
      oldStatus: 'Full',
      newStatus: 'In Use',
      timestamp: new Date().toLocaleString('vi-VN'),
      changedBy: currentUser?.email || 'system',
      reason: `Swap confirmed - new battery assigned to ${request.driverName}`
    };

    setBatteryHistory(prev => [historyEntry, historyEntry2, ...prev]);

    showToast(`Xác nhận đổi pin thành công cho ${request.driverName}!`, 'success');
  };

  const rejectSwap = (requestId) => {
    const request = swapRequests.find(req => req.id === requestId);
    if (!request) return;

    setSwapRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'rejected', rejectedTime: new Date().toLocaleString('vi-VN') } : req
    ));

    showToast(`Đã từ chối yêu cầu đổi pin của ${request.driverName}`, 'warning');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Transaction Management Functions
  const getTransactionsForStation = (stationId) => {
    return transactions.filter(transaction => transaction.stationId === stationId);
  };

  const getFilteredTransactions = () => {
    let stationTransactions = getTransactionsForStation(currentUser?.stationId);
    
    // Filter by status
    if (transactionFilter !== 'all') {
      stationTransactions = stationTransactions.filter(transaction => 
        transaction.paymentStatus.toLowerCase() === transactionFilter.toLowerCase()
      );
    }
    
    // Filter by date
    if (dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          stationTransactions = stationTransactions.filter(transaction => {
            const transactionDate = new Date(transaction.swapTime);
            return transactionDate.toDateString() === today.toDateString();
          });
          break;
        case 'yesterday':
          filterDate.setDate(today.getDate() - 1);
          stationTransactions = stationTransactions.filter(transaction => {
            const transactionDate = new Date(transaction.swapTime);
            return transactionDate.toDateString() === filterDate.toDateString();
          });
          break;
        case 'week':
          const weekAgo = new Date();
          weekAgo.setDate(today.getDate() - 7);
          stationTransactions = stationTransactions.filter(transaction => {
            const transactionDate = new Date(transaction.swapTime);
            return transactionDate >= weekAgo;
          });
          break;
        case 'month':
          const monthAgo = new Date();
          monthAgo.setMonth(today.getMonth() - 1);
          stationTransactions = stationTransactions.filter(transaction => {
            const transactionDate = new Date(transaction.swapTime);
            return transactionDate >= monthAgo;
          });
          break;
      }
    }
    
    return stationTransactions.sort((a, b) => new Date(b.swapTime) - new Date(a.swapTime));
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Success': return '#19c37d';
      case 'Pending': return '#f59e0b';
      case 'Failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case 'Success': return '✅';
      case 'Pending': return '⏳';
      case 'Failed': return '❌';
      default: return '❓';
    }
  };

  // Swap Confirm Functions
  const getPendingSwapRequestsForStation = (stationId) => {
    return pendingSwapRequests.filter(request => request.stationId === stationId);
  };

  const confirmSwapRequest = (requestId) => {
    const request = pendingSwapRequests.find(req => req.id === requestId);
    if (!request) return;

    // Update battery statuses
    setBatteries(prevBatteries => 
      prevBatteries.map(battery => {
        if (battery.id === request.batteryOld) {
          return { ...battery, status: 'Charging' };
        }
        if (battery.id === request.batteryNew) {
          return { ...battery, status: 'In Use' };
        }
        return battery;
      })
    );

    // Add to battery history
    const newHistoryEntry = {
      id: batteryHistory.length + 1,
      batteryId: request.batteryOld,
      oldStatus: 'In Use',
      newStatus: 'Charging',
      timestamp: new Date().toLocaleString('vi-VN'),
      changedBy: currentUser.email,
      reason: `Swap confirmed - battery returned after swap ${requestId}`
    };

    setBatteryHistory(prev => [newHistoryEntry, ...prev]);

    // Create new transaction
    const newTransaction = {
      id: `SWAP${Date.now()}`,
      driverId: request.driverId,
      driverName: request.driverName,
      driverPhone: request.driverPhone,
      stationId: request.stationId,
      stationName: request.stationName,
      batteryOld: request.batteryOld,
      batteryNew: request.batteryNew,
      batteryOldModel: request.batteryOldModel,
      batteryNewModel: request.batteryNewModel,
      batteryOldSOH: request.batteryOldSOH,
      batteryNewSOH: request.batteryNewSOH,
      swapTime: new Date().toLocaleString('vi-VN'),
      paymentStatus: 'Success',
      paymentMethod: 'MoMo',
      amount: 50000,
      duration: request.estimatedDuration,
      location: request.location,
      completedBy: currentUser.email
    };

    setTransactions(prev => [newTransaction, ...prev]);

    // Remove from pending requests
    setPendingSwapRequests(prev => prev.filter(req => req.id !== requestId));

    showToast(`Đã xác nhận đổi pin cho ${request.driverName}`, 'success');
  };

  const rejectSwapRequest = (requestId) => {
    const request = pendingSwapRequests.find(req => req.id === requestId);
    if (!request) return;

    // Remove from pending requests
    setPendingSwapRequests(prev => prev.filter(req => req.id !== requestId));

    showToast(`Đã từ chối yêu cầu đổi pin của ${request.driverName}`, 'warning');
  };

  // Issues Management Functions
  const getIssuesForStation = (stationId) => {
    return issues.filter(issue => issue.stationId === stationId);
  };

  const getFilteredIssues = () => {
    let stationIssues = getIssuesForStation(currentUser?.stationId);
    
    // Filter by status
    if (issueFilter !== 'all') {
      stationIssues = stationIssues.filter(issue => 
        issue.status.toLowerCase() === issueFilter.toLowerCase()
      );
    }
    
    return stationIssues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const updateIssueStatus = (issueId, newStatus, solutionNotes = '') => {
    setIssues(prevIssues => 
      prevIssues.map(issue => 
        issue.id === issueId 
          ? { 
              ...issue, 
              status: newStatus, 
              solutionNotes: solutionNotes,
              updatedAt: new Date().toLocaleString('vi-VN'),
              assignedTo: currentUser.email
            }
          : issue
      )
    );

    const issue = issues.find(i => i.id === issueId);
    showToast(`Đã cập nhật trạng thái sự cố ${issueId} thành ${newStatus}`, 'success');
  };

  const getIssueStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#f59e0b';
      case 'In Progress': return '#3b82f6';
      case 'Done': return '#19c37d';
      default: return '#6b7280';
    }
  };

  const getIssueStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return '⏳';
      case 'In Progress': return '🔄';
      case 'Done': return '✅';
      default: return '❓';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#ef4444';
      case 'High': return '#f59e0b';
      case 'Medium': return '#3b82f6';
      case 'Low': return '#19c37d';
      default: return '#6b7280';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Critical': return '🚨';
      case 'High': return '⚠️';
      case 'Medium': return '📋';
      case 'Low': return '📝';
      default: return '❓';
    }
  };

  // Reports Functions
  const getFilteredReports = () => {
    if (!reports.dailyStats) return [];
    
    const today = new Date();
    const filterDate = new Date();
    
    switch (dateRange) {
      case 'week':
        filterDate.setDate(today.getDate() - 7);
        return reports.dailyStats.filter(stat => {
          const statDate = new Date(stat.date);
          return statDate >= filterDate;
        });
      case 'month':
        filterDate.setMonth(today.getMonth() - 1);
        return reports.dailyStats.filter(stat => {
          const statDate = new Date(stat.date);
          return statDate >= filterDate;
        });
      case 'quarter':
        filterDate.setMonth(today.getMonth() - 3);
        return reports.dailyStats.filter(stat => {
          const statDate = new Date(stat.date);
          return statDate >= filterDate;
        });
      default:
        return reports.dailyStats;
    }
  };

  const getChartData = () => {
    const filteredData = getFilteredReports();
    return {
      labels: filteredData.map(item => {
        const date = new Date(item.date);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      }),
      swaps: filteredData.map(item => item.swaps),
      revenue: filteredData.map(item => item.revenue),
      brokenBatteries: filteredData.map(item => item.brokenBatteries)
    };
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, unread: false } : notif
    ));
  };

  // Get vehicle data based on selected vehicle
  const getVehicleData = () => {
    if (selectedVehicle) {
      // Extract license plate from vehicle name (e.g., "VF 8 - BKS: 30A-12345" -> "30A-12345")
      const licensePlateMatch = selectedVehicle.vehicleName.match(/BKS:\s*([^)]+)/);
      const licensePlate = licensePlateMatch ? licensePlateMatch[1] : 'N/A';
      
      return {
        model: selectedVehicle.vehicleType,
        licensePlate: licensePlate,
        year: 2023, // Mock year
        batteryCapacity: selectedVehicle.batteryCapacity,
        registrationDate: '15/03/2023', // Mock date
        vehicleName: selectedVehicle.vehicleName
      };
    }
    
    // Default data if no vehicle selected
    return {
      model: 'VinFast Feliz S',
      licensePlate: '59H1-12345',
      year: 2023,
      batteryCapacity: '48V 24Ah',
      registrationDate: '15/03/2023',
      vehicleName: 'VinFast Feliz S - BKS: 59H1-12345'
    };
  };

  const vehicleData = getVehicleData();

  // Get subscription data based on selected vehicle and plan
  const getSubscriptionData = () => {
    if (selectedVehicle && selectedPlan) {
      return {
        plan: selectedPlan.name,
        status: 'Đang hoạt động',
        distanceUsed: Math.floor(Math.random() * 200) + 100, // Mock data
        distanceLimit: selectedPlan.distance,
        paidThroughDate: '30/09/2024',
        monthlyFee: selectedPlan.price,
        vehicleName: selectedVehicle.vehicleName,
        vehicleType: selectedVehicle.vehicleType
      };
    }
    
    // Default data if no vehicle selected
    return {
      plan: 'Premium',
      status: 'Đang hoạt động',
      distanceUsed: 750,
      distanceLimit: 'Không giới hạn',
      paidThroughDate: '30/09/2024',
      monthlyFee: 3000000,
      vehicleName: 'VF 8 - BKS: 30A-12345',
      vehicleType: 'VinFast VF 8'
    };
  };

  const subscriptionData = getSubscriptionData();

  const paymentHistory = [
    { id: 1, date: '15/11/2024', type: 'Nạp tiền', amount: 500000, status: 'Thành công' },
    { id: 2, date: '10/11/2024', type: 'Đổi pin', amount: -15000, status: 'Thành công' },
    { id: 3, date: '05/11/2024', type: 'Phí thuê bao', amount: -299000, status: 'Thành công' }
  ];

  const nearbyStations = [
    { 
      id: 1, 
      name: 'Station 1', 
      distance: '0.5km', 
      available: 5, 
      total: 8, 
      status: 'Hoạt động',
      waitTime: 3,
      fullBatteries: 5,
      chargingBatteries: 2,
      emptyBatteries: 1,
      lat: 10.7769,
      lng: 106.7009,
      address: '123 Nguyễn Văn Linh, Q7, TP.HCM',
      poles: [
        { id: 1, name: 'Trụ A', slots: 10, fullSlots: 4, chargingSlots: 3, emptySlots: 3 },
        { id: 2, name: 'Trụ B', slots: 10, fullSlots: 3, chargingSlots: 4, emptySlots: 3 }
      ]
    },
    { 
      id: 2, 
      name: 'Station 2', 
      distance: '1.2km', 
      available: 6, 
      total: 12, 
      status: 'Hoạt động',
      waitTime: 8,
      fullBatteries: 6,
      chargingBatteries: 4,
      emptyBatteries: 2,
      lat: 10.7829,
      lng: 106.6934,
      address: '456 Lê Văn Lương, Q7, TP.HCM',
      poles: [
        { id: 1, name: 'Trụ A', slots: 8, fullSlots: 3, chargingSlots: 2, emptySlots: 3 },
        { id: 2, name: 'Trụ B', slots: 8, fullSlots: 2, chargingSlots: 3, emptySlots: 3 },
        { id: 3, name: 'Trụ C', slots: 6, fullSlots: 1, chargingSlots: 2, emptySlots: 3 }
      ]
    },
    { 
      id: 3, 
      name: 'Station 3', 
      distance: '2.1km', 
      available: 4, 
      total: 8, 
      status: 'Hoạt động',
      waitTime: 5,
      fullBatteries: 4,
      chargingBatteries: 3,
      emptyBatteries: 1,
      lat: 10.7892,
      lng: 106.7100,
      address: '789 Huỳnh Tấn Phát, Q7, TP.HCM',
      poles: [
        { id: 1, name: 'Trụ A', slots: 6, fullSlots: 2, chargingSlots: 2, emptySlots: 2 },
        { id: 2, name: 'Trụ B', slots: 8, fullSlots: 2, chargingSlots: 3, emptySlots: 3 }
      ]
    },
    { 
      id: 4, 
      name: 'Station 4', 
      distance: '3.5km', 
      available: 3, 
      total: 6, 
      status: 'Hoạt động',
      waitTime: 12,
      fullBatteries: 3,
      chargingBatteries: 2,
      emptyBatteries: 1,
      lat: 10.7650,
      lng: 106.6800,
      address: '321 Nguyễn Hữu Thọ, Q7, TP.HCM',
      poles: [
        { id: 1, name: 'Trụ A', slots: 6, fullSlots: 2, chargingSlots: 2, emptySlots: 2 },
        { id: 2, name: 'Trụ B', slots: 6, fullSlots: 1, chargingSlots: 3, emptySlots: 2 }
      ]
    },
    { 
      id: 5, 
      name: 'Station 5', 
      distance: '4.2km', 
      available: 7, 
      total: 15, 
      status: 'Hoạt động',
      waitTime: 6,
      fullBatteries: 7,
      chargingBatteries: 5,
      emptyBatteries: 3,
      lat: 10.7950,
      lng: 106.7200,
      address: '654 Võ Văn Kiệt, Q5, TP.HCM',
      poles: [
        { id: 1, name: 'Trụ A', slots: 10, fullSlots: 4, chargingSlots: 3, emptySlots: 3 },
        { id: 2, name: 'Trụ B', slots: 8, fullSlots: 2, chargingSlots: 4, emptySlots: 2 },
        { id: 3, name: 'Trụ C', slots: 7, fullSlots: 1, chargingSlots: 3, emptySlots: 3 }
      ]
    },
    { 
      id: 6, 
      name: 'Station 6', 
      distance: '5.8km', 
      available: 2, 
      total: 6, 
      status: 'Bảo trì',
      waitTime: 0,
      fullBatteries: 0,
      chargingBatteries: 0,
      emptyBatteries: 6,
      lat: 10.7600,
      lng: 106.7300,
      address: '987 Trần Hưng Đạo, Q1, TP.HCM',
      poles: [
        { id: 1, name: 'Trụ A', slots: 6, fullSlots: 0, chargingSlots: 0, emptySlots: 6 },
        { id: 2, name: 'Trụ B', slots: 6, fullSlots: 0, chargingSlots: 0, emptySlots: 6 }
      ]
    }
  ];

  // Calculate distance between two points
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  // Map Component
  const StationMap = () => {
    const center = [userLocation.lat, userLocation.lng];
    
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(newLocation);
            showToast('Đã cập nhật vị trí hiện tại!', 'success');
          },
          (error) => {
            showToast('Không thể lấy vị trí. Sử dụng vị trí mặc định.', 'warning');
          }
        );
      } else {
        showToast('Trình duyệt không hỗ trợ định vị!', 'error');
      }
    };
    
    return (
      <div>
        <div style={{ marginBottom: '16px', textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={getCurrentLocation}>
            📍 Lấy vị trí hiện tại
          </button>
        </div>
        <div className="map-container" style={{ height: '400px', borderRadius: '12px', overflow: 'hidden' }}>
          <MapContainer 
            center={center} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* User location marker */}
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>
                <div style={{ minWidth: '150px', textAlign: 'center' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#4F8CFF' }}>📍 Vị trí của bạn</h4>
                  <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
                    Tọa độ: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>

            {/* Station markers */}
            {nearbyStations.map(station => {
              const distance = calculateDistance(userLocation.lat, userLocation.lng, station.lat, station.lng);
              return (
                <Marker key={station.id} position={[station.lat, station.lng]}>
                  <Popup>
                    <div style={{ minWidth: '250px' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{station.name}</h4>
                      <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
                        📍 {station.address}
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '13px', color: '#4F8CFF' }}>
                        📏 Khoảng cách: <strong>{distance}</strong>
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '13px', color: station.status === 'Hoạt động' ? '#19c37d' : '#ff4757' }}>
                        ● {station.status}
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
                        🔋 {station.available}/{station.total} pin có sẵn
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
                        🏗️ {station.poles.length} trụ sạc
                      </p>
                      {station.status === 'Hoạt động' && (
                        <>
                          <p style={{ margin: '4px 0', fontSize: '13px', color: '#666' }}>
                            ⏱️ Thời gian chờ: ~{station.waitTime} phút
                          </p>
                          <div style={{ marginTop: '8px', fontSize: '12px' }}>
                            <span style={{ color: '#19c37d', marginRight: '8px' }}>● {station.fullBatteries} đầy</span>
                            <span style={{ color: '#ffa500', marginRight: '8px' }}>● {station.chargingBatteries} sạc</span>
                            <span style={{ color: '#ff4757' }}>● {station.emptyBatteries} trống</span>
                          </div>
                        </>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    );
  };

  // Components
  const LandingPage = () => (
    <div id="landing">
      <header>
        <div className="container">
          <nav className="nav">
            <div className="brand">
              <div className="logo">
                <svg viewBox="0 0 24 24">
                  <path d="M13 3l3.5 6L12 11.5 8.5 9 13 3zm4.5 9L16 14.5 12 17l-4-2.5 1.5-2.5 4.5 2.5L17.5 12zM12 19l-7.5-12L3 5l9 14 9-14-1.5 2L12 19z"/>
                </svg>
              </div>
              SWP201
            </div>
            <div className="nav-links">
              <a href="#features">Tính năng</a>
              <a href="#pricing">Gói dịch vụ</a>
              <a href="#about">Về chúng tôi</a>
            </div>
            <div className="auth-buttons">
              <button className="btn" onClick={() => setShowLoginModal(true)}>Đăng nhập</button>
              <button className="btn btn-primary" onClick={() => setShowRegisterModal(true)}>Đăng ký</button>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <div className="hero">
          <div className="container">
            <div className="eyebrow">
              ⚡ Hệ thống đổi pin thông minh
            </div>
            <h1 className="title">
              Đổi pin xe điện <strong>nhanh chóng</strong><br/>
              và <strong>tiện lợi</strong>
            </h1>
            <p className="subtitle">
              Giải pháp đổi pin tự động cho xe điện với mạng lưới trạm sạc rộng khắp thành phố. 
              Chỉ 3 phút để có pin đầy 100%.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => setShowRegisterModal(true)}>
                Bắt đầu ngay
              </button>
              <button className="btn" onClick={() => setShowLoginModal(true)}>
                Đăng nhập
              </button>
            </div>
          </div>
        </div>

        <section id="features">
          <div className="container">
            <h2>Tính năng nổi bật</h2>
            <div className="grid">
              <div className="card">
                <div className="icon">⚡</div>
                <h3>Đổi pin siêu nhanh</h3>
                <p className="muted">Chỉ 3 phút để đổi pin, nhanh hơn việc đổ xăng truyền thống</p>
              </div>
              <div className="card">
                <div className="icon">📍</div>
                <h3>Mạng lưới rộng khắp</h3>
                <p className="muted">Hơn 50 trạm đổi pin trên toàn thành phố</p>
              </div>
              <div className="card featured">
                <div className="icon">📱</div>
                <h3>Ứng dụng thông minh</h3>
                <p className="muted">Theo dõi pin, tìm trạm, thanh toán tự động</p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" style={{padding: '80px 0', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'}}>
          <div className="container">
            <div style={{textAlign: 'center', marginBottom: '60px'}}>
              <h2 style={{fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', color: 'white'}}>
                Gói dịch vụ đổi pin thông minh
              </h2>
              <p style={{fontSize: '20px', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto'}}>
                Chọn gói phù hợp với nhu cầu sử dụng. Tính phí theo quãng đường thực tế.
              </p>
            </div>
            
            <div className="pricing" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
              {/* Eco Plan */}
              <div className="card" style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center',
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                }
              }}>
                <div style={{marginBottom: '24px'}}>
                  <h3 style={{fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px'}}>Eco</h3>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px'}}>Tiết kiệm nhất</div>
                </div>
                <div style={{marginBottom: '24px'}}>
                  <div style={{fontSize: '48px', fontWeight: 'bold', color: '#10b981'}}>135,000₫</div>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '16px'}}>/tháng</div>
                  <div style={{color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '8px'}}>
                    Quãng đường cơ sở: 200 km
                  </div>
                </div>
                <ul style={{listStyle: 'none', padding: '0', marginBottom: '32px', textAlign: 'left'}}>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#10b981', marginRight: '12px', fontSize: '18px'}}>✓</span>
                    200 km/tháng
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#10b981', marginRight: '12px', fontSize: '18px'}}>✓</span>
                    Ứng dụng cơ bản
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#10b981', marginRight: '12px', fontSize: '18px'}}>✓</span>
                    Hỗ trợ 24/7
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#ef4444', marginRight: '12px', fontSize: '18px'}}>⚠</span>
                    Phí vượt km nếu {'>'}200km
                  </li>
                </ul>
                <button 
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => {
                    setShowLoginModal(true);
                    showToast('Vui lòng đăng nhập để chọn gói!', 'info');
                  }}
                >
                  Chọn gói Eco
                </button>
              </div>

              {/* Cơ bản Plan */}
              <div className="card" style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}>
                <div style={{marginBottom: '24px'}}>
                  <h3 style={{fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px'}}>Cơ bản</h3>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px'}}>Phù hợp gia đình</div>
                </div>
                <div style={{marginBottom: '24px'}}>
                  <div style={{fontSize: '48px', fontWeight: 'bold', color: '#3b82f6'}}>270,000₫</div>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '16px'}}>/tháng</div>
                  <div style={{color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '8px'}}>
                    Quãng đường cơ sở: 400 km
                  </div>
                </div>
                <ul style={{listStyle: 'none', padding: '0', marginBottom: '32px', textAlign: 'left'}}>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#3b82f6', marginRight: '12px', fontSize: '18px'}}>✓</span>
                    400 km/tháng
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#3b82f6', marginRight: '12px', fontSize: '18px'}}>✓</span>
                    Ứng dụng đầy đủ
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#3b82f6', marginRight: '12px', fontSize: '18px'}}>✓</span>
                    Ưu tiên đổi pin
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#3b82f6', marginRight: '12px', fontSize: '18px'}}>✓</span>
                    Hỗ trợ ưu tiên
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#ef4444', marginRight: '12px', fontSize: '18px'}}>⚠</span>
                    Phí vượt km nếu {'>'}400km
                  </li>
                </ul>
                <button 
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => {
                    setShowLoginModal(true);
                    showToast('Vui lòng đăng nhập để chọn gói!', 'info');
                  }}
                >
                  Chọn gói Cơ bản
                </button>
              </div>

              {/* Plus Plan */}
              <div className="card featured" style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(139, 92, 246, 0.1))',
                border: '2px solid #a855f7',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center',
                position: 'relative',
                transition: 'all 0.3s ease',
                transform: 'scale(1.05)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #a855f7, #8b5cf6)',
                  color: 'white',
                  padding: '6px 20px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  PHỔ BIẾN NHẤT
                </div>
                <div style={{marginBottom: '24px', marginTop: '16px'}}>
                  <h3 style={{fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px'}}>Plus</h3>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px'}}>Tối ưu hiệu quả</div>
                </div>
                <div style={{marginBottom: '24px'}}>
                  <div style={{fontSize: '48px', fontWeight: 'bold', color: '#a855f7'}}>400,000₫</div>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '16px'}}>/tháng</div>
                  <div style={{color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '8px'}}>
                    Quãng đường cơ sở: 600 km
                  </div>
                </div>
                <ul style={{listStyle: 'none', padding: '0', marginBottom: '32px', textAlign: 'left'}}>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#a855f7', marginRight: '12px', fontSize: '18px'}}>✓</span>
                    600 km/tháng
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#a855f7', marginRight: '12px', fontSize: '18px'}}>✓</span>
                    Ứng dụng đầy đủ
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#a855f7', marginRight: '12px', fontSize: '18px'}}>✓</span>
                    Ưu tiên đổi pin
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#a855f7', marginRight: '12px', fontSize: '18px'}}>✓</span>
                    Thông báo real-time
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#a855f7', marginRight: '12px', fontSize: '18px'}}>✓</span>
                    Đặt trước trạm
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#ef4444', marginRight: '12px', fontSize: '18px'}}>⚠</span>
                    Phí vượt km nếu {'>'}600km
                  </li>
                </ul>
                <button 
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #a855f7, #8b5cf6)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 25px rgba(168, 85, 247, 0.3)'
                  }}
                  onClick={() => {
                    setShowLoginModal(true);
                    showToast('Vui lòng đăng nhập để chọn gói!', 'info');
                  }}
                >
                  Chọn gói Plus
                </button>
              </div>

              {/* Premium Plan */}
              <div className="card" style={{
                background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(202, 138, 4, 0.1))',
                border: '2px solid #eab308',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #eab308, #ca8a04)',
                  color: 'white',
                  padding: '6px 20px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  DOANH NGHIỆP
                </div>
                <div style={{marginBottom: '24px', marginTop: '16px'}}>
                  <h3 style={{fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px'}}>Premium</h3>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px'}}>Không giới hạn</div>
                </div>
                <div style={{marginBottom: '24px'}}>
                  <div style={{fontSize: '42px', fontWeight: 'bold', color: '#eab308'}}>3,000,000₫</div>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '16px'}}>/tháng</div>
                  <div style={{color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '8px'}}>
                    Quãng đường: Không giới hạn
                  </div>
                </div>
                <ul style={{listStyle: 'none', padding: '0', marginBottom: '32px', textAlign: 'left'}}>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#eab308', marginRight: '12px', fontSize: '18px'}}>✓</span>
                    Không giới hạn km
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#eab308', marginRight: '12px', fontSize: '18px'}}>✓</span>
                    Tính năng cao cấp
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#eab308', marginRight: '12px', fontSize: '18px'}}>✓</span>
                    Đặt trước trạm đổi
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#eab308', marginRight: '12px', fontSize: '18px'}}>✓</span>
                    Hỗ trợ VIP 24/7
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#eab308', marginRight: '12px', fontSize: '18px'}}>✓</span>
                    Xe thay thế khẩn cấp
                  </li>
                  <li style={{padding: '8px 0', color: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center'}}>
                    <span style={{color: '#eab308', marginRight: '12px', fontSize: '18px'}}>✓</span>
                    Không phí vượt km
                  </li>
                </ul>
                <button 
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #eab308, #ca8a04)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => {
                    setShowLoginModal(true);
                    showToast('Vui lòng đăng nhập để chọn gói!', 'info');
                  }}
                >
                  Chọn gói Premium
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section style={{padding: '80px 0', background: '#0f172a'}}>
          <div className="container">
            <div style={{textAlign: 'center', marginBottom: '60px'}}>
              <h2 style={{fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', color: 'white'}}>
                Mạng lưới trạm đổi pin toàn quốc
              </h2>
              <p style={{fontSize: '20px', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto'}}>
                Hơn 500 trạm đổi pin trên toàn quốc, sẵn sàng phục vụ 24/7
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '16px',
              padding: '40px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{
                height: '500px',
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed rgba(255,255,255,0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{textAlign: 'center', zIndex: 2}}>
                  <div style={{fontSize: '64px', marginBottom: '20px'}}>🗺️</div>
                  <h3 style={{color: 'white', marginBottom: '16px'}}>Bản đồ tương tác</h3>
                  <p style={{color: 'rgba(255,255,255,0.6)', marginBottom: '24px'}}>
                    Tìm trạm đổi pin gần nhất với công nghệ GPS chính xác
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setShowLoginModal(true);
                      showToast('Đăng nhập để xem bản đồ chi tiết!', 'info');
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Xem bản đồ đầy đủ
                  </button>
                </div>
                
                {/* Animated background elements */}
                <div style={{
                  position: 'absolute',
                  top: '20%',
                  left: '15%',
                  width: '12px',
                  height: '12px',
                  background: '#10b981',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '60%',
                  left: '70%',
                  width: '12px',
                  height: '12px',
                  background: '#3b82f6',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite 0.5s'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '40%',
                  right: '20%',
                  width: '12px',
                  height: '12px',
                  background: '#a855f7',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite 1s'
                }}></div>
              </div>
              
              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px',
                marginTop: '40px'
              }}>
                <div style={{textAlign: 'center', padding: '20px'}}>
                  <div style={{fontSize: '36px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px'}}>
                    500+
                  </div>
                  <div style={{color: 'rgba(255,255,255,0.8)', fontSize: '16px'}}>
                    Trạm đổi pin
                  </div>
                </div>
                <div style={{textAlign: 'center', padding: '20px'}}>
                  <div style={{fontSize: '36px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px'}}>
                    24/7
                  </div>
                  <div style={{color: 'rgba(255,255,255,0.8)', fontSize: '16px'}}>
                    Hoạt động liên tục
                  </div>
                </div>
                <div style={{textAlign: 'center', padding: '20px'}}>
                  <div style={{fontSize: '36px', fontWeight: 'bold', color: '#a855f7', marginBottom: '8px'}}>
                    63
                  </div>
                  <div style={{color: 'rgba(255,255,255,0.8)', fontSize: '16px'}}>
                    Tỉnh thành
                  </div>
                </div>
                <div style={{textAlign: 'center', padding: '20px'}}>
                  <div style={{fontSize: '36px', fontWeight: 'bold', color: '#eab308', marginBottom: '8px'}}>
                    {'<'}3min
                  </div>
                  <div style={{color: 'rgba(255,255,255,0.8)', fontSize: '16px'}}>
                    Thời gian đổi pin
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );

  const LoginModal = () => (
    <div className="modal" style={{ display: showLoginModal ? 'block' : 'none' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Đăng nhập</h3>
          <button className="close-btn" onClick={() => setShowLoginModal(false)}>×</button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          handleLogin(formData.get('email'), formData.get('password'));
        }}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" required />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input type="password" name="password" required />
          </div>
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setShowLoginModal(false)}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Đăng nhập
            </button>
          </div>
        </form>
        <div className="demo-accounts">
          <h4>Tài khoản demo:</h4>
          <div className="demo-grid">
            {Object.entries(demoAccounts).map(([role, accounts]) => 
              accounts.map((account, index) => (
                <div
                  key={`${role}-${index}`}
                  className="demo-btn"
                  onClick={() => handleLogin(account.email, account.password)}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)} {index + 1}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const RegisterModal = () => (
    <div className="modal" style={{ display: showRegisterModal ? 'block' : 'none' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Đăng ký tài khoản</h3>
          <button className="close-btn" onClick={() => setShowRegisterModal(false)}>×</button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          showToast('Đăng ký thành công! Vui lòng đăng nhập.');
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}>
          <div className="form-row">
            <div className="form-group">
              <label>Họ và tên</label>
              <input type="text" required />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="tel" required />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Mật khẩu</label>
              <input type="password" required />
            </div>
            <div className="form-group">
              <label>Xác nhận mật khẩu</label>
              <input type="password" required />
            </div>
          </div>
          <div className="form-group">
            <label>Loại tài khoản</label>
            <select required>
              <option value="driver">Người dùng (Driver)</option>
              <option value="staff">Nhân viên (Staff)</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setShowRegisterModal(false)}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const Dashboard = () => {
    const unreadCount = notifications.filter(n => n.unread).length;

    const DashboardHeader = () => (
      <header className="dashboard-header">
        <div className="container">
          <div className="dashboard-nav">
            <div className="brand">
              <div className="logo">
                <svg viewBox="0 0 24 24">
                  <path d="M13 3l3.5 6L12 11.5 8.5 9 13 3zm4.5 9L16 14.5 12 17l-4-2.5 1.5-2.5 4.5 2.5L17.5 12zM12 19l-7.5-12L3 5l9 14 9-14-1.5 2L12 19z"/>
                </svg>
              </div>
              SWP201 - {currentUser.role === 'driver' ? 'Người dùng' : currentUser.role === 'staff' ? 'Nhân viên' : 'Quản trị'}
            </div>
            <div className="user-info">
              <div className="user-avatar">{currentUser.name[0]}</div>
              <span>{currentUser.name}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>
    );

    if (currentUser.role === 'driver') {
      return (
        <div className="dashboard active">
          <DashboardHeader />
          <div className="user-nav">
            <div className="container">
              <div className="nav-tabs">
                <button 
                  className={`nav-tab ${dashboardTab === 'home' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('home')}
                >
                  🏠 Trang chủ
                </button>
                <button 
                  className={`nav-tab ${dashboardTab === 'vehicle' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('vehicle')}
                >
                  � Xe & Pin của tôi
                </button>
                <button 
                  className={`nav-tab ${dashboardTab === 'subscription' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('subscription')}
                >
                  📋 Gói dịch vụ
                </button>
                <button 
                  className={`nav-tab ${dashboardTab === 'swap' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('swap')}
                >
                  ⚡ Đổi pin
                </button>
                <button 
                  className={`nav-tab ${dashboardTab === 'payment' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('payment')}
                >
                  💳 Thanh toán
                </button>
                <button 
                  className={`nav-tab ${dashboardTab === 'support' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('support')}
                >
                  💬 Hỗ trợ
                </button>
                <button 
                  className={`nav-tab ${dashboardTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('settings')}
                >
                  ⚙️ Cài đặt
                </button>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="dashboard-content">
              
              {/* Home Tab */}
              <div className={`tab-content ${dashboardTab === 'home' ? 'active' : ''}`}>
                {/* Vehicle Info Header */}
                {selectedVehicle && (
                  <div className="card" style={{
                    background: `linear-gradient(135deg, ${selectedPlan?.color || '#6ab7ff'}20, rgba(255,255,255,0.05))`,
                    border: `2px solid ${selectedPlan?.color || '#6ab7ff'}40`,
                    marginBottom: '24px'
                  }}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <div style={{
                          fontSize: '40px',
                          marginRight: '16px',
                          padding: '16px',
                          borderRadius: '12px',
                          background: `${selectedPlan?.color || '#6ab7ff'}20`
                        }}>�</div>
                        <div>
                          <h3 style={{margin: '0 0 4px 0', color: selectedPlan?.color || '#6ab7ff'}}>
                            {selectedVehicle.vehicleName}
                          </h3>
                          <p style={{margin: '0 0 4px 0', fontSize: '16px', opacity: 0.8}}>
                            {selectedVehicle.vehicleType}
                          </p>
                          <span style={{
                            fontSize: '14px',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            background: `${selectedPlan?.color || '#6ab7ff'}30`,
                            color: selectedPlan?.color || '#6ab7ff'
                          }}>
                            Gói {selectedPlan?.name || 'Premium'}
                          </span>
                        </div>
                      </div>
                      <button 
                        className="btn"
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          fontSize: '14px',
                          padding: '8px 16px'
                        }}
                        onClick={() => setShowVehiclePlanSelection(true)}>
                        Đổi xe máy 🔄
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="stats-grid">
                  <div className="card">
                    <h4>🔋 Mức pin hiện tại</h4>
                    <div className="price">{batteryData.current}%</div>
                    <p className="muted">Còn khoảng {Math.floor(batteryData.current * 2.5)}km</p>
                  </div>
                  <div className="card">
                    <h4>📍 Trạm gần nhất</h4>
                    <div className="price">0.5km</div>
                    <p className="muted">Station 1 - 5 pin</p>
                  </div>

                  <div className="card">
                    <h4>🛣️ Quãng đường tháng này</h4>
                    <div className="price">{subscriptionData.distanceUsed} km</div>
                    <p className="muted">Gói {subscriptionData.plan}</p>
                  </div>
                </div>
                
                <div className="grid" style={{gridTemplateColumns: '2fr 1fr', gap: '24px'}}>
                  <div className="card">
                    <h3>🗺️ Bản đồ trạm đổi pin</h3>
                    <StationMap />
                    <div className="grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px'}}>
                      {nearbyStations.map(station => (
                        <div key={station.id} className="card" style={{padding: '12px'}}>
                          <h4>{station.name}</h4>
                          <p className="muted">{station.distance}</p>
                          <p className="muted">{station.available}/{station.total} pin</p>
                          <span className={`chip ${station.status === 'Hoạt động' ? 'success' : 'warning'}`}>{station.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="card">
                    <h3>🔔 Thông báo mới</h3>
                    {notifications.slice(0, 3).map(notif => (
                      <div key={notif.id} className="card" style={{padding: '12px', margin: '8px 0'}}>
                        <h4>{notif.title}</h4>
                        <p className="muted" style={{fontSize: '13px'}}>{notif.message}</p>
                        <p className="muted" style={{fontSize: '12px'}}>{notif.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vehicle & Battery Tab */}
              <div className={`tab-content ${dashboardTab === 'vehicle' ? 'active' : ''}`}>
                <h2>� Xe máy & Pin của tôi</h2>
                
                {/* Current Vehicle Header */}
                {selectedVehicle && (
                  <div className="card" style={{
                    background: `linear-gradient(135deg, ${selectedPlan?.color || '#6ab7ff'}20, rgba(255,255,255,0.05))`,
                    border: `2px solid ${selectedPlan?.color || '#6ab7ff'}40`,
                    marginBottom: '24px'
                  }}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <div style={{
                          fontSize: '48px',
                          marginRight: '20px',
                          padding: '16px',
                          borderRadius: '12px',
                          background: `${selectedPlan?.color || '#6ab7ff'}20`
                        }}>�</div>
                        <div>
                          <h3 style={{margin: '0 0 8px 0', color: selectedPlan?.color || '#6ab7ff', fontSize: '24px'}}>
                            {selectedVehicle.vehicleName}
                          </h3>
                          <p style={{margin: '0 0 8px 0', fontSize: '18px', opacity: 0.9}}>
                            {selectedVehicle.vehicleType}
                          </p>
                          <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                            <span style={{
                              fontSize: '14px',
                              padding: '6px 12px',
                              borderRadius: '12px',
                              background: `${selectedPlan?.color || '#6ab7ff'}30`,
                              color: selectedPlan?.color || '#6ab7ff'
                            }}>
                              Gói {selectedPlan?.name || 'Premium'}
                            </span>
                            <span style={{
                              fontSize: '14px',
                              padding: '6px 12px',
                              borderRadius: '12px',
                              background: 'rgba(255,255,255,0.1)',
                              color: '#fff'
                            }}>
                              {selectedVehicle.batteryCapacity}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div style={{textAlign: 'right'}}>
                        <div style={{fontSize: '32px', color: selectedPlan?.color || '#6ab7ff', marginBottom: '8px'}}>
                          {batteryData.current}%
                        </div>
                        <p style={{margin: 0, fontSize: '14px', opacity: 0.8}}>
                          Pin hiện tại
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Vehicle Information */}
                <div className="card" style={{marginBottom: '24px'}}>
                  <h3>🛵 Thông tin xe máy chi tiết</h3>
                  <div className="grid" style={{gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px'}}>
                    <div>
                      <h4>Thông tin cơ bản</h4>
                      <p><strong>Mẫu xe:</strong> {vehicleData.model}</p>
                      <p><strong>Biển số:</strong> {vehicleData.licensePlate}</p>
                      <p><strong>Năm sản xuất:</strong> {vehicleData.year}</p>
                      <p><strong>Dung lượng pin:</strong> {vehicleData.batteryCapacity}</p>
                    </div>
                    <div>
                      <h4>Đăng ký & Bảo hành</h4>
                      <p><strong>Ngày đăng ký:</strong> {vehicleData.registrationDate}</p>
                      <p><strong>Trạng thái:</strong> <span className="chip success">Hoạt động</span></p>
                      <p><strong>Bảo hiểm:</strong> Còn hiệu lực</p>
                      <p><strong>Kiểm định:</strong> 15/03/2025</p>
                    </div>
                  </div>
                </div>

                {/* Battery Information */}
                <div className="card">
                  <h3>🔋 Thông tin pin hiện tại</h3>
                  <div className="grid" style={{gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '20px'}}>
                    <div className="card" style={{padding: '16px', textAlign: 'center'}}>
                      <h4>Mức pin</h4>
                      <div className="price" style={{color: batteryData.current > 50 ? '#19c37d' : batteryData.current > 20 ? '#ffa500' : '#ff4757'}}>{batteryData.current}%</div>
                      <div className="charge-bar" style={{width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginTop: '8px'}}>
                        <div className="charge-fill" style={{
                          width: `${batteryData.current}%`, 
                          height: '100%', 
                          background: batteryData.current > 50 ? '#19c37d' : batteryData.current > 20 ? '#ffa500' : '#ff4757',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </div>
                    <div className="card" style={{padding: '16px', textAlign: 'center'}}>
                      <h4>Sức khỏe pin</h4>
                      <div className="price" style={{color: '#19c37d'}}>{batteryData.health}%</div>
                      <p className="muted" style={{fontSize: '14px', marginTop: '8px'}}>Tình trạng: Tốt</p>
                    </div>
                  </div>
                  
                  <div className="grid" style={{gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px'}}>
                    <div style={{textAlign: 'center'}}>
                      <h5>Nhiệt độ</h5>
                      <div className="stat-value" style={{fontSize: '24px', color: '#19c37d'}}>{batteryData.temperature}°C</div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                      <h5>Điện áp</h5>
                      <div className="stat-value" style={{fontSize: '24px', color: '#19c37d'}}>{batteryData.voltage}V</div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                      <h5>Chu kỳ sạc</h5>
                      <div className="stat-value" style={{fontSize: '24px', color: '#6ab7ff'}}>{batteryData.cycles}</div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                      <h5>Quãng đường</h5>
                      <div className="stat-value" style={{fontSize: '24px', color: '#6ab7ff'}}>12,450km</div>
                    </div>
                  </div>

                  <div className="card" style={{backgroundColor: 'rgba(255,255,255,0.02)', marginTop: '16px'}}>
                    <h4>📊 Lịch sử sử dụng</h4>
                    <div className="grid" style={{gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px'}}>
                      <div>
                        <p><strong>Thời gian sử dụng:</strong> 8 tháng 15 ngày</p>
                        <p><strong>Lần đổi pin cuối:</strong> 2 ngày trước</p>
                        <p><strong>Tổng lần đổi pin:</strong> 47 lần</p>
                      </div>
                      <div>
                        <p><strong>Quãng đường trung bình:</strong> 45km/ngày</p>
                        <p><strong>Hiệu suất pin:</strong> 95%</p>
                        <p><strong>Tiết kiệm CO₂:</strong> 1,245kg</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription Tab */}
              <div className={`tab-content ${dashboardTab === 'subscription' ? 'active' : ''}`}>
                <h2>📋 Gói dịch vụ của tôi</h2>
                
                {/* Current Vehicle & Plan Header */}
                {selectedVehicle && selectedPlan && (
                  <div className="card" style={{
                    background: `linear-gradient(135deg, ${selectedPlan.color}20, rgba(255,255,255,0.05))`,
                    border: `2px solid ${selectedPlan.color}40`,
                    marginBottom: '24px'
                  }}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <div style={{
                          fontSize: '40px',
                          marginRight: '16px',
                          padding: '16px',
                          borderRadius: '12px',
                          background: `${selectedPlan.color}20`
                        }}>�</div>
                        <div>
                          <h3 style={{margin: '0 0 8px 0', color: selectedPlan.color}}>
                            {selectedVehicle.vehicleName}
                          </h3>
                          <p style={{margin: '0 0 4px 0', fontSize: '16px', opacity: 0.8}}>
                            {selectedVehicle.vehicleType}
                          </p>
                        </div>
                      </div>
                      <div style={{textAlign: 'right'}}>
                        <span style={{
                          fontSize: '20px',
                          padding: '8px 16px',
                          borderRadius: '12px',
                          background: `${selectedPlan.color}30`,
                          color: selectedPlan.color,
                          fontWeight: 'bold'
                        }}>
                          Gói {selectedPlan.name}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="card featured">
                  <h3>Gói {subscriptionData.plan} <span className="chip success">{subscriptionData.status}</span></h3>
                  <div className="grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px'}}>
                    <div>
                      <h4>Quãng đường đã đi</h4>
                      <div className="price">{subscriptionData.distanceUsed} km</div>
                      <p className="muted">Giới hạn: {subscriptionData.distanceLimit}</p>
                    </div>
                    <div>
                      <h4>Trả phí đến ngày</h4>
                      <div className="price">{subscriptionData.paidThroughDate}</div>
                      <p className="muted">Paid Through Date</p>
                    </div>
                    <div>
                      <h4>Phí hàng tháng</h4>
                      <div className="price">{subscriptionData.monthlyFee.toLocaleString()}₫</div>
                      <p className="muted">Thanh toán tự động</p>
                    </div>
                  </div>
                  <div style={{marginTop: '20px'}}>
                    <button className="btn btn-primary" onClick={() => showToast('Gia hạn gói thành công!')}>Gia hạn gói</button>
                    <button className="btn" style={{marginLeft: '12px'}} onClick={() => showToast('Đã chuyển sang gói Plus!')}>Thay đổi gói</button>
                  </div>
                </div>

                {/* Available Plans */}
                <div className="card" style={{marginTop: '24px'}}>
                  <h3>Các gói dịch vụ khác</h3>
                  <div className="pricing">
                    <div className="card">
                      <h3>Eco</h3>
                      <div className="price">135,000₫<span className="muted">/tháng</span></div>
                      <div className="muted" style={{marginBottom: '16px'}}>Quãng đường cơ sở: 200 km</div>
                      <ul className="clean">
                        <li><span className="tick">✓</span> 200 km/tháng</li>
                        <li><span className="tick">✓</span> Ứng dụng cơ bản</li>
                        <li><span className="tick">✓</span> Hỗ trợ 24/7</li>
                        <li><span className="tick">✓</span> Theo dõi pin cơ bản</li>
                        <li><span style={{color: '#ff6b6b'}}>⚠</span> Nếu ≤ 200 km thì chỉ trả 135,000₫</li>
                      </ul>
                      <button className="btn btn-primary" onClick={() => showToast('Đã chuyển sang gói Eco!')}>Chọn gói</button>
                    </div>
                    
                    <div className="card">
                      <h3>Cơ bản</h3>
                      <div className="price">270,000₫<span className="muted">/tháng</span></div>
                      <div className="muted" style={{marginBottom: '16px'}}>Quãng đường cơ sở: 400 km</div>
                      <ul className="clean">
                        <li><span className="tick">✓</span> 400 km/tháng</li>
                        <li><span className="tick">✓</span> Ứng dụng đầy đủ</li>
                        <li><span className="tick">✓</span> Ưu tiên đổi pin</li>
                        <li><span className="tick">✓</span> Hỗ trợ ưu tiên</li>
                        <li><span className="tick">✓</span> Thông báo real-time</li>
                        <li><span style={{color: '#ff6b6b'}}>⚠</span> Nếu ≤ 400 km thì chỉ trả 270,000₫</li>
                      </ul>
                      <button className="btn btn-primary" onClick={() => showToast('Đã chuyển sang gói Cơ bản!')}>Chọn gói</button>
                    </div>
                    
                    <div className="card">
                      <h3>Plus <span className="chip">Phổ biến</span></h3>
                      <div className="price">400,000₫<span className="muted">/tháng</span></div>
                      <div className="muted" style={{marginBottom: '16px'}}>Quãng đường cơ sở: 600 km</div>
                      <ul className="clean">
                        <li><span className="tick">✓</span> 600 km/tháng</li>
                        <li><span className="tick">✓</span> Ứng dụng đầy đủ</li>
                        <li><span className="tick">✓</span> Ưu tiên đổi pin</li>
                        <li><span className="tick">✓</span> Hỗ trợ ưu tiên</li>
                        <li><span className="tick">✓</span> Thông báo real-time</li>
                        <li><span className="tick">✓</span> Đặt trước trạm</li>
                        <li><span style={{color: '#ff6b6b'}}>⚠</span> Nếu ≤ 600 km thì chỉ trả 400,000₫</li>
                      </ul>
                      <button className="btn btn-primary" onClick={() => showToast('Đã chuyển sang gói Plus!')}>Chọn gói</button>
                    </div>
                    
                    <div className="card featured">
                      <h3>Premium <span className="chip success">Hiện tại</span></h3>
                      <div className="price">3,000,000₫<span className="muted">/tháng</span></div>
                      <div className="muted" style={{marginBottom: '16px'}}>Quãng đường: Không giới hạn</div>
                      <ul className="clean">
                        <li><span className="tick">✓</span> Không giới hạn km</li>
                        <li><span className="tick">✓</span> Tính năng cao cấp</li>
                        <li><span className="tick">✓</span> Đặt trước trạm đổi</li>
                        <li><span className="tick">✓</span> Hỗ trợ VIP 24/7</li>
                        <li><span className="tick">✓</span> Phân tích chi tiết</li>
                        <li><span className="tick">✓</span> Xe thay thế khẩn cấp</li>
                        <li><span className="tick">✓</span> Bảo hiểm pin</li>
                        <li><span className="tick">✓</span> Không áp dụng phí vượt km</li>
                      </ul>
                      <button className="btn btn-success" disabled>Đang sử dụng</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Swap Tab */}
              <div className={`tab-content ${dashboardTab === 'swap' ? 'active' : ''}`}>
                <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '16px', padding: '32px', marginBottom: '24px', textAlign: 'center'}}>
                  <h2 style={{margin: '0 0 16px 0', fontSize: '32px'}}>⚡ Đổi pin thông minh</h2>
                  <p style={{fontSize: '18px', opacity: 0.9, margin: 0}}>Đổi pin nhanh chóng trong 4 bước đơn giản</p>
                </div>

                {/* Progress Indicator */}
                <div className="card" style={{marginBottom: '24px', background: 'rgba(255,255,255,0.02)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    {[
                      {step: 1, title: 'Chọn trạm', icon: '🏢'},
                      {step: 2, title: 'Chọn trụ', icon: '🔌'},
                      {step: 3, title: 'Lấy pin mới', icon: '🔋'},
                      {step: 4, title: 'Trả pin cũ', icon: '🔄'}
                    ].map((item, index) => (
                      <div key={item.step} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: 1,
                        position: 'relative'
                      }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          background: swapStep >= item.step ? 'linear-gradient(135deg, #19c37d, #15a85a)' : 'rgba(255,255,255,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          marginBottom: '8px',
                          border: swapStep === item.step ? '3px solid #19c37d' : 'none',
                          transition: 'all 0.3s ease'
                        }}>
                          {swapStep > item.step ? '✅' : item.icon}
                        </div>
                        <p style={{
                          fontSize: '12px',
                          textAlign: 'center',
                          margin: 0,
                          color: swapStep >= item.step ? '#19c37d' : 'rgba(255,255,255,0.6)',
                          fontWeight: swapStep === item.step ? 'bold' : 'normal'
                        }}>{item.title}</p>
                        {index < 3 && (
                          <div style={{
                            position: 'absolute',
                            top: '25px',
                            right: '-50%',
                            width: '100%',
                            height: '2px',
                            background: swapStep > item.step ? '#19c37d' : 'rgba(255,255,255,0.2)',
                            transition: 'all 0.3s ease'
                          }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {swapStep === 1 && (
                  <div className="card" style={{background: 'linear-gradient(135deg, rgba(25,195,125,0.1), rgba(21,168,90,0.05))'}}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #19c37d, #15a85a)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        marginRight: '16px'
                      }}>🏢</div>
                      <div>
                        <h3 style={{margin: '0 0 4px 0'}}>Bước 1: Chọn trạm đổi pin</h3>
                        <p className="muted" style={{margin: 0}}>Chọn trạm gần nhất có pin đầy để thực hiện đổi pin</p>
                      </div>
                    </div>
                    
                    <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px'}}>
                      {nearbyStations.filter(s => s.status === 'Hoạt động').map(station => {
                        const distance = calculateDistance(userLocation.lat, userLocation.lng, station.lat, station.lng);
                        const isSelected = selectedStation === station.id;
                        return (
                          <div key={station.id} 
                               className="card" 
                               style={{
                                 cursor: 'pointer',
                                 border: isSelected ? '3px solid #19c37d' : '2px solid rgba(255,255,255,0.1)',
                                 background: isSelected ? 'linear-gradient(135deg, rgba(25,195,125,0.2), rgba(21,168,90,0.1))' : 'rgba(255,255,255,0.05)',
                                 transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                 transition: 'all 0.3s ease',
                                 position: 'relative',
                                 overflow: 'hidden'
                               }} 
                               onClick={() => {
                                 setSelectedStation(station.id);
                                 showToast('✅ Đã chọn ' + station.name);
                               }}>
                            {isSelected && (
                              <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: '#19c37d',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px'
                              }}>✓</div>
                            )}
                            
                            <div style={{display: 'flex', alignItems: 'center', marginBottom: '16px'}}>
                              <div style={{fontSize: '24px', marginRight: '12px'}}>🏢</div>
                              <h4 style={{margin: 0, color: isSelected ? '#19c37d' : 'inherit'}}>{station.name}</h4>
                            </div>
                            
                            <div className="grid" style={{gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
                              <div style={{textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px'}}>
                                <div style={{fontSize: '18px', color: '#6ab7ff', fontWeight: 'bold'}}>📍</div>
                                <div style={{fontSize: '14px', marginTop: '4px'}}>{distance}</div>
                                <div style={{fontSize: '12px', opacity: 0.7}}>Khoảng cách</div>
                              </div>
                              <div style={{textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px'}}>
                                <div style={{fontSize: '18px', color: '#ffa500', fontWeight: 'bold'}}>⏱️</div>
                                <div style={{fontSize: '14px', marginTop: '4px'}}>~{station.waitTime}p</div>
                                <div style={{fontSize: '12px', opacity: 0.7}}>Thời gian chờ</div>
                              </div>
                            </div>
                            
                            <div style={{marginBottom: '16px'}}>
                              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                                <span style={{fontSize: '14px', opacity: 0.8}}>Pin có sẵn</span>
                                <span style={{fontSize: '14px', fontWeight: 'bold', color: '#19c37d'}}>{station.available}/{station.total}</span>
                              </div>
                              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                                <span style={{fontSize: '14px', opacity: 0.8}}>Số trụ sạc</span>
                                <span style={{fontSize: '14px', fontWeight: 'bold', color: '#6ab7ff'}}>{station.poles.length} trụ</span>
                              </div>
                            </div>
                            
                            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '12px'}}>
                              <span style={{color: '#19c37d'}}>● {station.fullBatteries} đầy</span>
                              <span style={{color: '#ffa500'}}>● {station.chargingBatteries} sạc</span>
                              <span style={{color: '#ff4757'}}>● {station.emptyBatteries} trống</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {selectedStation && (
                      <div style={{marginTop: '24px', textAlign: 'center'}}>
                        <button className="btn btn-primary" 
                                style={{
                                  background: 'linear-gradient(135deg, #19c37d, #15a85a)',
                                  border: 'none',
                                  padding: '12px 32px',
                                  fontSize: '16px',
                                  fontWeight: 'bold'
                                }}
                                onClick={() => setSwapStep(2)}>
                          Tiếp tục với trạm đã chọn →
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {swapStep === 2 && (
                  <div className="card" style={{background: 'linear-gradient(135deg, rgba(106,183,255,0.1), rgba(52,152,219,0.05))'}}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6ab7ff, #3498db)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        marginRight: '16px'
                      }}>🔌</div>
                      <div>
                        <h3 style={{margin: '0 0 4px 0'}}>Bước 2: Chọn trụ sạc</h3>
                        <p className="muted" style={{margin: 0}}>Chọn trụ sạc có pin đầy để thực hiện đổi pin</p>
                      </div>
                    </div>
                    
                    <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px'}}>
                      {nearbyStations.find(s => s.id === selectedStation)?.poles.map((pole, index) => {
                        const isSelected = selectedPole === index;
                        const poleNumber = index + 1;
                        // Mock data for poles
                        const poleData = {
                          fullSlots: Math.floor(Math.random() * 6) + 2,
                          totalSlots: 10,
                          chargingSlots: Math.floor(Math.random() * 3) + 1,
                          emptySlots: Math.floor(Math.random() * 2) + 1,
                          status: Math.random() > 0.1 ? 'Hoạt động' : 'Bảo trì'
                        };
                        const canSelect = poleData.status === 'Hoạt động' && poleData.fullSlots > 0;
                        
                        return (
                          <div key={index}
                               className="card"
                               style={{
                                 cursor: canSelect ? 'pointer' : 'not-allowed',
                                 border: isSelected ? '3px solid #6ab7ff' : canSelect ? '2px solid rgba(106,183,255,0.3)' : '2px solid rgba(255,255,255,0.1)',
                                 background: isSelected ? 'linear-gradient(135deg, rgba(106,183,255,0.2), rgba(52,152,219,0.1))' : 
                                           canSelect ? 'rgba(106,183,255,0.05)' : 'rgba(255,255,255,0.03)',
                                 opacity: canSelect ? 1 : 0.6,
                                 transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                 transition: 'all 0.3s ease',
                                 position: 'relative'
                               }}
                               onClick={() => {
                                 if (canSelect) {
                                   setSelectedPole(index);
                                   showToast(`✅ Đã chọn Trụ ${poleNumber}`);
                                 }
                               }}>
                            
                            {isSelected && (
                              <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: '#6ab7ff',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px'
                              }}>✓</div>
                            )}

                            <div style={{display: 'flex', alignItems: 'center', marginBottom: '16px'}}>
                              <div style={{
                                fontSize: '24px', 
                                marginRight: '12px',
                                filter: poleData.status === 'Bảo trì' ? 'grayscale(1)' : 'none'
                              }}>🔌</div>
                              <div>
                                <h4 style={{margin: '0 0 4px 0', color: isSelected ? '#6ab7ff' : 'inherit'}}>
                                  Trụ {poleNumber}
                                </h4>
                                <span style={{
                                  fontSize: '12px',
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  background: poleData.status === 'Hoạt động' ? 'rgba(25,195,125,0.2)' : 'rgba(255,71,87,0.2)',
                                  color: poleData.status === 'Hoạt động' ? '#19c37d' : '#ff4757'
                                }}>
                                  {poleData.status}
                                </span>
                              </div>
                            </div>

                            <div className="grid" style={{gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px'}}>
                              <div style={{textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px'}}>
                                <div style={{fontSize: '18px', color: '#19c37d', fontWeight: 'bold'}}>{poleData.fullSlots}</div>
                                <div style={{fontSize: '12px', opacity: 0.7}}>Pin đầy</div>
                              </div>
                              <div style={{textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px'}}>
                                <div style={{fontSize: '18px', color: '#6ab7ff', fontWeight: 'bold'}}>{poleData.totalSlots}</div>
                                <div style={{fontSize: '12px', opacity: 0.7}}>Tổng slot</div>
                              </div>
                            </div>

                            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
                              <span style={{color: '#19c37d'}}>● {poleData.fullSlots} đầy</span>
                              <span style={{color: '#ffa500'}}>● {poleData.chargingSlots} sạc</span>
                              <span style={{color: '#ff4757'}}>● {poleData.emptySlots} trống</span>
                            </div>

                            {!canSelect && (
                              <div style={{
                                marginTop: '12px',
                                textAlign: 'center',
                                fontSize: '12px',
                                color: '#ff4757',
                                fontStyle: 'italic'
                              }}>
                                {poleData.status === 'Bảo trì' ? 'Trụ đang bảo trì' : 'Không có pin đầy'}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div style={{marginTop: '24px', display: 'flex', justifyContent: 'space-between'}}>
                      <button className="btn" 
                              style={{background: 'rgba(255,255,255,0.1)'}}
                              onClick={() => {
                                setSwapStep(1);
                                setSelectedPole(null);
                              }}>
                        ← Quay lại chọn trạm
                      </button>
                      
                      {selectedPole !== null ? (
                        <button className="btn btn-primary"
                                style={{
                                  background: 'linear-gradient(135deg, #6ab7ff, #3498db)',
                                  border: 'none',
                                  padding: '12px 32px',
                                  fontSize: '16px',
                                  fontWeight: 'bold'
                                }}
                                onClick={() => setSwapStep(3)}>
                          Chọn slot pin →
                        </button>
                      ) : (
                        <button className="btn" disabled>
                          Vui lòng chọn trụ sạc
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {swapStep === 3 && (
                  <div className="card" style={{background: 'linear-gradient(135deg, rgba(25,195,125,0.1), rgba(21,168,90,0.05))'}}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #19c37d, #15a85a)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        marginRight: '16px'
                      }}>🔋</div>
                      <div>
                        <h3 style={{margin: '0 0 4px 0'}}>Bước 3: Chọn pin mới để lấy</h3>
                        <p className="muted" style={{margin: 0}}>Chọn slot có pin đầy để thay thế pin hiện tại của bạn ({batteryData.current}%)</p>
                      </div>
                    </div>
                    <div style={{background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', marginBottom: '20px'}}>
                      <h4 style={{margin: '0 0 12px 0', color: '#6ab7ff'}}>
                        🔌 Trụ {selectedPole + 1} - {nearbyStations.find(s => s.id === selectedStation)?.name}
                      </h4>
                      <p style={{margin: 0, fontSize: '14px', opacity: 0.8}}>
                        Chọn slot pin đầy 100% để thay thế pin hiện tại của bạn
                      </p>
                    </div>
                    
                    <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px'}}>
                      {Array.from({length: 10}, (_, i) => {
                        const batteryStatus = i < 4 ? 'full' : i < 7 ? 'charging' : 'empty';
                        const batteryLevel = batteryStatus === 'full' ? 100 : batteryStatus === 'charging' ? Math.floor(Math.random() * 80) + 20 : 0;
                        const canSelect = batteryStatus === 'full';
                        const isSelected = selectedPickupSlot === i;
                        
                        return (
                          <div key={i} 
                               className="card" 
                               style={{
                                 cursor: canSelect ? 'pointer' : 'not-allowed',
                                 opacity: canSelect ? 1 : 0.4,
                                 border: isSelected ? '3px solid #19c37d' : canSelect ? '2px solid rgba(25,195,125,0.3)' : '2px solid rgba(255,255,255,0.1)',
                                 textAlign: 'center',
                                 padding: '16px 8px',
                                 background: isSelected ? 'linear-gradient(135deg, rgba(25,195,125,0.2), rgba(21,168,90,0.1))' : 
                                           canSelect ? 'rgba(25,195,125,0.05)' : 'rgba(255,255,255,0.02)',
                                 transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                 transition: 'all 0.3s ease',
                                 position: 'relative',
                                 minHeight: '120px',
                                 display: 'flex',
                                 flexDirection: 'column',
                                 justifyContent: 'center'
                               }}
                               onClick={() => {
                                 if (canSelect) {
                                   setSelectedPickupSlot(i);
                                   showToast(`✅ Chọn lấy pin từ Slot ${i + 1} - ${batteryLevel}%`);
                                 }
                               }}>
                            
                            {isSelected && (
                              <div style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                background: '#19c37d',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px'
                              }}>✓</div>
                            )}

                            <div style={{fontSize: '28px', margin: '8px 0'}}>
                              {batteryStatus === 'full' && '🔋'}
                              {batteryStatus === 'charging' && '⚡'}
                              {batteryStatus === 'empty' && '🪫'}
                            </div>
                            
                            <p style={{
                              margin: '4px 0',
                              fontWeight: 'bold',
                              fontSize: '14px',
                              color: isSelected ? '#19c37d' : 'inherit'
                            }}>
                              Slot {i + 1}
                            </p>
                            
                            <p style={{
                              fontSize: '16px', 
                              fontWeight: 'bold',
                              margin: '4px 0',
                              color: batteryStatus === 'full' ? '#19c37d' : batteryStatus === 'charging' ? '#ffa500' : '#ff4757'
                            }}>
                              {batteryLevel}%
                            </p>
                            
                            <p style={{
                              fontSize: '10px',
                              margin: 0,
                              opacity: 0.8,
                              color: batteryStatus === 'full' ? '#19c37d' : batteryStatus === 'charging' ? '#ffa500' : '#ff4757'
                            }}>
                              {batteryStatus === 'full' && 'Đầy - Có thể lấy'}
                              {batteryStatus === 'charging' && 'Đang sạc'}
                              {batteryStatus === 'empty' && 'Trống'}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {selectedPickupSlot !== null && (
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(25,195,125,0.2), rgba(21,168,90,0.1))',
                        border: '2px solid #19c37d',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '24px',
                        textAlign: 'center'
                      }}>
                        <div style={{fontSize: '32px', marginBottom: '12px'}}>✅</div>
                        <h4 style={{margin: '0 0 8px 0', color: '#19c37d'}}>Pin mới đã chọn</h4>
                        <p style={{margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold'}}>
                          Slot {selectedPickupSlot + 1} - Pin đầy 100%
                        </p>
                        <p style={{margin: 0, fontSize: '14px', opacity: 0.8}}>
                          Pin này sẽ được lắp vào xe của bạn
                        </p>
                      </div>
                    )}

                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <button className="btn" 
                              style={{background: 'rgba(255,255,255,0.1)'}}
                              onClick={() => {
                                setSwapStep(2);
                                setSelectedPickupSlot(null);
                              }}>
                        ← Quay lại chọn trụ
                      </button>
                      
                      {selectedPickupSlot !== null ? (
                        <button className="btn btn-primary"
                                style={{
                                  background: 'linear-gradient(135deg, #19c37d, #15a85a)',
                                  border: 'none',
                                  padding: '12px 32px',
                                  fontSize: '16px',
                                  fontWeight: 'bold'
                                }}
                                onClick={() => setSwapStep(4)}>
                          Chọn slot trả pin cũ →
                        </button>
                      ) : (
                        <button className="btn" disabled>
                          Vui lòng chọn slot pin đầy
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {swapStep === 4 && (
                  <div className="card" style={{background: 'linear-gradient(135deg, rgba(255,71,87,0.1), rgba(231,76,60,0.05))'}}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ff4757, #e74c3c)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        marginRight: '16px'
                      }}>🔄</div>
                      <div>
                        <h3 style={{margin: '0 0 4px 0'}}>Bước 4: Chọn slot trả pin cũ</h3>
                        <p className="muted" style={{margin: 0}}>Chọn slot trống để đặt pin hiện tại ({batteryData.current}%) vào sạc</p>
                      </div>
                    </div>

                    <div style={{background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', marginBottom: '20px'}}>
                      <div className="grid" style={{gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                        <div style={{textAlign: 'center', padding: '12px', background: 'rgba(25,195,125,0.1)', borderRadius: '8px'}}>
                          <div style={{fontSize: '20px', marginBottom: '8px'}}>🔋</div>
                          <h5 style={{margin: '0 0 4px 0', color: '#19c37d'}}>Pin mới</h5>
                          <p style={{margin: 0, fontSize: '14px'}}>Slot {selectedPickupSlot + 1} - 100%</p>
                        </div>
                        <div style={{textAlign: 'center', padding: '12px', background: 'rgba(255,71,87,0.1)', borderRadius: '8px'}}>
                          <div style={{fontSize: '20px', marginBottom: '8px'}}>🪫</div>
                          <h5 style={{margin: '0 0 4px 0', color: '#ff4757'}}>Pin cũ</h5>
                          <p style={{margin: 0, fontSize: '14px'}}>Cần sạc - {batteryData.current}%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px'}}>
                      {Array.from({length: 10}, (_, i) => {
                        const batteryStatus = i < 4 ? 'full' : i < 7 ? 'charging' : 'empty';
                        const batteryLevel = batteryStatus === 'full' ? 100 : batteryStatus === 'charging' ? Math.floor(Math.random() * 80) + 20 : 0;
                        const canSelect = batteryStatus === 'empty';
                        const isPickupSlot = selectedPickupSlot === i;
                        const isSelected = selectedReturnSlot === i;
                        
                        return (
                          <div key={i} 
                               className="card" 
                               style={{
                                 cursor: canSelect && !isPickupSlot ? 'pointer' : 'not-allowed',
                                 opacity: isPickupSlot ? 0.3 : canSelect ? 1 : 0.4,
                                 border: isSelected ? '3px solid #ff4757' : 
                                        isPickupSlot ? '2px solid #19c37d' :
                                        canSelect ? '2px solid rgba(255,71,87,0.3)' : '2px solid rgba(255,255,255,0.1)',
                                 textAlign: 'center',
                                 padding: '16px 8px',
                                 background: isPickupSlot ? 'rgba(25, 195, 125, 0.2)' :
                                           isSelected ? 'linear-gradient(135deg, rgba(255,71,87,0.2), rgba(231,76,60,0.1))' :
                                           canSelect ? 'rgba(255,71,87,0.05)' : 'rgba(255,255,255,0.02)',
                                 transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                 transition: 'all 0.3s ease',
                                 position: 'relative',
                                 minHeight: '120px',
                                 display: 'flex',
                                 flexDirection: 'column',
                                 justifyContent: 'center'
                               }}
                               onClick={() => {
                                 if (canSelect && !isPickupSlot) {
                                   setSelectedReturnSlot(i);
                                   showToast(`✅ Chọn trả pin cũ vào Slot ${i + 1}`);
                                 }
                               }}>
                            
                            {isSelected && (
                              <div style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                background: '#ff4757',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px'
                              }}>✓</div>
                            )}

                            <div style={{fontSize: '28px', margin: '8px 0'}}>
                              {isPickupSlot ? '✅' : 
                               batteryStatus === 'full' ? '🔋' :
                               batteryStatus === 'charging' ? '⚡' : '🪫'}
                            </div>
                            
                            <p style={{
                              margin: '4px 0',
                              fontWeight: 'bold',
                              fontSize: '14px',
                              color: isPickupSlot ? '#19c37d' : isSelected ? '#ff4757' : 'inherit'
                            }}>
                              Slot {i + 1}
                            </p>
                            
                            <p style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              margin: '4px 0',
                              color: isPickupSlot ? '#19c37d' :
                                     batteryStatus === 'full' ? '#19c37d' : 
                                     batteryStatus === 'charging' ? '#ffa500' : '#ff4757'
                            }}>
                              {isPickupSlot ? 'Đã chọn' : `${batteryLevel}%`}
                            </p>
                            
                            <p style={{
                              fontSize: '10px',
                              margin: 0,
                              opacity: 0.8,
                              color: isPickupSlot ? '#19c37d' : 
                                     batteryStatus === 'full' ? '#19c37d' : 
                                     batteryStatus === 'charging' ? '#ffa500' : '#ff4757'
                            }}>
                              {isPickupSlot && 'Pin đã chọn lấy'}
                              {!isPickupSlot && batteryStatus === 'full' && 'Đầy - Không thể trả'}
                              {!isPickupSlot && batteryStatus === 'charging' && 'Đang sạc'}
                              {!isPickupSlot && batteryStatus === 'empty' && 'Trống - Có thể trả'}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {selectedReturnSlot !== null && (
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(255,71,87,0.2), rgba(231,76,60,0.1))',
                        border: '2px solid #ff4757',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '24px',
                        textAlign: 'center'
                      }}>
                        <div style={{fontSize: '32px', marginBottom: '12px'}}>✅</div>
                        <h4 style={{margin: '0 0 8px 0', color: '#ff4757'}}>Slot trả pin đã chọn</h4>
                        <p style={{margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold'}}>
                          Slot {selectedReturnSlot + 1} - Slot trống
                        </p>
                        <p style={{margin: 0, fontSize: '14px', opacity: 0.8}}>
                          Pin cũ ({batteryData.current}%) sẽ được đặt vào đây để sạc
                        </p>
                      </div>
                    )}

                    <div style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '2px solid rgba(106,183,255,0.3)',
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '24px'
                    }}>
                      <h4 style={{margin: '0 0 16px 0', textAlign: 'center', color: '#6ab7ff'}}>
                        🔄 Tóm tắt giao dịch đổi pin
                      </h4>
                      <div className="grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', textAlign: 'center'}}>
                        <div style={{padding: '16px', background: 'rgba(25,195,125,0.1)', borderRadius: '8px'}}>
                          <div style={{fontSize: '32px', marginBottom: '12px'}}>📤</div>
                          <h5 style={{margin: '0 0 8px 0', color: '#19c37d'}}>Lấy pin mới</h5>
                          <p style={{margin: '0 0 4px 0', fontWeight: 'bold'}}>Slot {selectedPickupSlot + 1}</p>
                          <p style={{margin: 0, fontSize: '14px', opacity: 0.8}}>Pin đầy 100%</p>
                        </div>
                        <div style={{padding: '16px', background: 'rgba(106,183,255,0.1)', borderRadius: '8px'}}>
                          <div style={{fontSize: '32px', marginBottom: '12px'}}>🔄</div>
                          <h5 style={{margin: '0 0 8px 0', color: '#6ab7ff'}}>Đổi pin tự động</h5>
                          <p style={{margin: '0 0 4px 0', fontWeight: 'bold'}}>~30 giây</p>
                          <p style={{margin: 0, fontSize: '14px', opacity: 0.8}}>Hệ thống xử lý</p>
                        </div>
                        <div style={{padding: '16px', background: 'rgba(255,71,87,0.1)', borderRadius: '8px'}}>
                          <div style={{fontSize: '32px', marginBottom: '12px'}}>📥</div>
                          <h5 style={{margin: '0 0 8px 0', color: '#ff4757'}}>Trả pin cũ</h5>
                          <p style={{margin: '0 0 4px 0', fontWeight: 'bold'}}>
                            Slot {selectedReturnSlot !== null ? selectedReturnSlot + 1 : '?'}
                          </p>
                          <p style={{margin: 0, fontSize: '14px', opacity: 0.8}}>
                            Pin {batteryData.current}% vào sạc
                          </p>
                        </div>
                      </div>
                    </div>

                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <button className="btn" 
                              style={{background: 'rgba(255,255,255,0.1)'}}
                              onClick={() => {
                                setSwapStep(3);
                                setSelectedReturnSlot(null);
                              }}>
                        ← Quay lại chọn pin
                      </button>
                      
                      {selectedReturnSlot !== null ? (
                        <button className="btn btn-primary"
                                style={{
                                  background: 'linear-gradient(135deg, #19c37d, #15a85a)',
                                  border: 'none',
                                  padding: '12px 32px',
                                  fontSize: '16px',
                                  fontWeight: 'bold'
                                }}
                                onClick={() => {
                                  // Complete battery swap
                                  showToast('🎉 Đổi pin thành công! Pin mới đã được lắp vào xe.');
                                  setBatteryData(prev => ({...prev, current: 100}));
                                  setSwapStep(1);
                                  setSelectedStation(null);
                                  setSelectedPole(null);
                                  setSelectedPickupSlot(null);
                                  setSelectedReturnSlot(null);
                                }}>
                          Xác nhận đổi pin ✨
                        </button>
                      ) : (
                        <button className="btn" disabled>
                          Vui lòng chọn slot trống
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {swapStep === 5 && (
                  <div className="card">
                    <h3>Bước 4: Xác nhận tại trạm</h3>
                    <div style={{textAlign: 'center', padding: '40px'}}>
                      <div style={{width: '200px', height: '200px', border: '2px dashed rgba(255,255,255,0.3)', borderRadius: '12px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px'}}>
                        📱
                      </div>
                      <h4>Quét mã QR tại trạm đổi pin</h4>
                      <p className="muted">Đưa điện thoại lại gần màn hình trạm để xác nhận giao dịch</p>
                      
                      <div className="card" style={{backgroundColor: 'rgba(255,255,255,0.05)', margin: '20px auto', maxWidth: '400px'}}>
                        <h5>🔄 Chi tiết giao dịch</h5>
                        <div style={{textAlign: 'left', fontSize: '14px'}}>
                          <p>🏪 <strong>Trạm:</strong> {nearbyStations.find(s => s.id === selectedStation)?.name}</p>
                          <p>📤 <strong>Lấy pin:</strong> Slot {selectedPickupSlot + 1} (100%)</p>
                          <p>� <strong>Trả pin:</strong> Slot {selectedReturnSlot + 1} ({batteryData.current}%)</p>
                          <p>💰 <strong>Chi phí:</strong> 15,000₫</p>
                          <p>⏱️ <strong>Thời gian:</strong> ~3 phút</p>
                        </div>
                      </div>

                      <button className="btn btn-primary" onClick={() => {
                        setBatteryData(prev => ({...prev, current: 100}));
                        setSwapStep(1);
                        setSelectedStation(null);
                        setSelectedPickupSlot(null);
                        setSelectedReturnSlot(null);
                        showToast('🎉 Đổi pin thành công! Pin mới: 100%. Pin cũ đã vào slot sạc.', 'success');
                      }}>
                        Mô phỏng đổi pin thành công
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Tab - Enhanced */}
              <div className={`tab-content ${dashboardTab === 'payment' ? 'active' : ''}`}>
                <h2>💳 Thanh toán</h2>
                
                {/* Payment Summary Frame */}
                <div className="card" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: '2px solid #19c37d',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                }}>
                  <div style={{textAlign: 'center', color: 'white'}}>
                    <h2 style={{margin: '0 0 16px 0', fontSize: '28px'}}>🏆 Gói Premium</h2>
                    <div style={{fontSize: '48px', fontWeight: 'bold', margin: '16px 0'}}>3,000,000₫</div>
                    <div style={{fontSize: '18px', marginBottom: '20px', opacity: 0.9}}>Số tiền cần thanh toán tháng này</div>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '16px',
                      background: 'rgba(255,255,255,0.15)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '20px'
                    }}>
                      <div>
                        <div style={{fontSize: '14px', opacity: 0.8}}>Quãng đường tháng này</div>
                        <div style={{fontSize: '24px', fontWeight: 'bold'}}>750 km</div>
                      </div>
                      <div>
                        <div style={{fontSize: '14px', opacity: 0.8}}>Phí vượt quãng đường</div>
                        <div style={{fontSize: '24px', fontWeight: 'bold', color: '#19c37d'}}>0₫</div>
                        <div style={{fontSize: '12px', opacity: 0.7}}>Gói Unlimited</div>
                      </div>
                    </div>

                    <button 
                      className="btn"
                      style={{
                        background: 'linear-gradient(135deg, #19c37d 0%, #0fb66f 100%)',
                        border: 'none',
                        padding: '16px 32px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        borderRadius: '12px',
                        color: 'white',
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(25, 195, 125, 0.4)',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => {
                        setShowPaymentModal(true);
                        setPaymentStep(1);
                      }}
                    >
                      💳 Thanh toán ngay
                    </button>
                  </div>
                </div>
                
                <div className="card">
                  <div className="nav-tabs" style={{borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px'}}>
                    <button 
                      className={`nav-tab ${paymentTab === 'monthly-invoice' ? 'active' : ''}`}
                      onClick={() => setPaymentTab('monthly-invoice')}
                    >
                      💳 Phương thức thanh toán
                    </button>
                    <button 
                      className={`nav-tab ${paymentTab === 'history' ? 'active' : ''}`}
                      onClick={() => setPaymentTab('history')}
                    >
                      📊 Lịch sử thanh toán
                    </button>
                  </div>

                  {paymentTab === 'monthly-invoice' && (
                    <div>
                      {/* Payment Methods */}
                      <div className="card" style={{marginBottom: '20px', padding: '20px'}}>
                        <h3 style={{margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px'}}>
                          💳 Phương thức thanh toán đã lưu
                        </h3>
                        
                        <div className="card" style={{marginBottom: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                            <span style={{fontSize: '24px'}}>📱</span>
                            <div>
                              <h4 style={{margin: '0'}}>Ví MoMo</h4>
                              <p className="muted" style={{margin: '0', fontSize: '13px'}}>**** **** **** 1234</p>
                            </div>
                            <span className="chip success">Mặc định</span>
                          </div>
                          <button className="btn" style={{padding: '8px 16px'}}>Chỉnh sửa</button>
                        </div>
                        
                        <div className="card" style={{marginBottom: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                            <span style={{fontSize: '24px'}}>💳</span>
                            <div>
                              <h4 style={{margin: '0'}}>Visa ****1234</h4>
                              <p className="muted" style={{margin: '0', fontSize: '13px'}}>Hết hạn 12/26</p>
                            </div>
                          </div>
                          <button className="btn" style={{padding: '8px 16px'}}>Chỉnh sửa</button>
                        </div>
                        
                        <div className="card" style={{marginBottom: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                            <span style={{fontSize: '24px'}}>🏦</span>
                            <div>
                              <h4 style={{margin: '0'}}>Vietcombank</h4>
                              <p className="muted" style={{margin: '0', fontSize: '13px'}}>**** **** **** 5678</p>
                            </div>
                          </div>
                          <button className="btn" style={{padding: '8px 16px'}}>Chỉnh sửa</button>
                        </div>
                        
                        <button 
                          className="btn btn-primary" 
                          style={{marginTop: '16px', width: '100%'}}
                          onClick={() => setShowPaymentModal(true)}
                        >
                          + Thêm phương thức mới
                        </button>
                      </div>

                      {/* Auto Payment Settings */}
                      <div className="card" style={{padding: '20px'}}>
                        <h3 style={{margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px'}}>
                          ⚡ Thanh toán tự động
                        </h3>
                        
                        <div style={{marginBottom: '20px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)'}}>
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                            <div>
                              <h4 style={{margin: '0', fontSize: '16px'}}>Tự động gia hạn gói dịch vụ</h4>
                              <p className="muted" style={{margin: '4px 0 0 0', fontSize: '13px'}}>Gia hạn tự động gói Premium hàng tháng</p>
                            </div>
                            <label style={{position: 'relative', display: 'inline-block', width: '50px', height: '24px'}}>
                              <input type="checkbox" defaultChecked style={{opacity: 0, width: 0, height: 0}} />
                              <span style={{
                                position: 'absolute', 
                                cursor: 'pointer', 
                                top: 0, 
                                left: 0, 
                                right: 0, 
                                bottom: 0, 
                                backgroundColor: '#19c37d', 
                                borderRadius: '24px', 
                                transition: '0.4s',
                                '&:before': {
                                  position: 'absolute',
                                  content: '""',
                                  height: '18px',
                                  width: '18px',
                                  right: '3px',
                                  bottom: '3px',
                                  backgroundColor: 'white',
                                  borderRadius: '50%',
                                  transition: '0.4s'
                                }
                              }}></span>
                            </label>
                          </div>
                          
                          <div className="form-group" style={{marginBottom: '16px'}}>
                            <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500'}}>Phương thức thanh toán mặc định</label>
                            <select style={{
                              width: '100%', 
                              padding: '12px', 
                              borderRadius: '8px', 
                              background: 'rgba(255,255,255,0.1)', 
                              border: '1px solid rgba(255,255,255,0.2)', 
                              color: 'white',
                              fontSize: '14px'
                            }}>
                              <option value="momo">📱 Ví MoMo (**** 1234)</option>
                              <option value="visa">💳 Visa (**** 1234)</option>
                              <option value="bank">🏦 Vietcombank (**** 5678)</option>
                            </select>
                          </div>
                          
                          <div className="form-group">
                            <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500'}}>Ngày gia hạn hàng tháng</label>
                            <select style={{
                              width: '100%', 
                              padding: '12px', 
                              borderRadius: '8px', 
                              background: 'rgba(255,255,255,0.1)', 
                              border: '1px solid rgba(255,255,255,0.2)', 
                              color: 'white',
                              fontSize: '14px'
                            }}>
                              <option value="15">Ngày 15 hàng tháng</option>
                              <option value="1">Ngày 1 hàng tháng</option>
                              <option value="30">Ngày cuối tháng</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentTab === 'history' && (
                    <div>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                        <h3 style={{margin: '0', display: 'flex', alignItems: 'center', gap: '8px'}}>
                          📊 History
                        </h3>
                        <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                          <button style={{
                            padding: '8px 16px',
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.3)',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '14px',
                            cursor: 'pointer'
                          }}>Filter</button>
                          <button style={{
                            padding: '8px 16px',
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.3)',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '14px',
                            cursor: 'pointer'
                          }}>Export</button>
                          <button style={{
                            padding: '8px 16px',
                            background: '#4A90E2',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '14px',
                            cursor: 'pointer'
                          }}>Create payment</button>
                        </div>
                      </div>
                      
                      {/* Payment History Table */}
                      <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        overflow: 'hidden',
                        marginBottom: '30px'
                      }}>
                        {/* Table Header */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '120px 150px 120px 100px',
                          gap: '20px',
                          padding: '20px 24px',
                          background: 'rgba(255,255,255,0.02)',
                          borderBottom: '1px solid rgba(255,255,255,0.1)',
                          fontSize: '13px',
                          fontWeight: '500',
                          color: 'rgba(255,255,255,0.7)',
                          textTransform: 'uppercase',
                          minHeight: '60px',
                          alignItems: 'center'
                        }}>
                          <div>AMOUNT</div>
                          <div>CONFIRMATION</div>
                          <div>PLAN</div>
                          <div>DATE</div>
                        </div>
                        
                        {/* Table Rows */}
                        {[
                          { amount: '3,000,000₫', confirmation: 'BRT-17264-2017', plan: 'Premium', date: 'Dec 20, 09:52 PM' },
                          { amount: '3,000,000₫', confirmation: 'BRT-17265-2017', plan: 'Premium', date: 'Nov 20, 09:47 PM' },
                          { amount: '3,000,000₫', confirmation: 'BRT-17266-2017', plan: 'Premium', date: 'Oct 20, 11:16 PM' },
                          { amount: '3,000,000₫', confirmation: 'BRT-17267-2017', plan: 'Premium', date: 'Sep 27, 09:42 PM' },
                          { amount: '3,000,000₫', confirmation: 'BRT-17268-2017', plan: 'Premium', date: 'Aug 28, 07:52 AM' }
                        ].map((payment, index) => (
                          <div key={index} style={{
                            display: 'grid',
                            gridTemplateColumns: '120px 150px 120px 100px',
                            gap: '20px',
                            padding: '20px 24px',
                            borderBottom: index < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                            alignItems: 'center',
                            transition: 'background 0.2s',
                            fontSize: '14px',
                            minHeight: '60px'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#4CAF50'
                              }}></div>
                              <span style={{fontWeight: '500'}}>{payment.amount}</span>
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              color: 'rgba(255,255,255,0.8)'
                            }}>
                              <div style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                backgroundColor: '#4CAF50',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px'
                              }}>✓</div>
                              <span>{payment.confirmation}</span>
                            </div>
                            <div style={{
                              color: 'rgba(255,255,255,0.9)',
                              fontWeight: '400'
                            }}>
                              {payment.plan}
                            </div>
                            <div style={{
                              color: 'rgba(255,255,255,0.7)',
                              fontSize: '13px'
                            }}>
                              {payment.date}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {paymentTab === 'methods' && (
                    <div>
                      <h4>Phương thức thanh toán đã lưu</h4>
                      <div className="card" style={{marginBottom: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                          <span style={{fontSize: '24px'}}>📱</span>
                          <div>
                            <h4 style={{margin: '0'}}>Ví MoMo</h4>
                            <p className="muted" style={{margin: '0', fontSize: '13px'}}>**** **** **** 1234</p>
                          </div>
                          <span className="chip">Mặc định</span>
                        </div>
                        <button className="btn">Chỉnh sửa</button>
                      </div>
                      
                      <div className="card" style={{marginBottom: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                          <span style={{fontSize: '24px'}}>🏦</span>
                          <div>
                            <h4 style={{margin: '0'}}>Vietcombank</h4>
                            <p className="muted" style={{margin: '0', fontSize: '13px'}}>**** **** **** 5678</p>
                          </div>
                        </div>
                        <button className="btn">Chỉnh sửa</button>
                      </div>
                      
                      <button className="btn btn-primary">+ Thêm phương thức mới</button>
                    </div>
                  )}

                  {paymentTab === 'autopay' && (
                    <div>
                      <h4>Thanh toán tự động</h4>
                      <div className="card" style={{padding: '16px'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                          <div>
                            <h4 style={{margin: '0'}}>Tự động nạp tiền</h4>
                            <p className="muted" style={{margin: '0', fontSize: '13px'}}>Nạp tiền khi số dư dưới 50,000₫</p>
                          </div>
                          <label style={{position: 'relative', display: 'inline-block', width: '50px', height: '24px'}}>
                            <input type="checkbox" style={{opacity: 0, width: 0, height: 0}} />
                            <span style={{position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#ccc', borderRadius: '24px', transition: '0.4s'}}></span>
                          </label>
                        </div>
                        
                        <div className="form-group">
                          <label>Số tiền nạp tự động</label>
                          <select>
                            <option>100,000₫</option>
                            <option>200,000₫</option>
                            <option>500,000₫</option>
                          </select>
                        </div>
                        
                        <div className="form-group">
                          <label>Phương thức thanh toán</label>
                          <select>
                            <option>Ví MoMo (**** 1234)</option>
                            <option>Vietcombank (**** 5678)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="card" style={{padding: '16px', marginTop: '16px'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                          <div>
                            <h4 style={{margin: '0'}}>Thanh toán gói dịch vụ tự động</h4>
                            <p className="muted" style={{margin: '0', fontSize: '13px'}}>Gia hạn tự động gói Premium hàng tháng</p>
                          </div>
                          <label style={{position: 'relative', display: 'inline-block', width: '50px', height: '24px'}}>
                            <input type="checkbox" defaultChecked style={{opacity: 0, width: 0, height: 0}} />
                            <span style={{position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#19c37d', borderRadius: '24px', transition: '0.4s'}}></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Support Tab */}
              <div className={`tab-content ${dashboardTab === 'support' ? 'active' : ''}`}>
                <h2>💬 Hỗ trợ khách hàng</h2>
                <div className="grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px'}}>
                  <div className="card" style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => showToast('Đang kết nối với tổng đài...')}>
                    <div className="icon">📞</div>
                    <h3>Hotline</h3>
                    <p className="muted">1900 1234</p>
                    <p className="muted">24/7</p>
                  </div>
                  
                  <div className="card" style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => showToast('Đang mở chat...')}>
                    <div className="icon">💬</div>
                    <h3>Live Chat</h3>
                    <p className="muted">Trò chuyện trực tiếp</p>
                    <p className="muted">Online</p>
                  </div>
                  
                  <div className="card" style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => showToast('Đang mở email...')}>
                    <div className="icon">📧</div>
                    <h3>Email</h3>
                    <p className="muted">support@swp201.com</p>
                    <p className="muted">Phản hồi trong 24h</p>
                  </div>
                </div>
                
                <div className="card" style={{marginTop: '24px'}}>
                  <h3>FAQ - Câu hỏi thường gặp</h3>
                  <div className="card" style={{marginBottom: '12px'}}>
                    <h4>Làm thế nào để đổi pin?</h4>
                    <p className="muted">Chọn trạm → Quét QR → Đợi máy đổi pin tự động → Hoàn tất</p>
                  </div>
                  <div className="card" style={{marginBottom: '12px'}}>
                    <h4>Chi phí đổi pin là bao nhiêu?</h4>
                    <p className="muted">Từ 10,000₫ - 20,000₫ tùy theo gói dịch vụ và loại pin</p>
                  </div>
                  <div className="card">
                    <h4>Pin đổi có chất lượng tốt không?</h4>
                    <p className="muted">Tất cả pin đều được kiểm tra kỹ lưỡng, đảm bảo &gt;90% dung lượng</p>
                  </div>
                </div>
              </div>

              {/* Settings Tab */}
              <div className={`tab-content ${dashboardTab === 'settings' ? 'active' : ''}`}>
                <h2>⚙️ Cài đặt</h2>
                
                {/* Profile Settings */}
                <div className="card" style={{marginBottom: '24px'}}>
                  <h3>👤 Thông tin cá nhân</h3>
                  <div className="grid" style={{gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px'}}>
                    <div className="form-group">
                      <label>Họ và tên</label>
                      <input type="text" defaultValue={currentUser.name} />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" defaultValue={currentUser.email} />
                    </div>
                    <div className="form-group">
                      <label>Số điện thoại</label>
                      <input type="tel" defaultValue="0901234567" />
                    </div>
                    <div className="form-group">
                      <label>Địa chỉ</label>
                      <input type="text" defaultValue="123 Nguyễn Văn Linh, Q7, TP.HCM" />
                    </div>
                  </div>
                  <button className="btn btn-primary" onClick={() => showToast('Cập nhật thông tin thành công!')}>
                    Cập nhật thông tin
                  </button>
                </div>

                {/* Notification Settings */}
                <div className="card" style={{marginBottom: '24px'}}>
                  <h3>🔔 Cài đặt thông báo</h3>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                    <div>
                      <h4 style={{margin: '0'}}>Thông báo push</h4>
                      <p className="muted" style={{margin: '0', fontSize: '13px'}}>Nhận thông báo trên thiết bị</p>
                    </div>
                    <label style={{position: 'relative', display: 'inline-block', width: '50px', height: '24px'}}>
                      <input type="checkbox" defaultChecked style={{opacity: 0, width: 0, height: 0}} />
                      <span style={{position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#19c37d', borderRadius: '24px', transition: '0.4s'}}></span>
                    </label>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                    <div>
                      <h4 style={{margin: '0'}}>Email thông báo</h4>
                      <p className="muted" style={{margin: '0', fontSize: '13px'}}>Nhận thông báo qua email</p>
                    </div>
                    <label style={{position: 'relative', display: 'inline-block', width: '50px', height: '24px'}}>
                      <input type="checkbox" defaultChecked style={{opacity: 0, width: 0, height: 0}} />
                      <span style={{position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#19c37d', borderRadius: '24px', transition: '0.4s'}}></span>
                    </label>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0'}}>
                    <div>
                      <h4 style={{margin: '0'}}>SMS thông báo</h4>
                      <p className="muted" style={{margin: '0', fontSize: '13px'}}>Nhận thông báo qua SMS</p>
                    </div>
                    <label style={{position: 'relative', display: 'inline-block', width: '50px', height: '24px'}}>
                      <input type="checkbox" style={{opacity: 0, width: 0, height: 0}} />
                      <span style={{position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#ccc', borderRadius: '24px', transition: '0.4s'}}></span>
                    </label>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="card" style={{marginBottom: '24px'}}>
                  <h3>🔒 Bảo mật</h3>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                    <div>
                      <h4 style={{margin: '0'}}>Xác thực 2 yếu tố</h4>
                      <p className="muted" style={{margin: '0', fontSize: '13px'}}>Bảo vệ tài khoản với mã OTP</p>
                    </div>
                    <button className="btn">Kích hoạt</button>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                    <div>
                      <h4 style={{margin: '0'}}>Đổi mật khẩu</h4>
                      <p className="muted" style={{margin: '0', fontSize: '13px'}}>Cập nhật mật khẩu đăng nhập</p>
                    </div>
                    <button className="btn">Đổi mật khẩu</button>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0'}}>
                    <div>
                      <h4 style={{margin: '0'}}>Phiên đăng nhập</h4>
                      <p className="muted" style={{margin: '0', fontSize: '13px'}}>Quản lý các thiết bị đã đăng nhập</p>
                    </div>
                    <button className="btn">Xem chi tiết</button>
                  </div>
                </div>

                {/* App Settings */}
                <div className="card">
                  <h3>📱 Cài đặt ứng dụng</h3>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                    <div>
                      <h4 style={{margin: '0'}}>Ngôn ngữ</h4>
                      <p className="muted" style={{margin: '0', fontSize: '13px'}}>Tiếng Việt</p>
                    </div>
                    <select style={{padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white'}}>
                      <option>Tiếng Việt</option>
                      <option>English</option>
                    </select>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                    <div>
                      <h4 style={{margin: '0'}}>Đơn vị tiền tệ</h4>
                      <p className="muted" style={{margin: '0', fontSize: '13px'}}>VND (₫)</p>
                    </div>
                    <select style={{padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white'}}>
                      <option>VND (₫)</option>
                      <option>USD ($)</option>
                    </select>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0'}}>
                    <div>
                      <h4 style={{margin: '0'}}>Chế độ tối</h4>
                      <p className="muted" style={{margin: '0', fontSize: '13px'}}>Luôn bật chế độ tối</p>
                    </div>
                    <label style={{position: 'relative', display: 'inline-block', width: '50px', height: '24px'}}>
                      <input type="checkbox" defaultChecked style={{opacity: 0, width: 0, height: 0}} />
                      <span style={{position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#19c37d', borderRadius: '24px', transition: '0.4s'}}></span>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Station Management Tab */}
              <div className={`tab-content ${dashboardTab === 'station-management' ? 'active' : ''}`}>
                <h2>🏢 Quản lý trạm đổi pin</h2>
                <p style={{ color: '#E0E0E0', marginBottom: '30px' }}>
                  {currentUser.level === 'admin' 
                    ? 'Quản lý tất cả các trạm đổi pin trong hệ thống'
                    : currentUser.level === 'senior'
                    ? `Quản lý trạm ${currentUser.stationName} và các trạm khác`
                    : `Xem thông tin trạm ${currentUser.stationName} nơi bạn làm việc`
                  }
                </p>

                {/* Staff Station Info */}
                {currentUser.level !== 'admin' && (
                  <div style={{
                    background: 'linear-gradient(135deg, #19c37d, #16a085)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '30px',
                    boxShadow: '0 8px 32px rgba(25, 195, 125, 0.3)',
                    border: '1px solid rgba(25, 195, 125, 0.3)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ fontSize: '24px', marginRight: '15px' }}>📍</div>
                      <div>
                        <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '18px' }}>
                          Trạm làm việc của bạn
                        </h3>
                        <p style={{ margin: 0, color: '#E0E0E0', fontSize: '14px' }}>
                          {currentUser.stationName}
                        </p>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#B0B0B0' }}>
                      Cấp độ: {currentUser.level === 'senior' ? 'Senior Staff' : 'Junior Staff'} | 
                      Quyền: {currentUser.permissions ? currentUser.permissions.join(', ') : 'N/A'}
                    </div>
                  </div>
                )}

                {/* Statistics Cards */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '20px', 
                  marginBottom: '30px' 
                }}>
                  <div style={{
                    background: 'rgba(26, 32, 44, 0.8)',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6ab7ff' }}>
                      {currentUser.level === 'admin' ? '4' : '1'}
                    </div>
                    <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
                      {currentUser.level === 'admin' ? 'Tổng số trạm' : 'Trạm của bạn'}
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(26, 32, 44, 0.8)',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#19c37d' }}>
                      {currentUser.level === 'admin' ? '3' : '1'}
                    </div>
                    <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
                      {currentUser.level === 'admin' ? 'Đang hoạt động' : 'Trạng thái'}
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(26, 32, 44, 0.8)',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffa500' }}>
                      {currentUser.level === 'admin' ? '1' : '0'}
                    </div>
                    <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
                      {currentUser.level === 'admin' ? 'Đang bảo trì' : 'Bảo trì'}
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(26, 32, 44, 0.8)',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6ab7ff' }}>
                      {currentUser.stationId === 'station_1' ? '45' : currentUser.stationId === 'station_3' ? '0' : '146'}
                    </div>
                    <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
                      GD hôm nay
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(26, 32, 44, 0.8)',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9c88ff' }}>
                      {currentUser.stationId === 'station_1' ? '18' : currentUser.stationId === 'station_3' ? '12' : '68'}
                    </div>
                    <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
                      Tổng pin
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(26, 32, 44, 0.8)',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#19c37d' }}>
                      {currentUser.stationId === 'station_1' ? '15' : currentUser.stationId === 'station_3' ? '0' : '45'}
                    </div>
                    <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
                      Pin sẵn sàng
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ marginBottom: '20px' }}>
                  {(currentUser.level === 'admin' || (currentUser.permissions && currentUser.permissions.includes('add_station'))) && (
                    <button 
                      onClick={() => showToast('Chức năng thêm trạm', 'info')}
                      style={{
                        background: 'linear-gradient(135deg, #6ab7ff, #4a90e2)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(106, 183, 255, 0.3)',
                        marginRight: '10px'
                      }}
                    >
                      ➕ Thêm trạm mới
                    </button>
                  )}
                  {currentUser.level === 'admin' && (
                    <button 
                      onClick={() => showToast('Chức năng xóa trạm', 'error')}
                      style={{
                        background: 'linear-gradient(135deg, #ff4757, #ff3742)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(255, 71, 87, 0.3)',
                        marginRight: '10px'
                      }}
                    >
                      🗑️ Xóa trạm
                    </button>
                  )}
                </div>

                {/* Stations Table */}
                <div style={{
                  background: 'rgba(26, 32, 44, 0.8)',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  overflow: 'hidden'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                      <tr>
                        <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Tên trạm</th>
                        <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Địa chỉ</th>
                        <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Sức chứa</th>
                        <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Trạng thái</th>
                        <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>GD hôm nay</th>
                        <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Quản lý</th>
                        <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getStationsForUser(currentUser).map((station, index) => (
                        <tr key={station.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background-color 0.2s ease' }}>
                          <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px', verticalAlign: 'top' }}>
                            <div style={{ fontWeight: 'bold', color: '#6ab7ff' }}>{station.name}</div>
                            <div style={{ fontSize: '12px', color: '#B0B0B0' }}>{station.phone}</div>
                            {station.id === currentUser.stationId && (
                              <div style={{ fontSize: '10px', color: '#19c37d', fontWeight: 'bold', marginTop: '2px' }}>
                                📍 Trạm của bạn
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px', verticalAlign: 'top' }}>
                            <div style={{ color: '#E0E0E0' }}>{station.address}</div>
                            <div style={{ fontSize: '12px', color: '#B0B0B0' }}>{station.hours}</div>
                          </td>
                          <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px', verticalAlign: 'top', textAlign: 'center' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#19c37d' }}>{station.capacity}</div>
                            <div style={{ fontSize: '12px', color: '#B0B0B0' }}>{station.batteries} slots</div>
                          </td>
                          <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px', verticalAlign: 'top', textAlign: 'center' }}>
                            <span style={{
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              color: 'white',
                              background: station.status === 'Hoạt động' ? '#19c37d' : '#ffa500'
                            }}>
                              {station.status}
                            </span>
                          </td>
                          <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px', verticalAlign: 'top', textAlign: 'center' }}>
                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#6ab7ff' }}>{station.transactions}</div>
                            <div style={{ fontSize: '12px', color: '#B0B0B0' }}>⭐ {station.rating}</div>
                          </td>
                          <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px', verticalAlign: 'top' }}>
                            <div style={{ color: '#E0E0E0' }}>{station.manager}</div>
                          </td>
                          <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px', verticalAlign: 'top', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                              <button 
                                onClick={() => showToast(`Xem chi tiết ${station.name} - Pin: ${station.batteries}, GD hôm nay: ${station.transactions}`, 'info')}
                                style={{
                                  background: 'linear-gradient(135deg, #6ab7ff, #4a90e2)',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  borderRadius: '8px',
                                  padding: '8px 16px',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                  boxShadow: '0 4px 15px rgba(106, 183, 255, 0.3)'
                                }}
                              >
                                👁️ Chi tiết
                              </button>
                              {(currentUser.level === 'admin' || ((currentUser.permissions && currentUser.permissions.includes('edit_station')) && station.id === currentUser.stationId)) && (
                                <button 
                                  onClick={() => showToast(`Sửa thông tin ${station.name}`, 'warning')}
                                  style={{
                                    background: 'linear-gradient(135deg, #ffa500, #ff8c00)',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '8px 16px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(255, 165, 0, 0.3)'
                                  }}
                                >
                                  ✏️ Sửa
                                </button>
                              )}
                              {currentUser.level === 'admin' && (
                                <button 
                                  onClick={() => showToast(`Xóa trạm ${station.name}`, 'error')}
                                  style={{
                                    background: 'linear-gradient(135deg, #ff4757, #ff3742)',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '8px 16px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(255, 71, 87, 0.3)'
                                  }}
                                >
                                  🗑️ Xóa
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      );
    }

    // Staff Dashboard with Station Management
    if (currentUser.role === 'staff') {
      return (
        <div className="dashboard active">
          <DashboardHeader />
          <div className="container">
            <div className="dashboard-content">
              <h2>👥 Dashboard Nhân viên</h2>
              <div className="stats-grid">
                <div className="card">
                  <h4>🔋 Pin trong kho</h4>
                  <div className="price">45</div>
                  <p className="muted">8 pin đang sạc</p>
                </div>
                <div className="card">
                  <h4>⚡ Đổi pin hôm nay</h4>
                  <div className="price">23</div>
                  <p className="muted">+5 so với hôm qua</p>
                </div>
                <div className="card">
                  <h4>🛠️ Sự cố</h4>
                  <div className="price">2</div>
                  <p className="muted">Cần xử lý</p>
                </div>
                <div className="card">
                  <h4>📊 Hiệu suất</h4>
                  <div className="price">95%</div>
                  <p className="muted">Xuất sắc</p>
                </div>
              </div>
              
              {/* Staff Features Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '20px', 
                marginTop: '30px' 
              }}>
                <div 
                  onClick={() => setDashboardTab('station-management')}
                  style={{
                    background: 'rgba(26, 32, 44, 0.8)',
                    borderRadius: '12px',
                    padding: '25px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-5px)';
                    e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
                    e.target.style.borderColor = '#19c37d';
                    e.target.style.background = 'rgba(26, 32, 44, 0.9)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.background = 'rgba(26, 32, 44, 0.8)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ 
                      fontSize: '32px', 
                      marginRight: '15px',
                      background: '#19c37d20',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid #19c37d40'
                    }}>
                      🏢
                    </div>
                    <div>
                      <h3 style={{ 
                        margin: 0, 
                        color: '#FFFFFF', 
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}>
                        Quản lý trạm
                      </h3>
                    </div>
                  </div>
                  <p style={{ 
                    margin: 0, 
                    color: '#E0E0E0', 
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    CRUD trạm sạc: thêm, sửa, xóa, xem chi tiết thông tin trạm
                  </p>
                  <div style={{ 
                    marginTop: '15px', 
                    textAlign: 'right',
                    color: '#19c37d',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    Truy cập →
                  </div>
                </div>

                <div 
                  onClick={() => setDashboardTab('battery-inventory')}
                  style={{
                    background: 'rgba(26, 32, 44, 0.8)',
                    borderRadius: '12px',
                    padding: '25px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-5px)';
                    e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
                    e.target.style.borderColor = '#6ab7ff';
                    e.target.style.background = 'rgba(26, 32, 44, 0.9)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.background = 'rgba(26, 32, 44, 0.8)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ 
                      fontSize: '32px', 
                      marginRight: '15px',
                      background: '#6ab7ff20',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid #6ab7ff40'
                    }}>
                      🔋
                    </div>
                    <div>
                      <h3 style={{ 
                        margin: 0, 
                        color: '#FFFFFF', 
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}>
                        Quản lý kho pin
                      </h3>
                    </div>
                  </div>
                  <p style={{ 
                    margin: 0, 
                    color: '#E0E0E0', 
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    Theo dõi và cập nhật trạng thái pin (đang dùng, sạc, hỏng)
                  </p>
                  <div style={{ 
                    marginTop: '15px', 
                    textAlign: 'right',
                    color: '#6ab7ff',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    Truy cập →
                  </div>
                </div>

                <div 
                  onClick={() => setDashboardTab('transaction-management')}
                  style={{
                    background: 'rgba(26, 32, 44, 0.8)',
                    borderRadius: '12px',
                    padding: '25px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-5px)';
                    e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
                    e.target.style.borderColor = '#ffa500';
                    e.target.style.background = 'rgba(26, 32, 44, 0.9)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.background = 'rgba(26, 32, 44, 0.8)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ 
                      fontSize: '32px', 
                      marginRight: '15px',
                      background: '#ffa50020',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid #ffa50040'
                    }}>
                      💳
                    </div>
                    <div>
                      <h3 style={{ 
                        margin: 0, 
                        color: '#FFFFFF', 
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}>
                        Quản lý giao dịch
                      </h3>
                    </div>
                  </div>
                  <p style={{ 
                    margin: 0, 
                    color: '#E0E0E0', 
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    Hiển thị danh sách toàn bộ lịch sử đổi pin và thanh toán
                  </p>
                  <div style={{ 
                    marginTop: '15px', 
                    textAlign: 'right',
                    color: '#ffa500',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    Truy cập →
                  </div>
                </div>

                <div 
                  onClick={() => setDashboardTab('swap-confirm')}
                  style={{
                    background: 'rgba(26, 32, 44, 0.8)',
                    borderRadius: '12px',
                    padding: '25px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-5px)';
                    e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
                    e.target.style.borderColor = '#19c37d';
                    e.target.style.background = 'rgba(26, 32, 44, 0.9)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.background = 'rgba(26, 32, 44, 0.8)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ 
                      fontSize: '32px', 
                      marginRight: '15px',
                      background: '#19c37d20',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid #19c37d40'
                    }}>
                      ✅
                    </div>
                    <div>
                      <h3 style={{ 
                        margin: 0, 
                        color: '#FFFFFF', 
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}>
                        Xác nhận đổi pin
                      </h3>
                    </div>
                  </div>
                  <p style={{ 
                    margin: 0, 
                    color: '#B0B0B0', 
                    fontSize: '14px',
                    lineHeight: '1.4',
                    marginBottom: '15px'
                  }}>
                    Xử lý các yêu cầu đổi pin từ Driver và cập nhật trạng thái pin
                  </p>
                  <div style={{ 
                    textAlign: 'right',
                    color: '#19c37d',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    Truy cập →
                  </div>
                </div>

                <div 
                  onClick={() => setDashboardTab('issues-management')}
                  style={{
                    background: 'rgba(26, 32, 44, 0.8)',
                    borderRadius: '12px',
                    padding: '25px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-5px)';
                    e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.background = 'rgba(26, 32, 44, 0.9)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.background = 'rgba(26, 32, 44, 0.8)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ 
                      fontSize: '32px', 
                      marginRight: '15px',
                      background: '#ef444420',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid #ef444440'
                    }}>
                      🚨
                    </div>
                    <div>
                      <h3 style={{ 
                        margin: 0, 
                        color: '#FFFFFF', 
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}>
                        Xử lý sự cố
                      </h3>
                    </div>
                  </div>
                  <p style={{ 
                    margin: 0, 
                    color: '#B0B0B0', 
                    fontSize: '14px',
                    lineHeight: '1.4',
                    marginBottom: '15px'
                  }}>
                    Quản lý lỗi và sự cố do khách hàng báo cáo
                  </p>
                  <div style={{ 
                    textAlign: 'right',
                    color: '#ef4444',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    Truy cập →
                  </div>
                </div>

                <div 
                  onClick={() => setDashboardTab('reports')}
                  style={{
                    background: 'rgba(26, 32, 44, 0.8)',
                    borderRadius: '12px',
                    padding: '25px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-5px)';
                    e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
                    e.target.style.borderColor = '#8b5cf6';
                    e.target.style.background = 'rgba(26, 32, 44, 0.9)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.background = 'rgba(26, 32, 44, 0.8)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ 
                      fontSize: '32px', 
                      marginRight: '15px',
                      background: '#8b5cf620',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1px solid #8b5cf640'
                    }}>
                      📊
                    </div>
                    <div>
                      <h3 style={{ 
                        margin: 0, 
                        color: '#FFFFFF', 
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}>
                        Báo cáo
                      </h3>
                    </div>
                  </div>
                  <p style={{ 
                    margin: 0, 
                    color: '#B0B0B0', 
                    fontSize: '14px',
                    lineHeight: '1.4',
                    marginBottom: '15px'
                  }}>
                    Thống kê hoạt động của trạm và biểu đồ doanh thu
                  </p>
                  <div style={{ 
                    textAlign: 'right',
                    color: '#8b5cf6',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    Truy cập →
                  </div>
                </div>
              </div>

              {/* Staff Tab Content */}
              {dashboardTab === 'station-management' && (
                <div className="tab-content active">
                  <h2>🏢 Quản lý trạm đổi pin</h2>
                  <p style={{ color: '#E0E0E0', marginBottom: '30px' }}>
                    {currentUser.level === 'admin' 
                      ? 'Quản lý tất cả các trạm đổi pin trong hệ thống'
                      : currentUser.level === 'senior'
                      ? `Quản lý trạm ${currentUser.stationName} và các trạm khác`
                      : `Xem thông tin trạm ${currentUser.stationName} nơi bạn làm việc`
                    }
                  </p>

                  {/* Staff Station Info */}
                  {currentUser.level !== 'admin' && (
                    <div style={{
                      background: 'linear-gradient(135deg, #19c37d, #16a085)',
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '30px',
                      boxShadow: '0 8px 32px rgba(25, 195, 125, 0.3)',
                      border: '1px solid rgba(25, 195, 125, 0.3)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ fontSize: '24px', marginRight: '15px' }}>📍</div>
                        <div>
                          <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '18px' }}>
                            Trạm làm việc của bạn
                          </h3>
                          <p style={{ margin: 0, color: '#E0E0E0', fontSize: '14px' }}>
                            {currentUser.stationName}
                          </p>
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#B0B0B0' }}>
                        Cấp độ: {currentUser.level === 'senior' ? 'Senior Staff' : 'Junior Staff'} | 
                        Quyền: {currentUser.permissions ? currentUser.permissions.join(', ') : 'N/A'}
                      </div>
                    </div>
                  )}

                  {/* Statistics Cards */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '20px', 
                    marginBottom: '30px' 
                  }}>
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                      textAlign: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6ab7ff' }}>
                        {currentUser.level === 'admin' ? '4' : '1'}
                      </div>
                      <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
                        {currentUser.level === 'admin' ? 'Tổng số trạm' : 'Trạm của bạn'}
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                      textAlign: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#19c37d' }}>
                        {currentUser.level === 'admin' ? '3' : '1'}
                      </div>
                      <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
                        {currentUser.level === 'admin' ? 'Đang hoạt động' : 'Trạng thái'}
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                      textAlign: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffa500' }}>
                        {currentUser.level === 'admin' ? '1' : '0'}
                      </div>
                      <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
                        {currentUser.level === 'admin' ? 'Đang bảo trì' : 'Bảo trì'}
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                      textAlign: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6ab7ff' }}>
                        {currentUser.stationId === 'station_1' ? '45' : currentUser.stationId === 'station_3' ? '0' : '146'}
                      </div>
                      <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
                        GD hôm nay
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                      textAlign: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9c88ff' }}>
                        {currentUser.stationId === 'station_1' ? '18' : currentUser.stationId === 'station_3' ? '12' : '68'}
                      </div>
                      <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
                        Tổng pin
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                      textAlign: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#19c37d' }}>
                        {currentUser.stationId === 'station_1' ? '15' : currentUser.stationId === 'station_3' ? '0' : '45'}
                      </div>
                      <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
                        Pin sẵn sàng
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ marginBottom: '20px' }}>
                    {(currentUser.level === 'admin' || (currentUser.permissions && currentUser.permissions.includes('add_station'))) && (
                      <button 
                        onClick={() => showToast('Chức năng thêm trạm', 'info')}
                        style={{
                          background: 'linear-gradient(135deg, #6ab7ff, #4a90e2)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 15px rgba(106, 183, 255, 0.3)',
                          marginRight: '10px'
                        }}
                      >
                        ➕ Thêm trạm mới
                      </button>
                    )}
                    {currentUser.level === 'admin' && (
                      <button 
                        onClick={() => showToast('Chức năng xóa trạm', 'error')}
                        style={{
                          background: 'linear-gradient(135deg, #ff4757, #ff3742)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 20px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 15px rgba(255, 71, 87, 0.3)',
                          marginRight: '10px'
                        }}
                      >
                        🗑️ Xóa trạm
                      </button>
                    )}
                  </div>

                  {/* Stations Table */}
                  <div style={{
                    background: 'rgba(26, 32, 44, 0.8)',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    overflow: 'hidden'
                  }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                        <tr>
                          <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Tên trạm</th>
                          <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Địa chỉ</th>
                          <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Sức chứa</th>
                          <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Trạng thái</th>
                          <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>GD hôm nay</th>
                          <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Quản lý</th>
                          <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getStationsForUser(currentUser).map((station, index) => (
                          <tr key={station.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background-color 0.2s ease' }}>
                            <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px', verticalAlign: 'top' }}>
                              <div style={{ fontWeight: 'bold', color: '#6ab7ff' }}>{station.name}</div>
                              <div style={{ fontSize: '12px', color: '#B0B0B0' }}>{station.phone}</div>
                              {station.id === currentUser.stationId && (
                                <div style={{ fontSize: '10px', color: '#19c37d', fontWeight: 'bold', marginTop: '2px' }}>
                                  📍 Trạm của bạn
                                </div>
                              )}
                            </td>
                            <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px', verticalAlign: 'top' }}>
                              <div style={{ color: '#E0E0E0' }}>{station.address}</div>
                              <div style={{ fontSize: '12px', color: '#B0B0B0' }}>{station.hours}</div>
                            </td>
                            <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px', verticalAlign: 'top', textAlign: 'center' }}>
                              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#19c37d' }}>{station.capacity}</div>
                              <div style={{ fontSize: '12px', color: '#B0B0B0' }}>{station.batteries} slots</div>
                            </td>
                            <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px', verticalAlign: 'top', textAlign: 'center' }}>
                              <span style={{
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: 'white',
                                background: station.status === 'Hoạt động' ? '#19c37d' : '#ffa500'
                              }}>
                                {station.status}
                              </span>
                            </td>
                            <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px', verticalAlign: 'top', textAlign: 'center' }}>
                              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#6ab7ff' }}>{station.transactions}</div>
                              <div style={{ fontSize: '12px', color: '#B0B0B0' }}>⭐ {station.rating}</div>
                            </td>
                            <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px', verticalAlign: 'top' }}>
                              <div style={{ color: '#E0E0E0' }}>{station.manager}</div>
                            </td>
                            <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px', verticalAlign: 'top', textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button 
                                  onClick={() => showToast(`Xem chi tiết ${station.name} - Pin: ${station.batteries}, GD hôm nay: ${station.transactions}`, 'info')}
                                  style={{
                                    background: 'linear-gradient(135deg, #6ab7ff, #4a90e2)',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '8px 16px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(106, 183, 255, 0.3)'
                                  }}
                                >
                                  👁️ Chi tiết
                                </button>
                                {(currentUser.level === 'admin' || ((currentUser.permissions && currentUser.permissions.includes('edit_station')) && station.id === currentUser.stationId)) && (
                                  <button 
                                    onClick={() => showToast(`Sửa thông tin ${station.name}`, 'warning')}
                                    style={{
                                      background: 'linear-gradient(135deg, #ffa500, #ff8c00)',
                                      color: '#FFFFFF',
                                      border: 'none',
                                      borderRadius: '8px',
                                      padding: '8px 16px',
                                      fontSize: '12px',
                                      fontWeight: 'bold',
                                      cursor: 'pointer',
                                      transition: 'all 0.3s ease',
                                      boxShadow: '0 4px 15px rgba(255, 165, 0, 0.3)'
                                    }}
                                  >
                                    ✏️ Sửa
                                  </button>
                                )}
                                {currentUser.level === 'admin' && (
                                  <button 
                                    onClick={() => showToast(`Xóa trạm ${station.name}`, 'error')}
                                    style={{
                                      background: 'linear-gradient(135deg, #ff4757, #ff3742)',
                                      color: '#FFFFFF',
                                      border: 'none',
                                      borderRadius: '8px',
                                      padding: '8px 16px',
                                      fontSize: '12px',
                                      fontWeight: 'bold',
                                      cursor: 'pointer',
                                      transition: 'all 0.3s ease',
                                      boxShadow: '0 4px 15px rgba(255, 71, 87, 0.3)'
                                    }}
                                  >
                                    🗑️ Xóa
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Battery Inventory Management */}
              {dashboardTab === 'battery-inventory' && (
                <div className="tab-content active">
                  <h2>🔋 Quản lý kho pin</h2>
                  <p style={{ color: '#E0E0E0', marginBottom: '30px' }}>
                    Theo dõi tình trạng pin trong trạm {currentUser.stationName}
                  </p>

                  {/* Battery Statistics */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '20px', 
                    marginBottom: '30px' 
                  }}>
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(25, 195, 125, 0.3)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔋</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#19c37d', marginBottom: '5px' }}>
                        {getBatteriesForStation(currentUser.stationId).filter(b => b.status === 'Full').length}
                      </div>
                      <div style={{ color: '#E0E0E0', fontSize: '14px' }}>Pin đầy</div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(106, 183, 255, 0.3)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚡</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6ab7ff', marginBottom: '5px' }}>
                        {getBatteriesForStation(currentUser.stationId).filter(b => b.status === 'Charging').length}
                      </div>
                      <div style={{ color: '#E0E0E0', fontSize: '14px' }}>Đang sạc</div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔧</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '5px' }}>
                        {getBatteriesForStation(currentUser.stationId).filter(b => b.status === 'Maintenance').length}
                      </div>
                      <div style={{ color: '#E0E0E0', fontSize: '14px' }}>Bảo trì</div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚠️</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444', marginBottom: '5px' }}>
                        {getBatteriesForStation(currentUser.stationId).filter(b => b.status === 'Error').length}
                      </div>
                      <div style={{ color: '#E0E0E0', fontSize: '14px' }}>Lỗi</div>
                    </div>
                  </div>

                  {/* Filter Controls */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}>
                    <span style={{ color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>Lọc theo trạng thái:</span>
                    {['all', 'Full', 'Charging', 'Maintenance', 'Error'].map(status => (
                      <button
                        key={status}
                        onClick={() => setBatteryFilter(status)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '20px',
                          background: batteryFilter === status ? '#19c37d' : 'rgba(26, 32, 44, 0.8)',
                          color: batteryFilter === status ? '#FFFFFF' : '#E0E0E0',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          transition: 'all 0.3s ease',
                          border: `1px solid ${batteryFilter === status ? '#19c37d' : 'rgba(255, 255, 255, 0.1)'}`
                        }}
                        onMouseEnter={(e) => {
                          if (batteryFilter !== status) {
                            e.target.style.background = 'rgba(26, 32, 44, 0.9)';
                            e.target.style.borderColor = '#19c37d';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (batteryFilter !== status) {
                            e.target.style.background = 'rgba(26, 32, 44, 0.8)';
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                          }
                        }}
                      >
                        {status === 'all' ? 'Tất cả' : 
                         status === 'Full' ? '🔋 Đầy' :
                         status === 'Charging' ? '⚡ Sạc' :
                         status === 'Maintenance' ? '🔧 Bảo trì' :
                         '⚠️ Lỗi'}
                      </button>
                    ))}
                  </div>

                  {/* Battery List */}
                  <div style={{
                    background: 'rgba(26, 32, 44, 0.8)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '18px' }}>
                      Danh sách pin tại trạm ({getFilteredBatteries().length} pin)
                    </h3>
                    
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                          <tr>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Battery ID
                            </th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Model
                            </th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Capacity (Ah)
                            </th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              SOH (%)
                            </th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Status
                            </th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Last Maintenance
                            </th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Location
                            </th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredBatteries().map((battery, index) => (
                            <tr key={battery.id} style={{ 
                              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                              background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                            }}>
                              <td style={{ padding: '12px', color: '#6ab7ff', fontWeight: 'bold', fontSize: '14px' }}>
                                {battery.id}
                              </td>
                              <td style={{ padding: '12px', color: '#E0E0E0', fontSize: '14px' }}>
                                {battery.model}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px' }}>
                                {battery.capacity}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>
                                <span style={{ 
                                  color: getSOHColor(battery.soh),
                                  fontWeight: 'bold'
                                }}>
                                  {battery.soh}%
                                </span>
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  background: `${getStatusColor(battery.status)}20`,
                                  color: getStatusColor(battery.status),
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  border: `1px solid ${getStatusColor(battery.status)}40`
                                }}>
                                  {getStatusIcon(battery.status)} {battery.status}
                                </span>
                              </td>
                              <td style={{ padding: '12px', color: '#B0B0B0', fontSize: '14px' }}>
                                {battery.lastMaintenance}
                              </td>
                              <td style={{ padding: '12px', color: '#B0B0B0', fontSize: '14px' }}>
                                {battery.location}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                  <button
                                    onClick={() => {
                                      setSelectedBattery(battery);
                                      setShowBatteryModal(true);
                                    }}
                                    style={{
                                      padding: '6px 12px',
                                      borderRadius: '6px',
                                      border: 'none',
                                      background: '#6ab7ff',
                                      color: '#FFFFFF',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                      fontWeight: 'bold',
                                      transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.background = '#5a9fd8';
                                      e.target.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.background = '#6ab7ff';
                                      e.target.style.transform = 'translateY(0)';
                                    }}
                                  >
                                    👁️ Chi tiết
                                  </button>
                                  <button
                                    onClick={() => {
                                      const newStatus = battery.status === 'Full' ? 'Charging' : 
                                                       battery.status === 'Charging' ? 'Full' :
                                                       battery.status === 'Maintenance' ? 'Full' : 'Maintenance';
                                      updateBatteryStatus(battery.id, newStatus, 'Manual status update');
                                    }}
                                    style={{
                                      padding: '6px 12px',
                                      borderRadius: '6px',
                                      border: 'none',
                                      background: '#19c37d',
                                      color: '#FFFFFF',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                      fontWeight: 'bold',
                                      transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.background = '#16a085';
                                      e.target.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.background = '#19c37d';
                                      e.target.style.transform = 'translateY(0)';
                                    }}
                                  >
                                    🔄 Cập nhật
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Battery History */}
                  <div style={{
                    background: 'rgba(26, 32, 44, 0.8)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginTop: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '18px' }}>
                      📊 Lịch sử thay đổi trạng thái pin
                    </h3>
                    
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                          <tr>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Battery ID
                            </th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Trạng thái cũ
                            </th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Trạng thái mới
                            </th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Thời gian
                            </th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Người thay đổi
                            </th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Lý do
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {batteryHistory.slice(0, 10).map((history, index) => (
                            <tr key={history.id} style={{ 
                              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                              background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                            }}>
                              <td style={{ padding: '12px', color: '#6ab7ff', fontWeight: 'bold', fontSize: '14px' }}>
                                {history.batteryId}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  padding: '2px 6px',
                                  borderRadius: '8px',
                                  background: `${getStatusColor(history.oldStatus)}20`,
                                  color: getStatusColor(history.oldStatus),
                                  fontSize: '11px',
                                  fontWeight: 'bold'
                                }}>
                                  {getStatusIcon(history.oldStatus)} {history.oldStatus}
                                </span>
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  padding: '2px 6px',
                                  borderRadius: '8px',
                                  background: `${getStatusColor(history.newStatus)}20`,
                                  color: getStatusColor(history.newStatus),
                                  fontSize: '11px',
                                  fontWeight: 'bold'
                                }}>
                                  {getStatusIcon(history.newStatus)} {history.newStatus}
                                </span>
                              </td>
                              <td style={{ padding: '12px', color: '#B0B0B0', fontSize: '14px' }}>
                                {history.timestamp}
                              </td>
                              <td style={{ padding: '12px', color: '#B0B0B0', fontSize: '14px' }}>
                                {history.changedBy}
                              </td>
                              <td style={{ padding: '12px', color: '#E0E0E0', fontSize: '14px' }}>
                                {history.reason}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Swap Requests */}
                  <div style={{
                    background: 'rgba(26, 32, 44, 0.8)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginTop: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '18px' }}>
                      🔄 Yêu cầu đổi pin chờ xử lý ({getSwapRequestsForStation(currentUser.stationId).length} yêu cầu)
                    </h3>
                    
                    {getSwapRequestsForStation(currentUser.stationId).length === 0 ? (
                      <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#B0B0B0',
                        fontSize: '16px'
                      }}>
                        <div style={{ fontSize: '48px', marginBottom: '15px' }}>✅</div>
                        <div>Không có yêu cầu đổi pin nào chờ xử lý</div>
                        <div style={{ fontSize: '14px', marginTop: '5px' }}>Tất cả đã được xử lý!</div>
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                            <tr>
                              <th style={{ padding: '12px', textAlign: 'left', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                                Request ID
                              </th>
                              <th style={{ padding: '12px', textAlign: 'left', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                                Driver
                              </th>
                              <th style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                                Pin cũ → Pin mới
                              </th>
                              <th style={{ padding: '12px', textAlign: 'left', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                                Thời gian yêu cầu
                              </th>
                              <th style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                                Số tiền
                              </th>
                              <th style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {getSwapRequestsForStation(currentUser.stationId).map((request, index) => (
                              <tr key={request.id} style={{ 
                                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                                background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                              }}>
                                <td style={{ padding: '12px', color: '#6ab7ff', fontWeight: 'bold', fontSize: '14px' }}>
                                  {request.id}
                                </td>
                                <td style={{ padding: '12px', color: '#E0E0E0', fontSize: '14px' }}>
                                  <div style={{ fontWeight: 'bold' }}>{request.driverName}</div>
                                  <div style={{ fontSize: '12px', color: '#B0B0B0' }}>{request.driverPhone}</div>
                                </td>
                                <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>
                                  <div style={{ marginBottom: '5px' }}>
                                    <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{request.batteryOld}</span>
                                    <span style={{ color: '#B0B0B0', margin: '0 5px' }}>→</span>
                                    <span style={{ color: '#19c37d', fontWeight: 'bold' }}>{request.batteryNew}</span>
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#B0B0B0' }}>
                                    {request.batteryOldSOH}% → {request.batteryNewSOH}%
                                  </div>
                                </td>
                                <td style={{ padding: '12px', color: '#B0B0B0', fontSize: '14px' }}>
                                  <div>{request.requestTime}</div>
                                  <div style={{ fontSize: '12px', color: '#6ab7ff' }}>{request.estimatedDuration}</div>
                                </td>
                                <td style={{ padding: '12px', textAlign: 'center', color: '#19c37d', fontSize: '14px', fontWeight: 'bold' }}>
                                  {formatCurrency(request.amount)}
                                </td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <button
                                      onClick={() => {
                                        setSelectedSwapRequest(request);
                                        setShowSwapModal(true);
                                      }}
                                      style={{
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: '#6ab7ff',
                                        color: '#FFFFFF',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        transition: 'all 0.3s ease'
                                      }}
                                      onMouseEnter={(e) => {
                                        e.target.style.background = '#5a9fd8';
                                        e.target.style.transform = 'translateY(-1px)';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.target.style.background = '#6ab7ff';
                                        e.target.style.transform = 'translateY(0)';
                                      }}
                                    >
                                      👁️ Chi tiết
                                    </button>
                                    <button
                                      onClick={() => confirmSwap(request.id)}
                                      style={{
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: '#19c37d',
                                        color: '#FFFFFF',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        transition: 'all 0.3s ease'
                                      }}
                                      onMouseEnter={(e) => {
                                        e.target.style.background = '#16a085';
                                        e.target.style.transform = 'translateY(-1px)';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.target.style.background = '#19c37d';
                                        e.target.style.transform = 'translateY(0)';
                                      }}
                                    >
                                      ✅ Xác nhận
                                    </button>
                                    <button
                                      onClick={() => rejectSwap(request.id)}
                                      style={{
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: '#ef4444',
                                        color: '#FFFFFF',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        transition: 'all 0.3s ease'
                                      }}
                                      onMouseEnter={(e) => {
                                        e.target.style.background = '#dc2626';
                                        e.target.style.transform = 'translateY(-1px)';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.target.style.background = '#ef4444';
                                        e.target.style.transform = 'translateY(0)';
                                      }}
                                    >
                                      ❌ Từ chối
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Transaction Management */}
              {dashboardTab === 'transaction-management' && (
                <div className="tab-content active">
                  <h2>💳 Quản lý giao dịch</h2>
                  <p style={{ color: '#E0E0E0', marginBottom: '30px' }}>
                    Hiển thị danh sách tất cả các giao dịch đổi pin tại trạm {currentUser.stationName}
                  </p>

                  {/* Transaction Statistics */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '20px', 
                    marginBottom: '30px' 
                  }}>
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(25, 195, 125, 0.3)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>✅</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#19c37d', marginBottom: '5px' }}>
                        {getTransactionsForStation(currentUser.stationId).filter(t => t.paymentStatus === 'Success').length}
                      </div>
                      <div style={{ color: '#E0E0E0', fontSize: '14px' }}>Thành công</div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏳</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '5px' }}>
                        {getTransactionsForStation(currentUser.stationId).filter(t => t.paymentStatus === 'Pending').length}
                      </div>
                      <div style={{ color: '#E0E0E0', fontSize: '14px' }}>Đang xử lý</div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>❌</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444', marginBottom: '5px' }}>
                        {getTransactionsForStation(currentUser.stationId).filter(t => t.paymentStatus === 'Failed').length}
                      </div>
                      <div style={{ color: '#E0E0E0', fontSize: '14px' }}>Thất bại</div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(106, 183, 255, 0.3)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>💰</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6ab7ff', marginBottom: '5px' }}>
                        {formatCurrency(getTransactionsForStation(currentUser.stationId).filter(t => t.paymentStatus === 'Success').reduce((sum, t) => sum + t.amount, 0))}
                      </div>
                      <div style={{ color: '#E0E0E0', fontSize: '14px' }}>Tổng doanh thu</div>
                    </div>
                  </div>

                  {/* Filter Controls */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '15px', 
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>Lọc theo trạng thái:</span>
                      <select
                        value={transactionFilter}
                        onChange={(e) => setTransactionFilter(e.target.value)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: 'rgba(26, 32, 44, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#E0E0E0',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="all">Tất cả</option>
                        <option value="success">✅ Thành công</option>
                        <option value="pending">⏳ Đang xử lý</option>
                        <option value="failed">❌ Thất bại</option>
                      </select>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>Lọc theo ngày:</span>
                      <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: 'rgba(26, 32, 44, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#E0E0E0',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="all">Tất cả</option>
                        <option value="today">Hôm nay</option>
                        <option value="yesterday">Hôm qua</option>
                        <option value="week">7 ngày qua</option>
                        <option value="month">30 ngày qua</option>
                      </select>
                    </div>
                  </div>

                  {/* Transaction List */}
                  <div style={{
                    background: 'rgba(26, 32, 44, 0.8)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '18px' }}>
                      Lịch sử giao dịch ({getFilteredTransactions().length} giao dịch)
                    </h3>
                    
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                          <tr>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Swap ID
                            </th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Driver
                            </th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Pin cũ → Pin mới
                            </th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Thời gian
                            </th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Trạng thái
                            </th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Số tiền
                            </th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredTransactions().map((transaction, index) => (
                            <tr key={transaction.id} style={{ 
                              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                              background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                            }}>
                              <td style={{ padding: '12px', color: '#6ab7ff', fontWeight: 'bold', fontSize: '14px' }}>
                                {transaction.id}
                              </td>
                              <td style={{ padding: '12px', color: '#E0E0E0', fontSize: '14px' }}>
                                <div style={{ fontWeight: 'bold' }}>{transaction.driverName}</div>
                                <div style={{ fontSize: '12px', color: '#B0B0B0' }}>{transaction.driverPhone}</div>
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>
                                <div style={{ marginBottom: '5px' }}>
                                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{transaction.batteryOld}</span>
                                  <span style={{ color: '#B0B0B0', margin: '0 5px' }}>→</span>
                                  <span style={{ color: '#19c37d', fontWeight: 'bold' }}>{transaction.batteryNew}</span>
                                </div>
                                <div style={{ fontSize: '12px', color: '#B0B0B0' }}>
                                  {transaction.batteryOldSOH}% → {transaction.batteryNewSOH}%
                                </div>
                              </td>
                              <td style={{ padding: '12px', color: '#B0B0B0', fontSize: '14px' }}>
                                <div>{transaction.swapTime}</div>
                                <div style={{ fontSize: '12px', color: '#6ab7ff' }}>{transaction.duration}</div>
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  background: `${getPaymentStatusColor(transaction.paymentStatus)}20`,
                                  color: getPaymentStatusColor(transaction.paymentStatus),
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  border: `1px solid ${getPaymentStatusColor(transaction.paymentStatus)}40`
                                }}>
                                  {getPaymentStatusIcon(transaction.paymentStatus)} {transaction.paymentStatus}
                                </span>
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center', color: '#19c37d', fontSize: '14px', fontWeight: 'bold' }}>
                                {formatCurrency(transaction.amount)}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                  <button
                                    onClick={() => {
                                      setSelectedTransaction(transaction);
                                      setShowTransactionModal(true);
                                    }}
                                    style={{
                                      padding: '6px 12px',
                                      borderRadius: '6px',
                                      border: 'none',
                                      background: '#6ab7ff',
                                      color: '#FFFFFF',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                      fontWeight: 'bold',
                                      transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.background = '#5a9fd8';
                                      e.target.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.background = '#6ab7ff';
                                      e.target.style.transform = 'translateY(0)';
                                    }}
                                  >
                                    👁️ Chi tiết
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Swap Confirm */}
              {dashboardTab === 'swap-confirm' && (
                <div className="tab-content active">
                  <h2>✅ Xác nhận đổi pin</h2>
                  <p style={{ color: '#E0E0E0', marginBottom: '30px' }}>
                    Xử lý các yêu cầu đổi pin từ Driver tại trạm {currentUser.stationName}
                  </p>

                  {/* Swap Confirm Statistics */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '20px', 
                    marginBottom: '30px' 
                  }}>
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏳</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '5px' }}>
                        {getPendingSwapRequestsForStation(currentUser.stationId).length}
                      </div>
                      <div style={{ color: '#E0E0E0', fontSize: '14px' }}>Chờ xử lý</div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(25, 195, 125, 0.3)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>✅</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#19c37d', marginBottom: '5px' }}>
                        {transactions.filter(t => t.completedBy === currentUser.email).length}
                      </div>
                      <div style={{ color: '#E0E0E0', fontSize: '14px' }}>Đã xử lý hôm nay</div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(106, 183, 255, 0.3)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏱️</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6ab7ff', marginBottom: '5px' }}>
                        {getPendingSwapRequestsForStation(currentUser.stationId).length > 0 ? '2-4' : '0'}
                      </div>
                      <div style={{ color: '#E0E0E0', fontSize: '14px' }}>Phút trung bình</div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>🚨</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444', marginBottom: '5px' }}>
                        {getPendingSwapRequestsForStation(currentUser.stationId).filter(r => {
                          const requestTime = new Date(r.requestTime);
                          const now = new Date();
                          const diffMinutes = (now - requestTime) / (1000 * 60);
                          return diffMinutes > 5;
                        }).length}
                      </div>
                      <div style={{ color: '#E0E0E0', fontSize: '14px' }}>Quá 5 phút</div>
                    </div>
                  </div>

                  {/* Pending Swap Requests List */}
                  <div style={{
                    background: 'rgba(26, 32, 44, 0.8)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '18px' }}>
                      Danh sách yêu cầu đổi pin chờ xử lý ({getPendingSwapRequestsForStation(currentUser.stationId).length} yêu cầu)
                    </h3>
                    
                    {getPendingSwapRequestsForStation(currentUser.stationId).length === 0 ? (
                      <div style={{ 
                        textAlign: 'center', 
                        padding: '40px', 
                        color: '#B0B0B0',
                        fontSize: '16px'
                      }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
                        <div>Không có yêu cầu đổi pin nào chờ xử lý</div>
                        <div style={{ fontSize: '14px', marginTop: '10px' }}>
                          Tất cả các yêu cầu đã được xử lý hoặc chưa có driver nào yêu cầu đổi pin
                        </div>
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                            <tr>
                              <th style={{ padding: '12px', textAlign: 'left', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                                Request ID
                              </th>
                              <th style={{ padding: '12px', textAlign: 'left', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                                Driver
                              </th>
                              <th style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                                Pin cũ → Pin mới
                              </th>
                              <th style={{ padding: '12px', textAlign: 'left', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                                Thời gian yêu cầu
                              </th>
                              <th style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                                Vị trí
                              </th>
                              <th style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {getPendingSwapRequestsForStation(currentUser.stationId).map((request, index) => {
                              const requestTime = new Date(request.requestTime);
                              const now = new Date();
                              const diffMinutes = Math.floor((now - requestTime) / (1000 * 60));
                              const isOverdue = diffMinutes > 5;
                              
                              return (
                                <tr key={request.id} style={{ 
                                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                                  background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                                  borderLeft: isOverdue ? '4px solid #ef4444' : '4px solid transparent'
                                }}>
                                  <td style={{ padding: '12px', color: '#6ab7ff', fontWeight: 'bold', fontSize: '14px' }}>
                                    {request.id}
                                  </td>
                                  <td style={{ padding: '12px', color: '#E0E0E0', fontSize: '14px' }}>
                                    <div style={{ fontWeight: 'bold' }}>{request.driverName}</div>
                                    <div style={{ fontSize: '12px', color: '#B0B0B0' }}>{request.driverPhone}</div>
                                    <div style={{ fontSize: '12px', color: '#6ab7ff' }}>{request.licensePlate}</div>
                                  </td>
                                  <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>
                                    <div style={{ marginBottom: '5px' }}>
                                      <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{request.batteryOld}</span>
                                      <span style={{ color: '#B0B0B0', margin: '0 5px' }}>→</span>
                                      <span style={{ color: '#19c37d', fontWeight: 'bold' }}>{request.batteryNew}</span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#B0B0B0' }}>
                                      {request.batteryOldSOH}% → {request.batteryNewSOH}%
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#6ab7ff' }}>
                                      {request.estimatedDuration}
                                    </div>
                                  </td>
                                  <td style={{ padding: '12px', color: '#B0B0B0', fontSize: '14px' }}>
                                    <div>{request.requestTime}</div>
                                    <div style={{ 
                                      fontSize: '12px', 
                                      color: isOverdue ? '#ef4444' : '#6ab7ff',
                                      fontWeight: 'bold'
                                    }}>
                                      {diffMinutes > 0 ? `${diffMinutes} phút trước` : 'Vừa mới'}
                                    </div>
                                  </td>
                                  <td style={{ padding: '12px', textAlign: 'center', color: '#6ab7ff', fontSize: '14px', fontWeight: 'bold' }}>
                                    {request.location}
                                  </td>
                                  <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                      <button
                                        onClick={() => {
                                          setSelectedSwapConfirm(request);
                                          setShowSwapConfirmModal(true);
                                        }}
                                        style={{
                                          padding: '6px 12px',
                                          borderRadius: '6px',
                                          border: 'none',
                                          background: '#6ab7ff',
                                          color: '#FFFFFF',
                                          cursor: 'pointer',
                                          fontSize: '12px',
                                          fontWeight: 'bold',
                                          transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                          e.target.style.background = '#5a9fd8';
                                          e.target.style.transform = 'translateY(-1px)';
                                        }}
                                        onMouseLeave={(e) => {
                                          e.target.style.background = '#6ab7ff';
                                          e.target.style.transform = 'translateY(0)';
                                        }}
                                      >
                                        👁️ Chi tiết
                                      </button>
                                      <button
                                        onClick={() => confirmSwapRequest(request.id)}
                                        style={{
                                          padding: '6px 12px',
                                          borderRadius: '6px',
                                          border: 'none',
                                          background: '#19c37d',
                                          color: '#FFFFFF',
                                          cursor: 'pointer',
                                          fontSize: '12px',
                                          fontWeight: 'bold',
                                          transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                          e.target.style.background = '#16a085';
                                          e.target.style.transform = 'translateY(-1px)';
                                        }}
                                        onMouseLeave={(e) => {
                                          e.target.style.background = '#19c37d';
                                          e.target.style.transform = 'translateY(0)';
                                        }}
                                      >
                                        ✅ Xác nhận
                                      </button>
                                      <button
                                        onClick={() => rejectSwapRequest(request.id)}
                                        style={{
                                          padding: '6px 12px',
                                          borderRadius: '6px',
                                          border: 'none',
                                          background: '#ef4444',
                                          color: '#FFFFFF',
                                          cursor: 'pointer',
                                          fontSize: '12px',
                                          fontWeight: 'bold',
                                          transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                          e.target.style.background = '#dc2626';
                                          e.target.style.transform = 'translateY(-1px)';
                                        }}
                                        onMouseLeave={(e) => {
                                          e.target.style.background = '#ef4444';
                                          e.target.style.transform = 'translateY(0)';
                                        }}
                                      >
                                        ❌ Từ chối
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Issues Management */}
              {dashboardTab === 'issues-management' && (
                <div className="tab-content active">
                  <h2>🚨 Xử lý sự cố</h2>
                  <p style={{ color: '#E0E0E0', marginBottom: '30px' }}>
                    Quản lý lỗi và sự cố do khách hàng báo cáo tại trạm {currentUser.stationName}
                  </p>

                  {/* Issues Statistics */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '20px', 
                    marginBottom: '30px' 
                  }}>
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏳</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '5px' }}>
                        {getIssuesForStation(currentUser.stationId).filter(i => i.status === 'Pending').length}
                      </div>
                      <div style={{ color: '#E0E0E0', fontSize: '14px' }}>Chờ xử lý</div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔄</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '5px' }}>
                        {getIssuesForStation(currentUser.stationId).filter(i => i.status === 'In Progress').length}
                      </div>
                      <div style={{ color: '#E0E0E0', fontSize: '14px' }}>Đang xử lý</div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(25, 195, 125, 0.3)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>✅</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#19c37d', marginBottom: '5px' }}>
                        {getIssuesForStation(currentUser.stationId).filter(i => i.status === 'Done').length}
                      </div>
                      <div style={{ color: '#E0E0E0', fontSize: '14px' }}>Đã hoàn thành</div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>🚨</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444', marginBottom: '5px' }}>
                        {getIssuesForStation(currentUser.stationId).filter(i => i.priority === 'Critical').length}
                      </div>
                      <div style={{ color: '#E0E0E0', fontSize: '14px' }}>Ưu tiên cao</div>
                    </div>
                  </div>

                  {/* Filter Controls */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '15px', 
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>Lọc theo trạng thái:</span>
                      <select
                        value={issueFilter}
                        onChange={(e) => setIssueFilter(e.target.value)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: 'rgba(26, 32, 44, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#E0E0E0',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="all">Tất cả</option>
                        <option value="pending">⏳ Chờ xử lý</option>
                        <option value="in progress">🔄 Đang xử lý</option>
                        <option value="done">✅ Đã hoàn thành</option>
                      </select>
                    </div>
                  </div>

                  {/* Issues List */}
                  <div style={{
                    background: 'rgba(26, 32, 44, 0.8)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '18px' }}>
                      Danh sách sự cố ({getFilteredIssues().length} sự cố)
                    </h3>
                    
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                          <tr>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Issue ID
                            </th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Driver
                            </th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Mô tả sự cố
                            </th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Ưu tiên
                            </th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Trạng thái
                            </th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Thời gian
                            </th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredIssues().map((issue, index) => (
                            <tr key={issue.id} style={{ 
                              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                              background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                            }}>
                              <td style={{ padding: '12px', color: '#6ab7ff', fontWeight: 'bold', fontSize: '14px' }}>
                                {issue.id}
                              </td>
                              <td style={{ padding: '12px', color: '#E0E0E0', fontSize: '14px' }}>
                                <div style={{ fontWeight: 'bold' }}>{issue.driverName}</div>
                                <div style={{ fontSize: '12px', color: '#B0B0B0' }}>{issue.driverPhone}</div>
                                <div style={{ fontSize: '12px', color: '#6ab7ff' }}>{issue.location}</div>
                              </td>
                              <td style={{ padding: '12px', color: '#E0E0E0', fontSize: '14px' }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{issue.title}</div>
                                <div style={{ fontSize: '12px', color: '#B0B0B0' }}>{issue.description}</div>
                                <div style={{ fontSize: '12px', color: '#6ab7ff', marginTop: '5px' }}>
                                  {issue.category} • {issue.batteryId}
                                </div>
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  background: `${getPriorityColor(issue.priority)}20`,
                                  color: getPriorityColor(issue.priority),
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  border: `1px solid ${getPriorityColor(issue.priority)}40`
                                }}>
                                  {getPriorityIcon(issue.priority)} {issue.priority}
                                </span>
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center' }}>
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  background: `${getIssueStatusColor(issue.status)}20`,
                                  color: getIssueStatusColor(issue.status),
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  border: `1px solid ${getIssueStatusColor(issue.status)}40`
                                }}>
                                  {getIssueStatusIcon(issue.status)} {issue.status}
                                </span>
                              </td>
                              <td style={{ padding: '12px', color: '#B0B0B0', fontSize: '14px' }}>
                                <div>{issue.createdAt}</div>
                                <div style={{ fontSize: '12px', color: '#6ab7ff' }}>
                                  Cập nhật: {issue.updatedAt}
                                </div>
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                  <button
                                    onClick={() => {
                                      setSelectedIssue(issue);
                                      setShowIssueModal(true);
                                    }}
                                    style={{
                                      padding: '6px 12px',
                                      borderRadius: '6px',
                                      border: 'none',
                                      background: '#6ab7ff',
                                      color: '#FFFFFF',
                                      cursor: 'pointer',
                                      fontSize: '12px',
                                      fontWeight: 'bold',
                                      transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.background = '#5a9fd8';
                                      e.target.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.background = '#6ab7ff';
                                      e.target.style.transform = 'translateY(0)';
                                    }}
                                  >
                                    👁️ Chi tiết
                                  </button>
                                  {issue.status !== 'Done' && (
                                    <button
                                      onClick={() => {
                                        const nextStatus = issue.status === 'Pending' ? 'In Progress' : 'Done';
                                        updateIssueStatus(issue.id, nextStatus, '');
                                      }}
                                      style={{
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: issue.status === 'Pending' ? '#3b82f6' : '#19c37d',
                                        color: '#FFFFFF',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        transition: 'all 0.3s ease'
                                      }}
                                      onMouseEnter={(e) => {
                                        e.target.style.background = issue.status === 'Pending' ? '#2563eb' : '#16a085';
                                        e.target.style.transform = 'translateY(-1px)';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.target.style.background = issue.status === 'Pending' ? '#3b82f6' : '#19c37d';
                                        e.target.style.transform = 'translateY(0)';
                                      }}
                                    >
                                      {issue.status === 'Pending' ? '🔄 Bắt đầu' : '✅ Hoàn thành'}
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Reports */}
              {dashboardTab === 'reports' && (
                <div className="tab-content active">
                  <h2>📊 Báo cáo</h2>
                  <p style={{ color: '#E0E0E0', marginBottom: '30px' }}>
                    Thống kê hoạt động của trạm {currentUser.stationName} và biểu đồ doanh thu
                  </p>

                  {/* Date Range Filter */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '15px', 
                    marginBottom: '30px',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>Khoảng thời gian:</span>
                      <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: 'rgba(26, 32, 44, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#E0E0E0',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="week">7 ngày qua</option>
                        <option value="month">30 ngày qua</option>
                        <option value="quarter">3 tháng qua</option>
                        <option value="all">Tất cả</option>
                      </select>
                    </div>
                  </div>

                  {/* Summary Statistics */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '20px', 
                    marginBottom: '30px' 
                  }}>
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔄</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '5px' }}>
                        {getFilteredReports().reduce((sum, item) => sum + item.swaps, 0)}
                      </div>
                      <div style={{ color: '#E0E0E0', fontSize: '14px' }}>Tổng số lần swap</div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(25, 195, 125, 0.3)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>💰</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#19c37d', marginBottom: '5px' }}>
                        {formatCurrency(getFilteredReports().reduce((sum, item) => sum + item.revenue, 0))}
                      </div>
                      <div style={{ color: '#E0E0E0', fontSize: '14px' }}>Tổng doanh thu</div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔋</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444', marginBottom: '5px' }}>
                        {getFilteredReports().reduce((sum, item) => sum + item.brokenBatteries, 0)}
                      </div>
                      <div style={{ color: '#E0E0E0', fontSize: '14px' }}>Pin hỏng</div>
                    </div>
                    
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>📈</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '5px' }}>
                        {getFilteredReports().length > 0 ? Math.round(getFilteredReports().reduce((sum, item) => sum + item.swaps, 0) / getFilteredReports().length) : 0}
                      </div>
                      <div style={{ color: '#E0E0E0', fontSize: '14px' }}>Trung bình/ngày</div>
                    </div>
                  </div>

                  {/* Charts Section */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                    gap: '20px', 
                    marginBottom: '30px' 
                  }}>
                    {/* Swaps Chart */}
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '18px' }}>
                        📊 Số lần swap theo ngày
                      </h3>
                      <div style={{ height: '200px', display: 'flex', alignItems: 'end', gap: '8px', padding: '20px 0' }}>
                        {getChartData().swaps.map((value, index) => {
                          const maxValue = Math.max(...getChartData().swaps);
                          const height = (value / maxValue) * 160;
                          return (
                            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                              <div style={{
                                background: 'linear-gradient(to top, #3b82f6, #60a5fa)',
                                height: `${height}px`,
                                width: '100%',
                                borderRadius: '4px 4px 0 0',
                                marginBottom: '8px',
                                minHeight: '4px'
                              }}></div>
                              <div style={{ fontSize: '12px', color: '#B0B0B0' }}>
                                {getChartData().labels[index]}
                              </div>
                              <div style={{ fontSize: '10px', color: '#6ab7ff', fontWeight: 'bold' }}>
                                {value}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Revenue Chart */}
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '18px' }}>
                        💰 Doanh thu theo ngày
                      </h3>
                      <div style={{ height: '200px', display: 'flex', alignItems: 'end', gap: '8px', padding: '20px 0' }}>
                        {getChartData().revenue.map((value, index) => {
                          const maxValue = Math.max(...getChartData().revenue);
                          const height = (value / maxValue) * 160;
                          return (
                            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                              <div style={{
                                background: 'linear-gradient(to top, #19c37d, #34d399)',
                                height: `${height}px`,
                                width: '100%',
                                borderRadius: '4px 4px 0 0',
                                marginBottom: '8px',
                                minHeight: '4px'
                              }}></div>
                              <div style={{ fontSize: '12px', color: '#B0B0B0' }}>
                                {getChartData().labels[index]}
                              </div>
                              <div style={{ fontSize: '10px', color: '#19c37d', fontWeight: 'bold' }}>
                                {(value / 1000000).toFixed(1)}M
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Detailed Data Table */}
                  <div style={{
                    background: 'rgba(26, 32, 44, 0.8)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '18px' }}>
                      📋 Chi tiết theo ngày
                    </h3>
                    
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                          <tr>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Ngày
                            </th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Số lần swap
                            </th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Doanh thu
                            </th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Pin hỏng
                            </th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#E0E0E0', fontSize: '14px', fontWeight: 'bold' }}>
                              Doanh thu/swap
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredReports().map((stat, index) => (
                            <tr key={stat.date} style={{ 
                              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                              background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                            }}>
                              <td style={{ padding: '12px', color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold' }}>
                                {new Date(stat.date).toLocaleDateString('vi-VN')}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center', color: '#3b82f6', fontSize: '14px', fontWeight: 'bold' }}>
                                {stat.swaps}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center', color: '#19c37d', fontSize: '14px', fontWeight: 'bold' }}>
                                {formatCurrency(stat.revenue)}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center', color: '#ef4444', fontSize: '14px', fontWeight: 'bold' }}>
                                {stat.brokenBatteries}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'center', color: '#6ab7ff', fontSize: '14px', fontWeight: 'bold' }}>
                                {formatCurrency(stat.swaps > 0 ? stat.revenue / stat.swaps : 0)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Back to Dashboard Button */}
              {dashboardTab !== 'home' && (
                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                  <button 
                    onClick={() => setDashboardTab('home')}
                    style={{
                      background: 'linear-gradient(135deg, #19c37d, #16a085)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(25, 195, 125, 0.3)'
                    }}
                  >
                    ← Quay lại Dashboard
                  </button>
                </div>
              )}

              {/* Battery Detail Modal */}
              {showBatteryModal && selectedBattery && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                  backdropFilter: 'blur(5px)'
                }}>
                  <div style={{
                    background: 'rgba(26, 32, 44, 0.95)',
                    borderRadius: '16px',
                    padding: '30px',
                    maxWidth: '600px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h2 style={{ color: '#FFFFFF', margin: 0, fontSize: '20px' }}>
                        🔋 Chi tiết pin {selectedBattery.id}
                      </h2>
                      <button
                        onClick={() => {
                          setShowBatteryModal(false);
                          setSelectedBattery(null);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#B0B0B0',
                          fontSize: '24px',
                          cursor: 'pointer',
                          padding: '5px',
                          borderRadius: '50%',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                          e.target.style.color = '#FFFFFF';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#B0B0B0';
                        }}
                      >
                        ×
                      </button>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          padding: '15px'
                        }}>
                          <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Model</div>
                          <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' }}>
                            {selectedBattery.model}
                          </div>
                        </div>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          padding: '15px'
                        }}>
                          <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Capacity</div>
                          <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' }}>
                            {selectedBattery.capacity} Ah
                          </div>
                        </div>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          padding: '15px'
                        }}>
                          <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>SOH</div>
                          <div style={{ 
                            color: getSOHColor(selectedBattery.soh), 
                            fontSize: '16px', 
                            fontWeight: 'bold' 
                          }}>
                            {selectedBattery.soh}%
                          </div>
                        </div>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          padding: '15px'
                        }}>
                          <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Status</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              background: `${getStatusColor(selectedBattery.status)}20`,
                              color: getStatusColor(selectedBattery.status),
                              fontSize: '12px',
                              fontWeight: 'bold',
                              border: `1px solid ${getStatusColor(selectedBattery.status)}40`
                            }}>
                              {getStatusIcon(selectedBattery.status)} {selectedBattery.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '15px',
                        marginBottom: '20px'
                      }}>
                        <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Location</div>
                        <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' }}>
                          {selectedBattery.location}
                        </div>
                      </div>

                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '15px',
                        marginBottom: '20px'
                      }}>
                        <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Last Maintenance</div>
                        <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' }}>
                          {selectedBattery.lastMaintenance}
                        </div>
                      </div>

                      {/* Status Update Section */}
                      <div style={{
                        background: 'rgba(25, 195, 125, 0.1)',
                        borderRadius: '8px',
                        padding: '15px',
                        border: '1px solid rgba(25, 195, 125, 0.3)'
                      }}>
                        <h4 style={{ color: '#19c37d', marginBottom: '15px', fontSize: '16px' }}>
                          🔄 Cập nhật trạng thái
                        </h4>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          {['Full', 'Charging', 'Maintenance', 'Error'].map(status => (
                            <button
                              key={status}
                              onClick={() => {
                                updateBatteryStatus(selectedBattery.id, status, `Status changed to ${status}`);
                                setShowBatteryModal(false);
                                setSelectedBattery(null);
                              }}
                              disabled={status === selectedBattery.status}
                              style={{
                                padding: '8px 16px',
                                borderRadius: '6px',
                                border: 'none',
                                background: status === selectedBattery.status ? 'rgba(255, 255, 255, 0.1)' : '#19c37d',
                                color: status === selectedBattery.status ? '#B0B0B0' : '#FFFFFF',
                                cursor: status === selectedBattery.status ? 'not-allowed' : 'pointer',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                transition: 'all 0.3s ease',
                                opacity: status === selectedBattery.status ? 0.5 : 1
                              }}
                              onMouseEnter={(e) => {
                                if (status !== selectedBattery.status) {
                                  e.target.style.background = '#16a085';
                                  e.target.style.transform = 'translateY(-1px)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (status !== selectedBattery.status) {
                                  e.target.style.background = '#19c37d';
                                  e.target.style.transform = 'translateY(0)';
                                }
                              }}
                            >
                              {getStatusIcon(status)} {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Swap Request Detail Modal */}
              {showSwapModal && selectedSwapRequest && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                  backdropFilter: 'blur(5px)'
                }}>
                  <div style={{
                    background: 'rgba(26, 32, 44, 0.95)',
                    borderRadius: '16px',
                    padding: '30px',
                    maxWidth: '700px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h2 style={{ color: '#FFFFFF', margin: 0, fontSize: '20px' }}>
                        🔄 Chi tiết yêu cầu đổi pin {selectedSwapRequest.id}
                      </h2>
                      <button
                        onClick={() => {
                          setShowSwapModal(false);
                          setSelectedSwapRequest(null);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#B0B0B0',
                          fontSize: '24px',
                          cursor: 'pointer',
                          padding: '5px',
                          borderRadius: '50%',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                          e.target.style.color = '#FFFFFF';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#B0B0B0';
                        }}
                      >
                        ×
                      </button>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      {/* Driver Information */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '20px'
                      }}>
                        <h3 style={{ color: '#FFFFFF', marginBottom: '15px', fontSize: '16px' }}>
                          👤 Thông tin driver
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Tên</div>
                            <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedSwapRequest.driverName}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Số điện thoại</div>
                            <div style={{ color: '#6ab7ff', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedSwapRequest.driverPhone}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Email</div>
                            <div style={{ color: '#6ab7ff', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedSwapRequest.driverId}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Thời gian yêu cầu</div>
                            <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedSwapRequest.requestTime}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Battery Swap Information */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '20px'
                      }}>
                        <h3 style={{ color: '#FFFFFF', marginBottom: '15px', fontSize: '16px' }}>
                          🔋 Thông tin đổi pin
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                          <div>
                            <h4 style={{ color: '#ef4444', marginBottom: '10px', fontSize: '14px' }}>Pin cũ (trả về)</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                              <div>
                                <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>ID</div>
                                <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: 'bold' }}>
                                  {selectedSwapRequest.batteryOld}
                                </div>
                              </div>
                              <div>
                                <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Model</div>
                                <div style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold' }}>
                                  {selectedSwapRequest.batteryOldModel}
                                </div>
                              </div>
                              <div>
                                <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>SOH</div>
                                <div style={{ 
                                  color: getSOHColor(selectedSwapRequest.batteryOldSOH), 
                                  fontSize: '14px', 
                                  fontWeight: 'bold' 
                                }}>
                                  {selectedSwapRequest.batteryOldSOH}%
                                </div>
                              </div>
                              <div>
                                <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Vị trí</div>
                                <div style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold' }}>
                                  {selectedSwapRequest.batteryOldLocation}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 style={{ color: '#19c37d', marginBottom: '10px', fontSize: '14px' }}>Pin mới (lấy về)</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                              <div>
                                <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>ID</div>
                                <div style={{ color: '#19c37d', fontSize: '14px', fontWeight: 'bold' }}>
                                  {selectedSwapRequest.batteryNew}
                                </div>
                              </div>
                              <div>
                                <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Model</div>
                                <div style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold' }}>
                                  {selectedSwapRequest.batteryNewModel}
                                </div>
                              </div>
                              <div>
                                <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>SOH</div>
                                <div style={{ 
                                  color: getSOHColor(selectedSwapRequest.batteryNewSOH), 
                                  fontSize: '14px', 
                                  fontWeight: 'bold' 
                                }}>
                                  {selectedSwapRequest.batteryNewSOH}%
                                </div>
                              </div>
                              <div>
                                <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Vị trí</div>
                                <div style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold' }}>
                                  {selectedSwapRequest.batteryNewLocation}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div style={{
                        background: 'rgba(25, 195, 125, 0.1)',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '20px',
                        border: '1px solid rgba(25, 195, 125, 0.3)'
                      }}>
                        <h3 style={{ color: '#19c37d', marginBottom: '15px', fontSize: '16px' }}>
                          💰 Thông tin thanh toán
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Số tiền</div>
                            <div style={{ color: '#19c37d', fontSize: '18px', fontWeight: 'bold' }}>
                              {formatCurrency(selectedSwapRequest.amount)}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Phương thức</div>
                            <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedSwapRequest.paymentMethod}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Thời gian ước tính</div>
                            <div style={{ color: '#6ab7ff', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedSwapRequest.estimatedDuration}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{
                        display: 'flex',
                        gap: '15px',
                        justifyContent: 'center',
                        marginTop: '20px'
                      }}>
                        <button
                          onClick={() => {
                            confirmSwap(selectedSwapRequest.id);
                            setShowSwapModal(false);
                            setSelectedSwapRequest(null);
                          }}
                          style={{
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #19c37d, #16a085)',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(25, 195, 125, 0.3)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(25, 195, 125, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(25, 195, 125, 0.3)';
                          }}
                        >
                          ✅ Xác nhận đổi pin
                        </button>
                        <button
                          onClick={() => {
                            rejectSwap(selectedSwapRequest.id);
                            setShowSwapModal(false);
                            setSelectedSwapRequest(null);
                          }}
                          style={{
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
                          }}
                        >
                          ❌ Từ chối
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Swap Confirm Detail Modal */}
              {showSwapConfirmModal && selectedSwapConfirm && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                  backdropFilter: 'blur(5px)'
                }}>
                  <div style={{
                    background: 'rgba(26, 32, 44, 0.95)',
                    borderRadius: '16px',
                    padding: '30px',
                    maxWidth: '700px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h2 style={{ color: '#FFFFFF', margin: 0, fontSize: '20px' }}>
                        ✅ Chi tiết yêu cầu đổi pin {selectedSwapConfirm.id}
                      </h2>
                      <button
                        onClick={() => {
                          setShowSwapConfirmModal(false);
                          setSelectedSwapConfirm(null);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#B0B0B0',
                          fontSize: '24px',
                          cursor: 'pointer',
                          padding: '5px',
                          borderRadius: '50%',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                          e.target.style.color = '#FFFFFF';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#B0B0B0';
                        }}
                      >
                        ×
                      </button>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      {/* Request Overview */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '20px'
                      }}>
                        <h3 style={{ color: '#FFFFFF', marginBottom: '15px', fontSize: '16px' }}>
                          📋 Thông tin yêu cầu
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Request ID</div>
                            <div style={{ color: '#6ab7ff', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedSwapConfirm.id}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Thời gian yêu cầu</div>
                            <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedSwapConfirm.requestTime}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Thời lượng ước tính</div>
                            <div style={{ color: '#6ab7ff', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedSwapConfirm.estimatedDuration}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Vị trí</div>
                            <div style={{ color: '#19c37d', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedSwapConfirm.location}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Driver Information */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '20px'
                      }}>
                        <h3 style={{ color: '#FFFFFF', marginBottom: '15px', fontSize: '16px' }}>
                          👤 Thông tin driver
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Tên</div>
                            <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedSwapConfirm.driverName}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Số điện thoại</div>
                            <div style={{ color: '#6ab7ff', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedSwapConfirm.driverPhone}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Email</div>
                            <div style={{ color: '#6ab7ff', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedSwapConfirm.driverId}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Biển số xe</div>
                            <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedSwapConfirm.licensePlate}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Dòng xe</div>
                            <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedSwapConfirm.vehicleModel}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Battery Information */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '20px'
                      }}>
                        <h3 style={{ color: '#FFFFFF', marginBottom: '15px', fontSize: '16px' }}>
                          🔋 Thông tin pin
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                          <div>
                            <h4 style={{ color: '#ef4444', marginBottom: '10px', fontSize: '14px' }}>Pin cũ (trả về)</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                              <div>
                                <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>ID</div>
                                <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: 'bold' }}>
                                  {selectedSwapConfirm.batteryOld}
                                </div>
                              </div>
                              <div>
                                <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Model</div>
                                <div style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold' }}>
                                  {selectedSwapConfirm.batteryOldModel}
                                </div>
                              </div>
                              <div>
                                <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>SOH</div>
                                <div style={{ 
                                  color: getSOHColor(selectedSwapConfirm.batteryOldSOH), 
                                  fontSize: '14px', 
                                  fontWeight: 'bold' 
                                }}>
                                  {selectedSwapConfirm.batteryOldSOH}%
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 style={{ color: '#19c37d', marginBottom: '10px', fontSize: '14px' }}>Pin mới (lấy đi)</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                              <div>
                                <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>ID</div>
                                <div style={{ color: '#19c37d', fontSize: '14px', fontWeight: 'bold' }}>
                                  {selectedSwapConfirm.batteryNew}
                                </div>
                              </div>
                              <div>
                                <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Model</div>
                                <div style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold' }}>
                                  {selectedSwapConfirm.batteryNewModel}
                                </div>
                              </div>
                              <div>
                                <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>SOH</div>
                                <div style={{ 
                                  color: getSOHColor(selectedSwapConfirm.batteryNewSOH), 
                                  fontSize: '14px', 
                                  fontWeight: 'bold' 
                                }}>
                                  {selectedSwapConfirm.batteryNewSOH}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{
                        background: 'rgba(25, 195, 125, 0.1)',
                        borderRadius: '8px',
                        padding: '20px',
                        border: '1px solid rgba(25, 195, 125, 0.3)',
                        display: 'flex',
                        gap: '15px',
                        justifyContent: 'center'
                      }}>
                        <button
                          onClick={() => {
                            confirmSwapRequest(selectedSwapConfirm.id);
                            setShowSwapConfirmModal(false);
                            setSelectedSwapConfirm(null);
                          }}
                          style={{
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#19c37d',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#16a085';
                            e.target.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = '#19c37d';
                            e.target.style.transform = 'translateY(0)';
                          }}
                        >
                          ✅ Xác nhận đổi pin
                        </button>
                        <button
                          onClick={() => {
                            rejectSwapRequest(selectedSwapConfirm.id);
                            setShowSwapConfirmModal(false);
                            setSelectedSwapConfirm(null);
                          }}
                          style={{
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#ef4444',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#dc2626';
                            e.target.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = '#ef4444';
                            e.target.style.transform = 'translateY(0)';
                          }}
                        >
                          ❌ Từ chối yêu cầu
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Issue Detail Modal */}
              {showIssueModal && selectedIssue && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                  backdropFilter: 'blur(5px)'
                }}>
                  <div style={{
                    background: 'rgba(26, 32, 44, 0.95)',
                    borderRadius: '16px',
                    padding: '30px',
                    maxWidth: '700px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h2 style={{ color: '#FFFFFF', margin: 0, fontSize: '20px' }}>
                        🚨 Chi tiết sự cố {selectedIssue.id}
                      </h2>
                      <button
                        onClick={() => {
                          setShowIssueModal(false);
                          setSelectedIssue(null);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#B0B0B0',
                          fontSize: '24px',
                          cursor: 'pointer',
                          padding: '5px',
                          borderRadius: '50%',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                          e.target.style.color = '#FFFFFF';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#B0B0B0';
                        }}
                      >
                        ×
                      </button>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      {/* Issue Overview */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '20px'
                      }}>
                        <h3 style={{ color: '#FFFFFF', marginBottom: '15px', fontSize: '16px' }}>
                          📋 Thông tin sự cố
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Issue ID</div>
                            <div style={{ color: '#6ab7ff', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedIssue.id}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Danh mục</div>
                            <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedIssue.category}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Ưu tiên</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                background: `${getPriorityColor(selectedIssue.priority)}20`,
                                color: getPriorityColor(selectedIssue.priority),
                                fontSize: '12px',
                                fontWeight: 'bold',
                                border: `1px solid ${getPriorityColor(selectedIssue.priority)}40`
                              }}>
                                {getPriorityIcon(selectedIssue.priority)} {selectedIssue.priority}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Trạng thái</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                background: `${getIssueStatusColor(selectedIssue.status)}20`,
                                color: getIssueStatusColor(selectedIssue.status),
                                fontSize: '12px',
                                fontWeight: 'bold',
                                border: `1px solid ${getIssueStatusColor(selectedIssue.status)}40`
                              }}>
                                {getIssueStatusIcon(selectedIssue.status)} {selectedIssue.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Driver Information */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '20px'
                      }}>
                        <h3 style={{ color: '#FFFFFF', marginBottom: '15px', fontSize: '16px' }}>
                          👤 Thông tin driver
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Tên</div>
                            <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedIssue.driverName}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Số điện thoại</div>
                            <div style={{ color: '#6ab7ff', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedIssue.driverPhone}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Email</div>
                            <div style={{ color: '#6ab7ff', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedIssue.driverId}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Vị trí</div>
                            <div style={{ color: '#19c37d', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedIssue.location}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Issue Description */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '20px'
                      }}>
                        <h3 style={{ color: '#FFFFFF', marginBottom: '15px', fontSize: '16px' }}>
                          📝 Mô tả sự cố
                        </h3>
                        <div style={{ marginBottom: '15px' }}>
                          <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Tiêu đề</div>
                          <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                            {selectedIssue.title}
                          </div>
                        </div>
                        <div>
                          <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Chi tiết</div>
                          <div style={{ color: '#E0E0E0', fontSize: '14px', lineHeight: '1.5' }}>
                            {selectedIssue.description}
                          </div>
                        </div>
                      </div>

                      {/* Battery Information */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '20px'
                      }}>
                        <h3 style={{ color: '#FFFFFF', marginBottom: '15px', fontSize: '16px' }}>
                          🔋 Thông tin pin liên quan
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Pin ID</div>
                            <div style={{ color: '#ef4444', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedIssue.batteryId}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Vị trí pin</div>
                            <div style={{ color: '#6ab7ff', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedIssue.location}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Solution Notes */}
                      <div style={{
                        background: 'rgba(25, 195, 125, 0.1)',
                        borderRadius: '8px',
                        padding: '20px',
                        border: '1px solid rgba(25, 195, 125, 0.3)',
                        marginBottom: '20px'
                      }}>
                        <h3 style={{ color: '#19c37d', marginBottom: '15px', fontSize: '16px' }}>
                          💡 Ghi chú xử lý
                        </h3>
                        {selectedIssue.solutionNotes ? (
                          <div style={{ color: '#E0E0E0', fontSize: '14px', lineHeight: '1.5' }}>
                            {selectedIssue.solutionNotes}
                          </div>
                        ) : (
                          <div style={{ color: '#B0B0B0', fontSize: '14px', fontStyle: 'italic' }}>
                            Chưa có ghi chú xử lý
                          </div>
                        )}
                      </div>

                      {/* Timestamps */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '20px'
                      }}>
                        <h3 style={{ color: '#FFFFFF', marginBottom: '15px', fontSize: '16px' }}>
                          ⏰ Thời gian
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Tạo lúc</div>
                            <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedIssue.createdAt}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Cập nhật lần cuối</div>
                            <div style={{ color: '#6ab7ff', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedIssue.updatedAt}
                            </div>
                          </div>
                          {selectedIssue.assignedTo && (
                            <div>
                              <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Được giao cho</div>
                              <div style={{ color: '#19c37d', fontSize: '16px', fontWeight: 'bold' }}>
                                {selectedIssue.assignedTo}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {selectedIssue.status !== 'Done' && (
                        <div style={{
                          background: 'rgba(25, 195, 125, 0.1)',
                          borderRadius: '8px',
                          padding: '20px',
                          border: '1px solid rgba(25, 195, 125, 0.3)',
                          display: 'flex',
                          gap: '15px',
                          justifyContent: 'center'
                        }}>
                          <button
                            onClick={() => {
                              const nextStatus = selectedIssue.status === 'Pending' ? 'In Progress' : 'Done';
                              updateIssueStatus(selectedIssue.id, nextStatus, '');
                              setShowIssueModal(false);
                              setSelectedIssue(null);
                            }}
                            style={{
                              padding: '12px 24px',
                              borderRadius: '8px',
                              border: 'none',
                              background: selectedIssue.status === 'Pending' ? '#3b82f6' : '#19c37d',
                              color: '#FFFFFF',
                              cursor: 'pointer',
                              fontSize: '16px',
                              fontWeight: 'bold',
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = selectedIssue.status === 'Pending' ? '#2563eb' : '#16a085';
                              e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = selectedIssue.status === 'Pending' ? '#3b82f6' : '#19c37d';
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            {selectedIssue.status === 'Pending' ? '🔄 Bắt đầu xử lý' : '✅ Hoàn thành'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Transaction Detail Modal */}
              {showTransactionModal && selectedTransaction && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                  backdropFilter: 'blur(5px)'
                }}>
                  <div style={{
                    background: 'rgba(26, 32, 44, 0.95)',
                    borderRadius: '16px',
                    padding: '30px',
                    maxWidth: '700px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h2 style={{ color: '#FFFFFF', margin: 0, fontSize: '20px' }}>
                        💳 Chi tiết giao dịch {selectedTransaction.id}
                      </h2>
                      <button
                        onClick={() => {
                          setShowTransactionModal(false);
                          setSelectedTransaction(null);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#B0B0B0',
                          fontSize: '24px',
                          cursor: 'pointer',
                          padding: '5px',
                          borderRadius: '50%',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                          e.target.style.color = '#FFFFFF';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#B0B0B0';
                        }}
                      >
                        ×
                      </button>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      {/* Transaction Overview */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '20px'
                      }}>
                        <h3 style={{ color: '#FFFFFF', marginBottom: '15px', fontSize: '16px' }}>
                          📋 Thông tin giao dịch
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Swap ID</div>
                            <div style={{ color: '#6ab7ff', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedTransaction.id}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Thời gian</div>
                            <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedTransaction.swapTime}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Thời lượng</div>
                            <div style={{ color: '#6ab7ff', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedTransaction.duration}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Trạng thái</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                background: `${getPaymentStatusColor(selectedTransaction.paymentStatus)}20`,
                                color: getPaymentStatusColor(selectedTransaction.paymentStatus),
                                fontSize: '12px',
                                fontWeight: 'bold',
                                border: `1px solid ${getPaymentStatusColor(selectedTransaction.paymentStatus)}40`
                              }}>
                                {getPaymentStatusIcon(selectedTransaction.paymentStatus)} {selectedTransaction.paymentStatus}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Driver Information */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '20px'
                      }}>
                        <h3 style={{ color: '#FFFFFF', marginBottom: '15px', fontSize: '16px' }}>
                          👤 Thông tin driver
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Tên</div>
                            <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedTransaction.driverName}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Số điện thoại</div>
                            <div style={{ color: '#6ab7ff', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedTransaction.driverPhone}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Email</div>
                            <div style={{ color: '#6ab7ff', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedTransaction.driverId}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Xử lý bởi</div>
                            <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedTransaction.completedBy}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Battery Information */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '20px'
                      }}>
                        <h3 style={{ color: '#FFFFFF', marginBottom: '15px', fontSize: '16px' }}>
                          🔋 Thông tin pin
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                          <div>
                            <h4 style={{ color: '#ef4444', marginBottom: '10px', fontSize: '14px' }}>Pin cũ</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                              <div>
                                <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>ID</div>
                                <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: 'bold' }}>
                                  {selectedTransaction.batteryOld}
                                </div>
                              </div>
                              <div>
                                <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Model</div>
                                <div style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold' }}>
                                  {selectedTransaction.batteryOldModel}
                                </div>
                              </div>
                              <div>
                                <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>SOH</div>
                                <div style={{ 
                                  color: getSOHColor(selectedTransaction.batteryOldSOH), 
                                  fontSize: '14px', 
                                  fontWeight: 'bold' 
                                }}>
                                  {selectedTransaction.batteryOldSOH}%
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 style={{ color: '#19c37d', marginBottom: '10px', fontSize: '14px' }}>Pin mới</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                              <div>
                                <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>ID</div>
                                <div style={{ color: '#19c37d', fontSize: '14px', fontWeight: 'bold' }}>
                                  {selectedTransaction.batteryNew}
                                </div>
                              </div>
                              <div>
                                <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Model</div>
                                <div style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold' }}>
                                  {selectedTransaction.batteryNewModel}
                                </div>
                              </div>
                              <div>
                                <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>SOH</div>
                                <div style={{ 
                                  color: getSOHColor(selectedTransaction.batteryNewSOH), 
                                  fontSize: '14px', 
                                  fontWeight: 'bold' 
                                }}>
                                  {selectedTransaction.batteryNewSOH}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(106, 183, 255, 0.1)', borderRadius: '6px' }}>
                          <div style={{ color: '#6ab7ff', fontSize: '12px', fontWeight: 'bold' }}>
                            📍 Vị trí: {selectedTransaction.location}
                          </div>
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div style={{
                        background: 'rgba(25, 195, 125, 0.1)',
                        borderRadius: '8px',
                        padding: '20px',
                        border: '1px solid rgba(25, 195, 125, 0.3)'
                      }}>
                        <h3 style={{ color: '#19c37d', marginBottom: '15px', fontSize: '16px' }}>
                          💰 Thông tin thanh toán
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Số tiền</div>
                            <div style={{ color: '#19c37d', fontSize: '18px', fontWeight: 'bold' }}>
                              {formatCurrency(selectedTransaction.amount)}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#B0B0B0', fontSize: '12px', marginBottom: '5px' }}>Phương thức</div>
                            <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 'bold' }}>
                              {selectedTransaction.paymentMethod}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Admin Dashboard with Navigation Tabs
    if (currentUser.role === 'admin') {
      return (
        <div className="dashboard active">
          <DashboardHeader />
          
          {/* Navigation Tabs */}
          <div className="dashboard-nav">
            <div className="container">
              <nav className="nav-tabs">
                <button
                  className={`nav-tab ${dashboardTab === 'home' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('home')}
                >
                  <span>⚙️</span> Dashboard
                </button>
                <button
                  className={`nav-tab ${dashboardTab === 'admin-users' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('admin-users')}
                >
                  <span>👥</span> Danh sách
                </button>
                <button
                  className={`nav-tab ${dashboardTab === 'admin-batteries' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('admin-batteries')}
                >
                  <span>🔋</span> Kho pin
                </button>
                <button
                  className={`nav-tab ${dashboardTab === 'admin-contracts' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('admin-contracts')}
                >
                  <span>💳</span> Giao dịch
                </button>
                <button
                  className={`nav-tab ${dashboardTab === 'admin-stations' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('admin-stations')}
                >
                  <span>🏪</span> Trạm
                </button>
                <button
                  className={`nav-tab ${dashboardTab === 'admin-reports' ? 'active' : ''}`}
                  onClick={() => setDashboardTab('admin-reports')}
                >
                  <span>📊</span> Báo cáo
                </button>
              </nav>
            </div>
          </div>

          <div className="container">
            <div className="tab-content-wrapper">
              
              {/* Home Tab - Dashboard Overview */}
              <div className={`tab-content ${dashboardTab === 'home' ? 'active' : ''}`}>
                <div style={{ padding: '20px', minHeight: '100vh' }}>
                  {/* Hero Section */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(25, 195, 125, 0.1), rgba(106, 183, 255, 0.1))',
                    borderRadius: '20px',
                    padding: '40px',
                    marginBottom: '30px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Background Pattern */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `
                        radial-gradient(circle at 20% 80%, rgba(25, 195, 125, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(106, 183, 255, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(255, 165, 0, 0.05) 0%, transparent 50%)
                      `,
                      zIndex: 0
                    }} />
                    
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                          <h1 style={{ 
                            margin: 0, 
                            color: '#FFFFFF', 
                            fontSize: '2.5rem', 
                            fontWeight: '700',
                            background: 'linear-gradient(135deg, #19c37d, #6ab7ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}>
                            ⚙️ Dashboard Quản trị
                          </h1>
                          <p style={{ 
                            margin: '10px 0 0 0', 
                            color: '#B0B0B0', 
                            fontSize: '1.1rem',
                            fontWeight: '400'
                          }}>
                            Chào mừng bạn đến với hệ thống quản lý pin EV
                          </p>
                        </div>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '15px',
                          padding: '15px 25px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          textAlign: 'center'
                        }}>
                          <div style={{ color: '#19c37d', fontSize: '1.1rem', fontWeight: '600' }}>
                            {new Date().toLocaleDateString('vi-VN')}
                          </div>
                          <div style={{ color: '#6ab7ff', fontSize: '1.4rem', fontWeight: '700' }}>
                            {new Date().toLocaleTimeString('vi-VN')}
                          </div>
                        </div>
                      </div>
                      
                      {/* Quick Stats Overview */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                        gap: '15px',
                        marginTop: '20px'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: '#19c37d', fontSize: '1.8rem', fontWeight: '700' }}>1,248</div>
                          <div style={{ color: '#E0E0E0', fontSize: '0.9rem' }}>Người dùng</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: '#6ab7ff', fontSize: '1.8rem', fontWeight: '700' }}>500</div>
                          <div style={{ color: '#E0E0E0', fontSize: '0.9rem' }}>Pin</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: '#ffa500', fontSize: '1.8rem', fontWeight: '700' }}>25</div>
                          <div style={{ color: '#E0E0E0', fontSize: '0.9rem' }}>Trạm</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: '#ff6b6b', fontSize: '1.8rem', fontWeight: '700' }}>3,456</div>
                          <div style={{ color: '#E0E0E0', fontSize: '0.9rem' }}>Giao dịch</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ color: '#4ecdc4', fontSize: '1.8rem', fontWeight: '700' }}>2.5M VND</div>
                          <div style={{ color: '#E0E0E0', fontSize: '0.9rem' }}>Doanh thu</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Stats Cards */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '25px',
                    marginBottom: '30px'
                  }}>
                    {/* Users Card */}
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(25, 195, 125, 0.1), rgba(25, 195, 125, 0.05))',
                      borderRadius: '20px',
                      padding: '30px',
                      border: '1px solid rgba(25, 195, 125, 0.2)',
                      backdropFilter: 'blur(10px)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-20px',
                        right: '-20px',
                        width: '100px',
                        height: '100px',
                        background: 'linear-gradient(135deg, rgba(25, 195, 125, 0.2), rgba(25, 195, 125, 0.1))',
                        borderRadius: '50%',
                        filter: 'blur(20px)'
                      }} />
                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                          <div style={{
                            padding: '15px',
                            borderRadius: '15px',
                            background: 'linear-gradient(135deg, #19c37d, #15a36a)',
                            fontSize: '2rem',
                            boxShadow: '0 10px 30px rgba(25, 195, 125, 0.3)'
                          }}>
                            👥
                          </div>
                          <div>
                            <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.3rem' }}>Người dùng</h3>
                            <p style={{ margin: 0, color: '#B0B0B0', fontSize: '0.9rem' }}>Quản lý tài khoản</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#19c37d' }}>1,248</div>
                            <div style={{ fontSize: '0.9rem', color: '#19c37d' }}>1,156 hoạt động</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ color: '#19c37d', fontSize: '1.2rem' }}>+12.5%</div>
                            <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>vs tháng trước</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Batteries Card */}
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(106, 183, 255, 0.1), rgba(106, 183, 255, 0.05))',
                      borderRadius: '20px',
                      padding: '30px',
                      border: '1px solid rgba(106, 183, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-20px',
                        right: '-20px',
                        width: '100px',
                        height: '100px',
                        background: 'linear-gradient(135deg, rgba(106, 183, 255, 0.2), rgba(106, 183, 255, 0.1))',
                        borderRadius: '50%',
                        filter: 'blur(20px)'
                      }} />
                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                          <div style={{
                            padding: '15px',
                            borderRadius: '15px',
                            background: 'linear-gradient(135deg, #6ab7ff, #4a9eff)',
                            fontSize: '2rem',
                            boxShadow: '0 10px 30px rgba(106, 183, 255, 0.3)'
                          }}>
                            🔋
                          </div>
                          <div>
                            <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.3rem' }}>Kho pin</h3>
                            <p style={{ margin: 0, color: '#B0B0B0', fontSize: '0.9rem' }}>Quản lý pin EV</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#6ab7ff' }}>500</div>
                            <div style={{ fontSize: '0.9rem', color: '#6ab7ff' }}>456 sẵn sàng</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ color: '#6ab7ff', fontSize: '1.2rem' }}>+8.3%</div>
                            <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>vs tháng trước</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Revenue Card */}
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(255, 165, 0, 0.05))',
                      borderRadius: '20px',
                      padding: '30px',
                      border: '1px solid rgba(255, 165, 0, 0.2)',
                      backdropFilter: 'blur(10px)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-20px',
                        right: '-20px',
                        width: '100px',
                        height: '100px',
                        background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.2), rgba(255, 165, 0, 0.1))',
                        borderRadius: '50%',
                        filter: 'blur(20px)'
                      }} />
                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                          <div style={{
                            padding: '15px',
                            borderRadius: '15px',
                            background: 'linear-gradient(135deg, #ffa500, #e6940b)',
                            fontSize: '2rem',
                            boxShadow: '0 10px 30px rgba(255, 165, 0, 0.3)'
                          }}>
                            💰
                          </div>
                          <div>
                            <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.3rem' }}>Doanh thu</h3>
                            <p style={{ margin: 0, color: '#B0B0B0', fontSize: '0.9rem' }}>Tháng này</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ffa500' }}>2.5M</div>
                            <div style={{ fontSize: '0.9rem', color: '#ffa500' }}>3,456 giao dịch</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ color: '#ffa500', fontSize: '1.2rem' }}>+15.7%</div>
                            <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>vs tháng trước</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Timeline & Charts Section */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '25px',
                    marginBottom: '30px'
                  }}>
                    {/* Recent Activities */}
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '20px',
                      padding: '30px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <h3 style={{ 
                        color: '#FFFFFF', 
                        marginBottom: '25px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        fontSize: '1.3rem'
                      }}>
                        🕒 Hoạt động gần đây
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {[
                          { icon: '👤', text: 'Nguyen Van A đã đăng ký tài khoản', time: '2 phút trước', color: '#19c37d' },
                          { icon: '🔋', text: 'Đổi pin tại Trạm Quận 1', time: '5 phút trước', color: '#6ab7ff' },
                          { icon: '💳', text: 'Tran Thi B thanh toán 50,000 VND', time: '8 phút trước', color: '#ffa500' },
                          { icon: '👨‍💼', text: 'Staff Nguyen C đã đăng nhập', time: '12 phút trước', color: '#9c88ff' },
                          { icon: '🔧', text: 'Bảo trì pin BAT-001', time: '15 phút trước', color: '#ff6b6b' }
                        ].map((activity, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            padding: '15px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.3s ease'
                          }}>
                            <div style={{
                              fontSize: '1.5rem',
                              padding: '10px',
                              borderRadius: '10px',
                              background: `${activity.color}20`,
                              border: `1px solid ${activity.color}40`
                            }}>
                              {activity.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ color: '#FFFFFF', fontSize: '0.95rem', marginBottom: '2px' }}>
                                {activity.text}
                              </div>
                              <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>{activity.time}</div>
                            </div>
                            <div style={{
                              width: '4px',
                              height: '30px',
                              background: activity.color,
                              borderRadius: '2px'
                            }} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Stats Chart */}
                    <div style={{
                      background: 'rgba(26, 32, 44, 0.8)',
                      borderRadius: '20px',
                      padding: '30px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <h3 style={{ 
                        color: '#FFFFFF', 
                        marginBottom: '25px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        fontSize: '1.3rem'
                      }}>
                        📈 Thống kê hệ thống
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {[
                          { label: 'Tỷ lệ sử dụng trạm', value: 75, color: '#19c37d' },
                          { label: 'Hiệu suất pin', value: 92, color: '#6ab7ff' },
                          { label: 'Hài lòng khách hàng', value: 88, color: '#ffa500' },
                          { label: 'Thời gian phản hồi', value: 95, color: '#9c88ff' },
                          { label: 'Độ tin cậy hệ thống', value: 99, color: '#4ecdc4' }
                        ].map((stat, index) => (
                          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ minWidth: '140px', color: '#E0E0E0', fontSize: '14px' }}>
                              {stat.label}
                            </div>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                flex: 1,
                                height: '8px',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '4px',
                                overflow: 'hidden'
                              }}>
                                <div
                                  style={{
                                    width: `${stat.value}%`,
                                    height: '100%',
                                    background: `linear-gradient(90deg, ${stat.color}, ${stat.color}dd)`,
                                    borderRadius: '4px',
                                    transition: 'all 0.3s ease'
                                  }}
                                />
                              </div>
                              <span style={{
                                color: stat.color,
                                fontSize: '14px',
                                fontWeight: '600',
                                minWidth: '35px'
                              }}>
                                {stat.value}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div style={{
                    background: 'rgba(26, 32, 44, 0.8)',
                    borderRadius: '20px',
                    padding: '30px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <h3 style={{ 
                      color: '#FFFFFF', 
                      marginBottom: '25px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px',
                      fontSize: '1.3rem'
                    }}>
                      ⚡ Thao tác nhanh
                    </h3>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                      gap: '20px' 
                    }}>
                      {[
                        { icon: '👥', title: 'Thêm người dùng mới', desc: 'Tạo tài khoản cho khách hàng', color: '#19c37d', action: () => setDashboardTab('admin-users') },
                        { icon: '🔋', title: 'Nhập pin mới', desc: 'Thêm pin vào kho hàng', color: '#6ab7ff', action: () => setDashboardTab('admin-batteries') },
                        { icon: '🏪', title: 'Tạo trạm mới', desc: 'Thiết lập trạm đổi pin', color: '#ffa500', action: () => setDashboardTab('admin-stations') },
                        { icon: '📊', title: 'Xuất báo cáo', desc: 'Tạo báo cáo doanh thu', color: '#ff6b6b', action: () => setDashboardTab('admin-reports') },
                        { icon: '�', title: 'Quản lý giao dịch', desc: 'Xem và quản lý hợp đồng', color: '#9c88ff', action: () => setDashboardTab('admin-contracts') },
                        { icon: '�', title: 'Bảo trì hệ thống', desc: 'Kiểm tra và bảo trì', color: '#4ecdc4', action: () => alert('Tính năng đang phát triển') }
                      ].map((action, index) => (
                        <button
                          key={index}
                          onClick={action.action}
                          style={{
                            background: `linear-gradient(135deg, ${action.color}20, ${action.color}10)`,
                            border: `1px solid ${action.color}40`,
                            borderRadius: '15px',
                            padding: '20px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            textAlign: 'left'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = `0 10px 30px ${action.color}30`;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{
                              fontSize: '2rem',
                              padding: '12px',
                              borderRadius: '12px',
                              background: `${action.color}30`
                            }}>
                              {action.icon}
                            </div>
                            <div>
                              <div style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '600', marginBottom: '5px' }}>
                                {action.title}
                              </div>
                              <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
                                {action.desc}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Users Tab */}
              <div className={`tab-content ${dashboardTab === 'admin-users' ? 'active' : ''}`}>
                <AdminUsers />
              </div>

              {/* Admin Batteries Tab */}
              <div className={`tab-content ${dashboardTab === 'admin-batteries' ? 'active' : ''}`}>
                <AdminBatteries />
              </div>

              {/* Admin Contracts Tab */}
              <div className={`tab-content ${dashboardTab === 'admin-contracts' ? 'active' : ''}`}>
                <AdminContracts />
              </div>

              {/* Admin Stations Tab */}
              <div className={`tab-content ${dashboardTab === 'admin-stations' ? 'active' : ''}`}>
                <AdminStations />
              </div>

              {/* Admin Reports Tab */}
              <div className={`tab-content ${dashboardTab === 'admin-reports' ? 'active' : ''}`}>
                <AdminReports />
              </div>

            </div>
          </div>
        </div>
      );
    }
  };

  // Payment Modal Component
  const PaymentModal = () => {
    if (!showPaymentModal) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '500px',
          width: '90%',
          border: '2px solid #19c37d',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
        }}>
          {paymentStep === 1 && (
            <div>
              <div style={{textAlign: 'center', marginBottom: '30px'}}>
                <h2 style={{color: 'white', margin: '0 0 10px 0'}}>💳 Thanh toán</h2>
                <p style={{color: '#888', margin: '0'}}>Chọn</p>
              </div>

              <div style={{marginBottom: '30px'}}>
                <div 
                  className="card"
                  style={{
                    padding: '20px',
                    marginBottom: '16px',
                    cursor: 'pointer',
                    border: selectedPaymentMethod === 'credit' ? '2px solid #19c37d' : '1px solid rgba(255,255,255,0.1)',
                    background: selectedPaymentMethod === 'credit' ? 'rgba(25, 195, 125, 0.1)' : 'rgba(255,255,255,0.05)'
                  }}
                  onClick={() => setSelectedPaymentMethod('credit')}
                >
                  <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                    <div style={{fontSize: '32px'}}>💳</div>
                    <div>
                      <h4 style={{margin: '0', color: 'white'}}>Thẻ tín dụng</h4>
                      <p style={{margin: '0', color: '#888', fontSize: '14px'}}>Visa, Mastercard, JCB</p>
                    </div>
                  </div>
                </div>

                <div 
                  className="card"
                  style={{
                    padding: '20px',
                    cursor: 'pointer',
                    border: selectedPaymentMethod === 'momo' ? '2px solid #19c37d' : '1px solid rgba(255,255,255,0.1)',
                    background: selectedPaymentMethod === 'momo' ? 'rgba(25, 195, 125, 0.1)' : 'rgba(255,255,255,0.05)'
                  }}
                  onClick={() => setSelectedPaymentMethod('momo')}
                >
                  <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                    <div style={{fontSize: '32px'}}>📱</div>
                    <div>
                      <h4 style={{margin: '0', color: 'white'}}>Ví MoMo</h4>
                      <p style={{margin: '0', color: '#888', fontSize: '14px'}}>Thanh toán qua ví điện tử</p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{display: 'flex', gap: '12px'}}>
                <button 
                  className="btn"
                  style={{flex: 1, background: '#666'}}
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPaymentMethod('');
                    setPaymentStep(1);
                  }}
                >
                  Hủy
                </button>
                <button 
                  className="btn btn-primary"
                  style={{flex: 1}}
                  disabled={!selectedPaymentMethod}
                  onClick={() => setPaymentStep(2)}
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          )}

          {paymentStep === 2 && (
            <div>
              <div style={{textAlign: 'center', marginBottom: '30px'}}>
                <h2 style={{color: 'white', margin: '0 0 10px 0'}}>
                  {selectedPaymentMethod === 'credit' ? '💳 Thông tin thẻ' : '📱 Thanh toán MoMo'}
                </h2>
                <p style={{color: '#888', margin: '0'}}>Số tiền: 3,000,000₫</p>
              </div>

              {selectedPaymentMethod === 'credit' && (
                <div style={{marginBottom: '30px'}}>
                  <div className="form-group">
                    <label style={{color: 'white'}}>Số thẻ</label>
                    <input 
                      type="text" 
                      placeholder="1234 5678 9012 3456"
                      style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#2a2a3e', color: 'white'}}
                    />
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px'}}>
                    <div className="form-group">
                      <label style={{color: 'white'}}>Ngày hết hạn</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY"
                        style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#2a2a3e', color: 'white'}}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{color: 'white'}}>CVV</label>
                      <input 
                        type="text" 
                        placeholder="123"
                        style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#2a2a3e', color: 'white'}}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label style={{color: 'white'}}>Tên chủ thẻ</label>
                    <input 
                      type="text" 
                      placeholder="NGUYEN VAN A"
                      style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #333', background: '#2a2a3e', color: 'white'}}
                    />
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'momo' && (
                <div style={{textAlign: 'center', marginBottom: '30px'}}>
                  <div style={{
                    width: '200px',
                    height: '200px',
                    border: '2px dashed #666',
                    borderRadius: '12px',
                    margin: '0 auto 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px'
                  }}>
                    📱
                  </div>
                  <p style={{color: '#888', margin: '0'}}>Mở ứng dụng MoMo và quét mã QR để thanh toán</p>
                </div>
              )}

              <div style={{display: 'flex', gap: '12px'}}>
                <button 
                  className="btn"
                  style={{flex: 1, background: '#666'}}
                  onClick={() => setPaymentStep(1)}
                >
                  Quay lại
                </button>
                <button 
                  className="btn btn-primary"
                  style={{flex: 1}}
                  onClick={() => setPaymentStep(3)}
                >
                  Thanh toán
                </button>
              </div>
            </div>
          )}

          {paymentStep === 3 && (
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '64px', marginBottom: '20px'}}>✅</div>
              <h2 style={{color: '#19c37d', margin: '0 0 16px 0'}}>Thanh toán thành công!</h2>
              <p style={{color: '#888', marginBottom: '30px'}}>
                dịch vụ Premium đã được thanh toán.
              </p>
              
              <div style={{display: 'flex', gap: '12px'}}>
                <button 
                  className="btn"
                  style={{flex: 1, background: '#666'}}
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPaymentMethod('');
                    setPaymentStep(1);
                  }}
                >
                  Đóng
                </button>
                <button 
                  className="btn btn-primary"
                  style={{flex: 1}}
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPaymentMethod('');
                    setPaymentStep(1);
                    setShowContractModal(true);
                    showToast('🎉 Đang mở hợp đồng!', 'success');
                  }}
                >
                  Xem hợp đồng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Contract Modal Component
  const ContractModal = () => {
    if (!showContractModal) return null;

    const contractData = {
      contractNumber: 'HD-2024-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      signDate: new Date().toLocaleDateString('vi-VN'),
      effectiveDate: new Date().toLocaleDateString('vi-VN'),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
      customerInfo: {
        name: currentUser?.name || 'Nguyễn Văn A',
        email: currentUser?.email || 'customer@example.com',
        phone: '0901234567',
        address: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
        idNumber: '079123456789',
        licensePlate: vehicleData.licensePlate,
        vehicleModel: vehicleData.model,
        vehicleName: vehicleData.vehicleName || 'N/A'
      },
      planInfo: {
        name: subscriptionData.plan,
        price: subscriptionData.monthlyFee,
        distanceLimit: subscriptionData.distanceLimit,
        features: [
          typeof subscriptionData.distanceLimit === 'string' ? 'Không giới hạn quãng đường' : `${subscriptionData.distanceLimit} km/tháng`,
          'Hỗ trợ VIP 24/7',
          'Đặt trước trạm đổi pin',
          'Phân tích chi tiết',
          'Xe thay thế khẩn cấp',
          'Bảo hiểm pin toàn diện'
        ]
      }
    };

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1001,
        padding: '20px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          borderRadius: '16px',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'auto',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
        }}>
          {/* Header */}
          <div style={{
            padding: '24px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{margin: '0', color: 'white', fontSize: '24px'}}>📋 Hợp đồng dịch vụ</h2>
              <p style={{margin: '4px 0 0 0', color: 'rgba(255,255,255,0.6)'}}>
                Mã hợp đồng: {contractData.contractNumber}
              </p>
            </div>
            <button 
              onClick={() => setShowContractModal(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div style={{padding: '24px'}}>
            {/* Contract Info */}
            <div style={{marginBottom: '32px'}}>
              <h3 style={{color: 'white', marginBottom: '16px'}}>📄 Thông tin hợp đồng</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                padding: '16px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '4px'}}>
                    Ngày ký
                  </div>
                  <div style={{color: 'white', fontWeight: '500'}}>
                    {contractData.signDate}
                  </div>
                </div>
                <div>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '4px'}}>
                    Ngày hiệu lực
                  </div>
                  <div style={{color: 'white', fontWeight: '500'}}>
                    {contractData.effectiveDate}
                  </div>
                </div>
                <div>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '4px'}}>
                    Ngày hết hạn
                  </div>
                  <div style={{color: 'white', fontWeight: '500'}}>
                    {contractData.expiryDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div style={{marginBottom: '32px'}}>
              <h3 style={{color: 'white', marginBottom: '16px'}}>👤 Thông tin khách hàng</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
                padding: '16px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '4px'}}>
                    Họ và tên
                  </div>
                  <div style={{color: 'white', fontWeight: '500'}}>
                    {contractData.customerInfo.name}
                  </div>
                </div>
                <div>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '4px'}}>
                    Email
                  </div>
                  <div style={{color: 'white', fontWeight: '500'}}>
                    {contractData.customerInfo.email}
                  </div>
                </div>
                <div>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '4px'}}>
                    Số điện thoại
                  </div>
                  <div style={{color: 'white', fontWeight: '500'}}>
                    {contractData.customerInfo.phone}
                  </div>
                </div>
                <div>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '4px'}}>
                    CCCD/CMND
                  </div>
                  <div style={{color: 'white', fontWeight: '500'}}>
                    {contractData.customerInfo.idNumber}
                  </div>
                </div>
                <div>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '4px'}}>
                    Biển số xe
                  </div>
                  <div style={{color: 'white', fontWeight: '500'}}>
                    {contractData.customerInfo.licensePlate}
                  </div>
                </div>
                <div>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '4px'}}>
                    Loại xe
                  </div>
                  <div style={{color: 'white', fontWeight: '500'}}>
                    {contractData.customerInfo.vehicleModel}
                  </div>
                </div>
                <div style={{gridColumn: '1 / -1'}}>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '4px'}}>
                    Địa chỉ
                  </div>
                  <div style={{color: 'white', fontWeight: '500'}}>
                    {contractData.customerInfo.address}
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Info */}
            <div style={{marginBottom: '32px'}}>
              <h3 style={{color: 'white', marginBottom: '16px'}}>🏆 Thông tin gói dịch vụ</h3>
              <div style={{
                padding: '20px',
                background: 'rgba(25, 195, 125, 0.1)',
                border: '1px solid rgba(25, 195, 125, 0.3)',
                borderRadius: '8px'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                  <h4 style={{color: 'white', margin: '0'}}>Gói {contractData.planInfo.name}</h4>
                  <div style={{color: '#19c37d', fontSize: '24px', fontWeight: 'bold'}}>
                    {contractData.planInfo.price.toLocaleString()}₫/tháng
                  </div>
                </div>
                <div style={{color: 'rgba(255,255,255,0.8)', marginBottom: '16px'}}>
                  Quãng đường: {contractData.planInfo.distanceLimit}
                </div>
                <div>
                  <div style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '8px'}}>
                    Quyền lợi bao gồm:
                  </div>
                  <ul style={{margin: '0', paddingLeft: '20px', color: 'white'}}>
                    {contractData.planInfo.features.map((feature, index) => (
                      <li key={index} style={{marginBottom: '4px'}}>
                        <span style={{color: '#19c37d'}}>✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div style={{marginBottom: '32px'}}>
              <h3 style={{color: 'white', marginBottom: '16px'}}>💳 Lịch sử thanh toán</h3>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 120px 120px',
                  gap: '16px',
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.02)',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: 'rgba(255,255,255,0.7)'
                }}>
                  <div>MÔ TẢ</div>
                  <div>NGÀY</div>
                  <div>SỐ TIỀN</div>
                </div>
                {[
                  { desc: 'Thanh toán gói Premium - Tháng 12/2024', date: 'Dec 20', amount: '3,000,000₫' },
                  { desc: 'Thanh toán gói Premium - Tháng 11/2024', date: 'Nov 20', amount: '3,000,000₫' },
                  { desc: 'Thanh toán gói Premium - Tháng 10/2024', date: 'Oct 20', amount: '3,000,000₫' }
                ].map((payment, index) => (
                  <div key={index} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 120px 120px',
                    gap: '16px',
                    padding: '12px 16px',
                    borderBottom: index < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    fontSize: '14px'
                  }}>
                    <div style={{color: 'white'}}>{payment.desc}</div>
                    <div style={{color: 'rgba(255,255,255,0.7)'}}>{payment.date}</div>
                    <div style={{color: '#19c37d', fontWeight: '500'}}>{payment.amount}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
              <button 
                className="btn"
                style={{background: '#666', padding: '12px 24px'}}
                onClick={() => showToast('📄 Đang tải xuống PDF...', 'info')}
              >
                Tải xuống PDF
              </button>
              <button 
                className="btn btn-primary"
                style={{padding: '12px 24px'}}
                onClick={() => showToast('📧 Đã gửi hợp đồng qua email!', 'success')}
              >
                Gửi qua Email
              </button>
              <button 
                className="btn"
                style={{background: '#666', padding: '12px 24px'}}
                onClick={() => setShowContractModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Vehicle Plan Selection Component
  const VehiclePlanSelection = () => {
    const userVehicles = userVehiclesAndPlans[currentUser?.email] || [];
    
    const handleVehicleAndPlanSelection = (vehicle) => {
      setSelectedVehicle(vehicle);
      setSelectedPlan(vehicle.plan);
      setBatteryData(vehicle.batteryInfo);
      setShowVehiclePlanSelection(false);
      setCurrentView('dashboard');
      showToast(`Đã chọn ${vehicle.vehicleName} với gói ${vehicle.plan.name}!`);
    };

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          border: '2px solid rgba(255,255,255,0.1)'
        }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '32px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <h2 style={{margin: '0 0 12px 0', fontSize: '28px'}}>� Chọn xe máy và gói dịch vụ</h2>
            <p style={{margin: 0, fontSize: '16px', opacity: 0.9}}>
              Chào mừng {currentUser?.name}! Bạn có {userVehicles.length} xe máy đã đăng ký.
            </p>
          </div>

          {/* Vehicle Cards */}
          <div className="grid" style={{
            gridTemplateColumns: userVehicles.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '24px'
          }}>
            {userVehicles.map((vehicle, index) => (
              <div key={vehicle.vehicleId}
                   className="card"
                   style={{
                     cursor: 'pointer',
                     border: '2px solid rgba(255,255,255,0.1)',
                     background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                     padding: '24px',
                     borderRadius: '16px',
                     transition: 'all 0.3s ease',
                     position: 'relative',
                     overflow: 'hidden'
                   }}
                   onClick={() => handleVehicleAndPlanSelection(vehicle)}
                   onMouseEnter={(e) => {
                     e.target.style.transform = 'scale(1.02)';
                     e.target.style.border = '2px solid ' + vehicle.plan.color;
                   }}
                   onMouseLeave={(e) => {
                     e.target.style.transform = 'scale(1)';
                     e.target.style.border = '2px solid rgba(255,255,255,0.1)';
                   }}>
                
                {/* Background Pattern */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  background: `linear-gradient(135deg, ${vehicle.plan.color}20, transparent)`,
                  borderRadius: '0 16px 0 100px'
                }} />

                {/* Vehicle Info */}
                <div style={{position: 'relative', zIndex: 1}}>
                  <div style={{display: 'flex', alignItems: 'center', marginBottom: '16px'}}>
                    <div style={{
                      fontSize: '32px',
                      marginRight: '16px',
                      padding: '12px',
                      borderRadius: '12px',
                      background: `${vehicle.plan.color}20`
                    }}>�</div>
                    <div>
                      <h3 style={{margin: '0 0 4px 0', fontSize: '20px'}}>{vehicle.vehicleName}</h3>
                      <p style={{margin: 0, fontSize: '14px', opacity: 0.8}}>{vehicle.vehicleType}</p>
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div style={{marginBottom: '20px'}}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      padding: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '8px'
                    }}>
                      <span style={{fontSize: '14px', opacity: 0.8}}>Dung lượng pin</span>
                      <span style={{fontSize: '14px', fontWeight: 'bold'}}>{vehicle.batteryCapacity}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      padding: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '8px'
                    }}>
                      <span style={{fontSize: '14px', opacity: 0.8}}>Pin hiện tại</span>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: vehicle.batteryInfo.current > 50 ? '#19c37d' : 
                               vehicle.batteryInfo.current > 20 ? '#ffa500' : '#ff4757'
                      }}>
                        {vehicle.batteryInfo.current}%
                      </span>
                    </div>
                  </div>

                  {/* Plan Info */}
                  <div style={{
                    border: `2px solid ${vehicle.plan.color}40`,
                    borderRadius: '12px',
                    padding: '16px',
                    background: `${vehicle.plan.color}10`
                  }}>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '12px'}}>
                      <div style={{
                        fontSize: '20px',
                        marginRight: '12px',
                        color: vehicle.plan.color
                      }}>📦</div>
                      <h4 style={{margin: 0, color: vehicle.plan.color}}>
                        Gói {vehicle.plan.name}
                      </h4>
                    </div>
                    
                    <div style={{marginBottom: '12px'}}>
                      <div style={{fontSize: '24px', fontWeight: 'bold', color: vehicle.plan.color}}>
                        {vehicle.plan.price.toLocaleString()}₫
                        <span style={{fontSize: '14px', opacity: 0.8, fontWeight: 'normal'}}>/tháng</span>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '14px'
                    }}>
                      <span style={{opacity: 0.8}}>Quãng đường</span>
                      <span style={{fontWeight: 'bold', color: vehicle.plan.color}}>
                        {typeof vehicle.plan.distance === 'number' ? `${vehicle.plan.distance} km` : vehicle.plan.distance}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button 
                    style={{
                      width: '100%',
                      marginTop: '20px',
                      padding: '12px',
                      border: 'none',
                      borderRadius: '8px',
                      background: `linear-gradient(135deg, ${vehicle.plan.color}, ${vehicle.plan.color}80)`,
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = `0 4px 12px ${vehicle.plan.color}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}>
                    Chọn xe máy này →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            textAlign: 'center',
            marginTop: '32px',
            padding: '16px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px'
          }}>
            <p style={{margin: 0, fontSize: '14px', opacity: 0.8}}>
              💡 Bạn có thể thay đổi xe máy và gói dịch vụ bất cứ lúc nào trong phần cài đặt
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      {currentView === 'landing' && <LandingPage />}
      {currentView === 'dashboard' && currentUser && <Dashboard />}
      {showVehiclePlanSelection && <VehiclePlanSelection />}
      <PaymentModal />
      <ContractModal />
      <LoginModal />
      <RegisterModal />
    </div>
  );
}

export default App;
