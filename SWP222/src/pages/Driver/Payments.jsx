// Driver Payment Management
// Thanh toán định kỳ + phí vượt
// Payment for subscriptions and overuse fees

import React from 'react';

const DriverPayments = () => {
  return (
    <div className="driver-payments">
      <h1>💳 Payment Management</h1>
      <p>Subscription payments and overuse fees</p>
      {/* TODO: Implement payment management */}
      
      <div className="payment-tabs">
        <div className="tab-content">
          <h3>📜 Payment History</h3>
          <p>View past transactions and invoices</p>
        </div>
        
        <div className="tab-content">
          <h3>💰 Make Payment</h3>
          <p>Pay for subscription and additional fees</p>
        </div>
        
        <div className="tab-content">
          <h3>🔄 Auto Payment</h3>
          <p>Set up automatic payment methods</p>
        </div>
      </div>
    </div>
  );
};

export default DriverPayments;