import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../config/roles';

// Dashboards
import OwnerDashboard from './dashboards/OwnerDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';
import SecretaryDashboard from './dashboards/SecretaryDashboard';
import InstructorDashboard from './dashboards/InstructorDashboard';
import AccountantDashboard from './dashboards/AccountantDashboard';
import StandardDashboard from './dashboards/StandardDashboard';

const DashboardRouter = () => {
  const { role } = useAuth();

  switch (role) {
    case ROLES.OWNER:
      return <OwnerDashboard />;
    case ROLES.MANAGER:
      return <ManagerDashboard />;
    case ROLES.SECRETARY:
      return <SecretaryDashboard />;
    case ROLES.INSTRUCTOR:
      return <InstructorDashboard />;
    case ROLES.ACCOUNTANT:
      return <AccountantDashboard />;
    case ROLES.STANDARD_USER:
    default:
      return <StandardDashboard />;
  }
};

export default DashboardRouter;
