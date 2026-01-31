import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../../../utils/animations';

import SectionWrapper from '../SectionWrapper';

const DesignTen = ({ id, title, description, features = [], bgColor, badge, underlineColor, variant, backgroundImage, buttons, gradient }) => {
    return (
        <SectionWrapper id={id}
            badge={badge}
            title={title}
            underlineColor={underlineColor}
            description={description}
            backgroundImage={backgroundImage}
            gradient={gradient || (bgColor ? '' : undefined)} // fallback if needed
            buttons={buttons}
            className={bgColor}
        >

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={fadeIn}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg mb-4 text-2xl">
                                {feature.icon || '★'}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
        </SectionWrapper>
    );
};

export default DesignTen;
