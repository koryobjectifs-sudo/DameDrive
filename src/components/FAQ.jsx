import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      question: "How long is each driving lesson?",
      answer: "A standard lesson is 60 minutes long. However, we also offer 90-minute and 120-minute sessions for students who want intensive highway practice or mock road tests."
    },
    {
      question: "Can I use the instructor's car for my road test?",
      answer: "Yes! If you book our Road Test Package, you can use the same dual-controlled vehicle you trained in for your official road test, which greatly increases pass rates."
    },
    {
      question: "Do you offer pick-up and drop-off?",
      answer: "Absolutely. We provide free pick-up and drop-off from your home, school, or workplace within our service area."
    },
    {
      question: "What is your cancellation policy?",
      answer: "We require 24 hours notice for any cancellations or rescheduling. Cancellations made with less than 24 hours notice may be subject to a cancellation fee."
    },
    {
      question: "How many lessons will I need to pass?",
      answer: "This varies greatly depending on your prior experience and comfort level. On average, complete beginners require between 10 to 15 hours of instruction, while experienced drivers may only need 2-3 hours of test preparation."
    }
  ];

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(prev + 1, faqs.length - 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section id="faq" className="py-12 md:py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Frequently<br />
              Asked <span className="text-primary">Questions</span>
            </h2>
          </div>
          
          <div className="lg:w-1/3 flex flex-col items-start lg:items-end text-left lg:text-right">
            <p className="text-slate-500 text-lg mb-6 leading-relaxed max-w-sm">
              Find answers to common questions about our driving lessons, test prep, and scheduling policies.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={handlePrev}
                disabled={activeIndex === 0}
                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-colors bg-white hover:bg-slate-50 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous question"
              >
                <ArrowLeft size={20} />
              </button>
              <button 
                onClick={handleNext}
                disabled={activeIndex === faqs.length - 1}
                className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next question"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Stacked Cards Deck */}
        <div className="relative h-[450px] w-full max-w-[400px] md:max-w-[500px] lg:max-w-[600px] mx-auto lg:mx-0">
          <AnimatePresence>
            {faqs.map((faq, idx) => {
              const diff = idx - activeIndex;
              const isDismissed = diff < 0;
              const isActive = diff === 0;
              const isUpcoming = diff > 0;
              
              // Only render cards that are active, upcoming (up to 3 in the pile), or just dismissed (for exit animation)
              if (diff > 3 || diff < -1) return null;

              // Calculate physics for the pile
              let xPos = 0;
              let scale = 1;
              let zIndex = 10;
              let opacity = 1;

              if (isDismissed) {
                xPos = -200; // Swipe left away
                opacity = 0;
                zIndex = 0;
              } else if (isActive) {
                xPos = 0;
                scale = 1;
                zIndex = 10;
              } else if (isUpcoming) {
                xPos = diff * 40; // Shift to the right to show the edge
                scale = 1 - (diff * 0.05); // Scale down the further back it is
                zIndex = 10 - diff;
                opacity = 1 - (diff * 0.1); // Slightly fade items further in the pile
              }

              return (
                <motion.div
                  key={idx}
                  onClick={() => {
                    if (isUpcoming) setActiveIndex(idx);
                  }}
                  initial={false}
                  animate={{
                    x: xPos,
                    scale: scale,
                    zIndex: zIndex,
                    opacity: opacity,
                    backgroundColor: isActive ? '#2563eb' : '#f8fafc', // blue-600 vs slate-50
                    borderColor: isActive ? '#2563eb' : '#f1f5f9', // blue-600 vs slate-100
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`absolute inset-0 rounded-3xl p-8 md:p-10 flex flex-col justify-end overflow-hidden border ${
                    isActive ? 'shadow-2xl shadow-blue-600/20 cursor-default' : 'shadow-xl shadow-slate-900/5 hover:bg-slate-100 cursor-pointer'
                  }`}
                  style={{
                    transformOrigin: 'left center'
                  }}
                >
                  <motion.div className="w-full h-full flex flex-col justify-end">
                    <motion.h3 
                      animate={{ color: isActive ? '#ffffff' : '#94a3b8' }}
                      className="font-bold leading-tight mb-4 text-xl md:text-2xl"
                    >
                      {faq.question}
                    </motion.h3>
                    
                    <div className="overflow-hidden">
                      <motion.div
                        initial={false}
                        animate={{ 
                          height: isActive ? 'auto' : 0,
                          opacity: isActive ? 1 : 0,
                          y: isActive ? 0 : 20
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-blue-100 text-sm md:text-base leading-relaxed pt-2">
                          {faq.answer}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default FAQ;
