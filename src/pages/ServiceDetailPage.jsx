import React, { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check, ArrowRight, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const SERVICE_DATA = {
  'beginner-lessons': {
    title: "Beginner Lessons",
    tagline: "Your foundation for a lifetime of safe driving.",
    heroImage: "/images/beginner_lessons_hero_1785788722912.png",
    description: "Our comprehensive beginner curriculum is designed to transform nervous first-timers into confident drivers. We focus heavily on core vehicle control, understanding spatial awareness, and mastering the fundamentals in a low-pressure, dual-controlled environment.",
    duration: "2-10 Hours",
    targetAudience: "First-time drivers and nervous beginners",
    learnings: [
      "Mastering basic vehicle controls (steering, braking, accelerating)",
      "Understanding traffic signs, signals, and right-of-way rules",
      "Building confidence in quiet, low-traffic residential neighborhoods",
      "Developing proper mirror usage and blind-spot checking habits",
      "Smooth transitioning between lanes and making safe turns"
    ]
  },
  'road-test-prep': {
    title: "Road Test Preparation",
    tagline: "Guarantee your success on exam day.",
    heroImage: "/images/road_test_prep_hero_1785788750511.png",
    description: "Don't leave your road test to chance. This specialized package mimics the exact conditions of the official Ministry driving test. We take you through common test routes, point out frequent failing mistakes, and run full mock exams.",
    duration: "2-4 Hours",
    targetAudience: "Students within 2 weeks of their official road test",
    learnings: [
      "Completing full mock road tests with formal grading sheets",
      "Familiarization with exact local testing routes and speed zones",
      "Perfecting mandatory maneuvers (parallel parking, 3-point turns)",
      "Avoiding common automatic-fail mistakes",
      "Managing test anxiety and communicating with the examiner"
    ]
  },
  'highway-driving': {
    title: "Highway Driving",
    tagline: "Merge with confidence and navigate at high speeds.",
    heroImage: "/images/highway_driving_hero_1785788797918.png",
    description: "Highway driving is the most intimidating aspect of learning to drive. Our instructors will teach you the exact science of matching speed, finding gaps in traffic, and safely merging onto Canada's busiest highways without hesitation.",
    duration: "2 Hours Minimum",
    targetAudience: "Drivers looking to overcome high-speed anxiety",
    learnings: [
      "Calculating speed and distance for safe highway merging",
      "Executing high-speed lane changes and passing maneuvers",
      "Maintaining proper following distances at 100km/h+",
      "Navigating complex interchanges and multiple exit lanes",
      "Handling highway emergencies and breakdown protocols"
    ]
  },
  'parking-practice': {
    title: "Parking Practice",
    tagline: "Master every angle, in every space.",
    heroImage: "/images/parking_practice_hero_1785788810001.png",
    description: "Struggling with spatial awareness? This focused module drills down exclusively on parking techniques. We break down the complex geometry of parking into simple, repeatable steps that work every single time.",
    duration: "1.5 Hours Minimum",
    targetAudience: "Drivers struggling with parallel or reverse parking",
    learnings: [
      "The foolproof 3-step method for perfect parallel parking",
      "Reverse stall parking in tight parking lots",
      "Forward stall parking and adjusting crooked angles",
      "Hill parking rules (uphill vs. downhill with/without curbs)",
      "Using mirrors and backup cameras effectively without over-relying"
    ]
  },
  'winter-driving': {
    title: "Winter Driving",
    tagline: "Conquer the ice, snow, and extreme conditions.",
    heroImage: "/images/winter_driving_hero_1785788828096.png",
    description: "Canadian winters are unforgiving. This specialized course teaches you the physics of traction, how to recover from a skid, and how to safely navigate roads when visibility and grip are at their lowest.",
    duration: "2-3 Hours",
    targetAudience: "New drivers experiencing their first winter, or new immigrants",
    learnings: [
      "Understanding black ice and reading winter road conditions",
      "Mastering skid recovery (steering into the skid)",
      "Proper ABS braking techniques on packed snow and ice",
      "Adjusting following distances and speeds for low traction",
      "Winter survival kit preparation and emergency breakdown safety"
    ]
  },
  'refresher-courses': {
    title: "Refresher Courses",
    tagline: "Knock off the rust and drive like a pro.",
    heroImage: "/images/refresher_courses_hero_1785788852301.png",
    description: "Haven't driven in a few years? Recently moved to Canada and need to adapt to local rules? Our refresher course is a customized evaluation and correction of your existing driving habits to get you back on the road safely.",
    duration: "Customizable",
    targetAudience: "Returning drivers, seniors, and international drivers",
    learnings: [
      "Adapting to specific Canadian driving laws and signage",
      "Correcting bad habits developed over years of driving",
      "Regaining confidence in heavy city traffic",
      "Updating knowledge on new vehicle technologies (lane assist, etc)",
      "Personalized focus on your specific areas of concern"
    ]
  }
};

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const service = SERVICE_DATA[serviceId];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-primary selection:text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Illustrative Image Banner */}
        <div className="w-full h-[40vh] md:h-[50vh] relative">
          <img 
            src={service.heroImage} 
            alt={service.title} 
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Content Section */}
        <section className="pb-16 md:pb-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 -mt-20 relative z-20">
              
              <div className="mb-10 text-center">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                  {service.title}
                </h1>
                <p className="text-lg text-primary font-bold mb-6">
                  {service.tagline}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-bold text-slate-700">
                  <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                    <Clock size={16} className="text-primary" />
                    {service.duration}
                  </span>
                  <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    Ministry Approved
                  </span>
                </div>
              </div>

              <hr className="border-slate-100 mb-10" />

              <div className="mb-10">
                <h2 className="text-xl font-bold text-slate-900 mb-3">Overview</h2>
                <p className="text-base text-slate-600 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 md:p-6 mb-10 border border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ideal For</h3>
                <p className="text-base font-bold text-slate-900 flex items-center gap-3">
                  <MapPin className="text-primary shrink-0" size={18} />
                  {service.targetAudience}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-5">What You Will Learn</h2>
                <ul className="space-y-3">
                  {service.learnings.map((learning, idx) => (
                    <motion.li 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <span className="text-base text-slate-700 font-medium">{learning}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetailPage;
