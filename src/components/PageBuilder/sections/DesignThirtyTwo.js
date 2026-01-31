import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, staggerContainer } from '../../../utils/animations';
import GalleryService from '../../../services/GalleryService';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';

const DesignThirtyTwo = ({ id, title, subtitle, badge, eventId }) => {
    const [images, setImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Events", "Campus", "Academic", "Sports", "Others"];

    useEffect(() => {
        const fetchCommonGallery = async () => {
            try {
                let params = {};
                if (eventId) {
                    params.event = eventId;
                } else {
                    params.common = true;
                }
                const data = await GalleryService.getGalleryImages(params);
                setImages(data);
                setFilteredImages(data);
            } catch (error) {
                console.error("DesignThirtyTwo: Failed to load common gallery images", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCommonGallery();
    }, [eventId]);

    const openLightbox = (index) => {
        setSelectedImageIndex(index);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedImageIndex(null);
        document.body.style.overflow = 'unset';
    };

    const nextImage = (e) => {
        e.stopPropagation();
        setSelectedImageIndex((prev) => (prev + 1) % filteredImages.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setSelectedImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category === "All") {
            setFilteredImages(images);
        } else {
            setFilteredImages(images.filter(img => img.category === category));
        }
    };

    if (loading) return (
        <div id={id} className="py-20 flex justify-center">
            <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="h-32 w-32 bg-gray-200 rounded"></div>
                    <div className="h-32 w-32 bg-gray-200 rounded"></div>
                    <div className="h-32 w-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );

    if (images.length === 0 && !loading) return null; // Don't render empty section (if no images at all)

    const displayedImages = filteredImages;
    const selectedImage = selectedImageIndex !== null ? displayedImages[selectedImageIndex] : null;

    return (
        <section id={id} className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    {badge && (
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold tracking-wide uppercase mb-2">
                            {badge}
                        </span>
                    )}
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {title || "Campus Gallery"}
                    </h2>
                    {subtitle && (
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Category Filter - Only show if NO eventId is present */}
                {!eventId && (
                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === cat
                                    ? "bg-indigo-600 text-white shadow-md transform scale-105"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {displayedImages.map((item, index) => (
                        <motion.div
                            key={item._id}
                            variants={fadeIn}
                            className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all"
                            onClick={() => openLightbox(index)}
                        >
                            <img
                                src={item.imageUrl}
                                alt={item.title || "Gallery Image"}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <MagnifyingGlassPlusIcon className="h-10 w-10 text-white transform scale-75 group-hover:scale-100 transition-transform" />
                            </div>

                            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-white font-medium truncate">{item.title}</p>
                                {item.category && <p className="text-white/80 text-xs">{item.category}</p>}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
                        onClick={closeLightbox}
                    >
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all z-[101]"
                        >
                            <XMarkIcon className="h-8 w-8" />
                        </button>

                        <button
                            onClick={prevImage}
                            className="absolute left-4 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all z-[101] hidden md:block"
                        >
                            <ChevronLeftIcon className="h-8 w-8" />
                        </button>

                        <button
                            onClick={nextImage}
                            className="absolute right-4 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all z-[101] hidden md:block"
                        >
                            <ChevronRightIcon className="h-8 w-8" />
                        </button>

                        <div className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
                            <img
                                src={selectedImage.imageUrl}
                                alt={selectedImage.title}
                                className="max-w-full max-h-[80vh] object-contain rounded shadow-2xl"
                            />
                            {selectedImage.title && (
                                <div className="mt-4 text-center">
                                    <h3 className="text-white text-xl font-semibold">{selectedImage.title}</h3>
                                    {selectedImage.description && <p className="text-white/70 mt-2">{selectedImage.description}</p>}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default DesignThirtyTwo;
