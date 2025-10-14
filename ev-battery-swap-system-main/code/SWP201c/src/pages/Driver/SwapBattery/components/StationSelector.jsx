import React, { useState } from 'react';

const selectStyle = { 
    width: '100%', padding: '12px', background: 'rgba(30, 41, 59, 0.8)', 
    border: '1px solid #4A5568', borderRadius: '8px', color: 'white', 
    fontSize: '16px', boxSizing: 'border-box'
};

const StationSelector = ({ stations = [], towers = [], onConfirm, updateSelection, isLoadingTowers }) => {
  const [selectedStationId, setSelectedStationId] = useState('');
  const [selectedTowerId, setSelectedTowerId] = useState('');

  const handleStationChange = (e) => {
    const stationId = e.target.value;
    const station = stations.find(s => s.id.toString() === stationId);
    
    setSelectedStationId(stationId);
    setSelectedTowerId('');
    
    updateSelection({ 
      stationId: stationId, 
      stationName: station ? station.name : null, 
      towerId: null, 
      towerName: null 
    });
  };

  const handleTowerChange = (e) => {
    const towerId = e.target.value;
    const tower = towers.find(t => (t.id || t.tower_id).toString() === towerId);

    setSelectedTowerId(towerId);

    updateSelection({ 
      towerId: towerId, 
      towerName: tower ? (tower.name || tower.tower_name) : null 
    });
  };

  return (
    <div>
      <h3 style={{ marginTop: 0, textAlign: 'center' }}>Bước 1: Chọn điểm đổi pin</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Chọn trạm đổi pin</label>
          <select style={selectStyle} onChange={handleStationChange} value={selectedStationId}>
            <option value="">-- Vui lòng chọn trạm --</option>
            {stations.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Chọn trụ sạc</label>
          <select 
            style={{ ...selectStyle, cursor: !selectedStationId ? 'not-allowed' : 'pointer' }} 
            disabled={!selectedStationId || isLoadingTowers}
            value={selectedTowerId}
            onChange={handleTowerChange}
          >
            <option value="">
              {isLoadingTowers ? 'Đang tải danh sách trụ...' : '-- Vui lòng chọn trụ --'}
            </option>
            {towers.map(t => {
              // Sửa lại để chấp nhận nhiều loại tên thuộc tính
              const tower_id = t.id || t.tower_id;
              const tower_name = t.name || t.tower_name;
              return (
                <option key={tower_id} value={tower_id}>
                  {tower_name}
                </option>
              );
            })}
          </select>
        </div>
        <button 
          onClick={onConfirm} 
          disabled={!selectedStationId || !selectedTowerId}
          style={{ 
            background: '#6ab7ff', border: 'none', color: 'white', padding: '15px', 
            borderRadius: '8px', cursor: 'pointer', fontSize: '16px',
            opacity: (!selectedStationId || !selectedTowerId) ? 0.5 : 1
          }}>
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default StationSelector;