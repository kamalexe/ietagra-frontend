import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPinIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import CampusService from '../../../services/CampusService';
import SectionWrapper from '../SectionWrapper';
import { fadeIn, staggerContainer } from '../../../utils/animations';

const DesignThirtyEight = ({ id, badge, title, underlineColor, description, variant, backgroundImage, buttons, gradient }) => {
    const [campuses, setCampuses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampuses = async () => {
            try {
                const data = await CampusService.getAllCampuses();
                setCampuses(data);
            } catch (err) {
                console.error('Failed to load campuses for grid:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCampuses();
    }, []);

    if (loading) {
        return (
            <div className="py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-500 font-medium">Loading Campuses...</p>
            </div>
        );
    }

    return (
        <SectionWrapper
            id={id}
            badge={badge || "Our Presence"}
            title={title || "University Campuses"}
            underlineColor={underlineColor || "from-blue-600 to-indigo-600"}
            description={description || "Explore our multiple campuses across Agra, each offering unique courses and world-class facilities."}
            backgroundImage={backgroundImage}
            gradient={gradient}
            buttons={buttons}
        >
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
                {campuses.map((campus, index) => (
                    <motion.div
                        key={campus._id}
                        variants={fadeIn}
                        className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col h-full"
                    >
                        {/* Image Section */}
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={campus.image || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800'}
                                alt={campus.name}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute top-4 left-4">
                                <span className="bg-white/90 backdrop-blur-md text-blue-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                                    Campus {index + 1}
                                </span>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                                {campus.name}
                            </h3>

                            <div className="flex items-center text-gray-500 text-sm mb-2">
                                <MapPinIcon className="h-4 w-4 mr-1.5 text-red-500 flex-shrink-0" />
                                <span className="truncate">{campus.address}</span>
                            </div>

                            {campus.facilities && campus.facilities.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {campus.facilities.slice(0, 3).map((fac, i) => (
                                        <span key={i} className="bg-gray-50 text-gray-600 text-[10px] px-2 py-0.5 rounded-full border border-gray-100 uppercase tracking-tighter">
                                            {fac}
                                        </span>
                                    ))}
                                    {campus.facilities.length > 3 && (
                                        <span className="text-[10px] text-gray-400">+{campus.facilities.length - 3} move</span>
                                    )}
                                </div>
                            )}

                            {campus.description && (
                                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2">
                                    {campus.description}
                                </p>
                            )}

                            <div className="flex items-center gap-3 mb-6">
                                {campus.phone && (
                                    <div title={campus.phone} className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                        </svg>
                                    </div>
                                )}
                                {campus.email && (
                                    <div title={campus.email} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                        </svg>
                                    </div>
                                )}
                                {campus.mapUrl && (
                                    <div title="View on Map" className="p-2 bg-red-50 text-red-600 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6.75V15m-10.5 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25h-15a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                                <Link
                                    to={`/campus/${campus.slug}`}
                                    className="inline-flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300"
                                >
                                    Explore Campus
                                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                                </Link>
                            </div>
                        </div>

                        {/* Subtle bottom line decoration */}
                        <div className="absolute bottom-0 left-0 h-1 w-0 bg-blue-600 group-hover:w-full transition-all duration-500"></div>
                    </motion.div>
                ))}
            </motion.div>
        </SectionWrapper>
    );
};

export default DesignThirtyEight;
