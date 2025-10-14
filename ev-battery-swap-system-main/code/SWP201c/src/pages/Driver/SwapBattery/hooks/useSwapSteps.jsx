import { useState } from 'react';

// <-- SỬA LỖI: Dùng "export const" ở đây
export const useSwapSteps = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selection, setSelection] = useState({
    vehicle: null, // Sẽ được cập nhật từ AuthContext
    stationId: null,
    stationName: null,
    towerId: null,
    towerName: null,
    oldBatterySlot: null,
    newBatterySlot: null,
  });

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const resetSelections = () => {
    setCurrentStep(1);
    setSelection(prev => ({ 
      ...prev, 
      stationId: null,
      stationName: null,
      towerId: null,
      towerName: null,
      oldBatterySlot: null,
      newBatterySlot: null,
    }));
  };

  return {
    currentStep,
    selection,
    setSelection,
    nextStep,
    resetSelections,
  };
};

// **KHÔNG** có "export default" ở cuối file.