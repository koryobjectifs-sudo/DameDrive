import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-slate-200">
      <button 
        className="w-full py-6 flex justify-between items-center focus:outline-none text-left"
        onClick={onClick}
      >
        <span className="text-lg font-semibold text-slate-900">{question}</span>
        <ChevronDown 
          className={`w-5 h-5 text-primary transition-transform duration-300 flex-shrink-0 ml-4 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-slate-600 leading-relaxed pr-8">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

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

  return (
    <section id="faq" className="py-12 md:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Got Questions?</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Frequently Asked Questions</h3>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 md:p-10 border border-slate-100">
          {faqs.map((faq, idx) => (
            <FAQItem 
              key={idx}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === idx}
              onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
