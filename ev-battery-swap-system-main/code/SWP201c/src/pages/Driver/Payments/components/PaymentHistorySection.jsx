import React from 'react';
import PaymentList from './PaymentList';
import EmptyPayments from './EmptyPayments';

const PaymentHistorySection = ({ payments, onViewDetails }) => {
  return (
    <div>
      {payments.length > 0 ? (
        <PaymentList payments={payments} onViewDetails={onViewDetails} />
      ) : (
        <EmptyPayments />
      )}
    </div>
  );
};

export default PaymentHistorySection;