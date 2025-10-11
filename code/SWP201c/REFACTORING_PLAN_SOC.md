# 🏗️ KẾ HOẠCH REFACTORING - SEPARATION OF CONCERNS (SoC)

> **Ngày:** 11/10/2025  
> **Mục tiêu:** Tái cấu trúc tất cả pages theo nguyên tắc SoC để code dễ bảo trì, test, và mở rộng

---

## 📐 NGUYÊN TẮC SEPARATION OF CONCERNS (SoC)

### **5 Tầng (Layers) Tách Biệt:**

```
┌─────────────────────────────────────────────┐
│  1. PAGE CONTAINER (index.jsx)              │  ← Điều phối, layout
│     - Orchestration logic                   │
│     - Layout wrapper                        │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│  2. COMPONENTS (components/)                │  ← UI presentation
│     - Pure UI components                    │
│     - Reusable, dumb components             │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│  3. HOOKS (hooks/)                          │  ← Business logic
│     - Custom hooks                          │
│     - State management                      │
│     - Data fetching                         │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│  4. UTILS (utils/)                          │  ← Helper functions
│     - Pure functions                        │
│     - Data transformations                  │
│     - Validators, formatters                │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│  5. SERVICES (services/)                    │  ← API calls
│     - Already exists in src/assets/js/      │
└─────────────────────────────────────────────┘
```

---

## 🎯 CẤU TRÚC MỚI CHO MỖI PAGE

### **Template Chuẩn:**

```
PageName/
├── index.jsx                     # Container - orchestration
├── components/                   # UI Components
│   ├── PageHeader.jsx
│   ├── PageFilters.jsx
│   ├── PageTable.jsx
│   ├── PageCard.jsx
│   ├── PageModal.jsx
│   └── index.js                  # Export barrel
├── hooks/                        # Custom hooks
│   ├── usePageData.js            # Data fetching
│   ├── usePageFilters.js         # Filter logic
│   ├── usePageActions.js         # CRUD actions
│   └── index.js
├── utils/                        # Helper functions
│   ├── validators.js             # Validation functions
│   ├── formatters.js             # Data formatters
│   ├── constants.js              # Constants
│   └── index.js
└── types.js (optional)           # TypeScript types/JSDoc
```

---

## 📋 DANH SÁCH PAGES CẦN REFACTOR

### ✅ **ĐÃ REFACTOR (Tốt)**
- `Driver/Dashboard/` - Đã có components/, đã tốt
- `Driver/SwapBattery/` - Đã có components/, hooks/, utils/
- `Driver/Vehicles/` - Đã có components/
- `Driver/Payments/` - Đã có components/

### ⚠️ **REFACTOR MỨC ĐỘ TRUNG BÌNH**
- `Driver/Contracts.jsx` → `Driver/Contracts/`
- `Driver/Subscriptions.jsx` → `Driver/Subscriptions/`
- `Driver/Profile.jsx` → `Driver/Profile/`
- `Driver/Support.jsx` → `Driver/Support/`
- `Driver/StationsMap.jsx` → `Driver/StationsMap/`

### ❌ **CHƯA REFACTOR (Cần làm)**

#### **ADMIN:**
1. `Admin/Users.jsx` → `Admin/Users/`
2. `Admin/Batteries.jsx` → `Admin/Batteries/`
3. `Admin/Contracts.jsx` → `Admin/Contracts/`
4. `Admin/Subscriptions.jsx` → `Admin/Subscriptions/`
5. `Admin/Reports.jsx` → `Admin/Reports/`
6. `Admin/Dashboard.jsx` → `Admin/Dashboard/`
7. `Admin/Stations/index.jsx` → (đã có folder, cần cải thiện)

