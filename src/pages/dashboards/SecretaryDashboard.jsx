import React from 'react';
import { UserCheck } from 'lucide-react';

const SecretaryDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[60vh]">
          <UserCheck size={64} className="text-pink-500 mb-6" />
          <h1 className="text-4xl tracking-tight text-slate-800 mb-4">Secretary Dashboard</h1>
          <p className="text-lg text-slate-500 font-medium max-w-lg mx-auto">
            Handles customer relations. Focus on today's appointments, new registrations, and pending payments.
          </p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-slate-700">Appointments</h3>
              <p className="text-2xl text-pink-600">8</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-slate-700">New Registrations</h3>
              <p className="text-2xl text-emerald-500">12</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SecretaryDashboard;
