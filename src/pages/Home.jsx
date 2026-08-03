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
