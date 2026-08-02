import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Clock, Users } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-[#0A0F1C]">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-yellow-500/10 blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-slate-300 font-medium text-sm mb-8 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span>5.0 Google Rating (200+ Reviews)</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
              Learn to Drive <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                With Confidence.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed max-w-xl">
              Professional, patient, and comprehensive driving lessons tailored to you. Get behind the wheel with Canada's top-rated driving instructor.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12 lg:mb-0">
            <a href="#booking" className="bg-white hover:bg-slate-100 text-[#0A0F1C] px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95 text-center flex items-center justify-center gap-2">
              Book First Lesson
            </a>
            <a href="#packages" className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all border border-white/10 backdrop-blur-sm active:scale-95 text-center flex items-center justify-center gap-2">
              Explore Packages
            </a>
          </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/10">
              <div>
                <div className="flex items-center gap-2 text-white font-bold text-3xl mb-1">
                  <span>500+</span>
                </div>
                <p className="text-sm text-slate-400 font-medium flex items-center gap-1.5"><Users size={14} className="text-blue-400"/> Students</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-white font-bold text-3xl mb-1">
                  <span>98%</span>
                </div>
                <p className="text-sm text-slate-400 font-medium flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-400"/> Pass Rate</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-white font-bold text-3xl mb-1">
                  <span>15+</span>
                </div>
                <p className="text-sm text-slate-400 font-medium flex items-center gap-1.5"><Clock size={14} className="text-yellow-400"/> Years Exp</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:ml-auto w-full max-w-lg mx-auto"
          >
            {/* Main Image Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 aspect-[4/5] sm:aspect-[4/4] group">
              <div className="absolute inset-0 bg-[#0A0F1C]/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop" 
                alt="Premium driving lessons" 
                fetchpriority="high"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-8 -left-8 bg-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-4 hidden sm:flex transform hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/30">
                <ShieldCheck size={28} />
              </div>
              <div>
                <p className="text-base font-bold text-white">Ministry Approved</p>
                <p className="text-sm text-slate-300">Fully Licensed Instructor</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
