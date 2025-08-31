import React, { useState, useEffect, useMemo } from 'react';

const Placements = () => {
    const [gateResults, setGateResults] = useState([]);
    const [batchFilter, setBatchFilter] = useState('');
    const [branchFilter, setBranchFilter] = useState('');
    const [filteredGateResults, setFilteredGateResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://project-iet-tnp-bk.vercel.app/api/gate/gate-list-approved/")
            .then(res => res.json())
            .then(
                (result) => {
                    setGateResults(result);
                    setFilteredGateResults(result);
                    setLoading(false);
                },
                (error) => {
                    console.log(error);
                    setLoading(false);
                }
            )
    }, [])

    const handleFilter = () => {
        const filteredData = gateResults.filter(gateResult => {
            return (
                (batchFilter === '' || gateResult.fields.student_batch === batchFilter) &&
                (branchFilter === '' || gateResult.fields.student_branch === branchFilter)
            );
        });
        setFilteredGateResults(filteredData);
    };

    const batchOptions = useMemo(() => [...new Set(gateResults.map(c => c.fields.student_batch))].sort(), [gateResults]);
    const branchOptions = useMemo(() => [...new Set(gateResults.map(c => c.fields.student_branch))].sort(), [gateResults]);

    if (loading) {
        return <div className="text-center py-10 text-gray-500 dark:text-gray-300">Loading placements...</div>;
    }

    return (
        <div className="w-full px-8 py-12 min-h-screen bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                    🎓 Gate Qualified Statistics
                </h1>

                {/* Filters */}
                <div className="flex flex-col gap-6 mb-10 shadow-lg rounded-2xl p-6 border border-gray-100 dark:border-gray-700">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Batch */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Batch
                            </label>
                            <select
                                value={batchFilter}
                                onChange={e => setBatchFilter(e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-600 
                                rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200
                                focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All</option>
                                {batchOptions.map((option, i) => (
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
                                rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200
                                focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All</option>
                                {branchOptions.map((option, i) => (
                                    <option key={i} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        {/* Apply Button */}
                        <div className="flex items-end">
                            <button
                                onClick={handleFilter}
                                className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md 
                                hover:bg-blue-500 active:bg-blue-700 transition-all duration-200"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-xl">
                    <table className="hidden md:table w-full text-left">
                        <thead className="text-sm text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-3">Batch</th>
                                <th className="px-6 py-3">Student Name</th>
                                <th className="px-6 py-3">Profile Picture</th>
                                <th className="px-6 py-3">Registration No.</th>
                                <th className="px-6 py-3">Branch</th>
                                <th className="px-6 py-3">Rank</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGateResults.map((gateResult, i) => (
                                <tr key={i} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                                    <td className="px-6 py-4">{gateResult.fields.student_batch}</td>
                                    <td className="px-6 py-4">{gateResult.fields.student_name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {gateResult.fields.profile_picture && gateResult.fields.profile_picture[0]?.url ? (
                                                <img
                                                    src={gateResult.fields.profile_picture[0].url}
                                                    alt="student_image"
                                                    className="w-12 h-12 rounded-md mr-4"
                                                />
                                            ) : (
                                                <img
                                                    src="./images/smile_emoji.jpg"
                                                    alt="student_image"
                                                    className="w-12 h-12 rounded-md mr-4"
                                                />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{gateResult.fields.registration_no}</td>
                                    <td className="px-6 py-4">{gateResult.fields.student_branch}</td>
                                    <td className="px-6 py-4">{gateResult.fields.rank}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4 p-4">
                        {filteredGateResults.map((gateResult, i) => (
                            <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-gray-900 dark:text-white">{gateResult.fields.student_name}</p>
                                    <span className="text-sm text-gray-600 dark:text-gray-300">{gateResult.fields.rank}</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{gateResult.fields.student_batch} • {gateResult.fields.student_branch}</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">Reg. No: {gateResult.fields.registration_no}</p>
                                <div className="mt-2">
                                    <img
                                        src={gateResult.fields.profile_picture && gateResult.fields.profile_picture[0]?.url ? gateResult.fields.profile_picture[0].url : "./images/smile_emoji.jpg"}
                                        alt="student_image"
                                        className="w-16 h-16 rounded-md"
                                    />
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
