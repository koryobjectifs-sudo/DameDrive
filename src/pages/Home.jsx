import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustSection from '../components/TrustSection';
import Services from '../components/Services';
import WhyChooseUs from '../components/WhyChooseUs';
import HowItWorks from '../components/HowItWorks';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import Stats from '../components/Stats';
import FAQ from '../components/FAQ';
import BookingSection from '../components/BookingSection';
import Footer from '../components/Footer';

function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <TrustSection />
        <Services />
        <WhyChooseUs />
        <HowItWorks />
        <About />
        <Testimonials />
        <Stats />
        <FAQ />
        <BookingSection />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
