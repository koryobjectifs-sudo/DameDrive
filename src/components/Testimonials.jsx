import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "First-time Driver",
      content: "Alex was incredibly patient. I was terrified of highway driving, but he broke it down step by step. Passed my G2 on the first try!",
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
    <section id="reviews" className="py-12 md:py-16 bg-primary text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-accent uppercase tracking-wider mb-2">Testimonials</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold mb-4">Student Success Stories</h3>
          <p className="text-lg text-primary-50">
            Don't just take our word for it. Here is what our successful students have to say about their experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white text-slate-900 p-8 rounded-3xl shadow-xl relative"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-slate-700 mb-8 flex-grow leading-relaxed">"{review.content}"</p>
              
              <div className="flex items-center gap-4 mt-auto">
                <img 
                  src={review.image} 
                  alt={review.name} 
                  loading="lazy"
                  decoding="async"
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-100"
                />
                <div>
                  <div className="font-bold text-slate-900">{review.name}</div>
                  <div className="text-sm text-slate-500">{review.role}</div>
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
