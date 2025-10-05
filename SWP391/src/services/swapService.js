// Swap Service - Quản lý các API calls liên quan đến đổi pin

class SwapService {
  constructor() {
    // Mock data - Danh sách yêu cầu đổi pin
    this.mockSwapRequests = [
      {
        id: 'SWP001',
        driverId: 'DRV001',
        driverName: 'Nguyễn Văn A',
        driverPhone: '0901234567',
        vehicleId: 'VEH001',
        vehicleNumber: '59A-12345',
        oldBatteryId: 'BAT-001',
        oldBatterySOC: 15,
        newBatteryId: null,
        stationId: 'STN001',
        stationName: 'Trạm Quận 1',
        requestTime: '2024-10-05 09:30',
        completedTime: null,
        status: 'Pending', // Pending, Processing, Completed, Rejected
        subscriptionType: 'Premium',
        kmThisMonth: 850, // km đã chạy trong tháng
        kmLimit: null, // Premium = không giới hạn
        paymentRequired: false,
        paymentAmount: 0,
        paymentMethod: null,
        batteryCheckData: null
      },
      {
        id: 'SWP002',
        driverId: 'DRV002',
        driverName: 'Trần Thị B',
        driverPhone: '0912345678',
        vehicleId: 'VEH002',
        vehicleNumber: '59B-67890',
        oldBatteryId: 'BAT-045',
        oldBatterySOC: 8,
        newBatteryId: null,
        stationId: 'STN001',
        stationName: 'Trạm Quận 1',
        requestTime: '2024-10-05 09:45',
        completedTime: null,
        status: 'Pending',
        subscriptionType: 'Basic',
        kmThisMonth: 380, // Chưa vượt (< 400km)
        kmLimit: 400, // Basic = 400km/tháng
        paymentRequired: false,
        paymentAmount: 0,
        paymentMethod: null,
        batteryCheckData: null
      },
      {
        id: 'SWP003',
        driverId: 'DRV003',
        driverName: 'Lê Văn C',
        driverPhone: '0923456789',
        vehicleId: 'VEH003',
        vehicleNumber: '59C-11111',
        oldBatteryId: 'BAT-089',
        oldBatterySOC: 5,
        newBatteryId: null,
        stationId: 'STN001',
        stationName: 'Trạm Quận 1',
        requestTime: '2024-10-05 10:00',
        completedTime: null,
        status: 'Pending',
        subscriptionType: 'Basic',
        kmThisMonth: 450, // Vượt gói (> 400km)
        kmLimit: 400,
        paymentRequired: true,
        paymentAmount: 5000, // (450-400) * 100 = 5,000 VNĐ
        paymentMethod: null,
        batteryCheckData: null
      }
    ];

    // Mock data - Lịch sử giao dịch đổi pin
    this.mockSwapHistory = [];
  }

  // Delay để giả lập API call
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 1. Lấy danh sách yêu cầu đổi pin
  async getSwapRequests(filters = {}) {
    try {
      await this.delay(500);
      
      let filteredRequests = [...this.mockSwapRequests];

      // Filter by status
      if (filters.status) {
        filteredRequests = filteredRequests.filter(req => req.status === filters.status);
      }

      // Filter by station
      if (filters.stationId) {
        filteredRequests = filteredRequests.filter(req => req.stationId === filters.stationId);
      }

      // Filter by date
      if (filters.date) {
        filteredRequests = filteredRequests.filter(req => 
          req.requestTime.startsWith(filters.date)
        );
      }

      return {
        success: true,
        data: filteredRequests,
        message: 'Swap requests retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to get swap requests'
      };
    }
  }

  // 2. Lấy chi tiết một yêu cầu đổi pin
  async getSwapRequestById(requestId) {
    try {
      await this.delay(300);
      
      const request = this.mockSwapRequests.find(req => req.id === requestId);
      
      if (!request) {
        return {
          success: false,
          data: null,
          message: 'Swap request not found'
        };
      }

      return {
        success: true,
        data: request,
        message: 'Swap request retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to get swap request'
      };
    }
  }

