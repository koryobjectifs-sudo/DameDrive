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
    <section className="py-16 md:py-20 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-x divide-white/10">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center px-4">
              <div className="text-4xl md:text-5xl font-extrabold text-accent mb-2 font-display">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm md:text-base font-medium text-white/80 uppercase tracking-wide">
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
