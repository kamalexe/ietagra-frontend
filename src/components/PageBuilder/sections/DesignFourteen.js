import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../../../utils/animations';

import SectionWrapper from '../SectionWrapper';

const DesignFourteen = ({ title, items, badge, underlineColor, description, variant, backgroundImage, buttons, gradient }) => {
    // Expected Item Properties:
    // - title: string
    // - description: string
    // - link: string (URL)
    // - target: string ('_blank' or '_self')
    // - icon: string (emoji or icon name)
    // - gradient: string (Tailwind gradient classes)
    const dataItems = items || [];

    return (
        <SectionWrapper
            badge={badge}
            title={title}
            underlineColor={underlineColor}
            description={description}
            backgroundImage={backgroundImage}
            gradient={gradient}
            buttons={buttons}
        >

            <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                {dataItems.map((item, index) => (
                    <motion.a 
                        key={index}
                        href={item.link || '#'}
                        target={item.target || '_self'}
                        rel={item.target === '_blank' ? 'noopener noreferrer' : ''}
                        variants={fadeIn}
                        className="group block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white"
                    >
                        <div className={`h-20 bg-gradient-to-r ${item.gradient || 'from-yellow-500 to-orange-400'} flex items-center justify-center text-4xl`}>
                            <span className="filter drop-shadow-lg">{item.icon || '📈'}</span>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {item.description}
                            </p>
                            <div className="flex justify-end">
                                <span className="text-blue-600 font-medium inline-flex items-center group-hover:underline">
                                    Learn more
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </motion.a>
                ))}
            </motion.div>
        </SectionWrapper >
    );
};

export default DesignFourteen;
