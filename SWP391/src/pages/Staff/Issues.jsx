// Staff Issues Management
// Xử lý sự cố - Tiếp nhận và xử lý báo cáo sự cố từ Driver

import React, { useState, useEffect } from 'react';

const StaffIssues = () => {
  // Mock data - Danh sách sự cố
  const [issues, setIssues] = useState([
    {
      id: 'ISS001',
      driverId: 'DRV001',
      driverName: 'Nguyễn Văn A',
      driverPhone: '0901234567',
      vehicleNumber: '59A-12345',
      issueType: 'Battery',
      title: 'Pin không sạc được',
      description: 'Pin mới đổi không sạc được, đèn báo lỗi',
      batteryId: 'BAT-101',
      stationId: 'STN001',
      stationName: 'Trạm Quận 1',
      reportedTime: '2024-10-05 10:30',
      status: 'Pending', // Pending, In Progress, Resolved, Rejected
      priority: 'High', // Low, Medium, High, Critical
      assignedTo: null,
      resolutionNote: '',
      resolvedTime: null,
      resolutionType: null // Replace Battery, Refund, Technical Support, Other
    },
    {
      id: 'ISS002',
      driverId: 'DRV002',
      driverName: 'Trần Thị B',
      driverPhone: '0912345678',
      vehicleNumber: '59B-67890',
      issueType: 'Payment',
      title: 'Bị tính tiền sai',
      description: 'Đã thanh toán 50,000 VNĐ nhưng hệ thống báo chưa thanh toán',
      batteryId: null,
      stationId: 'STN001',
      stationName: 'Trạm Quận 1',
      reportedTime: '2024-10-05 11:00',
      status: 'Pending',
      priority: 'Medium',
      assignedTo: null,
      resolutionNote: '',
      resolvedTime: null,
      resolutionType: null
    },
    {
      id: 'ISS003',
      driverId: 'DRV003',
      driverName: 'Lê Văn C',
      driverPhone: '0923456789',
      vehicleNumber: '59C-11111',
      issueType: 'Station',
      title: 'Trạm không có pin',
      description: 'Đến trạm nhưng không có pin nào sẵn sàng',
      batteryId: null,
      stationId: 'STN001',
      stationName: 'Trạm Quận 1',
      reportedTime: '2024-10-05 09:00',
      status: 'In Progress',
      priority: 'High',
      assignedTo: 'Staff001',
      resolutionNote: 'Đang kiểm tra kho pin',
      resolvedTime: null,
      resolutionType: null
    }
  ]);

  // State cho modal xử lý
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [processingData, setProcessingData] = useState({
    status: 'In Progress',
    resolutionType: '',
    resolutionNote: '',
    assignedTo: 'Staff001' // Mock staff ID
  });

  // State cho modal chi tiết
  const [showDetailModal, setShowDetailModal] = useState(false);

  // State cho filter
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // State cho thông báo
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Hiển thị thông báo
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  // Mở modal xử lý
  const handleOpenProcessModal = (issue) => {
    setSelectedIssue(issue);
    setProcessingData({
      status: issue.status === 'Pending' ? 'In Progress' : issue.status,
      resolutionType: issue.resolutionType || '',
      resolutionNote: issue.resolutionNote || '',
      assignedTo: issue.assignedTo || 'Staff001'
    });
    setShowProcessModal(true);
  };

  // Xử lý sự cố
  const handleProcessIssue = () => {
    if (processingData.status === 'Resolved' && !processingData.resolutionType) {
      showNotification('Vui lòng chọn hình thức xử lý!', 'error');
      return;
    }

    if (processingData.status === 'Resolved' && !processingData.resolutionNote.trim()) {
      showNotification('Vui lòng nhập ghi chú xử lý!', 'error');
      return;
    }

    const updatedIssue = {
      ...selectedIssue,
      status: processingData.status,
      resolutionType: processingData.resolutionType,
      resolutionNote: processingData.resolutionNote,
      assignedTo: processingData.assignedTo,
      resolvedTime: processingData.status === 'Resolved' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : null
    };

    const updatedIssues = issues.map(issue =>
      issue.id === selectedIssue.id ? updatedIssue : issue
    );
    setIssues(updatedIssues);

    setShowProcessModal(false);
    setSelectedIssue(null);
    
    const statusText = processingData.status === 'In Progress' ? 'đang xử lý' : 
                       processingData.status === 'Resolved' ? 'đã hoàn thành' : 'đã từ chối';
    showNotification(`✅ Đã cập nhật sự cố ${selectedIssue.id} - ${statusText}`, 'success');
  };

  // Từ chối sự cố
  const handleRejectIssue = () => {
    if (!processingData.resolutionNote.trim()) {
      showNotification('Vui lòng nhập lý do từ chối!', 'error');
      return;
    }

    const updatedIssue = {
      ...selectedIssue,
      status: 'Rejected',
      resolutionNote: processingData.resolutionNote,
      resolvedTime: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    const updatedIssues = issues.map(issue =>
      issue.id === selectedIssue.id ? updatedIssue : issue
    );
    setIssues(updatedIssues);

    setShowProcessModal(false);
    setSelectedIssue(null);
    showNotification(`Đã từ chối sự cố ${selectedIssue.id}`, 'info');
  };

  // Lọc issues
  const filteredIssues = issues.filter(issue => {
    const matchStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
    return matchStatus && matchPriority;
  });

  // Thống kê
  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'Pending').length,
    inProgress: issues.filter(i => i.status === 'In Progress').length,
    resolved: issues.filter(i => i.status === 'Resolved').length,
    rejected: issues.filter(i => i.status === 'Rejected').length
  };

  // Priority colors
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return '#ff4757';
      case 'High': return '#ffa500';
      case 'Medium': return '#6ab7ff';
      case 'Low': return '#19c37d';
      default: return '#B0B0B0';
    }
  };

  // Status colors
  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return '#ffa500';
      case 'In Progress': return '#6ab7ff';
      case 'Resolved': return '#19c37d';
      case 'Rejected': return '#ff4757';
      default: return '#B0B0B0';
    }
  };

  return (
    <div style={{ padding: '20px', background: '#1a202c', minHeight: '100vh', color: 'white' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ color: '#FFFFFF', marginBottom: '10px', fontSize: '28px' }}>🚨 Xử lý sự cố</h1>
        <p style={{ color: '#E0E0E0', fontSize: '16px' }}>Quản lý và xử lý báo cáo sự cố từ Driver</p>
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
          zIndex: 9999
        }}>
          {notification.message}
        </div>
      )}

      {/* Statistics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6ab7ff' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
            Tổng sự cố
          </div>
        </div>
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          textAlign: 'center',
          border: '1px solid rgba(255, 165, 0, 0.3)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffa500' }}>
            {stats.pending}
          </div>
          <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
            Chờ xử lý
          </div>
        </div>
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          textAlign: 'center',
          border: '1px solid rgba(106, 183, 255, 0.3)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6ab7ff' }}>
            {stats.inProgress}
          </div>
          <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
            Đang xử lý
          </div>
        </div>
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          textAlign: 'center',
          border: '1px solid rgba(25, 195, 125, 0.3)'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#19c37d' }}>
            {stats.resolved}
          </div>
          <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
            Đã giải quyết
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{ display: 'block', color: '#E0E0E0', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
            Trạng thái:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
            <option value="all">Tất cả</option>
            <option value="Pending">Chờ xử lý</option>
            <option value="In Progress">Đang xử lý</option>
            <option value="Resolved">Đã giải quyết</option>
            <option value="Rejected">Đã từ chối</option>
          </select>
        </div>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{ display: 'block', color: '#E0E0E0', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
            Độ ưu tiên:
          </label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
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
            <option value="all">Tất cả</option>
            <option value="Critical">Khẩn cấp</option>
            <option value="High">Cao</option>
            <option value="Medium">Trung bình</option>
            <option value="Low">Thấp</option>
          </select>
        </div>
      </div>

      {/* Issues Table */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '20px' }}>
          📋 Danh sách sự cố ({filteredIssues.length})
        </h3>
        
        {filteredIssues.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#B0B0B0' }}>
            Không có sự cố nào
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                <tr>
                  <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Mã sự cố</th>
                  <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Tài xế</th>
                  <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Loại</th>
                  <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Tiêu đề</th>
                  <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Độ ưu tiên</th>
                  <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Trạng thái</th>
                  <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Thời gian</th>
                  <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map(issue => (
                  <tr key={issue.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '15px', color: '#6ab7ff', fontSize: '14px', fontWeight: 'bold' }}>
                      {issue.id}
                    </td>
                    <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px' }}>
                      <div>{issue.driverName}</div>
                      <div style={{ fontSize: '12px', color: '#B0B0B0' }}>{issue.driverPhone}</div>
                      <div style={{ fontSize: '12px', color: '#B0B0B0' }}>{issue.vehicleNumber}</div>
                    </td>
                    <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px' }}>
                      {issue.issueType}
                    </td>
                    <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px' }}>
                      <div style={{ fontWeight: 'bold' }}>{issue.title}</div>
                      <div style={{ fontSize: '12px', color: '#B0B0B0', marginTop: '4px' }}>
                        {issue.description.substring(0, 50)}...
                      </div>
                    </td>
                    <td style={{ padding: '15px', fontSize: '14px', textAlign: 'center' }}>
                      <span style={{
                        background: `${getPriorityColor(issue.priority)}20`,
                        color: getPriorityColor(issue.priority),
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        border: `1px solid ${getPriorityColor(issue.priority)}40`
                      }}>
                        {issue.priority}
                      </span>
                    </td>
                    <td style={{ padding: '15px', fontSize: '14px', textAlign: 'center' }}>
                      <span style={{
                        background: `${getStatusColor(issue.status)}20`,
                        color: getStatusColor(issue.status),
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        border: `1px solid ${getStatusColor(issue.status)}40`
                      }}>
                        {issue.status}
                      </span>
                    </td>
                    <td style={{ padding: '15px', color: '#B0B0B0', fontSize: '12px', textAlign: 'center' }}>
                      {issue.reportedTime}
                    </td>
                    <td style={{ padding: '15px', fontSize: '14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button 
                          onClick={() => {
                            setSelectedIssue(issue);
                            setShowDetailModal(true);
                          }}
                          style={{
                            background: 'linear-gradient(135deg, #6ab7ff, #4a9eff)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          👁️ Chi tiết
                        </button>
                        {issue.status !== 'Resolved' && issue.status !== 'Rejected' && (
                          <button 
                            onClick={() => handleOpenProcessModal(issue)}
                            style={{
                              background: 'linear-gradient(135deg, #19c37d, #16a085)',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              cursor: 'pointer'
                            }}
                          >
                            🔧 Xử lý
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Chi tiết sự cố */}
      {showDetailModal && selectedIssue && (
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
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#FFFFFF', fontSize: '22px' }}>
              📋 Chi tiết sự cố {selectedIssue.id}
            </h3>

            <div style={{
              background: 'rgba(106, 183, 255, 0.1)',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '15px',
              border: '1px solid rgba(106, 183, 255, 0.3)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', color: '#E0E0E0', fontSize: '14px' }}>
                <div><strong style={{ color: '#6ab7ff' }}>Tài xế:</strong> {selectedIssue.driverName}</div>
                <div><strong style={{ color: '#6ab7ff' }}>SĐT:</strong> {selectedIssue.driverPhone}</div>
                <div><strong style={{ color: '#6ab7ff' }}>Xe:</strong> {selectedIssue.vehicleNumber}</div>
                <div><strong style={{ color: '#6ab7ff' }}>Loại:</strong> {selectedIssue.issueType}</div>
                {selectedIssue.batteryId && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong style={{ color: '#6ab7ff' }}>Pin:</strong> {selectedIssue.batteryId}
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '8px' }}>Tiêu đề:</strong>
              <div style={{ color: '#E0E0E0' }}>{selectedIssue.title}</div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '8px' }}>Mô tả:</strong>
              <div style={{ color: '#E0E0E0', lineHeight: '1.6' }}>{selectedIssue.description}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '8px' }}>Độ ưu tiên:</strong>
                <span style={{
                  background: `${getPriorityColor(selectedIssue.priority)}20`,
                  color: getPriorityColor(selectedIssue.priority),
                  padding: '6px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  border: `1px solid ${getPriorityColor(selectedIssue.priority)}40`,
                  display: 'inline-block'
                }}>
                  {selectedIssue.priority}
                </span>
              </div>
              <div>
                <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '8px' }}>Trạng thái:</strong>
                <span style={{
                  background: `${getStatusColor(selectedIssue.status)}20`,
                  color: getStatusColor(selectedIssue.status),
                  padding: '6px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  border: `1px solid ${getStatusColor(selectedIssue.status)}40`,
                  display: 'inline-block'
                }}>
                  {selectedIssue.status}
                </span>
              </div>
            </div>

            {selectedIssue.resolutionNote && (
              <div style={{
                background: 'rgba(25, 195, 125, 0.1)',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px',
                border: '1px solid rgba(25, 195, 125, 0.3)'
              }}>
                <strong style={{ color: '#19c37d', display: 'block', marginBottom: '8px' }}>Ghi chú xử lý:</strong>
                <div style={{ color: '#E0E0E0', lineHeight: '1.6' }}>{selectedIssue.resolutionNote}</div>
                {selectedIssue.resolutionType && (
                  <div style={{ marginTop: '8px', color: '#19c37d', fontSize: '14px' }}>
                    <strong>Hình thức:</strong> {selectedIssue.resolutionType}
                  </div>
                )}
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedIssue(null);
                }}
                style={{
                  background: 'linear-gradient(135deg, #6ab7ff, #4a9eff)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 30px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Xử lý sự cố */}
      {showProcessModal && selectedIssue && (
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
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#FFFFFF', fontSize: '22px' }}>
              🔧 Xử lý sự cố {selectedIssue.id}
            </h3>

            <div style={{
              background: 'rgba(255, 165, 0, 0.1)',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px',
              border: '1px solid rgba(255, 165, 0, 0.3)'
            }}>
              <div style={{ color: '#ffa500', fontWeight: 'bold', marginBottom: '8px' }}>
                {selectedIssue.title}
              </div>
              <div style={{ color: '#E0E0E0', fontSize: '14px' }}>
                {selectedIssue.description}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#FFFFFF', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                Trạng thái *
              </label>
              <select
                value={processingData.status}
                onChange={(e) => setProcessingData({...processingData, status: e.target.value})}
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
                <option value="In Progress">Đang xử lý</option>
                <option value="Resolved">Đã giải quyết</option>
              </select>
            </div>

            {processingData.status === 'Resolved' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#FFFFFF', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                  Hình thức xử lý *
                </label>
                <select
                  value={processingData.resolutionType}
                  onChange={(e) => setProcessingData({...processingData, resolutionType: e.target.value})}
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
                  <option value="">-- Chọn hình thức --</option>
                  <option value="Replace Battery">Đổi pin</option>
                  <option value="Refund">Hoàn tiền</option>
                  <option value="Technical Support">Hỗ trợ kỹ thuật</option>
                  <option value="Other">Khác</option>
                </select>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#FFFFFF', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                Ghi chú xử lý {processingData.status === 'Resolved' ? '*' : ''}
              </label>
              <textarea
                value={processingData.resolutionNote}
                onChange={(e) => setProcessingData({...processingData, resolutionNote: e.target.value})}
                rows={4}
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
                placeholder="Nhập ghi chú về cách xử lý sự cố..."
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => {
                  setShowProcessModal(false);
                  setSelectedIssue(null);
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
              {selectedIssue.status === 'Pending' && (
                <button 
                  onClick={handleRejectIssue}
                  style={{
                    background: 'linear-gradient(135deg, #ff4757, #ff3742)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  ❌ Từ chối
                </button>
              )}
              <button 
                onClick={handleProcessIssue}
                style={{
                  background: 'linear-gradient(135deg, #19c37d, #16a085)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                ✅ Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffIssues;