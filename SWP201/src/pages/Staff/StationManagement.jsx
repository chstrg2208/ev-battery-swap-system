// Staff Station Management
// CRUD operations for battery swap stations with detailed features

import React, { useState } from 'react';
import darkTheme, { buttonHoverEffects, buttonLeaveEffects } from '../../utils/darkTheme';

const StaffStationManagement = () => {
  const [stations, setStations] = useState([
    {
      id: 1,
      name: "Trạm đổi pin Quận 1",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      status: "Hoạt động",
      totalSlots: 20,
      availableSlots: 15,
      coordinates: { lat: 10.7769, lng: 106.7009 },
      phone: "028-1234-5678",
      manager: "Nguyễn Văn A",
      capacity: "20 slots",
      todayTransactions: 45,
      totalBatteries: 18,
      availableBatteries: 15,
      chargingBatteries: 3,
      maintenanceBatteries: 0,
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-02-10",
      operatingHours: "24/7",
      services: ["Đổi pin", "Sạc nhanh", "Bảo trì"],
      rating: 4.8,
      totalTransactions: 1250
    },
    {
      id: 2,
      name: "Trạm đổi pin Quận 3",
      address: "456 Lê Văn Sỹ, Quận 3, TP.HCM",
      status: "Bảo trì",
      totalSlots: 15,
      availableSlots: 0,
      coordinates: { lat: 10.7829, lng: 106.6934 },
      phone: "028-2345-6789",
      manager: "Trần Thị B",
      capacity: "15 slots",
      todayTransactions: 0,
      totalBatteries: 12,
      availableBatteries: 0,
      chargingBatteries: 8,
      maintenanceBatteries: 4,
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-01-20",
      operatingHours: "Tạm ngưng",
      services: ["Đổi pin", "Sạc nhanh"],
      rating: 4.5,
      totalTransactions: 890
    },
    {
      id: 3,
      name: "Trạm đổi pin Quận 7",
      address: "789 Nguyễn Thị Thập, Quận 7, TP.HCM",
      status: "Hoạt động",
      totalSlots: 25,
      availableSlots: 18,
      coordinates: { lat: 10.7374, lng: 106.7223 },
      phone: "028-3456-7890",
      manager: "Lê Văn C",
      capacity: "25 slots",
      todayTransactions: 67,
      totalBatteries: 22,
      availableBatteries: 18,
      chargingBatteries: 4,
      maintenanceBatteries: 0,
      lastMaintenance: "2024-01-08",
      nextMaintenance: "2024-02-08",
      operatingHours: "6:00 - 22:00",
      services: ["Đổi pin", "Sạc nhanh", "Bảo trì", "Hỗ trợ 24/7"],
      rating: 4.9,
      totalTransactions: 2100
    },
    {
      id: 4,
      name: "Trạm đổi pin Quận 10",
      address: "321 Cách Mạng Tháng 8, Quận 10, TP.HCM",
      status: "Hoạt động",
      totalSlots: 18,
      availableSlots: 12,
      coordinates: { lat: 10.7720, lng: 106.6663 },
      phone: "028-4567-8901",
      manager: "Phạm Thị D",
      capacity: "18 slots",
      todayTransactions: 34,
      totalBatteries: 16,
      availableBatteries: 12,
      chargingBatteries: 3,
      maintenanceBatteries: 1,
      lastMaintenance: "2024-01-12",
      nextMaintenance: "2024-02-12",
      operatingHours: "5:30 - 23:30",
      services: ["Đổi pin", "Sạc nhanh"],
      rating: 4.6,
      totalTransactions: 1560
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [editingStation, setEditingStation] = useState({
    name: '',
    address: '',
    phone: '',
    manager: '',
    totalSlots: 0,
    operatingHours: '',
    services: []
  });

  // User role simulation (in real app, this would come from auth context)
  const currentUserRole = 'staff'; // 'staff', 'manager', 'admin'
  const canEditStations = ['manager', 'admin'].includes(currentUserRole);
  const canDeleteStations = ['admin'].includes(currentUserRole);
  const canAddStations = ['admin'].includes(currentUserRole);

  const handleAddStation = () => {
    const newStation = {
      id: stations.length + 1,
      ...editingStation,
      status: "Hoạt động",
      availableSlots: editingStation.totalSlots,
      coordinates: { lat: 10.7769, lng: 106.7009 },
      todayTransactions: 0,
      totalBatteries: editingStation.totalSlots,
      availableBatteries: editingStation.totalSlots,
      chargingBatteries: 0,
      maintenanceBatteries: 0,
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      rating: 0,
      totalTransactions: 0,
      capacity: `${editingStation.totalSlots} slots`
    };
    setStations([...stations, newStation]);
    setShowAddModal(false);
    setEditingStation({ name: '', address: '', phone: '', manager: '', totalSlots: 0, operatingHours: '', services: [] });
  };

  const handleEditStation = () => {
    setStations(stations.map(station => 
      station.id === selectedStation.id 
        ? { ...station, ...editingStation, availableSlots: editingStation.totalSlots, capacity: `${editingStation.totalSlots} slots` }
        : station
    ));
    setShowEditModal(false);
    setSelectedStation(null);
    setEditingStation({ name: '', address: '', phone: '', manager: '', totalSlots: 0, operatingHours: '', services: [] });
  };

  const handleDeleteStation = (stationId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa trạm này? Hành động này không thể hoàn tác.')) {
      setStations(stations.filter(station => station.id !== stationId));
    }
  };

  const openEditModal = (station) => {
    setSelectedStation(station);
    setEditingStation({
      name: station.name,
      address: station.address,
      phone: station.phone,
      manager: station.manager,
      totalSlots: station.totalSlots,
      operatingHours: station.operatingHours,
      services: station.services
    });
    setShowEditModal(true);
  };

  const openDetailModal = (station) => {
    setSelectedStation(station);
    setShowDetailModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hoạt động': return '#19c37d';
      case 'Bảo trì': return '#ffa500';
      case 'Ngừng hoạt động': return '#ff4757';
      default: return '#6c757d';
    }
  };

  const getCapacityColor = (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage >= 70) return '#19c37d';
    if (percentage >= 30) return '#ffa500';
    return '#ff4757';
  };

  // Statistics
  const getStationStats = () => {
    const stats = {
      total: stations.length,
      active: stations.filter(s => s.status === 'Hoạt động').length,
      maintenance: stations.filter(s => s.status === 'Bảo trì').length,
      totalTransactions: stations.reduce((sum, s) => sum + s.todayTransactions, 0),
      totalBatteries: stations.reduce((sum, s) => sum + s.totalBatteries, 0),
      availableBatteries: stations.reduce((sum, s) => sum + s.availableBatteries, 0)
    };
    return stats;
  };

  const stats = getStationStats();

  return (
    <div className="staff-station-management" style={{ padding: '20px' }}>
      <div className="page-header" style={darkTheme.components.pageHeader}>
        <h1 style={darkTheme.components.pageTitle}>🏢 Quản lý trạm đổi pin</h1>
        <p style={darkTheme.components.pageSubtitle}>Quản lý thông tin các trạm đổi pin trong hệ thống</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-cards" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div style={darkTheme.components.statsCard}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: darkTheme.colors.primary }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '14px', color: darkTheme.colors.secondary, marginTop: '5px' }}>
            Tổng số trạm
          </div>
        </div>
        <div style={darkTheme.components.statsCard}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#19c37d' }}>
            {stats.active}
          </div>
          <div style={{ fontSize: '14px', color: darkTheme.colors.secondary, marginTop: '5px' }}>
            Đang hoạt động
          </div>
        </div>
        <div style={darkTheme.components.statsCard}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffa500' }}>
            {stats.maintenance}
          </div>
          <div style={{ fontSize: '14px', color: darkTheme.colors.secondary, marginTop: '5px' }}>
            Đang bảo trì
          </div>
        </div>
        <div style={darkTheme.components.statsCard}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6ab7ff' }}>
            {stats.totalTransactions}
          </div>
          <div style={{ fontSize: '14px', color: darkTheme.colors.secondary, marginTop: '5px' }}>
            Giao dịch hôm nay
          </div>
        </div>
        <div style={darkTheme.components.statsCard}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9c88ff' }}>
            {stats.totalBatteries}
          </div>
          <div style={{ fontSize: '14px', color: darkTheme.colors.secondary, marginTop: '5px' }}>
            Tổng số pin
          </div>
        </div>
        <div style={darkTheme.components.statsCard}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#19c37d' }}>
            {stats.availableBatteries}
          </div>
          <div style={{ fontSize: '14px', color: darkTheme.colors.secondary, marginTop: '5px' }}>
            Pin sẵn sàng
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons" style={{ marginBottom: '20px' }}>
        {canAddStations && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
            style={darkTheme.components.button.primary}
            onMouseEnter={(e) => buttonHoverEffects.primary(e)}
            onMouseLeave={(e) => buttonLeaveEffects.primary(e)}
          >
            ➕ Thêm trạm mới
          </button>
        )}
        {!canAddStations && (
          <div style={{ 
            padding: '10px 20px', 
            background: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: '8px', 
            color: darkTheme.colors.muted,
            fontSize: '14px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            ⚠️ Chỉ Admin/Manager mới có thể thêm trạm mới
          </div>
        )}
      </div>

      {/* Stations Table */}
      <div className="stations-table" style={darkTheme.components.table}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: darkTheme.colors.borderLight }}>
            <tr>
              <th style={{ ...darkTheme.components.tableHeader, textAlign: 'left' }}>Tên trạm</th>
              <th style={{ ...darkTheme.components.tableHeader, textAlign: 'left' }}>Địa chỉ</th>
              <th style={{ ...darkTheme.components.tableHeader, textAlign: 'center' }}>Sức chứa</th>
              <th style={{ ...darkTheme.components.tableHeader, textAlign: 'center' }}>Trạng thái</th>
              <th style={{ ...darkTheme.components.tableHeader, textAlign: 'center' }}>GD hôm nay</th>
              <th style={{ ...darkTheme.components.tableHeader, textAlign: 'left' }}>Quản lý</th>
              <th style={{ ...darkTheme.components.tableHeader, textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {stations.map(station => (
              <tr key={station.id} style={darkTheme.components.tableRow}>
                <td style={darkTheme.components.tableCell}>
                  <div style={{ fontWeight: 'bold', color: darkTheme.colors.primary }}>{station.name}</div>
                  <div style={{ fontSize: '12px', color: darkTheme.colors.muted }}>{station.phone}</div>
                </td>
                <td style={darkTheme.components.tableCell}>
                  <div style={{ color: darkTheme.colors.secondary }}>{station.address}</div>
                  <div style={{ fontSize: '12px', color: darkTheme.colors.muted }}>{station.operatingHours}</div>
                </td>
                <td style={{ ...darkTheme.components.tableCell, textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: getCapacityColor(station.availableSlots, station.totalSlots) }}>
                    {station.availableSlots}/{station.totalSlots}
                  </div>
                  <div style={{ fontSize: '12px', color: darkTheme.colors.muted }}>{station.capacity}</div>
                </td>
                <td style={{ ...darkTheme.components.tableCell, textAlign: 'center' }}>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'white',
                    background: getStatusColor(station.status)
                  }}>
                    {station.status}
                  </span>
                </td>
                <td style={{ ...darkTheme.components.tableCell, textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#6ab7ff' }}>
                    {station.todayTransactions}
                  </div>
                  <div style={{ fontSize: '12px', color: darkTheme.colors.muted }}>
                    ⭐ {station.rating}
                  </div>
                </td>
                <td style={darkTheme.components.tableCell}>
                  <div style={{ color: darkTheme.colors.secondary }}>{station.manager}</div>
                </td>
                <td style={{ ...darkTheme.components.tableCell, textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => openDetailModal(station)}
                      style={darkTheme.components.button.info}
                      onMouseEnter={(e) => buttonHoverEffects.info(e)}
                      onMouseLeave={(e) => buttonLeaveEffects.info(e)}
                    >
                      👁️ Chi tiết
                    </button>
                    {canEditStations && (
                      <button 
                        onClick={() => openEditModal(station)}
                        style={darkTheme.components.button.warning}
                        onMouseEnter={(e) => buttonHoverEffects.warning(e)}
                        onMouseLeave={(e) => buttonLeaveEffects.warning(e)}
                      >
                        ✏️ Sửa
                      </button>
                    )}
                    {canDeleteStations && (
                      <button 
                        onClick={() => handleDeleteStation(station.id)}
                        style={darkTheme.components.button.danger}
                        onMouseEnter={(e) => buttonHoverEffects.danger(e)}
                        onMouseLeave={(e) => buttonLeaveEffects.danger(e)}
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

      {/* Add Station Modal */}
      {showAddModal && (
        <div className="modal" style={{
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
          <div className="modal-content" style={darkTheme.components.modal}>
            <div className="modal-header" style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#FFFFFF' }}>Thêm trạm mới</h3>
            </div>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={darkTheme.components.label}>Tên trạm</label>
              <input
                type="text"
                value={editingStation.name}
                onChange={(e) => setEditingStation({...editingStation, name: e.target.value})}
                style={darkTheme.components.input}
                placeholder="Nhập tên trạm"
              />
            </div>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={darkTheme.components.label}>Địa chỉ</label>
              <input
                type="text"
                value={editingStation.address}
                onChange={(e) => setEditingStation({...editingStation, address: e.target.value})}
                style={darkTheme.components.input}
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={darkTheme.components.label}>Số điện thoại</label>
              <input
                type="text"
                value={editingStation.phone}
                onChange={(e) => setEditingStation({...editingStation, phone: e.target.value})}
                style={darkTheme.components.input}
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={darkTheme.components.label}>Người quản lý</label>
              <input
                type="text"
                value={editingStation.manager}
                onChange={(e) => setEditingStation({...editingStation, manager: e.target.value})}
                style={darkTheme.components.input}
                placeholder="Nhập tên người quản lý"
              />
            </div>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={darkTheme.components.label}>Tổng số slot</label>
              <input
                type="number"
                value={editingStation.totalSlots}
                onChange={(e) => setEditingStation({...editingStation, totalSlots: parseInt(e.target.value)})}
                style={darkTheme.components.input}
                placeholder="Nhập số slot"
              />
            </div>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={darkTheme.components.label}>Giờ hoạt động</label>
              <input
                type="text"
                value={editingStation.operatingHours}
                onChange={(e) => setEditingStation({...editingStation, operatingHours: e.target.value})}
                style={darkTheme.components.input}
                placeholder="VD: 6:00 - 22:00 hoặc 24/7"
              />
            </div>
            <div className="modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={darkTheme.components.button.secondary}
                onMouseEnter={(e) => buttonHoverEffects.secondary(e)}
                onMouseLeave={(e) => buttonLeaveEffects.secondary(e)}
              >
                Hủy
              </button>
              <button
                onClick={handleAddStation}
                style={darkTheme.components.button.primary}
                onMouseEnter={(e) => buttonHoverEffects.primary(e)}
                onMouseLeave={(e) => buttonLeaveEffects.primary(e)}
              >
                Thêm trạm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Station Modal */}
      {showEditModal && selectedStation && (
        <div className="modal" style={{
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
          <div className="modal-content" style={darkTheme.components.modal}>
            <div className="modal-header" style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#FFFFFF' }}>Sửa thông tin trạm</h3>
            </div>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={darkTheme.components.label}>Tên trạm</label>
              <input
                type="text"
                value={editingStation.name}
                onChange={(e) => setEditingStation({...editingStation, name: e.target.value})}
                style={darkTheme.components.input}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={darkTheme.components.label}>Địa chỉ</label>
              <input
                type="text"
                value={editingStation.address}
                onChange={(e) => setEditingStation({...editingStation, address: e.target.value})}
                style={darkTheme.components.input}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={darkTheme.components.label}>Số điện thoại</label>
              <input
                type="text"
                value={editingStation.phone}
                onChange={(e) => setEditingStation({...editingStation, phone: e.target.value})}
                style={darkTheme.components.input}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={darkTheme.components.label}>Người quản lý</label>
              <input
                type="text"
                value={editingStation.manager}
                onChange={(e) => setEditingStation({...editingStation, manager: e.target.value})}
                style={darkTheme.components.input}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={darkTheme.components.label}>Tổng số slot</label>
              <input
                type="number"
                value={editingStation.totalSlots}
                onChange={(e) => setEditingStation({...editingStation, totalSlots: parseInt(e.target.value)})}
                style={darkTheme.components.input}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={darkTheme.components.label}>Giờ hoạt động</label>
              <input
                type="text"
                value={editingStation.operatingHours}
                onChange={(e) => setEditingStation({...editingStation, operatingHours: e.target.value})}
                style={darkTheme.components.input}
              />
            </div>
            <div className="modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowEditModal(false)}
                style={darkTheme.components.button.secondary}
                onMouseEnter={(e) => buttonHoverEffects.secondary(e)}
                onMouseLeave={(e) => buttonLeaveEffects.secondary(e)}
              >
                Hủy
              </button>
              <button
                onClick={handleEditStation}
                style={darkTheme.components.button.primary}
                onMouseEnter={(e) => buttonHoverEffects.primary(e)}
                onMouseLeave={(e) => buttonLeaveEffects.primary(e)}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Station Modal */}
      {showDetailModal && selectedStation && (
        <div className="modal" style={{
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
          <div className="modal-content" style={{
            background: 'rgba(26, 32, 44, 0.95)',
            borderRadius: '12px',
            padding: '30px',
            width: '700px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="modal-header" style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#FFFFFF' }}>📊 Chi tiết trạm: {selectedStation.name}</h3>
            </div>

            {/* Station Overview */}
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ color: '#FFFFFF', marginBottom: '15px', fontSize: '18px' }}>📋 Thông tin cơ bản</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <p style={{ margin: '5px 0', color: '#E0E0E0' }}><strong style={{ color: '#FFFFFF' }}>Tên trạm:</strong> {selectedStation.name}</p>
                  <p style={{ margin: '5px 0', color: '#E0E0E0' }}><strong style={{ color: '#FFFFFF' }}>Địa chỉ:</strong> {selectedStation.address}</p>
                  <p style={{ margin: '5px 0', color: '#E0E0E0' }}><strong style={{ color: '#FFFFFF' }}>Số điện thoại:</strong> {selectedStation.phone}</p>
                </div>
                <div>
                  <p style={{ margin: '5px 0', color: '#E0E0E0' }}><strong style={{ color: '#FFFFFF' }}>Người quản lý:</strong> {selectedStation.manager}</p>
                  <p style={{ margin: '5px 0', color: '#E0E0E0' }}><strong style={{ color: '#FFFFFF' }}>Giờ hoạt động:</strong> {selectedStation.operatingHours}</p>
                  <p style={{ margin: '5px 0', color: '#E0E0E0' }}><strong style={{ color: '#FFFFFF' }}>Đánh giá:</strong> ⭐ {selectedStation.rating}/5</p>
                </div>
              </div>
            </div>

            {/* Status & Capacity */}
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ color: '#FFFFFF', marginBottom: '15px', fontSize: '18px' }}>⚡ Trạng thái & Sức chứa</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                <div style={darkTheme.components.statsCard}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: getStatusColor(selectedStation.status) }}>
                    {selectedStation.status}
                  </div>
                  <div style={{ fontSize: '12px', color: darkTheme.colors.secondary, marginTop: '5px' }}>
                    Trạng thái
                  </div>
                </div>
                <div style={darkTheme.components.statsCard}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: getCapacityColor(selectedStation.availableSlots, selectedStation.totalSlots) }}>
                    {selectedStation.availableSlots}/{selectedStation.totalSlots}
                  </div>
                  <div style={{ fontSize: '12px', color: darkTheme.colors.secondary, marginTop: '5px' }}>
                    Slot khả dụng
                  </div>
                </div>
                <div style={darkTheme.components.statsCard}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#6ab7ff' }}>
                    {selectedStation.todayTransactions}
                  </div>
                  <div style={{ fontSize: '12px', color: darkTheme.colors.secondary, marginTop: '5px' }}>
                    GD hôm nay
                  </div>
                </div>
              </div>
            </div>

            {/* Battery Information */}
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ color: '#FFFFFF', marginBottom: '15px', fontSize: '18px' }}>🔋 Thông tin pin</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                <div style={darkTheme.components.statsCard}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#19c37d' }}>
                    {selectedStation.totalBatteries}
                  </div>
                  <div style={{ fontSize: '12px', color: darkTheme.colors.secondary, marginTop: '5px' }}>
                    Tổng pin
                  </div>
                </div>
                <div style={darkTheme.components.statsCard}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#19c37d' }}>
                    {selectedStation.availableBatteries}
                  </div>
                  <div style={{ fontSize: '12px', color: darkTheme.colors.secondary, marginTop: '5px' }}>
                    Sẵn sàng
                  </div>
                </div>
                <div style={darkTheme.components.statsCard}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffa500' }}>
                    {selectedStation.chargingBatteries}
                  </div>
                  <div style={{ fontSize: '12px', color: darkTheme.colors.secondary, marginTop: '5px' }}>
                    Đang sạc
                  </div>
                </div>
                <div style={darkTheme.components.statsCard}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff4757' }}>
                    {selectedStation.maintenanceBatteries}
                  </div>
                  <div style={{ fontSize: '12px', color: darkTheme.colors.secondary, marginTop: '5px' }}>
                    Bảo trì
                  </div>
                </div>
              </div>
            </div>

            {/* Services & Maintenance */}
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ color: '#FFFFFF', marginBottom: '15px', fontSize: '18px' }}>🛠️ Dịch vụ & Bảo trì</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <p style={{ margin: '5px 0', color: '#E0E0E0' }}><strong style={{ color: '#FFFFFF' }}>Dịch vụ:</strong></p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '5px' }}>
                    {selectedStation.services.map((service, index) => (
                      <span key={index} style={{
                        padding: '4px 8px',
                        background: 'rgba(25, 195, 125, 0.2)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#19c37d',
                        border: '1px solid rgba(25, 195, 125, 0.3)'
                      }}>
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ margin: '5px 0', color: '#E0E0E0' }}><strong style={{ color: '#FFFFFF' }}>Lần bảo trì cuối:</strong> {selectedStation.lastMaintenance}</p>
                  <p style={{ margin: '5px 0', color: '#E0E0E0' }}><strong style={{ color: '#FFFFFF' }}>Bảo trì tiếp theo:</strong> {selectedStation.nextMaintenance}</p>
                </div>
              </div>
            </div>

            {/* Transaction Statistics */}
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ color: '#FFFFFF', marginBottom: '15px', fontSize: '18px' }}>📈 Thống kê giao dịch</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                <div style={darkTheme.components.statsCard}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#6ab7ff' }}>
                    {selectedStation.totalTransactions}
                  </div>
                  <div style={{ fontSize: '12px', color: darkTheme.colors.secondary, marginTop: '5px' }}>
                    Tổng giao dịch
                  </div>
                </div>
                <div style={darkTheme.components.statsCard}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#19c37d' }}>
                    {selectedStation.todayTransactions}
                  </div>
                  <div style={{ fontSize: '12px', color: darkTheme.colors.secondary, marginTop: '5px' }}>
                    Hôm nay
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowDetailModal(false)}
                style={darkTheme.components.button.secondary}
                onMouseEnter={(e) => buttonHoverEffects.secondary(e)}
                onMouseLeave={(e) => buttonLeaveEffects.secondary(e)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffStationManagement;