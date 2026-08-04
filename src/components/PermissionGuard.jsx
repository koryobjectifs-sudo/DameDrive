import React from 'react';
import { useAuth } from '../context/AuthContext';

const PermissionGuard = ({ permission, children, fallback = null }) => {
  const { hasPermission } = useAuth();

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : null;
};

export default PermissionGuard;
