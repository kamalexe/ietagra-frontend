import React from 'react';
import { motion } from 'framer-motion';
import * as FaIcons from 'react-icons/fa';
import SectionWrapper from '../SectionWrapper';

const DesignThirtyNine = ({ id, badge, title, underlineColor, description, backgroundImage, gradient, stats = [] }) => {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <SectionWrapper
            id={id}
            badge={badge}
            title={title}
            underlineColor={underlineColor}
            description={description}
            backgroundImage={backgroundImage}
            gradient={gradient}
            className="py-12"
        >
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                {stats && stats.map((stat, index) => {
                    const Icon = FaIcons[stat.icon];
                    return (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="relative group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center overflow-hidden"
                        >
                            {/* Decorative Background Blob */}
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"></div>

                            {/* Icon Container */}
                            <div className="relative mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                                    {Icon ? <Icon className="text-3xl" /> : <FaIcons.FaChartBar className="text-3xl" />}
                                </div>
                            </div>

                            {/* Value */}
                            <div className="relative">
                                <h3 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                                    {stat.value}
                                </h3>
                                {/* Simple underline decoration */}
                                <div className="h-1 w-8 bg-blue-600/20 mx-auto rounded-full group-hover:w-16 group-hover:bg-blue-600/40 transition-all duration-500"></div>
                            </div>

                            {/* Label */}
                            <p className="mt-4 text-gray-500 font-medium uppercase tracking-wider text-xs">
                                {stat.label}
                            </p>
                        </motion.div>
                    );
                })}

                {(!stats || stats.length === 0) && (
                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400">No statistics provided. Please add them in the admin panel.</p>
                    </div>
                )}
            </motion.div>
        </SectionWrapper>
    );
};

export default DesignThirtyNine;
