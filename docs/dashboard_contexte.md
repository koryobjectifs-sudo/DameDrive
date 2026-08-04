# Contexte et Codebase : Dashboard & Backend
Ce fichier contient l'historique de la refonte du Dashboard, le système d'authentification, les configurations de rôles, et l'intégration Supabase/EmailJS.

## Fichier : src/pages/DashboardRouter.jsx
```jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../config/roles';

// Dashboards
import OwnerDashboard from './dashboards/OwnerDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';
import SecretaryDashboard from './dashboards/SecretaryDashboard';
import InstructorDashboard from './dashboards/InstructorDashboard';
import AccountantDashboard from './dashboards/AccountantDashboard';
import StandardDashboard from './dashboards/StandardDashboard';

const DashboardRouter = () => {
  const { role } = useAuth();

  switch (role) {
    case ROLES.OWNER:
      return <OwnerDashboard />;
    case ROLES.MANAGER:
      return <ManagerDashboard />;
    case ROLES.SECRETARY:
      return <SecretaryDashboard />;
    case ROLES.INSTRUCTOR:
      return <InstructorDashboard />;
    case ROLES.ACCOUNTANT:
      return <AccountantDashboard />;
    case ROLES.STANDARD_USER:
    default:
      return <StandardDashboard />;
  }
};

export default DashboardRouter;
```

