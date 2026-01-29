import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '../../../utils/animations';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, PlayCircleIcon, PhotoIcon, FolderIcon } from '@heroicons/react/24/outline';
import AlbumService from '../../../services/AlbumService';

const DesignTwentyThree = ({ title, subtitle, layout = 'grid', albums: initialAlbums = [] }) => {
    const [albums, setAlbums] = useState(initialAlbums);
    const [loading, setLoading] = useState(initialAlbums.length === 0);
    const [currentAlbum, setCurrentAlbum] = useState(null);
    const [lightboxMedia, setLightboxMedia] = useState(null);

    useEffect(() => {
        if (initialAlbums.length === 0) {
            const fetchAlbums = async () => {
                setLoading(true);
                try {
                    const data = await AlbumService.getAlbums();
                    setAlbums(data);
                } catch (error) {
                    console.error("DesignTwentyThree: Failed to fetch albums", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAlbums();
        } else {
            setAlbums(initialAlbums);
            setLoading(false);
        }
    }, [initialAlbums]);

    // Flatten media for non-album view or simple gallery usage
    const allMedia = albums.reduce((acc, album) => [...acc, ...(album.media || [])], []);
    
    // Determine what to display
    const isAlbumMode = layout === 'albums';
    const showRoot = isAlbumMode && !currentAlbum;
    
    const displayMedia = isAlbumMode && currentAlbum ? currentAlbum.media : allMedia;
    const activeLayout = isAlbumMode && currentAlbum ? 'grid' : (layout === 'albums' ? 'grid' : layout); // Default internal layout

    const openLightbox = (media) => setLightboxMedia(media);
    const closeLightbox = () => setLightboxMedia(null);

    if (loading) return <div className="py-20 text-center">Loading gallery...</div>;

    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    {title && <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>}
                    {subtitle && <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
                </div>

                {/* Back Button for Albums */}
                {isAlbumMode && currentAlbum && (
                    <button 
                        onClick={() => setCurrentAlbum(null)}
                        className="mb-8 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <ChevronLeftIcon className="h-5 w-5 mr-1" />
                        Back to Albums
                    </button>
                )}

                {/* Content Area */}
                <motion.div 
                    layout
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                >
                    {showRoot ? (
                        /* Albums Grid */
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {albums.map((album) => (
                                <div 
                                    key={album.id} 
                                    onClick={() => setCurrentAlbum(album)}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden shadow-md mb-4 group-hover:shadow-xl transition-all duration-300">
                                        {album.cover ? (
                                            <img src={album.cover} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <FolderIcon className="h-16 w-16" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{album.title}</h3>
                                    <p className="text-sm text-gray-500">{album.media ? album.media.length : 0} items</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Media Grid / Masonry */
                        <div className={`grid ${activeLayout === 'masonry' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-4 auto-rows-[200px]`}>
                            {displayMedia && displayMedia.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={fadeIn}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    className={`relative group rounded-lg overflow-hidden bg-gray-100 cursor-pointer ${activeLayout === 'masonry' && idx % 3 === 0 ? 'row-span-2' : ''}`}
                                    onClick={() => openLightbox(item)}
                                >
                                    {item.type === 'video' || item.videoUrl ? (
                                        <>
                                            <img src={item.src || `https://img.youtube.com/vi/${getYouTubeID(item.videoUrl)}/mqdefault.jpg`} alt={item.caption} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all">
                                                <PlayCircleIcon className="h-12 w-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                            </div>
                                        </>
                                    ) : (
                                        <img src={item.src} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute bottom-0 left-0 p-4">
                                            <p className="text-white text-sm font-medium truncate">{item.caption}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxMedia && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black bg-opacity-95 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={closeLightbox}
                    >
                        <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
                            <XMarkIcon className="h-10 w-10" />
                        </button>

                        <div className="max-w-5xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
                            {lightboxMedia.type === 'video' || lightboxMedia.videoUrl ? (
                                <div className="aspect-video w-full">
                                    <iframe 
                                        src={getEmbedUrl(lightboxMedia.videoUrl)} 
                                        title={lightboxMedia.caption} 
                                        className="w-full h-full rounded-lg shadow-2xl" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : (
                                <img 
                                    src={lightboxMedia.src} 
                                    alt={lightboxMedia.caption} 
                                    className="max-w-full max-h-[85vh] mx-auto rounded-lg shadow-2xl object-contain" 
                                />
                            )}
                            {lightboxMedia.caption && (
                                <p className="text-center text-white mt-4 text-lg font-light tracking-wide">{lightboxMedia.caption}</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

// Helper to extract YouTube ID
function getYouTubeID(url) {
    if(!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Helper for Embed URL
function getEmbedUrl(url) {
    const id = getYouTubeID(url);
    return id ? `https://www.youtube.com/embed/${id}` : url;
}

export default DesignTwentyThree;
