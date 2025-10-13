// Staff/BatteryInventory/hooks/useBatteryUpdate.js
import { useState } from 'react';

/**
 * Custom hook for managing battery update modal and operations
 */
export const useBatteryUpdate = (batteries, setBatteries) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBattery, setSelectedBattery] = useState(null);
  const [updateData, setUpdateData] = useState({
    status: '',
    health: 0,
    temperature: 0,
    voltage: 0
  });

  const openUpdateModal = (battery) => {
    setSelectedBattery(battery);
    setUpdateData({
      status: battery.status,
      health: battery.health,
      temperature: battery.temperature,
      voltage: battery.voltage
    });
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedBattery(null);
    setUpdateData({
      status: '',
      health: 0,
      temperature: 0,
      voltage: 0
    });
  };

  const updateField = (field, value) => {
    setUpdateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateBattery = async () => {
    try {
      // Note: Backend cần API PUT /api/batteries/:id để update battery info
      console.log('🔋 Updating battery:', selectedBattery.id, updateData);
      alert('Backend cần implement API PUT /api/batteries/:id');
      
      // Tạm thời update local state
      setBatteries(batteries.map(battery => 
        battery.id === selectedBattery.id 
          ? { ...battery, ...updateData }
          : battery
      ));

      closeUpdateModal();
      return true;
    } catch (err) {
      console.error('❌ Error updating battery:', err);
      alert('Có lỗi xảy ra: ' + err.message);
      return false;
    }
  };

  return {
    showUpdateModal,
    selectedBattery,
    updateData,
    openUpdateModal,
    closeUpdateModal,
    updateField,
    handleUpdateBattery
  };
};
