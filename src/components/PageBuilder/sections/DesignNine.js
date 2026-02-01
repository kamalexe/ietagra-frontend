// src/components/PageBuilder/sections/DesignNine.js
import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../../../utils/animations';
import * as FaIcons from 'react-icons/fa';

import SectionWrapper from '../SectionWrapper';

const DesignNine = ({ id, title, variant = 'simple', items, cards, columns = 2, badge, underlineColor, description, backgroundImage, buttons, gradient }) => {
    const dataItems = items || cards || [];

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    };

    const getGridClass = () => {
        switch (columns) {
            case 3: return 'grid-cols-1 md:grid-cols-3';
            case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
            case 2: default: return 'grid-cols-1 md:grid-cols-2';
        }
    };

    return (
        <SectionWrapper id={id}
            badge={badge}
            title={title}
            underlineColor={underlineColor}
            description={description}
            backgroundImage={backgroundImage}
            gradient={gradient}
            buttons={buttons}
            className="mb-16"
        >

            <motion.div
                className={`grid ${getGridClass()} gap-6`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {dataItems.map((item, index) => {
                    // Variant: Publication / Book Chapter
                    if (variant === 'publication') {
                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                            >
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h4>
                                <p className="text-teal-600 text-sm mb-1">{item.subtitle}</p>
                                <p className="text-gray-500 text-sm">
                                    <span className="font-medium">{item.meta}</span> {item.date}
                                </p>
                            </motion.div>
                        );
                    }

                    // Variant: Visit / Card with Image or Header
                    if (variant === 'visit') {
                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="bg-white rounded-xl shadow-lg overflow-hidden"
                            >
                                <div className="bg-gradient-to-r from-green-500 to-teal-600 py-3 px-6">
                                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                                </div>
                                <div className="p-6">
                                    <div className="flex flex-col h-full">
                                        <p className="text-gray-600 flex-grow mb-4">{item.description}</p>
                                        <div className="text-sm text-gray-500 mt-auto">
                                            <span className="bg-teal-50 text-teal-700 py-1 px-2 rounded-full">
                                                {item.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    }

                    // Default / Simple Icon Card
                    const Icon = FaIcons[item.icon];
                    return (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                        >
                            <div className="h-1.5 bg-gradient-to-r from-green-500 to-teal-600"></div>
                            <div className="p-6">
                                {Icon && (
                                    <div className="mb-4">
                                        <div className="bg-teal-50 rounded-full p-3 inline-block">
                                            <Icon className="text-teal-600 text-2xl" />
                                        </div>
                                    </div>
                                )}
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </SectionWrapper >
    );
};

export default DesignNine;
