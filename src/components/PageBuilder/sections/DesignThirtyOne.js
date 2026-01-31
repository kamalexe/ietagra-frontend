import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../../../utils/animations';
import TestimonialService from '../../../services/TestimonialService';
import SectionWrapper from '../SectionWrapper';
import { StarIcon } from '@heroicons/react/24/solid';

const DesignThirtyOne = ({ id, title, subtitle, badge, departmentId, items: initialItems = [] }) => {
    const [testimonials, setTestimonials] = useState(initialItems);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Logic matched with DesignTwelve: Prioritize manual items if they exist
        if (initialItems && initialItems.length > 0) {
            setTestimonials(initialItems);
        } else {
            // Dynamic fetching if no manual items
            const fetchTestimonials = async () => {
                setLoading(true);
                try {
                    let data;
                    if (departmentId) {
                        data = await TestimonialService.getTestimonialsByDepartment(departmentId);
                    } else {
                        data = await TestimonialService.getAllTestimonials();
                    }
                    setTestimonials(data);
                } catch (error) {
                    console.error("DesignThirtyOne: Failed to fetch testimonials", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchTestimonials();
        }
    }, [initialItems, departmentId]);

    const renderMedia = (item) => {
        if (item.type === 'video' && item.videoUrl) {
            // Basic YouTube URL to Embed conversion
            const videoId = item.videoUrl.split('v=')[1]?.split('&')[0] || item.videoUrl.split('/').pop();
            return (
                <div id={id} className="aspect-video w-full rounded-lg overflow-hidden mb-4 shadow-inner bg-black">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            );
        }
        if (item.type === 'image' && item.image) {
            return (
                <div id={id} className="w-full h-48 rounded-lg overflow-hidden mb-4 shadow-inner">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
            );
        }
        return null;
    };

    return (
        <SectionWrapper id={id}
            title={title || "What Our Students Say"}
            description={subtitle}
            badge={badge || "Testimonials"}
        >
            {loading ? (
                <div className="text-center py-12">Loading testimonials...</div>
            ) : (
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={item._id || index}
                            variants={fadeIn}
                            className="bg-white rounded-2xl shadow-xl p-6 flex flex-col border border-gray-100 hover:border-blue-200 transition-colors"
                        >
                            {renderMedia(item)}

                            <div className="flex-grow">
                                <p className="text-gray-700 italic mb-4 leading-relaxed">
                                    "{item.message}"
                                </p>
                            </div>

                            <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 mr-3 border border-gray-200">
                                        {item.image && item.type !== 'image' ? (
                                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold uppercase">
                                                {item.name?.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm leading-tight">{item.name}</h4>
                                        <p className="text-blue-600 text-xs font-medium">{item.role}</p>
                                    </div>
                                </div>

                                <div className="flex text-yellow-400">
                                    {[...Array(item.rating || 5)].map((_, i) => (
                                        <StarIcon key={i} className="h-4 w-4" />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
            {testimonials.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500 italic">
                    No testimonials available yet.
                </div>
            )}
        </SectionWrapper>
    );
};

export default DesignThirtyOne;
