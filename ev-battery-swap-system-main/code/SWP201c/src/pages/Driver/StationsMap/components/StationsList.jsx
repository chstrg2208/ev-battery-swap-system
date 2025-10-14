import React from 'react';
import StationCard from './StationCard';

const StationsList = ({ stations, onSelectStation }) => {
  return (
    <div style={{
      maxHeight: 'calc(100vh - 250px)', // Adjust height based on your layout
      overflowY: 'auto',
      paddingRight: '10px'
    }}>
      {stations.map(station => (
        <StationCard key={station.id} station={station} onSelect={onSelectStation} />
      ))}
    </div>
  );
};

export default StationsList;