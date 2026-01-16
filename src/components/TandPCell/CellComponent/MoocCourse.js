import React, { useState, useEffect, useMemo } from 'react';

const MoocCourse = () => {
    const [courses, setCourses] = useState([]);
    const [batchFilter, setBatchFilter] = useState('');
    const [platformFilter, setPlatformFilter] = useState('');
    const [branchFilter, setBranchFilter] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://project-iet-tnp-bk.vercel.app/api/course/course-list-approved/")
            .then(res => res.json())
            .then(
                (result) => {
                    setCourses(result);
                    setFilteredCourses(result);
                    setLoading(false);
                },
                (error) => {
                    console.log(error);
                    setLoading(false);
                }
            )
    }, [])

    const handleFilter = () => {
        const filteredData = courses.filter(course => {
            return (
                (batchFilter === '' || course.fields.student_batch === batchFilter) &&
                (platformFilter === '' || course.fields.course_platform === platformFilter) &&
                (branchFilter === '' || course.fields.student_branch === branchFilter)
            );
        });
        setFilteredCourses(filteredData);
    };

    const batchOptions = useMemo(() => [...new Set(courses.map(c => c.fields.student_batch))].sort(), [courses]);
    const platformOptions = useMemo(() => [...new Set(courses.map(c => c.fields.course_platform))].sort(), [courses]);
    const branchOptions = useMemo(() => [...new Set(courses.map(c => c.fields.student_branch))].sort(), [courses]);

    if (loading) {
        return <div className="text-center py-10 text-gray-500 dark:text-gray-300">Loading courses...</div>;
    }

    return (
        <div className="w-full">
            {/* Header */}
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
                📚 MOOC Courses
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
                            rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200
                            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        >
                            <option value="">All</option>
                            {batchOptions.map((option, i) => (
                                <option key={i} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    {/* Platform */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Platform
                        </label>
                        <select
                            value={platformFilter}
                            onChange={e => setPlatformFilter(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 
                            rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200
                            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        >
                            <option value="">All</option>
                            {platformOptions.map((option, i) => (
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
                            <th className="px-6 py-3 font-semibold">Branch</th>
                            <th className="px-6 py-3 font-semibold">Platform</th>
                            <th className="px-6 py-3 font-semibold">Course Name</th>
                            <th className="px-6 py-3 font-semibold">Certificate</th>
                            <th className="px-6 py-3 font-semibold">Duration</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredCourses.map((course, i) => (
                            <tr key={i} className="hover:bg-blue-50/50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{course.fields.student_batch}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{course.fields.student_name}</td>
                                <td className="px-6 py-4 text-gray-600">{course.fields.student_branch}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium border border-gray-200">
                                        {course.fields.course_platform}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{course.fields.course_name}</td>
                                <td className="px-6 py-4">
                                    <a href={course.fields.course_certificate} target="_blank" rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center gap-1">
                                        View
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </a>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{course.fields.course_duration}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4 p-4">
                    {filteredCourses.map((course, i) => (
                        <div key={i} className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-600">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{course.fields.student_name}</p>
                                    <p className="text-xs text-gray-500 uppercase">{course.fields.student_batch} • {course.fields.student_branch}</p>
                                </div>
                                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded">{course.fields.course_platform}</span>
                            </div>

                            <p className="text-sm text-gray-800 dark:text-gray-200 mt-2 font-medium">{course.fields.course_name}</p>
                            <p className="text-sm text-gray-500">Duration: {course.fields.course_duration}</p>

                            <div className="mt-4 pt-3 border-t border-gray-50 text-right">
                                <a href={course.fields.course_certificate} target="_blank" rel="noopener noreferrer"
                                    className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1">
                                    Certificate ↗
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );


};

export default MoocCourse;
