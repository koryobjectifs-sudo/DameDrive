import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const CountUp = ({ end, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
};

const Stats = () => {
  const stats = [
    { label: "Students Trained", value: 500, suffix: "+" },
    { label: "Road Test Success", value: 98, suffix: "%" },
    { label: "Years Experience", value: 10, suffix: "+" },
    { label: "Average Rating", value: 5, suffix: "★" }
  ];

  return (
    <section className="py-16 md:py-20 bg-[#0A0F1C] border-b border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-blue-600/10 blur-[120px] rounded-[100%]"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-x divide-white/10">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center px-4 group">
              <div className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 mb-3 font-display transform group-hover:scale-105 transition-transform duration-300">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs md:text-sm font-bold text-blue-400 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
