// src/pages/Driver/Contracts/index.jsx

import React, { useState } from 'react';

// KHÔNG CẦN import DriverLayout ở đây nữa

// Import các component con
import ContractsHeader from './components/ContractsHeader';
import ContractsList from './components/ContractsList';
import EmptyContracts from './components/EmptyContracts';
import ContractDetailModal from './components/ContractDetailModal';

// Dữ liệu giả để demo
const mockContracts = [
  { id: 'HD-001', name: 'Hợp đồng thuê xe Vinfast VF8', status: 'active', startDate: '2025-10-01', endDate: '2026-10-01', vehicle: 'VF8 - 51K-123.45', details: 'Hợp đồng thuê xe 12 tháng, bao gồm gói thuê pin cao cấp.' },
  { id: 'HD-002', name: 'Hợp đồng thuê pin cơ bản', status: 'active', startDate: '2025-09-15', endDate: '2026-09-15', vehicle: 'VF8 - 51K-123.45', details: 'Gói thuê pin giới hạn 1500km/tháng.' },
  { id: 'HD-003', name: 'Hợp đồng cũ VF e34', status: 'expired', startDate: '2024-01-01', endDate: '2025-01-01', vehicle: 'VFe34 - 51H-678.90', details: 'Hợp đồng đã hết hạn.' }
];

// Tên component nên là DriverContracts để khớp với import trong App.jsx
const DriverContracts = () => { 
  const [contracts] = useState(mockContracts);
  const [selectedContract, setSelectedContract] = useState(null);

  const handleViewDetails = (contract) => setSelectedContract(contract);
  const handleCloseModal = () => setSelectedContract(null);

  return (
    // Component chỉ trả về nội dung của trang, không còn layout
    <>
      <ContractsHeader contractCount={contracts.length} />

      <div style={{ marginTop: '24px' }}>
        {contracts.length > 0 ? (
          <ContractsList
            contracts={contracts}
            onViewDetails={handleViewDetails}
          />
        ) : (
          <EmptyContracts />
        )}
      </div>

      <ContractDetailModal
        isOpen={!!selectedContract}
        contract={selectedContract}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default DriverContracts;