import React, { useState, useMemo } from 'react';
import { FunnelIcon, MagnifyingGlassIcon, StarIcon, AcademicCapIcon, CalendarIcon } from '@heroicons/react/24/outline';

const DesignTwentySix = ({ title, description, subtitle, items = [] }) => {
    // State for filters
    const [filters, setFilters] = useState({
        batch: '',
        branch: '',
        search: ''
    });

    // Extract unique values for dropdowns
    const uniqueBatches = useMemo(() => [...new Set(items.map(item => item.batch).filter(Boolean))], [items]);
    const uniqueBranches = useMemo(() => [...new Set(items.map(item => item.branch).filter(Boolean))], [items]);

    // Filter logic
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesBatch = !filters.batch || item.batch === filters.batch;
            const matchesBranch = !filters.branch || item.branch === filters.branch;
            const matchesSearch = !filters.search || 
                item.title?.toLowerCase().includes(filters.search.toLowerCase()) || 
                item.studentName?.toLowerCase().includes(filters.search.toLowerCase());
            
            return matchesBatch && matchesBranch && matchesSearch;
        });
    }, [items, filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    {title && <h2 className="text-4xl font-bold text-gray-900 font-serif mb-4 relative inline-block">
                        {title}
                        <span className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-yellow-400 rounded-full"></span>
                    </h2>}
                    {subtitle && <p className="text-xl text-gray-500 font-light italic mt-4">{subtitle}</p>}
                    {description && <div className="max-w-3xl mx-auto mt-6 text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: description }} />}
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
                    <div className="relative group">
                        <select 
                            className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-3 px-6 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent cursor-pointer hover:bg-gray-100 transition-colors w-full md:w-48"
                            value={filters.batch}
                            onChange={(e) => handleFilterChange('batch', e.target.value)}
                        >
                            <option value="">All Batches</option>
                            {uniqueBatches.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        <FunnelIcon className="h-5 w-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none group-hover:text-yellow-500 transition-colors" />
                    </div>

                    <div className="relative group">
                        <select 
                            className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-3 px-6 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent cursor-pointer hover:bg-gray-100 transition-colors w-full md:w-48"
                            value={filters.branch}
                            onChange={(e) => handleFilterChange('branch', e.target.value)}
                        >
                            <option value="">All Branches</option>
                            {uniqueBranches.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        <FunnelIcon className="h-5 w-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none group-hover:text-yellow-500 transition-colors" />
                    </div>

                    <div className="relative w-full md:w-80 group">
                        <input 
                            type="text" 
                            placeholder="Search achievements..." 
                            className="bg-gray-50 border border-gray-300 text-gray-700 py-3 px-6 pl-12 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent w-full hover:bg-gray-100 transition-colors"
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none group-hover:text-yellow-500 transition-colors" />
                    </div>
                </div>

                {/* Timeline Grid Layout */}
                <div className="relative">
                    {/* Vertical Line for Desktop */}
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                    <div className="space-y-12">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item, index) => (
                                <div key={index} className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                                    {/* Content Card */}
                                    <div className="w-full md:w-1/2 px-4">
                                        <div className={`bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 relative group overflow-hidden ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                            {/* Decorative Background Icon */}
                                            <StarIcon className={`absolute -bottom-6 -right-6 h-32 w-32 text-gray-50 transform rotate-12 group-hover:scale-110 transition-transform duration-500 ${index % 2 === 0 ? 'left-[-1.5rem] right-auto' : 'right-[-1.5rem]'}`} />
                                            
                                            <div className="relative z-10">
                                                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                                                    {item.batch} • {item.branch}
                                                </span>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                                <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>
                                                
                                                <div className={`flex items-center gap-4 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <AcademicCapIcon className="h-4 w-4 mr-1 text-blue-500" />
                                                        <span className="font-medium text-gray-900">{item.studentName}</span>
                                                    </div>
                                                    {item.date && (
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <CalendarIcon className="h-4 w-4 mr-1 text-blue-500" />
                                                            <span>{item.date}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timeline Dot */}
                                    <div className="relative flex items-center justify-center w-8 h-8 my-4 md:my-0 shrink-0 z-20">
                                        <div className="w-8 h-8 bg-white border-4 border-yellow-400 rounded-full shadow-md flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
                                        </div>
                                    </div>

                                    {/* Spacer for the other side */}
                                    <div className="w-full md:w-1/2 px-4 hidden md:block"></div>
                                </div>
                            ))
                        ) : (
                             <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <StarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-lg">No achievements found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DesignTwentySix;
