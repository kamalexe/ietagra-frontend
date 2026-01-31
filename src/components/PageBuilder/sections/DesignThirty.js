import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhotoIcon, PlayIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import AlbumService from '../../../services/AlbumService';

const DesignThirty = ({ id, title, subtitle, limit = 6, category = "All" }) => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [activeMediaIndex, setActiveMediaIndex] = useState(0);

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const data = await AlbumService.getAlbums();
                let filtered = data;
                if (category !== "All") {
                    filtered = data.filter(a => a.category === category);
                }
                setAlbums(filtered.slice(0, limit));
            } catch (error) {
                console.error("DesignThirty: Failed to load albums", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAlbums();
    }, [category, limit]);

    const openAlbum = (album) => {
        setSelectedAlbum(album);
        setActiveMediaIndex(0);
        document.body.style.overflow = 'hidden';
    };

    const closeAlbum = () => {
        setSelectedAlbum(null);
        document.body.style.overflow = 'unset';
    };

    const nextMedia = () => {
        setActiveMediaIndex((prev) => (prev + 1) % selectedAlbum.media.length);
    };

    const prevMedia = () => {
        setActiveMediaIndex((prev) => (prev - 1 + selectedAlbum.media.length) % selectedAlbum.media.length);
    };

    if (loading) return (
        <div id={id} className="py-20 flex justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
        </div>
    );

    return (
        <section id={id} className="py-20 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4"
                    >
                        {title || "University Media Gallery"}
                    </motion.h2>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full mb-6"
                    />
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        {subtitle || "Exploring campus life through the lens of our students and faculty."}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {albums.map((album, index) => (
                        <motion.div
                            key={album._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative cursor-pointer"
                            onClick={() => openAlbum(album)}
                        >
                            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-indigo-200/50">
                                <img 
                                    src={album.coverImage} 
                                    alt={album.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                
                                <div className="absolute bottom-0 inset-x-0 p-8 transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-600 text-[10px] font-bold text-white uppercase tracking-widest mb-4">
                                        {album.category}
                                    </span>
                                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{album.title}</h3>
                                    <p className="text-white/70 text-sm line-clamp-2 mb-4 group-hover:opacity-100 transition-opacity">
                                        {album.description || "View memories and highlights from this collection."}
                                    </p>
                                    <div className="flex items-center text-white text-xs font-bold gap-2">
                                        <PhotoIcon className="h-4 w-4" />
                                        <span>{album.media?.length || 0} Media Items</span>
                                    </div>
                                </div>

                                <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100 border border-white/20">
                                    <ChevronRightIcon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {albums.length === 0 && (
                    <div className="text-center py-20">
                        <PhotoIcon className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400">No albums found in this category.</p>
                    </div>
                )}
            </div>

            {/* LIGHTBOX OVERLAY */}
            <AnimatePresence>
                {selectedAlbum && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/95 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 bg-black/40 backdrop-blur-md">
                            <div>
                                <h4 className="text-white font-bold text-xl">{selectedAlbum.title}</h4>
                                <p className="text-white/50 text-xs">
                                    Item {activeMediaIndex + 1} of {selectedAlbum.media.length}
                                </p>
                            </div>
                            <button 
                                onClick={closeAlbum}
                                className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 relative flex items-center justify-center p-4 md:p-12">
                            {/* Prev Button */}
                            <button 
                                onClick={prevMedia}
                                className="absolute left-4 md:left-8 z-10 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all backdrop-blur-sm"
                            >
                                <ChevronLeftIcon className="h-8 w-8" />
                            </button>

                            {/* Active Media Container */}
                            <motion.div 
                                key={activeMediaIndex}
                                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                className="w-full max-w-5xl h-full flex flex-col items-center justify-center"
                            >
                                {selectedAlbum.media && selectedAlbum.media[activeMediaIndex] ? (
                                    <>
                                        {selectedAlbum.media[activeMediaIndex].type === 'video' ? (
                                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
                                                <iframe
                                                    src={selectedAlbum.media[activeMediaIndex].videoUrl.replace('watch?v=', 'embed/')}
                                                    className="w-full h-full border-none"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    title="Album Video"
                                                />
                                            </div>
                                        ) : (
                                            <img
                                                src={selectedAlbum.media[activeMediaIndex].src}
                                                alt="Gallery Detail"
                                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                            />
                                        )}

                                        {selectedAlbum.media[activeMediaIndex].caption && (
                                            <div className="mt-6 bg-white/5 px-6 py-3 rounded-full backdrop-blur-xl border border-white/10">
                                                <p className="text-white text-sm italic">"{selectedAlbum.media[activeMediaIndex].caption}"</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-white text-xl">No media available</div>
                                )}
                            </motion.div>

                            {/* Next Button */}
                            <button 
                                onClick={nextMedia}
                                className="absolute right-4 md:right-8 z-10 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all backdrop-blur-sm"
                            >
                                <ChevronRightIcon className="h-8 w-8" />
                            </button>
                        </div>

                        {/* Thumbnail Bar */}
                        <div className="p-6 bg-black/40 backdrop-blur-md flex items-center justify-center gap-3 overflow-x-auto no-scrollbar">
                            {selectedAlbum.media.map((item, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setActiveMediaIndex(idx)}
                                    className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${activeMediaIndex === idx ? 'border-indigo-500 scale-110' : 'border-transparent opacity-40 hover:opacity-100'}`}
                                >
                                    {item.type === 'video' ? (
                                        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                            <PlayIcon className="h-6 w-6 text-white" />
                                        </div>
                                    ) : (
                                        <img src={item.src} alt="Thumb" className="w-full h-full object-cover" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default DesignThirty;
