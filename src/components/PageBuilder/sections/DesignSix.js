// src/components/PageBuilder/sections/DesignSix.js
import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../../../utils/animations';
import * as FaIcons from 'react-icons/fa';

const DesignSix = ({ title, items, cards }) => {
    const dataItems = items || cards || [];
    return (
        <div className="container mx-auto max-w-6xl px-4">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="bg-gradient-to-br from-green-600 to-teal-700 rounded-2xl shadow-xl p-8 text-white overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full opacity-5 -mt-20 -mr-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full opacity-5 -mb-20 -ml-20"></div>

                <h3 className="text-2xl font-bold text-center mb-8 relative">{title}</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    {dataItems.map((item, index) => {
                        const Icon = FaIcons[item.icon] || FaIcons['FaInfoCircle'];
                        return (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 hover:transform hover:scale-105">
                                <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Icon className="text-2xl" />
                                </div>
                                <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                                <p className="text-sm text-white/80">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
};

export default DesignSix;
