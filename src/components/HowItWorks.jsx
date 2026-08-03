import React from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Route, Car } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      title: "Book Your Slot",
      desc: "Choose a time that works for you using our simple online booking system.",
      icon: <CalendarCheck className="w-8 h-8 text-primary" />
    },
    {
      num: "02",
      title: "Hit the Road",
      desc: "Learn from patient, certified instructors in our modern dual-controlled vehicles.",
      icon: <Car className="w-8 h-8 text-primary" />
    },
    {
      num: "03",
      title: "Get Licensed",
      desc: "Pass your road test with confidence and become a safe driver for life.",
      icon: <Route className="w-8 h-8 text-primary" />
    }
  ];

  return (
    <section id="how-it-works" className="py-12 md:py-16 bg-white text-slate-900 relative overflow-hidden">
      {/* Decorative dots pattern (light theme) */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-slate-100 pb-8">
          <div className="max-w-2xl">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Simple Process</h2>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-0 tracking-tight">Your Journey to Independence</h3>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="relative group"
            >
              {/* Massive background number */}
              <div className="text-8xl md:text-9xl font-black text-slate-100 absolute -top-12 -left-4 md:-left-8 -z-10 transition-transform group-hover:-translate-y-2">
                {step.num}
              </div>
              
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-primary/20">
                {step.icon}
              </div>
              
              <h4 className="text-2xl font-bold mb-4">{step.title}</h4>
              <p className="text-slate-600 leading-relaxed text-lg">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
