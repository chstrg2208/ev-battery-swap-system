// Staff Station Management
// CRUD operations for battery swap stations with detailed features

import React, { useState, useEffect } from 'react';
import useStationStore from '../../store/stationSlice';

const StaffStationManagement = () => {
  // Zustand store
  const { 
    stations, 
    stationStats, 
    isLoading, 
    error, 
    fetchStations, 
    createStation, 
    updateStation, 
    deleteStation, 
    fetchStationStats,
    clearError 
  } = useStationStore();

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
  const currentUserRole = 'staff'; // 'user', 'staff', 'admin'
  const canEditStations = ['admin'].includes(currentUserRole);
  const canDeleteStations = ['admin'].includes(currentUserRole);
  const canAddStations = ['admin'].includes(currentUserRole);

  // Load data on component mount
  useEffect(() => {
    fetchStations();
    fetchStationStats();
  }, [fetchStations, fetchStationStats]);

  const handleAddStation = async () => {
    const result = await createStation(editingStation);
    if (result) {
      setShowAddModal(false);
      setEditingStation({ name: '', address: '', phone: '', manager: '', totalSlots: 0, operatingHours: '', services: [] });
      // Refresh stats after adding
      fetchStationStats();
    }
  };

  const handleEditStation = async () => {
    const result = await updateStation(selectedStation.id, editingStation);
    if (result) {
      setShowEditModal(false);
      setSelectedStation(null);
      setEditingStation({ name: '', address: '', phone: '', manager: '', totalSlots: 0, operatingHours: '', services: [] });
      // Refresh stats after updating
      fetchStationStats();
    }
  };

  const handleDeleteStation = async (stationId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa trạm này? Hành động này không thể hoàn tác.')) {
      const result = await deleteStation(stationId);
      if (result) {
        // Refresh stats after deleting
        fetchStationStats();
      }
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

  // Use stats from store or calculate from stations
  const stats = stationStats || {
    total: stations.length,
    active: stations.filter(s => s.status === 'Hoạt động').length,
    maintenance: stations.filter(s => s.status === 'Bảo trì').length,
    totalTransactions: stations.reduce((sum, s) => sum + s.todayTransactions, 0),
    totalBatteries: stations.reduce((sum, s) => sum + s.totalBatteries, 0),
    availableBatteries: stations.reduce((sum, s) => sum + s.availableBatteries, 0)
  };

  return (
    <div className="staff-station-management" style={{ padding: '20px', background: '#1a202c', minHeight: '100vh', color: 'white' }}>
      <div className="page-header" style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ color: '#FFFFFF', marginBottom: '10px', fontSize: '28px' }}>🏢 Quản lý trạm đổi pin</h1>
        <p style={{ color: '#E0E0E0', fontSize: '16px' }}>Quản lý thông tin các trạm đổi pin trong hệ thống</p>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          background: 'rgba(255, 71, 87, 0.1)',
          border: '1px solid #ff4757',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          color: '#ff4757',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>⚠️ {error}</span>
          <button 
            onClick={clearError}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ff4757',
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ color: '#6ab7ff', fontSize: '18px' }}>⏳ Đang tải dữ liệu...</div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="stats-cards" style={{ 
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
            {stats.total}
          </div>
          <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
            Tổng số trạm
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
            {stats.active}
          </div>
          <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
            Đang hoạt động
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
            {stats.maintenance}
          </div>
          <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
            Đang bảo trì
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
            {stats.totalTransactions}
          </div>
          <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
            Giao dịch hôm nay
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
            {stats.totalBatteries}
          </div>
          <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
            Tổng số pin
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
            {stats.availableBatteries}
          </div>
          <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>
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
              boxShadow: '0 4px 15px rgba(106, 183, 255, 0.3)'
            }}
          >
            ➕ Thêm trạm mới
          </button>
        )}
        {!canAddStations && (
          <div style={{ 
            padding: '10px 20px', 
            background: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: '8px', 
            color: '#B0B0B0',
            fontSize: '14px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            ⚠️ Chỉ Admin mới có thể thêm trạm mới
          </div>
        )}
      </div>

      {/* Stations Table */}
      <div className="stations-table" style={{
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
            {stations.map(station => (
              <tr key={station.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background-color 0.2s ease' }}>
                <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px', verticalAlign: 'top' }}>
                  <div style={{ fontWeight: 'bold', color: '#6ab7ff' }}>{station.name}</div>
                  <div style={{ fontSize: '12px', color: '#B0B0B0' }}>{station.phone}</div>
                </td>
                <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px', verticalAlign: 'top' }}>
                  <div style={{ color: '#E0E0E0' }}>{station.address}</div>
                  <div style={{ fontSize: '12px', color: '#B0B0B0' }}>{station.operatingHours}</div>
                </td>
                <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px', verticalAlign: 'top', textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: getCapacityColor(station.availableSlots, station.totalSlots) }}>
                    {station.availableSlots}/{station.totalSlots}
                  </div>
                  <div style={{ fontSize: '12px', color: '#B0B0B0' }}>{station.capacity}</div>
                </td>
                <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px', verticalAlign: 'top', textAlign: 'center' }}>
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
                <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px', verticalAlign: 'top', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#6ab7ff' }}>
                    {station.todayTransactions}
                  </div>
                  <div style={{ fontSize: '12px', color: '#B0B0B0' }}>
                    ⭐ {station.rating}
                  </div>
                </td>
                <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px', verticalAlign: 'top' }}>
                  <div style={{ color: '#E0E0E0' }}>{station.manager}</div>
                </td>
                <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px', verticalAlign: 'top', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => openDetailModal(station)}
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
                    {canEditStations && (
                      <button 
                        onClick={() => openEditModal(station)}
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
                    {canDeleteStations && (
                      <button 
                        onClick={() => handleDeleteStation(station.id)}
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
          <div className="modal-content" style={{
            background: 'rgba(26, 32, 44, 0.95)',
            borderRadius: '12px',
            padding: '30px',
            width: '600px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="modal-header" style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#FFFFFF' }}>➕ Thêm trạm mới</h3>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddStation(); }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                    Tên trạm *
                  </label>
                  <input
                    type="text"
                    value={editingStation.name}
                    onChange={(e) => setEditingStation({...editingStation, name: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '14px'
                    }}
                    placeholder="Nhập tên trạm"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={editingStation.phone}
                    onChange={(e) => setEditingStation({...editingStation, phone: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '14px'
                    }}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                  Địa chỉ *
                </label>
                <textarea
                  value={editingStation.address}
                  onChange={(e) => setEditingStation({...editingStation, address: e.target.value})}
                  required
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
                  placeholder="Nhập địa chỉ chi tiết"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                    Người quản lý *
                  </label>
                  <input
                    type="text"
                    value={editingStation.manager}
                    onChange={(e) => setEditingStation({...editingStation, manager: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '14px'
                    }}
                    placeholder="Nhập tên người quản lý"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                    Tổng số slot *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editingStation.totalSlots}
                    onChange={(e) => setEditingStation({...editingStation, totalSlots: parseInt(e.target.value)})}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '14px'
                    }}
                    placeholder="Nhập số slot"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                  Giờ hoạt động *
                </label>
                <input
                  type="text"
                  value={editingStation.operatingHours}
                  onChange={(e) => setEditingStation({...editingStation, operatingHours: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    fontSize: '14px'
                  }}
                  placeholder="VD: 6:00 - 22:00 hoặc 24/7"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#FFFFFF', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>
                  Dịch vụ có sẵn
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {['Đổi pin', 'Sạc nhanh', 'Bảo trì', 'Hỗ trợ 24/7'].map(service => (
                    <label key={service} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      color: '#E0E0E0', 
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={editingStation.services.includes(service)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditingStation({...editingStation, services: [...editingStation.services, service]});
                          } else {
                            setEditingStation({...editingStation, services: editingStation.services.filter(s => s !== service)});
                          }
                        }}
                        style={{ marginRight: '8px' }}
                      />
                      {service}
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button 
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingStation({ name: '', address: '', phone: '', manager: '', totalSlots: 0, operatingHours: '', services: [] });
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#E0E0E0',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Hủy
                </button>
                <button 
                  type="submit"
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
                    boxShadow: '0 4px 15px rgba(106, 183, 255, 0.3)'
                  }}
                >
                  Thêm trạm
                </button>
              </div>
            </form>
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
          <div className="modal-content" style={{
            background: 'rgba(26, 32, 44, 0.95)',
            borderRadius: '12px',
            padding: '30px',
            width: '600px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="modal-header" style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#FFFFFF' }}>✏️ Sửa thông tin trạm: {selectedStation.name}</h3>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleEditStation(); }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                    Tên trạm *
                  </label>
                  <input
                    type="text"
                    value={editingStation.name}
                    onChange={(e) => setEditingStation({...editingStation, name: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '14px'
                    }}
                    placeholder="Nhập tên trạm"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={editingStation.phone}
                    onChange={(e) => setEditingStation({...editingStation, phone: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '14px'
                    }}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                  Địa chỉ *
                </label>
                <textarea
                  value={editingStation.address}
                  onChange={(e) => setEditingStation({...editingStation, address: e.target.value})}
                  required
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
                  placeholder="Nhập địa chỉ chi tiết"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                    Người quản lý *
                  </label>
                  <input
                    type="text"
                    value={editingStation.manager}
                    onChange={(e) => setEditingStation({...editingStation, manager: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '14px'
                    }}
                    placeholder="Nhập tên người quản lý"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                    Tổng số slot *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editingStation.totalSlots}
                    onChange={(e) => setEditingStation({...editingStation, totalSlots: parseInt(e.target.value)})}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '14px'
                    }}
                    placeholder="Nhập số slot"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#FFFFFF', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                  Giờ hoạt động *
                </label>
                <input
                  type="text"
                  value={editingStation.operatingHours}
                  onChange={(e) => setEditingStation({...editingStation, operatingHours: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    fontSize: '14px'
                  }}
                  placeholder="VD: 6:00 - 22:00 hoặc 24/7"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#FFFFFF', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>
                  Dịch vụ có sẵn
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {['Đổi pin', 'Sạc nhanh', 'Bảo trì', 'Hỗ trợ 24/7'].map(service => (
                    <label key={service} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      color: '#E0E0E0', 
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={editingStation.services.includes(service)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditingStation({...editingStation, services: [...editingStation.services, service]});
                          } else {
                            setEditingStation({...editingStation, services: editingStation.services.filter(s => s !== service)});
                          }
                        }}
                        style={{ marginRight: '8px' }}
                      />
                      {service}
                    </label>
                  ))}
                </div>
              </div>

              <div className="modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedStation(null);
                    setEditingStation({ name: '', address: '', phone: '', manager: '', totalSlots: 0, operatingHours: '', services: [] });
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#E0E0E0',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #ffa500, #ff8c00)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(255, 165, 0, 0.3)'
                  }}
                >
                  Cập nhật
                </button>
              </div>
            </form>
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
                <div style={{
                  background: 'rgba(26, 32, 44, 0.8)',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: getStatusColor(selectedStation.status) }}>
                    {selectedStation.status}
                  </div>
                  <div style={{ fontSize: '12px', color: '#E0E0E0', marginTop: '5px' }}>
                    Trạng thái
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
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: getCapacityColor(selectedStation.availableSlots, selectedStation.totalSlots) }}>
                    {selectedStation.availableSlots}/{selectedStation.totalSlots}
                  </div>
                  <div style={{ fontSize: '12px', color: '#E0E0E0', marginTop: '5px' }}>
                    Slot khả dụng
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
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#6ab7ff' }}>
                    {selectedStation.todayTransactions}
                  </div>
                  <div style={{ fontSize: '12px', color: '#E0E0E0', marginTop: '5px' }}>
                    GD hôm nay
                  </div>
                </div>
              </div>
            </div>

            {/* Battery Information */}
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ color: '#FFFFFF', marginBottom: '15px', fontSize: '18px' }}>🔋 Thông tin pin</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                <div style={{
                  background: 'rgba(26, 32, 44, 0.8)',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#19c37d' }}>
                    {selectedStation.totalBatteries}
                  </div>
                  <div style={{ fontSize: '12px', color: '#E0E0E0', marginTop: '5px' }}>
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
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#19c37d' }}>
                    {selectedStation.availableBatteries}
                  </div>
                  <div style={{ fontSize: '12px', color: '#E0E0E0', marginTop: '5px' }}>
                    Sẵn sàng
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
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffa500' }}>
                    {selectedStation.chargingBatteries}
                  </div>
                  <div style={{ fontSize: '12px', color: '#E0E0E0', marginTop: '5px' }}>
                    Đang sạc
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
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff4757' }}>
                    {selectedStation.maintenanceBatteries}
                  </div>
                  <div style={{ fontSize: '12px', color: '#E0E0E0', marginTop: '5px' }}>
                    Bảo trì
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Statistics */}
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ color: '#FFFFFF', marginBottom: '15px', fontSize: '18px' }}>📈 Thống kê giao dịch</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                <div style={{
                  background: 'rgba(26, 32, 44, 0.8)',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#6ab7ff' }}>
                    {selectedStation.totalTransactions}
                  </div>
                  <div style={{ fontSize: '12px', color: '#E0E0E0', marginTop: '5px' }}>
                    Tổng giao dịch
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
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#19c37d' }}>
                    {selectedStation.todayTransactions}
                  </div>
                  <div style={{ fontSize: '12px', color: '#E0E0E0', marginTop: '5px' }}>
                    Hôm nay
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowDetailModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#E0E0E0',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
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