import React from 'react';
import { Award, Calendar, Car, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const TrustSection = () => {
  const badges = [
    { icon: <Award className="w-6 h-6" />, title: "Certified Instructor", desc: "Ministry approved" },
    { icon: <Calendar className="w-6 h-6" />, title: "Flexible Scheduling", desc: "Fits your life" },
    { icon: <Car className="w-6 h-6" />, title: "Modern Vehicles", desc: "Dual-controlled" },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Patient Coaching", desc: "Learn safely" },
  ];

  return (
    <section className="relative z-20 -mt-16 sm:-mt-12 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-emerald-50/50 opacity-50"></div>
        {badges.map((badge, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 + (idx * 0.1) }}
            className="flex items-center gap-5 px-2 lg:px-8 w-full justify-center md:justify-start py-4 md:py-0 relative z-10 group"
          >
            <motion.div 
              className="w-14 h-14 shrink-0 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300"
              animate={{ y: [0, -8, 0] }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: idx * 0.5
              }}
            >
              {badge.icon}
            </motion.div>
            <div className="text-left">
              <h4 className="font-bold text-slate-900 text-sm lg:text-base leading-tight">{badge.title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{badge.desc}</p>
            </div>
          </motion.div>
        ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
