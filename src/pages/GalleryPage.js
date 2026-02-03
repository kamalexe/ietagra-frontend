import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PhotoIcon,
    VideoCameraIcon,
    CalendarIcon,
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    PlayIcon
} from '@heroicons/react/24/outline';
import AlbumService from '../services/AlbumService';
import DepartmentService from '../services/DepartmentService';
import GalleryConfigService from '../services/GalleryConfigService';

const GalleryPage = () => {
    const [albums, setAlbums] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDepartment, setSelectedDepartment] = useState('All');

    // Config State
    const [pageConfig, setPageConfig] = useState({
        heroTitle: 'University Media Gallery',
        heroTitleHighlight: 'Media Gallery',
        heroSubtitle: 'Explore our campus events, academic milestones, and unforgettable memories through our curated collections.',
        heroBackgroundImage: 'https://images.unsplash.com/photo-1523050853063-bd805a9ec218?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    });

    // Lightbox State
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [activeMediaIndex, setActiveMediaIndex] = useState(0);
    const nextMedia = React.useCallback(() => {
        if (!selectedAlbum?.media?.length) return;
        setActiveMediaIndex((prev) => (prev + 1) % selectedAlbum.media.length);
    }, [selectedAlbum]);

    const prevMedia = React.useCallback(() => {
        if (!selectedAlbum?.media?.length) return;
        setActiveMediaIndex((prev) => (prev - 1 + selectedAlbum.media.length) % selectedAlbum.media.length);
    }, [selectedAlbum]);

    const touchStartX = useRef(null);

    // Keyboard Navigation & Focus Management
    useEffect(() => {
        if (!selectedAlbum) return;

        const onKeyDown = (e) => {
            if (e.key === 'Escape') closeAlbum();
            if (e.key === 'ArrowRight') nextMedia();
            if (e.key === 'ArrowLeft') prevMedia();
        };

        window.addEventListener('keydown', onKeyDown);

        // Focus first interactive element
        const firstFocusable = document.querySelector('.lightbox-close-btn');
        firstFocusable?.focus();

        return () => window.removeEventListener('keydown', onKeyDown);
    }, [selectedAlbum, activeMediaIndex, nextMedia, prevMedia]);

    // Thumbnail Auto-Scroll
    useEffect(() => {
        if (!selectedAlbum) return;
        const el = document.getElementById(`thumb-${activeMediaIndex}`);
        el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }, [activeMediaIndex, selectedAlbum]);

    // Swipe Handlers
    const onTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const onTouchEnd = (e) => {
        if (!touchStartX.current) return;
        const delta = touchStartX.current - e.changedTouches[0].clientX;

        if (Math.abs(delta) > 50) {
            delta > 0 ? nextMedia() : prevMedia();
        }
        touchStartX.current = null;
    };

    // const categories = ['All', 'Events', 'Campus', 'Academic', 'Sports', 'Others']; // Removing unused var

    useEffect(() => {
        const loadDat = async () => {
            try {
                const [albumsData, deptsData, configData] = await Promise.all([
                    AlbumService.getAlbums(),
                    DepartmentService.getPublishedDepartments(),
                    GalleryConfigService.getConfig().catch(() => null)
                ]);
                setAlbums(albumsData);
                setDepartments(deptsData);
                if (configData) setPageConfig(configData);
            } catch (error) {
                console.error("Failed to load gallery data", error);
            } finally {
                setLoading(false);
            }
        };
        loadDat();
        window.scrollTo(0, 0);
    }, []);

    // Derive dynamic categories from albums
    const uniqueCategories = ['All', ...new Set(albums.map(a => a.category))];

    const filteredAlbums = albums.filter(album => {
        const matchesSearch = album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            album.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || album.category === selectedCategory;
        const matchesDepartment = selectedDepartment === 'All' ||
            (album.department && (album.department._id === selectedDepartment || album.department === selectedDepartment));

        return matchesSearch && matchesCategory && matchesDepartment;
    });

    const openAlbum = (album) => {
        if (!album.media || album.media.length === 0) {
            alert("This album is empty.");
            return;
        }
        setSelectedAlbum(album);
        setActiveMediaIndex(0);
        document.body.style.overflow = 'hidden';
    };

    const closeAlbum = () => {
        setSelectedAlbum(null);
        document.body.style.overflow = 'unset';
    };



    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Loading university memories...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* HERO SECTION */}
            <div className="relative py-24 bg-indigo-900 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 mix-blend-multiply" />
                    <img
                        src={pageConfig.heroBackgroundImage || "https://images.unsplash.com/photo-1523050853063-bd805a9ec218?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"}
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
                    >
                        {pageConfig.heroTitle ? (
                            <>
                                {pageConfig.heroTitle.replace(pageConfig.heroTitleHighlight, '')} <span className="text-indigo-400">{pageConfig.heroTitleHighlight}</span>
                            </>
                        ) : (
                            <>University <span className="text-indigo-400">Media Gallery</span></>
                        )}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-indigo-100 max-w-2xl mx-auto mb-10"
                    >
                        {pageConfig.heroSubtitle}
                    </motion.p>
                </div>
            </div>

            {/* FILTERS & SEARCH */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col gap-6 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search albums or events..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Department Dropdown */}
                        <div className="relative w-full md:w-64">
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-gray-700 appearance-none cursor-pointer"
                            >
                                <option value="All">All Departments</option>
                                {departments.map(dept => (
                                    <option key={dept._id} value={dept._id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <FunnelIcon className="h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-3 w-full overflow-x-auto pb-2 no-scrollbar">
                        <div className="flex items-center text-gray-500 mr-2 shrink-0">
                            <span className="text-sm font-bold uppercase tracking-wider">Category:</span>
                        </div>
                        {uniqueCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-bold transition-all shrink-0 ${selectedCategory === cat
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ALBUMS GRID */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredAlbums.map((album, index) => (
                        <motion.div
                            key={album._id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col"
                            onClick={() => openAlbum(album)}
                        >
                            <div className="relative aspect-[4/3] overflow-hidden cursor-pointer">
                                <img
                                    src={album.coverImage}
                                    alt={album.title}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                    <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold uppercase tracking-widest">
                                        <CalendarIcon className="h-3 w-3" />
                                        <span>{new Date(album.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-bold text-white uppercase tracking-widest">
                                    {album.category}
                                </div>
                            </div>

                            <div className="p-8 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors capitalize">
                                    {album.title}
                                </h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-1">
                                    {album.description || "Discover the visual narrative and highlights of this university event."}
                                </p>
                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <div className="flex items-center gap-4 text-gray-400">
                                        <div className="flex items-center gap-1.5">
                                            <PhotoIcon className="h-4 w-4" />
                                            <span className="text-xs font-bold">{album.media.filter(m => m.type !== 'video').length}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <VideoCameraIcon className="h-4 w-4" />
                                            <span className="text-xs font-bold">{album.media.filter(m => m.type === 'video').length}</span>
                                        </div>
                                    </div>
                                    <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors">
                                        View Album →
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {filteredAlbums.length === 0 && (
                    <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MagnifyingGlassIcon className="h-10 w-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No memories found</h3>
                        <p className="text-gray-500">We couldn't find any albums matching your current filters.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                            className="mt-6 text-indigo-600 font-bold hover:underline"
                        >
                            clear filters
                        </button>
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
                        className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl flex flex-col"
                        onClick={closeAlbum}
                    >
                        {/* Header */}
                        <div
                            className="relative z-50 flex items-center justify-between p-4 bg-black/40 backdrop-blur-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/20">
                                    {selectedAlbum.title.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg leading-tight">{selectedAlbum.title}</h4>
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                                        {activeMediaIndex + 1} / {selectedAlbum.media.length}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeAlbum}
                                className="lightbox-close-btn p-2 bg-white rounded-full text-black hover:bg-gray-200 transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div
                            className="flex-1 relative w-full h-full p-2 md:p-4 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                            onTouchStart={onTouchStart}
                            onTouchEnd={onTouchEnd}
                        >
                            <button
                                onClick={prevMedia}
                                className="absolute left-4 md:left-8 z-20 p-4 bg-white/5 hover:bg-indigo-600 rounded-full text-white transition-all backdrop-blur-md border border-white/10 group top-1/2 -translate-y-1/2 focus:outline-none focus:bg-indigo-600"
                            >
                                <ChevronLeftIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                            </button>

                            <motion.div
                                key={activeMediaIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full h-full max-w-7xl mx-auto flex flex-col items-center justify-center"
                            >
                                <div className="flex-1 min-h-0 w-full flex items-center justify-center relative">
                                    {selectedAlbum.media[activeMediaIndex]?.type === 'video' ? (
                                        <div className="relative w-full h-full flex items-center justify-center">
                                            <div className="aspect-video w-full max-h-full max-w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10">
                                                <iframe
                                                    src={selectedAlbum.media[activeMediaIndex]?.videoUrl?.replace('watch?v=', 'embed/')}
                                                    className="w-full h-full border-none"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    title="Gallery Video"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <img
                                                src={selectedAlbum.media[activeMediaIndex]?.src}
                                            alt="Gallery"
                                                loading="eager"
                                                className="w-full h-full object-contain rounded-lg shadow-2xlSelect-none"
                                        />
                                    )}
                                </div>

                                {selectedAlbum.media[activeMediaIndex]?.caption && (
                                    <div className="flex-shrink-0 mt-4 mb-2 bg-white/5 px-6 py-3 rounded-full backdrop-blur-xl border border-white/10">
                                        <p className="text-white text-sm italic">"{selectedAlbum.media[activeMediaIndex]?.caption}"</p>
                                    </div>
                                )}
                            </motion.div>

                            <button
                                onClick={nextMedia}
                                className="absolute right-4 md:right-8 z-20 p-4 bg-white/5 hover:bg-indigo-600 rounded-full text-white transition-all backdrop-blur-md border border-white/10 group top-1/2 -translate-y-1/2 focus:outline-none focus:bg-indigo-600"
                            >
                                <ChevronRightIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>

                        {/* Thumbnail Bar */}
                        <div
                            className="relative z-50 p-4 bg-black/40 backdrop-blur-md flex items-center justify-center gap-3 overflow-x-auto no-scrollbar border-t border-white/5"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {selectedAlbum.media.map((item, idx) => (
                                <button
                                    key={idx}
                                    id={`thumb-${idx}`}
                                    onClick={() => setActiveMediaIndex(idx)}
                                    className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${activeMediaIndex === idx
                                        ? 'border-indigo-500 scale-110'
                                        : 'border-transparent opacity-40 hover:opacity-100 hover:scale-105'
                                        }`}
                                >
                                    {item.type === 'video' ? (
                                        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                            <PlayIcon className="h-6 w-6 text-white" />
                                        </div>
                                    ) : (
                                        <img src={item.src} alt="Nav" className="w-full h-full object-cover" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GalleryPage;
