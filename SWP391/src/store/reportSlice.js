// Report Slice
// Zustand store for report management

import { create } from 'zustand';
import reportService from '../services/reportService';

const useReportStore = create((set, get) => ({
  // State
  reports: [],
  currentReport: null,
  summary: null,
  loading: false,
  error: null,

  // Actions

  // Get reports by station
  fetchReportsByStation: async (stationId, startDate, endDate) => {
    set({ loading: true, error: null });
    try {
      const response = await reportService.getReportsByStation(stationId, startDate, endDate);
      if (response.success) {
        set({ 
          reports: response.data, 
          loading: false 
        });
      } else {
        set({ 
          error: response.message, 
          loading: false 
        });
      }
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
    }
  },

  // Get all reports (Admin)
  fetchAllReports: async (startDate, endDate) => {
    set({ loading: true, error: null });
    try {
      const response = await reportService.getAllReports(startDate, endDate);
      if (response.success) {
        set({ 
          reports: response.data, 
          loading: false 
        });
      } else {
        set({ 
          error: response.message, 
          loading: false 
        });
      }
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
    }
  },

  // Get report by ID
  fetchReportById: async (reportId) => {
    set({ loading: true, error: null });
    try {
      const response = await reportService.getReportById(reportId);
      if (response.success) {
        set({ 
          currentReport: response.data, 
          loading: false 
        });
      } else {
        set({ 
          error: response.message, 
          loading: false 
        });
      }
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
    }
  },

  // Generate daily report
  generateDailyReport: async (stationId, date) => {
    set({ loading: true, error: null });
    try {
      const response = await reportService.generateDailyReport(stationId, date);
      if (response.success) {
        // Add new report to the list
        set(state => ({ 
          reports: [response.data, ...state.reports],
          loading: false 
        }));
        return response.data;
      } else {
        set({ 
          error: response.message, 
          loading: false 
        });
        return null;
      }
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
      return null;
    }
  },

  // Update report (when transaction/payment occurs)
  updateReport: async (reportId, updateData) => {
    set({ loading: true, error: null });
    try {
      const response = await reportService.updateReport(reportId, updateData);
      if (response.success) {
        // Update report in the list
        set(state => ({
          reports: state.reports.map(r => 
            r.id === reportId ? response.data : r
          ),
          currentReport: state.currentReport?.id === reportId 
            ? response.data 
            : state.currentReport,
          loading: false
        }));
        return response.data;
      } else {
        set({ 
          error: response.message, 
          loading: false 
        });
        return null;
      }
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
      return null;
    }
  },

  // Get station summary
  fetchStationSummary: async (stationId, startDate, endDate) => {
    set({ loading: true, error: null });
    try {
      const response = await reportService.getStationSummary(stationId, startDate, endDate);
      if (response.success) {
        set({ 
          summary: response.data, 
          loading: false 
        });
      } else {
        set({ 
          error: response.message, 
          loading: false 
        });
      }
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
    }
  },

  // Compare stations (Admin)
  compareStations: async (stationIds, startDate, endDate) => {
    set({ loading: true, error: null });
    try {
      const response = await reportService.compareStations(stationIds, startDate, endDate);
      if (response.success) {
        set({ 
          loading: false 
        });
        return response.data;
      } else {
        set({ 
          error: response.message, 
          loading: false 
        });
        return null;
      }
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
      return null;
    }
  },

  // Export report
  exportReport: async (reportId, format = 'csv') => {
    set({ loading: true, error: null });
    try {
      const response = await reportService.exportReport(reportId, format);
      if (response.success) {
        set({ loading: false });
        return response.data;
      } else {
        set({ 
          error: response.message, 
          loading: false 
        });
        return null;
      }
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
      return null;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Clear current report
  clearCurrentReport: () => set({ currentReport: null }),

  // Clear all reports
  clearReports: () => set({ reports: [], currentReport: null, summary: null })
}));

export default useReportStore;
