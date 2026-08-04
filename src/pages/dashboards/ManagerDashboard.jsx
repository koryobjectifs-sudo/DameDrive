import React from 'react';
import { Shield } from 'lucide-react';

const ManagerDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[60vh]">
          <Shield size={64} className="text-indigo-500 mb-6" />
          <h1 className="text-4xl tracking-tight text-slate-800 mb-4">Manager Dashboard</h1>
          <p className="text-lg text-slate-500 font-medium max-w-lg mx-auto">
            Runs the daily operations. Focus on today's lessons, upcoming bookings, pending registrations, and instructor availability.
          </p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-slate-700">Today's Lessons</h3>
              <p className="text-2xl text-indigo-600">14</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-slate-700">Pending Registrations</h3>
              <p className="text-2xl text-amber-500">3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ManagerDashboard;
