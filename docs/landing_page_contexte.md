# Contexte et Codebase : Landing Page
Ce fichier contient tout l'historique et le code source des composants constituant la Landing Page de DameDrive.

## Fichier : src/pages/Home.jsx
```jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustSection from '../components/TrustSection';
import WhyChooseUs from '../components/WhyChooseUs';
import About from '../components/About';
import Footer from '../components/Footer';

function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-slate-900 selection:bg-primary selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <TrustSection />
        <WhyChooseUs />
        <About />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
```

## Fichier : src/components/Hero.jsx
```jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, Users } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative py-12 lg:py-16 overflow-hidden min-h-[70vh] flex items-center">
      {/* Full Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-image-real.jpg" 
          alt="Premium Driving Instruction" 
          fetchpriority="high"
          decoding="async"
          className="w-full h-full object-cover object-center opacity-90"
        />
        {/* Cinematic dark overlay for pure luxury and perfect readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-slate-900/70 to-[#0A0F1C]/95"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center flex flex-col items-center"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 leading-[1.1] drop-shadow-lg">
            Learn to Drive <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              With Confidence.
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl font-light">
            Professional, patient, and comprehensive driving lessons tailored to you. Get behind the wheel with Canada's top-rated driving instructor.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12 w-full max-w-sm">
            <Link to="/services" className="w-full bg-white text-[#0A0F1C] px-6 py-3 rounded-xl font-bold text-base hover:bg-slate-100 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] hover:-translate-y-1 active:scale-95 text-center">
              Explore Packages
            </Link>
          </div>

          {/* Quick Stats - Centered */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 pt-10 border-t border-white/10 w-full max-w-4xl">
            <div className="flex flex-col items-center">
              <div className="text-white font-black text-3xl mb-1 tracking-tight drop-shadow-md">500+</div>
              <p className="text-sm text-slate-400 font-medium flex items-center gap-2"><Users size={14} className="text-blue-400"/> Students</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-white font-black text-3xl mb-1 tracking-tight drop-shadow-md">98%</div>
              <p className="text-sm text-slate-400 font-medium flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-400"/> Pass Rate</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-white font-black text-3xl mb-1 tracking-tight drop-shadow-md">15+</div>
              <p className="text-sm text-slate-400 font-medium flex items-center gap-2"><Clock size={14} className="text-yellow-400"/> Years Exp</p>
            </div>
            {/* Ministry Approved embedded directly into the stats row for a sleek layout */}
            <div className="flex flex-col items-center justify-center sm:border-l sm:border-white/10 sm:pl-6">
              <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/30 mb-2">
                <ShieldCheck size={20} />
              </div>
              <p className="text-xs font-bold text-white uppercase tracking-wider text-center">Ministry<br/>Approved</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
```

## Fichier : src/components/TrustSection.jsx
```jsx
import React from 'react';
import { Award, Calendar, Car, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const TrustSection = () => {
  const badges = [
    { icon: <Award className="w-6 h-6" />, title: "Certified Instructor", desc: "Ministry approved" },
    { icon: <Calendar className="w-6 h-6" />, title: "Flexible Scheduling", desc: "Fits your life" },
    { icon: <Car className="w-6 h-6" />, title: "Modern Vehicles", desc: "Dual-controlled" },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Patient Coaching", desc: "Learn safely" },
  ];

  return (
    <section className="relative z-20 -mt-16 sm:-mt-12 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-emerald-50/50 opacity-50"></div>
        {badges.map((badge, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 + (idx * 0.1) }}
            className="flex items-center gap-5 px-2 lg:px-8 w-full justify-center md:justify-start py-4 md:py-0 relative z-10 group"
          >
            <motion.div 
              className="w-14 h-14 shrink-0 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300"
              animate={{ y: [0, -8, 0] }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: idx * 0.5
              }}
            >
              {badge.icon}
            </motion.div>
            <div className="text-left flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 text-sm lg:text-base leading-tight truncate">{badge.title}</h4>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{badge.desc}</p>
            </div>
          </motion.div>
        ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
```

## Fichier : src/components/WhyChooseUs.jsx
```jsx
import React from 'react';
import { Award, Calendar, Shield, Car, User, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const WhyChooseUs = () => {
  const benefits = [
    { title: "Ministry Approved", desc: "Professional, fully certified instruction.", icon: <Award className="w-5 h-5" /> },
    { title: "Flexible Scheduling", desc: "Lesson plans built around your life.", icon: <Calendar className="w-5 h-5" /> },
    { title: "Safety First", desc: "Safe, dual-controlled learning environment.", icon: <Shield className="w-5 h-5" /> },
    { title: "Exam Ready", desc: "Real preparation and mock tests.", icon: <Car className="w-5 h-5" /> },
    { title: "Patient Coaching", desc: "Personalized support for nervous drivers.", icon: <User className="w-5 h-5" /> },
    { title: "Convenient", desc: "Pick-up and drop-off included.", icon: <MapPin className="w-5 h-5" /> }
  ];

  return (
    <section className="py-12 md:py-16 bg-white overflow-hidden text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:ml-auto w-full max-w-lg mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white border border-slate-100/50 aspect-square">
              <img 
                src="/why-choose-us-real.jpg" 
                alt="Student celebrating getting license with instructor" 
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            </div>
            {/* Decoration */}
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Why Choose Us</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight text-slate-900">More than just a driving school.</h3>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              We don't just teach you how to pass a test. We build safe, confident, and defensive drivers for life through premium, personalized instruction.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{benefit.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
```

