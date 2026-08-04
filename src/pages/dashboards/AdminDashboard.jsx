import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../config/roles';
import { Settings, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const { role, setRoleOverride } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 bg-purple-50 border border-purple-200 p-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center">
            <Settings size={16} className="text-purple-600 mr-2" />
            <span className="text-sm font-bold text-purple-800">RBAC Role Switcher:</span>
          </div>
          <select 
            value={role} 
            onChange={(e) => setRoleOverride(e.target.value)}
            className="bg-white border border-purple-300 rounded-lg px-3 py-1.5 text-sm font-bold text-purple-700"
          >
            {Object.values(ROLES).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[60vh]">
          <Shield size={64} className="text-indigo-500 mb-6" />
          <h1 className="text-4xl font-black tracking-tight text-slate-800 mb-4">Administrator Dashboard</h1>
          <p className="text-lg text-slate-500 font-medium max-w-lg mx-auto">
            This dashboard is specifically tailored for Daily Platform Operations. You have access to manage customers, bookings, and schools.
          </p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-700">Today's Bookings</h3>
              <p className="text-2xl font-black text-indigo-600">14</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-700">Pending</h3>
              <p className="text-2xl font-black text-amber-500">3</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-700">New Customers</h3>
              <p className="text-2xl font-black text-emerald-500">+8</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-700">System Alerts</h3>
              <p className="text-2xl font-black text-slate-400">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
