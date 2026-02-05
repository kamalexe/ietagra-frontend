import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Search, Filter, Calendar, Book, Layers, Grid3x3, List, X, Eye, Heart, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DesignThirtySeven = ({ title, subtitle, type = 'syllabus' }) => {
    const isExam = type === 'exam-schedule';
    const apiEndpoint = isExam ? '/api/exam-schedule' : '/api/syllabus';
    const filterApiEndpoint = '/api/syllabus/filters';

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'table'
    const [showFilters, setShowFilters] = useState(true);
    const [previewDoc, setPreviewDoc] = useState(null);
    
    const [filters, setFilters] = useState({
        academicYear: '',
        program: '',
        semester: '',
        examType: ''
    });

    const [options, setOptions] = useState({
        academicYears: [],
        programs: [],
        examTypes: ['Mid-Term', 'End-Term', 'Practical', 'Supplementary']
    });

    // Fetch Filter Options
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${filterApiEndpoint}`);
                if (res.data.success) {
                    setOptions(prev => ({
                        ...prev,
                        academicYears: res.data.data.academicYears || [],
                        programs: res.data.data.programs || []
                    }));
                }
            } catch (err) {
                console.error("Failed to fetch filter options", err);
            }
        };
        fetchOptions();
    }, [filterApiEndpoint]);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (filters.academicYear) params.append('academicYear', filters.academicYear);
                if (filters.program) params.append('program', filters.program);
                if (filters.semester) params.append('semester', filters.semester);
                if (isExam && filters.examType) params.append('examType', filters.examType);

                const url = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${apiEndpoint}?${params.toString()}`;
                const res = await axios.get(url);

                if (res.data.success) {
                    setData(res.data.data);
                    setFilteredData(res.data.data);
                } else {
                    setError('Failed to load data');
                }
            } catch (err) {
                setError(err.message || 'Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [filters, apiEndpoint, isExam]);

    // Search Filter
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredData(data);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = data.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.program.toLowerCase().includes(query) ||
                (item.department?.name || '').toLowerCase().includes(query)
            );
            setFilteredData(filtered);
        }
    }, [searchQuery, data]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            academicYear: '',
            program: '',
            semester: '',
            examType: ''
        });
        setSearchQuery('');
    };

    const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

    // Document Card Component
    const DocumentCard = ({ item }) => (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-300 overflow-hidden"
        >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" alt="PDF" className="w-8 h-8" />
                        </div>
                        <div>
                            <span className="inline-block text-xs font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full">
                                {isExam ? item.examType : `Semester ${item.semester}`}
                            </span>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
                    </button>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                </h3>

                {/* Details */}
                <div className="space-y-2 mb-6">
                    {item.department && (
                        <div className="flex items-center text-sm">
                            <span className="w-28 text-gray-500 font-medium">Department:</span>
                            <span className="text-gray-900 font-semibold">{item.department.name || 'All'}</span>
                        </div>
                    )}
                    <div className="flex items-center text-sm">
                        <span className="w-28 text-gray-500 font-medium">Program:</span>
                        <span className="text-gray-900 font-semibold">{item.program}</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <span className="w-28 text-gray-500 font-medium">Academic Year:</span>
                        <span className="text-gray-900 font-semibold">{item.academicYear}</span>
                    </div>
                    {isExam && (
                        <div className="flex items-center text-sm">
                            <span className="w-28 text-gray-500 font-medium">Published:</span>
                            <span className="text-gray-900 font-semibold">{new Date(item.publishDate).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setPreviewDoc(item)}
                        className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 font-medium"
                    >
                        <Eye className="w-4 h-4" />
                        <span>Preview</span>
                    </button>
                    <button
                        onClick={() => window.open(item.fileUrl, '_blank')}
                        className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-blue-500/30"
                    >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );

    // List View Component
    const DocumentListItem = ({ item }) => (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/50 hover:shadow-lg transition-all duration-300 p-4 mb-3"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                    <div className="p-2 bg-red-50 rounded-lg">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" alt="PDF" className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="font-medium">{item.program}</span>
                            <span>•</span>
                            <span>{item.academicYear}</span>
                            <span>•</span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                {isExam ? item.examType : `Sem ${item.semester}`}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPreviewDoc(item)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Eye className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                        onClick={() => window.open(item.fileUrl, '_blank')}
                        className="flex items-center space-x-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                    >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );

    return (
        <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-2xl shadow-blue-500/30"
                    >
                        <Book className="w-10 h-10 text-white" />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
                    >
                        {title || (isExam ? 'Exam Schedules' : 'Syllabus & Curriculum')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-600 max-w-2xl mx-auto"
                    >
                        {subtitle || 'Access the latest academic documents, exam timetables, and curriculum details.'}
                    </motion.p>
                </div>

                {/* Search & View Toggle */}
                <div className="mb-6 flex flex-col md:flex-row gap-4">
                    {/* Search Bar */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-lg"
                        />
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-1.5 shadow-lg border border-gray-200">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <Grid3x3 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-6 py-3.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-lg font-medium"
                    >
                        <Filter className="w-5 h-5" />
                        <span>Filters</span>
                        {activeFiltersCount > 0 && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-bold">
                                {activeFiltersCount}
                            </span>
                        )}
                        <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Filters Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8 overflow-hidden"
                        >
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center text-gray-700 font-semibold">
                                        <Filter className="w-5 h-5 mr-2 text-blue-600" />
                                        <span>Filter Documents</span>
                                    </div>
                                    {activeFiltersCount > 0 && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                        >
                                            <X className="w-4 h-4" />
                                            Clear All
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {isExam && (
                                        <div className="relative">
                                            <select
                                                name="examType"
                                                value={filters.examType}
                                                onChange={handleFilterChange}
                                                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-10 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                            >
                                                <option value="">All Exam Types</option>
                                                {options.examTypes.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                            <Layers className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                        </div>
                                    )}
                                    <div className="relative">
                                        <select
                                            name="academicYear"
                                            value={filters.academicYear}
                                            onChange={handleFilterChange}
                                            className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-10 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                        >
                                            <option value="">Academic Year</option>
                                            {options.academicYears.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                    <div className="relative">
                                        <select
                                            name="program"
                                            value={filters.program}
                                            onChange={handleFilterChange}
                                            className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-10 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                        >
                                            <option value="">Program (All)</option>
                                            {options.programs.map(prog => (
                                                <option key={prog} value={prog}>{prog}</option>
                                            ))}
                                        </select>
                                        <Book className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                    <div className="relative">
                                        <select
                                            name="semester"
                                            value={filters.semester}
                                            onChange={handleFilterChange}
                                            className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-10 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                        >
                                            <option value="">Semesters (All)</option>
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                                <option key={sem} value={sem}>Semester {sem}</option>
                                            ))}
                                        </select>
                                        <Layers className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error Display */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-lg"
                    >
                        <strong className="font-bold">Error! </strong>
                        <span>{error}</span>
                    </motion.div>
                )}

                {/* Results */}
                {loading ? (
                    <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6 animate-pulse`}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-64 bg-white/50 rounded-2xl"></div>
                        ))}
                    </div>
                ) : filteredData.length > 0 ? (
                    <motion.div layout className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                        <AnimatePresence>
                            {filteredData.map((item) => (
                                viewMode === 'grid' ? (
                                    <DocumentCard key={item._id} item={item} />
                                ) : (
                                    <DocumentListItem key={item._id} item={item} />
                                )
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300"
                    >
                        <div className="inline-block p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full mb-4">
                            <Search className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No documents found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search query.</p>
                    </motion.div>
                )}

                {/* Preview Modal */}
                <AnimatePresence>
                    {previewDoc && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setPreviewDoc(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900">{previewDoc.title}</h3>
                                    <button
                                        onClick={() => setPreviewDoc(null)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="p-6">
                                    <iframe
                                        src={previewDoc.fileUrl}
                                        className="w-full h-[70vh] rounded-lg border border-gray-200"
                                        title="Document Preview"
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default DesignThirtySeven;
