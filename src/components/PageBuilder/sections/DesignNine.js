import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// import { fadeIn } from '../../../utils/animations';
import * as FaIcons from 'react-icons/fa';
import ResearchService from '../../../services/ResearchService';

import SectionWrapper from '../SectionWrapper';

const DesignNine = ({ id, title, variant = 'simple', items: initialItems = [], cards, columns = 2, badge, underlineColor, description, backgroundImage, buttons, gradient, departmentId, dataSource }) => {
    const [items, setItems] = useState(initialItems || cards || []);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (dataSource === 'research' && departmentId) {
            const fetchResearch = async () => {
                setLoading(true);
                try {
                    const data = await ResearchService.getAllResearch({ department: departmentId });
                    // Map research model to design_nine item structure
                    const formatted = data.map(r => ({
                        title: r.title,
                        subtitle: r.authors?.join(', ') || r.type,
                        description: r.description || r.abstract,
                        date: r.year || new Date(r.date).getFullYear(),
                        meta: r.journal || r.publisher,
                        icon: 'FaBook'
                    }));
                    setItems(formatted);
                } catch (error) {
                    console.error("DesignNine: Failed to fetch research", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchResearch();
        } else {
            setItems(initialItems || cards || []);
        }
    }, [initialItems, cards, departmentId, dataSource]);

    const dataItems = items || [];

    if (loading) return <div className="text-center py-10">Loading items...</div>;

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

            {dataItems.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No items found.</p>
                </div>
            ) : (
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
                                <p className="text-blue-600 text-sm mb-1">{item.subtitle}</p>
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
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-3 px-6">
                                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                                </div>
                                <div className="p-6">
                                    <div className="flex flex-col h-full">
                                        <p className="text-gray-600 flex-grow mb-4">{item.description}</p>
                                        <div className="text-sm text-gray-500 mt-auto">
                                            <span className="bg-blue-50 text-blue-700 py-1 px-2 rounded-full">
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
                            <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                            <div className="p-6">
                                {Icon && (
                                    <div className="mb-4">
                                        <div className="bg-blue-50 rounded-full p-3 inline-block">
                                            <Icon className="text-blue-600 text-2xl" />
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
            )}
        </SectionWrapper >
    );
};

export default DesignNine;
