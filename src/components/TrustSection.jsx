import React from 'react';
import { ShieldCheck, Award, MapPin, Car } from 'lucide-react';
import { motion } from 'framer-motion';

const TrustSection = () => {
  const trustItems = [
    {
      icon: <Award className="w-8 h-8 text-blue-600" />,
      title: "Ministry Approved",
      desc: "Fully certified BDE course provider in Alberta."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
      title: "High Pass Rate",
      desc: "98% of our students pass their road test on the first try."
    },
    {
      icon: <Car className="w-8 h-8 text-blue-600" />,
      title: "Modern Vehicles",
      desc: "Learn in safe, dual-controlled, late-model cars."
    },
    {
      icon: <MapPin className="w-8 h-8 text-blue-600" />,
      title: "Free Pick-up",
      desc: "Convenient pick-up and drop-off at home or school."
    }
  ];

  return (
    <section className="py-20 bg-white text-slate-900 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Why students choose us</h2>
          <p className="text-3xl font-black text-slate-900">Setting the standard for driving education.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-blue-100 hover:shadow-2xl transition-all duration-300 group flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                {React.cloneElement(item.icon, { className: "w-8 h-8 text-blue-600 group-hover:text-white transition-colors" })}
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-900">{item.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
