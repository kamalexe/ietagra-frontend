import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import FacilitiesSection from './FacilitiesSection';
import FacultySection from './FacultySection';
import ActivitiesSection from './ActivityContent';
import AnimatedBackground from '../../../../utils/AnimatedBackground';
import { FaArrowUp } from 'react-icons/fa';
import ContactUs from './contactUs';

const AppliedScience = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);

    // Show button when user scrolls down 300px
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to scroll to top with smooth behavior
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Animated background with mathematical and scientific patterns */}
      <AnimatedBackground />

      {/* Main content */}
      <div className="relative z-10">
        <HeroSection />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-12"
        >
          <AboutSection />
          <FacilitiesSection />
          <FacultySection />
          <ActivitiesSection />
          <ContactUs />
        </motion.div>
      </div>
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-900 transition-all duration-300"
            aria-label="Scroll to top"
          >
            <FaArrowUp className="text-lg" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppliedScience;
