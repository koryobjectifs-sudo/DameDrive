import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustSection from '../components/TrustSection';
import Services from '../components/Services';
import WhyChooseUs from '../components/WhyChooseUs';
import HowItWorks from '../components/HowItWorks';
import About from '../components/About';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import Booking from '../components/Booking';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-slate-900 selection:bg-primary selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <TrustSection />
        <Services />
        <WhyChooseUs />
        <HowItWorks />
        <About />
        <Testimonials />
        <Pricing />
        <Booking />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
