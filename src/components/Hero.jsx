import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Clock, Users } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-100 to-white">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl"></div>
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent-hover font-medium text-sm mb-6 border border-accent/20">
              <Star size={14} className="fill-accent text-accent" />
              <span>5.0 Google Rating (200+ Reviews)</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
              Pass Your Road Test With <span className="text-primary">Confidence.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed">
              Professional, patient, and comprehensive driving lessons tailored to you. Get behind the wheel with Canada's top-rated driving instructor.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10 lg:mb-0">
            <a href="#book" className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-primary/20 active:scale-95 text-center flex items-center justify-center gap-2">
              Book First Lesson
            </a>
            <a href="#packages" className="bg-white/80 hover:bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-md active:scale-95 text-center flex items-center justify-center gap-2 backdrop-blur-sm">
              Explore Packages
            </a>
          </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200">
              <div>
                <div className="flex items-center gap-2 text-primary font-bold text-2xl mb-1">
                  <Users size={20} />
                  <span>500+</span>
                </div>
                <p className="text-sm text-slate-500 font-medium">Students Trained</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-primary font-bold text-2xl mb-1">
                  <ShieldCheck size={20} />
                  <span>98%</span>
                </div>
                <p className="text-sm text-slate-500 font-medium">Pass Rate</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-primary font-bold text-2xl mb-1">
                  <Clock size={20} />
                  <span>15+</span>
                </div>
                <p className="text-sm text-slate-500 font-medium">Years Experience</p>
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
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white border border-slate-100/50 aspect-[4/5] sm:aspect-square">
              <img 
                src="/hero-image-real.jpg" 
                alt="Driving Instructor teaching a student" 
                fetchpriority="high"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-4 hidden sm:flex">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Ministry Approved</p>
                <p className="text-xs text-slate-500">Fully Licensed Instructor</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
