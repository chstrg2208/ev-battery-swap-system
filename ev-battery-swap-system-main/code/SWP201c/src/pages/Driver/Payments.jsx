// Driver Payment Management - Main Container (Refactored)
import React, { useState, useEffect } from 'react';
import paymentService from '../../assets/js/services/paymentService';
import authService from '../../assets/js/services/authService';
import DashboardLayout from '../../layouts/DashboardLayout';
import PaymentList from './Payments/PaymentList';
import EmptyPayments from './Payments/EmptyPayments';
import ErrorDisplay from './Payments/ErrorDisplay';
import PaymentDetailModal from './Payments/PaymentDetailModal';
import NewPaymentSection from './Payments/NewPaymentSection';

const DriverPayments = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('history');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const currentUser = authService.getCurrentUser();
      
      if (currentUser) {
        const userId = currentUser.id || currentUser.user_id || currentUser.userId;
        console.log('💳 Fetching payment history for user:', userId);
        
        const result = await paymentService.getPaymentHistory(userId);
        
        if (result.success) {
          console.log('✅ Payment history loaded:', result.data);
          setPaymentHistory(result.data || []);
        } else {
          console.warn('⚠️ Payment history failed:', result.message);
          setError(result.message);
        }
      }
    } catch (err) {
      console.error('❌ Payment history error:', err);
      setError('Không thể tải lịch sử thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (paymentData) => {
    try {
      const result = await paymentService.processPayment(paymentData);
      
      if (result.success) {
        alert('Thanh toán thành công!');
        fetchPaymentHistory();
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (err) {
      console.error('❌ Payment error:', err);
      alert('Có lỗi xảy ra khi thanh toán!');
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      completed: { 
        color: '#19c37d', 
        background: 'rgba(25, 195, 125, 0.2)',
        text: '✓ Thành công'
      },
      pending: { 
        color: '#ffa500', 
        background: 'rgba(255, 165, 0, 0.2)',
        text: '⏳ Đang xử lý'
      },
      failed: { 
        color: '#ff6b6b', 
        background: 'rgba(255, 107, 107, 0.2)',
        text: '✕ Thất bại'
      }
    };
    return styles[status] || styles.pending;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 VNĐ';
    return amount.toLocaleString('vi-VN') + ' VNĐ';
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedPayment(null);
  };

  if (loading) {
    return (
      <DashboardLayout role="driver">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ color: '#19c37d', fontSize: '1.5rem' }}>⏳ Đang tải...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="driver">
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ color: '#FFFFFF', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            💳 Thanh toán
          </h1>
          <p style={{ color: '#B0B0B0', margin: 0 }}>
            Quản lý thanh toán và gói dịch vụ
          </p>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '10px',
          marginBottom: '30px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '10px'
        }}>
          <button
            onClick={() => setActiveTab('history')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'history' 
                ? 'linear-gradient(135deg, #19c37d, #15a36a)' 
                : 'transparent',
              color: '#FFFFFF',
              border: activeTab === 'history' ? 'none' : '1px solid rgba(25, 195, 125, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === 'history' 
                ? '0 4px 15px rgba(25, 195, 125, 0.3)' 
                : 'none'
            }}
          >
            📜 Lịch sử
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'payment' 
                ? 'linear-gradient(135deg, #19c37d, #15a36a)' 
                : 'transparent',
              color: '#FFFFFF',
              border: activeTab === 'payment' ? 'none' : '1px solid rgba(25, 195, 125, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === 'payment' 
                ? '0 4px 15px rgba(25, 195, 125, 0.3)' 
                : 'none'
            }}
          >
            💰 Thanh toán
          </button>
        </div>

        {/* Payment History Tab */}
        {activeTab === 'history' && (
          <div>
            <div style={{ 
              background: 'rgba(26, 32, 44, 0.6)',
              backdropFilter: 'blur(10px)',
              padding: '25px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{ 
                color: '#FFFFFF', 
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                📜 Lịch sử thanh toán
              </h3>

              {error ? (
                <ErrorDisplay error={error} />
              ) : paymentHistory.length > 0 ? (
                <PaymentList
                  payments={paymentHistory}
                  onViewDetails={handleViewDetails}
                  formatDate={formatDate}
                  formatCurrency={formatCurrency}
                  getStatusStyle={getStatusStyle}
                />
              ) : (
                <EmptyPayments />
              )}
            </div>
          </div>
        )}

        {/* Payment Tab */}
        {activeTab === 'payment' && (
          <div>
            <div style={{ 
              background: 'rgba(26, 32, 44, 0.6)',
              backdropFilter: 'blur(10px)',
              padding: '25px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{ 
                color: '#FFFFFF', 
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                💰 Thanh toán mới
              </h3>

              <NewPaymentSection onProcessPayment={handleProcessPayment} />
            </div>
          </div>
        )}

        {/* Payment Detail Modal */}
        <PaymentDetailModal
          show={showDetailModal}
          payment={selectedPayment}
          onClose={handleCloseDetailModal}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          getStatusStyle={getStatusStyle}
        />
      </div>
    </DashboardLayout>
  );
};

export default DriverPayments;
