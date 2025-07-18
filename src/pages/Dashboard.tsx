import React from 'react';
import { PredictionForm } from '../components/Dashboard/PredictionForm';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <PredictionForm />
    </div>
  );
};