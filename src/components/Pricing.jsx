import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ChevronDown, ChevronUp, Info } from 'lucide-react';

const Pricing = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedPackage, setExpandedPackage] = useState(null);

  useEffect(() => {
    if (window.location.hash === '#packages') setIsOpen(true);

    const handleHashChange = () => {
      setIsOpen(window.location.hash === '#packages');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setExpandedPackage(null); // Reset expansion on close
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(false);
    window.history.pushState('', document.title, window.location.pathname + window.location.search);
  };

  const plans = [
    {
      name: "Beginner Package",
      price: "50",
      description: "Quick refresher or get comfortable behind the wheel.",
      marketingText: "Tailored for absolute beginners and nervous drivers. Master vehicle control and basic road awareness in a low-pressure environment.",
      features: [
        "2 Hours Minimum",
        "Free Pick-up & Drop-off",
        "Basic Maneuvers",
        "Dual-control Vehicle"
      ],
      popular: false
    },
    {
      name: "Comprehensive Plan",
      price: "45",
      description: "Our most popular package for students preparing for their test.",
      marketingText: "Our signature curriculum. Dive deep into complex traffic scenarios, highway driving, and parallel parking to become fully equipped for everyday driving.",
      features: [
        "6 Hours Minimum",
        "Free Pick-up & Drop-off",
        "Highway & City Driving",
        "Mock Road Test",
        "Priority Scheduling"
      ],
      popular: true
    },
    {
      name: "Road Test Ready",
      price: "40",
      description: "Complete journey from beginner to licensed driver.",
      marketingText: "The ultimate solution guaranteeing maximum supervised road time. Includes night/winter driving and use of our car for your actual road test.",
      features: [
        "10 Hours Minimum",
        "Free Pick-up & Drop-off",
        "Winter & Night Driving",
        "Use of Car for Road Test",
        "Guaranteed Pass Support"
      ],
      popular: false
    }
  ];

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
            className="relative w-full max-w-4xl bg-slate-50 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="relative z-10 flex flex-col items-center justify-center p-6 border-b border-slate-100 bg-white shrink-0">
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2 leading-tight text-center">Choose Your Journey</h3>
              <p className="text-sm text-slate-600 max-w-lg text-center">
                Select the package that fits your goals.
              </p>
            </div>

            {/* Scrollable Body */}
            <div className="relative z-10 p-4 md:p-6 overflow-y-auto">
              <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
                {plans.map((plan, idx) => (
                  <div
                    key={idx}
                    className={`bg-white rounded-2xl p-5 border shadow-lg relative flex flex-col transition-all ${
                      plan.popular ? 'border-primary ring-2 ring-primary/20 lg:-translate-y-2' : 'border-slate-100'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-md">
                        Most Popular
                      </div>
                    )}
                    
                    <h4 className="text-lg font-bold text-slate-900 mb-1">{plan.name}</h4>
                    <p className="text-slate-500 text-xs mb-4 h-8 leading-tight">{plan.description}</p>
                    
                    <div className="mb-4">
                      <span className="text-3xl font-extrabold text-slate-900">${plan.price}</span>
                      <span className="text-slate-500 font-medium text-sm">/Hour</span>
                    </div>

                    {/* Highly Visible Expandable Button */}
                    <div className="mb-5 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                      <button 
                        onClick={() => setExpandedPackage(expandedPackage === idx ? null : idx)}
                        className={`w-full flex items-center justify-between p-2.5 text-xs font-bold transition-colors ${
                          expandedPackage === idx 
                          ? 'bg-primary text-white' 
                          : 'bg-primary/5 text-primary hover:bg-primary/10'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Info size={14} />
                          WHY CHOOSE THIS?
                        </span>
                        {expandedPackage === idx ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      
                      <AnimatePresence>
                        {expandedPackage === idx && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-slate-50"
                          >
                            <p className="p-3 text-xs text-slate-700 leading-relaxed border-t border-slate-100">
                              {plan.marketingText}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <ul className="space-y-3 mb-6 flex-grow">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 text-slate-700">
                          <div className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                            <Check size={10} strokeWidth={3} />
                          </div>
                          <span className="text-xs font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <a 
                      href="#book"
                      onClick={() => closeModal()}
                      className={`w-full py-3 rounded-lg text-sm text-center font-bold transition-all shadow-sm mt-auto ${
                        plan.popular 
                          ? 'bg-primary hover:bg-primary-dark text-white' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                      }`}
                    >
                      Book This
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Pricing;
