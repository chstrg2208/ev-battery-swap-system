// Station Service
// Handle station operations and data

class StationService {
  // Mock data for development
  mockStations = [
    {
      id: 1,
      name: "Trạm đổi pin Quận 1",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      status: "Hoạt động",
      totalSlots: 20,
      availableSlots: 15,
      phone: "028-1234-5678",
      manager: "Nguyễn Văn A",
      capacity: "20 slots",
      todayTransactions: 45,
      totalBatteries: 18,
      availableBatteries: 15,
      chargingBatteries: 3,
      maintenanceBatteries: 0,
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-02-10",
      operatingHours: "24/7",
      services: ["Đổi pin", "Sạc nhanh", "Bảo trì"],
      rating: 4.8,
      totalTransactions: 1250
    },
    {
      id: 2,
      name: "Trạm đổi pin Quận 3",
      address: "456 Lê Văn Sỹ, Quận 3, TP.HCM",
      status: "Bảo trì",
      totalSlots: 15,
      availableSlots: 0,
      phone: "028-2345-6789",
      manager: "Trần Thị B",
      capacity: "15 slots",
      todayTransactions: 0,
      totalBatteries: 12,
      availableBatteries: 0,
      chargingBatteries: 8,
      maintenanceBatteries: 4,
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-01-20",
      operatingHours: "Tạm ngưng",
      services: ["Đổi pin", "Sạc nhanh"],
      rating: 4.5,
      totalTransactions: 890
    },
    {
      id: 3,
      name: "Trạm đổi pin Quận 7",
      address: "789 Nguyễn Thị Thập, Quận 7, TP.HCM",
      status: "Hoạt động",
      totalSlots: 25,
      availableSlots: 18,
      phone: "028-3456-7890",
      manager: "Lê Văn C",
      capacity: "25 slots",
      todayTransactions: 67,
      totalBatteries: 22,
      availableBatteries: 18,
      chargingBatteries: 4,
      maintenanceBatteries: 0,
      lastMaintenance: "2024-01-08",
      nextMaintenance: "2024-02-08",
      operatingHours: "6:00 - 22:00",
      services: ["Đổi pin", "Sạc nhanh", "Bảo trì", "Hỗ trợ 24/7"],
      rating: 4.9,
      totalTransactions: 2100
    },
    {
      id: 4,
      name: "Trạm đổi pin Quận 10",
      address: "321 Cách Mạng Tháng 8, Quận 10, TP.HCM",
      status: "Hoạt động",
      totalSlots: 18,
      availableSlots: 12,
      phone: "028-4567-8901",
      manager: "Phạm Thị D",
      capacity: "18 slots",
      todayTransactions: 34,
      totalBatteries: 16,
      availableBatteries: 12,
      chargingBatteries: 3,
      maintenanceBatteries: 1,
      lastMaintenance: "2024-01-12",
      nextMaintenance: "2024-02-12",
      operatingHours: "5:30 - 23:30",
      services: ["Đổi pin", "Sạc nhanh"],
      rating: 4.6,
      totalTransactions: 1560
    }
  ];

