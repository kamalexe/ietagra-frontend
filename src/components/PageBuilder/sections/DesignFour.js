// src/components/PageBuilder/sections/DesignFour.js
import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../../../utils/animations';
import { FaAward } from 'react-icons/fa';

import SectionWrapper from '../SectionWrapper';

const DesignFour = ({ title, description, facultyMembers, members, items, badge, underlineColor, variant, backgroundImage, buttons, gradient }) => {
  const dataItems = facultyMembers || members || items || [];

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <SectionWrapper
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
        className="mb-16"
      >

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {dataItems.map((item, index) => {
            // Map generic fields if specific ones are missing
            const name = item.name || item.title;
            const position = item.position || item.subtitle;
            const qualification = item.qualification || item.meta;
            const specialization = item.specialization || item.description;

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  boxShadow:
                    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  transition: { duration: 0.3 },
                }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
              >
                <div className="h-1.5 bg-gradient-to-r from-green-500 to-teal-600"></div>
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
                    <div className="w-32 h-32 mx-auto sm:mx-0 sm:mr-6 mb-6 sm:mb-0 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border-4 border-green-50 relative">
                      <img
                        src={item.image}
                        alt={name}
                        className="w-full object-cover object-center translate-y-2"
                        onError={(e) => {
                          e.target.src = '/images/placeholder-faculty.jpg';
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-1">{name}</h4>
                      <p className="text-sm text-green-600 font-medium mb-2">
                        {position}
                        {item.additionalRole && (
                          <span className="ml-1">({item.additionalRole})</span>
                        )}
                      </p>
                      {qualification && (
                        <p className="text-gray-500 text-sm mb-1">
                          <span className="font-medium">Qualification:</span> {qualification}
                        </p>
                      )}
                      {specialization && (
                        <p className="text-gray-500 text-sm mb-1">
                          <span className="font-medium">Specialization:</span>{' '}
                          {specialization}
                        </p>
                      )}
                      {item.experience && (
                        <p className="text-gray-500 text-sm mb-1">
                          <span className="font-medium">Experience:</span> {item.experience}
                        </p>
                      )}
                      {item.publications && (
                        <div className="mt-3 flex items-center text-xs text-gray-500">
                          <FaAward className="text-green-500 mr-1" />
                          <span>{item.publications}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </SectionWrapper>
  );
};

export default DesignFour;
