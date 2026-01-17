import React, { useEffect, useState } from 'react';
import PageRenderer from '../../../PageBuilder/PageRenderer';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';

const CivilDepartment = () => {
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
    <div className="civil-department">
      {/* 
         The entire content is now driven by PageRenderer using the 'departments/civil' slug.
         This replaces the hardcoded components CivilAbout, CivilAcademics, and CivilInfrastructure.
      */}
      <PageRenderer slug="departments/civil" />

      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-green-600 to-teal-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:from-green-700 hover:to-teal-700 transition-all duration-300"
            aria-label="Scroll to top"
          >
            <FaArrowUp className="text-lg" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CivilDepartment;
