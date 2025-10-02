/**
 * Battery Health Management System
 * Monitor battery percentage, health, and degradation
 */

class BatteryHealthSystem {
    constructor() {
        this.userBatteries = this.loadUserBatteries();
        this.healthHistory = this.loadHealthHistory();
        this.currentVehicle = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateSampleData();
    }

    // Generate sample battery data for demo
    generateSampleData() {
        if (Object.keys(this.userBatteries).length === 0) {
            const sampleVehicles = [
                {
                    id: 'VEH001',
                    name: 'VinFast VF8',
                    batteryId: 'BAT001',
                    batteryCapacity: 87.7, // kWh
                    currentCharge: 75, // %
                    health: 92, // %
                    cycleCount: 245,
                    manufactureDate: '2023-06-15',
                    lastChecked: new Date().toISOString()
                },
                {
                    id: 'VEH002', 
                    name: 'VinFast VF9',
                    batteryId: 'BAT002',
                    batteryCapacity: 123, // kWh
                    currentCharge: 45, // %
                    health: 88, // %
                    cycleCount: 412,
                    manufactureDate: '2023-03-22',
                    lastChecked: new Date().toISOString()
                },
                {
                    id: 'VEH003',
                    name: 'Tesla Model 3',
                    batteryId: 'BAT003',
                    batteryCapacity: 75, // kWh
                    currentCharge: 89, // %
                    health: 95, // %
                    cycleCount: 156,
                    manufactureDate: '2024-01-10',
                    lastChecked: new Date().toISOString()
                }
            ];

            sampleVehicles.forEach(vehicle => {
                this.userBatteries[vehicle.id] = vehicle;
                this.generateHealthHistory(vehicle.id);
            });

            this.saveUserBatteries();
            this.saveHealthHistory();
        }
    }

