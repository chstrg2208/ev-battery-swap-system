import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Don't forget to import Leaflet's CSS

// Import child components
import StationsMapHeader from './components/StationsMapHeader';
import StationsStats from './components/StationsStats';
import StationsList from './components/StationsList';

// Mock data, replace with your API call
const mockStations = [
  { id: 1, name: 'Trạm Vincom Thủ Đức', address: '216 Võ Văn Ngân, Thủ Đức', lat: 10.8507, lng: 106.7583, availableBateries: 5, totalSlots: 10 },
  { id: 2, name: 'Trạm Giga Mall', address: '242 Phạm Văn Đồng, Thủ Đức', lat: 10.8273, lng: 106.7212, availableBateries: 0, totalSlots: 8 },
  { id: 3, name: 'Trạm Emart Gò Vấp', address: '366 Phan Văn Trị, Gò Vấp', lat: 10.8285, lng: 106.6882, availableBateries: 8, totalSlots: 10 },
];

const DriverStationsMap = () => {
  const [stations, setStations] = useState(mockStations);
  const [filteredStations, setFilteredStations] = useState(mockStations);
  const [mapCenter, setMapCenter] = useState([10.8231, 106.6297]); // Default to HCMC center

  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const results = stations.filter(station =>
      station.name.toLowerCase().includes(lowerCaseQuery) ||
      station.address.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredStations(results);
  };

  const handleSelectStation = (station) => {
    // When a station is clicked in the list, center the map on it
    setMapCenter([station.lat, station.lng]);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '20px', height: 'calc(100vh - 100px)' }}>

      {/* Left Panel: Search and List */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <StationsMapHeader onSearch={handleSearch} />
        <StationsStats count={filteredStations.length} />
        <StationsList stations={filteredStations} onSelectStation={handleSelectStation} />
      </div>

      {/* Right Panel: Map */}
      <div style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredStations.map(station => (
            <Marker key={station.id} position={[station.lat, station.lng]}>
              <Popup>
                <strong>{station.name}</strong><br />
                {station.address}<br />
                Pin có sẵn: {station.availableBateries}/{station.totalSlots}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default DriverStationsMap;