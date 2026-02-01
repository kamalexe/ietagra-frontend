// src/components/PageBuilder/sections/DesignOne.js
import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../../../utils/animations';

const DesignOne = ({ id, badge, title, underlineColor, description, variant = 'simple', backgroundImage, buttons, gradient }) => {
    // Hero Variant (Rich Banner)
    if (variant === 'hero') {
        return (
            <div id={id} className={`relative overflow-hidden ${gradient || 'bg-gradient-to-r from-gray-900 to-gray-800'} text-white mb-12`}>
                {backgroundImage && (
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${backgroundImage}')` }}></div>
                    </div>
                )}

                <div className="relative container mx-auto px-4 py-16 md:py-24">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{title}</h1>
                        <div className="w-16 sm:w-24 h-1 sm:h-1.5 bg-white/70 mx-auto mb-4 sm:mb-6"></div>
                        {description && (
                            <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
                                {description}
                            </p>
                        )}

                        {buttons && (
                            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                                {buttons.map((btn, idx) => (
                                    <a
                                        key={idx}
                                        href={btn.link}
                                        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors shadow-lg text-sm sm:text-base ${btn.primary ? 'bg-white text-indigo-800 hover:bg-indigo-50' : 'bg-indigo-600 text-white hover:bg-indigo-700 mt-3 sm:mt-0'}`}
                                    >
                                        {btn.text}
                                    </a>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
                        <path fill="#ffffff" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                    </svg>
                </div>
            </div>
        );
    }

    // Default Simple Variant
    return (
        <div id={id} className="container mx-auto max-w-6xl relative z-10 px-4 pt-16 pb-8">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="text-center mb-8"
            >
                {badge && (
                    <span className="inline-block px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-sm font-medium mb-4">
                        {badge}
                    </span>
                )}
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    {title}
                </h2>
                {underlineColor && (
                    <div className={`w-24 h-1.5 bg-gradient-to-r ${underlineColor} mx-auto mb-8 rounded-full`}></div>
                )}
                {description && (
                    <p className="text-gray-600 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
                        {description}
                    </p>
                )}
            </motion.div>
        </div>
    );
};

export default DesignOne;
