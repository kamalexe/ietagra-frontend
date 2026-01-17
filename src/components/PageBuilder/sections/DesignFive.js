// src/components/PageBuilder/sections/DesignFive.js
import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../../../utils/animations';
import { FaChartLine } from 'react-icons/fa';

const DesignFive = ({ title, description, swotData, data }) => {
  const finalData = swotData || data || {};
  return (
    <div className="container mx-auto max-w-6xl px-4 mb-12">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="mb-12"
      >
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
          <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-teal-600 mx-auto mb-4 rounded-full"></div>
          {description && (
            <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
          )}
        </div>

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
    </div>
  );
};

export default DesignFive;
