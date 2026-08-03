import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

function FAQPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-slate-900 selection:bg-primary selection:text-white flex flex-col">
      <Navbar />
      <main className="flex-grow pt-4">
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

export default FAQPage;
