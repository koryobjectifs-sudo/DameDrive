import React, { useState, useEffect } from 'react';
import { Send, Clock, User, Phone, Mail, X, CreditCard, CheckCircle2, Plus, Trash2, Calendar, Loader2, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { supabase } from '../supabaseClient';

const PRICES = {
  beginner: { name: 'Beginner Package', price: 50 },
  comprehensive: { name: 'Comprehensive Plan', price: 45 },
  roadtest: { name: 'Road Test Ready', price: 40 },
};

const Booking = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'comprehensive',
    message: '',
    sessions: [{ date: '', hours: '2' }]
  });

  useEffect(() => {
    if (window.location.hash === '#book') setIsOpen(true);

    const handleHashChange = () => {
      setIsOpen(window.location.hash === '#book');
      if (window.location.hash !== '#book') {
        setIsSubmitted(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Robust reset whenever modal closes
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: 'comprehensive',
          message: '',
          sessions: [{ date: '', hours: '2' }]
        });
      }, 300);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: 'comprehensive',
        message: '',
        sessions: [{ date: '', hours: '2' }]
      });
    }, 300);
    window.history.pushState('', document.title, window.location.pathname + window.location.search);
  };

  const handleSessionChange = (index, field, value) => {
    const newSessions = [...formData.sessions];
    newSessions[index][field] = value;
    setFormData({ ...formData, sessions: newSessions });
  };

  const addSession = () => {
    setFormData({ ...formData, sessions: [...formData.sessions, { date: '', hours: '2' }] });
  };

  const removeSession = (index) => {
    if (formData.sessions.length > 1) {
      const newSessions = formData.sessions.filter((_, i) => i !== index);
      setFormData({ ...formData, sessions: newSessions });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const estimatedHours = formData.sessions.reduce((sum, session) => sum + (parseInt(session.hours) || 0), 0);
  const basePrice = PRICES[formData.service].price;
  const totalAmount = basePrice * estimatedHours;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const sessionsList = formData.sessions.map((s, i) => `Session ${i + 1}: ${s.date} (${s.hours} Hours)`).join('\n');
    
    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        await supabase.from('bookings').insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          package: PRICES[formData.service].name,
          estimated_hours: estimatedHours,
          total_amount: `$${totalAmount}`,
          message: formData.message,
          sessions: sessionsList,
          status: 'pending'
        }]);
      }

      const payload = {
        access_key: "e63b90a6-896e-47d7-a926-e5987e56e515",
        subject: `New Booking Request from ${formData.name}`,
        from_name: "DameDrive Booking",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        package: PRICES[formData.service].name,
        estimated_hours: estimatedHours,
        total_amount: `$${totalAmount}`,
        message: formData.message,
        sessions: sessionsList
      };

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.success) {
        confetti({ particleCount: 200, spread: 120, origin: { y: 0.4 }, zIndex: 9999, colors: ['#0f172a', '#3b82f6', '#ffffff'] });
        setIsSubmitted(true);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          ></motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col transition-all duration-300 ${isSubmitted ? 'max-w-md' : 'max-w-4xl'}`}
          >
            {!isSubmitted && (
              <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900">Secure Your Spot</h3>
                  <p className="text-xs md:text-sm text-slate-500 mt-1">Select your dates and hours below to build your schedule.</p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-300 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            <div className={`overflow-y-auto ${!isSubmitted ? 'p-5 md:p-8' : 'p-8'}`}>
              {!isSubmitted ? (
                <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                  <form id="booking-form" onSubmit={handleSubmit} className="space-y-4 md:space-y-5 flex-grow">
                    {error && (
                      <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-100">
                        {error}
                      </div>
                    )}
                    <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                        <div className="relative">
                          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full pl-9 pr-3 py-2.5 md:py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/50 text-sm" placeholder="John Doe" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-9 pr-3 py-2.5 md:py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/50 text-sm" placeholder="+221 78 158 27 40" />
                        </div>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-9 pr-3 py-2.5 md:py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/50 text-sm" placeholder="john@example.com" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Package</label>
                        <select name="service" value={formData.service} onChange={handleChange} className="w-full px-3 py-2.5 md:py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/50 text-sm font-medium">
                          <option value="beginner">Beginner Package ($50/hr)</option>
                          <option value="comprehensive">Comprehensive Plan ($45/hr)</option>
                          <option value="roadtest">Road Test Ready ($40/hr)</option>
                        </select>
                      </div>
                    </div>
                    <hr className="border-slate-100 my-6" />
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-bold text-slate-900">Schedule Your Sessions</label>
                        <span className="text-xs text-slate-500 font-medium">{formData.sessions.length} Session(s)</span>
                      </div>
                      <div className="space-y-3">
                        <AnimatePresence>
                          {formData.sessions.map((session, index) => (
                            <motion.div key={index} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-start sm:items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 flex-col sm:flex-row">
                              <div className="relative flex-grow w-full sm:w-auto">
                                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input required type="date" value={session.date} onChange={(e) => handleSessionChange(index, 'date', e.target.value)} className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/50 text-sm shadow-sm" />
                              </div>
                              <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="relative flex-grow">
                                  <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                  <select value={session.hours} onChange={(e) => handleSessionChange(index, 'hours', e.target.value)} className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/50 text-sm font-medium shadow-sm appearance-none">
                                    <option value="1">1 Hour</option>
                                    <option value="2">2 Hours</option>
                                    <option value="3">3 Hours</option>
                                    <option value="4">4 Hours</option>
                                  </select>
                                </div>
                                {formData.sessions.length > 1 && (
                                  <button type="button" onClick={() => removeSession(index)} className="w-9 h-9 shrink-0 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                      <button type="button" onClick={addSession} className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-300 text-slate-500 hover:border-primary hover:text-primary hover:bg-primary/5 rounded-xl text-sm font-bold transition-all">
                        <Plus size={16} />
                        Add Another Session
                      </button>
                    </div>
                    <hr className="border-slate-100 my-6" />
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Specific Goals or Notes</label>
                      <textarea name="message" value={formData.message} onChange={handleChange} rows="2" className="w-full px-3 py-2.5 md:py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/50 text-sm resize-none" placeholder="Tell us about your driving experience or specific goals..."></textarea>
                    </div>
                  </form>
                  <div className="lg:w-80 shrink-0">
                    <div className="bg-slate-900 rounded-2xl p-6 text-white sticky top-0 shadow-xl border border-slate-800">
                      <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                        <CreditCard size={18} className="text-primary" />
                        Booking Summary
                      </h4>

                      <div className="space-y-3 text-sm border-b border-slate-700 pb-5 mb-5">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Package:</span>
                          <span className="font-medium text-right">{PRICES[formData.service].name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Hourly Rate:</span>
                          <span className="font-medium">${basePrice}</span>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="text-slate-400">Schedule:</span>
                          <div className="text-right flex flex-col items-end">
                            <span className="font-medium text-primary-light bg-primary/20 px-2 py-0.5 rounded text-xs mb-1">
                              {formData.sessions.length} {formData.sessions.length === 1 ? 'Session' : 'Sessions'}
                            </span>
                            <span className="font-bold">{estimatedHours} Total Hours</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-end mb-6">
                        <span className="text-slate-400 text-sm">Estimated Total</span>
                        <span className="text-3xl font-extrabold text-white">${totalAmount}</span>
                      </div>

                      <button
                        form="booking-form" type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:bg-primary/70 text-white text-base font-bold py-4 rounded-xl transition-all active:scale-95 shadow-md shadow-primary/30"
                      >
                        {isSubmitting ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Send size={18} />
                        )}
                        {isSubmitting ? 'Processing...' : 'Complete Booking'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-6">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm border-8 border-green-50">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Booking Confirmed!</h3>
                  <p className="text-sm text-slate-600 mb-8 leading-relaxed max-w-sm">
                    Thank you, <strong className="text-slate-900">{formData.name}</strong>! Your email has been verified and your request has been securely submitted. 
                    We will contact you shortly to confirm your schedule.
                  </p>

                  <button
                    onClick={closeModal}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-bold py-3.5 rounded-xl shadow-sm transition-colors"
                  >
                    Got it, thanks!
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Booking;
