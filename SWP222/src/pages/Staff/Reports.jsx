// Staff Reports
// Báo cáo hoạt động - Xem và tổng hợp báo cáo của trạm

import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const StaffReports = () => {
  // Mock data - Báo cáo theo ngày
  const [dailyReports, setDailyReports] = useState([
    {
      date: '2024-10-05',
      stationId: 'STN001',
      stationName: 'Trạm Quận 1',
      totalSwaps: 45,
      completedSwaps: 42,
      pendingSwaps: 3,
      revenue: 2100000, // VNĐ
      totalIssues: 3,
      resolvedIssues: 1,
      pendingIssues: 2,
      totalBatteries: 50,
      availableBatteries: 35,
      chargingBatteries: 12,
      maintenanceBatteries: 3,
      averageSwapTime: 4.5, // phút
      peakHours: '10:00-12:00, 17:00-19:00'
    },
    {
      date: '2024-10-04',
      stationId: 'STN001',
      stationName: 'Trạm Quận 1',
      totalSwaps: 38,
      completedSwaps: 36,
      pendingSwaps: 2,
      revenue: 1800000,
      totalIssues: 2,
      resolvedIssues: 2,
      pendingIssues: 0,
      totalBatteries: 50,
      availableBatteries: 32,
      chargingBatteries: 15,
      maintenanceBatteries: 3,
      averageSwapTime: 5.2,
      peakHours: '09:00-11:00, 18:00-20:00'
    },
    {
      date: '2024-10-03',
      stationId: 'STN001',
      stationName: 'Trạm Quận 1',
      totalSwaps: 52,
      completedSwaps: 50,
      pendingSwaps: 2,
      revenue: 2500000,
      totalIssues: 1,
      resolvedIssues: 1,
      pendingIssues: 0,
      totalBatteries: 50,
      availableBatteries: 28,
      chargingBatteries: 19,
      maintenanceBatteries: 3,
      averageSwapTime: 4.8,
      peakHours: '10:00-12:00, 17:00-19:00'
    }
  ]);

  // State cho filter
  const [dateRange, setDateRange] = useState('week'); // week, month, quarter, custom
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // State cho modal chi tiết
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Tính toán tổng hợp
  const calculateSummary = () => {
    const total = {
      totalSwaps: dailyReports.reduce((sum, r) => sum + r.totalSwaps, 0),
      completedSwaps: dailyReports.reduce((sum, r) => sum + r.completedSwaps, 0),
      revenue: dailyReports.reduce((sum, r) => sum + r.revenue, 0),
      totalIssues: dailyReports.reduce((sum, r) => sum + r.totalIssues, 0),
      resolvedIssues: dailyReports.reduce((sum, r) => sum + r.resolvedIssues, 0),
      averageSwapTime: (dailyReports.reduce((sum, r) => sum + r.averageSwapTime, 0) / dailyReports.length).toFixed(1)
    };
    return total;
  };

  const summary = calculateSummary();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Export báo cáo
  const handleExportReport = () => {
    // Mock export functionality
    alert('Đang xuất báo cáo... (Chức năng sẽ được triển khai với backend)');
  };

  return (
    <div style={{ padding: '20px', background: '#1a202c', minHeight: '100vh', color: 'white' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#FFFFFF', marginBottom: '10px', fontSize: '28px' }}>📊 Báo cáo hoạt động</h1>
        <p style={{ color: '#E0E0E0', fontSize: '16px' }}>Thống kê và báo cáo hoạt động của trạm</p>
      </div>

      {/* Filter Controls */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', color: '#E0E0E0', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
              Khoảng thời gian:
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                fontSize: '14px',
                minWidth: '150px'
              }}
            >
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
              <option value="quarter">3 tháng qua</option>
              <option value="custom">Tùy chỉnh</option>
            </select>
          </div>

          {dateRange === 'custom' && (
            <>
              <div>
                <label style={{ display: 'block', color: '#E0E0E0', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                  Từ ngày:
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#E0E0E0', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
                  Đến ngày:
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    fontSize: '14px'
                  }}
                />
              </div>
            </>
          )}
        </div>

        <button
          onClick={handleExportReport}
          style={{
            background: 'linear-gradient(135deg, #6ab7ff, #4a9eff)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          📥 Xuất báo cáo
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          textAlign: 'center',
          border: '1px solid rgba(106, 183, 255, 0.3)'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔄</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#6ab7ff', marginBottom: '5px' }}>
            {summary.totalSwaps}
          </div>
          <div style={{ fontSize: '14px', color: '#E0E0E0' }}>
            Tổng lần đổi pin
          </div>
          <div style={{ fontSize: '12px', color: '#B0B0B0', marginTop: '5px' }}>
            {summary.completedSwaps} hoàn thành
          </div>
        </div>

        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          textAlign: 'center',
          border: '1px solid rgba(25, 195, 125, 0.3)'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>💰</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#19c37d', marginBottom: '5px' }}>
            {formatCurrency(summary.revenue)}
          </div>
          <div style={{ fontSize: '14px', color: '#E0E0E0' }}>
            Tổng doanh thu
          </div>
          <div style={{ fontSize: '12px', color: '#B0B0B0', marginTop: '5px' }}>
            {dailyReports.length} ngày
          </div>
        </div>

        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          textAlign: 'center',
          border: '1px solid rgba(255, 165, 0, 0.3)'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🚨</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffa500', marginBottom: '5px' }}>
            {summary.totalIssues}
          </div>
          <div style={{ fontSize: '14px', color: '#E0E0E0' }}>
            Tổng sự cố
          </div>
          <div style={{ fontSize: '12px', color: '#B0B0B0', marginTop: '5px' }}>
            {summary.resolvedIssues} đã giải quyết
          </div>
        </div>

        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          textAlign: 'center',
          border: '1px solid rgba(139, 92, 246, 0.3)'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏱️</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '5px' }}>
            {summary.averageSwapTime}
          </div>
          <div style={{ fontSize: '14px', color: '#E0E0E0' }}>
            Thời gian TB (phút)
          </div>
          <div style={{ fontSize: '12px', color: '#B0B0B0', marginTop: '5px' }}>
            Mỗi lần đổi pin
          </div>
        </div>
      </div>

      {/* Daily Reports Table */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '30px'
      }}>
        <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '20px' }}>
          📅 Báo cáo theo ngày
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
              <tr>
                <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'left', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Ngày</th>
                <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Đổi pin</th>
                <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Doanh thu</th>
                <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Sự cố</th>
                <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Pin khả dụng</th>
                <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>TG TB</th>
                <th style={{ padding: '15px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '14px', textAlign: 'center', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {dailyReports.map((report, index) => (
                <tr key={report.date} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '15px', color: '#E0E0E0', fontSize: '14px' }}>
                    <div style={{ fontWeight: 'bold' }}>{report.date}</div>
                    <div style={{ fontSize: '12px', color: '#B0B0B0' }}>{report.stationName}</div>
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', textAlign: 'center' }}>
                    <div style={{ color: '#6ab7ff', fontWeight: 'bold', fontSize: '18px' }}>
                      {report.totalSwaps}
                    </div>
                    <div style={{ fontSize: '12px', color: '#19c37d' }}>
                      ✅ {report.completedSwaps}
                    </div>
                    <div style={{ fontSize: '12px', color: '#ffa500' }}>
                      ⏳ {report.pendingSwaps}
                    </div>
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', textAlign: 'center' }}>
                    <div style={{ color: '#19c37d', fontWeight: 'bold' }}>
                      {formatCurrency(report.revenue)}
                    </div>
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', textAlign: 'center' }}>
                    <div style={{ color: '#ffa500', fontWeight: 'bold', fontSize: '18px' }}>
                      {report.totalIssues}
                    </div>
                    <div style={{ fontSize: '12px', color: '#19c37d' }}>
                      ✅ {report.resolvedIssues}
                    </div>
                    <div style={{ fontSize: '12px', color: '#ff4757' }}>
                      ⏳ {report.pendingIssues}
                    </div>
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', textAlign: 'center' }}>
                    <div style={{ color: '#6ab7ff', fontWeight: 'bold', fontSize: '18px' }}>
                      {report.availableBatteries}/{report.totalBatteries}
                    </div>
                    <div style={{ fontSize: '12px', color: '#ffa500' }}>
                      🔌 {report.chargingBatteries} đang sạc
                    </div>
                    <div style={{ fontSize: '12px', color: '#ff4757' }}>
                      🔧 {report.maintenanceBatteries} bảo trì
                    </div>
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', textAlign: 'center' }}>
                    <div style={{ color: '#8b5cf6', fontWeight: 'bold', fontSize: '18px' }}>
                      {report.averageSwapTime}
                    </div>
                    <div style={{ fontSize: '12px', color: '#B0B0B0' }}>
                      phút
                    </div>
                  </td>
                  <td style={{ padding: '15px', fontSize: '14px', textAlign: 'center' }}>
                    <button 
                      onClick={() => {
                        setSelectedReport(report);
                        setShowDetailModal(true);
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #6ab7ff, #4a9eff)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      👁️ Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Biểu đồ đường - Số lần đổi pin */}
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '18px' }}>
            📊 Số lần đổi pin theo ngày
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyReports}>
              <defs>
                <linearGradient id="colorSwaps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6ab7ff" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6ab7ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="#E0E0E0"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#E0E0E0"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(26, 32, 44, 0.95)', 
                  border: '1px solid rgba(106, 183, 255, 0.3)',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="totalSwaps" 
                stroke="#6ab7ff" 
                fillOpacity={1} 
                fill="url(#colorSwaps)"
                name="Tổng số lần"
              />
              <Area 
                type="monotone" 
                dataKey="completedSwaps" 
                stroke="#19c37d" 
                fill="none"
                strokeWidth={2}
                name="Hoàn thành"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ cột - Doanh thu */}
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '18px' }}>
            💰 Doanh thu theo ngày
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyReports}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="#E0E0E0"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#E0E0E0"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(26, 32, 44, 0.95)', 
                  border: '1px solid rgba(25, 195, 125, 0.3)',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }}
                formatter={(value) => [`${formatCurrency(value)}`, 'Doanh thu']}
              />
              <Bar 
                dataKey="revenue" 
                fill="#19c37d"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Biểu đồ tổng hợp - Pin & Sự cố */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Biểu đồ đường - Tình trạng pin */}
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '18px' }}>
            🔋 Tình trạng pin theo ngày
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyReports}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="#E0E0E0"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#E0E0E0"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(26, 32, 44, 0.95)', 
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="availableBatteries" 
                stroke="#6ab7ff" 
                strokeWidth={2}
                name="Khả dụng"
                dot={{ fill: '#6ab7ff', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="chargingBatteries" 
                stroke="#ffa500" 
                strokeWidth={2}
                name="Đang sạc"
                dot={{ fill: '#ffa500', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="maintenanceBatteries" 
                stroke="#ff4757" 
                strokeWidth={2}
                name="Bảo trì"
                dot={{ fill: '#ff4757', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ cột - Sự cố */}
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '18px' }}>
            🚨 Sự cố theo ngày
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyReports}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="#E0E0E0"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#E0E0E0"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(26, 32, 44, 0.95)', 
                  border: '1px solid rgba(255, 165, 0, 0.3)',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }}
              />
              <Legend />
              <Bar 
                dataKey="totalIssues" 
                fill="#ffa500"
                radius={[8, 8, 0, 0]}
                name="Tổng sự cố"
              />
              <Bar 
                dataKey="resolvedIssues" 
                fill="#19c37d"
                radius={[8, 8, 0, 0]}
                name="Đã giải quyết"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modal: Chi tiết báo cáo */}
      {showDetailModal && selectedReport && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(26, 32, 44, 0.95)',
            borderRadius: '12px',
            padding: '30px',
            width: '700px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#FFFFFF', fontSize: '22px' }}>
              📊 Báo cáo chi tiết - {selectedReport.date}
            </h3>

            {/* Thông tin trạm */}
            <div style={{
              background: 'rgba(106, 183, 255, 0.1)',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px',
              border: '1px solid rgba(106, 183, 255, 0.3)'
            }}>
              <div style={{ color: '#6ab7ff', fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>
                {selectedReport.stationName}
              </div>
              <div style={{ color: '#E0E0E0', fontSize: '14px' }}>
                Mã trạm: {selectedReport.stationId}
              </div>
            </div>

            {/* Đổi pin */}
            <div style={{
              background: 'rgba(25, 195, 125, 0.1)',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '15px',
              border: '1px solid rgba(25, 195, 125, 0.3)'
            }}>
              <h4 style={{ color: '#19c37d', marginBottom: '10px', fontSize: '16px' }}>🔄 Đổi pin</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', color: '#E0E0E0', fontSize: '14px' }}>
                <div><strong>Tổng số:</strong> {selectedReport.totalSwaps} lần</div>
                <div><strong>Hoàn thành:</strong> {selectedReport.completedSwaps} lần</div>
                <div><strong>Đang chờ:</strong> {selectedReport.pendingSwaps} lần</div>
                <div><strong>TG trung bình:</strong> {selectedReport.averageSwapTime} phút</div>
              </div>
              <div style={{ marginTop: '10px', color: '#E0E0E0', fontSize: '14px' }}>
                <strong>Giờ cao điểm:</strong> {selectedReport.peakHours}
              </div>
            </div>

            {/* Doanh thu */}
            <div style={{
              background: 'rgba(255, 215, 0, 0.1)',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '15px',
              border: '1px solid rgba(255, 215, 0, 0.3)'
            }}>
              <h4 style={{ color: '#ffd700', marginBottom: '10px', fontSize: '16px' }}>💰 Doanh thu</h4>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#ffd700',
                textAlign: 'center',
                padding: '10px',
                background: 'rgba(255, 215, 0, 0.2)',
                borderRadius: '8px'
              }}>
                {formatCurrency(selectedReport.revenue)}
              </div>
            </div>

            {/* Sự cố */}
            <div style={{
              background: 'rgba(255, 165, 0, 0.1)',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '15px',
              border: '1px solid rgba(255, 165, 0, 0.3)'
            }}>
              <h4 style={{ color: '#ffa500', marginBottom: '10px', fontSize: '16px' }}>🚨 Sự cố</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', color: '#E0E0E0', fontSize: '14px' }}>
                <div><strong>Tổng:</strong> {selectedReport.totalIssues}</div>
                <div><strong>Đã giải quyết:</strong> {selectedReport.resolvedIssues}</div>
                <div><strong>Đang xử lý:</strong> {selectedReport.pendingIssues}</div>
              </div>
            </div>

            {/* Pin */}
            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              <h4 style={{ color: '#8b5cf6', marginBottom: '10px', fontSize: '16px' }}>🔋 Tình trạng pin</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', color: '#E0E0E0', fontSize: '14px' }}>
                <div><strong>Tổng số:</strong> {selectedReport.totalBatteries}</div>
                <div><strong>Khả dụng:</strong> {selectedReport.availableBatteries}</div>
                <div><strong>Đang sạc:</strong> {selectedReport.chargingBatteries}</div>
                <div><strong>Bảo trì:</strong> {selectedReport.maintenanceBatteries}</div>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedReport(null);
                }}
                style={{
                  background: 'linear-gradient(135deg, #6ab7ff, #4a9eff)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 30px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffReports;