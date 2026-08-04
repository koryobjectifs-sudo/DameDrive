import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ROLES, ROLE_PERMISSIONS } from '../config/roles';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(ROLES.OWNER); // Default to OWNER for development/testing
  const [permissions, setPermissions] = useState(ROLE_PERMISSIONS[ROLES.OWNER]);
  const [loading, setLoading] = useState(true);

  const verifyUserAccess = async (sessionUser) => {
    if (!sessionUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Always allow the main owner
    if (sessionUser.email === 'suporttest474@gmail.com' || sessionUser.email === 'koryobjectif@gmail.com') {
      setUser(sessionUser);
      setRole('Owner');
      setPermissions(ROLE_PERMISSIONS['Owner']);
      setLoading(false);
      return;
    }

    // Check database for invitation
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('email', sessionUser.email)
      .single();

    if (error || !data) {
      console.error('Access Denied: User not in invitations list');
      setUser(sessionUser);
      setRole('unauthorized');
      setPermissions([]);
      setLoading(false);
    } else {
      setUser(sessionUser);
      setRole(data.role);
      setPermissions(ROLE_PERMISSIONS[data.role] || []);
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      verifyUserAccess(session?.user || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      verifyUserAccess(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const setRoleOverride = (newRole) => {
    setRole(newRole);
    setPermissions(ROLE_PERMISSIONS[newRole] || []);
  };

  const hasPermission = (permission) => {
    if (role === ROLES.OWNER) return true; // Owner has all permissions implicitly
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, role, permissions, hasPermission, setRoleOverride, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
