import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from './Eecomponents/HeroSection';
import { AboutDepartment, DepartmentStats } from './Eecomponents/AboutDepartment';
import VisionMission from './Eecomponents/VisionMission';
import CourseHighlights from './Eecomponents/CourseHighlights';
import FacultyProfiles from './Eecomponents/FacultyProfiles';
import { StudentInnovation, RoboticsParticipation } from './Eecomponents/StudentInnovation';
import { PlacementRecords, GateQualifiers } from './Eecomponents/PlacementandGateData';
import CareerOpportunities from './Eecomponents/CareerOpportunities';
import ContactPage from './Eecomponents/contactPage';
import { FaArrowUp } from 'react-icons/fa';

const EeDepartment = () => {
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
    <div className="bg-gradient-to-b from-blue-50 to-white">
      <HeroSection />
      <AboutDepartment />
      <DepartmentStats />
      <VisionMission />
      <CourseHighlights />
      <FacultyProfiles />
      <StudentInnovation />
      <RoboticsParticipation />
      <PlacementRecords />
      <GateQualifiers />
      <CareerOpportunities />
      <ContactPage />

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

export default EeDepartment;
