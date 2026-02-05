import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Search, Filter, Calendar, Book, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const DesignThirtySix = ({ title, subtitle, type = 'syllabus' }) => {
    // type prop determines if we fetch syllabus or exam-schedule

    // Determine API endpoint and field mappings based on type
    const isExam = type === 'exam-schedule';
    const apiEndpoint = isExam ? '/api/exam-schedule' : '/api/syllabus';
    const filterApiEndpoint = '/api/syllabus/filters'; // We can reuse syllabus filters for now or generic api

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        academicYear: '',
        program: '',
        semester: '',
        examType: '' // Only for exam schedule
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
                // For now, reusing syllabus filters as they share year/program
                // In production, might want separate filter endpoints
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
    }, []);

    // Fetch Data on Filter Change
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
                } else {
                    setError('Failed to load data');
                }
            } catch (err) {
                setError(err.message || 'Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        // Debounce fetching
        const timeoutId = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [filters, apiEndpoint, isExam]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block p-4 rounded-full bg-blue-50 mb-4"
                    >
                        <Book className="w-8 h-8 text-blue-600" />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl font-bold text-gray-900 mb-4"
                    >
                        {title || (isExam ? 'Exam Schedules' : 'Syllabus & Curriculum')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-600 max-w-2xl mx-auto"
                    >
                        {subtitle || 'Download the latest academic documents, exam timetables, and curriculum details.'}
                    </motion.p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-10">
                    <div className="flex items-center mb-4 text-gray-700 font-medium">
                        <Filter className="w-5 h-5 mr-2 text-blue-600" />
                        <span>Filter Documents</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Type Select (Only for Exam) */}
                        {isExam && (
                            <div className="relative">
                                <select
                                    name="examType"
                                    value={filters.examType}
                                    onChange={handleFilterChange}
                                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
                                >
                                    <option value="">All Exam Types</option>
                                    {options.examTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <Layers className="w-4 h-4" />
                                </div>
                            </div>
                        )}

                        {/* Academic Year */}
                        <div className="relative">
                            <select
                                name="academicYear"
                                value={filters.academicYear}
                                onChange={handleFilterChange}
                                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
                            >
                                <option value="">Academic Year</option>
                                {options.academicYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <Calendar className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Program */}
                        <div className="relative">
                            <select
                                name="program"
                                value={filters.program}
                                onChange={handleFilterChange}
                                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
                            >
                                <option value="">Program (All)</option>
                                {options.programs.map(prog => (
                                    <option key={prog} value={prog}>{prog}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <Book className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Semester */}
                        <div className="relative">
                            <select
                                name="semester"
                                value={filters.semester}
                                onChange={handleFilterChange}
                                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
                            >
                                <option value="">Semesters (All)</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                    <option key={sem} value={sem}>{sem} Semester</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <Layers className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                        <strong className="font-bold">Error! </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {/* Results Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                ) : data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.map((item) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 p-6 group cursor-pointer"
                                onClick={() => window.open(item.fileUrl, '_blank')}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" alt="PDF" className="w-8 h-8" />
                                    </div>
                                    <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-200">
                                        {isExam ? item.examType : `Sem ${item.semester}`}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </h3>
                                <div className="space-y-2 mb-6">
                                    {item.department && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span className="w-24 font-medium">Department:</span>
                                            <span className="text-gray-900">{item.department.name || 'All'}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span className="w-24 font-medium">Program:</span>
                                        <span className="text-gray-900">{item.program}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span className="w-24 font-medium">Year:</span>
                                        <span className="text-gray-900">{item.academicYear}</span>
                                    </div>
                                    {isExam && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span className="w-24 font-medium">Published:</span>
                                            <span className="text-gray-900">{new Date(item.publishDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                                <button className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-gray-50 hover:bg-blue-600 text-gray-700 hover:text-white rounded-lg transition-all duration-200 font-medium group/btn">
                                    <Download className="w-4 h-4 group-hover/btn:animate-bounce" />
                                    <span>Download PDF</span>
                                </button>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No documents found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your filters to find what you're looking for.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default DesignThirtySix;
