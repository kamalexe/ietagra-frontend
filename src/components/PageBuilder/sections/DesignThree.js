// src/components/PageBuilder/sections/DesignThree.js
import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../../../utils/animations';
import * as FaIcons from 'react-icons/fa';

const DesignThree = ({ cards, items }) => {
  const dataItems = cards || items || [];
  return (
    <div className="container mx-auto max-w-6xl px-4 mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {dataItems.map((card, index) => {
          const Icon = FaIcons[card.icon];
          const colorTheme = card.colorTheme || 'green';

          // Define gradients based on theme
          let gradient = 'from-green-500 to-teal-600';
          let iconBg = 'bg-green-100';
          let iconColor = 'text-green-600';
          let bulletColor = 'text-green-500';

          if (colorTheme === 'teal') {
            gradient = 'from-teal-500 to-cyan-600';
            iconBg = 'bg-teal-100';
            iconColor = 'text-teal-600';
            bulletColor = 'text-teal-500';
          }

          return (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            >
              <div className={`h-2 bg-gradient-to-r ${gradient}`}></div>
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0">
                    <div className={`${iconBg} rounded-full p-3`}>
                      {Icon && <Icon className={`text-2xl ${iconColor}`} />}
                    </div>
                  </div>
                  <h3 className="ml-4 text-2xl font-bold text-gray-800">{card.title}</h3>
                </div>

                {card.content ? (
                  <p className="text-gray-600 leading-relaxed">{card.content}</p>
                ) : card.listItems ? (
                  <ul className="text-gray-600 leading-relaxed space-y-2">
                    {card.listItems.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className={`${bulletColor} mr-2`}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DesignThree;
