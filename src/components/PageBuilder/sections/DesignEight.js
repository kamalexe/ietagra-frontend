// src/components/PageBuilder/sections/DesignEight.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// import { fadeIn } from '../../../utils/animations';
import * as FaIcons from 'react-icons/fa';

import SectionWrapper from '../SectionWrapper';

const DesignEight = ({ id, title, content, images, features, badge, underlineColor, variant, backgroundImage, buttons, gradient }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate images
  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <SectionWrapper id={id}
      badge={badge}
      title={title}
      underlineColor={underlineColor || 'from-green-500 to-teal-600'}
      description={content}
      backgroundImage={backgroundImage}
      gradient={gradient}
      buttons={buttons}
    >

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="my-10 bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Carousel */}
            <div className="relative h-72 md:h-full md:min-h-[28rem] bg-gray-800 overflow-hidden">
               {images && images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: index === currentSlide ? 1 : 0,
                    scale: index === currentSlide ? 1 : 1.05,
                  }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                  className="absolute inset-0 h-full w-full flex items-center justify-center"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-contain p-2"
                    onError={(e) => { e.target.src = '/images/placeholder-lab.jpg'; }}
                  />
                </motion.div>
              ))}

              {/* Indicators */}
               {images && images.length > 1 && (
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 z-10">
                    {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => { e.preventDefault(); setCurrentSlide(index); }}
                        className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                    ))}
                </div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            {/* Content Side */}
            <div className="p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-green-500 pl-4">
                {title || 'Infrastructure'}
              </h3>

              <div className="space-y-5">
                 {/* Re-render content if it was passed here explicitly for split view context */}
                 <p className="text-gray-600 leading-relaxed">
                   {content || 'Our department is well-equipped with modern facilities.'}
                 </p>

                 {features && (
                    <div className="grid grid-cols-1 gap-4 mt-6">
                        {features.map((feat, i) => {
                             const Icon = FaIcons[feat.icon] || FaIcons['FaInfoCircle'];
                             return (
                                <div id={id} key={i} className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                    <Icon className="text-green-500" />
                                    </div>
                                    <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">{feat.title}</p>
                                    <p className="text-xs text-gray-500">{feat.subtitle}</p>
                                    </div>
                                </div>
                             );
                        })}
                    </div>
                 )}
              </div>
            </div>
          </div>
        </motion.div>
    </SectionWrapper>
  );
};

export default DesignEight;
