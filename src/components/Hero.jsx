import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, Users, ArrowRight, Star } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-[90vh] flex flex-col items-center justify-center bg-[#0a0f1c]">
      {/* Background with abstract blurred gradients for a premium "startup" feel */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />
      
      {/* Optional faint grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNHYzLTVoM3YtM2gtM3YtM2gtM3YzaC0zdjNoM3YzaDN2LTN6IiBmaWxsPSIjMWUzYThhIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L2c+PC9zdmc+')] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center">
        
        {/* Top Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 tracking-wide uppercase">
            <Star size={14} className="fill-emerald-400" /> 5.0 Google Rating
          </span>
          <span className="w-1 h-1 bg-white/30 rounded-full mx-1"></span>
          <span className="text-xs text-slate-300 font-medium">Calgary's #1 Instructor</span>
        </motion.div>

        {/* Main Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto text-center flex flex-col items-center"
        >
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-8 leading-[1.05]">
            Pass Your Road Test <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
              Faster & Safer.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl font-medium">
            Experience premium driving lessons designed for modern learners. Build confidence behind the wheel with personalized, stress-free coaching.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-20 w-full max-w-md justify-center">
            <Link to="/services" className="group w-full sm:w-auto bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] hover:-translate-y-1 active:scale-95">
              Book Your First Lesson
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </motion.div>
      </div>

      {/* Floating Glassmorphism Stats Bar at the bottom */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-5xl mx-auto px-4"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 p-px rounded-3xl backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="bg-[#0a0f1c]/80 p-8 flex flex-col items-center justify-center text-center transition-colors hover:bg-[#0a0f1c]/60">
            <div className="text-white font-bold text-4xl mb-2 tracking-tight">500<span className="text-blue-400">+</span></div>
            <p className="text-sm text-slate-400 font-medium">Students Trained</p>
          </div>
          <div className="bg-[#0a0f1c]/80 p-8 flex flex-col items-center justify-center text-center transition-colors hover:bg-[#0a0f1c]/60">
            <div className="text-white font-bold text-4xl mb-2 tracking-tight">98<span className="text-emerald-400">%</span></div>
            <p className="text-sm text-slate-400 font-medium">Road Test Success</p>
          </div>
          <div className="bg-[#0a0f1c]/80 p-8 flex flex-col items-center justify-center text-center transition-colors hover:bg-[#0a0f1c]/60">
            <div className="text-white font-bold text-4xl mb-2 tracking-tight">15<span className="text-yellow-400">+</span></div>
            <p className="text-sm text-slate-400 font-medium">Years Experience</p>
          </div>
          <div className="bg-[#0a0f1c]/80 p-8 flex flex-col items-center justify-center text-center transition-colors hover:bg-[#0a0f1c]/60">
            <div className="text-white font-bold text-4xl mb-2 tracking-tight">5.0<span className="text-yellow-400">★</span></div>
            <p className="text-sm text-slate-400 font-medium">Average Rating</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
