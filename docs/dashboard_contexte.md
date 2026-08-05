# Contexte et Codebase : Dashboard
Ce fichier contient tout l'historique et le code source des composants constituant le Dashboard de DameDrive.

## Fichier : src/pages/dashboards/AdminDashboard.jsx
```jsx
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
```

## Fichier : src/pages/dashboards/OwnerDashboard.jsx
```jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { LogOut, Calendar, DollarSign, Clock, CheckCircle, Search, Bell, Grid, Users, Car, Settings, HelpCircle, User, MapPin, Mail, Phone, TrendingUp, CalendarDays, ChevronUp, ChevronLeft, ChevronRight, Filter, Camera, X, Download, PlusCircle, Activity, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, Lock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import SettingsView from '../../components/settings/SettingsView';
import StudentCRM from '../../components/crm/StudentCRM';
import FinanceDashboard from '../../components/finance/FinanceDashboard';
const mockSparklineData = [{v: 40}, {v: 30}, {v: 45}, {v: 50}, {v: 40}, {v: 65}, {v: 74}];
const mockSparklineData2 = [{v: 60}, {v: 50}, {v: 55}, {v: 70}, {v: 60}, {v: 80}, {v: 96}];
const mockSparklineData3 = [{v: 20}, {v: 25}, {v: 22}, {v: 30}, {v: 28}, {v: 35}, {v: 30}];
const mockSparklineData4 = [{v: 80}, {v: 75}, {v: 85}, {v: 90}, {v: 85}, {v: 95}, {v: 98}];

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b'];

import { useAuth } from '../../context/AuthContext';
import { ROLES, PERMISSIONS } from '../../config/roles';
import PermissionGuard from '../../components/PermissionGuard';

const OwnerDashboard = () => {
  const { role, setRoleOverride } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('Admin'); // Mocked role for RBAC
  const [studentMeta, setStudentMeta] = useState({}); // Mock state for student tracking
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileOnboardingModal, setShowProfileOnboardingModal] = useState(false);
  const [onboardingForm, setOnboardingForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [quickActionModal, setQuickActionModal] = useState({ isOpen: false, action: null });
  const [newLesson, setNewLesson] = useState({ studentEmail: '', date: '', startTime: '', endTime: '', notes: '' });
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [planningCategory, setPlanningCategory] = useState(null);
  const [historyCategory, setHistoryCategory] = useState('All Activity');
  const [calendarView, setCalendarView] = useState('Jour');
  const [calendarDate, setCalendarDate] = useState(new Date('2026-08-04'));

  const MOCK_AUDIT_LOGS = [
    { id: 1, type: 'CREATE', user: 'Jean Marie Kory SENGHOR', role: 'Administrateur', action: 'A ajouté un nouvel utilisateur', target: 'John Doe (Comptable)', date: 'Aujourd\'hui, 14:32', category: 'System & Security', color: 'emerald' },
    { id: 2, type: 'UPDATE', user: 'Alice Smith', role: 'Manager', action: 'A modifié le planning', target: 'Session conduite - Marc Leblanc', date: 'Aujourd\'hui, 10:15', category: 'Planning', color: 'blue' },
    { id: 3, type: 'BROADCAST', user: 'Jean Marie Kory SENGHOR', role: 'Administrateur', action: 'A envoyé une communication', target: 'Tous les étudiants (Tips Hiver)', date: 'Hier, 09:41', category: 'Communications', color: 'indigo' },
    { id: 4, type: 'UPDATE', user: 'John Doe', role: 'Comptable', action: 'A mis à jour le dossier étudiant', target: 'Sophie Martin (Paiement validé)', date: '2 Août 2026, 16:20', category: 'Students & CRM', color: 'blue' },
    { id: 5, type: 'DELETE', user: 'Alice Smith', role: 'Manager', action: 'A annulé un cours', target: 'Session conduite - Kevin D.', date: '1 Août 2026, 11:05', category: 'Planning', color: 'rose' },
    { id: 6, type: 'SYSTEM', user: 'Système', role: 'Automatique', action: 'Extraction de données générée', target: 'Rapport Financier Mensuel', date: '1 Août 2026, 01:00', category: 'System & Security', color: 'slate' }
  ];
  const [newMemberRole, setNewMemberRole] = useState('Assistant');
  const [teamMembers, setTeamMembers] = useState([
    { email: 'suporttest474@gmail.com', role: 'Admin', access: 'Full Access (Earnings, Settings)' },
    { email: 'assistant1@damedrive.com', role: 'Assistant', access: 'Restricted (Bookings, Vehicles, Students)' }
  ]);


  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fullName = `${onboardingForm.firstName} ${onboardingForm.lastName}`.trim();
    
    const { data, error } = await supabase.auth.updateUser({
      data: { 
        full_name: fullName,
        phone: onboardingForm.phone
      }
    });

    if (!error) {
      setUserName(fullName);
      setShowProfileOnboardingModal(false);
    } else {
      console.error("Error updating profile:", error);
    }
    setLoading(false);
  };

  // Fetch team members from invitations table
  const fetchTeamMembers = async () => {
    const { data, error } = await supabase.from('invitations').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setTeamMembers(data.map(invite => ({
        id: invite.id,
        email: invite.email,
        role: invite.role,
        access: invite.role === 'Owner' || invite.role === 'Manager' ? 'Full Access' : 'Restricted'
      })));
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberEmail) return;
    setLoading(true);
    
    const { error } = await supabase.from('invitations').insert([{
      email: newMemberEmail,
      role: newMemberRole
    }]);

    if (error) {
      alert('Error inviting member: ' + error.message);
    } else {
      await fetchTeamMembers();
      setNewMemberEmail('');
      setNewMemberRole('Manager');
      setShowAddMemberModal(false);
      // Construct a simple mailto link for the admin to send
      const mailtoLink = `mailto:${newMemberEmail}?subject=Invitation%20to%20DameDrive&body=Hello!%0A%0AYou%20have%20been%20invited%20to%20access%20the%20DameDrive%20Dashboard%20as%20a%20${newMemberRole}.%0A%0APlease%20log%20in%20using%20your%20Google%20Account%20at:%20${window.location.origin}/login`;
      window.location.href = mailtoLink;
    }
    setLoading(false);
  };
  
  const handleRemoveMember = async (id) => {
    if (!window.confirm("Are you sure you want to revoke access for this user?")) return;
    setLoading(true);
    const { error } = await supabase.from('invitations').delete().eq('id', id);
    if (error) {
      alert("Error removing user: " + error.message);
    } else {
      await fetchTeamMembers();
    }
    setLoading(false);
  };

  // Global Filters State
  const [filterPackage, setFilterPackage] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTimeframe, setFilterTimeframe] = useState('All Time');
  const [filterAggregation, setFilterAggregation] = useState('Daily');


  // Calculate Finance Data from Real Bookings
  const parseAmount = (amtStr) => {
    if (!amtStr) return 0;
    if (typeof amtStr === 'number') return amtStr;
    const num = parseFloat(String(amtStr).replace(/[^0-9.-]+/g,""));
    return isNaN(num) ? 0 : num;
  };
  const realTotalRevenue = bookings.reduce((sum, b) => sum + parseAmount(b.total_amount), 0);
  const realExpenses = 840; // Mock base expenses
  const realNetProfit = realTotalRevenue - realExpenses;
  const recentTransactions = [];

  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);

      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .order('lesson_date', { ascending: true })
        .order('start_time', { ascending: true });
        
      if (lessonsError && lessonsError.code !== '42P01') { // Ignore if table doesn't exist yet
        console.error('Error fetching lessons:', lessonsError);
      } else {
        setLessons(lessonsData || []);
      }

      const { data: metaData, error: metaError } = await supabase
        .from('student_meta')
        .select('*');
      
      if (metaError) throw metaError;
      
      const metaMap = {};
      (metaData || []).forEach(m => {
        metaMap[m.email] = { payment: m.payment, progress: m.progress, license: m.license };
      });
      setStudentMeta(metaMap);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
    
    // Fetch logged in user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
        setUserName(user.user_metadata?.full_name || (user.email || '').split('@')[0] || 'Admin');
        if (user.email === 'suporttest474@gmail.com') {
          setUserRole('Owner');
        } else {
          setUserRole('Admin');
        }
        
        // Trigger onboarding if metadata is missing
        if (!user.user_metadata?.full_name || !user.user_metadata?.phone) {
          setShowProfileOnboardingModal(true);
        }
      }
    };
    getUser();

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

  const handleBookingAction = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      fetchBookings(); 
    } catch (error) {
      alert('Failed to update booking: ' + error.message);
    }
  };

  const handleWhatsApp = (phone, name) => {
    if (!phone) {
      alert("No phone number provided for this client.");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=Hello ${name}, this is DameDrive. `, '_blank');
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking entirely?")) return;
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchBookings();
    } catch (error) {
      alert('Failed to delete booking: ' + error.message);
    }
  };


  const sendEmailJSNotification = async (studentEmail, subject, message) => {
    try {
      const data = {
        service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_6v2muzo',
        template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_65vhlzj',
        user_id: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'u57LuXG5YdlVUIrD_',
        template_params: {
          student_email: studentEmail,
          subject: subject,
          message: message
        }
      };

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`EmailJS Error: ${response.statusText}`);
      }
      showToast('Email sent successfully!', 'success');
    } catch (error) {
      console.error("Failed to send email notification:", error);
      showToast('Failed to send email notification', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToastMessage({ text: message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleExportCSV = () => {
    if (filteredBookings.length === 0) return;
    const headers = ['Nom', 'Email', 'Date', 'Forfait', 'Montant', 'Statut'];
    const csvContent = [
      headers.join(','),
      ...filteredBookings.map(b => {
        const meta = studentMeta[b.email] || {};
        const status = meta.payment === 'Pending' ? 'En attente' : 'Payé';
        const amount = b.total_amount ? String(b.total_amount).replace(/[^0-9.-]+/g,"") : 0;
        return `"${b.name}","${b.email}","${new Date(b.created_at).toLocaleDateString()}","${b.package || 'Standard'}","${amount}","${status}"`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bookings_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    showToast('Export CSV réussi !', 'success');
    setQuickActionModal({ isOpen: false, action: null });
  };

  const handleSendReminders = () => {
    const pendingCount = bookings.filter(b => (studentMeta[b.email]?.payment || 'Pending') === 'Pending').length;
    showToast(`${pendingCount} rappels envoyés avec succès !`, 'success');
    setQuickActionModal({ isOpen: false, action: null });
  };

  const handleScheduleLesson = async (e) => {
    e.preventDefault();
    try {
      const student = uniqueStudents.find(s => s.email === newLesson.studentEmail);
      if (!student) throw new Error("Please select a student.");
      
      const { error } = await supabase
        .from('lessons')
        .insert([{
          student_name: student.name,
          student_email: student.email,
          lesson_date: newLesson.date,
          start_time: newLesson.startTime,
          end_time: newLesson.endTime,
          notes: newLesson.notes,
          status: 'Scheduled'
        }]);
      
      if (error) throw error;

      // UX Improvement: Close modal and reset form instantly
      setShowScheduleModal(false);
      setNewLesson({ studentEmail: '', date: '', startTime: '', endTime: '', notes: '' });
      showToast('Session planifiée avec succès !', 'success');
      fetchBookings(); // Refreshes the grid

      // Send automated email to the student asynchronously
      const emailMessage = `Hello ${student.name},\n\nYour driving lesson has been successfully scheduled!\n\n📅 Date: ${newLesson.date}\n⏰ Time: ${newLesson.startTime} - ${newLesson.endTime}\n📝 Notes: ${newLesson.notes || 'None'}\n\nPlease make sure to arrive on time. If you need to cancel or reschedule, please reply to this email directly.\n\nBest regards,\nThe DameDrive Team`;
      
      sendEmailJSNotification(student.email, "Your Driving Lesson is Scheduled! 🚗", emailMessage)
        .then(() => showToast("Email de confirmation envoyé à l'élève.", 'success'))
        .catch(err => console.error("Email send failed:", err));
        
    } catch (error) {
      showToast("Failed to schedule lesson: " + error.message, 'error');
    }
  };

  const handleLessonAction = async (id, newStatus) => {
    try {
      const lesson = lessons.find(l => l.id === id);
      
      const { error } = await supabase
        .from('lessons')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      
      if (newStatus === 'Completed') {
         // Automatically bump student progress by 10% when a lesson is completed
         if (lesson) {
           const currentMeta = studentMeta[lesson.student_email] || { progress: 0 };
           const newProgress = Math.min(100, (currentMeta.progress || 0) + 10);
           await updateStudentMeta(lesson.student_email, 'progress', newProgress);
         }
      } else if (newStatus === 'Cancelled') {
         // Notify student of cancellation
         if (lesson) {
            const emailMessage = `Hello ${lesson.student_name},\n\nWe wanted to let you know that your driving lesson scheduled on ${lesson.lesson_date} at ${lesson.start_time.substring(0,5)} has been cancelled.\n\nPlease reply to this email to reschedule your session.\n\nBest regards,\nThe DameDrive Team`;
            showToast('Sending cancellation email...', 'info');
            await sendEmailJSNotification(lesson.student_email, "Driving Lesson Cancelled", emailMessage);
         }
      }
      
      fetchBookings();
    } catch (error) {
      showToast("Failed to update lesson: " + error.message, 'error');
    }
  };

  const updateStudentMeta = async (email, field, value) => {
    // Optimistic update
    const prevMeta = studentMeta[email] || { payment: 'Pending', progress: 0, license: 'Not Started' };
    const newMeta = { ...prevMeta, [field]: value };
    
    setStudentMeta(prev => ({
      ...prev,
      [email]: newMeta
    }));

    try {
      const { error } = await supabase
        .from('student_meta')
        .upsert({ email, ...newMeta });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating student meta:', error);
      // Revert optimistic update could go here
    }

    if ((field === 'progress' && value === 100) || (field === 'license' && value === 'Obtained')) {
      const studentBookings = bookings.filter(b => b.email === email && b.status !== 'completed');
      for (const b of studentBookings) {
        await handleBookingAction(b.id, 'completed');
      }
    }
  };

  // --- Filtering Logic ---
  const filteredBookings = bookings.filter(b => {
    // 1. Text & Dropdown Filters
    const matchPackage = filterPackage === 'All' || b.package === filterPackage;
    const matchStatus = filterStatus === 'All' || b.status === filterStatus;
    const searchLower = (searchQuery || '').toLowerCase();
    const matchSearch = !searchQuery || 
                        (b.name || '').toLowerCase().includes((searchQuery || '').toLowerCase()) || 
                        (b.email || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
                        (b.phone && b.phone.includes(searchLower));
                        
    // 2. Date Filtering
    let matchDate = true;
    if (filterTimeframe !== 'All Time') {
      const bDate = new Date(b.created_at);
      const now = new Date();
      
      if (filterTimeframe === 'Today') {
        matchDate = bDate.toDateString() === now.toDateString();
      } else if (filterTimeframe === 'Yesterday') {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        matchDate = bDate.toDateString() === yesterday.toDateString();
      } else if (filterTimeframe === 'Last 7 Days') {
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        matchDate = bDate >= weekAgo;
      } else if (filterTimeframe === 'Last 30 Days') {
        const monthAgo = new Date(now.setDate(now.getDate() - 30));
        matchDate = bDate >= monthAgo;
      } else if (filterTimeframe === 'Last 3 Months') {
        const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
        matchDate = bDate >= threeMonthsAgo;
      } else if (filterTimeframe === 'Last 6 Months') {
        const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
        matchDate = bDate >= sixMonthsAgo;
      } else if (filterTimeframe === 'This Month') {
        matchDate = bDate.getMonth() === now.getMonth() && bDate.getFullYear() === now.getFullYear();
      } else if (filterTimeframe === 'This Year') {
        matchDate = bDate.getFullYear() === now.getFullYear();
      }
    }
    
    return matchPackage && matchStatus && matchSearch && matchDate;
  });

  const uniquePackages = [...new Set(bookings.map(b => b.package).filter(Boolean))];

  // --- Data Computation (Based on filteredBookings) ---
  const totalBookings = filteredBookings.length;
  const contacted = filteredBookings.filter(b => b.status === 'contacted').length;
  const pending = filteredBookings.filter(b => b.status === 'pending').length;
  const completed = filteredBookings.filter(b => b.status === 'completed').length;
  const canceled = filteredBookings.filter(b => b.status === 'cancelled').length;
  
  const totalEarnings = filteredBookings.reduce((sum, b) => {
    const amount = parseAmount(b.total_amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const getChartData = () => {
    const dataMap = {};
    
    // Grouping logic
    filteredBookings.forEach(b => {
      const date = new Date(b.created_at);
      const amount = parseAmount(b.total_amount);
      
      let key = '';
      if (filterAggregation === 'Daily') {
        // e.g. "Mon", "Tue" (or Date string if we want exact dates)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        key = days[date.getDay()];
      } else if (filterAggregation === 'Weekly') {
        // Group by Week of Year (simplified)
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - startOfYear) / 86400000;
        const weekNum = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
        key = `Week ${weekNum}`;
      } else if (filterAggregation === 'Monthly') {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        key = months[date.getMonth()];
      }

      if (!dataMap[key]) dataMap[key] = 0;
      dataMap[key] += amount;
    });

    // Formatting based on Aggregation to ensure sensible empty defaults
    if (filterAggregation === 'Daily' && Object.keys(dataMap).length === 0) {
       return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => ({ name: day, current: 0 }));
    } else if (filterAggregation === 'Monthly' && Object.keys(dataMap).length === 0) {
       return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => ({ name: m, current: 0 })); // Sample
    }
    
    return Object.keys(dataMap).map(key => ({ name: key, current: dataMap[key] }));
  };
  const chartData = getChartData();

  // Task 1: Calculate Average Progress
  const totalStudents = Object.keys(studentMeta).length || 0;
  const validatedPayments = Object.values(studentMeta).filter(m => m.payment === 'Validated').length || 0;
  const obtainedLicenses = Object.values(studentMeta).filter(m => m.license === 'Obtained').length || 0;
  const averageProgress = totalStudents > 0 ? Math.round(Object.values(studentMeta).reduce((sum, s) => sum + (parseInt(s.progress) || 0), 0) / totalStudents) : 0;

  const pieData = [
    { name: 'Contacted', value: contacted || 1 }, 
    { name: 'Pending', value: pending || 1 },
  ];

  const getUniqueStudents = () => {
    const studentsMap = {};
    filteredBookings.forEach(b => {
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
      const amount = parseAmount(b.total_amount);
      studentsMap[key].total_spent += amount;
      
      if (new Date(b.created_at) > new Date(studentsMap[key].last_booking)) {
        studentsMap[key].last_booking = b.created_at;
        studentsMap[key].name = b.name; 
        studentsMap[key].phone = b.phone;
      }
    });
    return Object.values(studentsMap).sort((a, b) => new Date(b.last_booking) - new Date(a.last_booking));
  };
  const uniqueStudents = getUniqueStudents();

  const getPackageEarnings = () => {
    const pkgMap = {};
    filteredBookings.forEach(b => {
      const pkg = b.package || 'Other';
      const amount = parseAmount(b.total_amount);
      if (!pkgMap[pkg]) pkgMap[pkg] = 0;
      pkgMap[pkg] += amount;
    });
    return Object.keys(pkgMap).map(key => ({ name: key, earnings: pkgMap[key] }));
  };
  const packageEarnings = getPackageEarnings();
  
  const topPackage = packageEarnings.length > 0 
    ? packageEarnings.reduce((max, pkg) => pkg.earnings > max.earnings ? pkg : max, packageEarnings[0]) 
    : { name: 'No Data', earnings: 0 };

  // --- Render Components ---

  const renderFilterBar = () => (
    <div className="mb-6">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row gap-6 items-center w-full"
      >
        <div className="bg-white/80 backdrop-blur-2xl rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/60 p-1.5 flex-1 w-full relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients by name, email..." 
            className="w-full pl-11 pr-4 py-1.5 bg-transparent border-none text-slate-700 text-[13px] font-medium focus:outline-none focus:ring-0 placeholder-slate-400 transition-all"
          />
        </div>
        
        <div className="bg-white/80 backdrop-blur-2xl rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/60 p-1.5 flex flex-wrap lg:flex-nowrap gap-2 w-full lg:w-auto">
          <select 
            value={filterTimeframe} 
            onChange={(e) => setFilterTimeframe(e.target.value)}
            className="flex-1 lg:flex-none bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl px-4 py-1.5 text-[12px] font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all outline-none"
          >
            <option value="All Time">All Time</option>
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="This Month">This Month</option>
            <option value="This Year">This Year</option>
          </select>

          <select 
            value={filterPackage} 
            onChange={(e) => setFilterPackage(e.target.value)}
            className="flex-1 lg:flex-none bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl px-4 py-1.5 text-[12px] font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all outline-none"
          >
            <option value="All">All Packages</option>
            {uniquePackages.map(pkg => <option key={pkg} value={pkg}>{pkg}</option>)}
          </select>
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 lg:flex-none bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl px-4 py-1.5 text-[12px] font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all outline-none"
          >
            <option value="All">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          {(filterPackage !== 'All' || filterStatus !== 'All' || searchQuery !== '' || filterTimeframe !== 'All Time') && (
            <button 
              onClick={() => { setFilterPackage('All'); setFilterStatus('All'); setSearchQuery(''); setFilterTimeframe('All Time'); }}
              className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors bg-slate-100 hover:bg-slate-200 rounded-xl whitespace-nowrap"
            >
              Clear Filters
            </button>
          )}
        </div>
      </motion.div>
      
      <div className="flex items-center justify-end px-2 gap-2 mt-4 mb-2">
        <span className="text-[10px] uppercase tracking-widest font-medium text-slate-400">Chart Grouping:</span>
        <div className="flex bg-white shadow-sm border border-slate-100 p-0.5 rounded-lg">
          {['Daily', 'Weekly', 'Monthly'].map(agg => (
            <button
              key={agg}
              onClick={() => setFilterAggregation(agg)}
              className={`px-3 py-1 text-[10px] font-medium uppercase tracking-wider rounded-md transition-all ${filterAggregation === agg ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              {agg}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBookingsTable = (limit = null) => {
    const displayBookings = limit ? filteredBookings.slice(0, limit) : filteredBookings;
    
    return (
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-lg font-medium text-slate-800 flex items-center tracking-tight">
            {limit ? "Recent Bookings" : "All Bookings"}
            {!limit && <span className="ml-3 px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-xs font-medium">{filteredBookings.length} data</span>}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-slate-400 uppercase tracking-widest">Client</th>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-slate-400 uppercase tracking-widest">Contact</th>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-slate-400 uppercase tracking-widest">Package</th>
                <th className="px-6 py-3 text-left text-[10px] font-medium text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-right text-[10px] font-medium text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-[10px] font-medium text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayBookings.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-[13px] font-medium text-slate-500">No bookings found</td></tr>
              ) : displayBookings.map((b, i) => (
                <tr key={b.id || i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-800 whitespace-nowrap">{b.name}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">
                    <div className="flex flex-col">
                      <span>{b.email}</span>
                      <span className="text-xs text-slate-400">{b.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">{b.package}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500 whitespace-nowrap">{new Date(b.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${
                      b.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      b.status === 'paid' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      b.status === 'canceled' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {b.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleWhatsApp(b.phone, b.name)} className="px-3 py-1.5 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 font-medium text-xs rounded-lg transition-colors">
                        WhatsApp
                      </button>
                      <PermissionGuard permission={PERMISSIONS.BOOKINGS_EDIT}>
                        <select 
                          value={b.status || 'pending'} 
                          onChange={(e) => handleBookingAction(b.id, e.target.value)}
                          className="px-2 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium text-xs rounded-lg transition-colors outline-none cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Mark Paid</option>
                          <option value="completed">Completed</option>
                          <option value="canceled">Canceled</option>
                        </select>
                      </PermissionGuard>
                      <PermissionGuard permission={PERMISSIONS.BOOKINGS_CANCEL}>
                        <button onClick={() => handleDeleteBooking(b.id)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-xs rounded-lg transition-colors">
                          Delete
                        </button>
                      </PermissionGuard>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    return (
    <div className="max-w-7xl mx-auto space-y-4">
      {renderFilterBar()}
      
      {/* Top Metrics Row - 3 Columns for better spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Bookings Card */}
        <motion.div whileHover={{ y: -4 }} className="bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between transition-all cursor-pointer min-h-[130px] relative overflow-hidden">
          <div className="flex justify-between items-start mb-2 z-10 relative">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                <Calendar size={16} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[9px] font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Total Bookings</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-xl font-medium text-slate-800 tracking-tight leading-none">{totalBookings}</p>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider bg-blue-50 text-blue-600">Active</span>
                </div>
              </div>
            </div>
            <HelpCircle size={14} className="text-slate-300 hover:text-slate-500 transition-colors" />
          </div>
          <div className="flex items-end justify-between mt-auto pt-2 z-10 relative">
            <div className="text-[10px] font-medium text-blue-500 flex items-center whitespace-nowrap overflow-visible">
              <TrendingUp size={12} className="mr-1" />
              {((totalBookings / (bookings.length || 1)) * 100).toFixed(0)}% <span className="text-slate-400 font-medium ml-1 ">of total database</span>
            </div>
            <div className="w-14 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockSparklineData}>
                  <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Earnings Card */}
        <PermissionGuard permission={PERMISSIONS.PAYMENTS_VIEW} showLock={true} lockMessage="Données Financières Masquées">
          <motion.div whileHover={{ y: -4 }} className="bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between transition-all cursor-pointer min-h-[130px] relative overflow-hidden">
            <div className="flex justify-between items-start mb-2 z-10 relative">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                  <DollarSign size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[9px] font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Gross Earnings</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-xl font-medium text-slate-800 tracking-tight leading-none">${totalEarnings}</p>
                  </div>
                </div>
              </div>
              <HelpCircle size={14} className="text-slate-300 hover:text-slate-500 transition-colors" />
            </div>
            <div className="flex items-end justify-between mt-auto pt-2 z-10 relative">
              <div className="text-[10px] font-medium text-emerald-500 flex items-center whitespace-nowrap overflow-visible">
                <DollarSign size={12} className="mr-1" />
                ${totalBookings > 0 ? (totalEarnings / totalBookings).toFixed(0) : 0} <span className="text-slate-400 font-medium ml-1 ">avg per booking</span>
              </div>
              <div className="w-14 h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockSparklineData2}>
                    <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </PermissionGuard>

        {/* Pending Card */}
        <motion.div whileHover={{ y: -4 }} className="bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between transition-all cursor-pointer min-h-[130px] relative overflow-hidden">
          <div className="flex justify-between items-start mb-2 z-10 relative">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
                <Clock size={16} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[9px] font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Pending Actions</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-xl font-medium text-slate-800 tracking-tight leading-none">{pending}</p>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider bg-red-50 text-red-600">Needs Attention</span>
                </div>
              </div>
            </div>
            <HelpCircle size={14} className="text-slate-300 hover:text-slate-500 transition-colors" />
          </div>
          <div className="flex items-end justify-between mt-auto pt-2 z-10 relative">
            <div className="text-[10px] font-medium text-amber-500 flex items-center whitespace-nowrap overflow-visible">
              <Clock size={12} className="mr-1" />
              {totalBookings > 0 ? ((pending / totalBookings) * 100).toFixed(0) : 0}% <span className="text-slate-400 font-medium ml-1 ">pending rate</span>
            </div>
            <div className="w-14 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockSparklineData3}>
                  <Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>


        {/* Contacted Card */}
        <motion.div whileHover={{ y: -4 }} className="bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between transition-all cursor-pointer min-h-[130px] relative overflow-hidden">
          <div className="flex justify-between items-start mb-2 z-10 relative">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shadow-inner">
                <Users size={16} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[9px] font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Contacted</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-xl font-medium text-slate-800 tracking-tight leading-none">{contacted}</p>
                </div>
              </div>
            </div>
            <HelpCircle size={14} className="text-slate-300 hover:text-slate-500 transition-colors" />
          </div>
          <div className="flex items-end justify-between mt-auto pt-2 z-10 relative">
            <div className="text-[10px] font-medium text-sky-500 flex items-center whitespace-nowrap overflow-visible">
              <Users size={12} className="mr-1" />
              {totalBookings > 0 ? ((contacted / totalBookings) * 100).toFixed(0) : 0}% <span className="text-slate-400 font-medium ml-1 ">reach rate</span>
            </div>
            <div className="w-14 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockSparklineData}>
                  <Line type="monotone" dataKey="v" stroke="#0ea5e9" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Canceled Card */}
        <motion.div whileHover={{ y: -4 }} className="bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between transition-all cursor-pointer min-h-[130px] relative overflow-hidden">
          <div className="flex justify-between items-start mb-2 z-10 relative">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shadow-inner">
                <Activity size={16} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[9px] font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Canceled</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-xl font-medium text-slate-800 tracking-tight leading-none">{canceled}</p>
                </div>
              </div>
            </div>
            <HelpCircle size={14} className="text-slate-300 hover:text-slate-500 transition-colors" />
          </div>
          <div className="flex items-end justify-between mt-auto pt-2 z-10 relative">
            <div className="text-[10px] font-medium text-red-500 flex items-center whitespace-nowrap overflow-visible">
              <Activity size={12} className="mr-1" />
              {totalBookings > 0 ? ((canceled / totalBookings) * 100).toFixed(0) : 0}% <span className="text-slate-400 font-medium ml-1 ">cancel rate</span>
            </div>
            <div className="w-14 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockSparklineData4}>
                  <Line type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
        {/* Top Package Card */}
        <motion.div whileHover={{ y: -4 }} className="bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between transition-all cursor-pointer min-h-[130px] relative overflow-hidden">
          <div className="flex justify-between items-start mb-2 z-10 relative">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner">
                <TrendingUp size={16} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">Top Package</p>
                <div className="flex items-baseline space-x-2 w-full overflow-hidden">
                  <p className="text-lg font-medium text-slate-800 tracking-tight leading-none whitespace-normal line-clamp-2" title={topPackage.name}>{topPackage.name}</p>
                </div>
              </div>
            </div>
            <HelpCircle size={14} className="text-slate-300 hover:text-slate-500 transition-colors" />
          </div>
          <div className="flex items-end justify-between mt-auto pt-2 z-10 relative">
            <div className="text-[10px] font-medium text-purple-500 flex items-center whitespace-nowrap overflow-visible">
              <CheckCircle size={12} className="mr-1" />
              {topPackage.earnings > 0 ? Math.floor(topPackage.earnings / 100) : 0} <span className="text-slate-400 font-medium ml-1 ">bookings matched</span>
            </div>
            <div className="w-14 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockSparklineData4}>
                  <Line type="monotone" dataKey="v" stroke="#a855f7" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Middle Row - Chart & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-slate-800">Revenus vs Dépenses (Évolutif)</h3>
          </div>
          <PermissionGuard permission={PERMISSIONS.PAYMENTS_VIEW} showLock={true} lockMessage="Graphique Financier Masqué">
            <div className="h-72 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.map(item => ({...item, expenses: item.current ? Math.floor(item.current * (0.3 + Math.random() * 0.2)) : 0}))}>
                  <defs>
                    <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} tickFormatter={(val) => `$${val}`} dx={-10} />
                  <Tooltip cursor={{stroke: '#e2e8f0', strokeWidth: 2}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgb(0 0 0 / 0.15)', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', fontWeight: 600 }} formatter={(value) => [`$${value}`, ""]} />
                  <Area type="monotone" name="Revenus" dataKey="current" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorCurrent)" activeDot={{r: 6, strokeWidth: 0, fill: '#1d4ed8'}} />
                  <Area type="monotone" name="Dépenses" dataKey="expenses" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorExpenses)" activeDot={{r: 6, strokeWidth: 0, fill: '#b91c1c'}} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </PermissionGuard>
        </div>
        
        <div className="flex flex-col space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex-1 flex flex-col justify-center">
            <h3 className="text-xs font-medium text-slate-400 mb-4 uppercase tracking-wider">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <button onClick={() => setQuickActionModal({ isOpen: true, action: 'Broadcast' })} className="flex flex-col items-center justify-center text-center p-3 bg-blue-50/80 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors shadow-sm border border-blue-100/50">
                <Mail size={16} className="mb-1" /> 
                <span className="font-medium text-[11px] leading-tight">Broadcast</span>
                <span className="text-[9px] font-medium text-blue-600/70 mt-0.5 leading-tight">Message clients</span>
              </button>
              <PermissionGuard permission={PERMISSIONS.BOOKINGS_EXPORT} fallback={
                <button disabled className="flex flex-col items-center justify-center text-center p-3 bg-slate-50 text-slate-400 rounded-xl cursor-not-allowed shadow-sm border border-slate-100/50">
                  <Lock size={16} className="mb-1" /> 
                  <span className="font-medium text-[11px] leading-tight">Export Data</span>
                </button>
              }>
                <button onClick={() => setQuickActionModal({ isOpen: true, action: 'Export' })} className="flex flex-col items-center justify-center text-center p-3 bg-emerald-50/80 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors shadow-sm border border-emerald-100/50">
                  <Download size={16} className="mb-1" /> 
                  <span className="font-medium text-[11px] leading-tight">Export Data</span>
                  <span className="text-[9px] font-medium text-emerald-600/70 mt-0.5 leading-tight">CSV / Excel</span>
                </button>
              </PermissionGuard>
              <button onClick={() => setQuickActionModal({ isOpen: true, action: 'New Package' })} className="flex flex-col items-center justify-center text-center p-3 bg-purple-50/80 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors shadow-sm border border-purple-100/50">
                <PlusCircle size={16} className="mb-1" /> 
                <span className="font-medium text-[11px] leading-tight">New Package</span>
                <span className="text-[9px] font-medium text-purple-600/70 mt-0.5 leading-tight">Add service</span>
              </button>
              <button onClick={() => setQuickActionModal({ isOpen: true, action: 'Health Check' })} className="flex flex-col items-center justify-center text-center p-3 bg-amber-50/80 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors shadow-sm border border-amber-100/50">
                <Activity size={16} className="mb-1" /> 
                <span className="font-medium text-[11px] leading-tight">Health Check</span>
                <span className="text-[9px] font-medium text-amber-600/70 mt-0.5 leading-tight">System status</span>
              </button>
              <button onClick={() => setQuickActionModal({ isOpen: true, action: 'Support' })} className="flex flex-col items-center justify-center text-center p-3 bg-sky-50/80 text-sky-700 rounded-xl hover:bg-sky-100 transition-colors shadow-sm border border-sky-100/50">
                <HelpCircle size={16} className="mb-1" /> 
                <span className="font-medium text-[11px] leading-tight">Support</span>
                <span className="text-[9px] font-medium text-sky-600/70 mt-0.5 leading-tight">Open tickets</span>
              </button>
              <button onClick={() => setQuickActionModal({ isOpen: true, action: 'Console' })} className="flex flex-col items-center justify-center text-center p-3 bg-slate-800 text-slate-100 rounded-xl hover:bg-black transition-colors shadow-sm border border-slate-700">
                <Activity size={16} className="mb-1" /> 
                <span className="font-medium text-[11px] leading-tight">Console</span>
                <span className="text-[9px] font-medium text-slate-400 mt-0.5 leading-tight">Developer logs</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h3 className="text-xs font-medium text-slate-400 mb-4 uppercase tracking-wider">Student Overview</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Payments (Validated/Pending)</span>
                  <span className="text-emerald-600">{validatedPayments}/{totalStudents}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: totalStudents > 0 ? `${(validatedPayments/totalStudents)*100}%` : '0%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>License (Obtained/In Progress)</span>
                  <span className="text-blue-600">{obtainedLicenses}/{totalStudents}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: totalStudents > 0 ? `${(obtainedLicenses/totalStudents)*100}%` : '0%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Global Student Progress</span>
                  <span className="text-purple-600">{averageProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${averageProgress}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Data & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {renderBookingsTable(5)}
        </div>
        <div className="bg-gradient-to-br from-indigo-900 via-[#1e1b4b] to-[#2e1065] p-6 rounded-2xl shadow-xl border border-indigo-500/20 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-4 -right-4 p-4 opacity-5">
             <CalendarDays size={120} />
          </div>
          <div className="relative z-10 mb-6">
            <h3 className="text-lg font-medium mb-1">Upcoming Lessons</h3>
            <p className="text-indigo-200 text-xs font-medium">Your next scheduled sessions</p>
          </div>
          <div className="space-y-3 relative z-10 flex-1 flex flex-col">
            {bookings.filter(b => b.status !== 'completed').sort((a,b) => new Date(a.created_at) - new Date(b.created_at)).slice(0, 3).map((lesson, idx) => (
              <div key={idx} className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer" onClick={() => setActiveTab('Planning')}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[10px] font-medium uppercase tracking-widest px-2 py-0.5 rounded ${
                    lesson.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    lesson.status === 'contacted' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {lesson.status || 'Pending'}
                  </span>
                  <span className="text-xs font-medium text-slate-300">{new Date(lesson.created_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
                <p className="font-medium text-sm truncate text-white">{lesson.name}</p>
                <div className="flex items-center text-xs font-medium text-slate-400 mt-1.5">
                  <MapPin size={12} className="mr-1.5" /> {lesson.package}
                </div>
              </div>
            ))}
            {bookings.filter(b => b.status !== 'completed').length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm font-medium flex-1 flex items-center justify-center">No upcoming lessons scheduled.</div>
            )}
            <div className="mt-auto pt-4">
              <button onClick={() => setActiveTab('Planning')} className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium py-3 rounded-lg transition-colors border border-blue-500 shadow-lg">
                View Full Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  };

  const renderPlanning = () => {
    const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8:00 to 18:00
    const instructors = ['Kory SENGHOR', 'John DOE', 'Sarah SMITH'];
    const weekDays = ['Lun 3', 'Mar 4', 'Mer 5', 'Jeu 6', 'Ven 7', 'Sam 8', 'Dim 9'];

    const handlePrevDay = () => setCalendarDate(prev => new Date(prev.setDate(prev.getDate() - 1)));
    const handleNextDay = () => setCalendarDate(prev => new Date(prev.setDate(prev.getDate() + 1)));

    return (
      <div className="max-w-7xl mx-auto space-y-4 relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Planning Interactif</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Gérez les leçons et disponibilités de l'équipe.</p>
          </div>
          
          <button 
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <PlusCircle size={18} className="mr-2" />
            Planifier une session
          </button>
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          
          {/* Left Column: Calendar Main Area */}
          <div className="flex-1 min-w-0 flex flex-col">
             
             {/* Unified Header matching Inspiration */}
             <div className="flex flex-col md:flex-row items-center justify-between bg-white px-5 py-3 rounded-t-xl border border-slate-200 border-b-0 gap-4">
                 
                 {/* Left: Date Navigation */}
                 <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-600 w-16 hidden sm:block">
                      {calendarView === 'Jour' ? 'Journée' : 'Semaine'}
                    </span>
                    <button onClick={handlePrevDay} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"><ChevronLeft size={20}/></button>
                    <h3 className="text-[15px] font-bold text-slate-800 min-w-[180px] text-center capitalize">
                      {calendarView === 'Jour' 
                        ? calendarDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                        : '3 Août - 9 Août 2026'
                      }
                    </h3>
                    <button onClick={handleNextDay} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"><ChevronRight size={20}/></button>
                 </div>

                 {/* Right: Controls & Filters */}
                 <div className="flex items-center gap-2 flex-wrap justify-center">
                    
                    {/* Date Picker Button (Calendar Icon) */}
                    <div className="relative group" title="Sauter à une date exacte">
                      <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors shadow-sm relative overflow-hidden flex items-center justify-center h-[38px] w-[38px]">
                        <Calendar size={16} />
                        <input 
                          type="date" 
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          value={`${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(calendarDate.getDate()).padStart(2, '0')}`}
                          onChange={(e) => {
                            if (e.target.value) {
                              const [year, month, day] = e.target.value.split('-');
                              setCalendarDate(new Date(year, month - 1, day));
                            }
                          }}
                        />
                      </button>
                    </div>

                    {/* Filter / Aggregation Dropdown */}
                    <div className="relative group h-[38px]" title="Filtre (Agrégation)">
                       <select className="h-full appearance-none pl-8 pr-3 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-sm focus:outline-none">
                         <option value="instructor">Agrégation : Instructeur</option>
                         <option value="vehicle">Agrégation : Véhicule</option>
                         <option value="student">Agrégation : Élève</option>
                       </select>
                       <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                    {/* Today Button */}
                    <button 
                      onClick={() => setCalendarDate(new Date())} 
                      className="h-[38px] px-4 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      Aujourd'hui
                    </button>
                    
                    {/* View Switcher Dropdown (Day/Week/Month) */}
                    <div className="relative h-[38px]">
                      <select 
                        value={calendarView}
                        onChange={(e) => setCalendarView(e.target.value)}
                        className="h-full appearance-none px-4 pr-8 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-sm focus:outline-none"
                      >
                        <option value="Jour">Day</option>
                        <option value="Semaine">Week</option>
                        <option value="Mois">Month</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>

                 </div>
             </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-b-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-t-0 border-slate-100 overflow-hidden overflow-x-auto relative">
          <div className="min-w-[900px]">
            
            {calendarView === 'Jour' ? (
              <>
                {/* Header Row (Instructors) */}
                <div className="grid grid-cols-[80px_1fr_1fr_1fr] bg-slate-50 border-b border-slate-100">
                  <div className="p-4 border-r border-slate-100"></div>
                  {instructors.map(inst => (
                    <div key={inst} className="p-4 border-r border-slate-100 text-center font-bold text-slate-700 flex flex-col items-center">
                      <div className="w-10 h-10 bg-white rounded-full shadow-sm mb-2 flex items-center justify-center text-blue-600 font-bold border border-slate-200">
                        {inst.charAt(0)}{inst.split(' ')[1]?.charAt(0)}
                      </div>
                      {inst}
                    </div>
                  ))}
                </div>
                
                {/* Time Slots (Jour) */}
                <div className="relative">
                   {/* 09:00 - 11:00 (Kory) */}
                   <div className="absolute top-[61px] left-[80px] w-[calc(33.33%-80px/3-4px)] h-[118px] bg-blue-50 border border-blue-200 rounded-xl m-[2px] p-3 z-10 hover:shadow-md transition-shadow cursor-pointer flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                         <span className="text-xs font-bold text-blue-700">09:00 - 11:00</span>
                         <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      </div>
                      <div className="font-bold text-slate-800 text-sm">Alexandre Dupont</div>
                      <div className="text-[11px] text-blue-600 font-medium">Session Régulière</div>
                      <div className="text-xs text-slate-500 mt-auto flex items-center"><Car size={12} className="mr-1"/> Honda Civic</div>
                   </div>

                   {/* 11:00 - 12:00 (John) */}
                   <div className="absolute top-[181px] left-[calc(80px+(100%-80px)/3)] w-[calc(33.33%-80px/3-4px)] h-[58px] bg-emerald-50 border border-emerald-200 rounded-xl m-[2px] p-2 z-10 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex justify-between items-center h-full">
                         <div>
                           <div className="font-bold text-slate-800 text-xs truncate max-w-[120px]">Marie Curie</div>
                           <span className="text-[10px] font-bold text-emerald-700">11:00 - 12:00</span>
                         </div>
                         <div className="text-[10px] text-slate-600 font-medium flex items-center bg-white/60 px-1.5 py-0.5 rounded"><Car size={10} className="mr-1"/> Yaris (M)</div>
                      </div>
                   </div>

                   {/* 13:00 - 15:00 (Sarah) */}
                   <div className="absolute top-[301px] left-[calc(80px+2*(100%-80px)/3)] w-[calc(33.33%-80px/3-4px)] h-[118px] bg-purple-50 border border-purple-200 rounded-xl m-[2px] p-3 z-10 hover:shadow-md transition-shadow cursor-pointer flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                         <span className="text-xs font-bold text-purple-700">13:00 - 15:00</span>
                         <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      </div>
                      <div className="font-bold text-slate-800 text-sm">Jean Valjean</div>
                      <div className="text-[11px] text-purple-600 font-medium mt-1">Examen Pratique SAAQ</div>
                      <div className="text-xs text-slate-500 mt-auto flex items-center"><Car size={12} className="mr-1"/> Corolla</div>
                   </div>

                   {/* Overlapping Mock (Kory Busy Day) */}
                   {/* 14:00 - 15:30 */}
                   <div className="absolute top-[361px] left-[80px] w-[calc((33.33%-80px/3-4px)/2)] h-[88px] bg-orange-50 border border-orange-200 rounded-xl m-[2px] p-2 z-10 hover:shadow-md transition-shadow cursor-pointer flex flex-col">
                      <span className="text-[10px] font-bold text-orange-700 mb-1">14:00 - 15:30</span>
                      <div className="font-bold text-slate-800 text-xs truncate">Sophie L.</div>
                   </div>
                   {/* 14:30 - 16:00 (Overlap) */}
                   <div className="absolute top-[391px] left-[calc(80px+((33.33%-80px/3-4px)/2))] w-[calc((33.33%-80px/3-4px)/2)] h-[88px] bg-blue-50 border border-blue-200 rounded-xl m-[2px] p-2 z-20 hover:shadow-md shadow-lg transition-shadow cursor-pointer flex flex-col">
                      <span className="text-[10px] font-bold text-blue-700 mb-1">14:30 - 16:00</span>
                      <div className="font-bold text-slate-800 text-xs truncate">Kevin D.</div>
                   </div>

                   {/* Background Grid Lines (Jour) */}
                   {hours.map((_, i) => (
                     <div key={i} className="flex border-b border-slate-100 h-[60px]">
                       <div className="w-[80px] border-r border-slate-100 flex items-start justify-end pr-2 pt-2 text-xs font-medium text-slate-400 bg-white relative z-0">
                         {i + 8}:00
                       </div>
                       <div className="flex-1 border-r border-slate-100 border-dashed"></div>
                       <div className="flex-1 border-r border-slate-100 border-dashed"></div>
                       <div className="flex-1"></div>
                     </div>
                   ))}
                </div>
              </>
            ) : (
              <>
                {/* Header Row (Week Days) */}
                <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] bg-slate-50 border-b border-slate-100">
                  <div className="p-3 border-r border-slate-100"></div>
                  {weekDays.map(day => (
                    <div key={day} className="p-3 border-r border-slate-100 text-center text-xs font-bold text-slate-600 uppercase">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Time Slots (Semaine) */}
                <div className="relative">
                   {/* Week Mock Data */}
                   {/* Monday 09:00 - 11:00 */}
                   <div className="absolute top-[31px] left-[80px] w-[calc((100%-80px)/7-4px)] h-[58px] bg-blue-50 border border-blue-200 rounded-lg m-[2px] p-1.5 z-10 hover:shadow-md cursor-pointer overflow-hidden">
                      <div className="text-[9px] font-bold text-blue-700">09:00 - 11:00 (Kory)</div>
                      <div className="font-bold text-slate-800 text-[10px] truncate">Alexandre D.</div>
                   </div>
                   
                   {/* Tuesday 14:00 - 16:00 */}
                   <div className="absolute top-[181px] left-[calc(80px+(100%-80px)/7)] w-[calc((100%-80px)/7-4px)] h-[58px] bg-emerald-50 border border-emerald-200 rounded-lg m-[2px] p-1.5 z-10 hover:shadow-md cursor-pointer overflow-hidden">
                      <div className="text-[9px] font-bold text-emerald-700">14:00 - 16:00 (John)</div>
                      <div className="font-bold text-slate-800 text-[10px] truncate">Marie C.</div>
                   </div>

                  {/* Reduce height per hour to 30px for Week view to make it "smaller" like Google Calendar week view */}
                  {hours.map(hour => (
                    <div key={hour} className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] border-b border-slate-100 h-[30px] group">
                      <div className="px-2 border-r border-slate-100 text-[10px] font-bold text-slate-400 text-right pr-3 -mt-2">
                        {hour.toString().padStart(2, '0')}:00
                      </div>
                      <div className="border-r border-slate-100/50 group-hover:bg-slate-50/30 cursor-crosshair"></div>
                      <div className="border-r border-slate-100/50 group-hover:bg-slate-50/30 cursor-crosshair"></div>
                      <div className="border-r border-slate-100/50 group-hover:bg-slate-50/30 cursor-crosshair"></div>
                      <div className="border-r border-slate-100/50 group-hover:bg-slate-50/30 cursor-crosshair"></div>
                      <div className="border-r border-slate-100/50 group-hover:bg-slate-50/30 cursor-crosshair"></div>
                      <div className="border-r border-slate-100/50 group-hover:bg-slate-50/30 cursor-crosshair"></div>
                      <div className="group-hover:bg-slate-50/30 cursor-crosshair"></div>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        </div>
      </div>
      
      {/* Right Column: Vertical Legend / Actions Center */}
      <div className="w-full xl:w-72 space-y-4">
             <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-5 sticky top-6">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center">
                 <AlertCircle size={14} className="mr-2" />
                 Centre d'Action
               </h3>
               
               <div className="space-y-3">
                 <button className="w-full flex items-start gap-3 p-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors text-left group">
                    <div className="mt-1 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] flex-shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-rose-800 text-xs">Conflits (Overlap)</h4>
                      <p className="text-[10px] text-rose-600 mt-1 leading-tight font-medium">2 leçons se chevauchent cet après-midi (Kory).</p>
                    </div>
                 </button>

                 <button className="w-full flex items-start gap-3 p-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-100 transition-colors text-left group">
                    <div className="mt-1 w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-amber-800 text-xs">À Confirmer</h4>
                      <p className="text-[10px] text-amber-600 mt-1 leading-tight font-medium">1 Examen SAAQ en attente (Demain).</p>
                    </div>
                 </button>

                 <button className="w-full flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors text-left group">
                    <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-slate-700 text-xs">Disponibilités</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-tight font-medium">John et Sarah ont des créneaux libres aujourd'hui.</p>
                    </div>
                 </button>
               </div>
               
               <div className="mt-6 pt-5 border-t border-slate-100">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Légende</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-[11px] font-medium text-slate-600"><span className="w-3 h-3 rounded bg-blue-100 border border-blue-200 mr-2"></span> Session Régulière</div>
                    <div className="flex items-center text-[11px] font-medium text-slate-600"><span className="w-3 h-3 rounded bg-purple-100 border border-purple-200 mr-2"></span> Examen SAAQ</div>
                    <div className="flex items-center text-[11px] font-medium text-slate-600"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200 mr-2"></span> Évaluation Initiale</div>
                  </div>
               </div>
             </div>
          </div>

        </div>

        {/* Schedule Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative">
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                <CalendarDays size={24} className="mr-3 text-blue-600" />
                Schedule a Lesson
              </h3>
              
              <form onSubmit={handleScheduleLesson} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Student</label>
                  <select 
                    required
                    value={newLesson.studentEmail}
                    onChange={(e) => setNewLesson({...newLesson, studentEmail: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                  >
                    <option value="">Select a student...</option>
                    {uniqueStudents.map(s => (
                      <option key={s.email} value={s.email}>{s.name} ({s.email})</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Date</label>
                  <input 
                    type="date" 
                    required
                    value={newLesson.date}
                    onChange={(e) => setNewLesson({...newLesson, date: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Start Time</label>
                    <input 
                      type="time" 
                      required
                      value={newLesson.startTime}
                      onChange={(e) => setNewLesson({...newLesson, startTime: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">End Time</label>
                    <input 
                      type="time" 
                      required
                      value={newLesson.endTime}
                      onChange={(e) => setNewLesson({...newLesson, endTime: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Notes (Optional)</label>
                  <textarea 
                    value={newLesson.notes}
                    onChange={(e) => setNewLesson({...newLesson, notes: e.target.value})}
                    placeholder="Focus on parking, highway driving..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none resize-none"
                    rows="2"
                  ></textarea>
                </div>
                
                <div className="pt-4">
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-md">
                    Confirm Lesson
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-6 left-1/2 z-[100] px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 text-sm font-medium ${
              toastMessage.type === 'error' ? 'bg-red-500 text-white' : 
              toastMessage.type === 'info' ? 'bg-blue-500 text-white' :
              'bg-gray-900 text-white'
            }`}
          >
            {toastMessage.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-[280px_1fr] min-h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-br from-indigo-900 via-[#1e1b4b] to-[#2e1065] text-white border-r border-indigo-500/20 flex flex-col hidden md:flex shadow-2xl relative z-20">
        <div className="h-[72px] flex items-center px-6 shrink-0 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
          <div className="bg-blue-600 text-white p-1.5 rounded-lg mr-3 shadow-md shadow-blue-900/50">
            <Car size={22} strokeWidth={2.5} />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">DameDrive</span>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <p className="px-3 text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-3">Main Menu</p>
          <nav className="space-y-1">
            <button onClick={() => setActiveTab('Dashboard')} className={`w-full flex items-center px-3 py-3 rounded-xl transition-all ${activeTab === 'Dashboard' ? 'bg-blue-600/10 text-blue-400 font-medium shadow-inner' : 'hover:bg-white/5 hover:text-white font-medium text-slate-400'}`}>
              <Grid className={`mr-3 ${activeTab === 'Dashboard' ? 'text-blue-500' : 'text-slate-500'}`} size={20} strokeWidth={2} /> Dashboard
            </button>
            <button onClick={() => setActiveTab('Bookings')} className={`w-full flex items-center px-3 py-3 rounded-xl transition-all ${activeTab === 'Bookings' ? 'bg-blue-600/10 text-blue-400 font-medium shadow-inner' : 'hover:bg-white/5 hover:text-white font-medium text-slate-400'}`}>
              <Calendar className={`mr-3 ${activeTab === 'Bookings' ? 'text-blue-500' : 'text-slate-500'}`} size={20} strokeWidth={2} /> Bookings
            </button>
            <button onClick={() => setActiveTab('Planning')} className={`w-full flex items-center px-3 py-3 rounded-xl transition-all ${activeTab === 'Planning' ? 'bg-blue-600/10 text-blue-400 font-medium shadow-inner' : 'hover:bg-white/5 hover:text-white font-medium text-slate-400'}`}>
              <CalendarDays className={`mr-3 ${activeTab === 'Planning' ? 'text-blue-500' : 'text-slate-500'}`} size={20} strokeWidth={2} /> Planning
            </button>
            <button onClick={() => setActiveTab('Students')} className={`w-full flex items-center px-3 py-3 rounded-xl transition-all ${activeTab === 'Students' ? 'bg-blue-600/10 text-blue-400 font-medium shadow-inner' : 'hover:bg-white/5 hover:text-white font-medium text-slate-400'}`}>
              <Users className={`mr-3 ${activeTab === 'Students' ? 'text-blue-500' : 'text-slate-500'}`} size={20} strokeWidth={2} /> Students
            </button>
                      <button onClick={() => setActiveTab('Finance')} className={`w-full flex items-center px-3 py-3 rounded-xl transition-all ${activeTab === 'Finance' ? 'bg-blue-600/10 text-blue-400 font-medium shadow-inner' : 'hover:bg-white/5 hover:text-white font-medium text-slate-400'}`}>
              <TrendingUp className={`mr-3 ${activeTab === 'Finance' ? 'text-blue-500' : 'text-slate-500'}`} size={20} strokeWidth={2} /> Finances
            </button>
                      <button onClick={() => setActiveTab('History')} className={`w-full flex items-center px-3 py-3 rounded-xl transition-all ${activeTab === 'History' ? 'bg-blue-600/10 text-blue-400 font-medium shadow-inner' : 'hover:bg-white/5 hover:text-white font-medium text-slate-400'}`}>
              <Activity className={`mr-3 ${activeTab === 'History' ? 'text-blue-500' : 'text-slate-500'}`} size={20} strokeWidth={2} /> History & Logs
            </button>
          </nav>
          
          {userRole === 'Admin' && (
            <div className="mt-10">
              <p className="px-3 text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-3">System</p>
              <nav className="space-y-1">
                <button onClick={() => setActiveTab('Settings')} className={`w-full flex items-center px-3 py-3 rounded-xl transition-all ${activeTab === 'Settings' ? 'bg-blue-600/10 text-blue-400 font-medium shadow-inner' : 'hover:bg-white/5 hover:text-white font-medium text-slate-400'}`}>
                  <Settings className={`mr-3 ${activeTab === 'Settings' ? 'text-blue-500' : 'text-slate-500'}`} size={20} strokeWidth={2} /> Settings
                </button>
              </nav>
            </div>
          )}
        </div>
        
        {/* User Profile Block at Bottom of Sidebar */}
        <div className="p-4 border-t border-slate-800/50 mt-auto relative">
          <AnimatePresence>
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full mb-2 left-4 right-4 bg-slate-800 border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 overflow-hidden"
                >
                  <div className="px-3 py-2 border-b border-slate-700 mb-1">
                    <p className="text-xs text-white truncate font-medium capitalize">{userName || 'Loading...'}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{userEmail}</p>
                  </div>
                  <div className="mt-2 mb-1">
                    <p className="text-[10px] text-slate-400 mb-1">RBAC Role Switcher:</p>
                    <select 
                      value={role} 
                      onChange={(e) => setRoleOverride(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-white focus:outline-none"
                    >
                      {Object.values(ROLES).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                <button className="w-full flex items-center px-3 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                  <Camera size={14} className="mr-3 text-slate-400" /> Update Picture
                </button>
                <button onClick={() => { setActiveTab('Settings'); setShowProfileMenu(false); }} className="w-full flex items-center px-3 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                  <Settings size={14} className="mr-3 text-slate-400" /> Account Settings
                </button>
                <div className="h-px bg-slate-700 my-1"></div>
                <button onClick={handleSignOut} className="w-full flex items-center px-3 py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                  <LogOut size={14} className="mr-3" /> Disconnect
                </button>
              </motion.div>
              </>
            )}
          </AnimatePresence>

          <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="w-full flex items-center justify-between bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 relative z-50">
            <div className="flex items-center truncate mr-3">
              <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium text-sm shrink-0 shadow-inner relative overflow-hidden group">
                <span className="group-hover:hidden">{userName ? userName.charAt(0).toUpperCase() : 'A'}</span>
                <Camera size={14} className="hidden group-hover:block" />
              </div>
              <div className="ml-3 truncate text-left">
                <p className="text-sm font-medium text-white truncate capitalize">{userName || 'Loading...'}</p>
                <p className="text-[10px] text-blue-400 font-medium uppercase tracking-widest">{userRole}</p>
              </div>
            </div>
            <ChevronUp size={16} className={`text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-slate-800 hidden sm:block">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-4">
          </div>
        </header>

        {/* Dynamic Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
          <AnimatePresence mode="wait">
            {activeTab === 'Dashboard' && <motion.div key="Dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>{renderDashboard()}</motion.div>}
            {activeTab === 'Bookings' && (
               <motion.div key="Bookings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="max-w-7xl mx-auto space-y-6">
                 {renderFilterBar()}
                 {renderBookingsTable()}
               </motion.div>
            )}
            {activeTab === 'Planning' && <motion.div key="Planning" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>{renderPlanning()}</motion.div>}
            {activeTab === 'Earnings' && (
              <motion.div key="Earnings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="w-full">
                <FinanceDashboard 
                  bookings={bookings} 
                  studentMeta={studentMeta} 
                  chartData={chartData} 
                  packageEarnings={packageEarnings} 
                  totalEarnings={totalEarnings} 
                />
              </motion.div>
            )}
            
            {activeTab === 'Students' && (
              <motion.div key="Students" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="max-w-7xl mx-auto space-y-6">
                <StudentCRM 
                  students={uniqueStudents} 
                  studentMeta={studentMeta} 
                  lessons={lessons} 
                  updateStudentMeta={updateStudentMeta} 
                />
              </motion.div>
          )}

          
            {activeTab === 'Finance' && (
              <motion.div key="Finance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="w-full">
                <FinanceDashboard 
                  bookings={bookings} 
                  studentMeta={studentMeta} 
                  chartData={chartData} 
                  packageEarnings={packageEarnings} 
                  totalEarnings={totalEarnings} 
                />
              </motion.div>
            )}

          
          {activeTab === 'History' && (
            <motion.div key="History" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="max-w-6xl mx-auto space-y-6 pb-12">
              <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex overflow-x-auto gap-2">
                {['All Activity', 'Students & CRM', 'Planning', 'Communications', 'System & Security'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setHistoryCategory(cat)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${historyCategory === cat ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">History & Log</h2>
                    <p className="text-sm text-slate-500 mt-1">Audit trail of platform activities</p>
                  </div>
                  <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                    Export CSV
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2 text-left font-bold text-slate-600 uppercase tracking-wider text-xs">Date & Time</th>
                        <th className="px-4 py-2 text-left font-bold text-slate-600 uppercase tracking-wider text-xs">User</th>
                        <th className="px-4 py-2 text-left font-bold text-slate-600 uppercase tracking-wider text-xs">Action</th>
                        <th className="px-4 py-2 text-left font-bold text-slate-600 uppercase tracking-wider text-xs">Target / Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {MOCK_AUDIT_LOGS.filter(log => historyCategory === 'All Activity' || log.category === historyCategory).map((log, index) => (
                        <tr key={log.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-4 py-2.5 whitespace-nowrap text-slate-500">
                            {log.date}
                          </td>
                          <td className="px-4 py-2.5 whitespace-nowrap">
                            <span className="font-semibold text-slate-800">{log.user}</span>
                            <span className="text-slate-400 ml-2 text-xs">({log.role})</span>
                          </td>
                          <td className="px-4 py-2.5 whitespace-nowrap text-slate-700">
                            {log.action}
                          </td>
                          <td className="px-4 py-2.5 text-slate-600">
                            {log.target}
                          </td>
                        </tr>
                      ))}
                      {MOCK_AUDIT_LOGS.filter(log => historyCategory === 'All Activity' || log.category === historyCategory).length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-4 py-6 text-center text-slate-500">
                            No logs found for this category.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            </motion.div>
          )}


          {activeTab === 'Settings' && (
            <motion.div key="Settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="w-full mx-auto space-y-6 pb-12">
              <SettingsView />
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </main>


      
      {/* Onboarding Modal */}
      <AnimatePresence>
        {showProfileOnboardingModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/20">
                  <User size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Complete Your Profile</h3>
                <p className="text-sm font-medium text-slate-500 mt-2">Welcome to DameDrive! Please provide your details to configure your dashboard access.</p>
              </div>
              <form onSubmit={handleOnboardingSubmit} className="p-8 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">First Name</label>
                    <input type="text" required value={onboardingForm.firstName} onChange={(e) => setOnboardingForm({...onboardingForm, firstName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Last Name</label>
                    <input type="text" required value={onboardingForm.lastName} onChange={(e) => setOnboardingForm({...onboardingForm, lastName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                  <input type="tel" required value={onboardingForm.phone} onChange={(e) => setOnboardingForm({...onboardingForm, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="pt-4">
                  <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98] flex justify-center items-center">
                    {loading ? 'Saving...' : 'Save & Continue to Dashboard'} <ArrowRight size={18} className="ml-2" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Action Modal Overlay */}
      <AnimatePresence>
        {quickActionModal.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-100 overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-medium text-slate-800 flex items-center">
                  <Activity size={20} className="mr-2 text-blue-600" />
                  {quickActionModal.action}
                </h3>
                <button onClick={() => setQuickActionModal({ isOpen: false, action: null })} className="text-slate-400 hover:text-slate-600 transition-colors bg-white p-1.5 rounded-full shadow-sm">
                  <X size={18} strokeWidth={3} />
                </button>
              </div>
              <div className="p-8">
                {quickActionModal.action === 'Broadcast' && (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-slate-500 mb-4">Envoyer des rappels ciblés aux élèves.</p>
                    <div className="flex gap-3 mb-4 flex-wrap">
                      <button className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors focus:ring-2 focus:ring-blue-400">Tous les Pending ({pending})</button>
                    </div>
                    <div>
                      <input type="text" placeholder="Sujet (ex: Rappel de paiement)" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                      <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" rows="5" placeholder="Composez votre message ici..."></textarea>
                    </div>
                    <div className="flex gap-3">
                      <button className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors" onClick={() => setQuickActionModal({ isOpen: false, action: null })}>Annuler</button>
                      <button className="w-2/3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-md transition-colors" onClick={handleSendReminders}>Envoyer Rappels</button>
                    </div>
                  </div>
                )}
                {quickActionModal.action === 'Export' && (
                  <div className="space-y-4 text-center">
                    <p className="text-sm font-medium text-slate-500 mb-4">Exportation de {filteredBookings.length} dossiers.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="py-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-medium hover:bg-emerald-100 transition-colors" onClick={() => { showToast('Bientôt disponible !', 'info'); setQuickActionModal({ isOpen: false, action: null }); }}>Download Excel</button>
                      <button className="py-4 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition-colors" onClick={handleExportCSV}>Download CSV</button>
                    </div>
                  </div>
                )}
                {quickActionModal.action === 'Console' && (
                  <div className="space-y-0 font-mono text-[11px] text-green-400 bg-[#0a0f1c] p-5 rounded-xl h-64 overflow-y-auto border border-slate-800 shadow-inner">
                    <div className="text-slate-500 mb-2"># DameDrive System Console v2.4.1</div>
                    <div><span className="text-blue-400">[SYS]</span> Initializing core services... <span className="text-emerald-400">OK</span></div>
                    <div><span className="text-blue-400">[DB]</span> Connecting to primary database cluster... <span className="text-emerald-400">OK (12ms)</span></div>
                    <div><span className="text-purple-400">[AUTH]</span> Validating current session token... <span className="text-emerald-400">VALID</span></div>
                    <div><span className="text-purple-400">[AUTH]</span> Role assumed: <span className="text-amber-300">Owner</span></div>
                    <div><span className="text-sky-400">[API]</span> Syncing booking queue... <span className="text-emerald-400">SYNCED (142 records)</span></div>
                    <div className="mt-2 text-slate-500"># Running background cron jobs</div>
                    <div><span className="text-amber-400">[CRON]</span> Checking for abandoned checkouts... <span className="text-slate-400">Found 3</span></div>
                    <div><span className="text-amber-400">[CRON]</span> Dispatching automated reminders... <span className="text-emerald-400">SENT (12)</span></div>
                    <div className="mt-4 flex items-center">
                      <span className="text-green-400 mr-2">admin@damedrive:~$</span>
                      <span className="animate-pulse w-2 h-4 bg-green-400 inline-block"></span>
                    </div>
                  </div>
                )}
                {quickActionModal.action === 'New Package' && (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-slate-500 mb-4">Create a new driving service package.</p>
                    <div className="space-y-3">
                      <input type="text" placeholder="Package Name (e.g. Winter Driving Mastery)" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-blue-500" />
                      <div className="flex gap-3">
                        <input type="number" placeholder="Price ($)" className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-blue-500" />
                        <input type="number" placeholder="Hours" className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-blue-500" />
                      </div>
                      <textarea placeholder="Description" rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-blue-500"></textarea>
                      <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium shadow-md transition-colors" onClick={() => { alert('Package Created!'); setQuickActionModal({ isOpen: false, action: null }); }}>Create Package</button>
                    </div>
                  </div>
                )}
                {quickActionModal.action === 'Health Check' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div className="flex items-center"><Activity className="text-emerald-500 mr-3" size={20} /><span className="font-medium text-emerald-800">API Latency</span></div>
                      <span className="text-emerald-600 font-medium">24ms</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div className="flex items-center"><CheckCircle className="text-emerald-500 mr-3" size={20} /><span className="font-medium text-emerald-800">Database Connection</span></div>
                      <span className="text-emerald-600 font-medium">Healthy</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex items-center"><CheckCircle className="text-blue-500 mr-3" size={20} /><span className="font-medium text-blue-800">Storage Capacity</span></div>
                      <span className="text-blue-600 font-medium">42% Used</span>
                    </div>
                    <button className="w-full py-3 mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors" onClick={() => setQuickActionModal({ isOpen: false, action: null })}>Close</button>
                  </div>
                )}
                {quickActionModal.action === 'Support' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-slate-800">Open Tickets (3)</h4>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      <div className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors bg-slate-50">
                        <div className="flex justify-between mb-2"><span className="text-sm font-medium text-slate-800">Payment failed #1042</span><span className="text-xs text-amber-500 bg-amber-50 px-2 py-0.5 rounded">High Priority</span></div>
                        <p className="text-xs text-slate-600 mb-3 bg-white p-3 rounded-lg border border-slate-100">"Hi, I tried booking the Winter Package but my card was declined twice. Can you help?" - John Doe</p>
                        <div className="flex gap-2">
                           <button className="flex-1 text-xs font-medium bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors" onClick={() => alert('Reply draft opened.')}>Reply to Customer</button>
                           <button className="flex-1 text-xs font-medium bg-white border border-slate-300 text-slate-700 py-2 rounded-lg hover:bg-slate-50 transition-colors" onClick={() => alert('Issue marked as resolved.')}>Resolve Issue</button>
                        </div>
                      </div>
                      <div className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors bg-slate-50">
                        <div className="flex justify-between mb-2"><span className="text-sm font-medium text-slate-800">Refund request #1041</span><span className="text-xs text-slate-500">5h ago</span></div>
                        <p className="text-xs text-slate-600 mb-3 bg-white p-3 rounded-lg border border-slate-100">"I would like to cancel my winter package due to moving to another city."</p>
                        <div className="flex gap-2">
                           <button className="flex-1 text-xs font-medium bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors" onClick={() => alert('Refund processed.')}>Process Refund</button>
                           <button className="flex-1 text-xs font-medium bg-white border border-slate-300 text-slate-700 py-2 rounded-lg hover:bg-slate-50 transition-colors" onClick={() => alert('Reply draft opened.')}>Contact Customer</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default OwnerDashboard;
```

## Fichier : src/pages/DashboardRouter.jsx
```jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../config/roles';


// The Unified Dashboard (formerly OwnerDashboard)
import OwnerDashboard from './dashboards/OwnerDashboard';

const DashboardRouter = () => {
  return (
    <>
      <OwnerDashboard />
    </>
  );
};

export default DashboardRouter;
```

## Fichier : src/components/finance/FinanceDashboard.jsx
```jsx
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
```

## Fichier : src/components/crm/StudentCRM.jsx
```jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Phone, Mail, CalendarDays, Filter, ChevronRight, ArrowLeft, X, Clock, CheckCircle2, AlertCircle, FileText, TrendingUp, Award, Bookmark, DollarSign } from 'lucide-react';

const StudentCRM = ({ students, studentMeta, lessons, updateStudentMeta }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProgress, setFilterProgress] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Filtering logic
  const filteredStudents = students.filter(student => {
    const meta = studentMeta[student.email] || { progress: 0, payment: 'Pending', license: 'Not Started' };
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = student.name.toLowerCase().includes(searchLower) || 
                        student.email.toLowerCase().includes(searchLower) ||
                        (student.phone && student.phone.includes(searchLower));
                        
    let matchProgress = true;
    if (filterProgress === 'Completed') matchProgress = meta.progress === 100;
    if (filterProgress === 'In Progress') matchProgress = meta.progress > 0 && meta.progress < 100;
    if (filterProgress === 'Not Started') matchProgress = meta.progress === 0;
    if (filterProgress === 'Pending Payment') matchProgress = meta.payment === 'Pending';

    return matchSearch && matchProgress;
  });

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return 'text-emerald-500 bg-emerald-50';
    if (progress >= 50) return 'text-blue-500 bg-blue-50';
    if (progress > 0) return 'text-amber-500 bg-amber-50';
    return 'text-slate-400 bg-slate-50';
  };

  const getProgressStroke = (progress) => {
    if (progress === 100) return 'stroke-emerald-500';
    if (progress >= 50) return 'stroke-blue-500';
    if (progress > 0) return 'stroke-amber-500';
    return 'stroke-slate-200';
  };

  const CircularProgress = ({ progress }) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center w-12 h-12">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r={radius} fill="transparent" strokeWidth="4" className="stroke-slate-100" />
          <circle 
            cx="22" cy="22" r={radius} 
            fill="transparent" 
            strokeWidth="4" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round"
            className={`${getProgressStroke(progress)} transition-all duration-1000 ease-out`} 
          />
        </svg>
        <span className="absolute text-[10px] font-bold text-slate-700">{progress}%</span>
      </div>
    );
  };

  const renderStudentList = () => (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">Dossiers Étudiants</h3>
          <p className="text-sm font-medium text-slate-500 mt-1">Gérez le suivi, la progression et l'historique de vos {students.length} élèves.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher un élève..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
            />
          </div>
          <div className="relative">
            <select 
              value={filterProgress}
              onChange={(e) => setFilterProgress(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 cursor-pointer focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
            >
              <option value="All">Tous les statuts</option>
              <option value="In Progress">En Cours</option>
              <option value="Not Started">Non Commencé</option>
              <option value="Completed">Terminé</option>
              <option value="Pending Payment">Paiement en attente</option>
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transform rotate-90" size={16} />
          </div>
        </div>
      </div>

      {/* Grid of Students */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-slate-300" size={32} />
          </div>
          <h4 className="text-lg font-bold text-slate-700">Aucun étudiant trouvé</h4>
          <p className="text-slate-500 text-sm mt-2 font-medium">Modifiez vos filtres de recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredStudents.map((student, idx) => {
            const meta = studentMeta[student.email] || { progress: 0, payment: 'Pending', license: 'Not Started' };
            const studentLessons = lessons.filter(l => l.student_email === student.email);
            const nextLesson = studentLessons.filter(l => new Date(l.lesson_date) >= new Date()).sort((a,b) => new Date(a.lesson_date) - new Date(b.lesson_date))[0];
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={student.email}
                onClick={() => setSelectedStudent({ ...student, meta, studentLessons, nextLesson })}
                className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110"></div>
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm ${getProgressColor(meta.progress)}`}>
                      {getInitials(student.name)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-[15px] truncate max-w-[120px]">{student.name}</h4>
                      <p className="text-xs font-medium text-slate-400 mt-0.5 truncate max-w-[120px]">{student.email}</p>
                    </div>
                  </div>
                  <CircularProgress progress={meta.progress} />
                </div>

                <div className="space-y-2 mt-5 pt-4 border-t border-slate-50">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-400 flex items-center"><CalendarDays size={14} className="mr-1.5"/> Prochain cours</span>
                    <span className="text-slate-700">{nextLesson ? new Date(nextLesson.lesson_date).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short'}) : 'Aucun'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-400 flex items-center"><DollarSign size={14} className="mr-1.5"/> Paiement</span>
                    <span className={`px-2 py-0.5 rounded-md ${meta.payment === 'Validated' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {meta.payment === 'Validated' ? 'Payé' : 'En attente'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderStudentProfile = () => {
    if (!selectedStudent) return null;
    const { meta, studentLessons, nextLesson } = selectedStudent;
    const pastLessons = studentLessons.filter(l => new Date(l.lesson_date) < new Date()).sort((a,b) => new Date(b.lesson_date) - new Date(a.lesson_date));
    
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: 1, x: 0 }} 
        exit={{ opacity: 0, x: 20 }}
        className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]"
      >
        {/* Sidebar / Info Panel */}
        <div className="w-full md:w-80 bg-slate-50 border-r border-slate-100 p-8 flex flex-col relative">
          <button 
            onClick={() => setSelectedStudent(null)}
            className="absolute top-6 left-6 flex items-center px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:shadow-sm transition-all"
          >
            <ArrowLeft size={16} className="mr-2" />
            Retour
          </button>

          <div className="flex flex-col items-center text-center mt-8 mb-8">
             <div className="relative">
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center font-bold text-3xl shadow-md ${getProgressColor(meta.progress)}`}>
                  {getInitials(selectedStudent.name)}
                </div>
                {meta.license === 'Obtained' && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-400 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm" title="Permis Obtenu">
                    <Award size={16} />
                  </div>
                )}
             </div>
             <h2 className="text-xl font-bold text-slate-800 mt-4 tracking-tight">{selectedStudent.name}</h2>
             <p className="text-sm font-medium text-slate-500 mt-1 flex items-center justify-center"><Phone size={14} className="mr-1.5"/> {selectedStudent.phone || 'Non renseigné'}</p>
             <p className="text-sm font-medium text-slate-500 mt-1 flex items-center justify-center"><Mail size={14} className="mr-1.5"/> {selectedStudent.email}</p>
          </div>

          <div className="space-y-5 flex-1">
             <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Progression</h4>
               <div className="flex items-center justify-between mb-2">
                 <span className="text-sm font-bold text-slate-700">{meta.progress}%</span>
                 <span className="text-xs font-medium text-slate-500">Examen SAAQ</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${meta.progress}%` }}></div>
               </div>
               <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                 <span className="text-xs font-medium text-slate-500">Mettre à jour :</span>
                 <select 
                    value={meta.progress}
                    onChange={(e) => {
                      updateStudentMeta(selectedStudent.email, 'progress', parseInt(e.target.value));
                      setSelectedStudent(prev => ({...prev, meta: {...prev.meta, progress: parseInt(e.target.value)}}));
                    }}
                    className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 cursor-pointer"
                 >
                   <option value="0">0%</option>
                   <option value="25">25%</option>
                   <option value="50">50%</option>
                   <option value="75">75%</option>
                   <option value="100">100%</option>
                 </select>
               </div>
             </div>

             <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Dossier Administratif</h4>
               
               <div className="space-y-3">
                 <div className="flex items-center justify-between">
                   <span className="text-xs font-medium text-slate-600">Paiement</span>
                   <select 
                      value={meta.payment}
                      onChange={(e) => {
                        updateStudentMeta(selectedStudent.email, 'payment', e.target.value);
                        setSelectedStudent(prev => ({...prev, meta: {...prev.meta, payment: e.target.value}}));
                      }}
                      className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 cursor-pointer"
                   >
                     <option value="Pending">En attente</option>
                     <option value="Validated">Validé</option>
                   </select>
                 </div>
                 
                 <div className="flex items-center justify-between">
                   <span className="text-xs font-medium text-slate-600">Statut Permis</span>
                   <select 
                      value={meta.license}
                      onChange={(e) => {
                        updateStudentMeta(selectedStudent.email, 'license', e.target.value);
                        setSelectedStudent(prev => ({...prev, meta: {...prev.meta, license: e.target.value}}));
                      }}
                      className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 cursor-pointer"
                   >
                     <option value="Not Started">Non Commencé</option>
                     <option value="Apprenti">Apprenti</option>
                     <option value="Probatoire">Probatoire</option>
                     <option value="Obtained">Obtenu</option>
                   </select>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 bg-white overflow-y-auto">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center tracking-tight">
             <Bookmark className="mr-2 text-blue-500" size={20} />
             Historique des leçons
           </h3>

           {/* Next Lesson Highlight */}
           {nextLesson && (
             <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white mb-8 shadow-lg shadow-blue-500/20 flex items-center justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
               <div>
                 <h4 className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Prochain Cours</h4>
                 <div className="flex items-center text-lg font-bold">
                   <CalendarDays size={18} className="mr-2" />
                   {new Date(nextLesson.lesson_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                   <span className="mx-3 opacity-50">•</span>
                   <Clock size={18} className="mr-2" />
                   {nextLesson.start_time.substring(0,5)} - {nextLesson.end_time.substring(0,5)}
                 </div>
               </div>
               <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold tracking-wider">
                 Planifié
               </div>
             </div>
           )}

           {/* Past Lessons Timeline */}
           <div>
             <h4 className="text-sm font-bold text-slate-700 mb-4">Séances enregistrées ({pastLessons.length})</h4>
             
             {pastLessons.length === 0 ? (
               <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                 <FileText size={24} className="text-slate-300 mx-auto mb-2" />
                 <p className="text-sm font-medium text-slate-500">Aucun historique de leçon pour le moment.</p>
               </div>
             ) : (
               <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-100">
                 {pastLessons.map((lesson, idx) => (
                   <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                     <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                       {lesson.status === 'Completed' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <AlertCircle size={16} />}
                     </div>
                     <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-left">
                       <div className="flex items-center justify-between mb-2">
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                           {new Date(lesson.lesson_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                         </span>
                         <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${lesson.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                           {lesson.status}
                         </span>
                       </div>
                       <p className="text-sm font-medium text-slate-700">Séance de {lesson.start_time.substring(0,5)} à {lesson.end_time.substring(0,5)}</p>
                       {lesson.notes && (
                         <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs font-medium text-slate-600 italic border border-slate-100">
                           "{lesson.notes}"
                         </div>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!selectedStudent ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {renderStudentList()}
          </motion.div>
        ) : (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {renderStudentProfile()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentCRM;
```

## Fichier : src/components/settings/SettingsView.jsx
```jsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, UserPlus, MoreHorizontal, Pencil, Trash, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../config/roles';

const MOCK_OTHER_USERS = [
  { id: 2, name: 'John Doe', phone: '+15141234567', role: ROLES.MANAGER },
  { id: 3, name: 'Alice Smith', phone: '+14389876543', role: ROLES.INSTRUCTOR }
];

const SettingsView = () => {
  const { role: currentRole, setRoleOverride } = useAuth();
  
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  
  // First user is always the current session user to allow dynamic testing
  const [users, setUsers] = useState([
    { id: 1, name: 'Ton Compte (Test Actif)', phone: '+1 (514) ***-****', role: currentRole, isCurrentUser: true },
    ...MOCK_OTHER_USERS
  ]);
  
  // Sync if role changes elsewhere
  useEffect(() => {
    setUsers(prev => prev.map(u => u.isCurrentUser ? { ...u, role: currentRole } : u));
  }, [currentRole]);
  
  // Menu state
  const [menuOpenForId, setMenuOpenForId] = useState(null);
  const menuRef = useRef(null);

  // Edit Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  // Add Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: '', phone: '', email: '', role: ROLES.INSTRUCTOR });

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenForId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setMenuOpenForId(null);
    setEditModalOpen(true);
  };

  const handleSaveRole = () => {
    if (selectedUser.isCurrentUser) {
      // Actively change the app's role for testing!
      setRoleOverride(newRole);
    } else {
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, role: newRole } : u));
    }
    setEditModalOpen(false);
  };

  const handleAddUser = () => {
    const newUser = {
      id: Date.now(),
      name: newUserForm.name || 'Sans Nom',
      phone: newUserForm.phone || 'Non renseigné',
      role: newUserForm.role
    };
    setUsers([...users, newUser]);
    setAddModalOpen(false);
    setNewUserForm({ name: '', phone: '', email: '', role: ROLES.INSTRUCTOR });
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone.includes(searchQuery)
  );

  return (
    <div className="max-w-6xl mx-auto pb-12 w-full">
      <h2 className="text-3xl font-medium text-slate-800 text-center mb-8">Paramètres</h2>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-8">
        <button 
          onClick={() => setActiveTab('users')}
          className={`pb-4 px-4 text-sm font-medium uppercase tracking-wide transition-colors relative ${activeTab === 'users' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Gestion Utilisateurs
          {activeTab === 'users' && (
            <motion.div layoutId="activeSettingsTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('account')}
          className={`pb-4 px-4 text-sm font-medium uppercase tracking-wide transition-colors relative ${activeTab === 'account' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Informations Compte
          {activeTab === 'account' && (
            <motion.div layoutId="activeSettingsTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="bg-white rounded-lg">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-600 shadow-sm"
              />
            </div>
            
            <div className="flex items-center gap-6 self-end md:self-auto">
              <div className="flex items-center text-sm text-slate-500">
                <span className="mr-2">Lignes par page :</span>
                <span className="font-medium mr-1">10</span>
                <ChevronDown size={14} className="text-slate-400" />
              </div>
              <div className="flex items-center text-sm text-slate-500 gap-2">
                <span>1-{filteredUsers.length} sur {filteredUsers.length}</span>
                <div className="flex gap-1 ml-2">
                  <button className="text-slate-300 cursor-not-allowed">{'<'}</button>
                  <button className="text-slate-300 cursor-not-allowed">{'>'}</button>
                </div>
              </div>
              <button 
                onClick={() => setAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center shadow-md active:scale-95"
              >
                <UserPlus size={16} className="mr-2" />
                Ajouter un utilisateur
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-4 font-medium text-slate-800 text-sm w-1/3">Nom</th>
                  <th className="py-4 font-medium text-slate-800 text-sm w-1/3">Téléphone</th>
                  <th className="py-4 font-medium text-slate-800 text-sm w-1/3">Rôle</th>
                  <th className="py-4 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-sm text-slate-700">{user.name}</td>
                    <td className="py-4 text-sm text-slate-600">{user.phone}</td>
                    <td className="py-4 text-sm text-slate-600">{user.role}</td>
                    <td className="py-4 relative">
                      <button 
                        onClick={() => setMenuOpenForId(menuOpenForId === user.id ? null : user.id)}
                        className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors"
                      >
                        <MoreHorizontal size={20} />
                      </button>

                      <AnimatePresence>
                        {menuOpenForId === user.id && (
                          <motion.div 
                            ref={menuRef}
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.1 }}
                            className="absolute right-0 top-12 w-40 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 py-1 z-10"
                          >
                            <button 
                              onClick={() => handleEditClick(user)}
                              className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center transition-colors"
                            >
                              <Pencil size={16} className="mr-3 text-slate-500" />
                              Modifier
                            </button>
                            <button className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center transition-colors">
                              <Trash size={16} className="mr-3 text-slate-500" />
                              Supprimer
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-500 text-sm">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'account' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Informations du Compte</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Prénom</label>
                <input type="text" defaultValue="Kory" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nom</label>
                <input type="text" defaultValue="SENGHOR" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Numéro de téléphone</label>
              <input type="tel" defaultValue="+1 (514) 000-0000" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rôle / Accès actuel</label>
              <input type="text" disabled value={currentRole} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 font-bold text-blue-600 cursor-not-allowed uppercase" />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-xl transition-all shadow-md active:scale-95">
                Mettre à jour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      <AnimatePresence>
        {editModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-medium text-slate-800 mb-6">
                  Modification de {selectedUser.name}
                </h3>
                
                <div className="relative mb-8 mt-2">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Nouveau Rôle
                  </label>
                  <select 
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-blue-500 focus:border-blue-600 focus:ring-0 rounded-xl text-slate-700 font-medium bg-white appearance-none outline-none transition-colors"
                  >
                    {Object.values(ROLES).map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <ChevronDown size={16} className="text-slate-500" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                  <button 
                    onClick={() => setEditModalOpen(false)}
                    className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={handleSaveRole}
                    className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-md active:scale-95"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add User Modal */}
      <AnimatePresence>
        {addModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full max-w-md overflow-hidden border border-slate-100"
            >
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-medium text-slate-800 mb-6">
                  Ajouter un nouvel utilisateur
                </h3>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Nom complet</label>
                    <input 
                      type="text" 
                      value={newUserForm.name}
                      onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}
                      placeholder="Ex: Sophie Martin"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                    <input 
                      type="email" 
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                      placeholder="sophie@damedrive.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Téléphone</label>
                    <input 
                      type="tel" 
                      value={newUserForm.phone}
                      onChange={(e) => setNewUserForm({...newUserForm, phone: e.target.value})}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none" 
                    />
                  </div>

                  <div className="relative mt-2 pt-2">
                    <label className="absolute -top-1 left-3 bg-white px-1 text-xs font-bold text-blue-600 uppercase tracking-wider">
                      Attribuer un rôle
                    </label>
                    <select 
                      value={newUserForm.role}
                      onChange={(e) => setNewUserForm({...newUserForm, role: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-blue-500 focus:border-blue-600 focus:ring-0 rounded-xl text-slate-700 font-medium bg-white appearance-none outline-none transition-colors mt-2"
                    >
                      {Object.values(ROLES).map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none mt-2">
                      <ChevronDown size={16} className="text-slate-500" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                  <button 
                    onClick={() => setAddModalOpen(false)}
                    className="px-6 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={handleAddUser}
                    className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all shadow-md active:scale-95"
                  >
                    Valider l'ajout
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsView;
```
