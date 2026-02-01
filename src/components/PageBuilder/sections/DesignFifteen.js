import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DesignFifteen = ({ id, items = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (items.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [items.length]);

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <section id={id} className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-xl mb-4 bg-gray-100">
                <AnimatePresence mode="popLayout">
                    {items.map((item, index) => (
                        currentIndex === index && (
                             <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                                className="absolute inset-0"
                            >
                                <img 
                                    src={item.image} 
                                    alt={item.title || "Slide"} 
                                    className="w-full h-full object-cover"
                                />
                                {(item.title || item.description) && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                                        <div className="p-8 text-white w-full">
                                            {item.title && <h3 className="text-2xl font-bold mb-2">{item.title}</h3>}
                                            {item.description && <p className="text-lg">{item.description}</p>}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )
                    ))}
                </AnimatePresence>

                {items.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                        {items.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default DesignFifteen;
