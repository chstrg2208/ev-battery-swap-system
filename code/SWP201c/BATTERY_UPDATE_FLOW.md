# 🔋 HƯỚNG DẪN: Battery Level Update Flow

## Vấn đề của bạn
Khi chọn xe **VinFast VF-8 (91.2%)** và đổi pin, phải:
1. Hiển thị **91.2%** là pin hiện tại
2. Sau khi đổi xong, cập nhật % pin mới cho xe đó

## Flow hoạt động hiện tại

### 1️⃣ Dashboard - Hiển thị xe
```javascript
// File: Dashboard.jsx (line 154)
batteryLevel: vehicle.health || vehicle.batteryLevel || 0

// Dữ liệu từ API:
{
  health: 91.2,  // <-- % pin từ backend
  plateNumber: "30B-67890",
  vehicleModel: "VinFast VF-8"
}

// Sau khi process:
{
  batteryLevel: 91.2,  // ✅ Hiển thị đúng
  plateNumber: "30B-67890",
  model: "VinFast VF-8"
}
```

### 2️⃣ Click "Đổi pin xe này"
```javascript
// File: SelectedVehicleDisplay.jsx (line 89-94)
onClick={() => {
  console.log('🔋 Navigating to SwapBattery with vehicle:', selectedVehicle);
  navigate('/driver/swap-battery', { state: { selectedVehicle } });
}}

// Data được truyền:
selectedVehicle = {
  batteryLevel: 91.2,  // ✅ Pin hiện tại
  health: 91.2,
  plateNumber: "30B-67890",
  model: "VinFast VF-8"
}
```

### 3️⃣ SwapBattery nhận dữ liệu
```javascript
// File: SwapBatteryContainer.jsx (line 83-96)
useEffect(() => {
  const vehicleFromNavigation = location.state?.selectedVehicle;
  if (vehicleFromNavigation) {
    console.log('🚗 Received selected vehicle from Dashboard:', vehicleFromNavigation);
    setSelectedVehicle(vehicleFromNavigation);
    
    const batteryLevel = getBatteryLevel(vehicleFromNavigation, 50);
    console.log('🔋 Setting battery level from vehicle:', batteryLevel, 
                '(health:', vehicleFromNavigation.health, 
                'batteryLevel:', vehicleFromNavigation.batteryLevel, ')');
    setCurrentBatteryLevel(batteryLevel);
  }
}, [currentUser, location.state]);

// Expected output:
// 🚗 Received selected vehicle: { batteryLevel: 91.2, health: 91.2, ... }
// 🔋 Setting battery level: 91.2 (health: 91.2 batteryLevel: 91.2)
```

### 4️⃣ getBatteryLevel() function
```javascript
// File: swapHelpers.js (line 1-17)
export const getBatteryLevel = (vehicle, fallback = 50) => {
  if (!vehicle) return fallback;
  
  // Priority order:
  const level = vehicle.health || vehicle.batteryLevel || vehicle.battery_level;
  
  if (typeof level === 'number' && level >= 0 && level <= 100) {
    return level;  // ✅ Return 91.2
  }
  
  console.warn('⚠️ Could not find valid battery level in vehicle:', vehicle);
  return fallback;
};
```

### 5️⃣ Hiển thị xác nhận đổi pin
```javascript
// File: SwapConfirmation.jsx (line 16)
const batteryLevel = getBatteryLevel(selectedVehicle, currentBatteryLevel);

// Display:
// Pin hiện tại: 91.2% ✅
// Pin mới: 99.1% (from selectedNewBatterySlot)
```

### 6️⃣ Sau khi hoàn thành đổi pin
```javascript
// File: SwapBatteryContainer.jsx (line 360-377)
onComplete={() => {
  const newBatteryLevel = selectedNewBatterySlot?.batteryLevel || 100;
  
  // Update vehicle data
  const updatedVehicle = {
    ...selectedVehicle,
    batteryLevel: newBatteryLevel,  // 99.1%
    health: newBatteryLevel          // 99.1%
  };
  
  // Save to state
  setSelectedVehicle(updatedVehicle);
  
  // Save to sessionStorage
  sessionStorage.setItem('selectedVehicle', JSON.stringify(updatedVehicle));
  console.log('✅ Updated vehicle battery level:', newBatteryLevel, '%');
  
  setCurrentBatteryLevel(newBatteryLevel);
  setSwapResult({ /* ... */ });
  setCurrentStep(9);
}}
```

### 7️⃣ Quay về Dashboard
```javascript
// File: Dashboard.jsx (line 166-192)
const updateVehiclesFromSession = (processedVehicles) => {
  const updatedVehicleStr = sessionStorage.getItem('selectedVehicle');
  if (!updatedVehicleStr) return processedVehicles;

  const updatedVehicle = JSON.parse(updatedVehicleStr);
  console.log('🔄 Found updated vehicle in session:', updatedVehicle);
  
  return processedVehicles.map(vehicle => {
    if (vehicle.plateNumber === updatedVehicle.plateNumber) {
      console.log('✅ MATCH! Updating vehicle battery:', 
                 'from', vehicle.batteryLevel, 
                 'to', updatedVehicle.batteryLevel);
      return {
        ...vehicle,
        batteryLevel: updatedVehicle.batteryLevel,  // 99.1% ✅
        health: updatedVehicle.batteryLevel
      };
    }
    return vehicle;
  });
};
```

