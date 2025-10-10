// Swap Slice - State management cho đổi pin
import { create } from 'zustand';
import swapService from '../services/swapService';

const useSwapStore = create((set, get) => ({
  // State
  swapRequests: [],
  swapHistory: [],
  swapStats: null,
  selectedRequest: null,
  isLoading: false,
  error: null,

  // Actions - Setters
  setSwapRequests: (requests) => set({ swapRequests: requests }),
  setSwapHistory: (history) => set({ swapHistory: history }),
  setSwapStats: (stats) => set({ swapStats: stats }),
  setSelectedRequest: (request) => set({ selectedRequest: request }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Reset state
  reset: () => set({
    swapRequests: [],
    swapHistory: [],
    swapStats: null,
    selectedRequest: null,
    isLoading: false,
    error: null
  }),

  // Async Actions

  // 1. Fetch danh sách yêu cầu đổi pin
  fetchSwapRequests: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await swapService.getSwapRequests(filters);
      if (response.success) {
        set({ 
          swapRequests: response.data, 
          isLoading: false 
        });
        return response.data;
      } else {
        set({ error: response.message, isLoading: false });
        return null;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  // 2. Fetch chi tiết một yêu cầu
  fetchSwapRequestById: async (requestId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await swapService.getSwapRequestById(requestId);
      if (response.success) {
        set({ 
          selectedRequest: response.data, 
          isLoading: false 
        });
        return response.data;
      } else {
        set({ error: response.message, isLoading: false });
        return null;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  // 3. Tạo yêu cầu đổi pin mới
  createSwapRequest: async (requestData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await swapService.createSwapRequest(requestData);
      if (response.success) {
        const currentRequests = get().swapRequests;
        set({
          swapRequests: [...currentRequests, response.data],
          isLoading: false
        });
        return response.data;
      } else {
        set({ error: response.message, isLoading: false });
        return null;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  // 4. Xác nhận đổi pin - Chọn pin mới
  confirmSwap: async (requestId, newBatteryId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await swapService.confirmSwap(requestId, newBatteryId);
      if (response.success) {
        const currentRequests = get().swapRequests;
        const updatedRequests = currentRequests.map(req =>
          req.id === requestId ? response.data : req
        );
        set({
          swapRequests: updatedRequests,
          selectedRequest: response.data,
          isLoading: false
        });
        return response.data;
      } else {
        set({ error: response.message, isLoading: false });
        return null;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  // 5. Ghi nhận thanh toán
  recordPayment: async (requestId, paymentData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await swapService.recordPayment(requestId, paymentData);
      if (response.success) {
        const currentRequests = get().swapRequests;
        const updatedRequests = currentRequests.map(req =>
          req.id === requestId ? response.data.request : req
        );
        set({
          swapRequests: updatedRequests,
          selectedRequest: response.data.request,
          isLoading: false
        });
        return response.data;
      } else {
        set({ error: response.message, isLoading: false });
        return null;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  // 6. Kiểm tra pin cũ
  checkOldBattery: async (requestId, batteryCheckData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await swapService.checkOldBattery(requestId, batteryCheckData);
      if (response.success) {
        const currentRequests = get().swapRequests;
        const updatedRequests = currentRequests.map(req =>
          req.id === requestId ? response.data.request : req
        );
        set({
          swapRequests: updatedRequests,
          selectedRequest: response.data.request,
          isLoading: false
        });
        return response.data;
      } else {
        set({ error: response.message, isLoading: false });
        return null;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  // 7. Hoàn tất đổi pin
  completeSwap: async (requestId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await swapService.completeSwap(requestId);
      if (response.success) {
        const currentRequests = get().swapRequests;
        const updatedRequests = currentRequests.map(req =>
          req.id === requestId ? response.data : req
        );
        
        // Thêm vào lịch sử
        const currentHistory = get().swapHistory;
        
        set({
          swapRequests: updatedRequests,
          swapHistory: [...currentHistory, response.data],
          selectedRequest: null,
          isLoading: false
        });
        return response.data;
      } else {
        set({ error: response.message, isLoading: false });
        return null;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  // 8. Từ chối yêu cầu
  rejectSwapRequest: async (requestId, reason = '') => {
    set({ isLoading: true, error: null });
    try {
      const response = await swapService.rejectSwapRequest(requestId, reason);
      if (response.success) {
        const currentRequests = get().swapRequests;
        const updatedRequests = currentRequests.map(req =>
          req.id === requestId ? response.data : req
        );
        set({
          swapRequests: updatedRequests,
          isLoading: false
        });
        return response.data;
      } else {
        set({ error: response.message, isLoading: false });
        return null;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  // 9. Fetch lịch sử đổi pin
  fetchSwapHistory: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await swapService.getSwapHistory(filters);
      if (response.success) {
        set({ 
          swapHistory: response.data, 
          isLoading: false 
        });
        return response.data;
      } else {
        set({ error: response.message, isLoading: false });
        return null;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  // 10. Fetch thống kê
  fetchSwapStats: async (stationId = null, date = null) => {
    set({ isLoading: true, error: null });
    try {
      const response = await swapService.getSwapStats(stationId, date);
      if (response.success) {
        set({ 
          swapStats: response.data, 
          isLoading: false 
        });
        return response.data;
      } else {
        set({ error: response.message, isLoading: false });
        return null;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  // Helper functions

  // Lấy yêu cầu pending
  getPendingRequests: () => {
    const requests = get().swapRequests;
    return requests.filter(req => req.status === 'Pending');
  },

  // Lấy yêu cầu đang xử lý
  getProcessingRequests: () => {
    const requests = get().swapRequests;
    return requests.filter(req => req.status === 'Processing');
  },

  // Lấy yêu cầu đã hoàn thành
  getCompletedRequests: () => {
    const requests = get().swapRequests;
    return requests.filter(req => req.status === 'Completed');
  },

  // Lấy yêu cầu bị từ chối
  getRejectedRequests: () => {
    const requests = get().swapRequests;
    return requests.filter(req => req.status === 'Rejected');
  },

  // Kiểm tra yêu cầu có cần thanh toán không
  needsPayment: (requestId) => {
    const requests = get().swapRequests;
    const request = requests.find(req => req.id === requestId);
    return request ? request.paymentRequired : false;
  }
}));

export default useSwapStore;
