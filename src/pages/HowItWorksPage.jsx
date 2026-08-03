import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';

function HowItWorksPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-slate-900 selection:bg-primary selection:text-white flex flex-col">
      <Navbar />
      <main className="flex-grow pt-4">
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}

export default HowItWorksPage;
