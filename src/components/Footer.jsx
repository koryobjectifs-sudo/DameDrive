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
              <li><a href="#services" className="hover:text-primary transition-colors">Packages & Pricing</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">Meet the Instructor</a></li>
              <li><a href="#reviews" className="hover:text-primary transition-colors">Student Success</a></li>
              <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
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
