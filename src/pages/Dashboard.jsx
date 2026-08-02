import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { LogOut, RefreshCw, Calendar, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
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
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'contacted' : 'pending';
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (!error) {
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-slate-900">DameDrive Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={fetchBookings}
                className="text-slate-500 hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <button 
                onClick={handleSignOut}
                className="text-slate-500 hover:text-red-600 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-slate-200 sm:rounded-lg bg-white">
                
                {loading ? (
                  <div className="p-8 text-center text-slate-500">Loading bookings...</div>
                ) : bookings.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">No booking requests yet!</div>
                ) : (
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Package
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Date Received
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-900">{booking.name}</div>
                            <div className="text-sm text-slate-500">{booking.email}</div>
                            <div className="text-sm text-slate-500">{booking.phone}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-sm text-slate-900 mb-1">
                              <Calendar size={14} className="mr-1.5 text-primary" />
                              {booking.package}
                            </div>
                            <div className="flex items-center text-sm text-slate-500 mb-1">
                              <Clock size={14} className="mr-1.5" />
                              {booking.estimated_hours} Hours Total
                            </div>
                            <div className="flex items-center text-sm text-slate-500">
                              <DollarSign size={14} className="mr-1.5" />
                              {booking.total_amount}
                            </div>
                            <div className="mt-2 text-xs text-slate-400 max-w-xs whitespace-pre-wrap">
                              {booking.sessions}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {new Date(booking.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleStatus(booking.id, booking.status)}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                                booking.status === 'contacted'
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              }`}
                            >
                              {booking.status === 'contacted' ? <CheckCircle size={12} /> : null}
                              {booking.status === 'contacted' ? 'Contacted' : 'Pending'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
