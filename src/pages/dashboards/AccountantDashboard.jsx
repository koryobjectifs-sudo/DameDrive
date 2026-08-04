import React from 'react';
import { DollarSign } from 'lucide-react';

const AccountantDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[60vh]">
          <DollarSign size={64} className="text-emerald-500 mb-6" />
          <h1 className="text-4xl tracking-tight text-slate-800 mb-4">Accountant Dashboard</h1>
          <p className="text-lg text-slate-500 font-medium max-w-lg mx-auto">
            Financial access only. Focus on revenue, outstanding invoices, refund requests, and monthly financial summaries.
          </p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-slate-700">Revenue</h3>
              <p className="text-2xl text-emerald-600">$12,450</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-slate-700">Refunds</h3>
              <p className="text-2xl text-red-500">$350</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AccountantDashboard;
