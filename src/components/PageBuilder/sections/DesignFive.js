// src/components/PageBuilder/sections/DesignFive.js
import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../../../utils/animations';
import { FaChartLine } from 'react-icons/fa';

import SectionWrapper from '../SectionWrapper';

const DesignFive = ({ id, title, description, swotData, data, badge, underlineColor, variant, backgroundImage, buttons, gradient }) => {
  const finalData = swotData || data || {};
  return (
    <SectionWrapper id={id}
      badge={badge}
      title={title}
      underlineColor={underlineColor || 'from-green-500 to-teal-600'}
      description={description}
      backgroundImage={backgroundImage}
      gradient={gradient}
      buttons={buttons}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="mb-12"
      >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          {swotData.strengths && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 py-3 px-6">
                <h4 className="text-white font-bold text-lg flex items-center">
                  <FaChartLine className="mr-2" /> Strengths
                </h4>
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  {swotData.strengths.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Weaknesses */}
          {swotData.weaknesses && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-500 to-amber-600 py-3 px-6">
                <h4 className="text-white font-bold text-lg flex items-center">
                  <FaChartLine className="mr-2" /> Weaknesses
                </h4>
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  {swotData.weaknesses.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Opportunities */}
          {swotData.opportunities && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 py-3 px-6">
                <h4 className="text-white font-bold text-lg flex items-center">
                  <FaChartLine className="mr-2" /> Opportunities
                </h4>
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  {swotData.opportunities.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Threats */}
          {swotData.threats && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-rose-600 py-3 px-6">
                <h4 className="text-white font-bold text-lg flex items-center">
                  <FaChartLine className="mr-2" /> Threats
                </h4>
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  {swotData.threats.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </SectionWrapper>
  );
};

export default DesignFive;
