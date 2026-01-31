import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../../../utils/animations';

const DesignEleven = ({ id, title, description, image, buttonText, buttonLink, reverse = false, bgColor = 'bg-white' }) => {
    return (
        <section id={id} className={`py-16 ${bgColor} overflow-hidden`}>
            <div className="container mx-auto px-4">
                <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}>
                    
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="w-full lg:w-1/2"
                    >
                        {image ? (
                           <img src={image} alt={title} className="rounded-2xl shadow-xl w-full object-cover h-[400px]" />
                        ) : (
                            <div className="h-[400px] bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
                                No Image Provided
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="w-full lg:w-1/2"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{title}</h2>
                        <div className="w-20 h-1.5 bg-indigo-600 rounded-full mb-8"></div>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            {description}
                        </p>
                        {buttonText && buttonLink && (
                            <a
                                href={buttonLink}
                                className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                            >
                                {buttonText}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        )}
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default DesignEleven;
