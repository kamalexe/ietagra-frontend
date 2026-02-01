import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../../utils/animations';

const SectionWrapper = ({
    badge,
    title,
    underlineColor,
    description,
    backgroundImage,
    gradient,
    buttons,
    children,
    className = ""
}) => {
    // If there's a background image or gradient, we might want a container
    const containerClasses = `relative ${gradient || ''} ${className}`;
    const bgImageStyle = backgroundImage ? { backgroundImage: `url('${backgroundImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};

    // Decide text colors based on background (heuristic: if gradient/bg is present, assume dark bg/light text, else light bg/dark text)
    // This is a simplification; ideally we'd have a 'theme' prop (light/dark)
    const isDarkBg = !!(gradient || backgroundImage);
    const textColor = isDarkBg ? 'text-white' : 'text-gray-800';
    const descColor = isDarkBg ? 'text-gray-200' : 'text-gray-600';

    return (
        <div className={containerClasses} style={bgImageStyle}>
            {/* Overlay if bg image is present to ensure text readability */}
            {backgroundImage && (
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            )}

            <div className="container mx-auto max-w-6xl px-4 py-16 relative z-10">
                {/* Header Section */}
                {(title || badge || description) && (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="text-center mb-12"
                    >
                        {badge && (
                            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${isDarkBg ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'}`}>
                                {badge}
                            </span>
                        )}

                        {title && (
                            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${textColor}`}>
                                {title}
                            </h2>
                        )}

                        {underlineColor && (
                            <div className={`w-24 h-1.5 bg-gradient-to-r ${underlineColor} mx-auto mb-6 rounded-full opacity-80`}></div>
                        )}

                        {description && (
                            <p className={`max-w-3xl mx-auto text-base md:text-lg leading-relaxed ${descColor}`}>
                                {description}
                            </p>
                        )}

                        {/* Header Buttons (if any specific to the header, distinct from content) */}
                        {buttons && buttons.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-4 mt-6">
                                {buttons.map((btn, idx) => (
                                    <a
                                        key={idx}
                                        href={btn.link || '#'}
                                        className={`px-6 py-2 rounded-lg font-medium transition-colors shadow-lg ${btn.primary
                                            ? (isDarkBg ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-blue-600 text-white hover:bg-blue-700')
                                            : (isDarkBg ? 'bg-transparent border border-white text-white hover:bg-white/10' : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50')}`}
                                    >
                                        {btn.text}
                                    </a>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* content */}
                {children}
            </div>
        </div>
    );
};

export default SectionWrapper;
