// Custom Hook for managing swap data fetching
import { useState, useCallback } from 'react';
import { stationService, batteryService, contractService, swapService } from '../../../../assets/js/services';
import { filterSlotsByStatus } from '../utils/swapHelpers';

// <-- SỬA LỖI: Dùng "export const" ở đây
export const useSwapData = (currentUser) => {
  const [stations, setStations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [userContract, setUserContract] = useState(null);
  const [towers, setTowers] = useState([]);
  const [fullSlots, setFullSlots] = useState([]);
  const [emptySlots, setEmptySlots] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingTowers, setLoadingTowers] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState(null);

  const fetchInitialData = useCallback(async (vehicleFromNavigation = null) => {
    try {
      setLoading(true);
      setError(null);
      const stationsResponse = await stationService.getAllStations();
      if (stationsResponse.success && stationsResponse.data) {
        const stationsList = Array.isArray(stationsResponse.data) ? stationsResponse.data : stationsResponse.data.stations || [];
        setStations(stationsList);
      }
      // You can add back the vehicle and contract fetching logic here if needed
    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchTowersByStation = async (stationId) => {
    try {
      setLoadingTowers(true);
      const response = await stationService.getTowersByStation(stationId);
      if (response.success && response.data) {
        const towersList = Array.isArray(response.data) ? response.data : response.data.towers || [];
        setTowers(towersList);
      } else {
        setTowers([]);
      }
    } catch (err) {
      console.error('❌ Error fetching towers:', err);
      setTowers([]);
    } finally {
      setLoadingTowers(false);
    }
  };

  const fetchSlotsByTower = async (towerId) => {
    try {
      setLoadingSlots(true);
      const response = await stationService.getSlotsByTower(towerId);
      if (response.success && response.data) {
        const slotsList = Array.isArray(response.data) ? response.data : response.data.slots || [];
        const { fullSlots: full, emptySlots: empty } = filterSlotsByStatus(slotsList);
        setFullSlots(full);
        setEmptySlots(empty);
      } else {
        setFullSlots([]);
        setEmptySlots([]);
      }
    } catch (err) {
      console.error('❌ Error fetching slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const createSwap = async (swapData) => {
    try {
      setLoading(true);
      const response = await swapService.createSwap(swapData);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message);
    } catch (error) {
      console.error('Error creating swap:', error);
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Add other functions like updateSwap, deleteSwap if you need them

  return {
    stations,
    vehicles,
    userContract,
    towers,
    fullSlots,
    emptySlots,
    loading,
    loadingTowers,
    loadingSlots,
    error,
    fetchInitialData,
    fetchTowersByStation,
    fetchSlotsByTower,
    createSwap,
    setError
  };
};

// **KHÔNG** có "export default" ở cuối file.