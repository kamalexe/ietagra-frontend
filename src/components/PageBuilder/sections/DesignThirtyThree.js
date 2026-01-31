import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import EventService from '../../../services/EventService';
import { CalendarDaysIcon, MapPinIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { fadeIn, staggerContainer } from '../../../utils/animations';

const DesignThirtyThree = ({ id, title, subtitle, badge, departmentId }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                let params = {};
                if (departmentId) {
                    params.department = departmentId;
                }
                const data = await EventService.getAllEvents(params);
                setEvents(data);
            } catch (error) {
                console.error("DesignThirtyThree: Failed to fetch events", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [departmentId]);

    if (loading) return (
        <div id={id} className="py-20 flex justify-center">
            <div className="animate-pulse space-y-4 w-full max-w-7xl px-4">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-96 bg-gray-200 rounded-xl"></div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (events.length === 0) return null;

    return (
        <section id={id} className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    {badge && (
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold tracking-wide uppercase mb-2">
                            {badge}
                        </span>
                    )}
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {title || "Upcoming Events"}
                    </h2>
                    {subtitle && (
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    )}
                </div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {events.map((event) => (
                        <motion.div
                            key={event._id}
                            variants={fadeIn}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group border border-gray-100"
                        >
                            {/* Image Container */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={event.image || "https://via.placeholder.com/400x300?text=Event"}
                                    alt={event.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm uppercase tracking-wide">
                                    {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                    {event.title}
                                </h3>

                                <div className="space-y-3 mb-6 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <CalendarDaysIcon className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                                        <span>
                                            {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPinIcon className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                                        <span className="truncate">{event.place}</span>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-500 group-hover:text-indigo-600 transition-colors">
                                        View Details
                                    </span>
                                    <Link
                                        to={`/events/${event.slug || event._id}`}
                                        className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors"
                                    >
                                        <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {events.length > 3 && (
                    <div className="mt-12 text-center">
                        <Link
                            to="/events"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-600 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                        >
                            View All Events
                            <ArrowRightIcon className="h-4 w-4" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default DesignThirtyThree;
