// Station State Management
// State management cho stations

import { create } from 'zustand';

const useStationStore = create((set, get) => ({
  // State
  stations: [],
  nearbyStations: [],
  selectedStation: null,
  isLoading: false,
  error: null,

  // Actions
  setStations: (stations) => set({ stations }),
  
  setNearbyStations: (stations) => set({ nearbyStations: stations }),
  
  setSelectedStation: (station) => set({ selectedStation: station }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  fetchStations: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement fetch stations
      console.log('Station Store: Fetch all stations');
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchNearbyStations: async (location) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Implement fetch nearby stations
      console.log('Station Store: Fetch nearby stations', location);
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  clearError: () => set({ error: null }),
}));

export default useStationStore;