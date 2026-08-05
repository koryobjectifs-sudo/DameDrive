import React from 'react';
import { Award, Calendar, Shield, Car, User, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const WhyChooseUs = () => {
  const benefits = [
    { title: "Ministry Approved", desc: "Professional, fully certified instruction.", icon: <Award className="w-6 h-6" /> },
    { title: "Flexible Scheduling", desc: "Lesson plans built around your life.", icon: <Calendar className="w-6 h-6" /> },
    { title: "Safety First", desc: "Safe, dual-controlled learning environment.", icon: <Shield className="w-6 h-6" /> },
    { title: "Exam Ready", desc: "Real preparation and mock tests.", icon: <Car className="w-6 h-6" /> },
    { title: "Patient Coaching", desc: "Personalized support for nervous drivers.", icon: <User className="w-6 h-6" /> },
    { title: "Convenient", desc: "Pick-up and drop-off included.", icon: <MapPin className="w-6 h-6" /> }
  ];

  return (
    <section className="py-24 md:py-32 bg-[#0a0f1c] overflow-hidden text-white relative">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-[0.25em] mb-4">Why Choose Us</h2>
            <h3 className="text-4xl md:text-5xl font-black mb-6 leading-[1.1] text-white">More than just a <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">driving school.</span></h3>
            <p className="text-lg md:text-xl text-slate-400 mb-12 leading-relaxed font-medium">
              We don't just teach you how to pass a test. We build safe, confident, and defensive drivers for life through premium, personalized instruction.
            </p>

            <div className="grid sm:grid-cols-2 gap-8">
              {benefits.map((benefit, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex gap-4 group"
                >
                  <div className="mt-1 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-lg">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors text-lg">{benefit.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative order-1 lg:order-2 w-full max-w-lg mx-auto"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-[0_0_60px_rgba(37,99,235,0.15)] bg-slate-900 border border-white/10 aspect-[4/5]">
              <img 
                src="/why-choose-us-real.jpg" 
                alt="Student celebrating getting license with instructor" 
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 cursor-pointer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-[#0a0f1c]/20 to-transparent"></div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
