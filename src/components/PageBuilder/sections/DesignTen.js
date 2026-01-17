import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../../../utils/animations';

const DesignTen = ({ title, description, features = [], bgColor = 'bg-gray-50' }) => {
    return (
        <section className={`py-16 ${bgColor}`}>
            <div className="container mx-auto px-4">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    {title && <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>}
                    {description && <p className="text-lg text-gray-600">{description}</p>}
                </motion.div>

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
            </div>
        </section>
    );
};

export default DesignTen;