#### **STAFF:**
1. `Staff/Dashboard.jsx` → `Staff/Dashboard/`
2. `Staff/BatteryInventory.jsx` → `Staff/BatteryInventory/`
3. `Staff/BatteryStock.jsx` → `Staff/BatteryStock/`
4. `Staff/TransactionManagement.jsx` → `Staff/TransactionManagement/`
5. `Staff/Issues/index.jsx` → (đã có folder, cần cải thiện)
6. `Staff/Reports/index.jsx` → (đã có folder, cần cải thiện)
7. `Staff/StationManagement/index.jsx` → (đã có folder, cần cải thiện)
8. `Staff/SwapConfirm/index.jsx` → (đã có folder, cần cải thiện)

---

## 🚀 PHASE 1: ADMIN PAGES REFACTORING

### **1. Admin/Users/** ✅ (Ưu tiên cao)

#### **Cấu trúc mới:**
```
Admin/Users/
├── index.jsx                     # Main container
├── components/
│   ├── UsersHeader.jsx           # Header with search, filters
│   ├── UsersSubTabs.jsx          # Sub-tabs (Users/Staff/Admin)
│   ├── UsersTable.jsx            # Table display
│   ├── UserCard.jsx              # Individual user card
│   ├── UserModal.jsx             # Add/Edit modal
│   ├── UserStatusBadge.jsx       # Status badge component
│   ├── UserRoleBadge.jsx         # Role badge component
│   └── index.js
├── hooks/
│   ├── useUsersData.js           # Fetch users from API
│   ├── useUsersFilters.js        # Filter logic (search, role, status)
│   ├── useUsersActions.js        # CRUD operations
│   └── index.js
├── utils/
│   ├── usersHelpers.js           # getRoleLabel, getRoleColor, etc.
│   ├── usersValidators.js        # Validate user data
│   ├── usersConstants.js         # Role map, status map
│   └── index.js
```

#### **Tách logic:**
- **index.jsx**: Chỉ orchestration, không có business logic
- **hooks/useUsersData.js**: Tất cả API calls (getAllUsers, getUserById)
- **hooks/useUsersActions.js**: CREATE, UPDATE, DELETE, toggleStatus
- **hooks/useUsersFilters.js**: Search, filter by role/status/tab
- **components/UsersTable.jsx**: Pure UI, nhận props, render table
- **utils/usersHelpers.js**: getRoleLabel, getRoleColor, getStatusColor

---

### **2. Admin/Batteries/** ✅

#### **Cấu trúc mới:**
```
Admin/Batteries/
├── index.jsx
├── components/
│   ├── BatteriesHeader.jsx       # Header with filters
│   ├── BatteriesGrid.jsx         # Grid layout
│   ├── BatteryCard.jsx           # Battery card
│   ├── BatteryStatusBadge.jsx    # Status badge
│   ├── BatteryModal.jsx          # Add/Edit battery
│   ├── BatteryDetailModal.jsx    # View details
│   └── index.js
├── hooks/
│   ├── useBatteriesData.js       # Fetch batteries
│   ├── useBatteriesActions.js    # CREATE, UPDATE, DELETE
│   ├── useBatteriesFilters.js    # Filter by status, station
│   └── index.js
├── utils/
│   ├── batteriesHelpers.js       # getStatusColor, getHealthLevel
│   ├── batteriesValidators.js    # Validate battery data
│   ├── batteriesConstants.js     # Status map, health levels
│   └── index.js
```

---

### **3. Admin/Dashboard/** ✅

#### **Cấu trúc mới:**
```
Admin/Dashboard/
├── index.jsx
├── components/
│   ├── DashboardHeader.jsx       # Welcome header
│   ├── StatsCards.jsx            # Stats overview
│   ├── RevenueChart.jsx          # Revenue chart
│   ├── UsageChart.jsx            # Usage chart
│   ├── RecentActivities.jsx      # Recent activities list
│   ├── QuickActions.jsx          # Quick action buttons
│   └── index.js
├── hooks/
│   ├── useDashboardData.js       # Fetch dashboard stats
│   ├── useDashboardCharts.js     # Chart data processing
│   └── index.js
├── utils/
│   ├── dashboardHelpers.js       # Format stats, calculate growth
│   ├── chartHelpers.js           # Chart data transformations
│   └── index.js
```

