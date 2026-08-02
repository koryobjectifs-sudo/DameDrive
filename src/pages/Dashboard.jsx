import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { LogOut, Calendar, DollarSign, Clock, CheckCircle, Search, Bell, Grid, Users, Car, Settings, HelpCircle, User, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b'];

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const navigate = useNavigate();

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching bookings:', error);
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();

    // Set up Realtime Subscription
    const channel = supabase
      .channel('public:bookings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          console.log('Real-time update received!', payload);
          // Just refetch for simplicity and to guarantee order
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'contacted' : 'pending';
    // Optimistic update
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', id);
      
    if (error) {
      console.error('Status update failed', error);
      fetchBookings(); // revert on failure
    }
  };

  // Compute Stats
  const totalBookings = bookings.length;
  const contacted = bookings.filter(b => b.status === 'contacted').length;
  const pending = totalBookings - contacted;
  
  const totalEarnings = bookings.reduce((sum, b) => {
    const amount = parseFloat((b.total_amount || '').replace('$', ''));
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  // Real Chart Data Aggregation
  const getChartData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = [
      { name: 'Mon', current: 0, previous: 140 },
      { name: 'Tue', current: 0, previous: 221 },
      { name: 'Wed', current: 0, previous: 229 },
      { name: 'Thu', current: 0, previous: 200 },
      { name: 'Fri', current: 0, previous: 218 },
      { name: 'Sat', current: 0, previous: 250 },
      { name: 'Sun', current: 0, previous: 210 },
    ];
    
    bookings.forEach(b => {
      const date = new Date(b.created_at);
      const dayName = days[date.getDay()];
      const amount = parseFloat((b.total_amount || '').replace('$', '')) || 0;
      
      const dayIndex = data.findIndex(d => d.name === dayName);
      if (dayIndex !== -1) {
        data[dayIndex].current += amount;
      }
    });
    
    return data;
  };

  const chartData = getChartData();

  const pieData = [
    { name: 'Contacted', value: contacted || 1 }, // Fallback to 1 to show chart
    { name: 'Pending', value: pending || 1 },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Car className="text-yellow-400 mr-3" size={24} />
          <span className="text-white font-bold text-lg tracking-wide">DameDrive</span>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            <button onClick={() => setActiveTab('Dashboard')} className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'Dashboard' ? 'bg-slate-800 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>
              <Grid className={`mr-3 ${activeTab === 'Dashboard' ? 'text-yellow-400' : 'text-slate-400'}`} size={18} /> Dashboard
            </button>
            <button onClick={() => setActiveTab('Bookings')} className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'Bookings' ? 'bg-slate-800 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>
              <Calendar className={`mr-3 ${activeTab === 'Bookings' ? 'text-yellow-400' : 'text-slate-400'}`} size={18} /> Bookings
            </button>
            <button onClick={() => setActiveTab('Students')} className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'Students' ? 'bg-slate-800 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>
              <Users className={`mr-3 ${activeTab === 'Students' ? 'text-yellow-400' : 'text-slate-400'}`} size={18} /> Students
            </button>
            <button onClick={() => setActiveTab('Vehicles')} className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'Vehicles' ? 'bg-slate-800 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>
              <Car className={`mr-3 ${activeTab === 'Vehicles' ? 'text-yellow-400' : 'text-slate-400'}`} size={18} /> Vehicles
            </button>
            <button onClick={() => setActiveTab('Earnings')} className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'Earnings' ? 'bg-slate-800 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>
              <DollarSign className={`mr-3 ${activeTab === 'Earnings' ? 'text-yellow-400' : 'text-slate-400'}`} size={18} /> Earnings
            </button>
          </nav>
          
          <div className="mt-8 px-3">
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">System</p>
            <nav className="space-y-1">
              <button onClick={() => setActiveTab('Settings')} className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'Settings' ? 'bg-slate-800 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>
                <Settings className={`mr-3 ${activeTab === 'Settings' ? 'text-yellow-400' : 'text-slate-400'}`} size={18} /> Settings
              </button>
              <button onClick={() => setActiveTab('Support')} className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'Support' ? 'bg-slate-800 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>
                <HelpCircle className={`mr-3 ${activeTab === 'Support' ? 'text-yellow-400' : 'text-slate-400'}`} size={18} /> Support
              </button>
            </nav>
          </div>
        </div>
        
        <div className="p-4 m-4 bg-slate-800 rounded-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="bg-slate-700 p-2 rounded-full mb-3 shadow-inner">
              <User className="text-yellow-400" size={24} />
            </div>
            <h4 className="text-white font-medium text-sm">DameDrive Pro</h4>
            <p className="text-xs text-slate-400 mt-1 mb-3">Unlock advanced CRM features.</p>
            <button className="bg-yellow-400 text-slate-900 text-xs font-bold py-2 px-4 rounded-lg w-full hover:bg-yellow-300 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-slate-800 hidden sm:block">{activeTab}</h2>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64"
              />
            </div>
            
            <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center space-x-3 pl-6 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                A
              </div>
              <div className="hidden sm:block text-sm">
                <p className="font-medium text-slate-700 leading-none">Admin</p>
                <p className="text-slate-500 text-xs mt-1">Super Admin</p>
              </div>
              <button onClick={handleSignOut} className="text-slate-400 hover:text-red-500 ml-2">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab !== 'Dashboard' ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <Settings size={48} className="text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold text-slate-700">Coming Soon</h3>
              <p className="mt-2">The {activeTab} module is currently under development.</p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-6">
              
              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                  <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mr-4">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-800">{totalBookings}</p>
                    <p className="text-sm text-slate-500 font-medium mt-1">Total Bookings</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mr-4">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-800">${totalEarnings}</p>
                    <p className="text-sm text-slate-500 font-medium mt-1">Total Earnings</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                  <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mr-4">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-800">{pending}</p>
                    <p className="text-sm text-slate-500 font-medium mt-1">Pending Clients</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                  <div className="w-14 h-14 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center mr-4">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-800">{contacted}</p>
                    <p className="text-sm text-slate-500 font-medium mt-1">Contacted Clients</p>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Line Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Earnings Overview</h3>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center text-slate-600"><span className="w-3 h-3 rounded-full bg-primary mr-2"></span>This Week</span>
                      <span className="flex items-center text-slate-400"><span className="w-3 h-3 rounded-full border-2 border-slate-300 mr-2"></span>Last Week</span>
                    </div>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `$${val}`} dx={-10} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          formatter={(value) => [`$${value}`, ""]}
                        />
                        <Line type="monotone" dataKey="current" stroke="#1d4ed8" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                        <Line type="monotone" dataKey="previous" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Booking Status</h3>
                  <div className="flex-1 flex flex-col items-center justify-center relative">
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            <Cell fill={COLORS[0]} />
                            <Cell fill={COLORS[3]} />
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                      <span className="text-2xl font-bold text-slate-800">{totalBookings}</span>
                      <span className="text-xs text-slate-500">Total</span>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center space-x-6">
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
                      <div className="text-sm">
                        <p className="font-medium text-slate-700">Contacted</p>
                        <p className="text-slate-500">{contacted}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
                      <div className="text-sm">
                        <p className="font-medium text-slate-700">Pending</p>
                        <p className="text-slate-500">{pending}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bookings List */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-800">Recent Bookings</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Client Info</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Package Details</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Received</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Status & Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading && bookings.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-8 text-center text-slate-500">Loading bookings...</td>
                        </tr>
                      ) : bookings.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No booking requests yet!</td>
                        </tr>
                      ) : (
                        bookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold uppercase shrink-0">
                                  {booking.name.charAt(0)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-semibold text-slate-900">{booking.name}</div>
                                  <div className="text-xs text-slate-500 mt-0.5">{booking.phone}</div>
                                  <div className="text-xs text-slate-400">{booking.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-slate-900 flex items-center">
                                <MapPin size={14} className="text-primary mr-1.5" />
                                {booking.package}
                              </div>
                              <div className="text-xs text-slate-500 mt-1 flex items-center">
                                <Clock size={12} className="mr-1.5" />
                                {booking.estimated_hours} Hours
                              </div>
                              <div className="text-xs text-slate-900 font-medium mt-1 bg-slate-100 inline-block px-2 py-0.5 rounded">
                                {booking.total_amount}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-slate-600 font-medium">
                                {new Date(booking.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                              <div className="text-xs text-slate-400 mt-0.5">
                                {new Date(booking.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right flex flex-col items-end">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold mb-2 ${
                                  booking.status === 'contacted'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}
                              >
                                {booking.status === 'contacted' ? 'Completed' : 'Ongoing'}
                              </span>
                              <button
                                onClick={() => toggleStatus(booking.id, booking.status)}
                                className="text-xs text-primary hover:text-primary-dark font-medium underline cursor-pointer"
                              >
                                Toggle Status
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="h-8"></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
