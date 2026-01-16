import React from 'react';
import { useState, useEffect } from 'react';

const Placements = () => {
    const [placements, setPlacements] = useState([]);
    const [batchFilter, setBatchFilter] = useState('');
    const [companyFilter, setCompanyFilter] = useState('');
    const [branchFilter, setBranchFilter] = useState('');
    const [filteredPlacements, setFilteredPlacements] = useState([]);
    const [sortBy, setSortBy] = useState(''); // 'package' or ''
    const [sortOrder, setSortOrder] = useState(''); // 'asc' or 'desc'


    useEffect(() => {
        fetch("https://project-iet-tnp-bk.vercel.app/api/placement/placement-list-approved/")
            .then(res => res.json())
            .then(
                (result) => {
                    setPlacements(result);
                    setFilteredPlacements(result);
                },
                (error) => {
                    console.log(error);
                }
            )
    }, [])


    const handleFilter = () => {
        const filteredData = placements.filter(placement => {
            return (
                (batchFilter === '' || placement.fields.student_batch === batchFilter) &&
                (companyFilter === '' || placement.fields.company_name === companyFilter) &&
                (branchFilter === '' || placement.fields.student_branch === branchFilter)
            );
        });
        setFilteredPlacements(filteredData);
    };

    const batchOptions = [...new Set(placements.map(placement => placement.fields.student_batch))];
    const companyOptions = [...new Set(placements.map(placement => placement.fields.company_name))];
    const branchOptions = [...new Set(placements.map(placement => placement.fields.student_branch))];


    const handleSort = (column) => {
        if (column === 'package') {
            if (sortBy === 'package') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            } else {
                setSortBy('package');
                setSortOrder('asc');
            }
        }
    };

    const sortedPlacements = [...filteredPlacements];


    if (sortBy === 'package') {
        sortedPlacements.sort((a, b) => {
            const aValue = parseFloat(a.fields.student_salary);
            const bValue = parseFloat(b.fields.student_salary);

            if (sortOrder === 'asc') {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        });
    }

    return (
        <div className="w-full">
            {/* Header */}
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
                🎓 Placement Statistics
            </h1>

            {/* Filters */}
            <div className="flex flex-col gap-6 mb-10 shadow-sm rounded-2xl p-6 border border-gray-100 dark:border-gray-700 bg-gray-50/50">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Batch */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Batch
                        </label>
                        <select
                            value={batchFilter}
                            onChange={e => setBatchFilter(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 
  rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 
  dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        >
                            <option value="">All</option>
                            {batchOptions.map((option, i) => (
                                <option key={i} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    {/* Company */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Company
                        </label>
                        <select
                            value={companyFilter}
                            onChange={e => setCompanyFilter(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 
  rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 
  dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        >
                            <option value="">All</option>
                            {companyOptions.map((option, i) => (
                                <option key={i} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    {/* Branch */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Branch
                        </label>
                        <select
                            value={branchFilter}
                            onChange={e => setBranchFilter(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 
  rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 
  dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        >
                            <option value="">All</option>
                            {branchOptions.map((option, i) => (
                                <option key={i} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    {/* Button */}
                    <div className="flex items-end">
                        <button
                            onClick={handleFilter}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg
  active:scale-95 transition-all duration-200 font-medium"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>

            </div>


            {/* Table */}
            <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100">
                <table className="hidden md:table w-full text-left">
                    <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 font-semibold">Batch</th>
                            <th className="px-6 py-3 font-semibold">Student</th>
                            <th className="px-6 py-3 font-semibold">Profile</th>
                            <th className="px-6 py-3 font-semibold">Company</th>
                            <th className="px-6 py-3 font-semibold">Branch</th>
                            <th className="px-6 py-3 font-semibold">Position</th>
                            <th
                                className="px-6 py-3 cursor-pointer hover:bg-gray-100 transition-colors select-none font-semibold text-blue-700"
                                onClick={() => handleSort("package")}
                            >
                                Package (LPA){" "}
                                {sortBy === "package" && sortOrder === "asc" && "▲"}
                                {sortBy === "package" && sortOrder === "desc" && "▼"}
                            </th>
                            <th className="px-6 py-3 font-semibold">Offer Letter</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sortedPlacements.map((placement, i) => (
                            <tr
                                key={i}
                                className="hover:bg-blue-50/50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <td className="px-6 py-4 font-medium text-gray-900">{placement.fields.student_batch}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{placement.fields.student_name}</td>
                                <td className="px-6 py-4">
                                    {placement.fields.profile_picture ? (
                                        <img
                                            src={placement.fields.profile_picture[0].url}
                                            alt="student"
                                            className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                                        />
                                    ) : (
                                        <img
                                            src="./images/smile_emoji.jpg"
                                            alt="default"
                                            className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                                        />
                                    )}
                                </td>
                                <td className="px-6 py-4 text-gray-600">{placement.fields.company_name}</td>
                                <td className="px-6 py-4 text-gray-600">{placement.fields.student_branch}</td>
                                <td className="px-6 py-4 text-gray-600">{placement.fields.position_offered}</td>
                                <td className="px-6 py-4 font-bold text-green-600">{placement.fields.student_salary}</td>
                                <td className="px-6 py-4">
                                    {placement.fields.offer_letter ? (
                                        <a
                                            href={placement.fields.offer_letter[0].url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                        >
                                            View
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 text-sm">N/A</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4 p-4">
                    {sortedPlacements.map((placement, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-4 mb-3 pb-3 border-b border-gray-50">
                                {placement.fields.profile_picture ? (
                                    <img
                                        src={placement.fields.profile_picture[0].url}
                                        alt="student"
                                        className="w-12 h-12 rounded-full object-cover border border-gray-100"
                                    />
                                ) : (
                                    <img
                                        src="./images/smile_emoji.jpg"
                                        alt="default"
                                        className="w-12 h-12 rounded-full object-cover border border-gray-100"
                                    />
                                )}
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white text-lg">
                                        {placement.fields.student_name}
                                    </p>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        {placement.fields.student_batch} • {placement.fields.student_branch}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Company:</span>
                                    <span className="font-medium text-gray-900">{placement.fields.company_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Position:</span>
                                    <span className="font-medium text-gray-900">{placement.fields.position_offered}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Package:</span>
                                    <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs">{placement.fields.student_salary} LPA</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-50 text-right">
                                {placement.fields.offer_letter ? (
                                    <a
                                        href={placement.fields.offer_letter[0].url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
                                    >
                                        View Offer Letter
                                    </a>
                                ) : (
                                    <span className="text-gray-400 text-xs italic">No Offer Letter</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Placements;
