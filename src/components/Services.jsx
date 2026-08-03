import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Key, Route, Navigation, FileCheck, Snowflake, MapPin, ArrowRight } from 'lucide-react';

const Services = () => {
  const navigate = useNavigate();
  const services = [
    {
      id: "beginner-lessons",
      title: "Beginner Lessons",
      desc: "Step-by-step curriculum for complete beginners.",
      icon: <Key className="w-5 h-5" />,
      image: "/images/beginner_lessons_hero_1785788722912.png"
    },
    {
      id: "road-test-prep",
      title: "Road Test Preparation",
      desc: "Mock tests and route practice to guarantee passing.",
      icon: <FileCheck className="w-5 h-5" />,
      image: "/images/road_test_prep_hero_1785788750511.png"
    },
    {
      id: "highway-driving",
      title: "Highway Driving",
      desc: "Build confidence merging and navigating highways.",
      icon: <Navigation className="w-5 h-5" />,
      image: "/images/highway_driving_hero_1785788797918.png"
    },
    {
      id: "parking-practice",
      title: "Parking Practice",
      desc: "Master parallel and reverse parking with ease.",
      icon: <MapPin className="w-5 h-5" />,
      image: "/images/parking_practice_hero_1785788810001.png"
    },
    {
      id: "winter-driving",
      title: "Winter Driving",
      desc: "Essential skills for safe handling in snow and ice.",
      icon: <Snowflake className="w-5 h-5" />,
      image: "/images/winter_driving_hero_1785788828096.png"
    },
    {
      id: "refresher-courses",
      title: "Refresher Courses",
      desc: "Brush up your skills and adapt to Canadian rules.",
      icon: <Route className="w-5 h-5" />,
      image: "/images/refresher_courses_hero_1785788852301.png"
    }
  ];

  return (
    <section id="services" className="py-12 md:py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-100 pb-8">
          <div className="max-w-2xl">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Our Packages</h2>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">Tailored Driving Lessons</h3>
            <p className="text-slate-500 text-base md:text-lg font-light leading-relaxed">
              Whether you're starting from scratch or just need a quick refresher before your road test, we have a plan for you.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {services.map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              onClick={() => navigate(`/services/${service.id}`)}
              className="group flex flex-col p-4 rounded-3xl hover:bg-slate-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-slate-100 shadow-sm hover:shadow-xl"
            >
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 relative shadow-md">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors duration-300"></div>
                <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm text-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                  {service.icon}
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                  {service.title}
                </h4>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                  <ArrowRight size={16} />
                </div>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
