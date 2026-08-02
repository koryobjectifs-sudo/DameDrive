import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-12 md:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 md:p-12 border border-slate-100 shadow-xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            {/* Instructor Image */}
            <div className="relative mx-auto w-full max-w-sm">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-200">
                <img 
                  src="/instructor-real.png" 
                  alt="Instructor Portrait" 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white border-4 border-white shadow-lg hidden sm:flex">
                <div className="text-center">
                  <div className="text-2xl font-bold">15+</div>
                  <div className="text-xs uppercase tracking-wider font-semibold">Years</div>
                </div>
              </div>
            </div>

            {/* About Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Meet Your Instructor</h2>
              <h3 className="text-3xl font-extrabold text-slate-900 mb-6">Hi, I'm Alex. Let's get you on the road.</h3>
              
              <div className="space-y-4 text-slate-600 mb-8 leading-relaxed">
                <p>
                  With over a decade of professional driving instruction experience in Canada, I've helped hundreds of students transform from nervous beginners to confident, fully licensed drivers.
                </p>
                <p>
                  My teaching philosophy is simple: create a stress-free, patient, and highly structured environment where you feel completely safe making mistakes and learning from them. I specialize in teaching teenagers getting their first license, as well as new immigrants adapting to Canadian winter driving conditions.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm relative">
                <Quote className="absolute top-4 right-4 text-slate-100 w-12 h-12" />
                <p className="text-slate-900 font-medium italic relative z-10">
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
