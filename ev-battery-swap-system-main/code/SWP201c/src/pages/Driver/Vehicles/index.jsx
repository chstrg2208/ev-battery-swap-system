import React from 'react';
import { useAuth } from '../../../context/AuthContext'; // Điều chỉnh đường dẫn nếu cần
import VehicleList from './components/VehicleList';

// Dữ liệu giả, sau này bạn sẽ lấy từ API dựa trên tài khoản đăng nhập
const mockVehicles = [
  {
    id: 'V01',
    name: 'Vinfast VF8',
    plate: '51K-123.45',
    imageUrl: 'https://vinfast-hochiminh.com/wp-content/uploads/2022/03/hinh-anh-thuc-te-vinfast-vf8-mau-do-1.jpg',
  },
  {
    id: 'V02',
    name: 'Vinfast VFe34',
    plate: '51H-678.90',
    imageUrl: 'https://dailyvinfast.vn/wp-content/uploads/2021/04/e34.png',
  }
];

const VehicleSelectionScreen = () => {
  const { selectVehicle } = useAuth(); // Lấy hàm selectVehicle từ AuthContext

  const handleSelect = (vehicle) => {
    console.log("Xe đã chọn:", vehicle);
    // Gọi hàm từ Context để lưu xe vào state chung và tự động chuyển hướng đến Dashboard
    if (selectVehicle) {
      selectVehicle(vehicle);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0b1020 0%, #0e1430 100%)',
      color: 'white',
      padding: '30px',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ marginBottom: '10px' }}>Lựa chọn Phương tiện</h1>
      <p style={{ color: '#9aa4c7', marginBottom: '40px', textAlign: 'center' }}>
        Vui lòng chọn một phương tiện để bắt đầu phiên làm việc của bạn.
      </p>

      {/* Danh sách xe để người dùng lựa chọn */}
      <VehicleList vehicles={mockVehicles} onSelectVehicle={handleSelect} />
    </div>
  );
};

export default VehicleSelectionScreen;