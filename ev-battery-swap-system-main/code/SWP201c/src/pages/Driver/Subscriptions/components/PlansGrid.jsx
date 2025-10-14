import React from 'react';
import PlanCard from './PlanCard';
import EmptyPlans from './EmptyPlans';

const PlansGrid = ({ plans, currentPlanId }) => {
  if (!plans || plans.length === 0) {
    return <EmptyPlans />;
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
    }}>
      {plans.map(plan => (
        <PlanCard
          key={plan.id}
          plan={plan}
          isCurrent={plan.id === currentPlanId}
        />
      ))}
    </div>
  );
};

export default PlansGrid;