## Fichier : src/pages/dashboards/OwnerDashboard.jsx
```jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { LogOut, Calendar, DollarSign, Clock, CheckCircle, Search, Bell, Grid, Users, Car, Settings, HelpCircle, User, MapPin, Mail, Phone, TrendingUp, CalendarDays, ChevronUp, Camera, X, Download, PlusCircle, Activity, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const mockSparklineData = [{v: 40}, {v: 30}, {v: 45}, {v: 50}, {v: 40}, {v: 65}, {v: 74}];
const mockSparklineData2 = [{v: 60}, {v: 50}, {v: 55}, {v: 70}, {v: 60}, {v: 80}, {v: 96}];
const mockSparklineData3 = [{v: 20}, {v: 25}, {v: 22}, {v: 30}, {v: 28}, {v: 35}, {v: 30}];
const mockSparklineData4 = [{v: 80}, {v: 75}, {v: 85}, {v: 90}, {v: 85}, {v: 95}, {v: 98}];

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b'];

import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../config/roles';

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
  const [historyCategory, setHistoryCategory] = useState('Broadcasts');
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

      // Send automated email to the student
      const emailMessage = `Hello ${student.name},\n\nYour driving lesson has been successfully scheduled!\n\n📅 Date: ${newLesson.date}\n⏰ Time: ${newLesson.startTime} - ${newLesson.endTime}\n📝 Notes: ${newLesson.notes || 'None'}\n\nPlease make sure to arrive on time. If you need to cancel or reschedule, please reply to this email directly.\n\nBest regards,\nThe DameDrive Team`;
      
      showToast('Scheduling lesson and sending email...', 'info');
      await sendEmailJSNotification(student.email, "Your Driving Lesson is Scheduled! 🚗", emailMessage);

      setShowScheduleModal(false);
      setNewLesson({ studentEmail: '', date: '', startTime: '', endTime: '', notes: '' });
      fetchBookings(); // Refreshes everything including lessons
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
                      <button onClick={() => handleDeleteBooking(b.id)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-xs rounded-lg transition-colors">
                        Delete
                      </button>
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
            <h3 className="text-lg font-medium text-slate-800">Earnings Overview</h3>
          </div>
          <div className="h-72 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} tickFormatter={(val) => `$${val}`} dx={-10} />
                <Tooltip cursor={{stroke: '#e2e8f0', strokeWidth: 2}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgb(0 0 0 / 0.15)', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', fontWeight: 600 }} formatter={(value) => [`$${value}`, ""]} />
                <Area type="monotone" dataKey="current" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorCurrent)" activeDot={{r: 6, strokeWidth: 0, fill: '#1d4ed8'}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
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
              <button onClick={() => setQuickActionModal({ isOpen: true, action: 'Export' })} className="flex flex-col items-center justify-center text-center p-3 bg-emerald-50/80 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors shadow-sm border border-emerald-100/50">
                <Download size={16} className="mb-1" /> 
                <span className="font-medium text-[11px] leading-tight">Export Data</span>
                <span className="text-[9px] font-medium text-emerald-600/70 mt-0.5 leading-tight">CSV / Excel</span>
              </button>
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

  const renderEarnings = () => (
    <div className="max-w-7xl mx-auto space-y-4">
      {renderFilterBar()}
      <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <h2 className="text-xl font-medium text-slate-800 mb-1 tracking-tight">Revenue by Package</h2>
        <p className="text-3xl font-medium text-blue-600 mb-8 tracking-tight">${totalEarnings} <span className="text-xs font-medium text-slate-400 uppercase tracking-widest ml-2">Total Value</span></p>
        
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={packageEarnings} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} tickFormatter={(val) => `$${val}`} dx={-10} />
              <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgb(0 0 0 / 0.15)', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)', fontWeight: 800, padding: '12px 20px' }} formatter={(value) => [`$${value}`, "Revenue"]} />
              <Bar dataKey="earnings" fill="url(#colorEarnings)" radius={[8, 8, 8, 8]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderPlanning = () => {
    return (
      <div className="max-w-5xl mx-auto space-y-6 relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-medium text-slate-800 tracking-tight">Lesson Schedule</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Manage your upcoming driving sessions</p>
          </div>
          <button 
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <CalendarDays size={18} className="mr-2" />
            Schedule Lesson
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-[10px] font-medium text-slate-400 uppercase tracking-widest">Date & Time</th>
                  <th className="px-6 py-3 text-left text-[10px] font-medium text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="px-6 py-3 text-left text-[10px] font-medium text-slate-400 uppercase tracking-widest">Instructor</th>
                  <th className="px-6 py-3 text-left text-[10px] font-medium text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-3 text-right text-[10px] font-medium text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lessons.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-12 text-center text-[13px] font-medium text-slate-500">No lessons scheduled yet</td></tr>
                ) : lessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-800">{new Date(lesson.lesson_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                      <div className="text-xs font-medium text-slate-500 flex items-center mt-1">
                        <Clock size={12} className="mr-1" /> {lesson.start_time.substring(0,5)} - {lesson.end_time.substring(0,5)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-800">{lesson.student_name}</div>
                      <div className="text-xs text-slate-400">{lesson.student_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-500">
                      {lesson.instructor_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${
                        lesson.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        lesson.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                        'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {lesson.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <select 
                        value={lesson.status}
                        onChange={(e) => handleLessonAction(lesson.id, e.target.value)}
                        className="px-2 py-1.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-xs rounded-lg transition-colors outline-none cursor-pointer"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <button onClick={() => setActiveTab('Earnings')} className={`w-full flex items-center px-3 py-3 rounded-xl transition-all ${activeTab === 'Earnings' ? 'bg-blue-600/10 text-blue-400 font-medium shadow-inner' : 'hover:bg-white/5 hover:text-white font-medium text-slate-400'}`}>
              <DollarSign className={`mr-3 ${activeTab === 'Earnings' ? 'text-blue-500' : 'text-slate-500'}`} size={20} strokeWidth={2} /> Earnings
            </button>
          
                      <button onClick={() => setActiveTab('Finance')} className={`w-full flex items-center px-3 py-3 rounded-xl transition-all ${activeTab === 'Finance' ? 'bg-blue-600/10 text-blue-400 font-medium shadow-inner' : 'hover:bg-white/5 hover:text-white font-medium text-slate-400'}`}>
              <TrendingUp className={`mr-3 ${activeTab === 'Finance' ? 'text-blue-500' : 'text-slate-500'}`} size={20} strokeWidth={2} /> Finance
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
            {activeTab === 'Earnings' && <motion.div key="Earnings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>{renderEarnings()}</motion.div>}
            
            {activeTab === 'Students' && (
              <motion.div key="Students" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="max-w-7xl mx-auto space-y-6">
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100">
                  <h3 className="text-lg font-medium text-slate-800 tracking-tight">Student Directory ({uniqueStudents.length})</h3>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">Automatically derived from booking history</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-[10px] font-medium text-slate-400 uppercase tracking-widest">Student Name</th>
                        <th className="px-6 py-3 text-left text-[10px] font-medium text-slate-400 uppercase tracking-widest">Contact Info</th>
                        <th className="px-6 py-3 text-left text-[10px] font-medium text-slate-400 uppercase tracking-widest">Payment</th>
                        <th className="px-6 py-3 text-left text-[10px] font-medium text-slate-400 uppercase tracking-widest">Progress</th>
                        <th className="px-6 py-3 text-left text-[10px] font-medium text-slate-400 uppercase tracking-widest">License Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {uniqueStudents.map((s, idx) => {
                        const meta = studentMeta[s.email] || { payment: 'Pending', progress: 0, license: 'Not Started' };
                        return (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-none group">
                          <td className="px-6 py-2.5 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-50 to-purple-100 text-indigo-600 flex items-center justify-center font-medium uppercase shadow-inner shrink-0">
                                {s.name.charAt(0)}
                              </div>
                              <div className="ml-4 font-medium text-slate-800">{s.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap">
                            <div className="text-xs font-medium text-slate-600 flex items-center"><Mail size={14} className="mr-2 text-slate-400"/> {s.email}</div>
                            <div className="text-xs font-medium text-slate-500 flex items-center mt-1.5"><Phone size={14} className="mr-2 text-slate-300"/> {s.phone || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap">
                            <select
                              value={meta.payment}
                              onChange={(e) => updateStudentMeta(s.email, 'payment', e.target.value)}
                              className="text-xs font-medium bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Validated">Validated</option>
                            </select>
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap">
                            <select
                              value={meta.progress}
                              onChange={(e) => updateStudentMeta(s.email, 'progress', parseInt(e.target.value))}
                              className="text-xs font-medium bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                            >
                              <option value="0">0%</option>
                              <option value="25">25%</option>
                              <option value="50">50%</option>
                              <option value="75">75%</option>
                              <option value="100">100%</option>
                            </select>
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                              <div className="h-full bg-blue-500" style={{ width: `${meta.progress}%` }}></div>
                            </div>
                          </td>
                          <td className="px-6 py-2.5 whitespace-nowrap">
                            <select
                              value={meta.license}
                              onChange={(e) => updateStudentMeta(s.email, 'license', e.target.value)}
                              className={`text-[11px] font-medium uppercase tracking-wider px-3 py-1.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none ${
                                meta.license === 'Obtained' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' :
                                meta.license === 'In Progress' ? 'bg-blue-50 border border-blue-200 text-blue-700' :
                                'bg-slate-50 border border-slate-200 text-slate-600'
                              }`}
                            >
                              <option value="Not Started">Not Started</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Courses Completed">Courses Completed</option>
                              <option value="Obtained">Obtained</option>
                            </select>
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          
          {activeTab === 'Finance' && (
            <motion.div key="Finance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="max-w-6xl mx-auto space-y-6 pb-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center">
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">Total Revenue</p>
                  <p className="text-3xl font-medium text-slate-800">${realTotalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-emerald-500 font-medium mt-2 flex items-center"><TrendingUp size={12} className="mr-1" /> +14% from last month</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center">
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">Pending Payments</p>
                  <p className="text-3xl font-medium text-slate-800">$2,450</p>
                  <p className="text-xs text-amber-500 font-medium mt-2">12 students pending</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center">
                  <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">Expenses</p>
                  <p className="text-3xl font-medium text-slate-800">$840</p>
                  <p className="text-xs text-slate-400 font-medium mt-2">Fuel & Maintenance</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-400 flex flex-col justify-center text-white relative overflow-hidden">
                  <DollarSign className="absolute -right-4 -bottom-4 opacity-10" size={100} />
                  <p className="text-[11px] font-medium text-emerald-100 uppercase tracking-wider mb-2 relative z-10">Net Profit</p>
                  <p className="text-3xl font-bold relative z-10">${realNetProfit.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-medium text-slate-800">Team Management & Roles</h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">Assign roles to restrict access to sensitive data and segment responsibilities.</p>
                  </div>
                </div>

                {/* Role Explanations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <span className="bg-purple-100 text-purple-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded mb-2 inline-block">Owner / Manager</span>
                    <p className="text-xs text-slate-600 font-medium">Full access to Dashboard, Finance, Settings, and all student data. Can invite other members.</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded mb-2 inline-block">Secretary</span>
                    <p className="text-xs text-slate-600 font-medium">Access to Bookings, Planning, and Client Communication. No access to Finance or Settings.</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded mb-2 inline-block">Instructor</span>
                    <p className="text-xs text-slate-600 font-medium">Can only view their own assigned students and personal schedule. Cannot see overall revenue.</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded mb-2 inline-block">Accountant</span>
                    <p className="text-xs text-slate-600 font-medium">Access strictly limited to the Finance tab and earnings exports.</p>
                  </div>
                </div>

                {/* Add New Member Form */}
                <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 mb-8">
                  <h3 className="text-sm font-medium text-slate-800 mb-4">Invite New Member</h3>
                  <form onSubmit={handleAddMember} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        placeholder="colleague@damedrive.com"
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none" 
                      />
                    </div>
                    <div className="w-full md:w-64">
                      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Assign Role</label>
                      <select 
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                      >
                        <option value="Manager">Manager</option>
                        <option value="Secretary">Secretary</option>
                        <option value="Instructor">Instructor</option>
                        <option value="Accountant">Accountant</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all whitespace-nowrap">
                      Send Invite
                    </button>
                  </form>
                </div>

                {/* Active Team List */}
                <h3 className="text-sm font-medium text-slate-800 mb-4">Active Team Members</h3>
                <div className="space-y-3">
                  {teamMembers.map((member, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-white shadow-sm">
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{member.email}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{member.access}</p>
                      </div>
                      <span className={`${member.role === 'Admin' || member.role === 'Owner' || member.role === 'Manager' ? 'bg-purple-100 text-purple-700 border-purple-200' : member.role === 'Secretary' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'} font-bold uppercase tracking-wider text-[10px] px-3 py-1 rounded-full border`}>{member.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="text-xl font-medium text-slate-800">Recent Transactions</h2>
                  <button className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">Export CSV</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentTransactions.map((b, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-slate-500 whitespace-nowrap">{new Date(b.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-800 whitespace-nowrap">{b.name}</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-500">{b.package}</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-800 whitespace-nowrap">+${parseAmount(b.total_amount).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase px-2 py-1 rounded border border-emerald-100">Paid</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          
          {activeTab === 'History' && (
            <motion.div key="History" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="max-w-6xl mx-auto space-y-6 pb-12">
              <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex overflow-x-auto">
                {['Broadcasts', 'Data Extractions', 'Support Tickets'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setHistoryCategory(cat)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${historyCategory === cat ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-xl font-medium text-slate-800">{historyCategory} History</h2>
                </div>
                
                {historyCategory === 'Broadcasts' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date Sent</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Subject</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Audience</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 text-sm font-medium text-slate-500">Today, 09:41 AM</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-800">Winter Driving Tips</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-500">All Active Students (45)</td>
                          <td className="px-6 py-4"><span className="bg-emerald-50 text-emerald-600 text-[10px] uppercase font-bold px-2 py-1 rounded border border-emerald-100">Delivered</span></td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 text-sm font-medium text-slate-500">Aug 01, 2026</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-800">Schedule Update</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-500">Specific Group (12)</td>
                          <td className="px-6 py-4"><span className="bg-emerald-50 text-emerald-600 text-[10px] uppercase font-bold px-2 py-1 rounded border border-emerald-100">Delivered</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {historyCategory === 'Data Extractions' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date Extracted</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Requested By</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rows</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 text-sm font-medium text-slate-500">Yesterday, 14:22 PM</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-800">{userName}</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-500">Finance Report (CSV)</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-800">124</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {historyCategory === 'Support Tickets' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ticket ID</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Subject</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Client</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 text-sm font-medium text-slate-500">#TK-8902</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-800">Refund Request</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-500">John Doe</td>
                          <td className="px-6 py-4"><span className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold px-2 py-1 rounded border border-slate-200">Resolved</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            </motion.div>
          )}


          {activeTab === 'Settings' && (
            <motion.div key="Settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="max-w-3xl mx-auto space-y-6 pb-12">
              
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                <h2 className="text-xl font-medium text-slate-800 mb-6">System Settings</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Primary Admin Email</label>
                    <input type="email" disabled value="suporttest474@gmail.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed font-medium shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Booking Alerts Email</label>
                    <input type="email" defaultValue="suporttest474@gmail.com" className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm" />
                    <p className="text-xs text-slate-500 mt-2 font-medium">This is where Web3Forms sends new booking alerts.</p>
                  </div>
                  <div className="pt-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-xl transition-all shadow-md active:scale-95">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-medium text-slate-800">Team Management & Roles</h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">Assign roles to restrict access to sensitive data and segment responsibilities.</p>
                  </div>
                </div>

                {/* Role Explanations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <span className="bg-purple-100 text-purple-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded mb-2 inline-block">Owner / Manager</span>
                    <p className="text-xs text-slate-600 font-medium">Full access to Dashboard, Finance, Settings, and all student data. Can invite other members.</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded mb-2 inline-block">Secretary</span>
                    <p className="text-xs text-slate-600 font-medium">Access to Bookings, Planning, and Client Communication. No access to Finance or Settings.</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded mb-2 inline-block">Instructor</span>
                    <p className="text-xs text-slate-600 font-medium">Can only view their own assigned students and personal schedule. Cannot see overall revenue.</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded mb-2 inline-block">Accountant</span>
                    <p className="text-xs text-slate-600 font-medium">Access strictly limited to the Finance tab and earnings exports.</p>
                  </div>
                </div>

                {/* Add New Member Form */}
                <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 mb-8">
                  <h3 className="text-sm font-medium text-slate-800 mb-4">Invite New Member</h3>
                  <form onSubmit={handleAddMember} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        placeholder="colleague@damedrive.com"
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none" 
                      />
                    </div>
                    <div className="w-full md:w-64">
                      <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Assign Role</label>
                      <select 
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                      >
                        <option value="Manager">Manager</option>
                        <option value="Secretary">Secretary</option>
                        <option value="Instructor">Instructor</option>
                        <option value="Accountant">Accountant</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all whitespace-nowrap">
                      Send Invite
                    </button>
                  </form>
                </div>

                {/* Active Team List */}
                <h3 className="text-sm font-medium text-slate-800 mb-4">Active Team Members</h3>
                <div className="space-y-3">
                  {teamMembers.map((member, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-white shadow-sm">
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{member.email}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{member.access}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`${member.role === 'Admin' || member.role === 'Owner' || member.role === 'Manager' ? 'bg-purple-100 text-purple-700 border-purple-200' : member.role === 'Secretary' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'} font-bold uppercase tracking-wider text-[10px] px-3 py-1 rounded-full border`}>{member.role}</span>
                        {member.email !== 'koryobjectif@gmail.com' && (
                          <button onClick={() => handleRemoveMember(member.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Revoke</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>


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
                    <p className="text-sm font-medium text-slate-500 mb-4">Send targeted emails to specific client segments.</p>
                    <div className="flex gap-3 mb-4 flex-wrap">
                      <button className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors focus:ring-2 focus:ring-blue-400">All Pending ({pending})</button>
                      <button className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors focus:ring-2 focus:ring-emerald-400">All Completed ({bookings.filter(b => b.status === 'completed').length})</button>
                      <button className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors focus:ring-2 focus:ring-red-400">All Cancelled ({bookings.filter(b => b.status === 'cancelled').length})</button>
                      <button className="px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors focus:ring-2 focus:ring-slate-400">Search Individual...</button>
                    </div>
                    <div>
                      <input type="text" placeholder="Subject (e.g., Thank you for choosing us!)" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                      <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" rows="5" placeholder="Compose your message here..."></textarea>
                    </div>
                    <div className="flex gap-3">
                      <button className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors" onClick={() => setQuickActionModal({ isOpen: false, action: null })}>Cancel</button>
                      <button className="w-2/3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-md transition-colors" onClick={() => { alert('Emails sent successfully!'); setQuickActionModal({ isOpen: false, action: null }); }}>Send Emails</button>
                    </div>
                  </div>
                )}
                {quickActionModal.action === 'Export' && (
                  <div className="space-y-4 text-center">
                    <p className="text-sm font-medium text-slate-500 mb-4">Exporting {filteredBookings.length} booking records.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="py-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-medium hover:bg-emerald-100 transition-colors" onClick={() => { alert('Exporting to Excel...'); setQuickActionModal({ isOpen: false, action: null }); }}>Download Excel</button>
                      <button className="py-4 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition-colors" onClick={() => { alert('Exporting to CSV...'); setQuickActionModal({ isOpen: false, action: null }); }}>Download CSV</button>
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

## Fichier : src/components/AdminLogin.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    setEmail('');
    setPassword('');
    setError('');
    
    // Check for URL query errors (like unauthorized access from React)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('error') === 'unauthorized') {
      setError('Access Denied: Your email is not authorized. Please contact the administrator.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Check for URL hash errors (like unauthorized access from Postgres Trigger)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get('error_description')) {
      const decodedError = decodeURIComponent(hashParams.get('error_description').replace(/\+/g, ' '));
      setError(decodedError);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("getSession error:", error);
        setError(error.message);
      }
      if (session) {
        navigate('/admin');
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      if (event === 'SIGNED_IN' && session) {
        navigate('/admin');
      }
      if (event === 'PASSWORD_RECOVERY') {
        setError('Password recovery not implemented yet.');
      }
      if (event === 'USER_UPDATED') {
        console.log('User updated');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const [showPassword, setShowPassword] = useState(false);

  
  const handleOAuthLogin = async (provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/login`
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data.session) {
        navigate('/admin');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans overflow-hidden">
      {/* Dark Slate/Indigo Background matching the Dashboard aesthetic */}
      <div className="absolute inset-0 bg-slate-50 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] border-[0.5px] border-blue-100/50 rounded-full"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] border-[0.5px] border-blue-100/50 rounded-full"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1400px] h-[1400px] border-[0.5px] border-blue-100/50 rounded-full"></div>
        
        {/* Soft abstract glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[100px]"></div>
      </div>
      
      {/* Top Left Brand */}
      <div className="absolute top-6 left-6 flex items-center bg-white/80 border border-slate-100 backdrop-blur text-slate-800 px-3 py-1.5 rounded-xl shadow-sm">
        <div className="w-5 h-5 bg-blue-600 rounded mr-2 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-white rounded-sm transform rotate-45"></div>
        </div>
        <span className="font-bold text-sm tracking-tight">DameDrive</span>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[420px] relative z-10">
        <div className="bg-white/95 backdrop-blur-xl py-10 px-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[32px] border border-white/50">
          
          <div className="flex flex-col items-center mb-8">

            <h2 className="text-[22px] font-bold text-slate-900 tracking-tight mb-2">
              Sign in with email
            </h2>
            <p className="text-center text-[13px] text-slate-500 font-medium leading-relaxed max-w-[280px]">
              Sign in to DameDrive to bring your bookings, planning, and finance together. For free.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin} autoComplete="off">
            {error && (
              <div className="bg-red-50 text-red-600 text-xs font-medium p-3 rounded-xl border border-red-100 text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={16} className="text-slate-400" />
                </div>
                <input
                  type="email" autoComplete="off" name="dm_email_auth"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-[#f4f5f7] border-transparent rounded-[14px] text-[13px] font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 transition-all outline-none"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={16} className="text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password" name="dm_pwd_auth"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-3.5 bg-[#f4f5f7] border-transparent rounded-[14px] text-[13px] font-medium text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-100 transition-all outline-none"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-600 focus:outline-none">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1 pb-3">
              <a href="#" className="text-[12px] font-medium text-slate-500 hover:text-slate-800 transition-colors">
                Forgot password?
              </a>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-[14px] shadow-sm text-[14px] font-bold text-white bg-[#1a1b23] hover:bg-black focus:outline-none focus:ring-4 focus:ring-slate-200 transition-all disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Get Started'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100 border-dashed"></div>
              </div>
              <div className="relative flex justify-center text-[11px] font-medium uppercase tracking-widest text-slate-400">
                <span className="bg-white px-3">Or sign in with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button type="button" onClick={() => handleOAuthLogin('google')} className="flex justify-center items-center py-3 border border-slate-200 rounded-[14px] bg-white hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all duration-200">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>
              <button type="button" onClick={() => handleOAuthLogin('facebook')} className="flex justify-center items-center py-3 border border-slate-200 rounded-[14px] bg-white hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all duration-200">
                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </button>
              <button type="button" onClick={() => handleOAuthLogin('apple')} className="flex justify-center items-center py-3 border border-slate-200 rounded-[14px] bg-white hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all duration-200">
                 <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                   <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.74.887-1.99 1.49-2.96 1.49-.122 0-.243-.01-.355-.02.04-1.12.56-2.22 1.25-3.05.69-.83 1.83-1.42 2.87-1.52.03.11.04.22.04.33zM16.634 6.32c-1.34 0-2.61.85-3.32.85-.72 0-2.03-.84-3.18-.84-2.49 0-4.78 1.41-6.05 3.56-2.58 4.41-.66 10.96 1.85 14.54 1.23 1.76 2.68 3.72 4.6 3.72 1.85 0 2.54-1.11 4.79-1.11 2.22 0 2.9.11 4.78 1.11 1.95 0 3.3-1.85 4.51-3.6 1.42-2.04 2.01-4.02 2.04-4.12-.04-.02-3.88-1.46-3.88-5.91 0-3.72 3.09-5.48 3.23-5.56-1.74-2.51-4.45-2.84-5.41-2.91-1.63-.15-3.23.95-4.06.95z"/>
                 </svg>
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
```

## Fichier : src/context/AuthContext.jsx
```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ROLES, ROLE_PERMISSIONS } from '../config/roles';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(ROLES.OWNER); // Default to OWNER for development/testing
  const [permissions, setPermissions] = useState(ROLE_PERMISSIONS[ROLES.OWNER]);
  const [loading, setLoading] = useState(true);

  const verifyUserAccess = async (sessionUser) => {
    if (!sessionUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Always allow the main owner
    if (sessionUser.email === 'suporttest474@gmail.com' || sessionUser.email === 'koryobjectif@gmail.com') {
      setUser(sessionUser);
      setRole('Owner');
      setPermissions(ROLE_PERMISSIONS['Owner']);
      setLoading(false);
      return;
    }

    // Check database for invitation
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('email', sessionUser.email)
      .single();

    if (error || !data) {
      console.error('Access Denied: User not in invitations list');
      setUser(sessionUser);
      setRole('unauthorized');
      setPermissions([]);
      setLoading(false);
    } else {
      setUser(sessionUser);
      setRole(data.role);
      setPermissions(ROLE_PERMISSIONS[data.role] || []);
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      verifyUserAccess(session?.user || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      verifyUserAccess(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const setRoleOverride = (newRole) => {
    setRole(newRole);
    setPermissions(ROLE_PERMISSIONS[newRole] || []);
  };

  const hasPermission = (permission) => {
    if (role === ROLES.OWNER) return true; // Owner has all permissions implicitly
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, role, permissions, hasPermission, setRoleOverride, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

## Fichier : src/components/ProtectedRoute.jsx
```jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

const ProtectedRoute = ({ children }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center">Loading dashboard...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'unauthorized') {
    return (
      <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-lg p-8 text-center border border-slate-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-500 mb-8">
            Your email address is not authorized to view this dashboard. To gain access, please contact the administrator (suporttest474@gmail.com) to request an invitation.
          </p>
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = '/login';
            }}
            className="w-full bg-slate-900 hover:bg-black text-white font-medium py-3 px-4 rounded-xl transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
```

## Fichier : src/components/PermissionGuard.jsx
```jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

const PermissionGuard = ({ permission, children, fallback = null }) => {
  const { hasPermission } = useAuth();

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : null;
};

export default PermissionGuard;
```

## Fichier : src/config/roles.js
```jsx
export const ROLES = {
  OWNER: 'Owner',
  MANAGER: 'Manager',
  SECRETARY: 'Secretary',
  INSTRUCTOR: 'Instructor',
  ACCOUNTANT: 'Accountant',
  STANDARD_USER: 'Standard User',
};

// Granular permissions
export const PERMISSIONS = {
  // Students (Customers)
  STUDENTS_VIEW: 'students:view',
  STUDENTS_CREATE: 'students:create',
  STUDENTS_EDIT: 'students:edit',
  STUDENTS_DELETE: 'students:delete',
  STUDENTS_EXPORT: 'students:export',

  // Bookings
  BOOKINGS_VIEW: 'bookings:view',
  BOOKINGS_CREATE: 'bookings:create',
  BOOKINGS_EDIT: 'bookings:edit',
  BOOKINGS_CANCEL: 'bookings:cancel',
  BOOKINGS_EXPORT: 'bookings:export',

  // Finance/Payments
  PAYMENTS_VIEW: 'payments:view',
  PAYMENTS_RECORD: 'payments:record',
  PAYMENTS_REFUND: 'payments:refund',
  PAYMENTS_EXPORT: 'payments:export',
  INVOICES_CREATE: 'invoices:create',
  RECEIPTS_PRINT: 'receipts:print',

  // Reports
  REPORTS_VIEW: 'reports:view',
  REPORTS_DOWNLOAD: 'reports:download',

  // Admin & Settings
  USERS_MANAGE: 'users:manage',
  SETTINGS_EDIT: 'settings:edit',
  ROLES_MANAGE: 'roles:manage',
  INTEGRATIONS_MANAGE: 'integrations:manage',
  AUDIT_LOGS_VIEW: 'audit_logs:view',
  
  // Instructors
  LESSONS_VALIDATE: 'lessons:validate',
  LESSONS_NOTES: 'lessons:notes',
  STUDENT_PROGRESS: 'student:progress',
};

export const ROLE_PERMISSIONS = {
  [ROLES.OWNER]: Object.values(PERMISSIONS), // Owner gets all

  [ROLES.MANAGER]: [
    PERMISSIONS.STUDENTS_VIEW, PERMISSIONS.STUDENTS_CREATE, PERMISSIONS.STUDENTS_EDIT,
    PERMISSIONS.BOOKINGS_VIEW, PERMISSIONS.BOOKINGS_CREATE, PERMISSIONS.BOOKINGS_EDIT, PERMISSIONS.BOOKINGS_CANCEL,
    PERMISSIONS.REPORTS_VIEW, PERMISSIONS.INVOICES_CREATE,
  ],

  [ROLES.SECRETARY]: [
    PERMISSIONS.STUDENTS_VIEW, PERMISSIONS.STUDENTS_CREATE, PERMISSIONS.STUDENTS_EDIT,
    PERMISSIONS.BOOKINGS_VIEW, PERMISSIONS.BOOKINGS_CREATE,
    PERMISSIONS.PAYMENTS_RECORD, PERMISSIONS.RECEIPTS_PRINT,
  ],

  [ROLES.INSTRUCTOR]: [
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.LESSONS_VALIDATE, PERMISSIONS.LESSONS_NOTES, PERMISSIONS.STUDENT_PROGRESS,
  ],

  [ROLES.ACCOUNTANT]: [
    PERMISSIONS.PAYMENTS_VIEW, PERMISSIONS.PAYMENTS_REFUND, PERMISSIONS.PAYMENTS_EXPORT,
    PERMISSIONS.INVOICES_CREATE, PERMISSIONS.REPORTS_VIEW, PERMISSIONS.REPORTS_DOWNLOAD,
  ],

  [ROLES.STANDARD_USER]: [
    // Standard User permissions are empty by default, assigned manually
  ],
};
```

## Fichier : src/supabaseClient.js
```jsx
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

