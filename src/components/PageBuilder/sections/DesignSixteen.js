import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaFilePowerpoint, FaSearch, FaFilter } from 'react-icons/fa';
import axiosInstance from '../../../api/axiosConfig';

// Configuration for different data sources
const COLUMN_CONFIG = {
    project: [
        { key: 'batch', label: 'Batch', render: (val) => <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded border border-blue-400">{val}</span> },
        { key: 'studentName', label: 'Student Name', className: 'font-medium text-gray-900' },
        { key: 'projectName', label: 'Project Name', className: 'text-gray-800 font-medium' },
        { key: 'technology', label: 'Technology', render: (val) => <div className="flex flex-wrap gap-1">{val?.split(',').map((t, i) => <span key={i} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{t.trim()}</span>)}</div> },
        { key: 'branch', label: 'Branch' },
        { key: 'supervisor', label: 'Supervisor' },
        {
            key: 'links', label: 'Links', align: 'center', render: (_, row) => (
                <div className="flex items-center justify-center space-x-3">
                    {row.githubLink && <a href={row.githubLink} target="_blank" rel="noreferrer" title="GitHub" className="text-gray-600 hover:text-black transition-colors"><FaGithub className="w-5 h-5" /></a>}
                    {row.pptLink && <a href={row.pptLink} target="_blank" rel="noreferrer" title="Presentation" className="text-red-500 hover:text-red-700 transition-colors"><FaFilePowerpoint className="w-5 h-5" /></a>}
                </div>
            )
        }
    ],
    gate: [
        { key: 'year', label: 'Year', render: (val) => <span className="font-bold text-gray-700">{val}</span> },
        { key: 'studentName', label: 'Student Name', className: 'font-medium text-gray-900' },
        { key: 'enrollmentNo', label: 'Enrollment No.' },
        { key: 'branch', label: 'Branch' },
        { key: 'gateScore', label: 'Gate Score', className: 'font-mono text-blue-700' },
        { key: 'rank', label: 'All India Rank', render: (val) => <span className="bg-green-100 text-green-800 font-bold px-2 py-1 rounded">AIR {val}</span> }
    ],
    placement: [
        { key: 'batch', label: 'Batch' },
        { key: 'studentName', label: 'Name', className: 'font-medium text-gray-900' },
        { key: 'branch', label: 'Branch' },
        { key: 'company', label: 'Company', className: 'font-bold text-gray-800' },
        { key: 'designation', label: 'Designation' },
        { key: 'package', label: 'Package', render: (val) => <span className="text-green-600 font-bold">{val} LPA</span> }
    ],
    mooc: [
        { key: 'batch', label: 'Batch' },
        { key: 'studentName', label: 'Student Name' },
        { key: 'courseName', label: 'Course Name', className: 'italic text-gray-700' },
        { key: 'platform', label: 'Platform', render: (val) => <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">{val}</span> },
        { key: 'score', label: 'Score' }
    ],
    // Default fallback
    achievement: [
        { key: 'batch', label: 'Batch' },
        { key: 'studentName', label: 'Student Name' },
        { key: 'title', label: 'Title', className: 'font-bold' },
        { key: 'description', label: 'Description' },
        { key: 'date', label: 'Date' }
    ]
};

const DesignSixteen = ({ id, title, description, projects, dataSource }) => {
    // State
    const [fetchedData, setFetchedData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [branchFilter, setBranchFilter] = useState('');
    const [batchFilter, setBatchFilter] = useState('');

    // Fetch Data
    useEffect(() => {
        if (dataSource) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const response = await axiosInstance.get(`/student-records?category=${dataSource}`);
                    const resData = response.data;
                    if (resData.success) {
                        // Flatten metadata into the row object for easier table rendering
                        const transformed = resData.data.map(rec => ({
                            ...rec,
                            ...rec.metadata, // Spread metadata to top level
                            key: rec._id
                        }));
                        setFetchedData(transformed);
                    }
                } catch (error) {
                    console.error("Failed to fetch dynamic table data:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        } else if (Array.isArray(projects)) {
            setFetchedData(projects);
        }
    }, [dataSource, projects]);

    // Derived Data (Filtering)
    // Derived Data (Filtering)
    const filteredData = useMemo(() => {
        return fetchedData.filter(item => {
            // Global Search (across all fields)
            const matchesSearch = searchTerm === '' ||
                Object.values(item).some(val => 
                    String(val).toLowerCase().includes(searchTerm.toLowerCase())
                );

            // Branch Filter
            const matchesBranch = branchFilter === '' || item.branch === branchFilter;

            // Batch Filter (Robust string comparison)
            const matchesBatch = batchFilter === '' || String(item.batch) === String(batchFilter);

            return matchesSearch && matchesBranch && matchesBatch;
        });
    }, [fetchedData, searchTerm, branchFilter, batchFilter]);

    // Unique values for dropdowns
    const branches = useMemo(() => [...new Set(fetchedData.map(i => i.branch).filter(Boolean))], [fetchedData]);
    const batches = useMemo(() => [...new Set(fetchedData.map(i => i.batch).filter(Boolean))], [fetchedData]);

    const columns = (dataSource && COLUMN_CONFIG[dataSource]) ? COLUMN_CONFIG[dataSource] : COLUMN_CONFIG['project'];

    if (loading) return <div className="p-12 text-center text-gray-500 animate-pulse">Loading Data...</div>;

    return (
        <section id={id} className="py-12 bg-white">
            <div className="container mx-auto px-4">
                {(title || description) && (
                    <div className="text-center mb-8">
                        {title && <h2 className="text-3xl font-bold text-gray-800 mb-3">{title}</h2>}
                        {description && <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>}
                    </div>
                )}

                {/* Filters Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                        {batches.length > 0 && (
                            <select
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-blue-500"
                                value={batchFilter}
                                onChange={(e) => setBatchFilter(e.target.value)}
                            >
                                <option value="">All Batches</option>
                                {batches.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        )}
                        {branches.length > 0 && (
                            <select
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-blue-500"
                                value={branchFilter}
                                onChange={(e) => setBranchFilter(e.target.value)}
                            >
                                <option value="">All Branches</option>
                                {branches.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        )}
                        <button
                            onClick={() => { setSearchTerm(''); setBranchFilter(''); setBatchFilter(''); }}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto shadow-sm border border-gray-200 sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
                            <tr>
                                {columns.map((col, idx) => (
                                    <th key={idx} scope="col" className={`px-6 py-4 font-bold tracking-wider ${col.align === 'center' ? 'text-center' : ''}`}>
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredData.length > 0 ? (
                                filteredData.map((row, rIdx) => (
                                    <motion.tr
                                        key={rIdx}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        className="bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        {columns.map((col, cIdx) => (
                                            <td key={cIdx} className={`px-6 py-4 whitespace-nowrap ${col.className || ''} ${col.align === 'center' ? 'text-center' : ''}`}>
                                                {col.render ? col.render(row[col.key], row) : (row[col.key] || '-')}
                                            </td>
                                        ))}
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500 bg-white">
                                        No matching records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default DesignSixteen;
