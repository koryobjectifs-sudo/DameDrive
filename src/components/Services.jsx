import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Clock, Map } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const packages = [
    {
      title: "Beginner's Package",
      desc: "Perfect for new drivers starting from scratch.",
      price: "$599",
      hours: "10 Hours",
      features: ["Basic maneuvers", "Parking fundamentals", "City driving intro", "Dual-control car"],
      icon: <Clock className="w-6 h-6" />,
      image: "/beginner_lessons_hero_1785788722912.png"
    },
    {
      title: "Road Test Prep",
      desc: "Intensive preparation for your upcoming exam.",
      price: "$299",
      hours: "4 Hours",
      features: ["Mock road test", "Route familiarization", "Parallel parking", "Test car rental included"],
      icon: <Shield className="w-6 h-6" />,
      image: "/road_test_prep_hero_1785788750511.png",
      popular: true
    },
    {
      title: "Winter Driving",
      desc: "Master driving in harsh Canadian winter conditions.",
      price: "$349",
      hours: "5 Hours",
      features: ["Skid control", "Braking techniques", "Black ice awareness", "Emergency handling"],
      icon: <Map className="w-6 h-6" />,
      image: "/winter_driving_hero_1785788828096.png"
    }
  ];

  return (
    <section id="services" className="py-24 md:py-32 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-[0.25em] mb-4">Our Services</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Tailored instruction for every driver.</h3>
          <p className="text-slate-500 text-lg md:text-xl font-medium">Choose the package that fits your needs. We provide patient, professional coaching whether you're a complete beginner or need a quick refresher.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {packages.map((pkg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={`relative bg-white rounded-[2rem] overflow-hidden border ${pkg.popular ? 'border-blue-500 shadow-2xl shadow-blue-500/20' : 'border-slate-200 shadow-xl shadow-slate-200/50'} flex flex-col group`}
            >
              {pkg.popular && (
                <div className="absolute top-6 right-6 z-20 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              {/* Image Header with Glassmorphism Icon */}
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img 
                  src={pkg.image} 
                  alt={pkg.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" 
                />
                <div className="absolute bottom-[-24px] left-8 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-blue-600 shadow-lg z-20 border border-white/20">
                  {pkg.icon}
                </div>
              </div>

              <div className="p-8 pt-12 flex-grow flex flex-col">
                <h4 className="text-2xl font-black text-slate-900 mb-2">{pkg.title}</h4>
                <p className="text-slate-500 font-medium mb-6">{pkg.desc}</p>
                
                <div className="flex items-end gap-2 mb-8">
                  <span className="text-4xl font-black text-slate-900">{pkg.price}</span>
                  <span className="text-slate-400 font-bold mb-1">/ {pkg.hours}</span>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  {pkg.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3 text-slate-600 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link 
                  to="/services" 
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                    pkg.popular 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' 
                      : 'bg-slate-50 text-slate-900 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Select Package
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
