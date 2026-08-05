import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../config/roles';


// The Unified Dashboard (formerly OwnerDashboard)
import OwnerDashboard from './dashboards/OwnerDashboard';

const DashboardRouter = () => {
  return (
    <>
      <OwnerDashboard />
    </>
  );
};

export default DashboardRouter;
