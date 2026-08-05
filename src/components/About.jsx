import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          
          {/* Subtle Decorative Gradient */}
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[50%] bg-blue-600/5 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
            {/* Instructor Image */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto w-full max-w-md"
            >
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl bg-slate-200 relative group">
                <img 
                  src="/instructor-real.png" 
                  alt="Instructor Portrait" 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white rounded-full flex flex-col items-center justify-center text-slate-900 shadow-2xl border-8 border-[#f8fafc] hidden sm:flex">
                <div className="text-5xl font-black text-blue-600 tracking-tighter">15<span className="text-emerald-400">+</span></div>
                <div className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400 mt-1">Years</div>
              </div>
            </motion.div>

            {/* About Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-[0.25em] mb-4">Meet Your Instructor</h2>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
                Hi, I'm Alex. <br className="hidden md:block"/>Let's get you on the road.
              </h3>
              
              <div className="space-y-6 text-slate-500 mb-10 leading-relaxed font-medium text-lg">
                <p>
                  With over a decade of professional driving instruction experience in Canada, I've helped hundreds of students transform from nervous beginners to confident, fully licensed drivers.
                </p>
                <p>
                  My teaching philosophy is simple: create a stress-free, patient, and highly structured environment where you feel completely safe making mistakes and learning from them. I specialize in teaching teenagers getting their first license, as well as new immigrants adapting to Canadian driving conditions.
                </p>
              </div>

              <div className="bg-[#f8fafc] p-8 rounded-3xl border border-slate-200/50 relative shadow-sm">
                <Quote className="absolute top-6 right-6 text-slate-200 w-16 h-16" />
                <p className="text-slate-700 font-bold italic relative z-10 text-xl leading-snug pr-8">
                  "Driving is independence. My mission is to ensure every student not only passes their test, but becomes a defensive, safe driver for the rest of their life."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
