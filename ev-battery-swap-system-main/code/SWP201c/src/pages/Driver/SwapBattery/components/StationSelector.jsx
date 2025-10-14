import React, { useState } from 'react';

const selectStyle = { 
    width: '100%', 
    padding: '12px', 
    background: 'rgba(30, 41, 59, 0.8)', 
    border: '1px solid #4A5568', 
    borderRadius: '8px', 
    color: 'white', 
    fontSize: '16px',
    boxSizing: 'border-box'
};

const StationSelector = ({ stations, towers, onConfirm, updateSelection }) => {
  const [selectedStationId, setSelectedStationId] = useState('');
  const [selectedTower, setSelectedTower] = useState('');

  const handleStationChange = (e) => {
    const stationId = e.target.value;
    const stationName = e.target.options[e.target.selectedIndex].text;
    setSelectedStationId(stationId);
    setSelectedTower(''); // Reset lựa chọn trụ khi đổi trạm
    updateSelection({ station: stationId ? stationName : null, tower: null });
  };

  const handleTowerChange = (e) => {
    const towerName = e.target.value;
    setSelectedTower(towerName);
    updateSelection({ tower: towerName });
  };

  return (
    <div>
      <h3 style={{ marginTop: 0, textAlign: 'center' }}>Bước 1: Chọn điểm đổi pin</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Chọn trạm đổi pin</label>
          <select style={selectStyle} onChange={handleStationChange}>
            <option value="">-- Vui lòng chọn trạm --</option>
            {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Chọn trụ sạc</label>
          <select 
            style={{ ...selectStyle, cursor: !selectedStationId ? 'not-allowed' : 'pointer' }} 
            disabled={!selectedStationId}
            value={selectedTower}
            onChange={handleTowerChange}
          >
            <option value="">-- Vui lòng chọn trụ --</option>
            {towers
              .filter(t => t.stationId === selectedStationId)
              .map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
          </select>
        </div>
        <button 
          onClick={onConfirm} 
          disabled={!selectedStationId || !selectedTower}
          style={{ 
            background: '#6ab7ff', border: 'none', color: 'white', padding: '15px', 
            borderRadius: '8px', cursor: 'pointer', fontSize: '16px',
            opacity: (!selectedStationId || !selectedTower) ? 0.5 : 1
          }}>
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default StationSelector;