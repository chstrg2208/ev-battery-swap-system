import React from 'react';
import VehicleCard from './VehicleCard';

const VehicleList = ({ vehicles, onSelectVehicle }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '30px',
      width: '100%',
      maxWidth: '1000px'
    }}>
      {vehicles.map(vehicle => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onSelect={onSelectVehicle}
        />
      ))}
    </div>
  );
};

export default VehicleList;