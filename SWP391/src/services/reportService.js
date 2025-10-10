// Report Service
// Mock API calls for report-related operations

class ReportService {
  constructor() {
    // Mock reports data
    this.mockReports = [
      {
        id: 'RPT001',
        date: '2024-10-05',
        stationId: 'STN001',
        stationName: 'Trạm Quận 1',
        totalSwaps: 45,
        completedSwaps: 42,
        pendingSwaps: 3,
        cancelledSwaps: 0,
        revenue: 2100000,
        totalPayments: 15,
        cashPayments: 8,
        cardPayments: 7,
        totalIssues: 3,
        resolvedIssues: 1,
        pendingIssues: 2,
        totalBatteries: 50,
        availableBatteries: 35,
        chargingBatteries: 12,
        maintenanceBatteries: 3,
        faultyBatteries: 0,
        averageSwapTime: 4.5,
        peakHours: '10:00-12:00, 17:00-19:00',
        createdAt: '2024-10-05 23:59:59',
        updatedAt: '2024-10-05 23:59:59'
      },
      {
        id: 'RPT002',
        date: '2024-10-04',
        stationId: 'STN001',
        stationName: 'Trạm Quận 1',
        totalSwaps: 38,
        completedSwaps: 36,
        pendingSwaps: 2,
        cancelledSwaps: 0,
        revenue: 1800000,
        totalPayments: 12,
        cashPayments: 6,
        cardPayments: 6,
        totalIssues: 2,
        resolvedIssues: 2,
        pendingIssues: 0,
        totalBatteries: 50,
        availableBatteries: 32,
        chargingBatteries: 15,
        maintenanceBatteries: 3,
        faultyBatteries: 0,
        averageSwapTime: 5.2,
        peakHours: '09:00-11:00, 18:00-20:00',
        createdAt: '2024-10-04 23:59:59',
        updatedAt: '2024-10-04 23:59:59'
      },
      {
        id: 'RPT003',
        date: '2024-10-03',
        stationId: 'STN001',
        stationName: 'Trạm Quận 1',
        totalSwaps: 52,
        completedSwaps: 50,
        pendingSwaps: 2,
        cancelledSwaps: 0,
        revenue: 2500000,
        totalPayments: 18,
        cashPayments: 10,
        cardPayments: 8,
        totalIssues: 1,
        resolvedIssues: 1,
        pendingIssues: 0,
        totalBatteries: 50,
        availableBatteries: 28,
        chargingBatteries: 19,
        maintenanceBatteries: 3,
        faultyBatteries: 0,
        averageSwapTime: 4.8,
        peakHours: '10:00-12:00, 17:00-19:00',
        createdAt: '2024-10-03 23:59:59',
        updatedAt: '2024-10-03 23:59:59'
      }
    ];
  }

  // Get reports by station and date range
  async getReportsByStation(stationId, startDate, endDate) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let reports = this.mockReports.filter(r => r.stationId === stationId);
        
        if (startDate && endDate) {
          reports = reports.filter(r => r.date >= startDate && r.date <= endDate);
        }
        
