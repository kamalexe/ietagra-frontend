import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DesignSeventeen = ({ title, description }) => {
    const [gateData, setGateData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');

    useEffect(() => {
        const fetchGateData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/student-records?category=gate');
                const result = await response.json();
                if (result.success) {
                    setGateData(result.data);
                    setFilteredData(result.data);
                }
            } catch (error) {
                console.error("Error fetching GATE data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGateData();
    }, []);

    // Filter Logic
    useEffect(() => {
        let result = gateData;

        if (selectedYear) {
            result = result.filter(item => (item.metadata?.year || '').toString() === selectedYear);
        }

        if (selectedBranch) {
            result = result.filter(item => item.branch === selectedBranch);
        }

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(item =>
                item.studentName.toLowerCase().includes(lowerTerm) ||
                (item.enrollmentNo && item.enrollmentNo.toLowerCase().includes(lowerTerm))
            );
        }

        setFilteredData(result);
    }, [gateData, selectedYear, selectedBranch, searchTerm]);

    // Derived Options for Dropdowns
    const uniqueYears = [...new Set(gateData.map(item => item.metadata?.year).filter(Boolean))].sort().reverse();
    const uniqueBranches = [...new Set(gateData.map(item => item.branch).filter(Boolean))].sort();

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading GATE Data...</div>;
    }

    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">{title || "GATE Qualified Students"}</h2>
                    {description && <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>}
                    <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full mt-4"></div>
                </div>

                {/* Search and Filters */}
                <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Search by Name or Enrollment No..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        />
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                        >
                            <option value="">All Years</option>
                            {uniqueYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                        >
                            <option value="">All Branches</option>
                            {uniqueBranches.map(branch => (
                                <option key={branch} value={branch}>{branch}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-hidden shadow-xl rounded-lg border border-gray-200 bg-white">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                    Year
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                    Student Name
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                    Branch
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                    Enrollment No
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                    GATE Score
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                    All India Rank
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.length > 0 ? (
                                filteredData.map((record, index) => (
                                    <motion.tr 
                                        key={record._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        viewport={{ once: true }}
                                        className={index % 2 === 0 ? 'bg-white hover:bg-indigo-50 transition' : 'bg-gray-50 hover:bg-indigo-50 transition'}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {record.metadata?.year || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">
                                            {record.studentName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {record.branch}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                            {record.enrollmentNo || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-700 font-bold">
                                            {record.metadata?.gateScore || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                                                AIR {record.metadata?.rank || '-'}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                        No GATE qualified students found.
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

export default DesignSeventeen;
