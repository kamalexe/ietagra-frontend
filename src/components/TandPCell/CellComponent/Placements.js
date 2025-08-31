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
        <div className="w-full px-8 py-12 min-h-screen">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                    🎓 Placement Statistics
                </h1>

                {/* Filters */}
                <div className="flex flex-col gap-6 mb-10 shadow-lg rounded-2xl p-6 border border-gray-100 dark:border-gray-700">

                    {/* Batch */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Batch
                        </label>
                        <select
                            value={batchFilter}
                            onChange={e => setBatchFilter(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 
      rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-900 text-gray-800 
      dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-900 text-gray-800 
      dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-900 text-gray-800 
      dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All</option>
                            {branchOptions.map((option, i) => (
                                <option key={i} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    {/* Button */}
                    <div>
                        <button
                            onClick={handleFilter}
                            className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md 
      hover:bg-blue-500 active:bg-blue-700 transition-all duration-200"
                        >
                            Apply
                        </button>
                    </div>

                </div>


                {/* Table */}
                <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-xl">
                    <table className="hidden md:table w-full text-left">
                        <thead className="text-sm text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-3">Batch</th>
                                <th className="px-6 py-3">Student</th>
                                <th className="px-6 py-3">Profile</th>
                                <th className="px-6 py-3">Company</th>
                                <th className="px-6 py-3">Branch</th>
                                <th className="px-6 py-3">Position</th>
                                <th
                                    className="px-6 py-3 cursor-pointer"
                                    onClick={() => handleSort("package")}
                                >
                                    Package (LPA){" "}
                                    {sortBy === "package" && sortOrder === "asc" && "▲"}
                                    {sortBy === "package" && sortOrder === "desc" && "▼"}
                                </th>
                                <th className="px-6 py-3">Offer Letter</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPlacements.map((placement, i) => (
                                <tr
                                    key={i}
                                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                                >
                                    <td className="px-6 py-4">{placement.fields.student_batch}</td>
                                    <td className="px-6 py-4">{placement.fields.student_name}</td>
                                    <td className="px-6 py-4">
                                        {placement.fields.profile_picture ? (
                                            <img
                                                src={placement.fields.profile_picture[0].url}
                                                alt="student"
                                                className="w-12 h-12 rounded-md"
                                            />
                                        ) : (
                                            <img
                                                src="./images/smile_emoji.jpg"
                                                alt="default"
                                                className="w-12 h-12 rounded-md"
                                            />
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{placement.fields.company_name}</td>
                                    <td className="px-6 py-4">{placement.fields.student_branch}</td>
                                    <td className="px-6 py-4">{placement.fields.position_offered}</td>
                                    <td className="px-6 py-4">{placement.fields.student_salary}</td>
                                    <td className="px-6 py-4">
                                        {placement.fields.offer_letter ? (
                                            <a
                                                href={placement.fields.offer_letter[0].url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 underline"
                                            >
                                                View
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">N/A</span>
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
                                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    {placement.fields.profile_picture ? (
                                        <img
                                            src={placement.fields.profile_picture[0].url}
                                            alt="student"
                                            className="w-12 h-12 rounded-md"
                                        />
                                    ) : (
                                        <img
                                            src="./images/smile_emoji.jpg"
                                            alt="default"
                                            className="w-12 h-12 rounded-md"
                                        />
                                    )}
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {placement.fields.student_name}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {placement.fields.student_batch} • {placement.fields.student_branch}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Company: {placement.fields.company_name}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Position: {placement.fields.position_offered}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Package: {placement.fields.student_salary} LPA
                                </p>
                                <div className="mt-2">
                                    {placement.fields.offer_letter ? (
                                        <a
                                            href={placement.fields.offer_letter[0].url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 underline"
                                        >
                                            Offer Letter
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">Offer Letter: N/A</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Placements;