---

## 🚀 PHASE 2: STAFF PAGES REFACTORING

### **1. Staff/BatteryInventory/** ✅

```
Staff/BatteryInventory/
├── index.jsx
├── components/
│   ├── InventoryHeader.jsx       # Filters, search
│   ├── InventoryTable.jsx        # Table with batteries
│   ├── BatteryRow.jsx            # Table row
│   ├── StatusUpdateModal.jsx     # Update status modal
│   ├── BatteryHistoryModal.jsx   # History modal
│   └── index.js
├── hooks/
│   ├── useInventoryData.js       # Fetch inventory
│   ├── useInventoryActions.js    # Update status, move battery
│   ├── useInventoryFilters.js    # Filter by status, station
│   └── index.js
├── utils/
│   ├── inventoryHelpers.js       # Status transitions
│   ├── inventoryValidators.js    # Validate status changes
│   └── index.js
```

---

### **2. Staff/TransactionManagement/** ✅

```
Staff/TransactionManagement/
├── index.jsx
├── components/
│   ├── TransactionsHeader.jsx    # Date range, filters
│   ├── TransactionsTable.jsx     # Transaction list
│   ├── TransactionRow.jsx        # Row component
│   ├── TransactionDetailModal.jsx # Detail modal
│   ├── TransactionStatusBadge.jsx # Status badge
│   └── index.js
├── hooks/
│   ├── useTransactionsData.js    # Fetch transactions
│   ├── useTransactionsFilters.js # Filter by date, status, type
│   └── index.js
├── utils/
│   ├── transactionsHelpers.js    # Format date, amount
│   ├── transactionsConstants.js  # Transaction types, statuses
│   └── index.js
```

---

## 🚀 PHASE 3: DRIVER PAGES REFACTORING

### **Pages cần refactor:**

