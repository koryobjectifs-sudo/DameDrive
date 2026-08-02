import React, { useState, useEffect } from 'react';
import { Menu, X, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // ScrollSpy Logic
      const sections = ['services', 'how-it-works', 'about', 'reviews', 'pricing', 'faq'];
      let current = '';
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= (el.offsetTop - 150)) {
          current = section;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services', id: 'services' },
    { name: 'How It Works', href: '#how-it-works', id: 'how-it-works' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Reviews', href: '#reviews', id: 'reviews' },
    { name: 'Packages', href: '#packages', id: 'packages' },
    { name: 'FAQ', href: '#faq', id: 'faq' },
  ];

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-white/50 backdrop-blur-sm py-5 lg:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-primary text-white p-2 rounded-lg">
                <Car size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                DameDrive
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors relative py-2 ${
                    activeSection === link.id ? 'text-primary font-bold' : 'text-slate-600 hover:text-primary'
                  }`}
                >
                  {link.name}
                  {activeSection === link.id && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              ))}
              <a
                href="#book"
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105 shadow-md shadow-primary/20"
              >
                Book a Lesson
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden z-[60]">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-900 hover:text-primary focus:outline-none p-2"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-out Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-3/4 max-w-sm h-screen bg-white shadow-2xl z-50 lg:hidden flex flex-col pt-24 pb-8 px-6"
            >
              <div className="flex flex-col space-y-2 flex-grow">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-4 text-lg rounded-xl transition-colors ${
                      activeSection === link.id 
                        ? 'bg-primary/10 text-primary font-bold' 
                        : 'text-slate-700 font-medium hover:bg-slate-50'
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              <div className="mt-auto">
                <a
                  href="#book"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center bg-primary hover:bg-primary-dark text-white px-6 py-4 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 transition-transform active:scale-95"
                >
                  Book a Lesson
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
