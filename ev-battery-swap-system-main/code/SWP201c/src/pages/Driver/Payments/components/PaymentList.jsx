import React from 'react';
import PaymentCard from './PaymentCard';

const PaymentList = ({ payments, onViewDetails }) => {
  return (
    <div>
      {payments.map(payment => (
        <PaymentCard key={payment.id} payment={payment} onViewDetails={onViewDetails} />
      ))}
    </div>
  );
};

export default PaymentList;