  async getStations() {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In real app, this would be: return await fetch('/api/stations').then(res => res.json());
      return {
        success: true,
        data: this.mockStations,
        message: 'Stations retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to fetch stations'
      };
    }
  }

  async getStationById(stationId) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const station = this.mockStations.find(s => s.id === parseInt(stationId));
      
      if (!station) {
        throw new Error('Station not found');
      }

      return {
        success: true,
        data: station,
        message: 'Station retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to fetch station'
      };
    }
  }

  async createStation(stationData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newStation = {
        id: Math.max(...this.mockStations.map(s => s.id)) + 1,
        ...stationData,
        status: "Hoạt động",
        availableSlots: stationData.totalSlots,
        todayTransactions: 0,
        totalBatteries: stationData.totalSlots,
        availableBatteries: stationData.totalSlots,
        chargingBatteries: 0,
        maintenanceBatteries: 0,
        lastMaintenance: new Date().toISOString().split('T')[0],
        nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        rating: 0,
        totalTransactions: 0,
        capacity: `${stationData.totalSlots} slots`
      };

      this.mockStations.push(newStation);

      return {
        success: true,
        data: newStation,
        message: 'Station created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to create station'
      };
    }
  }

  async updateStation(stationId, updateData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const stationIndex = this.mockStations.findIndex(s => s.id === parseInt(stationId));
      
      if (stationIndex === -1) {
        throw new Error('Station not found');
      }

      const updatedStation = {
        ...this.mockStations[stationIndex],
        ...updateData,
        availableSlots: updateData.totalSlots || this.mockStations[stationIndex].totalSlots,
        capacity: `${updateData.totalSlots || this.mockStations[stationIndex].totalSlots} slots`
      };

      this.mockStations[stationIndex] = updatedStation;

      return {
        success: true,
        data: updatedStation,
        message: 'Station updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to update station'
      };
    }
  }

  async deleteStation(stationId) {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const stationIndex = this.mockStations.findIndex(s => s.id === parseInt(stationId));
      
      if (stationIndex === -1) {
        throw new Error('Station not found');
      }

      const deletedStation = this.mockStations[stationIndex];
      this.mockStations.splice(stationIndex, 1);

      return {
        success: true,
        data: deletedStation,
        message: 'Station deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to delete station'
      };
    }
  }

  async getNearbyStations(location) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock implementation - in real app would calculate distance
      const nearbyStations = this.mockStations.filter(station => 
        station.status === 'Hoạt động' && station.availableSlots > 0
      );

      return {
        success: true,
        data: nearbyStations,
        message: 'Nearby stations retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to fetch nearby stations'
      };
    }
  }

  async getStationAvailability(stationId) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const station = this.mockStations.find(s => s.id === parseInt(stationId));
      
      if (!station) {
        throw new Error('Station not found');
      }

      return {
        success: true,
        data: {
          stationId: station.id,
          availableSlots: station.availableSlots,
          totalSlots: station.totalSlots,
          availableBatteries: station.availableBatteries,
          chargingBatteries: station.chargingBatteries,
          maintenanceBatteries: station.maintenanceBatteries,
          status: station.status
        },
        message: 'Station availability retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to fetch station availability'
      };
    }
  }

  async bookStation(stationId, userId, timeSlot) {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const station = this.mockStations.find(s => s.id === parseInt(stationId));
      
      if (!station) {
        throw new Error('Station not found');
      }

      if (station.availableSlots <= 0) {
        throw new Error('No available slots at this station');
      }

      // Mock booking logic
      station.availableSlots -= 1;
      station.todayTransactions += 1;

      return {
        success: true,
        data: {
          bookingId: `BK-${Date.now()}`,
          stationId: station.id,
          userId: userId,
          timeSlot: timeSlot,
          status: 'confirmed'
        },
        message: 'Station booked successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to book station'
      };
    }
  }

  async updateStationStatus(stationId, status) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const stationIndex = this.mockStations.findIndex(s => s.id === parseInt(stationId));
      
      if (stationIndex === -1) {
        throw new Error('Station not found');
      }

      this.mockStations[stationIndex].status = status;

      return {
        success: true,
        data: this.mockStations[stationIndex],
        message: 'Station status updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to update station status'
      };
    }
  }

  async getStationStats() {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const stats = {
        total: this.mockStations.length,
        active: this.mockStations.filter(s => s.status === 'Hoạt động').length,
        maintenance: this.mockStations.filter(s => s.status === 'Bảo trì').length,
        totalTransactions: this.mockStations.reduce((sum, s) => sum + s.todayTransactions, 0),
        totalBatteries: this.mockStations.reduce((sum, s) => sum + s.totalBatteries, 0),
        availableBatteries: this.mockStations.reduce((sum, s) => sum + s.availableBatteries, 0)
      };

      return {
        success: true,
        data: stats,
        message: 'Station statistics retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to fetch station statistics'
      };
    }
  }
}

export default new StationService();