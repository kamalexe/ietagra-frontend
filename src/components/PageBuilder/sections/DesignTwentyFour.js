import React, { useState, useEffect, useMemo } from 'react';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import axiosInstance from '../../../api/axiosConfig';

const EMPTY_ARRAY = [];

const DesignTwentyFour = ({ id, title, description, subtitle, items = EMPTY_ARRAY, dataSource, departmentId }) => {
    console.log("[DesignTwentyFour] Rendered with:", { id, title, dataSource, departmentId, manualItemsCount: items.length });
    // State for dynamic data
    const [fetchedItems, setFetchedItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // State for filters
    const [filters, setFilters] = useState({
        batch: '',
        branch: '',
        platform: '',
        search: ''
    });

    // Fetch Data
    useEffect(() => {
        if (dataSource) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    let url = `/student-records?category=${dataSource}`;
                    if (departmentId) url += `&department=${departmentId}`;
                    console.log(`[DesignTwentyFour] Fetching from: ${url}`);
                    const response = await axiosInstance.get(url);
                    console.log(`[DesignTwentyFour] Response:`, response.data);
                    if (response.data.success) {
                        const transformed = response.data.data.map(rec => ({
                            ...rec,
                            ...rec.metadata,
                            key: rec._id
                        }));
                        console.log(`[DesignTwentyFour] Transformed Items:`, transformed);
                        setFetchedItems(transformed);
                    }
                } catch (error) {
                    console.error("Failed to fetch dynamic MOOC data:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        } else {
            console.log(`[DesignTwentyFour] No dataSource, using manual items:`, items);
            setFetchedItems(items || []);
        }
    }, [dataSource, items, departmentId]);

    // Extract unique values for dropdowns
    const uniqueBatches = useMemo(() => [...new Set(fetchedItems.map(item => String(item.batch || '')).filter(Boolean))], [fetchedItems]);
    const uniqueBranches = useMemo(() => [...new Set(fetchedItems.map(item => item.branch).filter(Boolean))], [fetchedItems]);
    const uniquePlatforms = useMemo(() => [...new Set(fetchedItems.map(item => item.platform).filter(Boolean))], [fetchedItems]);

    // Filter logic
    const filteredItems = useMemo(() => {
        return fetchedItems.filter(item => {
            const matchesBatch = !filters.batch || String(item.batch || '') === String(filters.batch);
            const matchesBranch = !filters.branch || item.branch === filters.branch;
            const matchesPlatform = !filters.platform || item.platform === filters.platform;
            const matchesSearch = !filters.search || 
                (item.studentName?.toLowerCase().includes(filters.search.toLowerCase()) ||
                    item.courseName?.toLowerCase().includes(filters.search.toLowerCase()));
            
            return matchesBatch && matchesBranch && matchesPlatform && matchesSearch;
        });
    }, [fetchedItems, filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    if (loading) return (
        <div className="py-20 text-center text-gray-500 animate-pulse bg-gray-50">
            <h2 className="text-2xl font-bold mb-4">Loading MOOC Data...</h2>
            <p>Fetching records from {dataSource} source...</p>
        </div>
    );

    return (
        <section id={id} className="py-12 bg-gray-50">
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
                        <div className="relative">
                            <select 
                                className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500 w-full sm:w-auto cursor-pointer"
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

                        <div className="relative">
                            <select 
                                className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500 w-full sm:w-auto cursor-pointer"
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

                         <div className="relative">
                            <select 
                                className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500 w-full sm:w-auto cursor-pointer"
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

                    <div className="relative w-full md:w-64">
                        <input 
                            type="text" 
                            placeholder="Search names or courses..." 
                            className="bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pl-10 rounded focus:outline-none focus:bg-white focus:border-blue-500 w-full"
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-400">
                            <MagnifyingGlassIcon className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow overflow-hidden rounded-xl border border-gray-200 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Course Name</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Platform</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Score</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Batch / Branch</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item, index) => (
                                    <tr key={index} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
                                                    {(item.studentName || 'Student').charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-gray-900">{item.studentName || 'Unknown Student'}</div>
                                                    <div className="text-xs text-gray-500 font-mono tracking-tighter">{item.enrollmentNo || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium max-w-xs truncate">
                                            {item.courseName || item.title || item.projectName || 'Dynamic Record'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm
                                                ${item.platform === 'NPTEL' || item.category === 'gate' ? 'bg-green-100 text-green-800' :
                                                    item.platform === 'Coursera' || item.category === 'achievement' ? 'bg-blue-100 text-blue-800' : 
                                                  'bg-gray-100 text-gray-800'}`}>
                                                {item.platform || item.date || item.company || 'Record'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">
                                            {item.score || item.package || item.gateScore || item.rank || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                            <span className="bg-gray-100 px-2 py-1 rounded">{item.batch || item.year || 'N/A'}</span>
                                            <span className="text-gray-300 mx-2">|</span>
                                            <span className="text-gray-500 uppercase">{item.branch || 'Common'}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                        <td colSpan="5" className="px-6 py-16 text-center text-gray-500 italic">
                                            No MOOC records found matching your current filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="mt-6 flex justify-between items-center text-sm">
                    <div className="text-gray-500 font-medium">
                        Showing <span className="text-blue-600 font-bold">{filteredItems.length}</span> of <span className="font-bold">{fetchedItems.length}</span> records
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DesignTwentyFour;
