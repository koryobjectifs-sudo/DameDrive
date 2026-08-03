import React from 'react';
import Navbar from '../components/Navbar';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

function ReviewsPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-slate-900 selection:bg-primary selection:text-white flex flex-col">
      <Navbar />
      <main className="flex-grow pt-4">
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

export default ReviewsPage;
