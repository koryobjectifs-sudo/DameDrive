import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "First-time Driver",
      content: "Alex was incredibly patient. I was terrified of highway driving, but he broke it down step by step. Passed my road test on the first try!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200"
    },
    {
      name: "David Chen",
      role: "New Immigrant",
      content: "Adapting to winter driving in Canada was daunting. The winter driving package gave me exactly the confidence I needed to drive safely.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
    },
    {
      name: "Emma Thompson",
      role: "Road Test Prep",
      content: "The mock tests were identical to the real thing. When exam day came, I felt like I had already done it a hundred times.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
    }
  ];

  return (
    <section id="reviews" className="py-24 md:py-32 bg-[#0a0f1c] text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-[0.25em] mb-4">Testimonials</h2>
          <h3 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white">Student Success Stories</h3>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">Don't just take our word for it. Hear from students who have successfully earned their licenses.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md relative flex flex-col hover:bg-white/10 transition-colors duration-500"
            >
              <Quote className="absolute top-8 right-8 text-white/10 w-12 h-12" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                ))}
              </div>
              
              <p className="text-slate-300 mb-8 flex-grow leading-relaxed font-medium text-lg relative z-10">"{review.content}"</p>
              
              <div className="flex items-center gap-4 mt-auto border-t border-white/10 pt-6">
                <img 
                  src={review.image} 
                  alt={review.name} 
                  loading="lazy"
                  decoding="async"
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-700"
                />
                <div>
                  <div className="font-bold text-white text-base">{review.name}</div>
                  <div className="text-sm text-emerald-400 font-medium">{review.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
