import React, { useState, useEffect, useMemo } from 'react';

const GateQualified = () => {
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
        <div className="w-full">
            {/* Header */}
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
                🎓 Gate Qualified Statistics
            </h1>

            {/* Filters */}
            <div className="flex flex-col gap-6 mb-10 shadow-sm rounded-2xl p-6 border border-gray-100 dark:border-gray-700 bg-gray-50/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Batch */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Batch
                        </label>
                        <select
                            value={batchFilter}
                            onChange={e => setBatchFilter(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 
                            rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200
                            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
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
                            rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200
                            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
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
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg shadow-md 
                            hover:shadow-lg active:scale-95 transition-all duration-200 font-medium"
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
                            <th className="px-6 py-3 font-semibold">Student Name</th>
                            <th className="px-6 py-3 font-semibold">Profile Picture</th>
                            <th className="px-6 py-3 font-semibold">Registration No.</th>
                            <th className="px-6 py-3 font-semibold">Branch</th>
                            <th className="px-6 py-3 font-semibold">Rank</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredGateResults.map((gateResult, i) => (
                            <tr key={i} className="hover:bg-blue-50/50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{gateResult.fields.student_batch}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{gateResult.fields.student_name}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        {gateResult.fields.profile_picture && gateResult.fields.profile_picture[0]?.url ? (
                                            <img
                                                src={gateResult.fields.profile_picture[0].url}
                                                alt="student_image"
                                                className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                                            />
                                        ) : (
                                            <img
                                                src="./images/smile_emoji.jpg"
                                                alt="student_image"
                                                className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                                            />
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{gateResult.fields.registration_no}</td>
                                <td className="px-6 py-4 text-gray-600">{gateResult.fields.student_branch}</td>
                                <td className="px-6 py-4 font-bold text-blue-600">#{gateResult.fields.rank}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4 p-4">
                    {filteredGateResults.map((gateResult, i) => (
                        <div key={i} className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-bold text-gray-900 dark:text-white">{gateResult.fields.student_name}</p>
                                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">Rank #{gateResult.fields.rank}</span>
                            </div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">{gateResult.fields.student_batch} • {gateResult.fields.student_branch}</p>

                            <div className="flex items-center gap-4">
                                <img
                                    src={gateResult.fields.profile_picture && gateResult.fields.profile_picture[0]?.url ? gateResult.fields.profile_picture[0].url : "./images/smile_emoji.jpg"}
                                    alt="student_image"
                                    className="w-12 h-12 rounded-full object-cover border border-gray-100"
                                />
                                <div className="text-sm">
                                    <p className="text-gray-500">Reg No:</p>
                                    <p className="font-mono text-gray-700">{gateResult.fields.registration_no}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );

};

export default GateQualified;
