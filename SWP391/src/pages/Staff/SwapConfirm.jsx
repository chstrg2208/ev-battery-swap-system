// Staff Swap Confirmation
// Quản lý đổi pin - Xác nhận và xử lý yêu cầu đổi pin từ Driver

import React, { useState, useEffect } from 'react';

const StaffSwapConfirm = () => {
  // Mock data - Danh sách yêu cầu đổi pin
  const [swapRequests, setSwapRequests] = useState([
    {
      id: 'SWP001',
      driverName: 'Nguyễn Văn A',
      driverPhone: '0901234567',
      vehicleNumber: '59A-12345',
      oldBatteryId: 'BAT-001',
      oldBatterySOC: 15, // State of Charge (%)
      requestTime: '2024-10-05 09:30',
      status: 'Pending',
      subscriptionType: 'Premium',
      kmThisMonth: 850, // km đã chạy trong tháng
      kmLimit: null // Premium = không giới hạn
    },
    {
      id: 'SWP002',
      driverName: 'Trần Thị B',
      driverPhone: '0912345678',
      vehicleNumber: '59B-67890',
      oldBatteryId: 'BAT-045',
      oldBatterySOC: 8,
      requestTime: '2024-10-05 09:45',
      status: 'Pending',
      subscriptionType: 'Basic',
      kmThisMonth: 380, // Chưa vượt (< 400km)
      kmLimit: 400
    },
    {
      id: 'SWP003',
      driverName: 'Lê Văn C',
      driverPhone: '0923456789',
      vehicleNumber: '59C-11111',
      oldBatteryId: 'BAT-089',
      oldBatterySOC: 5,
      requestTime: '2024-10-05 10:00',
      status: 'Pending',
      subscriptionType: 'Basic',
      kmThisMonth: 450, // Vượt gói (> 400km)
      kmLimit: 400
    }
  ]);

  // Mock data - Danh sách pin có sẵn
  const [availableBatteries, setAvailableBatteries] = useState([
    { id: 'BAT-101', soc: 100, soh: 98, status: 'Available', lastCharged: '2024-10-05 08:00' },
    { id: 'BAT-102', soc: 100, soh: 95, status: 'Available', lastCharged: '2024-10-05 08:15' },
    { id: 'BAT-103', soc: 98, soh: 97, status: 'Available', lastCharged: '2024-10-05 08:30' },
    { id: 'BAT-104', soc: 100, soh: 92, status: 'Available', lastCharged: '2024-10-05 08:45' },
    { id: 'BAT-105', soc: 95, soh: 96, status: 'Available', lastCharged: '2024-10-05 09:00' }
  ]);

  // State cho modal xác nhận đổi pin
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedNewBattery, setSelectedNewBattery] = useState(null);

  // State cho form thanh toán
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  // State cho form kiểm tra pin cũ
  const [showBatteryCheckModal, setShowBatteryCheckModal] = useState(false);
  const [batteryCheckData, setBatteryCheckData] = useState({
    soh: 0,
    physicalCondition: 'Good',
    notes: '',
    needsMaintenance: false
  });

  // State cho modal chi tiết hoàn thành
  const [showCompletedDetailModal, setShowCompletedDetailModal] = useState(false);
  const [completedSwapDetail, setCompletedSwapDetail] = useState(null);
  const [isEditingDetail, setIsEditingDetail] = useState(false);
  const [editingDetailData, setEditingDetailData] = useState(null);

  // State cho thông báo
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Hiển thị thông báo
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  // Bước 1: Mở modal xác nhận đổi pin
  const handleConfirmSwap = (request) => {
    setSelectedRequest(request);
    setSelectedNewBattery(null);
    setShowConfirmModal(true);
  };

  // Bước 2: Xác nhận chọn pin mới và xử lý
  const handleSelectBattery = async () => {
    if (!selectedNewBattery) {
      showNotification('Vui lòng chọn pin mới!', 'error');
      return;
    }

    // Kiểm tra nếu vượt gói (theo km)
    const needsPayment = selectedRequest.kmLimit !== null && selectedRequest.kmThisMonth > selectedRequest.kmLimit;
    
    if (needsPayment) {
      // Tính số km vượt và giá tiền
      const excessKm = selectedRequest.kmThisMonth - selectedRequest.kmLimit;
      const pricePerKm = 100; // 100 VNĐ/km vượt (có thể điều chỉnh)
      const totalAmount = excessKm * pricePerKm;
      
      // Chuyển sang form thanh toán
      setShowConfirmModal(false);
      setPaymentAmount(totalAmount);
      setShowPaymentModal(true);
    } else {
      // Không cần thanh toán (Premium hoặc chưa vượt km), chuyển thẳng sang kiểm tra pin
      setShowConfirmModal(false);
      setShowBatteryCheckModal(true);
    }
  };

  // Bước 3: Xử lý thanh toán
  const handlePayment = () => {
    if (paymentAmount <= 0) {
      showNotification('Số tiền không hợp lệ!', 'error');
      return;
    }

    // Lưu thông tin thanh toán
    console.log('Payment processed:', {
      requestId: selectedRequest.id,
      amount: paymentAmount,
      method: paymentMethod,
      timestamp: new Date().toISOString()
    });

    // Chuyển sang bước kiểm tra pin
    setShowPaymentModal(false);
    setShowBatteryCheckModal(true);
  };

  // Bước 4: Hoàn tất đổi pin
  const handleCompleteSwap = () => {
    // Cập nhật trạng thái pin cũ → Charging
    // Cập nhật pin mới → In Use
    // Lưu lịch sử giao dịch
    // Cập nhật Battery_History
    // Nếu pin lỗi → chuyển sang Maintenance

    const completedTime = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const needsPayment = selectedRequest.kmLimit !== null && selectedRequest.kmThisMonth > selectedRequest.kmLimit;
    const excessKm = needsPayment ? selectedRequest.kmThisMonth - selectedRequest.kmLimit : 0;

    // Tạo chi tiết giao dịch hoàn thành
    const swapDetail = {
      ...selectedRequest,
      newBatteryId: selectedNewBattery.id,
      newBatterySOC: selectedNewBattery.soc,
      newBatterySOH: selectedNewBattery.soh,
      completedTime,
      batteryCheckData,
      paymentInfo: needsPayment ? {
        amount: paymentAmount,
        method: paymentMethod,
        excessKm
      } : null,
      status: 'Completed'
    };

    const updatedRequests = swapRequests.map(req => 
      req.id === selectedRequest.id 
        ? swapDetail
        : req
    );
    setSwapRequests(updatedRequests);

    // Cập nhật danh sách pin
    const updatedBatteries = availableBatteries.filter(
      bat => bat.id !== selectedNewBattery.id
    );
    setAvailableBatteries(updatedBatteries);

    // Đóng modal kiểm tra pin
    setShowBatteryCheckModal(false);

    // Hiển thị modal chi tiết hoàn thành
    setCompletedSwapDetail(swapDetail);
    setShowCompletedDetailModal(true);

    showNotification('✅ Đổi pin thành công! Đã cập nhật hệ thống.', 'success');
  };

  // Từ chối yêu cầu
  const handleRejectRequest = (requestId) => {
    if (window.confirm('Bạn có chắc muốn từ chối yêu cầu này?')) {
      const updatedRequests = swapRequests.map(req => 
        req.id === requestId 
          ? { ...req, status: 'Rejected' }
          : req
      );
      setSwapRequests(updatedRequests);
      showNotification('Đã từ chối yêu cầu', 'info');
    }
  };

  // Bắt đầu chỉnh sửa chi tiết
  const handleStartEditDetail = () => {
    setEditingDetailData({
      batteryCheckData: { ...completedSwapDetail.batteryCheckData },
      paymentInfo: completedSwapDetail.paymentInfo ? { ...completedSwapDetail.paymentInfo } : null
    });
    setIsEditingDetail(true);
  };

  // Lưu chỉnh sửa chi tiết
  const handleSaveEditDetail = () => {
    const updatedDetail = {
      ...completedSwapDetail,
      batteryCheckData: editingDetailData.batteryCheckData,
      paymentInfo: editingDetailData.paymentInfo
    };

    const updatedRequests = swapRequests.map(req =>
      req.id === completedSwapDetail.id ? updatedDetail : req
    );
    setSwapRequests(updatedRequests);
    setCompletedSwapDetail(updatedDetail);
    setIsEditingDetail(false);
    showNotification('✅ Đã cập nhật thông tin thành công!', 'success');
  };

  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    setIsEditingDetail(false);
    setEditingDetailData(null);
  };

  // Lọc yêu cầu pending
  const pendingRequests = swapRequests.filter(req => req.status === 'Pending');
  const completedRequests = swapRequests.filter(req => req.status === 'Completed');

  return (
    <div style={{ padding: '20px', background: '#1a202c', minHeight: '100vh', color: 'white' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ color: '#FFFFFF', marginBottom: '10px', fontSize: '28px' }}>✅ Xác nhận đổi pin</h1>
        <p style={{ color: '#E0E0E0', fontSize: '16px' }}>Xử lý các yêu cầu đổi pin từ Driver và cập nhật trạng thái pin</p>
      </div>

      {/* Notification */}
      {notification.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: notification.type === 'success' ? '#19c37d' : notification.type === 'error' ? '#ff4757' : '#6ab7ff',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          zIndex: 9999,
          animation: 'slideIn 0.3s ease'
        }}>
          {notification.message}
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
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffa500' }}>
            {pendingRequests.length}
          </div>
          <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
            Yêu cầu chờ xử lý
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
            {availableBatteries.length}
          </div>
          <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
            Pin sẵn sàng
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
            {completedRequests.length}
          </div>
          <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
            Đã hoàn thành
          </div>
        </div>
      </div>

      {/* Pending Requests Table */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        marginBottom: '30px'
      }}>
        <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '20px' }}>
          📋 Yêu cầu đổi pin chờ xử lý
        </h3>
        
        {pendingRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#B0B0B0' }}>
            Không có yêu cầu nào đang chờ xử lý
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                <tr>
                  <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Mã yêu cầu</th>
                  <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Tài xế</th>
                  <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Xe</th>
                  <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Pin cũ</th>
                  <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Gói</th>
                  <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Thời gian</th>
                  <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map(request => {
                  const needsPayment = request.kmLimit !== null && request.kmThisMonth > request.kmLimit;
                  const excessKm = needsPayment ? request.kmThisMonth - request.kmLimit : 0;
                  return (
                    <tr key={request.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '15px', color: '#6ab7ff', fontSize: '14px', fontWeight: 'bold' }}>
                        {request.id}
                      </td>
                      <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px' }}>
                        <div>{request.driverName}</div>
                        <div style={{ fontSize: '12px', color: '#B0B0B0' }}>{request.driverPhone}</div>
                      </td>
                      <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px' }}>
                        {request.vehicleNumber}
                      </td>
                      <td style={{ padding: '15px', fontSize: '14px', textAlign: 'center' }}>
                        <div style={{ color: '#E0E0E0', fontWeight: 'bold' }}>{request.oldBatteryId}</div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: request.oldBatterySOC < 10 ? '#ff4757' : request.oldBatterySOC < 20 ? '#ffa500' : '#19c37d' 
                        }}>
                          SOC: {request.oldBatterySOC}%
                        </div>
                      </td>
                      <td style={{ padding: '15px', fontSize: '14px', textAlign: 'center' }}>
                        <div style={{ color: '#E0E0E0' }}>{request.subscriptionType}</div>
                        <div style={{ fontSize: '12px', color: needsPayment ? '#ff4757' : '#19c37d' }}>
                          {request.kmThisMonth}{request.kmLimit ? `/${request.kmLimit}` : ''} km
                        </div>
                        {needsPayment && (
                          <div style={{ fontSize: '11px', color: '#ff4757', fontWeight: 'bold', marginTop: '2px' }}>
                            ⚠️ Vượt {excessKm} km
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '15px', color: '#B0B0B0', fontSize: '12px', textAlign: 'center' }}>
                        {request.requestTime}
                      </td>
                      <td style={{ padding: '15px', fontSize: '14px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                          <button 
                            onClick={() => handleConfirmSwap(request)}
                            style={{
                              background: 'linear-gradient(135deg, #19c37d, #16a085)',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 4px 15px rgba(25, 195, 125, 0.3)'
                            }}
                          >
                            ✅ Xác nhận
                          </button>
                          <button 
                            onClick={() => handleRejectRequest(request.id)}
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

      {/* Modal 1: Chọn pin mới */}
      {showConfirmModal && selectedRequest && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(26, 32, 44, 0.95)',
            borderRadius: '12px',
            padding: '30px',
            width: '800px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#FFFFFF', fontSize: '22px' }}>
              🔋 Chọn pin mới cho yêu cầu {selectedRequest.id}
            </h3>

            {/* Thông tin tài xế */}
            <div style={{
              background: 'rgba(106, 183, 255, 0.1)',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px',
              border: '1px solid rgba(106, 183, 255, 0.3)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <strong style={{ color: '#6ab7ff' }}>Tài xế:</strong> {selectedRequest.driverName}
                </div>
                <div>
                  <strong style={{ color: '#6ab7ff' }}>Xe:</strong> {selectedRequest.vehicleNumber}
                </div>
                <div>
                  <strong style={{ color: '#6ab7ff' }}>Pin cũ:</strong> {selectedRequest.oldBatteryId} (SOC: {selectedRequest.oldBatterySOC}%)
                </div>
                <div>
                  <strong style={{ color: '#6ab7ff' }}>Gói:</strong> {selectedRequest.subscriptionType}
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <strong style={{ color: '#6ab7ff' }}>Quãng đường:</strong> {selectedRequest.kmThisMonth}{selectedRequest.kmLimit ? `/${selectedRequest.kmLimit}` : ''} km
                  {selectedRequest.kmLimit !== null && selectedRequest.kmThisMonth > selectedRequest.kmLimit && (
                    <span style={{ color: '#ff4757', fontWeight: 'bold', marginLeft: '10px' }}>
                      ⚠️ Vượt {selectedRequest.kmThisMonth - selectedRequest.kmLimit} km
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Danh sách pin có sẵn */}
            <h4 style={{ color: '#FFFFFF', marginBottom: '15px' }}>Pin sẵn sàng:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px' }}>
              {availableBatteries.map(battery => (
                <div 
                  key={battery.id}
                  onClick={() => setSelectedNewBattery(battery)}
                  style={{
                    background: selectedNewBattery?.id === battery.id 
                      ? 'linear-gradient(135deg, #19c37d, #16a085)' 
                      : 'rgba(26, 32, 44, 0.8)',
                    borderRadius: '8px',
                    padding: '15px',
                    cursor: 'pointer',
                    border: selectedNewBattery?.id === battery.id 
                      ? '2px solid #19c37d' 
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔋</div>
                  <div style={{ color: '#FFFFFF', fontWeight: 'bold', marginBottom: '5px' }}>
                    {battery.id}
                  </div>
                  <div style={{ fontSize: '12px', color: '#E0E0E0' }}>
                    SOC: {battery.soc}%
                  </div>
                  <div style={{ fontSize: '12px', color: '#E0E0E0' }}>
                    SOH: {battery.soh}%
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedRequest(null);
                  setSelectedNewBattery(null);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#E0E0E0',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Hủy
              </button>
              <button 
                onClick={handleSelectBattery}
                disabled={!selectedNewBattery}
                style={{
                  background: selectedNewBattery 
                    ? 'linear-gradient(135deg, #19c37d, #16a085)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: selectedNewBattery ? 'pointer' : 'not-allowed',
                  opacity: selectedNewBattery ? 1 : 0.5
                }}
              >
                Tiếp tục →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Thanh toán (nếu vượt gói) */}
      {showPaymentModal && selectedRequest && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(26, 32, 44, 0.95)',
            borderRadius: '12px',
            padding: '30px',
            width: '500px',
            maxWidth: '90vw',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#FFFFFF', fontSize: '22px' }}>
              💳 Ghi nhận thanh toán
            </h3>

            <div style={{
              background: 'rgba(255, 165, 0, 0.1)',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px',
              border: '1px solid rgba(255, 165, 0, 0.3)'
            }}>
              <div style={{ color: '#ffa500', marginBottom: '10px', fontWeight: 'bold' }}>
                ⚠️ Tài xế đã vượt gói {selectedRequest.subscriptionType}
              </div>
              <div style={{ color: '#E0E0E0', marginBottom: '8px' }}>
                • Giới hạn gói: {selectedRequest.kmLimit} km/tháng
              </div>
              <div style={{ color: '#E0E0E0', marginBottom: '8px' }}>
                • Đã chạy: {selectedRequest.kmThisMonth} km
              </div>
              <div style={{ color: '#ff4757', fontWeight: 'bold' }}>
                • Vượt: {selectedRequest.kmThisMonth - selectedRequest.kmLimit} km
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                Số tiền (VNĐ) *
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  fontSize: '14px'
                }}
                placeholder="Nhập số tiền"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                Phương thức thanh toán *
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  fontSize: '14px'
                }}
              >
                <option value="Cash">Tiền mặt</option>
                <option value="Card">Thẻ</option>
                <option value="E-Wallet">Ví điện tử</option>
                <option value="Bank Transfer">Chuyển khoản</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => {
                  setShowPaymentModal(false);
                  setShowConfirmModal(true);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#E0E0E0',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ← Quay lại
              </button>
              <button 
                onClick={handlePayment}
                style={{
                  background: 'linear-gradient(135deg, #ffa500, #ff8c00)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Xác nhận thanh toán →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Kiểm tra pin cũ */}
      {showBatteryCheckModal && selectedRequest && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(26, 32, 44, 0.95)',
            borderRadius: '12px',
            padding: '30px',
            width: '600px',
            maxWidth: '90vw',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#FFFFFF', fontSize: '22px' }}>
              🔍 Kiểm tra pin cũ: {selectedRequest.oldBatteryId}
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                SOH - State of Health (%) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={batteryCheckData.soh}
                onChange={(e) => setBatteryCheckData({...batteryCheckData, soh: parseInt(e.target.value)})}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  fontSize: '14px'
                }}
                placeholder="Nhập SOH (0-100)"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                Tình trạng vật lý *
              </label>
              <select
                value={batteryCheckData.physicalCondition}
                onChange={(e) => setBatteryCheckData({...batteryCheckData, physicalCondition: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  fontSize: '14px'
                }}
              >
                <option value="Good">Tốt</option>
                <option value="Fair">Khá</option>
                <option value="Poor">Kém</option>
                <option value="Damaged">Hư hỏng</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                Ghi chú
              </label>
              <textarea
                value={batteryCheckData.notes}
                onChange={(e) => setBatteryCheckData({...batteryCheckData, notes: e.target.value})}
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="Ghi chú về tình trạng pin..."
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                color: '#E0E0E0', 
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={batteryCheckData.needsMaintenance}
                  onChange={(e) => setBatteryCheckData({...batteryCheckData, needsMaintenance: e.target.checked})}
                  style={{ marginRight: '8px' }}
                />
                Pin cần bảo trì (chuyển sang trạng thái Maintenance)
              </label>
            </div>

            {batteryCheckData.needsMaintenance && (
              <div style={{
                background: 'rgba(255, 71, 87, 0.1)',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 71, 87, 0.3)',
                color: '#ff4757'
              }}>
                ⚠️ Pin sẽ được chuyển sang trạng thái Maintenance và không thể sử dụng cho đến khi được sửa chữa
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => {
                  setShowBatteryCheckModal(false);
                  if (selectedRequest.swapsThisMonth >= selectedRequest.swapLimit) {
                    setShowPaymentModal(true);
                  } else {
                    setShowConfirmModal(true);
                  }
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#E0E0E0',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ← Quay lại
              </button>
              <button 
                onClick={handleCompleteSwap}
                disabled={batteryCheckData.soh === 0}
                style={{
                  background: batteryCheckData.soh > 0 
                    ? 'linear-gradient(135deg, #19c37d, #16a085)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: batteryCheckData.soh > 0 ? 'pointer' : 'not-allowed',
                  opacity: batteryCheckData.soh > 0 ? 1 : 0.5
                }}
              >
                ✅ Hoàn tất đổi pin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Chi tiết hoàn thành */}
      {showCompletedDetailModal && completedSwapDetail && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(26, 32, 44, 0.95)',
            borderRadius: '12px',
            padding: '30px',
            width: '700px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid rgba(25, 195, 125, 0.3)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 50px rgba(25, 195, 125, 0.3)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '64px', marginBottom: '15px' }}>✅</div>
              <h2 style={{ margin: '0 0 10px 0', color: '#19c37d', fontSize: '28px' }}>
                Đổi pin thành công!
              </h2>
              <p style={{ color: '#B0B0B0', fontSize: '14px', margin: 0 }}>
                Giao dịch đã được hoàn tất và cập nhật vào hệ thống
              </p>
            </div>

            {/* Thông tin giao dịch */}
            <div style={{
              background: 'rgba(25, 195, 125, 0.1)',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px',
              border: '1px solid rgba(25, 195, 125, 0.3)'
            }}>
              <h3 style={{ color: '#19c37d', marginBottom: '15px', fontSize: '18px' }}>
                📋 Thông tin giao dịch
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', color: '#E0E0E0', fontSize: '14px' }}>
                <div>
                  <strong style={{ color: '#6ab7ff' }}>Mã giao dịch:</strong> {completedSwapDetail.id}
                </div>
                <div>
                  <strong style={{ color: '#6ab7ff' }}>Thời gian hoàn thành:</strong> {completedSwapDetail.completedTime}
                </div>
                <div>
                  <strong style={{ color: '#6ab7ff' }}>Tài xế:</strong> {completedSwapDetail.driverName}
                </div>
                <div>
                  <strong style={{ color: '#6ab7ff' }}>SĐT:</strong> {completedSwapDetail.driverPhone}
                </div>
                <div>
                  <strong style={{ color: '#6ab7ff' }}>Biển số xe:</strong> {completedSwapDetail.vehicleNumber}
                </div>
                <div>
                  <strong style={{ color: '#6ab7ff' }}>Gói:</strong> {completedSwapDetail.subscriptionType}
                </div>
              </div>
            </div>

            {/* Thông tin pin */}
            <div style={{
              background: 'rgba(106, 183, 255, 0.1)',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px',
              border: '1px solid rgba(106, 183, 255, 0.3)'
            }}>
              <h3 style={{ color: '#6ab7ff', marginBottom: '15px', fontSize: '18px' }}>
                🔋 Thông tin pin
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', color: '#E0E0E0', fontSize: '14px' }}>
                <div>
                  <strong style={{ color: '#ff4757' }}>Pin cũ:</strong> {completedSwapDetail.oldBatteryId}
                  <div style={{ fontSize: '12px', color: '#B0B0B0', marginTop: '4px' }}>
                    SOC: {completedSwapDetail.oldBatterySOC}%
                  </div>
                </div>
                <div>
                  <strong style={{ color: '#19c37d' }}>Pin mới:</strong> {completedSwapDetail.newBatteryId}
                  <div style={{ fontSize: '12px', color: '#B0B0B0', marginTop: '4px' }}>
                    SOC: {completedSwapDetail.newBatterySOC}% | SOH: {completedSwapDetail.newBatterySOH}%
                  </div>
                </div>
              </div>
            </div>

            {/* Kiểm tra pin cũ */}
            <div style={{
              background: 'rgba(255, 165, 0, 0.1)',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px',
              border: '1px solid rgba(255, 165, 0, 0.3)'
            }}>
              <h3 style={{ color: '#ffa500', marginBottom: '15px', fontSize: '18px' }}>
                🔍 Kiểm tra pin cũ
              </h3>
              <div style={{ color: '#E0E0E0', fontSize: '14px' }}>
                {isEditingDetail ? (
                  <>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', color: '#ffa500', marginBottom: '5px', fontWeight: 'bold' }}>
                        SOH (%) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editingDetailData.batteryCheckData.soh}
                        onChange={(e) => setEditingDetailData({
                          ...editingDetailData,
                          batteryCheckData: {
                            ...editingDetailData.batteryCheckData,
                            soh: parseInt(e.target.value)
                          }
                        })}
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 165, 0, 0.3)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#FFFFFF',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', color: '#ffa500', marginBottom: '5px', fontWeight: 'bold' }}>
                        Tình trạng vật lý *
                      </label>
                      <select
                        value={editingDetailData.batteryCheckData.physicalCondition}
                        onChange={(e) => setEditingDetailData({
                          ...editingDetailData,
                          batteryCheckData: {
                            ...editingDetailData.batteryCheckData,
                            physicalCondition: e.target.value
                          }
                        })}
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 165, 0, 0.3)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#FFFFFF',
                          fontSize: '14px'
                        }}
                      >
                        <option value="Good">Tốt</option>
                        <option value="Fair">Khá</option>
                        <option value="Poor">Kém</option>
                        <option value="Damaged">Hư hỏng</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', color: '#ffa500', marginBottom: '5px', fontWeight: 'bold' }}>
                        Ghi chú
                      </label>
                      <textarea
                        value={editingDetailData.batteryCheckData.notes}
                        onChange={(e) => setEditingDetailData({
                          ...editingDetailData,
                          batteryCheckData: {
                            ...editingDetailData.batteryCheckData,
                            notes: e.target.value
                          }
                        })}
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 165, 0, 0.3)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: '#FFFFFF',
                          fontSize: '14px',
                          resize: 'vertical'
                        }}
                        placeholder="Ghi chú về tình trạng pin..."
                      />
                    </div>
                    <div>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: '#E0E0E0', 
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="checkbox"
                          checked={editingDetailData.batteryCheckData.needsMaintenance}
                          onChange={(e) => setEditingDetailData({
                            ...editingDetailData,
                            batteryCheckData: {
                              ...editingDetailData.batteryCheckData,
                              needsMaintenance: e.target.checked
                            }
                          })}
                          style={{ marginRight: '8px' }}
                        />
                        Pin cần bảo trì
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#ffa500' }}>SOH:</strong> {completedSwapDetail.batteryCheckData.soh}%
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#ffa500' }}>Tình trạng vật lý:</strong> {completedSwapDetail.batteryCheckData.physicalCondition}
                    </div>
                    {completedSwapDetail.batteryCheckData.notes && (
                      <div style={{ marginBottom: '8px' }}>
                        <strong style={{ color: '#ffa500' }}>Ghi chú:</strong> {completedSwapDetail.batteryCheckData.notes}
                      </div>
                    )}
                    {completedSwapDetail.batteryCheckData.needsMaintenance && (
                      <div style={{ 
                        background: 'rgba(255, 71, 87, 0.2)',
                        padding: '10px',
                        borderRadius: '6px',
                        marginTop: '10px',
                        color: '#ff4757',
                        fontWeight: 'bold'
                      }}>
                        ⚠️ Pin cần bảo trì - Đã chuyển sang trạng thái Maintenance
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Thông tin thanh toán */}
            {completedSwapDetail.paymentInfo && (
              <div style={{
                background: 'rgba(255, 215, 0, 0.1)',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 215, 0, 0.3)'
              }}>
                <h3 style={{ color: '#ffd700', marginBottom: '15px', fontSize: '18px' }}>
                  💰 Thông tin thanh toán
                </h3>
                <div style={{ color: '#E0E0E0', fontSize: '14px' }}>
                  {isEditingDetail ? (
                    <>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', color: '#ffd700', marginBottom: '5px', fontWeight: 'bold' }}>
                          Số tiền (VNĐ) *
                        </label>
                        <input
                          type="number"
                          value={editingDetailData.paymentInfo.amount}
                          onChange={(e) => setEditingDetailData({
                            ...editingDetailData,
                            paymentInfo: {
                              ...editingDetailData.paymentInfo,
                              amount: parseInt(e.target.value)
                            }
                          })}
                          style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 215, 0, 0.3)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: '#FFFFFF',
                            fontSize: '14px'
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', color: '#ffd700', marginBottom: '5px', fontWeight: 'bold' }}>
                          Phương thức thanh toán *
                        </label>
                        <select
                          value={editingDetailData.paymentInfo.method}
                          onChange={(e) => setEditingDetailData({
                            ...editingDetailData,
                            paymentInfo: {
                              ...editingDetailData.paymentInfo,
                              method: e.target.value
                            }
                          })}
                          style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 215, 0, 0.3)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: '#FFFFFF',
                            fontSize: '14px'
                          }}
                        >
                          <option value="Cash">Tiền mặt</option>
                          <option value="Card">Thẻ</option>
                          <option value="E-Wallet">Ví điện tử</option>
                          <option value="Bank Transfer">Chuyển khoản</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ marginBottom: '8px' }}>
                        <strong style={{ color: '#ffd700' }}>Quãng đường:</strong> {completedSwapDetail.kmThisMonth}/{completedSwapDetail.kmLimit} km
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <strong style={{ color: '#ffd700' }}>Vượt:</strong> {completedSwapDetail.paymentInfo.excessKm} km
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <strong style={{ color: '#ffd700' }}>Phương thức:</strong> {completedSwapDetail.paymentInfo.method}
                      </div>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: 'bold', 
                        color: '#ffd700',
                        marginTop: '12px',
                        padding: '10px',
                        background: 'rgba(255, 215, 0, 0.2)',
                        borderRadius: '6px',
                        textAlign: 'center'
                      }}>
                        Số tiền: {completedSwapDetail.paymentInfo.amount.toLocaleString()} VNĐ
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Nút action */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              {isEditingDetail ? (
                <>
                  <button 
                    onClick={handleCancelEdit}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#E0E0E0',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '12px 30px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={handleSaveEditDetail}
                    style={{
                      background: 'linear-gradient(135deg, #6ab7ff, #4a9eff)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 30px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(106, 183, 255, 0.3)'
                    }}
                  >
                    💾 Lưu thay đổi
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleStartEditDetail}
                    style={{
                      background: 'linear-gradient(135deg, #6ab7ff, #4a9eff)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 30px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(106, 183, 255, 0.3)'
                    }}
                  >
                    ✏️ Chỉnh sửa
                  </button>
                  <button 
                    onClick={() => {
                      setShowCompletedDetailModal(false);
                      setCompletedSwapDetail(null);
                      setIsEditingDetail(false);
                      setEditingDetailData(null);
                      setSelectedRequest(null);
                      setSelectedNewBattery(null);
                      setPaymentAmount(0);
                      setPaymentMethod('Cash');
                      setBatteryCheckData({
                        soh: 0,
                        physicalCondition: 'Good',
                        notes: '',
                        needsMaintenance: false
                      });
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #19c37d, #16a085)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 30px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(25, 195, 125, 0.3)'
                    }}
                  >
                    Đóng
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Completed Requests */}
      {completedRequests.length > 0 && (
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '20px' }}>
            ✅ Đã hoàn thành ({completedRequests.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {completedRequests.map(request => (
              <div 
                key={request.id} 
                onClick={() => {
                  setCompletedSwapDetail(request);
                  setShowCompletedDetailModal(true);
                }}
                style={{
                  background: 'rgba(25, 195, 125, 0.1)',
                  borderRadius: '8px',
                  padding: '15px',
                  border: '1px solid rgba(25, 195, 125, 0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(25, 195, 125, 0.2)';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(25, 195, 125, 0.1)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div>
                  <div style={{ color: '#19c37d', fontWeight: 'bold' }}>{request.id}</div>
                  <div style={{ color: '#E0E0E0', fontSize: '14px' }}>
                    {request.driverName} - {request.vehicleNumber}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ color: '#B0B0B0', fontSize: '12px' }}>
                    {request.completedTime || request.requestTime}
                  </div>
                  <div style={{ color: '#6ab7ff', fontSize: '12px', fontWeight: 'bold' }}>
                    👁️ Xem chi tiết
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffSwapConfirm;