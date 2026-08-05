import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';

const PermissionGuard = ({ permission, children, fallback = null, showLock = false, lockMessage = "Accès Restreint" }) => {
  const { hasPermission } = useAuth();

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  if (showLock) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-xl opacity-80 select-none h-full">
        <Lock className="text-slate-400 mb-2" size={24} />
        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest text-center">{lockMessage}</span>
      </div>
    );
  }

  return fallback ? <>{fallback}</> : null;
};

export default PermissionGuard;