## Fichier : src/components/About.jsx
```jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-12 md:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 md:p-12 border border-slate-100 shadow-xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            {/* Instructor Image */}
            <div className="relative mx-auto w-full max-w-sm">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-200">
                <img 
                  src="/instructor-real.png" 
                  alt="Instructor Portrait" 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white border-4 border-white shadow-lg hidden sm:flex">
                <div className="text-center">
                  <div className="text-2xl font-bold">15+</div>
                  <div className="text-xs uppercase tracking-wider font-semibold">Years</div>
                </div>
              </div>
            </div>

            {/* About Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Meet Your Instructor</h2>
              <h3 className="text-3xl font-extrabold text-slate-900 mb-6">Hi, I'm Alex. Let's get you on the road.</h3>
              
              <div className="space-y-4 text-slate-600 mb-8 leading-relaxed">
                <p>
                  With over a decade of professional driving instruction experience in Canada, I've helped hundreds of students transform from nervous beginners to confident, fully licensed drivers.
                </p>
                <p>
                  My teaching philosophy is simple: create a stress-free, patient, and highly structured environment where you feel completely safe making mistakes and learning from them. I specialize in teaching teenagers getting their first license, as well as new immigrants adapting to Canadian winter driving conditions.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm relative">
                <Quote className="absolute top-4 right-4 text-slate-100 w-12 h-12" />
                <p className="text-slate-900 font-medium italic relative z-10">
                  "Driving is independence. My mission is to ensure every student not only passes their test, but becomes a defensive, safe driver for the rest of their life."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
```

