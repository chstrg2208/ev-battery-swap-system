// src/pages/Driver/Contracts/components/ContractsList.jsx

import React from 'react';
import ContractCard from './ContractCard';

const listStyle = {
  display: 'grid',
  gap: '16px',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' // Layout dạng lưới responsive
};

const ContractsList = ({ contracts, onViewDetails }) => {
  return (
    <div style={listStyle}>
      {contracts.map(contract => (
        <ContractCard
          key={contract.id}
          contract={contract}
          onViewDetails={onViewDetails} // Truyền hàm xuống component con
        />
      ))}
    </div>
  );
};

export default ContractsList;