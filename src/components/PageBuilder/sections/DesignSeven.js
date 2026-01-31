// src/components/PageBuilder/sections/DesignSeven.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../../../utils/animations';
import * as FaIcons from 'react-icons/fa';
// Circular dependency is handled by accessing this inside the component or using a context if needed.
// However, relying on the fact that imports are cached objects.
import SectionRegistry from '../SectionRegistry';

const DesignSeven = ({ id, tabs }) => {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id);

  const activeTab = tabs.find((t) => t.id === activeTabId);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div id={id} className="container mx-auto max-w-6xl px-4 mb-16">
       {/* Tab Buttons */}
       <div className="flex justify-center mb-10 overflow-x-auto">
          <div className="inline-flex bg-white rounded-xl shadow-md p-1.5">
            {tabs.map((tab) => {
              const Icon = FaIcons[tab.icon];
              return (
                <button id={id}
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`px-4 py-2.5 rounded-lg transition-all duration-300 whitespace-nowrap flex items-center ${
                    activeTabId === tab.id
                      ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white font-medium shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                   {Icon && <Icon className="mr-2" />}
                   {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
           key={activeTabId}
           variants={containerVariants}
           initial="hidden"
           animate="visible"
           className="min-h-[400px]"
        >
            {activeTab && activeTab.sections && activeTab.sections.map(section => {
                 const Component = SectionRegistry[section.templateKey];
                 if (!Component) return null;
                 return <Component key={section.id} {...section.data} />;
            })}
        </motion.div>
    </div>
  );
};

export default DesignSeven;
