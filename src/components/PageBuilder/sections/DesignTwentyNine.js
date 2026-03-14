import React from 'react';
import { motion } from 'framer-motion';

const DesignTwentyNine = ({ id,
    title = "Announcements",
    announcements = [],
    themeColor = "bg-red-600",
    speed = "20s"
}) => {
    // Defensive check and duplication for marquee
    const safeAnnouncements = Array.isArray(announcements) ? announcements : [];

    // Convert speed string to seconds number if possible, default to 20
    const duration = parseFloat(speed) || 20;

    return (
        <section id={id} className="bg-white border-y border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-stretch h-12 md:h-14">
                {/* Fixed Label/Icon Side */}
                <div className={`${themeColor} text-white flex items-center px-4 md:px-6 relative z-10 shadow-lg shrink-0`}>
                    <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm md:text-base">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 md:h-6 md:w-6" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                        <span className="hidden sm:inline">{title}</span>
                    </div>
                </div>

                {/* Marquee Content */}
                <div className="relative flex-1 bg-gray-50 overflow-hidden flex items-center">
                    <motion.div
                        className="flex items-center whitespace-nowrap"
                        animate={{ x: [0, -1000] }} // Simplified logic, will adjust based on content if needed or use infinite loop
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: duration,
                                ease: "linear",
                            },
                        }}
                        style={{ width: 'max-content' }}
                    >
                        {/* First Set */}
                        <div className="flex items-center">
                            {safeAnnouncements.map((item, idx) => (
                                <div key={idx} className="flex items-center px-8 md:px-12">
                                    <span className="shrink-0 w-2 h-2 rounded-full bg-red-500 mr-3"></span>
                                    {item.link ? (
                                        <a 
                                            href={item.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-gray-800 font-medium hover:text-blue-600 hover:underline transition-colors text-sm md:text-base"
                                        >
                                            {item.text}
                                        </a>
                                    ) : (
                                        <span className="text-gray-800 font-medium text-sm md:text-base">{item.text}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* Duplicate for seamless scrolling */}
                        <div className="flex items-center" aria-hidden="true">
                            {safeAnnouncements.map((item, idx) => (
                                <div key={`dup-${idx}`} className="flex items-center px-8 md:px-12">
                                    <span className="shrink-0 w-2 h-2 rounded-full bg-red-500 mr-3"></span>
                                    {item.link ? (
                                        <a 
                                            href={item.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-gray-800 font-medium hover:text-blue-600 hover:underline transition-colors text-sm md:text-base"
                                        >
                                            {item.text}
                                        </a>
                                    ) : (
                                        <span className="text-gray-800 font-medium text-sm md:text-base">{item.text}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default DesignTwentyNine;