## Cách kiểm tra

### Bước 1: Mở Console (F12)
Trước khi test, mở Chrome DevTools > Console

### Bước 2: Vào Dashboard
Kiểm tra logs:
```
✅ Successfully loaded dashboard data
🔋 Vehicle: VinFast VF-8 - Battery: 91.2%
```

### Bước 3: Click "Đổi pin xe này"
Kiểm tra logs:
```
🔋 Navigating to SwapBattery with vehicle: { batteryLevel: 91.2, ... }
🚗 Received selected vehicle from Dashboard: { ... }
🔋 Setting battery level from vehicle: 91.2 (health: 91.2 batteryLevel: 91.2)
```

### Bước 4: Chọn các bước đổi pin
- Chọn trạm
- Chọn tower
- Chọn slot pin mới (ví dụ: 99.1%)
- Chọn slot trống

### Bước 5: Xem màn hình xác nhận
Phải hiển thị:
```
Pin hiện tại: 91.2% ✅
Pin mới: 99.1% ✅
```

### Bước 6: Hoàn thành đổi pin
Kiểm tra logs:
```
✅ Updated vehicle battery level: 99.1 %
✅ Swap completed successfully
```

### Bước 7: Quay về Dashboard
Kiểm tra:
1. Console logs:
```
🔄 Found updated vehicle in session: { batteryLevel: 99.1, ... }
✅ MATCH! Updating vehicle battery: 30B-67890 from 91.2 to 99.1
```

2. UI hiển thị:
```
VinFast VF-8
30B-67890
🔋 99.1% ✅ (đã cập nhật!)
```

## Nếu không hoạt động

### Debug Checklist:

1. **Kiểm tra vehicle có batteryLevel không?**
```javascript
// Console
console.log('Vehicle data:', selectedVehicle);
// Expected: { batteryLevel: 91.2, health: 91.2, ... }
```

2. **Kiểm tra sessionStorage**
```javascript
// Console
console.log(JSON.parse(sessionStorage.getItem('selectedVehicle')));
// Expected: { batteryLevel: 99.1, ... } sau khi đổi pin
```

3. **Kiểm tra API response**
```javascript
// Network tab > userService.getUserById
// Response should have: vehicles[0].health = 91.2
```

4. **Clear cache và reload**
```
Ctrl + Shift + Delete
Clear: Cookies, Cache
Hard reload: Ctrl + Shift + R
```

## Expected Console Logs Flow

```
📊 Dashboard loaded
├─ ✅ API Response: { vehicles: [{ health: 91.2 }] }
├─ ✅ Processed vehicle: { batteryLevel: 91.2 }
└─ 🔄 No updated vehicle in session (first time)

🔋 Click "Đổi pin xe này"
├─ 🚗 Navigating with vehicle: { batteryLevel: 91.2 }
└─ 🔋 SwapBattery received: { batteryLevel: 91.2 }

⚡ Complete swap
├─ 🔋 New battery level: 99.1%
├─ ✅ Updated vehicle: { batteryLevel: 99.1 }
└─ 💾 Saved to sessionStorage

🏠 Return to Dashboard
├─ 📊 Fetch API data: { health: 91.2 } (old data from backend)
├─ 🔄 Found updated vehicle in session: { batteryLevel: 99.1 }
├─ ✅ MATCH! Updating: 91.2 → 99.1
└─ 🎉 Display: 99.1% ✅
```

## Common Issues

### Issue 1: Vẫn hiển thị 15%
**Nguyên nhân:** Vehicle không có field `health` hoặc `batteryLevel`

**Fix:** Check API response
```javascript
// API phải trả về:
{
  vehicles: [{
    health: 91.2  // <-- Bắt buộc phải có!
  }]
}
```

### Issue 2: Sau khi đổi pin vẫn hiển thị % cũ
**Nguyên nhân:** sessionStorage không được cập nhật

**Fix:** Check console log
```javascript
// Phải thấy:
✅ Updated vehicle battery level: 99.1 %
💾 sessionStorage.setItem called
```

### Issue 3: Refresh page mất dữ liệu
**Đây là behavior bình thường!**

- sessionStorage lưu tạm thời trong session
- Khi refresh, API sẽ fetch dữ liệu mới từ backend
- Backend có thể chưa cập nhật ngay (cần API update vehicle)

## Files liên quan

1. ✅ `Dashboard.jsx` - Load và update vehicles
2. ✅ `VehicleCard.jsx` - Display battery %
3. ✅ `SelectedVehicleDisplay.jsx` - Navigate with vehicle
4. ✅ `SwapBatteryContainer.jsx` - Receive và update vehicle
5. ✅ `SwapConfirmation.jsx` - Display confirmation
6. ✅ `swapHelpers.js` - getBatteryLevel utility
7. ✅ `ConfirmAndSave.jsx` - Save updated battery

## API Endpoints cần có

### Hiện tại (Read-only):
```
GET /api/users/{userId}
Response: { vehicles: [{ health: 91.2 }] }
```

### Cần thêm (Update):
```
PUT /api/vehicles/{vehicleId}/battery
Body: { batteryLevel: 99.1 }
Response: { success: true }
```

Sau khi có API này, battery level sẽ persist vĩnh viễn!

---

**Status:** ✅ Frontend logic hoàn chỉnh
**Next step:** Backend cần implement PUT vehicle battery API
