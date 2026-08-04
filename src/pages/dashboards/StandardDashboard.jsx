import React from 'react';
import { LayoutDashboard } from 'lucide-react';

const StandardDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[60vh]">
          <LayoutDashboard size={64} className="text-slate-400 mb-6" />
          <h1 className="text-4xl tracking-tight text-slate-800 mb-4">Standard Dashboard</h1>
          <p className="text-lg text-slate-500 font-medium max-w-lg mx-auto">
            Limited operational access. Only widgets relevant to assigned permissions will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
};
export default StandardDashboard;