        resolve({
          success: true,
          data: reports,
          message: 'Reports retrieved successfully'
        });
      }, 500);
    });
  }

  // Get all reports (Admin only)
  async getAllReports(startDate, endDate) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let reports = [...this.mockReports];
        
        if (startDate && endDate) {
          reports = reports.filter(r => r.date >= startDate && r.date <= endDate);
        }
        
        resolve({
          success: true,
          data: reports,
          message: 'All reports retrieved successfully'
        });
      }, 500);
    });
  }

  // Get report by ID
  async getReportById(reportId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const report = this.mockReports.find(r => r.id === reportId);
        
        if (report) {
          resolve({
            success: true,
            data: report,
            message: 'Report retrieved successfully'
          });
        } else {
          resolve({
            success: false,
            data: null,
            message: 'Report not found'
          });
        }
      }, 300);
    });
  }

  // Generate daily report (automatically called at end of day)
  async generateDailyReport(stationId, date) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In real implementation, this would:
        // 1. Collect data from Swaps, Payments, Issues, Batteries tables
        // 2. Calculate statistics
        // 3. Save to Reports table
        
        const newReport = {
          id: `RPT${Date.now()}`,
          date: date,
          stationId: stationId,
          stationName: 'Trạm Quận 1', // Would be fetched from Stations table
          totalSwaps: 0,
          completedSwaps: 0,
          pendingSwaps: 0,
          cancelledSwaps: 0,
          revenue: 0,
          totalPayments: 0,
          cashPayments: 0,
          cardPayments: 0,
          totalIssues: 0,
          resolvedIssues: 0,
          pendingIssues: 0,
          totalBatteries: 50,
          availableBatteries: 35,
          chargingBatteries: 12,
          maintenanceBatteries: 3,
          faultyBatteries: 0,
          averageSwapTime: 0,
          peakHours: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        this.mockReports.unshift(newReport);
        
        resolve({
          success: true,
          data: newReport,
          message: 'Daily report generated successfully'
        });
      }, 1000);
    });
  }

  // Update report (when new transaction/payment occurs)
  async updateReport(reportId, updateData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reportIndex = this.mockReports.findIndex(r => r.id === reportId);
        
        if (reportIndex !== -1) {
          this.mockReports[reportIndex] = {
            ...this.mockReports[reportIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
          };
          
          resolve({
            success: true,
            data: this.mockReports[reportIndex],
            message: 'Report updated successfully'
          });
        } else {
          resolve({
            success: false,
            data: null,
            message: 'Report not found'
          });
        }
      }, 500);
    });
  }

  // Get summary statistics for a station
  async getStationSummary(stationId, startDate, endDate) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let reports = this.mockReports.filter(r => r.stationId === stationId);
        
        if (startDate && endDate) {
          reports = reports.filter(r => r.date >= startDate && r.date <= endDate);
        }
        
        const summary = {
          totalSwaps: reports.reduce((sum, r) => sum + r.totalSwaps, 0),
          completedSwaps: reports.reduce((sum, r) => sum + r.completedSwaps, 0),
          totalRevenue: reports.reduce((sum, r) => sum + r.revenue, 0),
          totalIssues: reports.reduce((sum, r) => sum + r.totalIssues, 0),
          resolvedIssues: reports.reduce((sum, r) => sum + r.resolvedIssues, 0),
          averageSwapTime: reports.length > 0 
            ? (reports.reduce((sum, r) => sum + r.averageSwapTime, 0) / reports.length).toFixed(1)
            : 0,
          totalDays: reports.length
        };
        
        resolve({
          success: true,
          data: summary,
          message: 'Summary retrieved successfully'
        });
      }, 500);
    });
  }

  // Compare stations (Admin only)
  async compareStations(stationIds, startDate, endDate) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const comparison = stationIds.map(stationId => {
          let reports = this.mockReports.filter(r => r.stationId === stationId);
          
          if (startDate && endDate) {
            reports = reports.filter(r => r.date >= startDate && r.date <= endDate);
          }
          
          return {
            stationId,
            stationName: reports[0]?.stationName || 'Unknown',
            totalSwaps: reports.reduce((sum, r) => sum + r.totalSwaps, 0),
            totalRevenue: reports.reduce((sum, r) => sum + r.revenue, 0),
            totalIssues: reports.reduce((sum, r) => sum + r.totalIssues, 0),
            averageSwapTime: reports.length > 0 
              ? (reports.reduce((sum, r) => sum + r.averageSwapTime, 0) / reports.length).toFixed(1)
              : 0
          };
        });
        
        resolve({
          success: true,
          data: comparison,
          message: 'Station comparison retrieved successfully'
        });
      }, 500);
    });
  }

  // Export report to CSV/PDF (mock)
  async exportReport(reportId, format = 'csv') {
    return new Promise((resolve) => {
      setTimeout(() => {
        const report = this.mockReports.find(r => r.id === reportId);
        
        if (report) {
          // In real implementation, this would generate a file
          resolve({
            success: true,
            data: {
              url: `https://example.com/reports/${reportId}.${format}`,
              filename: `report_${report.date}.${format}`
            },
            message: `Report exported as ${format.toUpperCase()}`
          });
        } else {
          resolve({
            success: false,
            data: null,
            message: 'Report not found'
          });
        }
      }, 1000);
    });
  }
}

export default new ReportService();
