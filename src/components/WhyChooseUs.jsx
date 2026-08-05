import React from 'react';
import { Award, Calendar, Shield, Car, User, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const WhyChooseUs = () => {
  const benefits = [
    { title: "Ministry Approved", desc: "Professional, fully certified instruction.", icon: <Award className="w-5 h-5" /> },
    { title: "Flexible Scheduling", desc: "Lesson plans built around your life.", icon: <Calendar className="w-5 h-5" /> },
    { title: "Safety First", desc: "Safe, dual-controlled learning environment.", icon: <Shield className="w-5 h-5" /> },
    { title: "Exam Ready", desc: "Real preparation and mock tests.", icon: <Car className="w-5 h-5" /> },
    { title: "Patient Coaching", desc: "Personalized support for nervous drivers.", icon: <User className="w-5 h-5" /> },
    { title: "Convenient", desc: "Pick-up and drop-off included.", icon: <MapPin className="w-5 h-5" /> }
  ];

  return (
    <section className="py-12 md:py-16 bg-white overflow-hidden text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:ml-auto w-full max-w-lg mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white border border-slate-100/50 aspect-square">
              <img 
                src="/why-choose-us-real.jpg" 
                alt="Student celebrating getting license with instructor" 
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>
            {/* Decoration */}
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Why Choose Us</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight text-slate-900">More than just a driving school.</h3>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              We don't just teach you how to pass a test. We build safe, confident, and defensive drivers for life through premium, personalized instruction.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{benefit.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
