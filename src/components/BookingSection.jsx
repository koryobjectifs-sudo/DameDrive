import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Calendar, ArrowRight, MessageCircle } from 'lucide-react';

const BookingSection = () => {
  return (
    <section className="py-24 md:py-32 bg-blue-600 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-400/20 rounded-full blur-[100px]" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            Ready to Take the Wheel?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto font-medium">
            Book your first lesson today and start your journey towards independence and confident driving.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <button className="w-full sm:w-auto bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-slate-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3">
              <Calendar size={24} />
              Book Online Now
            </button>
            <button className="w-full sm:w-auto bg-blue-700 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl border border-blue-500 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3">
              <MessageCircle size={24} />
              WhatsApp Us
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto border-t border-blue-400/30 pt-10">
            <a href="tel:+14035550199" className="flex items-center justify-center sm:justify-start gap-4 text-blue-100 hover:text-white transition-colors group">
              <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone size={20} />
              </div>
              <div className="text-left">
                <div className="text-sm text-blue-200">Call Us Directly</div>
                <div className="font-bold text-lg">(403) 555-0199</div>
              </div>
            </a>
            <a href="mailto:hello@damedrive.ca" className="flex items-center justify-center sm:justify-start gap-4 text-blue-100 hover:text-white transition-colors group">
              <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail size={20} />
              </div>
              <div className="text-left">
                <div className="text-sm text-blue-200">Email Us</div>
                <div className="font-bold text-lg">hello@damedrive.ca</div>
              </div>
            </a>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default BookingSection;
