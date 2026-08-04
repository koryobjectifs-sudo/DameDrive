import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, Users } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative py-12 lg:py-16 overflow-hidden min-h-[70vh] flex items-center">
      {/* Full Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-image-real.jpg" 
          alt="Premium Driving Instruction" 
          fetchpriority="high"
          decoding="async"
          className="w-full h-full object-cover object-center opacity-90"
        />
        {/* Cinematic dark overlay for pure luxury and perfect readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-slate-900/70 to-[#0A0F1C]/95"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center flex flex-col items-center"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-6 leading-[1.05] drop-shadow-xl">
            Learn to Drive <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              With Confidence.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-200 mb-10 leading-relaxed max-w-2xl font-light">
            Professional, patient, and comprehensive driving lessons tailored to you. Get behind the wheel with Canada's top-rated driving instructor.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-14 w-full max-w-sm">
            <Link to="/services" className="w-full bg-white text-[#0A0F1C] px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] hover:-translate-y-1 active:scale-95 text-center">
              Explore Packages
            </Link>
          </div>

          {/* Quick Stats - Centered */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 pt-10 border-t border-white/10 w-full max-w-4xl">
            <div className="flex flex-col items-center">
              <div className="text-white font-black text-3xl mb-1 tracking-tight drop-shadow-md">500+</div>
              <p className="text-sm text-slate-400 font-medium flex items-center gap-2"><Users size={14} className="text-blue-400"/> Students</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-white font-black text-3xl mb-1 tracking-tight drop-shadow-md">98%</div>
              <p className="text-sm text-slate-400 font-medium flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-400"/> Pass Rate</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-white font-black text-3xl mb-1 tracking-tight drop-shadow-md">15+</div>
              <p className="text-sm text-slate-400 font-medium flex items-center gap-2"><Clock size={14} className="text-yellow-400"/> Years Exp</p>
            </div>
            {/* Ministry Approved embedded directly into the stats row for a sleek layout */}
            <div className="flex flex-col items-center justify-center sm:border-l sm:border-white/10 sm:pl-6">
              <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/30 mb-2">
                <ShieldCheck size={20} />
              </div>
              <p className="text-xs font-bold text-white uppercase tracking-wider text-center">Ministry<br/>Approved</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
