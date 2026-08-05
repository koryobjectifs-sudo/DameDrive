import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Receipt, Download, FileText, CheckCircle2, AlertCircle, ArrowUpRight, Search, Filter } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';

const FinanceDashboard = ({ bookings, studentMeta, chartData, packageEarnings, totalEarnings }) => {
  const [activeTab, setActiveTab] = useState('Overview'); // Overview, Transactions, Invoices
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Calculations & Data Processing
  const parseAmount = (amtStr) => {
    if (!amtStr) return 0;
    if (typeof amtStr === 'number') return amtStr;
    const num = parseFloat(String(amtStr).replace(/[^0-9.-]+/g,""));
    return isNaN(num) ? 0 : num;
  };

  const exportToCSV = () => {
    if (filteredTransactions.length === 0) return;
    const headers = ['Nom du Client', 'Email', 'Date', 'Forfait', 'Montant', 'Statut'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => {
        const meta = studentMeta[t.email] || {};
        const status = meta.payment === 'Pending' ? 'En attente' : 'Payé';
        return `"${t.name}","${t.email}","${new Date(t.created_at).toLocaleDateString()}","${t.package || 'Standard'}","${parseAmount(t.total_amount)}","${status}"`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleWhatsAppReminder = (name, phone) => {
    if (!phone) {
      alert("Ce client n'a pas de numéro de téléphone enregistré.");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Bonjour ${name}, ceci est un rappel amical de DameDrive concernant votre paiement en attente. Merci de régulariser la situation dès que possible !`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  // Mocking expenses dynamically for the chart based on revenue
  const enhancedChartData = useMemo(() => {
    return chartData.map(item => ({
      ...item,
      expenses: item.current ? Math.floor(item.current * (0.3 + Math.random() * 0.2)) : 0
    }));
  }, [chartData]);

  // Pending Payments Calculation
  const pendingStudents = Object.entries(studentMeta).filter(([email, meta]) => meta.payment === 'Pending');
  const pendingPaymentsAmount = pendingStudents.reduce((sum, [email]) => {
    const studentBookings = bookings.filter(b => b.email === email);
    const amount = studentBookings.reduce((acc, b) => acc + parseAmount(b.total_amount), 0);
    return sum + amount;
  }, 0);

  const estimatedExpenses = 840; // Fixed mock for now, could be dynamic
  const netProfit = totalEarnings - estimatedExpenses;

  // Chart Colors
  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  // Transactions List
  const transactions = [...bookings].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  const filteredTransactions = transactions.filter(t => {
    const searchLower = searchQuery.toLowerCase();
    return (t.name && t.name.toLowerCase().includes(searchLower)) ||
           (t.email && t.email.toLowerCase().includes(searchLower)) ||
           (t.package && t.package.toLowerCase().includes(searchLower));
  });

  // Render Functions
  const renderKPIs = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {/* Total Revenue */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
            <DollarSign size={24} strokeWidth={2.5} />
          </div>
          <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
            <TrendingUp size={14} className="mr-1" /> +12%
          </span>
        </div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Revenu Total</p>
        <h3 className="text-3xl font-black text-slate-800 tracking-tight">${totalEarnings.toLocaleString()}</h3>
      </motion.div>

      {/* Pending Payments */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner">
            <AlertCircle size={24} strokeWidth={2.5} />
          </div>
          <span className="flex items-center text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
            {pendingStudents.length} dossiers
          </span>
        </div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">En attente</p>
        <h3 className="text-3xl font-black text-slate-800 tracking-tight">${pendingPaymentsAmount.toLocaleString()}</h3>
      </motion.div>

      {/* Expenses */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-50/50 to-rose-50/50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shadow-inner">
            <Receipt size={24} strokeWidth={2.5} />
          </div>
          <span className="flex items-center text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg">
            <TrendingDown size={14} className="mr-1" /> Fixe
          </span>
        </div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Dépenses Estimées</p>
        <h3 className="text-3xl font-black text-slate-800 tracking-tight">${estimatedExpenses.toLocaleString()}</h3>
      </motion.div>

      {/* Net Profit */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-900/20 border border-slate-800 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
        <div className="absolute bottom-0 right-0 opacity-10">
           <TrendingUp size={100} />
        </div>
        <div className="flex items-center justify-between mb-4 z-10 relative">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-inner">
            <CreditCard size={24} strokeWidth={2.5} />
          </div>
        </div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1 z-10 relative">Bénéfice Net</p>
        <h3 className="text-3xl font-black text-white tracking-tight z-10 relative">${netProfit.toLocaleString()}</h3>
      </motion.div>
    </div>
  );

  const renderOverview = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Area Chart - Revenue Over Time */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Évolution des Revenus</h3>
              <p className="text-sm font-medium text-slate-500">Flux de trésorerie sur la période sélectionnée.</p>
            </div>
            <button onClick={exportToCSV} className="flex items-center text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
              <Download size={16} className="mr-2" /> Exporter CSV
            </button>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enhancedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', fontWeight: 700, padding: '12px 20px' }}
                />
                <Area type="monotone" dataKey="current" name="Revenus" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                <Area type="monotone" dataKey="expenses" name="Dépenses" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown by Package */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Répartition par Forfait</h3>
            <p className="text-sm font-medium text-slate-500">Meilleurs générateurs de revenus.</p>
          </div>
          <div className="flex-1 min-h-[300px] flex flex-col">
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={packageEarnings}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="earnings"
                    stroke="none"
                  >
                    {packageEarnings.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                    formatter={(value) => [`$${value}`, "Revenu"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3 overflow-y-auto pr-2">
              {packageEarnings.map((pkg, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-sm font-bold text-slate-700 truncate max-w-[120px]">{pkg.name || 'Autre'}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">${pkg.earnings}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );

  const renderTransactions = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">Toutes les transactions</h3>
          <p className="text-sm font-medium text-slate-500">Historique complet de facturation.</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Rechercher une facture..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client & Date</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Forfait</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Montant</th>
              <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Statut</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Facture</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                   <FileText className="mx-auto text-slate-300 mb-2" size={32} />
                   <p className="text-slate-500 font-medium text-sm">Aucune transaction trouvée.</p>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t, idx) => {
                const meta = studentMeta[t.email] || {};
                const isPending = meta.payment === 'Pending';
                
                return (
                  <tr key={t.id || idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-800 text-sm">{t.name}</div>
                      <div className="text-xs font-medium text-slate-400 mt-0.5">{new Date(t.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">{t.package || 'Standard'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="font-black text-slate-900">${parseAmount(t.total_amount)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                        isPending ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      }`}>
                        {isPending ? <AlertCircle size={12} className="mr-1.5"/> : <CheckCircle2 size={12} className="mr-1.5"/>}
                        {isPending ? 'En attente' : 'Payé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {isPending ? (
                        <button 
                          onClick={() => handleWhatsAppReminder(t.name, t.phone)}
                          className="px-3 py-1.5 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 font-bold text-xs rounded-lg transition-colors flex items-center justify-end ml-auto"
                        >
                          Relancer
                        </button>
                      ) : (
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ml-auto flex">
                          <ArrowUpRight size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Dashboard Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Finances & Facturation</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Supervisez vos revenus, dépenses et paiements en attente.</p>
        </div>
        
        <div className="flex bg-slate-100/80 p-1 rounded-xl">
          {['Overview', 'Transactions'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === tab 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
            >
              {tab === 'Overview' ? 'Aperçu Général' : 'Transactions'}
            </button>
          ))}
        </div>
      </div>

      {renderKPIs()}

      <AnimatePresence mode="wait">
        {activeTab === 'Overview' && renderOverview()}
        {activeTab === 'Transactions' && renderTransactions()}
      </AnimatePresence>
    </div>
  );
};

export default FinanceDashboard;
