// src/components/PageBuilder/sections/DesignTwo.js
import React from 'react';
import { motion } from 'framer-motion';
import * as FaIcons from 'react-icons/fa';

const DesignTwo = ({ items, cards }) => {
    const dataItems = items || cards || [];
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return (
        <div className="container mx-auto max-w-6xl px-4 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                {dataItems.map((item, index) => {
                    const Icon = FaIcons[item.icon] || FaIcons['FaInfoCircle'];

                    // Determine colors based on theme if provided, or default to green/teal
                    const bgGradient = item.colorTheme === 'blue' ? 'from-blue-50 to-cyan-50' : 'from-green-50 to-teal-50';
                    const borderColor = item.colorTheme === 'blue' ? 'border-blue-100' : 'border-green-100';
                    const iconColor = item.colorTheme === 'blue' ? 'text-blue-600' : 'text-green-600';

                    return (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className={`bg-gradient-to-br ${bgGradient} p-6 rounded-xl shadow-sm border ${borderColor}`}
                        >
                            <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 shadow-md">
                                <Icon className={`${iconColor} text-2xl`} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">{item.title}</h3>
                            <p className="text-gray-600 text-center">{item.description}</p>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default DesignTwo;