1. **Driver/Contracts/** ✅
2. **Driver/Subscriptions/** ✅
3. **Driver/Profile/** ✅
4. **Driver/Support/** ✅
5. **Driver/StationsMap/** ✅

### **Ví dụ: Driver/Subscriptions/**

```
Driver/Subscriptions/
├── index.jsx
├── components/
│   ├── SubscriptionsHeader.jsx   # Current plan display
│   ├── PlanCard.jsx              # Plan option card
│   ├── PlansGrid.jsx             # Grid of plans
│   ├── UpgradeModal.jsx          # Upgrade confirmation
│   ├── BillingHistory.jsx        # Billing history
│   └── index.js
├── hooks/
│   ├── useSubscriptionsData.js   # Fetch plans, current subscription
│   ├── useSubscriptionsActions.js # Subscribe, upgrade, cancel
│   └── index.js
├── utils/
│   ├── subscriptionsHelpers.js   # Calculate savings, compare plans
│   ├── subscriptionsConstants.js # Plan details, features
│   └── index.js
```

---

## 📝 MẪU CODE CHO TỪNG LAYER

### **1. PAGE CONTAINER (index.jsx)**

```jsx
// Admin/Users/index.jsx
import React from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { useUsersData, useUsersActions, useUsersFilters } from './hooks';
import { UsersHeader, UsersSubTabs, UsersTable, UserModal } from './components';

const AdminUsers = () => {
  // Custom hooks - business logic
  const { users, loading, error, refetch } = useUsersData();
  const { createUser, updateUser, deleteUser, toggleStatus } = useUsersActions(refetch);
  const { 
    filteredUsers, 
    searchTerm, 
    setSearchTerm, 
    activeTab, 
    setActiveTab,
    selectedRole,
    setSelectedRole
  } = useUsersFilters(users);

  // UI state
  const [showModal, setShowModal] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);

  // Event handlers (thin wrappers)
  const handleAddUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleSaveUser = async (userData) => {
    if (selectedUser) {
      await updateUser(selectedUser.id, userData);
    } else {
      await createUser(userData);
    }
    setShowModal(false);
  };

  return (
    <DashboardLayout>
      <div className="admin-users-page">
        <UsersHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddClick={handleAddUser}
        />
        
        <UsersSubTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={{ users: 10, staff: 5, admin: 2 }}
        />
        
        <UsersTable
          users={filteredUsers}
          loading={loading}
          error={error}
          onEdit={handleEditUser}
          onDelete={deleteUser}
          onToggleStatus={toggleStatus}
        />
        
        {showModal && (
          <UserModal
            user={selectedUser}
            onSave={handleSaveUser}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
```

---

### **2. CUSTOM HOOK (hooks/useUsersData.js)**

```js
// Admin/Users/hooks/useUsersData.js
import { useState, useEffect } from 'react';
import userService from '../../../assets/js/services/userService';

export const useUsersData = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await userService.getAllUsers();
      
      if (result.success) {
        setUsers(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Không thể tải dữ liệu người dùng');
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers
  };
};
```

---

### **3. CUSTOM HOOK (hooks/useUsersActions.js)**

```js
// Admin/Users/hooks/useUsersActions.js
import { useState } from 'react';
import userService from '../../../assets/js/services/userService';

export const useUsersActions = (onSuccess) => {
  const [actionLoading, setActionLoading] = useState(false);

  const createUser = async (userData) => {
    try {
      setActionLoading(true);
      const result = await userService.createUser(userData);
      
      if (result.success) {
        onSuccess?.();
        return { success: true };
      } else {
        return { success: false, error: result.message };
      }
    } catch (err) {
      console.error('Create user error:', err);
      return { success: false, error: 'Lỗi khi tạo người dùng' };
    } finally {
      setActionLoading(false);
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      setActionLoading(true);
      const result = await userService.updateUser(userId, userData);
      
      if (result.success) {
        onSuccess?.();
        return { success: true };
      } else {
        return { success: false, error: result.message };
      }
    } catch (err) {
      console.error('Update user error:', err);
      return { success: false, error: 'Lỗi khi cập nhật người dùng' };
    } finally {
      setActionLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return { success: false };
    }

    try {
      setActionLoading(true);
      const result = await userService.deleteUser(userId);
      
      if (result.success) {
        onSuccess?.();
        return { success: true };
      } else {
        return { success: false, error: result.message };
      }
    } catch (err) {
      console.error('Delete user error:', err);
      return { success: false, error: 'Lỗi khi xóa người dùng' };
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async (userId) => {
    try {
      setActionLoading(true);
      const result = await userService.toggleUserStatus(userId);
      
      if (result.success) {
        onSuccess?.();
        return { success: true };
      } else {
        return { success: false, error: result.message };
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      return { success: false, error: 'Lỗi khi cập nhật trạng thái' };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    createUser,
    updateUser,
    deleteUser,
    toggleStatus,
    actionLoading
  };
};
```

---

### **4. CUSTOM HOOK (hooks/useUsersFilters.js)**

```js
// Admin/Users/hooks/useUsersFilters.js
import { useState, useMemo } from 'react';

export const useUsersFilters = (users) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'staff', 'admin'
  const [selectedRole, setSelectedRole] = useState('all'); // 'all', 'active', 'inactive'

  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Filter by active tab (role)
    switch (activeTab) {
      case 'users':
        filtered = filtered.filter(user => user.role === 'driver');
        break;
      case 'staff':
        filtered = filtered.filter(user => user.role === 'staff');
        break;
      case 'admin':
        filtered = filtered.filter(user => user.role === 'admin');
        break;
      default:
        break;
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
    }

    // Filter by status
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.status === selectedRole);
    }

    return filtered;
  }, [users, searchTerm, activeTab, selectedRole]);

  return {
    filteredUsers,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    selectedRole,
    setSelectedRole
  };
};
```

---

### **5. UTILS (utils/usersHelpers.js)**

```js
// Admin/Users/utils/usersHelpers.js

export const getRoleLabel = (role) => {
  const roleMap = {
    'admin': 'Quản trị viên',
    'staff': 'Nhân viên',
    'driver': 'Tài xế'
  };
  return roleMap[role] || role;
};

export const getRoleColor = (role) => {
  const colorMap = {
    'admin': '#e74c3c',
    'staff': '#f39c12',
    'driver': '#27ae60'
  };
  return colorMap[role] || '#95a5a6';
};

export const getStatusColor = (status) => {
  return status === 'active' ? '#27ae60' : '#e74c3c';
};

export const formatUserData = (user) => {
  return {
    ...user,
    roleLabel: getRoleLabel(user.role),
    roleColor: getRoleColor(user.role),
    statusColor: getStatusColor(user.status)
  };
};
```

---

### **6. COMPONENT (components/UsersTable.jsx)**

```jsx
// Admin/Users/components/UsersTable.jsx
import React from 'react';
import { UserRow } from './UserRow';

export const UsersTable = ({ 
  users, 
  loading, 
  error, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}) => {
  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (users.length === 0) {
    return <div className="empty">Không có người dùng nào</div>;
  }

  return (
    <div className="users-table">
      <table>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <UserRow
              key={user.id}
              user={user}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

---

## 🎯 LỢI ÍCH CỦA SoC

### **1. Maintainability (Dễ bảo trì)**
- ✅ Mỗi file chỉ làm 1 việc
- ✅ Dễ tìm bug (biết file nào có vấn đề)
- ✅ Dễ sửa code (không ảnh hưởng nhiều nơi)

### **2. Testability (Dễ test)**
- ✅ Test từng layer riêng biệt
- ✅ Mock dễ dàng (hooks, utils, services)
- ✅ Unit test cho pure functions

### **3. Reusability (Tái sử dụng)**
- ✅ Components dùng lại nhiều nơi
- ✅ Hooks dùng cho nhiều pages
- ✅ Utils dùng cross-project

### **4. Scalability (Mở rộng)**
- ✅ Thêm feature mới dễ dàng
- ✅ Thay đổi UI không ảnh hưởng logic
- ✅ Thay đổi logic không ảnh hưởng UI

### **5. Team Collaboration (Làm việc nhóm)**
- ✅ Chia task rõ ràng (UI, hooks, utils)
- ✅ Ít conflict khi merge code
- ✅ Onboard dev mới nhanh hơn

---

## 📅 TIMELINE THỰC HIỆN

### **Week 1: Admin Pages**
- Day 1-2: `Admin/Users/`
- Day 3-4: `Admin/Batteries/`
- Day 5: `Admin/Dashboard/`

### **Week 2: Staff Pages**
- Day 1-2: `Staff/BatteryInventory/`
- Day 3-4: `Staff/TransactionManagement/`
- Day 5: `Staff/Dashboard/`

### **Week 3: Driver Pages**
- Day 1: `Driver/Contracts/`
- Day 2: `Driver/Subscriptions/`
- Day 3: `Driver/Profile/`
- Day 4: `Driver/Support/`
- Day 5: `Driver/StationsMap/`

### **Week 4: Testing & Documentation**
- Day 1-3: Write tests for hooks/utils
- Day 4-5: Update documentation

---

## ✅ CHECKLIST CHO MỖI PAGE

- [ ] Tạo folder structure (components/, hooks/, utils/)
- [ ] Tách business logic vào hooks
- [ ] Tách UI vào components (pure components)
- [ ] Tách helper functions vào utils
- [ ] index.jsx chỉ orchestration
- [ ] Tạo barrel exports (index.js)
- [ ] Xóa file .jsx cũ
- [ ] Test functionality
- [ ] Update imports trong routes
- [ ] Update documentation

---

**Sẵn sàng bắt đầu refactor!** 🚀
