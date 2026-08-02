import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { LogOut, Calendar, DollarSign, Clock, CheckCircle, Search, Bell, Grid, Users, Car, Settings, HelpCircle, User, MapPin, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b'];

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  // Filters State
  const [filterPackage, setFilterPackage] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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

  // --- Data Computation ---

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

  // Derived Unique Students
  const getUniqueStudents = () => {
    const studentsMap = {};
    bookings.forEach(b => {
      const key = b.email;
      if (!studentsMap[key]) {
        studentsMap[key] = {
          name: b.name,
          email: b.email,
          phone: b.phone,
          total_bookings: 0,
          total_spent: 0,
          last_booking: b.created_at
        };
      }
      studentsMap[key].total_bookings += 1;
      const amount = parseFloat((b.total_amount || '').replace('$', '')) || 0;
      studentsMap[key].total_spent += amount;
      
      if (new Date(b.created_at) > new Date(studentsMap[key].last_booking)) {
        studentsMap[key].last_booking = b.created_at;
        studentsMap[key].name = b.name; // Use most recent name
        studentsMap[key].phone = b.phone;
      }
    });
    return Object.values(studentsMap).sort((a, b) => new Date(b.last_booking) - new Date(a.last_booking));
  };
  const uniqueStudents = getUniqueStudents();

  // Mock Vehicles
  const mockVehicles = [
    { id: 1, make: 'Toyota', model: 'Camry', year: '2023', type: 'Automatic', status: 'Active', mileage: '12,450 km', next_service: '15,000 km' },
    { id: 2, make: 'Honda', model: 'Civic', year: '2022', type: 'Manual', status: 'Active', mileage: '28,100 km', next_service: '30,000 km' },
    { id: 3, make: 'Toyota', model: 'Corolla', year: '2024', type: 'Automatic', status: 'Maintenance', mileage: '5,200 km', next_service: '10,000 km' },
  ];

  // Package Earnings for Bar Chart
  const getPackageEarnings = () => {
    const pkgMap = {};
    bookings.forEach(b => {
      const pkg = b.package || 'Other';
      const amount = parseFloat((b.total_amount || '').replace('$', '')) || 0;
      if (!pkgMap[pkg]) pkgMap[pkg] = 0;
      pkgMap[pkg] += amount;
    });
    return Object.keys(pkgMap).map(key => ({ name: key, earnings: pkgMap[key] }));
  };
  const packageEarnings = getPackageEarnings();


  // --- Render Components ---

  const renderBookingsTable = (limit = null) => {
    let filteredBookings = bookings.filter(b => {
      const matchPackage = filterPackage === 'All' || b.package === filterPackage;
      const matchStatus = filterStatus === 'All' || b.status === filterStatus;
      const searchLower = searchQuery.toLowerCase();
      const matchSearch = !searchQuery || 
                          b.name.toLowerCase().includes(searchLower) || 
                          (b.email && b.email.toLowerCase().includes(searchLower)) ||
                          (b.phone && b.phone.includes(searchLower));
      return matchPackage && matchStatus && matchSearch;
    });

    const displayBookings = limit ? filteredBookings.slice(0, limit) : filteredBookings;
    
    // Get unique packages for dropdown
    const uniquePackages = [...new Set(bookings.map(b => b.package).filter(Boolean))];

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            {limit ? "Recent Bookings" : "All Bookings"}
            {!limit && <span className="ml-3 px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-xs font-medium">{filteredBookings.length} data</span>}
          </h3>
        </div>

        {!limit && (
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Package Type</label>
              <select 
                value={filterPackage} 
                onChange={(e) => setFilterPackage(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              >
                <option value="All">All Packages</option>
                {uniquePackages.map(pkg => <option key={pkg} value={pkg}>{pkg}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Redeem Status</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              >
                <option value="All">All Status</option>
                <option value="pending">Pending</option>
                <option value="contacted">Completed (Contacted)</option>
              </select>
            </div>
            <div className="flex-[2] min-w-[250px]">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, or phone..." 
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => { setFilterPackage('All'); setFilterStatus('All'); setSearchQuery(''); }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}

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
              {loading && displayBookings.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">Loading bookings...</td></tr>
              ) : displayBookings.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No booking requests yet!</td></tr>
              ) : (
                displayBookings.map((booking) => (
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
    );
  };

  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto space-y-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Earnings Overview</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `$${val}`} dx={-10} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => [`$${value}`, ""]} />
                <Line type="monotone" dataKey="current" stroke="#1d4ed8" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Booking Status</h3>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
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
        </div>
      </div>
      {renderBookingsTable(5)}
    </div>
  );

  const renderStudents = () => (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Student Directory ({uniqueStudents.length})</h3>
          <p className="text-sm text-slate-500 mt-1">Unique clients automatically derived from booking history.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Bookings</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {uniqueStudents.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        {s.name.charAt(0)}
                      </div>
                      <div className="ml-4 font-medium text-slate-900">{s.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-600 flex items-center"><Mail size={14} className="mr-2 text-slate-400"/> {s.email}</div>
                    <div className="text-sm text-slate-600 flex items-center mt-1"><Phone size={14} className="mr-2 text-slate-400"/> {s.phone || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-medium">
                    {s.total_bookings}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-sm font-semibold">
                      ${s.total_spent}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderVehicles = () => (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Fleet Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage your active instruction vehicles.</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Add Vehicle
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockVehicles.map(v => (
          <div key={v.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 mr-4">
                  <Car size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{v.year} {v.make} {v.model}</h3>
                  <p className="text-xs text-slate-500">{v.type}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${v.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {v.status}
              </span>
            </div>
            <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Current Mileage:</span>
                <span className="font-medium text-slate-900">{v.mileage}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Next Service:</span>
                <span className="font-medium text-slate-900">{v.next_service}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEarnings = () => (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Financial Overview</h2>
        <p className="text-3xl font-bold text-emerald-600 mb-8">${totalEarnings} <span className="text-sm font-medium text-slate-500">Total Revenue</span></p>
        
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={packageEarnings}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `$${val}`} dx={-10} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => [`$${value}`, "Revenue"]} />
              <Bar dataKey="earnings" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">System Settings</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Admin Email</label>
          <input type="email" disabled value="koryobjectifs@gmail.com" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Notification Email</label>
          <input type="email" defaultValue="koryobjectifs@gmail.com" className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none" />
          <p className="text-xs text-slate-500 mt-1">This is where Web3Forms sends new booking alerts.</p>
        </div>
        <button className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
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
        
        <div className="p-4 m-4 bg-slate-800 rounded-xl relative overflow-hidden shrink-0">
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

        {/* Dynamic Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'Dashboard' && renderDashboard()}
          {activeTab === 'Bookings' && (
             <div className="max-w-7xl mx-auto space-y-6">
               {renderBookingsTable()}
             </div>
          )}
          {activeTab === 'Students' && renderStudents()}
          {activeTab === 'Vehicles' && renderVehicles()}
          {activeTab === 'Earnings' && renderEarnings()}
          {activeTab === 'Settings' && renderSettings()}
          {activeTab === 'Support' && (
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center py-16">
              <HelpCircle size={64} className="mx-auto text-slate-300 mb-6" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Need Help?</h2>
              <p className="text-slate-500 mb-8">Contact DameDrive technical support anytime.</p>
              <a href="mailto:support@damedrive.com" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full transition-colors">
                Email Support
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
