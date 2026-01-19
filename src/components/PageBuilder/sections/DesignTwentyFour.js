import React, { useState, useMemo } from 'react';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const DesignTwentyFour = ({ title, description, subtitle, items = [] }) => {
    // State for filters
    const [filters, setFilters] = useState({
        batch: '',
        branch: '',
        platform: '',
        search: ''
    });

    // Extract unique values for dropdowns
    const uniqueBatches = useMemo(() => [...new Set(items.map(item => item.batch).filter(Boolean))], [items]);
    const uniqueBranches = useMemo(() => [...new Set(items.map(item => item.branch).filter(Boolean))], [items]);
    const uniquePlatforms = useMemo(() => [...new Set(items.map(item => item.platform).filter(Boolean))], [items]);

    // Filter logic
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesBatch = !filters.batch || item.batch === filters.batch;
            const matchesBranch = !filters.branch || item.branch === filters.branch;
            const matchesPlatform = !filters.platform || item.platform === filters.platform;
            const matchesSearch = !filters.search || 
                item.studentName?.toLowerCase().includes(filters.search.toLowerCase()) || 
                item.courseName?.toLowerCase().includes(filters.search.toLowerCase());
            
            return matchesBatch && matchesBranch && matchesPlatform && matchesSearch;
        });
    }, [items, filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    {title && <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl font-serif mb-2">{title}</h2>}
                    {subtitle && <p className="text-lg text-blue-600 font-medium mb-2">{subtitle}</p>}
                    {description && <div className="max-w-2xl mx-auto text-gray-600" dangerouslySetInnerHTML={{ __html: description }} />}
                </div>

                {/* Filters Bar */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        {/* Batch Filter */}
                        <div className="relative">
                            <select 
                                className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500 w-full sm:w-auto"
                                value={filters.batch}
                                onChange={(e) => handleFilterChange('batch', e.target.value)}
                            >
                                <option value="">All Batches</option>
                                {uniqueBatches.map(batch => <option key={batch} value={batch}>{batch}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <FunnelIcon className="h-4 w-4" />
                            </div>
                        </div>

                        {/* Branch Filter */}
                        <div className="relative">
                            <select 
                                className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500 w-full sm:w-auto"
                                value={filters.branch}
                                onChange={(e) => handleFilterChange('branch', e.target.value)}
                            >
                                <option value="">All Branches</option>
                                {uniqueBranches.map(branch => <option key={branch} value={branch}>{branch}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <FunnelIcon className="h-4 w-4" />
                            </div>
                        </div>

                         {/* Platform Filter */}
                         <div className="relative">
                            <select 
                                className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500 w-full sm:w-auto"
                                value={filters.platform}
                                onChange={(e) => handleFilterChange('platform', e.target.value)}
                            >
                                <option value="">All Platforms</option>
                                {uniquePlatforms.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <FunnelIcon className="h-4 w-4" />
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <input 
                            type="text" 
                            placeholder="Search student or course..." 
                            className="bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pl-10 rounded focus:outline-none focus:bg-white focus:border-blue-500 w-full"
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-400">
                            <MagnifyingGlassIcon className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch / Branch</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                    {item.studentName?.charAt(0) || 'S'}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{item.studentName}</div>
                                                    <div className="text-xs text-gray-500">{item.enrollmentNo}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            {item.courseName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${item.platform === 'NPTEL' ? 'bg-green-100 text-green-800' : 
                                                  item.platform === 'Coursera' ? 'bg-blue-100 text-blue-800' : 
                                                  'bg-gray-100 text-gray-800'}`}>
                                                {item.platform}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.score}%
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.batch} <span className="text-gray-300 mx-1">/</span> {item.branch}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                        No courses found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Footer Count */}
                <div className="mt-4 text-sm text-gray-500 text-right">
                    Showing {filteredItems.length} of {items.length} records
                </div>
            </div>
        </section>
    );
};

export default DesignTwentyFour;
