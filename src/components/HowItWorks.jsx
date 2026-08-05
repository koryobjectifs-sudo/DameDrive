import React from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Route, Car } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      num: "1",
      title: "Book Online",
      desc: "Select your package and choose a time that fits your schedule in seconds.",
      icon: <CalendarCheck className="w-8 h-8 text-blue-600" />
    },
    {
      num: "2",
      title: "Hit the Road",
      desc: "Learn from patient, certified instructors in our modern dual-controlled vehicles.",
      icon: <Car className="w-8 h-8 text-blue-600" />
    },
    {
      num: "3",
      title: "Get Licensed",
      desc: "Pass your road test with confidence and become a safe driver for life.",
      icon: <Route className="w-8 h-8 text-blue-600" />
    }
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-white text-slate-900 relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-[0.25em] mb-4">How It Works</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Your Journey to Independence</h3>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">We've streamlined the process so you can focus on what matters: learning to drive.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-16 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-[4.5rem] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col items-center text-center group"
            >
              <div className="w-32 h-32 mb-8 relative flex items-center justify-center">
                {/* Background circle that scales on hover */}
                <div className="absolute inset-0 bg-slate-50 rounded-full scale-100 group-hover:scale-110 transition-transform duration-500 ease-out border border-slate-100 shadow-sm" />
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-md">
                  {step.icon}
                </div>
                {/* Number Badge */}
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg border-4 border-white shadow-lg">
                  {step.num}
                </div>
              </div>
              
              <h4 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-blue-600 transition-colors">{step.title}</h4>
              <p className="text-slate-500 leading-relaxed font-medium text-lg max-w-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
