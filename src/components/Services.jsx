import React from 'react';
import { motion } from 'framer-motion';
import { Key, Route, Navigation, FileCheck, Snowflake, MapPin } from 'lucide-react';

const Services = () => {
  const services = [
    {
      title: "Beginner Lessons",
      desc: "Comprehensive step-by-step curriculum for complete beginners.",
      icon: <Key className="w-6 h-6" />
    },
    {
      title: "Road Test Preparation",
      desc: "Mock tests and route practice to guarantee you pass first time.",
      icon: <FileCheck className="w-6 h-6" />
    },
    {
      title: "Highway Driving",
      desc: "Build confidence merging, passing, and navigating busy highways.",
      icon: <Navigation className="w-6 h-6" />
    },
    {
      title: "Parking Practice",
      desc: "Master parallel, reverse, and forward parking with easy reference points.",
      icon: <MapPin className="w-6 h-6" />
    },
    {
      title: "Winter Driving",
      desc: "Essential skills for safe handling in snow and icy Canadian conditions.",
      icon: <Snowflake className="w-6 h-6" />
    },
    {
      title: "Refresher Courses",
      desc: "Brush up your skills or adapt to Canadian driving rules for immigrants.",
      icon: <Route className="w-6 h-6" />
    }
  ];

  return (
    <section id="services" className="py-12 md:py-16 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Our Packages</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Tailored Driving Lessons</h3>
          <p className="text-slate-600 text-lg">Whether you're starting from scratch or just need a quick refresher before your road test, we have a plan for you.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110 duration-500"></div>
              
              <div className="w-12 h-12 bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors relative z-10">
                {service.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3 relative z-10">{service.title}</h4>
              <p className="text-slate-600 relative z-10 leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