## Fichier : src/components/Navbar.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { Menu, X, Car, ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

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
    { name: 'About', href: '/#about', id: 'about' },
    { name: 'How It Works', href: '/how-it-works', id: 'how-it-works' },
    { name: 'Services', href: '/services', id: 'services' },
    { name: 'Pricing', href: '/pricing', id: 'pricing' },
    { name: 'Reviews', href: '/reviews', id: 'reviews' },
    { name: 'FAQ', href: '/faq', id: 'faq' },
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
        className={`sticky top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-white py-5 lg:py-6 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo and Back Button */}
            <div className="flex items-center gap-4">
              {location.pathname !== '/' && (
                <button 
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all border border-slate-100 hover:border-primary/20 hover:shadow-sm"
                  aria-label="Go Back"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-primary text-white p-2 rounded-lg group-hover:scale-105 transition-transform">
                  <Car size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-primary transition-colors">
                  DameDrive
                </span>
              </Link>
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
```

## Fichier : src/components/Footer.jsx
```jsx
import React from 'react';
import { Phone, Mail, MapPin, Car } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary text-white p-2 rounded-lg">
                <Car size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                DameDrive
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Premium driving instruction tailored for your success. Building safe, confident, and defensive drivers for life.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/DameDriveOfficial" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-sm font-bold">
                IG
              </a>
              <a href="https://facebook.com/DameDriveCanada" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-sm font-bold">
                FB
              </a>
              <a href="https://wa.me/221781582740" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-sm font-bold">
                WA
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="/services" className="hover:text-primary transition-colors">Packages & Pricing</a></li>
              <li><a href="/#about" className="hover:text-primary transition-colors">Meet the Instructor</a></li>
              <li><a href="/#reviews" className="hover:text-primary transition-colors">Student Success</a></li>
              <li><a href="/faq" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-primary" />
                <span>+221 78 158 2740</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary" />
                <span>suporttest474@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-primary flex-shrink-0 mt-1" />
                <span className="leading-relaxed">Serving Calgary, Alberta & Surrounding Regions</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="text-white font-bold mb-6">Ready to start?</h4>
            <p className="text-sm text-slate-400 mb-4">Book your first lesson today and take the first step towards independence.</p>
            <a href="#book" className="inline-block w-full text-center bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Book Online Now
            </a>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} DameDrive. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

## Fichier : src/components/Services.jsx
```jsx
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
                <h4 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors flex-1 min-w-0 pr-2">
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
```

## Fichier : src/components/HowItWorks.jsx
```jsx
import React from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Route, Car } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      title: "Book Your Slot",
      desc: "Choose a time that works for you using our simple online booking system.",
      icon: <CalendarCheck className="w-8 h-8 text-primary" />
    },
    {
      num: "02",
      title: "Hit the Road",
      desc: "Learn from patient, certified instructors in our modern dual-controlled vehicles.",
      icon: <Car className="w-8 h-8 text-primary" />
    },
    {
      num: "03",
      title: "Get Licensed",
      desc: "Pass your road test with confidence and become a safe driver for life.",
      icon: <Route className="w-8 h-8 text-primary" />
    }
  ];

  return (
    <section id="how-it-works" className="py-12 md:py-16 bg-white text-slate-900 relative overflow-hidden">
      {/* Decorative dots pattern (light theme) */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-slate-100 pb-8">
          <div className="max-w-2xl">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Simple Process</h2>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-0 tracking-tight">Your Journey to Independence</h3>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="relative group"
            >
              {/* Massive background number */}
              <div className="text-8xl md:text-9xl font-black text-slate-100 absolute -top-12 -left-4 md:-left-8 -z-10 transition-transform group-hover:-translate-y-2">
                {step.num}
              </div>
              
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-primary/20">
                {step.icon}
              </div>
              
              <h4 className="text-2xl font-bold mb-4">{step.title}</h4>
              <p className="text-slate-600 leading-relaxed text-lg">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
```

## Fichier : src/components/Testimonials.jsx
```jsx
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/20 pb-8">
          <div className="max-w-2xl">
            <h2 className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-3">Testimonials</h2>
            <h3 className="text-3xl md:text-4xl font-black mb-0 tracking-tight text-white">Student Success Stories</h3>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {reviews.map((review, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white text-slate-900 p-5 rounded-xl shadow-sm relative flex flex-col"
            >
              <div className="flex gap-1 mb-2">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-slate-700 mb-4 flex-grow leading-snug text-sm italic">"{review.content}"</p>
              
              <div className="flex items-center gap-3 mt-auto">
                <img 
                  src={review.image} 
                  alt={review.name} 
                  loading="lazy"
                  decoding="async"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="font-bold text-sm text-slate-900">{review.name}</div>
                  <div className="text-xs text-slate-500">{review.role}</div>
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
```

## Fichier : src/components/Pricing.jsx
```jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ChevronDown, ChevronUp, Info } from 'lucide-react';

const Pricing = () => {
  const [expandedPackage, setExpandedPackage] = useState(null);

  const plans = [
    {
      name: "Beginner Package",
      price: "50",
      description: "Quick refresher or get comfortable behind the wheel.",
      marketingText: "Tailored for absolute beginners and nervous drivers. Master vehicle control and basic road awareness in a low-pressure environment.",
      features: [
        "2 Hours Minimum",
        "Free Pick-up & Drop-off",
        "Basic Maneuvers",
        "Dual-control Vehicle"
      ],
      popular: false
    },
    {
      name: "Comprehensive Plan",
      price: "45",
      description: "Our most popular package for students preparing for their test.",
      marketingText: "Our signature curriculum. Dive deep into complex traffic scenarios, highway driving, and parallel parking to become fully equipped for everyday driving.",
      features: [
        "6 Hours Minimum",
        "Free Pick-up & Drop-off",
        "Highway & City Driving",
        "Mock Road Test",
        "Priority Scheduling"
      ],
      popular: true
    },
    {
      name: "Road Test Ready",
      price: "40",
      description: "Complete journey from beginner to licensed driver.",
      marketingText: "The ultimate solution guaranteeing maximum supervised road time. Includes night/winter driving and use of our car for your actual road test.",
      features: [
        "10 Hours Minimum",
        "Free Pick-up & Drop-off",
        "Winter & Night Driving",
        "Use of Car for Road Test",
        "Guaranteed Pass Support"
      ],
      popular: false
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-200 pb-8">
          <div className="max-w-2xl">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Pricing</h2>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-0 tracking-tight">Choose Your Journey</h3>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-3xl p-5 md:p-6 border shadow-xl relative flex flex-col transition-all ${
                plan.popular ? 'border-primary ring-2 ring-primary/20 lg:-translate-y-2' : 'border-slate-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-md">
                  Most Popular
                </div>
              )}
              
              <h4 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h4>
              <p className="text-slate-500 text-sm mb-6 min-h-[40px] leading-relaxed">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-3xl font-black text-slate-900">${plan.price}</span>
                <span className="text-slate-500 font-medium text-sm">/Hour</span>
              </div>

              <div className="mb-6 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                <button 
                  onClick={() => setExpandedPackage(expandedPackage === idx ? null : idx)}
                  className={`w-full flex items-center justify-between p-3 text-sm font-bold transition-colors ${
                    expandedPackage === idx 
                    ? 'bg-primary text-white' 
                    : 'bg-primary/5 text-primary hover:bg-primary/10'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Info size={16} />
                    WHY CHOOSE THIS?
                  </span>
                  {expandedPackage === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                
                <AnimatePresence>
                  {expandedPackage === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-slate-50"
                    >
                      <p className="p-4 text-sm text-slate-700 leading-relaxed border-t border-slate-100">
                        {plan.marketingText}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3 text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <a 
                href="/#book"
                className={`w-full py-4 rounded-xl text-base text-center font-bold transition-all shadow-md mt-auto ${
                  plan.popular 
                    ? 'bg-primary hover:bg-primary-dark text-white shadow-primary/30 hover:-translate-y-1' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900 hover:-translate-y-1'
                }`}
              >
                Book This Package
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
```

## Fichier : src/components/FAQ.jsx
```jsx
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
```
