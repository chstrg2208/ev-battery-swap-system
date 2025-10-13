// Driver Battery Swap - Main Entry Point
// Refactored from monolithic 1706-line component into modular structure
import React from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import SwapBatteryContainer from './SwapBatteryContainer';

const DriverSwapBattery = () => {
  return (
    <DashboardLayout role="driver">
      <SwapBatteryContainer />
    </DashboardLayout>
  );
};

export default DriverSwapBattery;
