import React from "react";
import { motion } from "framer-motion";

const HomeHero = () => {
  return (
    <section className="relative w-full bg-white overflow-hidden">
      {/* Background Accent Shapes */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-yellow-400 rounded-full -z-10"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-800 rounded-full -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 flex flex-col-reverse md:flex-row items-center">
        {/* Left Content */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4"
          >
            Begin Preparing for a Career Now!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-700 mb-6 max-w-xl"
          >
            Make a Virtual Appointment to get started.
          </motion.p>

          <div className="flex justify-center md:justify-start gap-4">
            <button className="px-6 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition">
              Apply Online 🎓
            </button>
            <button className="px-6 py-3 text-blue-800 font-semibold rounded-lg border border-blue-800 hover:bg-blue-50 transition">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 mb-10 md:mb-0 flex justify-center md:justify-end relative">
          <motion.img
            src="/images/student_graduation.png"
            alt="Happy Graduate"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md md:max-w-xl relative z-10"
          />
          {/* Circle behind image */}
          <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400 rounded-full -z-10"></div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
