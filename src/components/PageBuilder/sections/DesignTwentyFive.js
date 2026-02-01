import React, { useState, useMemo } from 'react';
import { FunnelIcon, MagnifyingGlassIcon, TrophyIcon, CurrencyRupeeIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';

const DesignTwentyFive = ({ id, title, description, subtitle, items = [] }) => {
    // State for filters
    const [filters, setFilters] = useState({
        company: '',
        branch: '',
        search: '',
        sort: 'highest' // 'highest', 'lowest'
    });

    // Helper to parse package string to number for sorting (e.g., "12 LPA" -> 12)
    const parsePackage = (pkgStr) => {
        if (!pkgStr) return 0;
        const match = pkgStr.match(/(\d+(\.\d+)?)/);
        return match ? parseFloat(match[0]) : 0;
    };

    // Calculate Stats
    const stats = useMemo(() => {
        if (!items.length) return null;
        const packages = items.map(i => parsePackage(i.package));
        const highest = Math.max(...packages);
        const avg = packages.reduce((a, b) => a + b, 0) / packages.length;
        return {
            highest: highest.toFixed(2),
            average: avg.toFixed(2),
            totalPlaced: items.length
        };
    }, [items]);

    // Extract unique values for dropdowns
    const uniqueCompanies = useMemo(() => [...new Set(items.map(item => item.company).filter(Boolean))], [items]);
    const uniqueBranches = useMemo(() => [...new Set(items.map(item => item.branch).filter(Boolean))], [items]);

    // Filter and Sort logic
    const filteredItems = useMemo(() => {
        let result = items.filter(item => {
            const matchesCompany = !filters.company || item.company === filters.company;
            const matchesBranch = !filters.branch || item.branch === filters.branch;
            const matchesSearch = !filters.search || 
                item.studentName?.toLowerCase().includes(filters.search.toLowerCase()) || 
                item.company?.toLowerCase().includes(filters.search.toLowerCase());
            
            return matchesCompany && matchesBranch && matchesSearch;
        });

        // Sorting
        result.sort((a, b) => {
            const pkgA = parsePackage(a.package);
            const pkgB = parsePackage(b.package);
            return filters.sort === 'highest' ? pkgB - pkgA : pkgA - pkgB;
        });

        return result;
    }, [items, filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <section id={id} className="py-16 bg-gradient-to-br from-blue-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    {title && <h2 className="text-4xl font-bold text-gray-900 font-serif mb-3 tracking-tight">{title}</h2>}
                    {subtitle && <p className="text-xl text-blue-600 font-medium mb-4">{subtitle}</p>}
                    {description && <div className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: description }} />}
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500 flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                                <TrophyIcon className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Highest Package</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.highest} LPA</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                                <CurrencyRupeeIcon className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Average Package</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.average} LPA</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                                <BuildingOffice2Icon className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Students Placed</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalPlaced}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Controls Bar */}
                <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 mb-8 flex flex-col lg:flex-row gap-5 items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        {/* Company Filter */}
                        <div className="relative">
                            <select 
                                className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 pr-10 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-full sm:w-48 transition-all"
                                value={filters.company}
                                onChange={(e) => handleFilterChange('company', e.target.value)}
                            >
                                <option value="">All Companies</option>
                                {uniqueCompanies.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                <FunnelIcon className="h-4 w-4" />
                            </div>
                        </div>

                        {/* Branch Filter */}
                        <div className="relative">
                            <select 
                                className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 pr-10 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-full sm:w-48 transition-all"
                                value={filters.branch}
                                onChange={(e) => handleFilterChange('branch', e.target.value)}
                            >
                                <option value="">All Branches</option>
                                {uniqueBranches.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                <FunnelIcon className="h-4 w-4" />
                            </div>
                        </div>

                        {/* Sort Order */}
                        <div className="relative">
                            <select 
                                className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 pr-10 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-full sm:w-48 transition-all"
                                value={filters.sort}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                            >
                                <option value="highest">Highest Package First</option>
                                <option value="lowest">Lowest Package First</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                <span className="text-xs">▼</span>
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative w-full lg:w-80">
                        <input 
                            type="text" 
                            placeholder="Search student or company..." 
                            className="bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 pl-11 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-full transition-all"
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-400">
                            <MagnifyingGlassIcon className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* Placement Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col group">
                                {/* Top Banner - Company Color or Default */}
                                <div className={`h-2 w-full ${index < 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-blue-500'}`}></div>
                                
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                                             {/* Placeholder for Company Logo if we had one, else icon */}
                                            <BuildingOffice2Icon className="h-8 w-8 text-blue-600" />
                                        </div>
                                        {/* Rank Badge for top 3 */}
                                        {index < 3 && filters.sort === 'highest' && (
                                            <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                                                <TrophyIcon className="h-3 w-3 mr-1" /> Top {index + 1}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.studentName}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{item.branch} • {item.batch}</p>

                                    <div className="mt-auto pt-4 border-t border-gray-100">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-semibold">Company</p>
                                                <p className="text-gray-900 font-medium truncate w-32" title={item.company}>{item.company}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-blue-600 uppercase font-bold">Package</p>
                                                <p className="text-xl font-bold text-gray-900">{item.package}</p>
                                            </div>
                                        </div>
                                        {item.designation && (
                                             <div className="mt-2 text-xs text-gray-500 truncate" title={item.designation}>
                                                Role: {item.designation}
                                             </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-16 text-center">
                            <div className="inline-block p-4 rounded-full bg-gray-100 mb-4 text-gray-400">
                                <MagnifyingGlassIcon className="h-10 w-10" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No records found</h3>
                            <p className="text-gray-500">Try adjusting your filters or search query.</p>
                        </div>
                    )}
                </div>

                {/* Footer Count */}
                 <div className="mt-8 text-center text-sm text-gray-400">
                    Displaying {filteredItems.length} placements
                </div>
            </div>
        </section>
    );
};

export default DesignTwentyFive;