  // 3. Tạo yêu cầu đổi pin mới (từ Driver)
  async createSwapRequest(requestData) {
    try {
      await this.delay(800);
      
      const newRequest = {
        id: `SWP${String(this.mockSwapRequests.length + 1).padStart(3, '0')}`,
        ...requestData,
        requestTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
        completedTime: null,
        status: 'Pending',
        newBatteryId: null,
        paymentRequired: requestData.kmLimit !== null && requestData.kmThisMonth > requestData.kmLimit,
        paymentAmount: (requestData.kmLimit !== null && requestData.kmThisMonth > requestData.kmLimit) 
          ? (requestData.kmThisMonth - requestData.kmLimit) * 100 
          : 0,
        paymentMethod: null,
        batteryCheckData: null
      };

      this.mockSwapRequests.push(newRequest);

      return {
        success: true,
        data: newRequest,
        message: 'Swap request created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to create swap request'
      };
    }
  }

  // 4. Xác nhận đổi pin - Chọn pin mới
  async confirmSwap(requestId, newBatteryId) {
    try {
      await this.delay(600);
      
      const requestIndex = this.mockSwapRequests.findIndex(req => req.id === requestId);
      
      if (requestIndex === -1) {
        return {
          success: false,
          data: null,
          message: 'Swap request not found'
        };
      }

      this.mockSwapRequests[requestIndex] = {
        ...this.mockSwapRequests[requestIndex],
        newBatteryId,
        status: 'Processing'
      };

      return {
        success: true,
        data: this.mockSwapRequests[requestIndex],
        message: 'Battery selected successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to confirm swap'
      };
    }
  }

  // 5. Ghi nhận thanh toán
  async recordPayment(requestId, paymentData) {
    try {
      await this.delay(700);
      
      const requestIndex = this.mockSwapRequests.findIndex(req => req.id === requestId);
      
      if (requestIndex === -1) {
        return {
          success: false,
          data: null,
          message: 'Swap request not found'
        };
      }

      this.mockSwapRequests[requestIndex] = {
        ...this.mockSwapRequests[requestIndex],
        paymentAmount: paymentData.amount,
        paymentMethod: paymentData.method,
        paymentRequired: true
      };

      // Tạo payment record
      const paymentRecord = {
        id: `PAY${Date.now()}`,
        swapRequestId: requestId,
        amount: paymentData.amount,
        method: paymentData.method,
        timestamp: new Date().toISOString(),
        status: 'Completed'
      };

      return {
        success: true,
        data: {
          request: this.mockSwapRequests[requestIndex],
          payment: paymentRecord
        },
        message: 'Payment recorded successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to record payment'
      };
    }
  }

  // 6. Kiểm tra và ghi nhận tình trạng pin cũ
  async checkOldBattery(requestId, batteryCheckData) {
    try {
      await this.delay(600);
      
      const requestIndex = this.mockSwapRequests.findIndex(req => req.id === requestId);
      
      if (requestIndex === -1) {
        return {
          success: false,
          data: null,
          message: 'Swap request not found'
        };
      }

      this.mockSwapRequests[requestIndex] = {
        ...this.mockSwapRequests[requestIndex],
        batteryCheckData: {
          ...batteryCheckData,
          checkedAt: new Date().toISOString(),
          checkedBy: 'Staff001' // Mock staff ID
        }
      };

      // Tạo battery history record
      const batteryHistory = {
        id: `HIST${Date.now()}`,
        batteryId: this.mockSwapRequests[requestIndex].oldBatteryId,
        swapRequestId: requestId,
        soh: batteryCheckData.soh,
        physicalCondition: batteryCheckData.physicalCondition,
        notes: batteryCheckData.notes,
        needsMaintenance: batteryCheckData.needsMaintenance,
        timestamp: new Date().toISOString()
      };

      return {
        success: true,
        data: {
          request: this.mockSwapRequests[requestIndex],
          batteryHistory
        },
        message: 'Battery check recorded successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to check battery'
      };
    }
  }

