import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ChevronDown, ChevronUp, Info } from 'lucide-react';

const Pricing = () => {
  const [expandedPackage, setExpandedPackage] = useState(null);

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
    <section className="py-12 md:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-200 pb-8">
          <div className="max-w-2xl">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Pricing</h2>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-0 tracking-tight">Choose Your Journey</h3>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-3xl p-5 md:p-6 border shadow-xl relative flex flex-col transition-all ${
                plan.popular ? 'border-primary ring-2 ring-primary/20 lg:-translate-y-2' : 'border-slate-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-md">
                  Most Popular
                </div>
              )}
              
              <h4 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h4>
              <p className="text-slate-500 text-sm mb-6 h-10 leading-tight">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-3xl font-black text-slate-900">${plan.price}</span>
                <span className="text-slate-500 font-medium text-sm">/Hour</span>
              </div>

              <div className="mb-6 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                <button 
                  onClick={() => setExpandedPackage(expandedPackage === idx ? null : idx)}
                  className={`w-full flex items-center justify-between p-3 text-sm font-bold transition-colors ${
                    expandedPackage === idx 
                    ? 'bg-primary text-white' 
                    : 'bg-primary/5 text-primary hover:bg-primary/10'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Info size={16} />
                    WHY CHOOSE THIS?
                  </span>
                  {expandedPackage === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                
                <AnimatePresence>
                  {expandedPackage === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-slate-50"
                    >
                      <p className="p-4 text-sm text-slate-700 leading-relaxed border-t border-slate-100">
                        {plan.marketingText}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3 text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <a 
                href="/#book"
                className={`w-full py-4 rounded-xl text-base text-center font-bold transition-all shadow-md mt-auto ${
                  plan.popular 
                    ? 'bg-primary hover:bg-primary-dark text-white shadow-primary/30 hover:-translate-y-1' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900 hover:-translate-y-1'
                }`}
              >
                Book This Package
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
