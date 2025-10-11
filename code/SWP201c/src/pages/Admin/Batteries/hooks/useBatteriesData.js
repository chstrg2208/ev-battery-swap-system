// Admin/Batteries/hooks/useBatteriesData.js
// Custom hook for fetching battery data from API

import { useState, useEffect } from 'react';
import batteryService from '../../../../assets/js/services/batteryService';

export const useBatteriesData = () => {
  const [batteries, setBatteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBatteries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await batteryService.getAllBatteries();
      
      if (result.success) {
        setBatteries(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Không thể tải dữ liệu pin');
      console.error('Error fetching batteries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatteries();
  }, []);

  return {
    batteries,
    loading,
    error,
    refetch: fetchBatteries
  };
};
