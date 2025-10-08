import React, { useState, useEffect } from 'react';

const AdminStations = () => {
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedStation, setSelectedStation] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    address: '',
    district: '',
    city: '',
    totalSlots: '',
    occupiedSlots: '',
    availableSlots: '',
    status: 'active',
    coordinates: { lat: '', lng: '' },
    operatingHours: { open: '06:00', close: '22:00' },
    contact: { phone: '', email: '' },
    manager: ''
  });

  // Mock data
  useEffect(() => {
    const mockStations = [
      {
        id: 'ST001',
        name: 'Trạm Quận 1',
        address: '123 Nguyễn Huệ, Phường Bến Nghé',
        district: 'Quận 1',
        city: 'TP.HCM',
        totalSlots: 20,
        occupiedSlots: 15,
        availableSlots: 5,
        status: 'active',
        coordinates: { lat: '10.7768', lng: '106.7009' },
        operatingHours: { open: '06:00', close: '22:00' },
        contact: { phone: '0123456789', email: 'quan1@evstation.com' },
        createdAt: '2024-01-15',
        manager: 'Nguyen Van A'
      },
      {
        id: 'ST002',
        name: 'Trạm Quận 3',
        address: '456 Võ Văn Tần, Phường 6',
        district: 'Quận 3',
        city: 'TP.HCM',
        totalSlots: 15,
        occupiedSlots: 8,
        availableSlots: 7,
        status: 'active',
        coordinates: { lat: '10.7869', lng: '106.6899' },
        operatingHours: { open: '05:30', close: '23:00' },
        contact: { phone: '0987654321', email: 'quan3@evstation.com' },
        createdAt: '2024-01-20',
        manager: 'Tran Thi B'
      },
      {
        id: 'ST003',
        name: 'Trạm Bình Thạnh',
        address: '789 Xô Viết Nghệ Tĩnh, Phường 21',
        district: 'Bình Thạnh',
        city: 'TP.HCM',
        totalSlots: 25,
        occupiedSlots: 12,
        availableSlots: 13,
        status: 'maintenance',
        coordinates: { lat: '10.8025', lng: '106.7123' },
        operatingHours: { open: '06:00', close: '22:30' },
        contact: { phone: '0369852147', email: 'binhthanh@evstation.com' },
        createdAt: '2024-02-01',
        manager: 'Le Van C'
      },
      {
        id: 'ST004',
        name: 'Trạm Phú Nhuận',
        address: '321 Phan Xích Long, Phường 2',
        district: 'Phú Nhuận',
        city: 'TP.HCM',
        totalSlots: 18,
        occupiedSlots: 14,
        availableSlots: 4,
        status: 'active',
        coordinates: { lat: '10.7995', lng: '106.6834' },
        operatingHours: { open: '06:00', close: '22:00' },
        contact: { phone: '0908765432', email: 'phunhuan@evstation.com' },
        createdAt: '2024-02-10',
        manager: 'Pham Thi D'
      },
      {
        id: 'ST005',
        name: 'Trạm Tân Bình',
        address: '654 Hoàng Hoa Thám, Phường 12',
        district: 'Tân Bình',
        city: 'TP.HCM',
        totalSlots: 22,
        occupiedSlots: 5,
        availableSlots: 17,
        status: 'inactive',
        coordinates: { lat: '10.8006', lng: '106.6529' },
        operatingHours: { open: '06:00', close: '22:00' },
        contact: { phone: '0945123678', email: 'tanbinh@evstation.com' },
        createdAt: '2024-01-05',
        manager: 'Hoang Van E'
      }
    ];
    setStations(mockStations);
    setFilteredStations(mockStations);
  }, []);

  // Filter functionality
  useEffect(() => {
    let filtered = stations.filter(station =>
      station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.manager.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterStatus !== 'all') {
      filtered = filtered.filter(station => station.status === filterStatus);
    }

    setFilteredStations(filtered);
  }, [searchTerm, filterStatus, stations]);

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      address: '',
      district: '',
      city: '',
      totalSlots: '',
      occupiedSlots: '',
      availableSlots: '',
      status: 'active',
      coordinates: { lat: '', lng: '' },
      operatingHours: { open: '06:00', close: '22:00' },
      contact: { phone: '', email: '' },
      manager: ''
    });
  };

  const handleOpenModal = (mode, station = null) => {
    setModalMode(mode);
    setSelectedStation(station);
    if (station) {
      setFormData({ ...station });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStation(null);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalMode === 'add') {
      const newStation = {
        ...formData,
        id: `ST${String(stations.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setStations(prev => [...prev, newStation]);
    } else if (modalMode === 'edit') {
      setStations(prev => prev.map(station => 
        station.id === selectedStation.id ? { ...formData } : station
      ));
    }
    
    handleCloseModal();
  };

  const handleDelete = (stationId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa trạm này?')) {
      setStations(prev => prev.filter(station => station.id !== stationId));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: '#19c37d', bg: '#19c37d20', text: 'Hoạt động' },
      maintenance: { color: '#ffa500', bg: '#ffa50020', text: 'Bảo trì' },
      inactive: { color: '#ff6b6b', bg: '#ff6b6b20', text: 'Ngưng hoạt động' }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: '500',
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.color}40`
      }}>
        {config.text}
      </span>
    );
  };

  const getUtilizationColor = (rate) => {
    if (rate >= 80) return '#ff6b6b';
    if (rate >= 60) return '#ffa500';
    return '#19c37d';
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number);
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(255, 165, 0, 0.05))',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '30px',
        border: '1px solid rgba(255, 165, 0, 0.2)',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              color: '#FFFFFF', 
              fontSize: '2.2rem', 
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              🏪 Quản lý trạm đổi pin
            </h1>
            <p style={{ 
              margin: '10px 0 0 0', 
              color: '#B0B0B0', 
              fontSize: '1rem'
            }}>
              Quản lý tất cả trạm đổi pin trong hệ thống
            </p>
          </div>
          <button
            onClick={() => handleOpenModal('add')}
            style={{
              padding: '15px 25px',
              background: 'linear-gradient(135deg, #ffa500, #e6940b)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 25px rgba(255, 165, 0, 0.3)'
            }}
          >
            <span>+</span> Thêm trạm mới
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(25, 195, 125, 0.1), rgba(25, 195, 125, 0.05))',
          borderRadius: '15px',
          padding: '25px',
          border: '1px solid rgba(25, 195, 125, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#19c37d', marginBottom: '5px' }}>
            {stations.length}
          </div>
          <div style={{ fontSize: '14px', color: '#E0E0E0' }}>Tổng số trạm</div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.1), rgba(255, 165, 0, 0.05))',
          borderRadius: '15px',
          padding: '25px',
          border: '1px solid rgba(255, 165, 0, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffa500', marginBottom: '5px' }}>
            {stations.filter(s => s.status === 'active').length}
          </div>
          <div style={{ fontSize: '14px', color: '#E0E0E0' }}>Đang hoạt động</div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, rgba(106, 183, 255, 0.1), rgba(106, 183, 255, 0.05))',
          borderRadius: '15px',
          padding: '25px',
          border: '1px solid rgba(106, 183, 255, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6ab7ff', marginBottom: '5px' }}>
            {formatNumber(stations.reduce((sum, s) => sum + s.totalSlots, 0))}
          </div>
          <div style={{ fontSize: '14px', color: '#E0E0E0' }}>Tổng slot</div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.1), rgba(78, 205, 196, 0.05))',
          borderRadius: '15px',
          padding: '25px',
          border: '1px solid rgba(78, 205, 196, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ecdc4', marginBottom: '5px' }}>
            {formatNumber(stations.reduce((sum, s) => sum + s.availableSlots, 0))}
          </div>
          <div style={{ fontSize: '14px', color: '#E0E0E0' }}>Slot trống</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', gap: '15px', flex: 1 }}>
          <input
            type="text"
            placeholder="Tìm kiếm trạm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              maxWidth: '400px',
              padding: '12px 16px',
              background: 'rgba(26, 32, 44, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '14px'
            }}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '12px 16px',
              background: 'rgba(26, 32, 44, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '14px'
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="maintenance">Bảo trì</option>
            <option value="inactive">Ngưng hoạt động</option>
          </select>
        </div>
      </div>

      {/* Stations Table */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          overflowX: 'auto',
          maxHeight: '600px'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                <th style={{ padding: '15px', textAlign: 'left', color: '#E0E0E0', fontWeight: '600' }}>Mã trạm</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#E0E0E0', fontWeight: '600' }}>Tên trạm</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#E0E0E0', fontWeight: '600' }}>Địa chỉ</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#E0E0E0', fontWeight: '600' }}>Slot</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#E0E0E0', fontWeight: '600' }}>Tỷ lệ sử dụng</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#E0E0E0', fontWeight: '600' }}>Trạng thái</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#E0E0E0', fontWeight: '600' }}>Quản lý</th>
                <th style={{ padding: '15px', textAlign: 'center', color: '#E0E0E0', fontWeight: '600' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredStations.map((station) => {
                const utilizationRate = Math.round((station.occupiedSlots / station.totalSlots) * 100);
                return (
                  <tr key={station.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <td style={{ padding: '15px', color: '#FFFFFF', fontWeight: '500' }}>{station.id}</td>
                    <td style={{ padding: '15px', color: '#FFFFFF' }}>{station.name}</td>
                    <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px' }}>
                      <div>{station.address}</div>
                      <div style={{ color: '#B0B0B0', fontSize: '12px' }}>{station.district}, {station.city}</div>
                    </td>
                    <td style={{ padding: '15px', color: '#E0E0E0' }}>
                      <div style={{ fontSize: '14px' }}>
                        <span style={{ color: '#19c37d' }}>{station.availableSlots}</span> / {station.totalSlots}
                      </div>
                      <div style={{ color: '#B0B0B0', fontSize: '12px' }}>Trống / Tổng</div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '60px',
                          height: '6px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${utilizationRate}%`,
                            height: '100%',
                            background: getUtilizationColor(utilizationRate),
                            borderRadius: '3px'
                          }} />
                        </div>
                        <span style={{
                          color: getUtilizationColor(utilizationRate),
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {utilizationRate}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      {getStatusBadge(station.status)}
                    </td>
                    <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px' }}>
                      {station.manager}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleOpenModal('view', station)}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(106, 183, 255, 0.2)',
                            color: '#6ab7ff',
                            border: '1px solid #6ab7ff40',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Chi tiết
                        </button>
                        <button
                          onClick={() => handleOpenModal('edit', station)}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(255, 165, 0, 0.2)',
                            color: '#ffa500',
                            border: '1px solid #ffa50040',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(station.id)}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(255, 107, 107, 0.2)',
                            color: '#ff6b6b',
                            border: '1px solid #ff6b6b40',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
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
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(26, 32, 44, 0.95)',
            borderRadius: '16px',
            padding: '30px',
            width: '600px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#FFFFFF', margin: 0 }}>
                {modalMode === 'add' ? '🏪 Thêm trạm mới' : 
                 modalMode === 'edit' ? '✏️ Chỉnh sửa trạm' : 
                 '👁️ Chi tiết trạm'}
              </h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#E0E0E0',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', color: '#E0E0E0', marginBottom: '5px', fontSize: '14px' }}>
                    Tên trạm *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: modalMode === 'view' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(26, 32, 44, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#E0E0E0', marginBottom: '5px', fontSize: '14px' }}>
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: modalMode === 'view' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(26, 32, 44, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontSize: '14px'
                    }}
                  >
                    <option value="active">Hoạt động</option>
                    <option value="maintenance">Bảo trì</option>
                    <option value="inactive">Ngưng hoạt động</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#E0E0E0', marginBottom: '5px', fontSize: '14px' }}>
                  Địa chỉ *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={modalMode === 'view'}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: modalMode === 'view' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(26, 32, 44, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', color: '#E0E0E0', marginBottom: '5px', fontSize: '14px' }}>
                    Quận/Huyện *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: modalMode === 'view' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(26, 32, 44, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#E0E0E0', marginBottom: '5px', fontSize: '14px' }}>
                    Thành phố *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: modalMode === 'view' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(26, 32, 44, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', color: '#E0E0E0', marginBottom: '5px', fontSize: '14px' }}>
                    Tổng slot *
                  </label>
                  <input
                    type="number"
                    name="totalSlots"
                    value={formData.totalSlots}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    required
                    min="1"
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: modalMode === 'view' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(26, 32, 44, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#E0E0E0', marginBottom: '5px', fontSize: '14px' }}>
                    Slot đang dùng
                  </label>
                  <input
                    type="number"
                    name="occupiedSlots"
                    value={formData.occupiedSlots}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    min="0"
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: modalMode === 'view' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(26, 32, 44, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#E0E0E0', marginBottom: '5px', fontSize: '14px' }}>
                    Slot trống
                  </label>
                  <input
                    type="number"
                    name="availableSlots"
                    value={formData.availableSlots}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    min="0"
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: modalMode === 'view' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(26, 32, 44, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', color: '#E0E0E0', marginBottom: '5px', fontSize: '14px' }}>
                    Người quản lý
                  </label>
                  <input
                    type="text"
                    name="manager"
                    value={formData.manager}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: modalMode === 'view' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(26, 32, 44, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#E0E0E0', marginBottom: '5px', fontSize: '14px' }}>
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="contact.phone"
                    value={formData.contact?.phone || ''}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: modalMode === 'view' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(26, 32, 44, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              {modalMode !== 'view' && (
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    style={{
                      padding: '12px 24px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#E0E0E0',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #ffa500, #e6940b)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    {modalMode === 'add' ? 'Thêm trạm' : 'Lưu thay đổi'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStations;