import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../../../utils/animations';
import DepartmentService from '../../../services/DepartmentService';

const DesignThirteen = ({ id, title }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const depts = await DepartmentService.getPublishedDepartments();
                const formattedItems = depts.map(dept => ({
                    title: dept.name,
                    description: dept.description || "Learn more about our core departments and academic excellence.",
                    link: `/${dept.slug}`,
                    icon: '🏛️', // Default icon for departments
                    gradient: 'from-blue-600 to-indigo-700'
                }));
                setItems(formattedItems);
            } catch (error) {
                console.error("Failed to fetch departments for DesignThirteen:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDepartments();
    }, []);

    if (loading) {
        return (
            <div id={id} className="py-20 flex justify-center items-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <section id={id} className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {title && (
                <motion.h2 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12 relative"
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        {title}
                    </span>
                    <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 mx-auto mt-2"></div>
                </motion.h2>
            )}

            <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {items.map((item, index) => (
                    <motion.a 
                        key={index}
                        href={item.link || '#'}
                        variants={fadeIn}
                        className="group block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white"
                    >
                        <div className={`h-20 bg-gradient-to-r ${item.gradient || 'from-blue-500 to-indigo-500'} flex items-center justify-center text-4xl`}>
                            <span className="filter drop-shadow-lg">{item.icon || '⭐'}</span>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-3">
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
        </section>
    );
};

export default DesignThirteen;