  // 7. Hoàn tất đổi pin
  async completeSwap(requestId) {
    try {
      await this.delay(800);
      
      const requestIndex = this.mockSwapRequests.findIndex(req => req.id === requestId);
      
      if (requestIndex === -1) {
        return {
          success: false,
          data: null,
          message: 'Swap request not found'
        };
      }

      const completedRequest = {
        ...this.mockSwapRequests[requestIndex],
        status: 'Completed',
        completedTime: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };

      this.mockSwapRequests[requestIndex] = completedRequest;

      // Thêm vào lịch sử
      this.mockSwapHistory.push(completedRequest);

      // Cập nhật trạng thái pin:
      // - Pin cũ → Charging
      // - Pin mới → In Use
      // - Nếu pin cần maintenance → Maintenance

      return {
        success: true,
        data: completedRequest,
        message: 'Swap completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to complete swap'
      };
    }
  }

  // 8. Từ chối yêu cầu đổi pin
  async rejectSwapRequest(requestId, reason = '') {
    try {
      await this.delay(500);
      
      const requestIndex = this.mockSwapRequests.findIndex(req => req.id === requestId);
      
      if (requestIndex === -1) {
        return {
          success: false,
          data: null,
          message: 'Swap request not found'
        };
      }

      this.mockSwapRequests[requestIndex] = {
        ...this.mockSwapRequests[requestIndex],
        status: 'Rejected',
        rejectedReason: reason,
        rejectedAt: new Date().toISOString()
      };

      return {
        success: true,
        data: this.mockSwapRequests[requestIndex],
        message: 'Swap request rejected'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to reject swap request'
      };
    }
  }

  // 9. Lấy lịch sử đổi pin
  async getSwapHistory(filters = {}) {
    try {
      await this.delay(500);
      
      let history = [...this.mockSwapHistory];

      // Filter by driver
      if (filters.driverId) {
        history = history.filter(swap => swap.driverId === filters.driverId);
      }

      // Filter by station
      if (filters.stationId) {
        history = history.filter(swap => swap.stationId === filters.stationId);
      }

      // Filter by date range
      if (filters.startDate && filters.endDate) {
        history = history.filter(swap => 
          swap.completedTime >= filters.startDate && 
          swap.completedTime <= filters.endDate
        );
      }

      return {
        success: true,
        data: history,
        message: 'Swap history retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to get swap history'
      };
    }
  }

  // 10. Lấy thống kê đổi pin
  async getSwapStats(stationId = null, date = null) {
    try {
      await this.delay(400);
      
      let requests = [...this.mockSwapRequests];
      
      if (stationId) {
        requests = requests.filter(req => req.stationId === stationId);
      }
      
      if (date) {
        requests = requests.filter(req => req.requestTime.startsWith(date));
      }

      const stats = {
        total: requests.length,
        pending: requests.filter(req => req.status === 'Pending').length,
        processing: requests.filter(req => req.status === 'Processing').length,
        completed: requests.filter(req => req.status === 'Completed').length,
        rejected: requests.filter(req => req.status === 'Rejected').length,
        totalRevenue: requests
          .filter(req => req.status === 'Completed' && req.paymentRequired)
          .reduce((sum, req) => sum + req.paymentAmount, 0),
        averageWaitTime: '5 phút', // Mock data
        todaySwaps: requests.filter(req => 
          req.requestTime.startsWith(new Date().toISOString().split('T')[0])
        ).length
      };

      return {
        success: true,
        data: stats,
        message: 'Swap statistics retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to get swap statistics'
      };
    }
  }
}

// Export singleton instance
const swapService = new SwapService();
export default swapService;