    // Generate historical health data
    generateHealthHistory(vehicleId) {
        const vehicle = this.userBatteries[vehicleId];
        if (!vehicle) return;

        const history = [];
        const startDate = new Date(vehicle.manufactureDate);
        const currentDate = new Date();
        const daysBetween = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));

        // Generate weekly data points
        for (let i = 0; i <= daysBetween; i += 7) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            
            // Simulate gradual battery degradation
            const ageMonths = i / 30;
            const baseHealth = 100;
            const degradationRate = 0.5; // % per month
            const randomVariation = (Math.random() - 0.5) * 2; // ±1%
            
            const health = Math.max(
                baseHealth - (ageMonths * degradationRate) + randomVariation,
                vehicle.health - 5 // Don't go too far below current
            );

            history.push({
                date: date.toISOString().split('T')[0],
                health: Math.round(health * 10) / 10,
                chargeLevel: Math.floor(Math.random() * 100),
                temperature: Math.floor(Math.random() * 20) + 20, // 20-40°C
                cycleCount: Math.floor((i / 7) * 2) // ~2 cycles per week
            });
        }

        this.healthHistory[vehicleId] = history;
    }

    // Load saved data
    loadUserBatteries() {
        const saved = localStorage.getItem('userBatteries');
        return saved ? JSON.parse(saved) : {};
    }

    loadHealthHistory() {
        const saved = localStorage.getItem('batteryHealthHistory');
        return saved ? JSON.parse(saved) : {};
    }

    // Save data
    saveUserBatteries() {
        localStorage.setItem('userBatteries', JSON.stringify(this.userBatteries));
    }

    saveHealthHistory() {
        localStorage.setItem('batteryHealthHistory', JSON.stringify(this.healthHistory));
    }

    // Setup event listeners
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.select-vehicle-btn')) {
                const vehicleId = e.target.dataset.vehicleId;
                this.selectVehicle(vehicleId);
            }
            
            if (e.target.matches('.refresh-data-btn')) {
                this.refreshBatteryData();
            }

            if (e.target.matches('.export-report-btn')) {
                this.exportHealthReport();
            }
        });
    }

    // Render battery health dashboard
    renderBatteryHealthDashboard() {
        return `
            <div class="battery-health-dashboard">
                <div class="dashboard-header">
                    <h2>🔋 Quản Lý Pin Xe Điện</h2>
                    <button class="btn btn-secondary refresh-data-btn">
                        🔄 Cập Nhật Dữ Liệu
                    </button>
                </div>

                <div class="vehicle-selection">
                    <h3>Chọn Xe Của Bạn</h3>
                    <div class="vehicle-grid">
                        ${Object.values(this.userBatteries).map(vehicle => `
                            <div class="vehicle-card ${this.currentVehicle?.id === vehicle.id ? 'selected' : ''}">
                                <div class="vehicle-info">
                                    <h4>${vehicle.name}</h4>
                                    <p>ID: ${vehicle.id}</p>
                                    <div class="battery-preview">
                                        <div class="charge-level">
                                            <span class="charge-percent">${vehicle.currentCharge}%</span>
                                            <div class="charge-bar">
                                                <div class="charge-fill" style="width: ${vehicle.currentCharge}%"></div>
                                            </div>
                                        </div>
                                        <div class="health-indicator">
                                            <span class="health-percent ${this.getHealthClass(vehicle.health)}">
                                                ${vehicle.health}% Health
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button class="btn btn-primary select-vehicle-btn" data-vehicle-id="${vehicle.id}">
                                    Chi Tiết
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                ${this.currentVehicle ? this.renderDetailedView() : ''}
            </div>
        `;
    }

    // Render detailed battery view
    renderDetailedView() {
        const vehicle = this.currentVehicle;
        const history = this.healthHistory[vehicle.id] || [];
        const latestHistory = history.slice(-30); // Last 30 data points

        return `
            <div class="detailed-battery-view">
                <div class="vehicle-header">
                    <h3>📊 ${vehicle.name} - Chi Tiết Pin</h3>
                    <div class="last-updated">
                        Cập nhật lần cuối: ${new Date(vehicle.lastChecked).toLocaleString('vi-VN')}
                    </div>
                </div>

                <div class="battery-metrics-grid">
                    <!-- Current Status -->
                    <div class="metric-card current-status">
                        <h4>🔋 Trạng Thái Hiện Tại</h4>
                        <div class="large-charge-display">
                            <div class="charge-circle">
                                <svg viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" stroke="#e0e0e0" stroke-width="8" fill="none"/>
                                    <circle cx="50" cy="50" r="45" stroke="${this.getChargeColor(vehicle.currentCharge)}" 
                                            stroke-width="8" fill="none" stroke-dasharray="283" 
                                            stroke-dashoffset="${283 - (283 * vehicle.currentCharge / 100)}"
                                            transform="rotate(-90 50 50)"/>
                                </svg>
                                <div class="charge-text">
                                    <span class="charge-number">${vehicle.currentCharge}</span>
                                    <span class="charge-unit">%</span>
                                </div>
                            </div>
                            <div class="range-estimate">
                                <strong>Quãng đường dự kiến:</strong><br>
                                ${this.calculateRange(vehicle)}
                            </div>
                        </div>
                    </div>

                    <!-- Battery Health -->
                    <div class="metric-card health-status">
                        <h4>💊 Độ Chai Pin</h4>
                        <div class="health-gauge">
                            <div class="health-bar">
                                <div class="health-fill ${this.getHealthClass(vehicle.health)}" 
                                     style="width: ${vehicle.health}%"></div>
                            </div>
                            <div class="health-value">
                                <span class="health-number">${vehicle.health}%</span>
                                <span class="health-label">${this.getHealthStatus(vehicle.health)}</span>
                            </div>
                        </div>
                        <div class="health-details">
                            <div class="detail-item">
                                <span>Chu kỳ sạc:</span>
                                <strong>${vehicle.cycleCount} lần</strong>
                            </div>
                            <div class="detail-item">
                                <span>Dung lượng gốc:</span>
                                <strong>${vehicle.batteryCapacity} kWh</strong>
                            </div>
                            <div class="detail-item">
                                <span>Dung lượng hiện tại:</span>
                                <strong>${(vehicle.batteryCapacity * vehicle.health / 100).toFixed(1)} kWh</strong>
                            </div>
                        </div>
                    </div>

                    <!-- Battery Info -->
                    <div class="metric-card battery-info">
                        <h4>📋 Thông Tin Pin</h4>
                        <div class="info-list">
                            <div class="info-item">
                                <span class="info-label">Mã pin:</span>
                                <span class="info-value">${vehicle.batteryId}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Ngày sản xuất:</span>
                                <span class="info-value">${new Date(vehicle.manufactureDate).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Tuổi pin:</span>
                                <span class="info-value">${this.calculateBatteryAge(vehicle.manufactureDate)}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Nhiệt độ pin:</span>
                                <span class="info-value">${latestHistory.length > 0 ? latestHistory[latestHistory.length - 1].temperature + '°C' : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Health History Chart -->
                <div class="chart-section">
                    <h4>📈 Lịch Sử Độ Chai Pin</h4>
                    <div class="chart-container">
                        ${this.renderHealthChart(latestHistory)}
                    </div>
                </div>

                <!-- Recommendations -->
                <div class="recommendations-section">
                    <h4>💡 Khuyến Nghị</h4>
                    <div class="recommendations-grid">
                        ${this.generateRecommendations(vehicle).map(rec => `
                            <div class="recommendation-card ${rec.type}">
                                <div class="rec-icon">${rec.icon}</div>
                                <div class="rec-content">
                                    <h5>${rec.title}</h5>
                                    <p>${rec.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Export Report -->
                <div class="export-section">
                    <button class="btn btn-success export-report-btn">
                        📊 Xuất Báo Cáo Pin
                    </button>
                </div>
            </div>
        `;
    }

    // Helper methods
    getHealthClass(health) {
        if (health >= 90) return 'excellent';
        if (health >= 80) return 'good';
        if (health >= 70) return 'fair';
        return 'poor';
    }

    getHealthStatus(health) {
        if (health >= 90) return 'Tuyệt vời';
        if (health >= 80) return 'Tốt';
        if (health >= 70) return 'Trung bình';
        return 'Cần chú ý';
    }

    getChargeColor(charge) {
        if (charge >= 70) return '#4CAF50';
        if (charge >= 30) return '#FF9800';
        return '#F44336';
    }

    calculateRange(vehicle) {
        const efficiency = 6; // km per kWh
        const usableCapacity = vehicle.batteryCapacity * vehicle.health / 100;
        const currentEnergy = usableCapacity * vehicle.currentCharge / 100;
        const range = Math.floor(currentEnergy * efficiency);
        return `${range} km`;
    }

    calculateBatteryAge(manufactureDate) {
        const now = new Date();
        const manufacture = new Date(manufactureDate);
        const diffTime = Math.abs(now - manufacture);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);
        return `${years} năm ${months} tháng`;
    }

    renderHealthChart(history) {
        if (history.length === 0) return '<p>Không có dữ liệu lịch sử</p>';

        const maxHealth = Math.max(...history.map(h => h.health));
        const minHealth = Math.min(...history.map(h => h.health));
        const range = maxHealth - minHealth || 1;

        return `
            <div class="simple-chart">
                <div class="chart-y-axis">
                    <span>${Math.ceil(maxHealth)}%</span>
                    <span>${Math.ceil((maxHealth + minHealth) / 2)}%</span>
                    <span>${Math.floor(minHealth)}%</span>
                </div>
                <div class="chart-area">
                    <svg viewBox="0 0 400 200" class="chart-svg">
                        <polyline
                            fill="none"
                            stroke="#4CAF50"
                            stroke-width="2"
                            points="${history.map((point, index) => {
                                const x = (index / (history.length - 1)) * 380 + 10;
                                const y = 190 - ((point.health - minHealth) / range) * 180;
                                return `${x},${y}`;
                            }).join(' ')}"
                        />
                        ${history.map((point, index) => {
                            const x = (index / (history.length - 1)) * 380 + 10;
                            const y = 190 - ((point.health - minHealth) / range) * 180;
                            return `<circle cx="${x}" cy="${y}" r="3" fill="#4CAF50"/>`;
                        }).join('')}
                    </svg>
                </div>
                <div class="chart-x-axis">
                    <span>${history[0].date}</span>
                    <span>${history[Math.floor(history.length / 2)].date}</span>
                    <span>${history[history.length - 1].date}</span>
                </div>
            </div>
        `;
    }

    generateRecommendations(vehicle) {
        const recommendations = [];

        // Battery charge recommendations
        if (vehicle.currentCharge < 20) {
            recommendations.push({
                type: 'warning',
                icon: '⚠️',
                title: 'Pin Thấp',
                description: 'Nên sạc pin sớm để tránh hỏng pin do xả quá sâu.'
            });
        } else if (vehicle.currentCharge > 90) {
            recommendations.push({
                type: 'info',
                icon: 'ℹ️',
                title: 'Pin Đầy',
                description: 'Không nên sạc 100% thường xuyên để bảo vệ pin.'
            });
        }

        // Health recommendations
        if (vehicle.health < 80) {
            recommendations.push({
                type: 'warning',
                icon: '🔧',
                title: 'Kiểm Tra Pin',
                description: 'Độ chai pin đã cao, nên kiểm tra và bảo dưỡng định kỳ.'
            });
        }

        // Cycle count recommendations
        if (vehicle.cycleCount > 500) {
            recommendations.push({
                type: 'info',
                icon: '🔄',
                title: 'Chu Kỳ Sạc Cao',
                description: 'Pin đã qua nhiều chu kỳ sạc, hãy chú ý theo dõi độ chai.'
            });
        }

        // General recommendations
        recommendations.push({
            type: 'success',
            icon: '✅',
            title: 'Sạc Thông Minh',
            description: 'Duy trì mức pin 20-80% để tối ưu tuổi thọ pin.'
        });

        return recommendations;
    }

    // Actions
    selectVehicle(vehicleId) {
        this.currentVehicle = this.userBatteries[vehicleId];
        this.renderDashboard();
    }

    refreshBatteryData() {
        // Simulate fresh data
        Object.values(this.userBatteries).forEach(vehicle => {
            // Slight random changes
            vehicle.currentCharge = Math.max(0, Math.min(100, 
                vehicle.currentCharge + (Math.random() - 0.5) * 10
            ));
            vehicle.lastChecked = new Date().toISOString();
        });

        this.saveUserBatteries();
        this.renderDashboard();
        showToast('Đã cập nhật dữ liệu pin mới nhất!', 'success');
    }

    exportHealthReport() {
        if (!this.currentVehicle) return;

        const report = this.generateHealthReport(this.currentVehicle);
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `battery-report-${this.currentVehicle.id}-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        
        URL.revokeObjectURL(url);
        showToast('Đã xuất báo cáo pin thành công!', 'success');
    }

    generateHealthReport(vehicle) {
        const history = this.healthHistory[vehicle.id] || [];
        
        return `
BÁO CÁO TÌNH TRẠNG PIN XE ĐIỆN
=====================================

Thông tin xe:
- Tên xe: ${vehicle.name}
- Mã xe: ${vehicle.id}
- Mã pin: ${vehicle.batteryId}

Tình trạng hiện tại:
- Mức pin: ${vehicle.currentCharge}%
- Độ chai pin: ${vehicle.health}%
- Chu kỳ sạc: ${vehicle.cycleCount} lần
- Dung lượng pin: ${vehicle.batteryCapacity} kWh
- Dung lượng hiện tại: ${(vehicle.batteryCapacity * vehicle.health / 100).toFixed(1)} kWh

Thông tin sản xuất:
- Ngày sản xuất: ${new Date(vehicle.manufactureDate).toLocaleDateString('vi-VN')}
- Tuổi pin: ${this.calculateBatteryAge(vehicle.manufactureDate)}

Lịch sử độ chai pin (30 điểm gần nhất):
${history.slice(-30).map(h => 
    `${h.date}: ${h.health}% (${h.chargeLevel}% sạc, ${h.temperature}°C)`
).join('\n')}

Khuyến nghị:
${this.generateRecommendations(vehicle).map(r => 
    `- ${r.title}: ${r.description}`
).join('\n')}

Báo cáo tạo lúc: ${new Date().toLocaleString('vi-VN')}
        `.trim();
    }

    // Main render method
    renderDashboard() {
        const content = this.renderBatteryHealthDashboard();
        
        // If we're in the dashboard, update the battery health tab
        const batteryTab = document.querySelector('#batteryHealthContent');
        if (batteryTab) {
            batteryTab.innerHTML = content;
        }
        
        return content;
    }
}

// Export for use in other modules
window.BatteryHealthSystem = BatteryHealthSystem;