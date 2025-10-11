# Backend Fix Required - Vehicle Contract Mapping

## Issue
Frontend không thể hiển thị thông tin gói dịch vụ (contract) cho xe vì thiếu dữ liệu từ API.

## Current Situation (Hiện tại)

### 1. GET `/api/users/{userId}` - Vehicle Response
```json
{
  "success": true,
  "vehicles": [
    {
      // ❌ THIẾU: id hoặc vehicleId
      "plateNumber": "30B-67890",
      "vehicleModel": "VinFast VF-8",
      "vinNumber": "VF234567890IBCDEF",
      "batteryLevel": 91.2,
      "batteryType": "LiFePO4-60kWh"
    }
  ]
}
```

### 2. GET `/api/contracts/user/{userId}` - Contract Response
```json
{
  "success": true,
  "data": [
    {
      "contractId": 1,
      "contractNumber": "CT-2024-001",
      "planName": "Cơ bản Plan",
      "status": "active",
      "startDate": "2023-12-31T17:00:00.000+00:00",
      "vehicleId": 1,
      // ❌ THIẾU: vehiclePlate
      "monthlyFee": 1500000,
      "monthlyDistance": 1000
    }
  ]
}
```

## Required Fix (Cần sửa)

### 1. ✅ Vehicle API - Thêm `id` field
**Endpoint:** `GET /api/users/{userId}`

**Response cần có:**
```json
{
  "success": true,
  "vehicles": [
    {
      "id": 1,                    // ← THÊM FIELD NÀY (primary key của vehicle)
      "vehicleId": 1,             // ← HOẶC FIELD NÀY (nếu khác với id)
      "plateNumber": "30B-67890",
      "vehicleModel": "VinFast VF-8",
      "vinNumber": "VF234567890IBCDEF",
      "batteryLevel": 91.2,
      "batteryType": "LiFePO4-60kWh"
    }
  ]
}
```

### 2. ✅ Contract API - Thêm `vehiclePlate` field
**Endpoint:** `GET /api/contracts/user/{userId}`

**Response cần có:**
```json
{
  "success": true,
  "data": [
    {
      "contractId": 1,
      "contractNumber": "CT-2024-001",
      "planName": "Cơ bản Plan",
      "status": "active",
      "startDate": "2023-12-31T17:00:00.000+00:00",
      "endDate": "2024-02-14T17:00:00.000+00:00",
      "vehicleId": 1,
      "vehiclePlate": "30B-67890",    // ← THÊM FIELD NÀY (biển số xe từ bảng vehicles)
      "monthlyFee": 1500000,
      "monthlyDistance": 1000
    }
  ]
}
```

## Why (Tại sao cần)

Frontend cần map contract với vehicle bằng **2 cách**:
1. **By ID:** `vehicle.id === contract.vehicleId`
2. **By Plate Number:** `vehicle.plateNumber === contract.vehiclePlate`

Hiện tại cả 2 cách đều không hoạt động vì:
- ❌ Vehicle không có `id` → không match được by ID
- ❌ Contract không có `vehiclePlate` → không match được by plate number

## Database Query Example

### For Vehicle API:
```java
// Thêm id vào vehicle response
Vehicle vehicle = vehicleRepository.findById(vehicleId);
VehicleDTO dto = new VehicleDTO();
dto.setId(vehicle.getId());              // ← THÊM DÒNG NÀY
dto.setVehicleId(vehicle.getId());       // ← HOẶC DÒNG NÀY
dto.setPlateNumber(vehicle.getPlateNumber());
dto.setVehicleModel(vehicle.getVehicleModel());
// ... rest of fields
```

### For Contract API:
```java
// Thêm vehiclePlate vào contract response bằng JOIN
SELECT 
  c.contract_id,
  c.contract_number,
  c.plan_name,
  c.status,
  c.vehicle_id,
  v.plate_number AS vehicle_plate,    -- ← THÊM FIELD NÀY
  c.monthly_fee,
  c.monthly_distance
FROM contracts c
LEFT JOIN vehicles v ON c.vehicle_id = v.id
WHERE c.user_id = ?
```

Hoặc trong Java:
```java
ContractDTO dto = new ContractDTO();
dto.setContractId(contract.getId());
dto.setVehicleId(contract.getVehicle().getId());
dto.setVehiclePlate(contract.getVehicle().getPlateNumber());  // ← THÊM DÒNG NÀY
// ... rest of fields
```

## Testing

Sau khi fix, test bằng cách:
1. Gọi API: `GET /api/users/1`
2. Check response có `id` hoặc `vehicleId` trong vehicle object
3. Gọi API: `GET /api/contracts/user/1`
4. Check response có `vehiclePlate` trong contract object
5. Refresh frontend và click vào xe → gói dịch vụ sẽ hiện

## Priority
🔴 **HIGH** - Tính năng quan trọng, user không thể xem gói dịch vụ của xe

## Contact
Frontend Developer: [Your Name]
Date: October 11, 2025
